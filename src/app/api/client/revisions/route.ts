import { NextResponse } from "next/server";
import { getClientSessionId } from "@/lib/clientSession";
import { getClientPortalData, saveRevision } from "@/lib/clientPortal";

export const dynamic = "force-dynamic";

const MAX_BODY_BYTES = 16 * 1024;
const PRIORITIES = new Set(["routine", "important", "blocker"]);
const CATEGORIES = new Set([
  "Visual & UI Styling",
  "Copy & Typography",
  "Functionality & Interactions",
  "Mobile Responsiveness",
  "Brand Assets & Colors",
]);

const text = (value: unknown, max: number): string | null =>
  typeof value === "string" && value.trim().length > 0 && value.length <= max ? value.trim() : null;

export async function POST(request: Request) {
  const clientId = await getClientSessionId();
  if (!clientId) return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });

  const raw = await request.text();
  if (raw.length > MAX_BODY_BYTES) {
    return NextResponse.json({ ok: false, error: "Request too large" }, { status: 413 });
  }
  let body: Record<string, unknown>;
  try {
    body = JSON.parse(raw);
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid request" }, { status: 400 });
  }

  const details = text(body.details, 4000);
  const targetArea = text(body.targetArea, 200);
  const categories = Array.isArray(body.categories)
    ? body.categories.filter((c): c is string => typeof c === "string" && CATEGORIES.has(c))
    : [];
  const priority = typeof body.priority === "string" && PRIORITIES.has(body.priority) ? body.priority : null;
  const attachments = Array.isArray(body.attachments)
    ? body.attachments.map((a) => text(a, 200)).filter((a): a is string => a !== null).slice(0, 10)
    : [];
  const referenceUrl = typeof body.referenceUrl === "string" ? body.referenceUrl.trim().slice(0, 500) : "";

  if (!details || !targetArea || categories.length === 0 || !priority) {
    return NextResponse.json({ ok: false, error: "Please complete the required fields." }, { status: 400 });
  }
  if (referenceUrl && !/^https?:\/\//i.test(referenceUrl)) {
    return NextResponse.json({ ok: false, error: "Reference link must start with http:// or https://" }, { status: 400 });
  }

  const portal = await getClientPortalData(clientId);
  if (!portal) return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });

  const ticket = await saveRevision({
    clientId,
    categories,
    targetArea,
    priority: priority as "routine" | "important" | "blocker",
    details,
    referenceUrl,
    attachments,
    submittedBy: portal.client.contactName,
    submittedEmail: portal.client.email,
  });
  return NextResponse.json({ ok: true, data: ticket });
}
