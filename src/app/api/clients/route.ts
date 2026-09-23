import { NextResponse } from "next/server";
import { db } from "@/db";
import { isNeonConfigured, getNeonSql } from "@/lib/neon";

export async function GET() {
  try {
    if (isNeonConfigured()) {
      const sql = getNeonSql();
      if (sql) {
        const rows = await sql`
          SELECT id, name, company, email, status, total_revenue as "totalRevenue", active_projects_count as "activeProjectsCount", created_at as "createdAt"
          FROM clients
          ORDER BY created_at DESC;
        `;
        return NextResponse.json({ ok: true, source: "neon", data: rows });
      }
    }
    return NextResponse.json({ ok: true, source: "local", data: db.getClients() });
  } catch (error: any) {
    console.error("GET /api/clients error:", error);
    return NextResponse.json({ ok: true, source: "local_fallback", data: db.getClients() });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, company, email, status } = body;

    if (!name || !company || !email) {
      return NextResponse.json({ ok: false, error: "Missing required fields" }, { status: 400 });
    }

    const newClient = db.addClient({
      name,
      company,
      email,
      status: status || "Active",
    });

    if (isNeonConfigured()) {
      try {
        const sql = getNeonSql();
        if (sql) {
          await sql`
            INSERT INTO clients (id, name, company, email, status, total_revenue, active_projects_count)
            VALUES (${newClient.id}, ${newClient.name}, ${newClient.company}, ${newClient.email}, ${newClient.status}, 0, 0)
            ON CONFLICT (id) DO NOTHING;
          `;
        }
      } catch (neonErr) {
        console.warn("Neon client insert error (non-fatal):", neonErr);
      }
    }

    return NextResponse.json({ ok: true, data: newClient });
  } catch (error: any) {
    console.error("POST /api/clients error:", error);
    return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  }
}
