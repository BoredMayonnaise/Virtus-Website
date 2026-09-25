"use client";

import React, { useState } from "react";
import { db } from "@/db";

export const ReportsView: React.FC = () => {
  const [timeRange, setTimeRange] = useState("Q3 2026");
  const invoices = db.getInvoices();
  const opportunities = db.getOpportunities();
  const projects = db.getProjects();

  const totalCollected = invoices.filter((i) => i.status === "Paid").reduce((a, b) => a + b.amount, 0);
  const totalPipeline = opportunities.reduce((a, b) => a + b.dealValue, 0);
  const dealsWon = opportunities.filter((o) => o.stage === "won").length;
  const winRate = Math.round((dealsWon / (opportunities.length || 1)) * 100);

  const disciplineMargins = [
    { discipline: "Brand & Creative Identity", margin: 88, color: "bg-[#FBD227]" },
    { discipline: "Web Flagship & Next.js Builds", margin: 82, color: "bg-[#FBD227]" },
    { discipline: "Interactive Motion & 3D Renders", margin: 76, color: "bg-[#DD7230]" },
    { discipline: "Automated Patient / Client Portals", margin: 85, color: "bg-[#854D27]" },
  ];

  return (
    <div className="p-4 sm:p-8 max-w-7xl mx-auto space-y-6 text-[#000000]">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-gray-200 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-purple-500 animate-pulse" />
            <span className="font-mono text-xs font-bold uppercase tracking-wider text-gray-500">
              Operations OS • Studio Intelligence & Financial Analytics
            </span>
          </div>
          <h1 className="font-monument text-2xl sm:text-3xl font-black text-[#000000] tracking-tight mt-1 uppercase">
            Performance Reports
          </h1>
          <p className="text-xs sm:text-sm text-gray-600 mt-1">
            Aggregate studio efficiency metrics, pipeline win rates, gross margin attribution, and revenue pacing.
          </p>
        </div>

        <div className="flex items-center gap-2 font-mono text-xs">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="border border-gray-300 rounded px-3 py-1.5 bg-white font-bold text-gray-800"
          >
            <option value="This Month">This Month</option>
            <option value="Q3 2026">Q3 2026 (Current)</option>
            <option value="Year to Date">Year to Date (2026)</option>
          </select>
          <button
            type="button"
            onClick={() => alert("Exporting studio performance summary (PDF)")}
            className="border-2 border-black bg-black text-[#FBD227] px-3.5 py-1.5 font-bold uppercase tracking-wider hover:bg-[#FBD227] hover:text-black transition-colors"
          >
            Export PDF ↓
          </button>
        </div>
      </div>

      {/* 4 Summary Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-gray-300 p-4 rounded-lg shadow-2xs">
          <span className="font-mono text-xs text-gray-500 block mb-1">Pipeline Win Rate</span>
          <div className="flex items-baseline justify-between">
            <span className="font-mono text-2xl font-black text-black">{winRate}%</span>
            <span className="font-mono text-[0.68rem] text-emerald-600 font-bold">↗ +12% QoQ</span>
          </div>
        </div>

        <div className="bg-white border border-gray-300 p-4 rounded-lg shadow-2xs">
          <span className="font-mono text-xs text-gray-500 block mb-1">Total Booked Volume</span>
          <div className="flex items-baseline justify-between">
            <span className="font-mono text-2xl font-black text-black">
              ${(totalCollected + totalPipeline).toLocaleString()}
            </span>
            <span className="font-mono text-[0.68rem] text-emerald-600 font-bold">On Target</span>
          </div>
        </div>

        <div className="bg-white border border-gray-300 p-4 rounded-lg shadow-2xs">
          <span className="font-mono text-xs text-gray-500 block mb-1">Sprint On-Time Velocity</span>
          <div className="flex items-baseline justify-between">
            <span className="font-mono text-2xl font-black text-emerald-600">94.2%</span>
            <span className="font-mono text-[0.68rem] text-gray-400 font-bold">0 Overdue</span>
          </div>
        </div>

        <div className="bg-white border border-gray-300 p-4 rounded-lg shadow-2xs">
          <span className="font-mono text-xs text-gray-500 block mb-1">Average Deal Size</span>
          <div className="flex items-baseline justify-between">
            <span className="font-mono text-2xl font-black text-black">$6,350</span>
            <span className="font-mono text-[0.68rem] text-emerald-600 font-bold">Tier 2/3</span>
          </div>
        </div>
      </div>

      {/* Discipline Profit Margins & Service Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white border border-gray-300 rounded-lg p-5 shadow-2xs">
          <h3 className="font-mono font-bold text-sm uppercase tracking-wider text-black mb-4">
            Gross Margin by Discipline
          </h3>
          <div className="space-y-4">
            {disciplineMargins.map((item, idx) => (
              <div key={idx}>
                <div className="flex justify-between font-mono text-xs mb-1">
                  <span className="text-gray-700 font-bold">{item.discipline}</span>
                  <span className="font-black text-black">{item.margin}% margin</span>
                </div>
                <div className="w-full bg-gray-100 h-2.5 rounded-full overflow-hidden">
                  <div
                    className={`${item.color} h-full rounded-full`}
                    style={{ width: `${item.margin}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Project Health & Risk Distribution */}
        <div className="bg-white border border-gray-300 rounded-lg p-5 shadow-2xs">
          <h3 className="font-mono font-bold text-sm uppercase tracking-wider text-black mb-4">
            Delivery Portfolio Health
          </h3>
          <div className="space-y-3 font-mono text-xs">
            {projects.map((p) => (
              <div
                key={p.id}
                className="p-3 rounded bg-gray-50 border border-gray-200 flex items-center justify-between"
              >
                <div>
                  <span className="font-bold text-black block">{p.title}</span>
                  <span className="text-[0.68rem] text-gray-500">
                    Phase: {p.phase} • Progress: {p.progress}%
                  </span>
                </div>
                <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold text-[0.65rem]">
                  {p.riskLevel}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
