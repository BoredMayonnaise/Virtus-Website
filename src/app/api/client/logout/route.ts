import { NextResponse } from "next/server";
import { CLIENT_COOKIE } from "@/lib/session";

export async function POST() {
  const response = NextResponse.json({ ok: true });
  response.cookies.set(CLIENT_COOKIE, "", { httpOnly: true, path: "/", maxAge: 0 });
  return response;
}
