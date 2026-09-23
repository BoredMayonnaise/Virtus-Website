import { NextResponse } from "next/server";
import { isNeonConfigured, getNeonSql, initNeonSchema } from "@/lib/neon";

export async function GET() {
  const configured = isNeonConfigured();

  if (!configured) {
    return NextResponse.json({
      configured: false,
      mode: "local_fallback",
      provider: "In-Memory / Local Storage Bridge",
      status: "Ready",
      message: "DATABASE_URL is not set in .env.local. The agency OS is running safely in local fallback mode.",
      latencyMs: 0,
    });
  }

  const sql = getNeonSql();
  if (!sql) {
    return NextResponse.json({
      configured: false,
      mode: "local_fallback",
      message: "Invalid PostgreSQL connection string.",
    }, { status: 400 });
  }

  try {
    const startTime = Date.now();
    const result = await sql`SELECT NOW() as current_time, current_database() as db_name, version() as pg_version`;
    const latencyMs = Date.now() - startTime;

    return NextResponse.json({
      configured: true,
      mode: "neon_cloud",
      provider: "Neon Serverless PostgreSQL",
      status: "Connected & Active",
      database: result[0]?.db_name,
      latencyMs,
      timestamp: result[0]?.current_time,
      pgVersion: result[0]?.pg_version?.split(" ")[0],
    });
  } catch (error: any) {
    return NextResponse.json({
      configured: true,
      mode: "connection_error",
      provider: "Neon Serverless PostgreSQL",
      status: "Error",
      message: error?.message || "Failed to connect to Neon PostgreSQL.",
    }, { status: 500 });
  }
}

export async function POST() {
  const result = await initNeonSchema();
  return NextResponse.json(result);
}
