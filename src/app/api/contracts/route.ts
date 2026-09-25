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
          SELECT id, contract_number as "contractNumber", client_id as "clientId", client_name as "clientName", company, title, contract_type as "contractType", value, status, signed_at as "signedAt", signer_name as "signerName", signer_email as "signerEmail", created_at as "createdAt"
          FROM contracts
          ORDER BY created_at DESC;
        `;
        return NextResponse.json({ ok: true, source: "neon", data: rows });
      }
    }
    return NextResponse.json({ ok: true, source: "local", data: db.getContracts() });
  } catch (error: any) {
    console.error("GET /api/contracts error:", error);
    return NextResponse.json({ ok: true, source: "local_fallback", data: db.getContracts() });
  }
}

export async function POST(request: Request) {
  const denied = await denyUnlessStaff(["admin"]);
  if (denied) return denied;

  try {
    const body = await request.json();
    const { contractNumber, clientId, clientName, company, title, contractType, value } = body;

    const newContract = db.addContract({
      contractNumber: contractNumber || `VRT-AGR-${Date.now()}`,
      clientId: clientId || "cli-1",
      clientName: clientName || "Client",
      company: company || "Company",
      title: title || "Master Services Agreement",
      contractType: contractType || "Statement of Work (SOW)",
      value: Number(value) || 5000,
      status: "Pending Signature",
    });

    if (isNeonConfigured()) {
      try {
        const sql = getNeonSql();
        if (sql) {
          await sql`
            INSERT INTO contracts (id, contract_number, client_id, client_name, company, title, contract_type, value, status)
            VALUES (${newContract.id}, ${newContract.contractNumber}, ${newContract.clientId}, ${newContract.clientName}, ${newContract.company}, ${newContract.title}, ${newContract.contractType}, ${newContract.value}, ${newContract.status})
            ON CONFLICT (id) DO NOTHING;
          `;
        }
      } catch (neonErr) {
        console.warn("Neon contract insert error (non-fatal):", neonErr);
      }
    }

    return NextResponse.json({ ok: true, data: newContract });
  } catch (error: any) {
    return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  const denied = await denyUnlessStaff(["admin"]);
  if (denied) return denied;

  try {
    const body = await request.json();
    const { id, signerName, signerEmail } = body;

    if (!id || !signerName || !signerEmail) {
      return NextResponse.json({ ok: false, error: "Missing required fields" }, { status: 400 });
    }

    const updated = db.signContract(id, signerName, signerEmail);

    if (isNeonConfigured()) {
      try {
        const sql = getNeonSql();
        if (sql && updated) {
          await sql`
            UPDATE contracts
            SET status = 'Signed',
                signer_name = ${signerName},
                signer_email = ${signerEmail},
                signed_at = ${updated.signedAt || new Date().toISOString()}
            WHERE id = ${id};
          `;
        }
      } catch (neonErr) {
        console.warn("Neon contract sign error (non-fatal):", neonErr);
      }
    }

    return NextResponse.json({ ok: true, data: updated });
  } catch (error: any) {
    return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  }
}
