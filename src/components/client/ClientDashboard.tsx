"use client";

import React, { useCallback, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Logo } from "@/components/public/Logo";
import { RevisionDialog } from "./RevisionDialog";
import type { ClientPortalData } from "@/lib/clientPortal";
import type { ApprovalStatus, RevisionTicket } from "@/db";

type Tab = "overview" | "deliverables" | "invoices" | "calls";

const PHASES = ["Discover", "Design", "Build", "Deliver", "Support"] as const;
const PHASE_ORDER: Record<(typeof PHASES)[number], number> = { Discover: 1, Design: 2, Build: 3, Deliver: 4, Support: 5 };

const money = (n: number) => `$${n.toLocaleString("en-US")}`;
const dateLabel = (value?: string) =>
  value
    ? new Date(value).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })
    : "—";

const panel = "border-2 border-black bg-white p-5 sm:p-7";
const eyebrow = "font-sans text-eyebrow font-bold uppercase";
const primaryButton =
  "border-2 border-black bg-[#FBD227] px-6 py-3 font-sans text-eyebrow font-bold uppercase text-black transition-colors hover:bg-black hover:text-[#FBD227] disabled:opacity-60 focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-4 focus-visible:outline-black";
const secondaryButton =
  "border-2 border-black bg-white px-6 py-3 font-sans text-eyebrow font-bold uppercase text-black transition-colors hover:bg-black hover:text-white disabled:opacity-60 focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-4 focus-visible:outline-black";

export function ClientDashboard({ initialData }: { initialData: ClientPortalData }) {
  const router = useRouter();
  const [data, setData] = useState(initialData);
  const [tab, setTab] = useState<Tab>("overview");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);

  const { client, project, invoices, deliverables, bookings, revisions, approval } = data;
  const firstName = client.contactName.replace(/^(dr|mr|mrs|ms)\.?\s+/i, "").split(" ")[0];

  const redirectToLogin = useCallback(() => {
    router.replace("/client/login");
    router.refresh();
  }, [router]);

  const logout = async () => {
    await fetch("/api/client/logout", { method: "POST" }).catch(() => undefined);
    redirectToLogin();
  };

  const setApproval = async (status: ApprovalStatus) => {
    if (busy) return;
    setBusy(true);
    setNotice(null);
    try {
      const res = await fetch("/api/client/approval", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (res.status === 401) return redirectToLogin();
      const body = await res.json().catch(() => null);
      if (!res.ok || !body?.ok) {
        setNotice(body?.error ?? "Could not save your decision. Try again.");
        return;
      }
      setData((current) => ({ ...current, approval: body.data.approval as ApprovalStatus }));
    } catch {
      setNotice("Network error. Check your connection and try again.");
    } finally {
      setBusy(false);
    }
  };

  const onRevisionSubmitted = (ticket: RevisionTicket) => {
    setData((current) => ({ ...current, revisions: [ticket, ...current.revisions], approval: "changes_requested" }));
    setDialogOpen(false);
    setNotice(`Request ${ticket.id} sent. Your team will reply within one business day.`);
  };

  const tabs: { id: Tab; label: string; count?: number }[] = [
    { id: "overview", label: "Overview" },
    { id: "deliverables", label: "Deliverables", count: deliverables.length },
    { id: "invoices", label: "Invoices", count: invoices.length },
    { id: "calls", label: "Calls", count: bookings.length },
  ];

  return (
    <div className="min-h-screen bg-white text-black selection:bg-[#FBD227] selection:text-black">
      <header className="bg-black text-white">
        <div className="mx-auto flex max-w-[74rem] items-center justify-between gap-4 px-5 py-4 sm:px-8 lg:px-10">
          <Link
            href="/"
            aria-label="The Virtus Labs — Home"
            className="focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-4 focus-visible:outline-[#FBD227]"
          >
            <Logo />
          </Link>
          <div className="flex items-center gap-4">
            <span className="hidden font-sans text-eyebrow font-bold uppercase text-[#999999] sm:inline">
              {client.company}
            </span>
            <button
              type="button"
              onClick={logout}
              className="border-2 border-white/30 px-4 py-2 font-sans text-eyebrow font-bold uppercase text-white transition-colors hover:border-[#FBD227] hover:text-[#FBD227] focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-4 focus-visible:outline-[#FBD227]"
            >
              Log out
            </button>
          </div>
        </div>
        <div className="mx-auto max-w-[74rem] px-5 pb-10 pt-6 sm:px-8 lg:px-10">
          <div className="flex items-center gap-4">
            <span aria-hidden="true" className="block h-1 w-12 bg-[#FBD227]" />
            <span className={eyebrow}>Client dashboard</span>
          </div>
          <h1 className="mt-4 font-monument text-[clamp(1.75rem,5vw,3rem)] font-bold uppercase leading-[1.1]">
            Hello, <span className="text-[#FBD227]">{firstName}.</span>
          </h1>
        </div>
        <nav aria-label="Dashboard sections" className="mx-auto max-w-[74rem] px-5 sm:px-8 lg:px-10">
          <ul className="flex gap-1 overflow-x-auto">
            {tabs.map((t) => (
              <li key={t.id}>
                <button
                  type="button"
                  onClick={() => setTab(t.id)}
                  aria-current={tab === t.id ? "page" : undefined}
                  className={`whitespace-nowrap border-b-4 px-4 py-3 font-sans text-eyebrow font-bold uppercase transition-colors focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-[-3px] focus-visible:outline-[#FBD227] ${
                    tab === t.id ? "border-[#FBD227] text-white" : "border-transparent text-[#999999] hover:text-white"
                  }`}
                >
                  {t.label}
                  {t.count !== undefined ? ` (${t.count})` : ""}
                </button>
              </li>
            ))}
          </ul>
        </nav>
      </header>

      <main className="mx-auto max-w-[74rem] space-y-6 px-5 py-8 sm:px-8 lg:px-10">
        {notice && (
          <p role="status" className="border-l-4 border-[#FBD227] bg-black px-4 py-3 font-sans text-base font-semibold text-white">
            {notice}
          </p>
        )}

        {tab === "overview" && (
          <>
            {project ? (
              <section aria-labelledby="roadmap-title" className={panel}>
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <h2 id="roadmap-title" className="font-monument text-xl font-bold uppercase">
                    {project.title}
                  </h2>
                  <span className={`${eyebrow} border-2 border-black px-3 py-1`}>{project.riskLevel}</span>
                </div>
                <ol className="mt-6 grid gap-3 sm:grid-cols-5">
                  {PHASES.map((phase, index) => {
                    const done = PHASE_ORDER[phase] < PHASE_ORDER[project.phase];
                    const current = phase === project.phase;
                    return (
                      <li
                        key={phase}
                        aria-current={current ? "step" : undefined}
                        className={`border-2 border-black p-3 ${
                          current ? "bg-[#FBD227] text-black" : done ? "bg-black text-white" : "bg-white text-[#666666]"
                        }`}
                      >
                        <div className="font-sans text-xs font-bold uppercase tracking-[0.16em]">
                          0{index + 1} · {done ? "Complete" : current ? "In progress" : "Upcoming"}
                        </div>
                        <div className="mt-1 font-monument text-base font-bold uppercase">{phase}</div>
                      </li>
                    );
                  })}
                </ol>
                <div className="mt-6 h-3 w-full border-2 border-black" role="progressbar" aria-valuenow={project.progress} aria-valuemin={0} aria-valuemax={100} aria-label="Project progress">
                  <div className="h-full bg-[#FBD227]" style={{ width: `${Math.min(100, Math.max(0, project.progress))}%` }} />
                </div>
                <dl className="mt-4 flex flex-wrap gap-x-8 gap-y-2 font-sans text-base">
                  <div><dt className="inline font-bold">Progress: </dt><dd className="inline">{project.progress}%</dd></div>
                  <div><dt className="inline font-bold">Budget: </dt><dd className="inline">{money(project.budget)}</dd></div>
                  <div><dt className="inline font-bold">Target date: </dt><dd className="inline">{dateLabel(project.targetDate)}</dd></div>
                </dl>
              </section>
            ) : (
              <section className={panel}>
                <h2 className="font-monument text-xl font-bold uppercase">Your project is being set up</h2>
                <p className="mt-3 max-w-[60ch] font-sans text-lg leading-[1.5]">
                  Your account lead is preparing your project plan. Milestones appear here as soon as work is scheduled.
                </p>
              </section>
            )}

            {project && (
              <section aria-labelledby="review-title" className={panel}>
                <div className={`${eyebrow} mb-3`}>Milestone review</div>
                <h2 id="review-title" className="font-monument text-xl font-bold uppercase">
                  {approval === "approved"
                    ? "Approved"
                    : approval === "changes_requested"
                    ? "Changes requested"
                    : "Your decision"}
                </h2>
                <p className="mt-3 max-w-[60ch] font-sans text-lg leading-[1.5]">
                  {approval === "approved"
                    ? `Thank you, ${firstName}. Your sign-off is recorded and the team moves to the next step.`
                    : approval === "changes_requested"
                    ? "Your team is working through your latest request. You can send another request or approve once you are happy."
                    : `Review the latest ${project.phase} work in Deliverables. Approve it, or tell us what to change.`}
                </p>
                <div className="mt-5 flex flex-col gap-3 sm:flex-row">
                  {approval !== "approved" && (
                    <button type="button" className={primaryButton} disabled={busy} onClick={() => setApproval("approved")}>
                      Approve milestone
                    </button>
                  )}
                  <button type="button" className={secondaryButton} disabled={busy} onClick={() => setDialogOpen(true)}>
                    Request changes
                  </button>
                  {approval === "approved" && (
                    <button type="button" className={secondaryButton} disabled={busy} onClick={() => setApproval("pending")}>
                      Undo approval
                    </button>
                  )}
                </div>
              </section>
            )}

            {revisions.length > 0 && (
              <section aria-labelledby="revisions-title" className={panel}>
                <h2 id="revisions-title" className="font-monument text-xl font-bold uppercase">
                  Your requests
                </h2>
                <ul className="mt-4 divide-y-2 divide-black border-y-2 border-black">
                  {revisions.map((r) => (
                    <li key={r.id} className="py-4">
                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 font-sans text-sm font-bold uppercase tracking-[0.12em]">
                        <span>{r.id}</span>
                        <span>Round {r.round}</span>
                        <span>{r.priority}</span>
                        <span className="text-[#666666]">{dateLabel(r.submittedAt)}</span>
                      </div>
                      <p className="mt-2 font-sans text-base font-semibold">{r.targetArea} · {r.categories.join(", ")}</p>
                      <p className="mt-1 whitespace-pre-line font-sans text-base leading-[1.5]">{r.details}</p>
                    </li>
                  ))}
                </ul>
              </section>
            )}
          </>
        )}

        {tab === "deliverables" && (
          <section aria-labelledby="del-title" className={panel}>
            <h2 id="del-title" className="font-monument text-xl font-bold uppercase">Deliverables</h2>
            {deliverables.length === 0 ? (
              <p className="mt-4 font-sans text-lg">No files have been shared yet. New deliverables appear here first.</p>
            ) : (
              <ul className="mt-5 grid gap-3 md:grid-cols-2">
                {deliverables.map((item) => (
                  <li key={item.id} className="flex items-center justify-between gap-4 border-2 border-black p-4">
                    <div className="min-w-0">
                      <h3 className="truncate font-sans text-base font-bold">{item.title}</h3>
                      <p className="font-sans text-sm text-[#333333]">
                        {item.category} · {item.filename} · {item.fileSize}
                      </p>
                    </div>
                    {/^https:\/\//i.test(item.url) ? (
                      <a
                        href={item.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`${primaryButton} shrink-0 !px-4 !py-2`}
                      >
                        Open
                      </a>
                    ) : (
                      <span className={`${eyebrow} shrink-0 text-[#666666]`}>Coming soon</span>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </section>
        )}

        {tab === "invoices" && (
          <section aria-labelledby="inv-title" className={panel}>
            <h2 id="inv-title" className="font-monument text-xl font-bold uppercase">Invoices</h2>
            {invoices.length === 0 ? (
              <p className="mt-4 font-sans text-lg">No invoices yet.</p>
            ) : (
              <ul className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {invoices.map((inv) => (
                  <li key={inv.id} className="border-2 border-black p-5">
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-sans text-sm font-bold uppercase tracking-[0.12em]">{inv.invoiceNumber}</span>
                      <span
                        className={`px-2 py-0.5 font-sans text-xs font-bold uppercase tracking-[0.12em] ${
                          inv.status === "Paid" ? "bg-black text-white" : "border-2 border-black bg-[#FBD227] text-black"
                        }`}
                      >
                        {inv.status}
                      </span>
                    </div>
                    <div className="mt-3 font-monument text-2xl font-bold">{money(inv.amount)}</div>
                    <p className="mt-2 font-sans text-sm">
                      {inv.status === "Paid" && inv.paidAt
                        ? `Paid ${dateLabel(inv.paidAt)}`
                        : `Due ${dateLabel(inv.dueDate)}`}
                    </p>
                    {inv.status !== "Paid" && (
                      <p className="mt-2 font-sans text-sm text-[#333333]">
                        Payment details come from your account lead.
                      </p>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </section>
        )}

        {tab === "calls" && (
          <section aria-labelledby="calls-title" className={panel}>
            <h2 id="calls-title" className="font-monument text-xl font-bold uppercase">Scheduled calls</h2>
            {bookings.length === 0 ? (
              <p className="mt-4 font-sans text-lg">No calls scheduled yet. Your account lead will send an invite.</p>
            ) : (
              <ul className="mt-5 space-y-3">
                {bookings.map((b) => (
                  <li key={b.id} className="flex flex-col justify-between gap-3 border-2 border-black p-4 sm:flex-row sm:items-center">
                    <div>
                      <span className="bg-black px-2 py-0.5 font-sans text-xs font-bold uppercase tracking-[0.12em] text-white">
                        {b.status}
                      </span>
                      <h3 className="mt-2 font-sans text-base font-bold">{b.bookingType}</h3>
                      <p className="font-sans text-sm">
                        {dateLabel(b.date)} · {b.time} · Host: {b.host}
                      </p>
                      {b.notes && <p className="mt-1 font-sans text-sm text-[#333333]">{b.notes}</p>}
                    </div>
                    {/^https:\/\//i.test(b.meetingUrl) && (
                      <a href={b.meetingUrl} target="_blank" rel="noopener noreferrer" className={`${primaryButton} shrink-0 text-center`}>
                        Join call
                      </a>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </section>
        )}
      </main>

      <footer className="border-t-2 border-black px-5 py-5 font-sans text-xs font-semibold uppercase tracking-[0.16em] sm:px-8 lg:px-10">
        <div className="mx-auto flex max-w-[74rem] flex-wrap items-center justify-between gap-3">
          <span>The Virtus Labs · Client dashboard</span>
          <span>One team. Limitless possibilities.</span>
        </div>
      </footer>

      <RevisionDialog open={dialogOpen} onClose={() => setDialogOpen(false)} onSubmitted={onRevisionSubmitted} />
    </div>
  );
}
