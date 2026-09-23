"use client";

import React, { useState } from "react";
import { db, Project, Invoice, MediaAsset, Booking } from "@/db";

interface ClientRoomViewProps {
  initialClientId?: string;
}

export const ClientRoomView: React.FC<ClientRoomViewProps> = ({
  initialClientId = "cli-1",
}) => {
  const [selectedClientId, setSelectedClientId] = useState<string>(initialClientId);
  const clients = db.getClients();
  const currentClient = clients.find((c) => c.id === selectedClientId) || clients[0];

  const projects = db.getProjects().filter((p) => p.clientId === selectedClientId);
  const project = projects[0] || {
    id: "proj-fallback",
    clientId: currentClient.id,
    clientName: currentClient.name,
    title: `${currentClient.name} Digital Ecosystem`,
    phase: "Discover" as const,
    progress: 25,
    riskLevel: "On Track" as const,
    budget: 6500,
    startDate: "2026-09-20",
    targetDate: "2026-10-30",
  };

  const contact = currentClient.contactName || currentClient.name;
  const company = currentClient.company || currentClient.name;

  const invoices = db.getInvoices().filter((i) => i.clientId === selectedClientId);
  const deliverables = db.getMediaAssets(selectedClientId);
  const bookings = db.getBookings().filter(
    (b) =>
      b.company.toLowerCase().includes(company.toLowerCase()) ||
      b.clientName.toLowerCase().includes(contact.toLowerCase())
  );

  const [activeTab, setActiveTab] = useState<"overview" | "deliverables" | "invoices" | "meetings">("overview");
  const [approvalStatus, setApprovalStatus] = useState<"pending" | "approved" | "changes_requested">("pending");
  const [revisionNote, setRevisionNote] = useState("");

  const phases = ["Discover", "Design", "Build", "Deliver", "Support"] as const;

  return (
    <div className="p-4 sm:p-8 max-w-7xl mx-auto text-[#0F1B2A] space-y-6">
      {/* Client Context Bar & Security Badge */}
      <div className="bg-white border border-gray-300 rounded-lg p-4 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-full bg-[#2E1F27] text-[#FFE600] flex items-center justify-center font-black font-mono text-sm border-2 border-black">
            {currentClient.name.charAt(0)}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-bold uppercase tracking-wider text-black">
                {company} Private Client Room
              </span>
              <span className="font-mono text-[0.62rem] px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold border border-emerald-300">
                Authorized Client View
              </span>
            </div>
            <p className="text-xs text-gray-500 font-mono mt-0.5">
              Contact: {contact} ({currentClient.email})
            </p>
          </div>
        </div>

        {/* Client Account Switcher (For user testing of multiple clients) */}
        <div className="flex items-center gap-2">
          <span className="text-[0.7rem] font-mono text-gray-500 uppercase font-bold">Simulate Client:</span>
          <select
            value={selectedClientId}
            onChange={(e) => {
              setSelectedClientId(e.target.value);
              setApprovalStatus("pending");
            }}
            className="font-mono text-xs border border-gray-300 rounded px-2.5 py-1.5 bg-gray-50 font-bold text-gray-900 focus:border-black focus:outline-none"
          >
            {clients.map((c) => (
              <option key={c.id} value={c.id}>
                {c.company || c.name} ({c.name})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Scoped Access Banner */}
      <div className="bg-amber-50 border-l-4 border-amber-500 p-3 rounded-r text-xs font-mono text-amber-900 flex items-center justify-between">
        <span>
          🛡️ <strong>Client Confidential Mode:</strong> You are viewing only records, deliverables, and invoices authorized for <strong>{currentClient.name}</strong>. Internal team sprint tasks and other client accounts are completely restricted.
        </span>
        <span className="text-[0.65rem] text-amber-700 bg-amber-100/80 px-2 py-0.5 rounded font-bold">
          Strict Data Isolation
        </span>
      </div>

      {/* Client Portal Tab Navigation */}
      <div className="flex items-center border-b border-gray-300 gap-1 sm:gap-2">
        <button
          type="button"
          onClick={() => setActiveTab("overview")}
          className={`px-4 py-2 font-mono text-xs font-bold uppercase tracking-wider border-b-2 transition-colors ${
            activeTab === "overview"
              ? "border-black text-black bg-white"
              : "border-transparent text-gray-500 hover:text-black hover:bg-gray-50"
          }`}
        >
          Project Journey & Approval
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("deliverables")}
          className={`px-4 py-2 font-mono text-xs font-bold uppercase tracking-wider border-b-2 transition-colors ${
            activeTab === "deliverables"
              ? "border-black text-black bg-white"
              : "border-transparent text-gray-500 hover:text-black hover:bg-gray-50"
          }`}
        >
          Deliverables Vault ({deliverables.length})
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("invoices")}
          className={`px-4 py-2 font-mono text-xs font-bold uppercase tracking-wider border-b-2 transition-colors ${
            activeTab === "invoices"
              ? "border-black text-black bg-white"
              : "border-transparent text-gray-500 hover:text-black hover:bg-gray-50"
          }`}
        >
          Invoices & Billing ({invoices.length})
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("meetings")}
          className={`px-4 py-2 font-mono text-xs font-bold uppercase tracking-wider border-b-2 transition-colors ${
            activeTab === "meetings"
              ? "border-black text-black bg-white"
              : "border-transparent text-gray-500 hover:text-black hover:bg-gray-50"
          }`}
        >
          Scheduled Calls ({bookings.length})
        </button>
      </div>

      {/* TAB 1: OVERVIEW & APPROVAL */}
      {activeTab === "overview" && (
        <div className="space-y-6 animate-fade-in">
          {/* 5-Phase Milestone Progress Tracker */}
          <div className="bg-white border border-gray-300 rounded-lg p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-mono text-xs font-bold uppercase tracking-wider text-gray-500">
                Active Phase Roadmap · {project.title}
              </h3>
              <span className="font-mono text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                ● Status: {project.riskLevel}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
              {phases.map((phase, idx) => {
                const phaseOrder = { Discover: 1, Design: 2, Build: 3, Deliver: 4, Support: 5 };
                const currentOrder = phaseOrder[project.phase] || 2;
                const isCompleted = phaseOrder[phase] < currentOrder;
                const isCurrent = phase === project.phase;

                return (
                  <div
                    key={phase}
                    className={`p-3 rounded border text-left ${
                      isCurrent
                        ? "bg-[#FEFCE8] border-[#FFE600] ring-2 ring-[#FFE600]/40"
                        : isCompleted
                        ? "bg-gray-50 border-gray-300 text-gray-800"
                        : "bg-gray-50/50 border-gray-200 text-gray-400"
                    }`}
                  >
                    <div className="flex items-center justify-between text-[0.65rem] font-mono font-bold mb-1">
                      <span>0{idx + 1}</span>
                      {isCompleted ? (
                        <span className="text-emerald-600">✓ Completed</span>
                      ) : isCurrent ? (
                        <span className="text-amber-800 animate-pulse">● Active Sprint</span>
                      ) : (
                        <span>Upcoming</span>
                      )}
                    </div>
                    <h4 className="font-bold text-sm text-black">{phase}</h4>
                  </div>
                );
              })}
            </div>

            <div className="mt-4 pt-4 border-t border-gray-100 flex flex-wrap items-center justify-between gap-2 text-xs text-gray-600 font-mono">
              <span>Overall Milestone Progress: <strong>{project.progress}%</strong></span>
              <span>Project Budget: <strong>${project.budget.toLocaleString()}</strong></span>
              <span>Target Delivery Date: <strong>{project.targetDate}</strong></span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left 2 Cols: Action Item / Deliverable Signoff */}
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white border border-gray-300 rounded-lg p-6 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <span className="font-mono text-xs font-bold uppercase tracking-wider text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                    Action Required: Deliverable Review
                  </span>
                  <span className="text-xs text-gray-500 font-mono">
                    Phase: {project.phase}
                  </span>
                </div>

                <h3 className="font-bold text-lg text-black">
                  {project.title} — Prototype Staging & Visual Architecture
                </h3>
                <p className="text-xs sm:text-sm text-gray-600 mt-2 leading-relaxed">
                  Please review the latest sprint output below. Once approved, the team will initiate final production exports and engineering deployment.
                </p>

                {/* Staging Mock Preview */}
                <div className="mt-4 bg-gray-100 border border-gray-300 rounded-lg p-4 text-center">
                  <img
                    src="https://images.pexels.com/photos/29795384/pexels-photo-29795384.jpeg?auto=compress&cs=tinysrgb&w=800"
                    alt="Deliverable Preview"
                    className="max-h-72 mx-auto rounded shadow-sm object-cover"
                  />
                  <span className="text-[0.7rem] text-gray-500 block mt-2 font-mono">
                    Live Staging URL: https://staging.{currentClient.name.toLowerCase().replace(/\s+/g, "")}.tvl.run
                  </span>
                </div>

                {/* Approval Decision Controls */}
                <div className="mt-6 pt-4 border-t border-gray-200">
                  {approvalStatus === "approved" ? (
                    <div className="bg-emerald-50 border border-emerald-300 p-4 rounded text-center">
                      <p className="text-sm font-bold text-emerald-800">✓ Deliverable Approved by {contact}!</p>
                      <p className="text-xs text-emerald-700 mt-0.5">
                        Our studio team has been notified to proceed with final release builds.
                      </p>
                    </div>
                  ) : approvalStatus === "changes_requested" ? (
                    <div className="bg-amber-50 border border-amber-300 p-4 rounded">
                      <p className="text-sm font-bold text-amber-900">✎ Revisions Submitted</p>
                      <p className="text-xs text-amber-800 mt-1">Note: &quot;{revisionNote}&quot;</p>
                      <button
                        type="button"
                        onClick={() => setApprovalStatus("pending")}
                        className="text-xs font-bold text-amber-900 underline mt-2 block"
                      >
                        Edit request
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <div className="flex flex-wrap gap-3">
                        <button
                          type="button"
                          onClick={() => setApprovalStatus("approved")}
                          className="px-5 py-2.5 bg-black text-[#FFE600] font-bold text-xs uppercase tracking-wider rounded hover:bg-gray-800 transition-colors"
                        >
                          ✓ Approve Deliverable
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            const note = prompt("Please describe requested revisions:");
                            if (note) {
                              setRevisionNote(note);
                              setApprovalStatus("changes_requested");
                            }
                          }}
                          className="px-5 py-2.5 border border-gray-400 bg-white text-black font-bold text-xs uppercase tracking-wider rounded hover:border-black transition-colors"
                        >
                          Request Revisions
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Right 1 Col: Quick Links & Studio Contacts */}
            <div className="space-y-6">
              <div className="bg-white border border-gray-300 rounded-lg p-5 shadow-sm">
                <h3 className="font-bold text-sm text-black uppercase font-mono tracking-wider mb-3">
                  Your Dedicated Pod
                </h3>
                <div className="space-y-3 text-xs">
                  <div className="flex items-center gap-2.5 p-2 rounded bg-gray-50 border border-gray-200">
                    <div className="h-7 w-7 rounded-full bg-black text-[#FFE600] flex items-center justify-center font-bold text-xs">
                      P
                    </div>
                    <div>
                      <span className="font-bold text-gray-900 block">Paks</span>
                      <span className="text-[0.68rem] text-gray-500 font-mono">Studio Director & Lead</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2.5 p-2 rounded bg-gray-50 border border-gray-200">
                    <div className="h-7 w-7 rounded-full bg-amber-500 text-white flex items-center justify-center font-bold text-xs">
                      K
                    </div>
                    <div>
                      <span className="font-bold text-gray-900 block">Kai</span>
                      <span className="text-[0.68rem] text-gray-500 font-mono">Brand & Systems Architect</span>
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={() => setActiveTab("meetings")}
                    className="w-full text-center py-2 rounded bg-[#FFE600] border border-black font-mono text-xs font-bold text-black hover:bg-black hover:text-[#FFE600] transition-colors"
                  >
                    Schedule Direct Sync →
                  </button>
                </div>
              </div>

              {/* Outstanding Invoices Glance */}
              <div className="bg-white border border-gray-300 rounded-lg p-5 shadow-sm">
                <h3 className="font-bold text-sm text-black uppercase font-mono tracking-wider mb-2">
                  Billing Glance
                </h3>
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between font-mono">
                    <span className="text-gray-500">Invoices on Record:</span>
                    <span className="font-bold">{invoices.length}</span>
                  </div>
                  <div className="flex justify-between font-mono">
                    <span className="text-gray-500">Pending Payment:</span>
                    <span className="font-bold text-amber-700">
                      ${invoices.filter((i) => i.status === "Pending").reduce((acc, i) => acc + i.amount, 0).toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: DELIVERABLES VAULT */}
      {activeTab === "deliverables" && (
        <div className="bg-white border border-gray-300 rounded-lg p-6 shadow-sm space-y-4 animate-fade-in">
          <div className="flex items-center justify-between border-b border-gray-200 pb-3">
            <div>
              <h3 className="font-mono font-bold text-sm uppercase tracking-wider text-black">
                {currentClient.name} Authorized Asset Vault
              </h3>
              <p className="text-xs text-gray-500">
                Secure Cloudflare R2 downloads for verified brand exports, vector packages, and prototypes.
              </p>
            </div>
            <span className="font-mono text-xs font-bold bg-gray-100 px-2.5 py-1 rounded">
              {deliverables.length} files available
            </span>
          </div>

          {deliverables.length === 0 ? (
            <div className="text-center py-12 text-gray-400 font-mono text-xs border border-dashed rounded">
              No files currently uploaded for this client room yet.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {deliverables.map((item) => (
                <div
                  key={item.id}
                  className="border border-gray-200 p-4 rounded-lg bg-gray-50 hover:border-black transition-colors flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">
                      {item.fileType === "document" ? "📄" : item.fileType === "image" ? "🖼️" : item.fileType === "video" ? "🎬" : "🎵"}
                    </span>
                    <div>
                      <h4 className="font-bold text-xs text-black">{item.title}</h4>
                      <span className="text-[0.68rem] text-gray-500 font-mono">
                        {item.filename} · {item.fileSize}
                      </span>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => alert(`Starting download for ${item.filename}`)}
                    className="px-3 py-1 bg-white hover:bg-[#FFE600] border border-gray-300 font-mono text-xs font-bold rounded transition-colors"
                  >
                    Download ↓
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 3: INVOICES & BILLING */}
      {activeTab === "invoices" && (
        <div className="bg-white border border-gray-300 rounded-lg p-6 shadow-sm space-y-4 animate-fade-in">
          <div className="flex items-center justify-between border-b border-gray-200 pb-3">
            <div>
              <h3 className="font-mono font-bold text-sm uppercase tracking-wider text-black">
                Invoices & Payment Records
              </h3>
              <p className="text-xs text-gray-500">
                Official billing statements, payment receipts, and automated Stripe settlements.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {invoices.map((inv) => (
              <div key={inv.id} className="border border-gray-200 p-5 rounded-lg bg-gray-50/70 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-mono text-xs font-bold text-black">{inv.invoiceNumber}</span>
                    <span
                      className={`font-mono text-[0.68rem] font-bold px-2 py-0.5 rounded ${
                        inv.status === "Paid"
                          ? "bg-emerald-100 text-emerald-800"
                          : "bg-amber-100 text-amber-800"
                      }`}
                    >
                      {inv.status}
                    </span>
                  </div>

                  <div className="flex items-baseline justify-between mb-3">
                    <span className="text-xl font-mono font-black text-black">
                      ${inv.amount.toLocaleString()}
                    </span>
                    <span className="text-[0.7rem] text-gray-500 font-mono">Due: {inv.dueDate}</span>
                  </div>
                </div>

                <div className="pt-3 border-t border-gray-200">
                  {inv.status === "Pending" ? (
                    <button
                      type="button"
                      onClick={() => alert(`Opening secure checkout for ${inv.invoiceNumber} ($${inv.amount.toLocaleString()})`)}
                      className="w-full py-2 bg-[#FFE600] border border-black text-black font-bold text-xs uppercase font-mono tracking-wider rounded hover:bg-black hover:text-[#FFE600] transition-colors"
                    >
                      Pay via Stripe →
                    </button>
                  ) : (
                    <div className="flex items-center justify-between text-xs font-mono text-emerald-700">
                      <span>✓ Paid on {inv.paidAt}</span>
                      <button
                        type="button"
                        onClick={() => alert(`Downloading PDF receipt for ${inv.invoiceNumber}`)}
                        className="underline text-gray-600 hover:text-black"
                      >
                        Receipt
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: SCHEDULED CALLS */}
      {activeTab === "meetings" && (
        <div className="bg-white border border-gray-300 rounded-lg p-6 shadow-sm space-y-4 animate-fade-in">
          <div className="flex items-center justify-between border-b border-gray-200 pb-3">
            <div>
              <h3 className="font-mono font-bold text-sm uppercase tracking-wider text-black">
                Your Strategy & Sprint Sessions
              </h3>
              <p className="text-xs text-gray-500">
                Direct Google Meet video links with your dedicated Virtus Labs pod.
              </p>
            </div>
            <a
              href="https://cal.com/thevirtuslabs/discovery"
              target="_blank"
              rel="noreferrer"
              className="px-3 py-1.5 bg-black text-[#FFE600] font-mono text-xs font-bold uppercase tracking-wider rounded hover:bg-[#FFE600] hover:text-black transition-colors"
            >
              + Book New Call
            </a>
          </div>

          {bookings.length === 0 ? (
            <div className="text-center py-12 text-gray-400 font-mono text-xs border border-dashed rounded">
              No meetings scheduled yet for {company}. Click &quot;Book New Call&quot; to arrange a sync.
            </div>
          ) : (
            <div className="space-y-3">
              {bookings.map((b) => (
                <div
                  key={b.id}
                  className="border border-gray-200 p-4 rounded-lg bg-gray-50 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                >
                  <div>
                    <span className="font-mono text-[0.65rem] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 uppercase">
                      {b.status}
                    </span>
                    <h4 className="font-bold text-sm text-black mt-1">{b.bookingType}</h4>
                    <p className="text-xs text-gray-600 font-mono">
                      {b.date} • {b.time} (Lead: {b.host})
                    </p>
                    {b.notes && (
                      <p className="text-[0.72rem] text-gray-500 italic mt-1">&quot;{b.notes}&quot;</p>
                    )}
                  </div>

                  <a
                    href={b.meetingUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded bg-[#2E1F27] text-white font-mono text-xs font-bold hover:bg-[#FFE600] hover:text-black transition-colors shrink-0"
                  >
                    <span>📹 Join Video Call</span>
                  </a>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
