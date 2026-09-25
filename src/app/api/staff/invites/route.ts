import { NextResponse } from "next/server";
import { INVITE_TTL_MS, getStaff, hashSecret, isAllowedEmail, newSecretToken, normalizeEmail } from "@/lib/staffAuth";
import { StoreUnavailableError, addAudit, createInvite, listPendingInvites } from "@/lib/staffStore";

export const dynamic = "force-dynamic";

export async function GET() {
  const admin = await getStaff(["admin"]);
  if (!admin) return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  try {
    return NextResponse.json({ ok: true, data: await listPendingInvites() });
  } catch (err) {
    if (err instanceof StoreUnavailableError) return NextResponse.json({ ok: false, error: err.message }, { status: 503 });
    throw err;
  }
}

// Creates a single-use invite. The plaintext token is returned once and stored only as a hash.
export async function POST(request: Request) {
  const admin = await getStaff(["admin"]);
  if (!admin) return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });

  let body: { email?: unknown; role?: unknown };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid request." }, { status: 400 });
  }

  const role = body.role === "admin" ? "admin" : body.role === "team" ? "team" : null;
  if (!role) return NextResponse.json({ ok: false, error: "Choose a role." }, { status: 400 });

  let email: string | null = null;
  if (typeof body.email === "string" && body.email.trim()) {
    email = normalizeEmail(body.email);
    if (!email || !isAllowedEmail(email)) {
      return NextResponse.json({ ok: false, error: "Enter a valid Gmail address." }, { status: 400 });
    }
  }

  try {
    const token = newSecretToken("stfinv");
    const expiresAt = new Date(Date.now() + INVITE_TTL_MS).toISOString();
    await createInvite({ tokenHash: await hashSecret(token), email, role, createdBy: admin.id, expiresAt });
    await addAudit(admin.email, "invite_created", `${email ?? "any email"} (${role})`);
    return NextResponse.json({ ok: true, data: { token, email, role, expiresAt } });
  } catch (err) {
    if (err instanceof StoreUnavailableError) return NextResponse.json({ ok: false, error: err.message }, { status: 503 });
    throw err;
  }
}
