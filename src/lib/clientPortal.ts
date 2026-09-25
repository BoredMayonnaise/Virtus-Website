import { db } from "@/db";
import type { ApprovalStatus, Client, RevisionTicket } from "@/db";
import { isNeonConfigured, getNeonSql } from "@/lib/neon";
import { PORTAL_TOKEN_PATTERN, hashToken, issuePortalToken, type IssuedToken } from "@/lib/tokens";

const DEMO_CLIENT_IDS = new Set(["cli-1", "cli-2"]);

export interface PortalClient {
  id: string;
  name: string;
  company: string;
  /** Token version: prefix of the token hash, stored in the session so regenerating the token ends old sessions. */
  tv: string;
}

const TV_LENGTH = 16;

export interface PortalProject {
  title: string;
  phase: "Discover" | "Design" | "Build" | "Deliver" | "Support";
  progress: number;
  riskLevel: string;
  budget: number;
  startDate: string;
  targetDate: string;
}

export interface PortalInvoice {
  id: string;
  invoiceNumber: string;
  amount: number;
  status: string;
  dueDate: string;
  paidAt?: string;
}

export interface PortalDeliverable {
  id: string;
  title: string;
  filename: string;
  fileType: string;
  fileSize: string;
  category: string;
  url: string;
  createdAt: string;
}

export interface PortalBooking {
  id: string;
  bookingType: string;
  date: string;
  time: string;
  host: string;
  meetingUrl: string;
  status: string;
  notes?: string;
}

export interface ClientPortalData {
  client: { name: string; contactName: string; company: string; email: string };
  project: PortalProject | null;
  invoices: PortalInvoice[];
  deliverables: PortalDeliverable[];
  bookings: PortalBooking[];
  revisions: RevisionTicket[];
  approval: ApprovalStatus;
}

interface TokenState {
  id: string;
  expiresAt: unknown;
  revokedAt: unknown;
}

const iso = (value: unknown): string | undefined => {
  if (!value) return undefined;
  const d = new Date(value as string);
  return Number.isNaN(d.getTime()) ? undefined : d.toISOString();
};
const day = (value: unknown): string => iso(value)?.slice(0, 10) ?? "";

function tokenUsable({ id, expiresAt, revokedAt }: TokenState): boolean {
  // Seeded demo accounts must never be reachable in production.
  if (DEMO_CLIENT_IDS.has(id) && process.env.NODE_ENV === "production" && process.env.ALLOW_DEMO_ACCESS !== "true") {
    return false;
  }
  if (revokedAt) return false;
  const expiry = iso(expiresAt);
  return Boolean(expiry) && new Date(expiry as string).getTime() > Date.now();
}

/** Resolves an access token to an active client, or null. Never distinguishes why it failed. */
export async function findClientByToken(token: string | undefined | null): Promise<PortalClient | null> {
  if (!token || !PORTAL_TOKEN_PATTERN.test(token)) return null;
  const hash = await hashToken(token);

  if (isNeonConfigured()) {
    try {
      const sql = getNeonSql();
      if (sql) {
        const rows = await sql`
          SELECT id, name, company, portal_token_expires_at as "expiresAt", portal_token_revoked_at as "revokedAt"
          FROM clients WHERE portal_token_hash = ${hash} LIMIT 1;
        `;
        if (rows[0]) {
          return tokenUsable(rows[0] as TokenState)
            ? { id: rows[0].id, name: rows[0].name, company: rows[0].company, tv: hash.slice(0, TV_LENGTH) }
            : null;
        }
      }
    } catch (err) {
      console.warn("Neon token lookup failed, using local store:", err);
    }
  }

  const client = db.getClientByTokenHash(hash);
  if (!client) return null;
  return tokenUsable({ id: client.id, expiresAt: client.portalTokenExpiresAt, revokedAt: client.portalTokenRevokedAt })
    ? { id: client.id, name: client.name, company: client.company, tv: hash.slice(0, TV_LENGTH) }
    : null;
}

/** Re-checks on every authenticated request so revoking or regenerating a token ends live sessions. */
export async function isClientActive(clientId: string, tv: string | undefined): Promise<boolean> {
  if (!tv) return false;
  if (isNeonConfigured()) {
    try {
      const sql = getNeonSql();
      if (sql) {
        const rows = await sql`
          SELECT id, portal_token_hash as "hash", portal_token_expires_at as "expiresAt", portal_token_revoked_at as "revokedAt"
          FROM clients WHERE id = ${clientId} LIMIT 1;
        `;
        if (rows[0]) return String(rows[0].hash ?? "").startsWith(tv) && tokenUsable(rows[0] as TokenState);
      }
    } catch (err) {
      console.warn("Neon client status lookup failed, using local store:", err);
    }
  }
  const client = db.getClientById(clientId);
  return Boolean(
    client &&
      client.portalTokenHash?.startsWith(tv) &&
      tokenUsable({ id: client.id, expiresAt: client.portalTokenExpiresAt, revokedAt: client.portalTokenRevokedAt })
  );
}

function localData(client: Client): ClientPortalData {
  const project = db.getProjects().find((p) => p.clientId === client.id) ?? null;
  const email = client.email.toLowerCase();
  return {
    client: {
      name: client.name,
      contactName: client.contactName || client.name,
      company: client.company,
      email: client.email,
    },
    project: project
      ? {
          title: project.title,
          phase: project.phase,
          progress: project.progress,
          riskLevel: project.riskLevel,
          budget: project.budget,
          startDate: project.startDate,
          targetDate: project.targetDate,
        }
      : null,
    invoices: db
      .getInvoices()
      .filter((i) => i.clientId === client.id)
      .map(({ id, invoiceNumber, amount, status, dueDate, paidAt }) => ({
        id,
        invoiceNumber,
        amount,
        status,
        dueDate,
        paidAt,
      })),
    deliverables: [],
    bookings: db
      .getBookings()
      .filter((b) => b.email.toLowerCase() === email)
      .map(({ id, bookingType, date, time, host, meetingUrl, status, notes }) => ({
        id,
        bookingType,
        date,
        time,
        host,
        meetingUrl,
        status,
        notes,
      })),
    revisions: db.getRevisions(client.id),
    approval: db.getApproval(client.id),
  };
}

function withDeliverables(data: ClientPortalData, clientId: string): ClientPortalData {
  data.deliverables = db.getMediaAssets(clientId).map((m) => ({
    id: m.id,
    title: m.title,
    filename: m.filename,
    fileType: m.fileType,
    fileSize: m.fileSize,
    category: m.category,
    url: m.url,
    createdAt: m.createdAt,
  }));
  return data;
}

/** Everything the client dashboard shows, scoped to one client. Never includes other clients or internal data. */
export async function getClientPortalData(clientId: string): Promise<ClientPortalData | null> {
  if (isNeonConfigured()) {
    try {
      const sql = getNeonSql();
      if (sql) {
        const clients = await sql`
          SELECT id, name, contact_name as "contactName", company, email FROM clients WHERE id = ${clientId} LIMIT 1;
        `;
        if (clients[0]) {
          const c = clients[0];
          const [projects, invoices, bookings, revisions, approvals] = await Promise.all([
            sql`SELECT title, phase, progress, risk_level as "riskLevel", budget, start_date as "startDate", target_date as "targetDate"
                FROM projects WHERE client_id = ${clientId} ORDER BY created_at ASC LIMIT 1;`,
            sql`SELECT id, invoice_number as "invoiceNumber", amount, status, due_date as "dueDate", paid_at as "paidAt"
                FROM invoices WHERE client_id = ${clientId} ORDER BY created_at DESC;`,
            sql`SELECT id, booking_type as "bookingType", date, time, host, meeting_url as "meetingUrl", status, notes
                FROM bookings WHERE lower(email) = ${String(c.email).toLowerCase()} ORDER BY date DESC;`,
            sql`SELECT id, client_id as "clientId", round, categories, target_area as "targetArea", priority, details,
                       reference_url as "referenceUrl", attachments, submitted_by as "submittedBy",
                       submitted_email as "submittedEmail", created_at as "submittedAt"
                FROM client_revisions WHERE client_id = ${clientId} ORDER BY round DESC;`,
            sql`SELECT status FROM client_approvals WHERE client_id = ${clientId} LIMIT 1;`,
          ]);
          const p = projects[0];
          return withDeliverables(
            {
              client: {
                name: c.name,
                contactName: c.contactName || c.name,
                company: c.company,
                email: c.email,
              },
              project: p
                ? {
                    title: p.title,
                    phase: p.phase,
                    progress: Number(p.progress),
                    riskLevel: p.riskLevel,
                    budget: Number(p.budget),
                    startDate: day(p.startDate),
                    targetDate: day(p.targetDate),
                  }
                : null,
              invoices: invoices.map((i) => ({
                id: i.id,
                invoiceNumber: i.invoiceNumber,
                amount: Number(i.amount),
                status: i.status,
                dueDate: day(i.dueDate),
                paidAt: iso(i.paidAt),
              })),
              deliverables: [],
              bookings: bookings.map((b) => ({
                id: b.id,
                bookingType: b.bookingType,
                date: day(b.date),
                time: b.time,
                host: b.host,
                meetingUrl: b.meetingUrl,
                status: b.status,
                notes: b.notes ?? undefined,
              })),
              revisions: revisions.map((r) => ({
                ...(r as unknown as RevisionTicket),
                submittedAt: iso(r.submittedAt) ?? "",
              })),
              approval: (approvals[0]?.status as ApprovalStatus) ?? "pending",
            },
            clientId
          );
        }
      }
    } catch (err) {
      console.warn("Neon client portal lookup failed, using local store:", err);
    }
  }

  const client = db.getClientById(clientId);
  return client ? withDeliverables(localData(client), clientId) : null;
}

/** Persists a revision request (local store plus Neon when configured). */
export async function saveRevision(
  input: Omit<RevisionTicket, "id" | "round" | "submittedAt">
): Promise<RevisionTicket> {
  const ticket = db.addRevision(input);
  if (isNeonConfigured()) {
    try {
      const sql = getNeonSql();
      if (sql) {
        await sql`
          INSERT INTO client_revisions (id, client_id, round, categories, target_area, priority, details, reference_url, attachments, submitted_by, submitted_email)
          VALUES (${ticket.id}, ${ticket.clientId}, ${ticket.round}, ${JSON.stringify(ticket.categories)}::jsonb, ${ticket.targetArea}, ${ticket.priority}, ${ticket.details}, ${ticket.referenceUrl}, ${JSON.stringify(ticket.attachments)}::jsonb, ${ticket.submittedBy}, ${ticket.submittedEmail})
          ON CONFLICT (id) DO NOTHING;
        `;
        await sql`
          INSERT INTO client_approvals (client_id, status, updated_at) VALUES (${ticket.clientId}, 'changes_requested', NOW())
          ON CONFLICT (client_id) DO UPDATE SET status = 'changes_requested', updated_at = NOW();
        `;
      }
    } catch (err) {
      console.warn("Neon revision insert error (non-fatal):", err);
    }
  }
  return ticket;
}

export async function saveApproval(clientId: string, status: ApprovalStatus): Promise<ApprovalStatus> {
  db.setApproval(clientId, status);
  if (isNeonConfigured()) {
    try {
      const sql = getNeonSql();
      if (sql) {
        await sql`
          INSERT INTO client_approvals (client_id, status, updated_at) VALUES (${clientId}, ${status}, NOW())
          ON CONFLICT (client_id) DO UPDATE SET status = ${status}, updated_at = NOW();
        `;
      }
    } catch (err) {
      console.warn("Neon approval upsert error (non-fatal):", err);
    }
  }
  return status;
}

/** Issues a new token for a client. The previous token stops working immediately. Returns plaintext once. */
export async function regenerateClientToken(clientId: string): Promise<IssuedToken | null> {
  if (!db.getClientById(clientId) && !isNeonConfigured()) return null;
  const issued = await issuePortalToken();
  const local = db.setClientToken(clientId, { hash: issued.hash, last4: issued.last4, expiresAt: issued.expiresAt });

  let updated = Boolean(local);
  if (isNeonConfigured()) {
    try {
      const sql = getNeonSql();
      if (sql) {
        const rows = await sql`
          UPDATE clients
          SET portal_token_hash = ${issued.hash}, portal_token_last4 = ${issued.last4},
              portal_token_expires_at = ${issued.expiresAt}, portal_token_revoked_at = NULL
          WHERE id = ${clientId} RETURNING id;
        `;
        updated = updated || rows.length > 0;
      }
    } catch (err) {
      console.warn("Neon token update error (non-fatal):", err);
    }
  }
  return updated ? issued : null;
}
