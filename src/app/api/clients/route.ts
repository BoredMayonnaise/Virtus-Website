import { NextResponse } from "next/server";
import { db, toClientSummary } from "@/db";
import { issuePortalToken } from "@/lib/tokens";
import { isNeonConfigured, getNeonSql } from "@/lib/neon";
import { denyUnlessStaff } from "@/lib/staffAuth";

export async function GET() {
  const denied = await denyUnlessStaff(["admin"]);
  if (denied) return denied;

  try {
    if (isNeonConfigured()) {
      const sql = getNeonSql();
      if (sql) {
        const rows = await sql`
          SELECT id, name, company, email, status, total_revenue as "totalRevenue", active_projects_count as "activeProjectsCount", portal_token_last4 as "portalTokenLast4", portal_token_expires_at as "portalTokenExpiresAt", portal_token_revoked_at as "portalTokenRevokedAt", created_at as "createdAt"
          FROM clients
          ORDER BY created_at DESC;
        `;
        return NextResponse.json({ ok: true, source: "neon", data: rows });
      }
    }
    return NextResponse.json({ ok: true, source: "local", data: db.getClients().map(toClientSummary) });
  } catch (error: any) {
    console.error("GET /api/clients error:", error);
    return NextResponse.json({ ok: true, source: "local_fallback", data: db.getClients().map(toClientSummary) });
  }
}

export async function POST(request: Request) {
  const denied = await denyUnlessStaff(["admin"]);
  if (denied) return denied;

  try {
    const body = await request.json();
    const { name, contactName, company, email, status } = body;

    if (!name || !company || !email) {
      return NextResponse.json({ ok: false, error: "Missing required fields" }, { status: 400 });
    }

    const issued = await issuePortalToken();
    const newClient = db.addClient({
      name,
      contactName: contactName || name,
      company,
      email,
      status: status || "Active",
      portalTokenHash: issued.hash,
      portalTokenLast4: issued.last4,
      portalTokenExpiresAt: issued.expiresAt,
    });

    if (isNeonConfigured()) {
      try {
        const sql = getNeonSql();
        if (sql) {
          await sql`
            INSERT INTO clients (id, name, contact_name, company, email, status, total_revenue, active_projects_count, portal_token_hash, portal_token_last4, portal_token_expires_at)
            VALUES (${newClient.id}, ${newClient.name}, ${newClient.contactName ?? newClient.name}, ${newClient.company}, ${newClient.email}, ${newClient.status}, 0, 0, ${issued.hash}, ${issued.last4}, ${issued.expiresAt})
            ON CONFLICT (id) DO NOTHING;
          `;
        }
      } catch (neonErr) {
        console.warn("Neon client insert error (non-fatal):", neonErr);
      }
    }

    // The plaintext token is returned once and never stored.
    return NextResponse.json({ ok: true, data: { ...toClientSummary(newClient), portalToken: issued.token } });
  } catch (error: any) {
    console.error("POST /api/clients error:", error);
    return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  }
}
