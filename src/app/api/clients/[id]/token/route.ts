import { NextResponse } from "next/server";
import { regenerateClientToken } from "@/lib/clientPortal";
import { denyUnlessStaff } from "@/lib/staffAuth";

export const dynamic = "force-dynamic";

// Staff only (enforced in middleware). Returns the plaintext token exactly once.
export async function POST(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const denied = await denyUnlessStaff(["admin"]);
  if (denied) return denied;

  const { id } = await params;
  const issued = await regenerateClientToken(id);
  if (!issued) return NextResponse.json({ ok: false, error: "Client not found" }, { status: 404 });
  return NextResponse.json({
    ok: true,
    data: { token: issued.token, last4: issued.last4, expiresAt: issued.expiresAt },
  });
}
