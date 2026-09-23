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
  
  // Rich Revision Form State
  const [isRevisionModalOpen, setIsRevisionModalOpen] = useState(false);
  const [isSubmittingRevision, setIsSubmittingRevision] = useState(false);
  const [revisionCategories, setRevisionCategories] = useState<string[]>([
    "Visual & UI Styling",
    "Copy & Typography",
  ]);
  const [revisionTargetArea, setRevisionTargetArea] = useState<string>("Hero Section & Main Navigation");
  const [revisionPriority, setRevisionPriority] = useState<"routine" | "important" | "blocker">("important");
  const [revisionDetails, setRevisionDetails] = useState<string>(
    "1. Increase contrast on the hero CTA button against the dark background.\n2. In the services preview, ensure the cards have equal height on tablet viewports.\n3. Replace placeholder telephone number in the footer with our direct studio dispatch line."
  );
  const [revisionReferenceUrl, setRevisionReferenceUrl] = useState<string>("https://figma.com/file/tidewater-brand-v2-review");
  const [revisionAttachments, setRevisionAttachments] = useState<string[]>([
    "hero-contrast-markup.png",
    "services-grid-feedback.pdf",
  ]);
  const [newAttachmentName, setNewAttachmentName] = useState<string>("");

  interface RevisionTicket {
    id: string;
    round: number;
    categories: string[];
    targetArea: string;
    priority: "routine" | "important" | "blocker";
    details: string;
    referenceUrl: string;
    attachments: string[];
    submittedAt: string;
    submittedBy: string;
    submittedEmail: string;
  }

  const [activeRevisionTicket, setActiveRevisionTicket] = useState<RevisionTicket | null>(null);

  const phases = ["Discover", "Design", "Build", "Deliver", "Support"] as const;

  const handleOpenRevisionModal = () => {
    setIsRevisionModalOpen(true);
  };

  const handleToggleCategory = (category: string) => {
    if (revisionCategories.includes(category)) {
      if (revisionCategories.length > 1) {
        setRevisionCategories(revisionCategories.filter((c) => c !== category));
      }
    } else {
      setRevisionCategories([...revisionCategories, category]);
    }
  };

  const handleAddAttachment = () => {
    if (newAttachmentName.trim()) {
      setRevisionAttachments([...revisionAttachments, newAttachmentName.trim()]);
      setNewAttachmentName("");
    }
  };

  const handleRemoveAttachment = (indexToRemove: number) => {
    setRevisionAttachments(revisionAttachments.filter((_, idx) => idx !== indexToRemove));
  };

  const handleSubmitRevisions = (e: React.FormEvent) => {
    e.preventDefault();
    if (!revisionDetails.trim()) return;

    setIsSubmittingRevision(true);
    setTimeout(() => {
      const now = new Date();
      const timestamp = now.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      }) + ` at ` + now.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
      });

      const newTicket: RevisionTicket = {
        id: `REV-${now.getFullYear()}-${Math.floor(100 + Math.random() * 900)}`,
        round: 1,
        categories: revisionCategories,
        targetArea: revisionTargetArea,
        priority: revisionPriority,
        details: revisionDetails.trim(),
        referenceUrl: revisionReferenceUrl.trim(),
        attachments: revisionAttachments,
        submittedAt: timestamp,
        submittedBy: contact,
        submittedEmail: currentClient.email,
      };

      setActiveRevisionTicket(newTicket);
      setApprovalStatus("changes_requested");
      setIsSubmittingRevision(false);
      setIsRevisionModalOpen(false);
    }, 600);
  };

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
                    <div className="bg-emerald-50 border border-emerald-300 p-5 rounded-lg text-center">
                      <div className="inline-flex items-center justify-center h-10 w-10 rounded-full bg-emerald-100 text-emerald-800 font-bold text-lg mb-2">
                        ✓
                      </div>
                      <p className="text-sm font-bold text-emerald-900">
                        Deliverable Approved by {contact}!
                      </p>
                      <p className="text-xs text-emerald-700 mt-1 max-w-md mx-auto">
                        Our studio team has been notified. Milestone sign-off is recorded, and the pod is initiating final production assets and deployment.
                      </p>
                      <button
                        type="button"
                        onClick={() => setApprovalStatus("pending")}
                        className="text-[0.72rem] font-mono font-bold text-emerald-800 underline mt-3 hover:text-black"
                      >
                        Reset approval status (Testing)
                      </button>
                    </div>
                  ) : approvalStatus === "changes_requested" ? (
                    <div className="bg-amber-50/80 border-2 border-amber-300 rounded-lg p-5 space-y-4">
                      {/* Ticket Header */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-amber-200/80 pb-3">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs font-bold uppercase tracking-wider text-amber-900 bg-amber-200/80 px-2.5 py-0.5 rounded">
                            {activeRevisionTicket?.id || "REV-2026-081"}
                          </span>
                          <span className="font-mono text-[0.68rem] font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded border border-amber-300">
                            Round {activeRevisionTicket?.round || 1} of 2 Included
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span
                            className={`font-mono text-[0.65rem] font-bold uppercase px-2 py-0.5 rounded ${
                              activeRevisionTicket?.priority === "blocker"
                                ? "bg-rose-100 text-rose-800 border border-rose-300"
                                : activeRevisionTicket?.priority === "important"
                                ? "bg-amber-200 text-amber-900 border border-amber-400"
                                : "bg-blue-100 text-blue-800 border border-blue-300"
                            }`}
                          >
                            Priority: {activeRevisionTicket?.priority || "important"}
                          </span>
                          <span className="font-mono text-[0.65rem] text-gray-500">
                            ● {activeRevisionTicket?.submittedAt || "Submitted just now"}
                          </span>
                        </div>
                      </div>

                      {/* Scope & Target Details */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 font-mono text-xs">
                        <div className="bg-white/80 p-2.5 rounded border border-amber-200">
                          <span className="text-[0.65rem] uppercase text-gray-500 font-bold block mb-1">
                            Feedback Categories
                          </span>
                          <div className="flex flex-wrap gap-1.5">
                            {(activeRevisionTicket?.categories || revisionCategories).map((cat) => (
                              <span
                                key={cat}
                                className="bg-amber-100/70 text-amber-900 px-2 py-0.5 rounded text-[0.68rem] font-bold"
                              >
                                {cat}
                              </span>
                            ))}
                          </div>
                        </div>

                        <div className="bg-white/80 p-2.5 rounded border border-amber-200">
                          <span className="text-[0.65rem] uppercase text-gray-500 font-bold block mb-1">
                            Target Element / Section
                          </span>
                          <span className="font-bold text-gray-900 text-xs">
                            {activeRevisionTicket?.targetArea || revisionTargetArea}
                          </span>
                        </div>
                      </div>

                      {/* Detailed Revision Notes */}
                      <div className="bg-white p-3.5 rounded border border-amber-200">
                        <span className="font-mono text-[0.65rem] uppercase text-gray-500 font-bold block mb-1.5">
                          Actionable Revision Instructions
                        </span>
                        <p className="text-xs text-gray-800 whitespace-pre-wrap font-sans leading-relaxed">
                          {activeRevisionTicket?.details || revisionDetails}
                        </p>
                      </div>

                      {/* References & Attachments */}
                      {((activeRevisionTicket?.referenceUrl) || (activeRevisionTicket?.attachments && activeRevisionTicket.attachments.length > 0)) && (
                        <div className="flex flex-wrap items-center gap-3 font-mono text-xs bg-amber-100/40 p-2.5 rounded border border-amber-200/60">
                          {activeRevisionTicket?.referenceUrl && (
                            <a
                              href={activeRevisionTicket.referenceUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex items-center gap-1 text-amber-900 hover:text-black underline font-bold"
                            >
                              <span>🔗 Reference / Figma Link ↗</span>
                            </a>
                          )}
                          {activeRevisionTicket?.attachments?.map((file, idx) => (
                            <span
                              key={idx}
                              className="inline-flex items-center gap-1 bg-white px-2 py-0.5 rounded border border-gray-300 text-gray-700 text-[0.68rem]"
                            >
                              📎 {file}
                            </span>
                          ))}
                        </div>
                      )}

                      {/* Studio Pod SLA Notice */}
                      <div className="bg-amber-100/60 border-l-4 border-amber-500 p-2.5 rounded-r text-[0.72rem] font-mono text-amber-900 flex items-center justify-between">
                        <span>
                          ⚡ <strong>Studio Triage Active:</strong> Dispatched to Pod Leads (Paks & Kai). Standard response SLA: <strong>24–48 hours</strong>.
                        </span>
                        <span className="text-[0.65rem] font-bold text-amber-800">
                          Status: In Pod Queue
                        </span>
                      </div>

                      {/* Ticket Control Actions */}
                      <div className="pt-2 flex flex-wrap items-center justify-between gap-3">
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={handleOpenRevisionModal}
                            className="px-3.5 py-1.5 bg-white border border-gray-400 font-mono text-xs font-bold text-gray-800 rounded hover:border-black hover:bg-gray-50 transition-colors"
                          >
                            ✎ Edit Revision Request
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              if (confirm("Withdraw revisions and mark this deliverable approved?")) {
                                setApprovalStatus("approved");
                              }
                            }}
                            className="px-3.5 py-1.5 bg-emerald-700 text-white font-mono text-xs font-bold rounded hover:bg-emerald-800 transition-colors"
                          >
                            ✓ Mark Resolved & Approve
                          </button>
                        </div>

                        <span className="text-[0.68rem] text-gray-500 font-mono">
                          Submitted by {activeRevisionTicket?.submittedBy || contact}
                        </span>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <div className="flex flex-wrap gap-3">
                        <button
                          type="button"
                          onClick={() => setApprovalStatus("approved")}
                          className="px-5 py-2.5 bg-black text-[#FFE600] font-bold text-xs uppercase tracking-wider rounded hover:bg-gray-800 transition-colors shadow-xs"
                        >
                          ✓ Approve Deliverable
                        </button>
                        <button
                          type="button"
                          onClick={handleOpenRevisionModal}
                          className="px-5 py-2.5 border-2 border-black bg-white text-black font-bold text-xs uppercase tracking-wider rounded hover:bg-[#FFE600] transition-colors shadow-xs"
                        >
                          ✎ Request Revisions
                        </button>
                      </div>
                      <p className="text-[0.72rem] text-gray-500 font-mono">
                        Need adjustments? Click &quot;Request Revisions&quot; to open the formal feedback desk with your dedicated pod leads.
                      </p>
                    </div>
                  )}
                </div>

                {/* COMPREHENSIVE REVISION REQUEST MODAL FORM */}
                {isRevisionModalOpen && (
                  <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-xs p-4 sm:p-6 overflow-y-auto"
                    role="dialog"
                    aria-modal="true"
                  >
                    <div className="bg-white border-2 border-black rounded-xl max-w-3xl w-full p-6 sm:p-8 shadow-2xl space-y-6 my-auto max-h-[92vh] overflow-y-auto text-left font-sans">
                      {/* Modal Header */}
                      <div className="flex items-start justify-between border-b border-gray-200 pb-4">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-[0.65rem] font-bold uppercase tracking-wider text-black bg-[#FFE600] px-2 py-0.5 rounded border border-black">
                              Sprint Feedback Desk
                            </span>
                            <span className="font-mono text-[0.65rem] font-bold uppercase text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded border border-emerald-300">
                              Round 1 of 2 Included
                            </span>
                          </div>
                          <h3 className="font-bold text-xl text-black mt-1.5">
                            Submit Deliverable Revisions
                          </h3>
                          <p className="text-xs text-gray-500 font-mono mt-0.5">
                            Project: {project.title} · Phase: {project.phase} · Client: {company}
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() => setIsRevisionModalOpen(false)}
                          className="h-8 w-8 rounded-full border border-gray-300 hover:border-black hover:bg-gray-100 flex items-center justify-center font-mono text-sm font-bold text-gray-600 hover:text-black transition-colors"
                        >
                          ✕
                        </button>
                      </div>

                      {/* Staging Context Banner */}
                      <div className="bg-gray-50 border border-gray-200 rounded-lg p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs font-mono">
                        <div>
                          <span className="text-gray-500 block text-[0.68rem] uppercase font-bold">Review Target</span>
                          <span className="font-bold text-black text-xs">
                            Coastal Brand & E-Commerce Flagship — Prototype Staging
                          </span>
                        </div>
                        <a
                          href={`https://staging.${currentClient.name.toLowerCase().replace(/\s+/g, "")}.tvl.run`}
                          target="_blank"
                          rel="noreferrer"
                          className="text-[0.72rem] text-blue-700 hover:underline font-bold"
                        >
                          Open Live Staging Preview ↗
                        </a>
                      </div>

                      {/* FORM */}
                      <form onSubmit={handleSubmitRevisions} className="space-y-5">
                        {/* 1. Category Selection */}
                        <div>
                          <label className="block text-xs font-bold uppercase font-mono text-gray-700 mb-1.5">
                            1. Feedback Disciplines (Select all that apply)
                          </label>
                          <div className="flex flex-wrap gap-2">
                            {[
                              "Visual & UI Styling",
                              "Copy & Typography",
                              "Functionality & Interactions",
                              "Mobile Responsiveness",
                              "Brand Assets & Colors",
                            ].map((cat) => {
                              const isSelected = revisionCategories.includes(cat);
                              return (
                                <button
                                  type="button"
                                  key={cat}
                                  onClick={() => handleToggleCategory(cat)}
                                  className={`px-3 py-1.5 rounded-full font-mono text-xs font-bold transition-all ${
                                    isSelected
                                      ? "bg-black text-[#FFE600] border-2 border-black"
                                      : "bg-gray-100 text-gray-700 border border-gray-300 hover:border-black"
                                  }`}
                                >
                                  {isSelected ? "✓ " : "+ "}
                                  {cat}
                                </button>
                              );
                            })}
                          </div>
                        </div>

                        {/* 2. Target Area & Urgency (2-col grid) */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-xs font-bold uppercase font-mono text-gray-700 mb-1.5">
                              2. Target Section / Element
                            </label>
                            <select
                              value={revisionTargetArea}
                              onChange={(e) => setRevisionTargetArea(e.target.value)}
                              className="w-full border border-gray-300 rounded p-2.5 text-xs font-mono font-bold bg-white text-gray-900 focus:border-black focus:outline-none"
                            >
                              <option value="Hero Section & Main Navigation">Hero Section & Main Navigation</option>
                              <option value="Product Showcase & Catalog Grid">Product Showcase & Catalog Grid</option>
                              <option value="Typography Hierarchy & Color Palette">Typography Hierarchy & Color Palette</option>
                              <option value="Checkout & Cart Experience">Checkout & Cart Experience</option>
                              <option value="Footer & Contact Form">Footer & Contact Form</option>
                              <option value="Global / Cross-Site Adjustments">Global / Cross-Site Adjustments</option>
                            </select>
                          </div>

                          <div>
                            <label className="block text-xs font-bold uppercase font-mono text-gray-700 mb-1.5">
                              3. Urgency & Priority
                            </label>
                            <div className="grid grid-cols-3 gap-2">
                              {[
                                { key: "routine", label: "Routine", desc: "Polish" },
                                { key: "important", label: "Important", desc: "Triage" },
                                { key: "blocker", label: "Blocker", desc: "Critical" },
                              ].map((p) => (
                                <button
                                  type="button"
                                  key={p.key}
                                  onClick={() => setRevisionPriority(p.key as any)}
                                  className={`p-2 rounded text-center border font-mono transition-all ${
                                    revisionPriority === p.key
                                      ? p.key === "blocker"
                                        ? "bg-rose-100 border-rose-500 text-rose-900 font-bold ring-2 ring-rose-500/30"
                                        : "bg-[#FFE600]/30 border-black text-black font-bold ring-2 ring-black/20"
                                      : "bg-gray-50 border-gray-300 text-gray-600 hover:border-black"
                                  }`}
                                >
                                  <span className="block text-xs font-bold">{p.label}</span>
                                  <span className="text-[0.62rem] text-gray-500">{p.desc}</span>
                                </button>
                              ))}
                            </div>
                          </div>
                        </div>

                        {/* 3. Detailed Instructions */}
                        <div>
                          <div className="flex items-center justify-between mb-1.5">
                            <label className="block text-xs font-bold uppercase font-mono text-gray-700">
                              4. Detailed Actionable Instructions *
                            </label>
                            <span className="text-[0.68rem] text-gray-500 font-mono">
                              Numbered points recommended
                            </span>
                          </div>
                          <textarea
                            required
                            rows={6}
                            value={revisionDetails}
                            onChange={(e) => setRevisionDetails(e.target.value)}
                            placeholder="Please list exact revision points with clarity:&#10;1. Section / Element: Describe the required change.&#10;2. Copy adjustments: Replace [current text] with [new text].&#10;3. Expected layout or visual behavior:"
                            className="w-full border border-gray-300 rounded p-3 text-xs font-mono leading-relaxed bg-white text-gray-900 focus:border-black focus:outline-none"
                          />
                          <p className="text-[0.68rem] text-gray-500 font-mono mt-1">
                            Tip: Clear, specific instructions allow the pod to execute revisions in a single rapid iteration.
                          </p>
                        </div>

                        {/* 4. Reference URL & Loom */}
                        <div>
                          <label className="block text-xs font-bold uppercase font-mono text-gray-700 mb-1.5">
                            5. Reference Link (Figma, Loom Video, or Google Doc)
                          </label>
                          <input
                            type="url"
                            value={revisionReferenceUrl}
                            onChange={(e) => setRevisionReferenceUrl(e.target.value)}
                            placeholder="https://figma.com/file/... or https://loom.com/share/..."
                            className="w-full border border-gray-300 rounded p-2.5 text-xs font-mono bg-white text-gray-900 focus:border-black focus:outline-none"
                          />
                        </div>

                        {/* 5. File Attachments */}
                        <div>
                          <label className="block text-xs font-bold uppercase font-mono text-gray-700 mb-1.5">
                            6. Attached Screenshots or Assets
                          </label>
                          <div className="flex flex-wrap gap-2 mb-2">
                            {revisionAttachments.map((att, idx) => (
                              <span
                                key={idx}
                                className="inline-flex items-center gap-1.5 bg-gray-100 border border-gray-300 rounded px-2.5 py-1 text-xs font-mono text-gray-800"
                              >
                                <span>📎 {att}</span>
                                <button
                                  type="button"
                                  onClick={() => handleRemoveAttachment(idx)}
                                  className="text-gray-400 hover:text-rose-600 font-bold"
                                >
                                  ✕
                                </button>
                              </span>
                            ))}
                          </div>
                          <div className="flex gap-2">
                            <input
                              type="text"
                              value={newAttachmentName}
                              onChange={(e) => setNewAttachmentName(e.target.value)}
                              placeholder="e.g. hero-annotated-markup.png or copy-doc.pdf"
                              className="flex-1 border border-gray-300 rounded p-2 text-xs font-mono bg-white text-gray-900 focus:border-black focus:outline-none"
                            />
                            <button
                              type="button"
                              onClick={handleAddAttachment}
                              className="px-3 py-2 bg-gray-100 border border-gray-300 font-mono text-xs font-bold rounded hover:bg-gray-200 transition-colors"
                            >
                              + Add File
                            </button>
                          </div>
                        </div>

                        {/* Requester Identity & SLA Disclaimer */}
                        <div className="bg-gray-50 border border-gray-200 rounded p-3 text-xs font-mono space-y-1">
                          <div className="flex items-center justify-between text-gray-700">
                            <span>Authorized Requester:</span>
                            <span className="font-bold text-black">{contact} ({currentClient.email})</span>
                          </div>
                          <div className="flex items-center justify-between text-gray-500 text-[0.68rem]">
                            <span>Studio Turnaround SLA:</span>
                            <span className="text-amber-800 font-bold">24–48 hours triage window</span>
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center justify-end gap-3 pt-3 border-t border-gray-200">
                          <button
                            type="button"
                            onClick={() => setIsRevisionModalOpen(false)}
                            className="px-4 py-2.5 font-mono text-xs font-bold text-gray-600 hover:text-black transition-colors"
                          >
                            Cancel
                          </button>
                          <button
                            type="submit"
                            disabled={isSubmittingRevision || !revisionDetails.trim()}
                            className="px-6 py-2.5 bg-black text-[#FFE600] font-mono text-xs font-bold uppercase tracking-wider rounded hover:bg-gray-800 transition-colors disabled:opacity-50 flex items-center gap-2 shadow-sm"
                          >
                            {isSubmittingRevision ? (
                              <>
                                <span className="h-3 w-3 rounded-full border-2 border-[#FFE600] border-t-transparent animate-spin" />
                                <span>Logging Revisions...</span>
                              </>
                            ) : (
                              <span>Submit Revision Request →</span>
                            )}
                          </button>
                        </div>
                      </form>
                    </div>
                  </div>
                )}
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
