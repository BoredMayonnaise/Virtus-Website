import { NextResponse } from "next/server";
import { getClientSessionId } from "@/lib/clientSession";
import { getClientPortalData } from "@/lib/clientPortal";

export const dynamic = "force-dynamic";

export async function GET() {
  const clientId = await getClientSessionId();
  if (!clientId) return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });

  const data = await getClientPortalData(clientId);
  if (!data) return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  return NextResponse.json({ ok: true, data });
}
