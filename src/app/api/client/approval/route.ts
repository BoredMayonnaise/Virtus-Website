import { NextResponse } from "next/server";
import { getClientSessionId } from "@/lib/clientSession";
import { saveApproval } from "@/lib/clientPortal";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const clientId = await getClientSessionId();
  if (!clientId) return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });

  let status: unknown;
  try {
    ({ status } = await request.json());
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid request" }, { status: 400 });
  }
  // Clients can approve or reset. "changes_requested" is only set by submitting a revision.
  if (status !== "approved" && status !== "pending") {
    return NextResponse.json({ ok: false, error: "Invalid status" }, { status: 400 });
  }
  return NextResponse.json({ ok: true, data: { approval: await saveApproval(clientId, status) } });
}
