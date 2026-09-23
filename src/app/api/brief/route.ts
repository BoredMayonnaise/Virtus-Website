import { NextResponse } from "next/server";
import { db } from "@/db";
import { calculateAgencyQuote } from "@/lib/quotationEngine";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, company, message, selections } = body;

    if (!name || !email) {
      return NextResponse.json(
        { ok: false, error: "Name and email are required" },
        { status: 400 }
      );
    }

    // Compute server-verified quote
    const computedQuote = calculateAgencyQuote({
      needs: selections?.need,
      state: selections?.state?.[0],
      feel: selections?.feel,
      when: selections?.when?.[0],
      budget: selections?.budget?.[0],
    });

    // Ingest into GHL-style Opportunities pipeline
    const newOpportunity = db.addOpportunity({
      name,
      company: company || `${name}'s Project`,
      email,
      stage: "new_inquiry",
      dealValue: Math.round((computedQuote.minPrice + computedQuote.maxPrice) / 2),
      recommendedTier: computedQuote.recommendedTier,
      needs: selections?.need || ["Brand & Creative"],
      timeline: selections?.when?.[0] || "Flexible",
      budgetBracket: selections?.budget?.[0] || "Not sure yet",
      message: message || undefined,
      deliverables: computedQuote.deliverables,
    });

    // If Neon PostgreSQL is configured, persist to Cloud SQL
    try {
      const { isNeonConfigured, getNeonSql } = await import("@/lib/neon");
      if (isNeonConfigured()) {
        const sql = getNeonSql();
        if (sql) {
          await sql`
            INSERT INTO opportunities (id, name, company, email, stage, deal_value, recommended_tier, needs, timeline)
            VALUES (
              ${newOpportunity.id},
              ${newOpportunity.name},
              ${newOpportunity.company},
              ${newOpportunity.email},
              ${newOpportunity.stage},
              ${newOpportunity.dealValue},
              ${newOpportunity.recommendedTier},
              ${JSON.stringify(newOpportunity.needs)},
              ${newOpportunity.timeline}
            )
            ON CONFLICT (id) DO NOTHING;
          `;
        }
      }
    } catch (neonErr) {
      console.warn("Neon persistence note (non-fatal):", neonErr);
    }

    return NextResponse.json({
      ok: true,
      opportunityId: newOpportunity.id,
      quote: computedQuote,
    });
  } catch (error) {
    console.error("API /api/brief error:", error);
    return NextResponse.json(
      { ok: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
