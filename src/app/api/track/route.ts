import { NextResponse } from "next/server";
import { getTrackData } from "@/lib/track";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const token = new URL(request.url).searchParams.get("token") ?? undefined;
  const result = await getTrackData(token);

  if (!result.ok) {
    const status = result.reason === "invalid" ? 400 : 404;
    return NextResponse.json({ ok: false, error: "Invalid or unknown link" }, { status });
  }
  return NextResponse.json({ ok: true, data: result.data });
}
