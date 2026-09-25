import { NextResponse } from "next/server";
import { db } from "@/db";
import { isNeonConfigured, getNeonSql } from "@/lib/neon";
import { denyUnlessStaff } from "@/lib/staffAuth";

export async function GET() {
  const denied = await denyUnlessStaff(["admin"]);
  if (denied) return denied;

  try {
    if (isNeonConfigured()) {
      const sql = getNeonSql();
      if (sql) {
        const rows = await sql`
          SELECT id, invoice_number as "invoiceNumber", client_id as "clientId", client_name as "clientName", amount, status, due_date as "dueDate", paid_at as "paidAt", created_at as "createdAt"
          FROM invoices
          ORDER BY created_at DESC;
        `;
        return NextResponse.json({ ok: true, source: "neon", data: rows });
      }
    }
    return NextResponse.json({ ok: true, source: "local", data: db.getInvoices() });
  } catch (error: any) {
    console.error("GET /api/invoices error:", error);
    return NextResponse.json({ ok: true, source: "local_fallback", data: db.getInvoices() });
  }
}

export async function POST(request: Request) {
  const denied = await denyUnlessStaff(["admin"]);
  if (denied) return denied;

  try {
    const body = await request.json();
    const { invoiceNumber, clientId, clientName, company, amount, status, dueDate } = body;

    if (!invoiceNumber || !clientName || !amount) {
      return NextResponse.json({ ok: false, error: "Missing required fields" }, { status: 400 });
    }

    const newInvoice = db.addInvoice({
      invoiceNumber,
      clientId: clientId || "cli-1",
      clientName,
      company: company || clientName,
      amount: Number(amount),
      status: status || "Pending",
      dueDate: dueDate || new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
    });

    if (isNeonConfigured()) {
      try {
        const sql = getNeonSql();
        if (sql) {
          await sql`
            INSERT INTO invoices (id, invoice_number, client_id, client_name, amount, status, due_date)
            VALUES (${newInvoice.id}, ${newInvoice.invoiceNumber}, ${newInvoice.clientId}, ${newInvoice.clientName}, ${newInvoice.amount}, ${newInvoice.status}, ${newInvoice.dueDate})
            ON CONFLICT (id) DO NOTHING;
          `;
        }
      } catch (neonErr) {
        console.warn("Neon invoice insert error (non-fatal):", neonErr);
      }
    }

    return NextResponse.json({ ok: true, data: newInvoice });
  } catch (error: any) {
    console.error("POST /api/invoices error:", error);
    return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  }
}
