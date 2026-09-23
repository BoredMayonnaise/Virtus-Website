import { NextResponse } from "next/server";
import { db, Opportunity } from "@/db";
import { isNeonConfigured, getNeonSql } from "@/lib/neon";

export async function GET() {
  try {
    if (isNeonConfigured()) {
      const sql = getNeonSql();
      if (sql) {
        const rows = await sql`
          SELECT id, name, company, email, stage, deal_value as "dealValue", recommended_tier as "recommendedTier", needs, timeline, created_at as "createdAt"
          FROM opportunities
          ORDER BY created_at DESC;
        `;
        return NextResponse.json({ ok: true, source: "neon", data: rows });
      }
    }
    return NextResponse.json({ ok: true, source: "local", data: db.getOpportunities() });
  } catch (error: any) {
    console.error("GET /api/pipeline error:", error);
    return NextResponse.json({ ok: true, source: "local_fallback", data: db.getOpportunities() });
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const { id, stage } = body;

    if (!id || !stage) {
      return NextResponse.json({ ok: false, error: "Missing id or stage" }, { status: 400 });
    }

    const updated = db.updateOpportunityStage(id, stage as Opportunity["stage"]);

    if (isNeonConfigured()) {
      try {
        const sql = getNeonSql();
        if (sql && updated) {
          await sql`
            UPDATE opportunities
            SET stage = ${stage}
            WHERE id = ${id};
          `;
        }
      } catch (neonErr) {
        console.warn("Neon opportunity stage update error (non-fatal):", neonErr);
      }
    }

    return NextResponse.json({ ok: true, data: updated });
  } catch (error: any) {
    return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  }
}
