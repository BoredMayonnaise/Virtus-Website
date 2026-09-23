import { NextResponse } from "next/server";
import { isNeonConfigured, getNeonSql } from "@/lib/neon";

export const dynamic = "force-dynamic";

export async function GET() {
  const startTime = Date.now();
  let neonStatus: {
    status: string;
    latencyMs?: number;
    error?: string;
  } = { status: "not_configured" };

  if (isNeonConfigured()) {
    try {
      const sql = getNeonSql();
      if (sql) {
        const pingStart = Date.now();
        await sql`SELECT 1 as ping`;
        neonStatus = {
          status: "connected",
          latencyMs: Date.now() - pingStart,
        };
      }
    } catch (err: any) {
      neonStatus = {
        status: "error",
        error: err.message,
      };
    }
  } else {
    neonStatus = {
      status: "fallback_local",
    };
  }

  const memory = process.memoryUsage();

  return NextResponse.json(
    {
      status: neonStatus.status === "error" ? "degraded" : "healthy",
      service: "virtus-agency-os",
      version: "0.1.0",
      timestamp: new Date().toISOString(),
      uptimeSeconds: Math.floor(process.uptime()),
      database: {
        provider: "Neon Serverless PostgreSQL (Singapore)",
        ...neonStatus,
      },
      system: {
        nodeVersion: process.version,
        environment: process.env.NODE_ENV,
        memoryUsageMb: {
          rss: Math.round(memory.rss / (1024 * 1024)),
          heapUsed: Math.round(memory.heapUsed / (1024 * 1024)),
          heapTotal: Math.round(memory.heapTotal / (1024 * 1024)),
        },
      },
      responseTimeMs: Date.now() - startTime,
    },
    { status: 200 }
  );
}
