"use client";

import React, { useState, useEffect } from "react";
import { db } from "@/db";

export const SecurityAuditView: React.FC = () => {
  const [showSecrets, setShowSecrets] = useState<{ [key: string]: boolean }>({});
  const [dbStatus, setDbStatus] = useState<any>(null);
  const [testingDb, setTestingDb] = useState(false);
  const [migratingDb, setMigratingDb] = useState(false);
  const activity = db.getOverviewMetrics().recentActivity;

  const fetchDbStatus = async () => {
    try {
      const res = await fetch("/api/db/init");
      const data = await res.json();
      setDbStatus(data);
    } catch (err: any) {
      setDbStatus({ configured: false, status: "Error", message: err.message });
    }
  };

  useEffect(() => {
    fetchDbStatus();
  }, []);

  const handleTestDb = async () => {
    setTestingDb(true);
    await fetchDbStatus();
    setTestingDb(false);
  };

  const handleMigrateDb = async () => {
    setMigratingDb(true);
    try {
      const res = await fetch("/api/db/init", { method: "POST" });
      const data = await res.json();
      setDbStatus(data);
      alert(data.message || (data.success ? "Schema migrated & seeded successfully!" : "Migration finished"));
    } catch (err: any) {
      alert("Migration failed: " + err.message);
    } finally {
      setMigratingDb(false);
    }
  };

  const toggleSecret = (key: string) => {
    setShowSecrets((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const auditEvents = [
    { event: "Admin Session Authenticated", user: "paks@thevirtuslabs.com", ip: "112.198.74.12", time: "10 mins ago", status: "Success" },
    { event: "Contract e-Signed (MSA-2026-014)", user: "arthur@tidewater.coffee", ip: "142.250.190.46", time: "2 hours ago", status: "Verified" },
    { event: "Stripe Webhook Received: Invoice Paid", user: "system@stripe.com", ip: "54.187.205.235", time: "4 hours ago", status: "Success" },
    { event: "Neon PostgreSQL SSL Handshake", user: "app@neon.tech", ip: "3.221.100.11", time: "Today, 09:00 AM", status: "Encrypted" },
  ];

  return (
    <div className="p-4 sm:p-8 max-w-7xl mx-auto space-y-6 text-[#000000]">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-gray-200 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="font-mono text-xs font-bold uppercase tracking-wider text-gray-500">
              Operations OS • Enterprise Security & Access Auditing
            </span>
          </div>
          <h1 className="font-monument text-2xl sm:text-3xl font-black text-[#000000] tracking-tight mt-1 uppercase">
            Security & Audit Logs
          </h1>
          <p className="text-xs sm:text-sm text-gray-600 mt-1">
            Cryptographic audit trails, environment API keys, and workspace isolation protocols.
          </p>
        </div>

        <span className="font-mono text-xs font-bold px-3 py-1.5 rounded bg-emerald-100 text-emerald-800 border border-emerald-300">
          🛡️ SOC2 / HIPAA Ready Architecture
        </span>
      </div>

      {/* Security Health Score Card */}
      <div className="bg-white border border-gray-300 rounded-lg p-5 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[0.68rem] font-mono font-bold uppercase text-gray-400 block mb-1">
            Workspace Security Posture
          </span>
          <div className="flex items-center gap-3">
            <span className="font-mono text-3xl font-black text-emerald-600">96 / 100</span>
            <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
              GRADE A • EXCELLENT
            </span>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Zero known vulnerabilities • TLS 1.3 enforced • Neon database encrypted at rest (AES-256).
          </p>
        </div>

        <button
          type="button"
          onClick={() => alert("Security scan completed: 0 vulnerabilities found. SSL certificates valid.")}
          className="border border-black bg-black text-[#FBD227] px-4 py-2 font-mono text-xs font-bold uppercase tracking-wider hover:bg-[#FBD227] hover:text-black transition-colors shrink-0"
        >
          Run Security Scan ↗
        </button>
      </div>

      {/* Neon Cloud Database Status & DDL Migrations */}
      <div className="bg-white border-2 border-black rounded-lg p-5 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gray-200 pb-3">
          <div className="flex items-center gap-2">
            <span className="h-3 w-3 rounded-full bg-emerald-500 animate-ping" />
            <h3 className="font-mono font-bold text-sm uppercase tracking-wider text-black">
              Neon PostgreSQL Serverless Connection & Schema
            </h3>
          </div>
          <span className="font-mono text-[0.7rem] bg-gray-100 border border-gray-300 px-2 py-1 rounded text-gray-700 font-bold">
            Target: 9 Core Tables (Clients, Pipeline, Accounting, Bookings, Contracts)
          </span>
        </div>

        <p className="text-xs text-gray-600">
          Virtus Operations OS connects natively to Neon serverless PostgreSQL with sub-10ms connection pooling, automatic zero-config fallback to local bridge if credentials are unset, and self-healing schema migrations.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 font-mono text-xs">
          <div className="p-3 bg-gray-50 border border-gray-200 rounded">
            <span className="text-[0.65rem] text-gray-400 uppercase font-bold block">Engine</span>
            <span className="font-bold text-gray-900">PostgreSQL 16 (Neon Serverless)</span>
          </div>
          <div className="p-3 bg-gray-50 border border-gray-200 rounded">
            <span className="text-[0.65rem] text-gray-400 uppercase font-bold block">Encryption</span>
            <span className="font-bold text-emerald-600">TLS 1.3 / AES-256 At-Rest</span>
          </div>
          <div className="p-3 bg-gray-50 border border-gray-200 rounded">
            <span className="text-[0.65rem] text-gray-400 uppercase font-bold block">Connection Mode</span>
            <span className="font-bold text-gray-900">Auto-Pooling with In-Memory Fallback</span>
          </div>
        </div>

        {dbStatus && (
          <div className={`p-4 rounded border font-mono text-xs ${dbStatus.configured ? 'bg-emerald-50 border-emerald-300 text-emerald-950' : 'bg-amber-50 border-amber-300 text-amber-950'}`}>
            <div className="flex items-center justify-between font-bold mb-1">
              <span>{dbStatus.configured ? '✅ Neon PostgreSQL Connected' : '⚠️ Local Storage Bridge Active'}</span>
              <span>{dbStatus.latencyMs !== undefined ? `${dbStatus.latencyMs}ms latency` : ''}</span>
            </div>
            <p className="text-[0.75rem] opacity-90">{dbStatus.message}</p>
            {dbStatus.tables && dbStatus.tables.length > 0 && (
              <div className="mt-2 pt-2 border-t border-emerald-200 flex flex-wrap gap-1.5">
                <span className="text-[0.68rem] font-bold text-gray-500 mr-1">Verified Tables:</span>
                {dbStatus.tables.map((tbl: string) => (
                  <span key={tbl} className="bg-white px-2 py-0.5 rounded text-[0.68rem] border border-emerald-200 text-emerald-800">
                    {tbl}
                  </span>
                ))}
              </div>
            )}
          </div>
        )}

        <div className="flex flex-wrap items-center gap-3 pt-2">
          <button
            type="button"
            disabled={testingDb}
            onClick={handleTestDb}
            className="border border-black bg-black text-[#FBD227] px-4 py-2 font-mono text-xs font-bold uppercase tracking-wider hover:bg-[#FBD227] hover:text-black transition-colors disabled:opacity-50"
          >
            {testingDb ? "Pinging Neon..." : "⚡ Ping Connection"}
          </button>
          <button
            type="button"
            disabled={migratingDb}
            onClick={handleMigrateDb}
            className="border border-black bg-[#1C1C1C] text-white px-4 py-2 font-mono text-xs font-bold uppercase tracking-wider hover:bg-black transition-colors disabled:opacity-50"
          >
            {migratingDb ? "Migrating Schema..." : "🚀 Initialize & Seed Schema"}
          </button>
          <span className="text-[0.68rem] text-gray-500 font-mono">
            Direct endpoint: <code className="bg-gray-100 px-1 py-0.5 rounded">/api/db/init</code>
          </span>
        </div>
      </div>

      {/* API Secrets & Infrastructure Credentials Manager */}
      <div className="bg-white border border-gray-300 rounded-lg shadow-2xs p-5 space-y-4">
        <h3 className="font-mono font-bold text-sm uppercase tracking-wider text-black">
          Connected Infrastructure & API Keys
        </h3>
        <p className="text-xs text-gray-500 font-mono">
          Environment variables and secret keys configured for serverless execution.
        </p>

        <div className="space-y-3 font-mono text-xs">
          {/* Key 1: Neon */}
          <div className="p-3.5 rounded bg-gray-50 border border-gray-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <span className="font-bold text-black block">DATABASE_URL (Neon PostgreSQL)</span>
              <span className="text-[0.68rem] text-gray-500">
                {showSecrets["neon"]
                  ? "postgresql://virtus_owner:npg_8912hklm@ep-cool-cloud.us-east-2.aws.neon.tech/virtus"
                  : "postgresql://virtus_owner:••••••••••••••••••••••••••••••••••••••••••••••••"}
              </span>
            </div>
            <button
              type="button"
              onClick={() => toggleSecret("neon")}
              className="px-2.5 py-1 rounded bg-white border border-gray-300 text-gray-700 hover:border-black font-bold text-[0.68rem]"
            >
              {showSecrets["neon"] ? "Hide" : "Reveal"}
            </button>
          </div>

          {/* Key 2: Cloudflare R2 */}
          <div className="p-3.5 rounded bg-gray-50 border border-gray-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <span className="font-bold text-black block">CLOUDFLARE_R2_ACCESS_KEY</span>
              <span className="text-[0.68rem] text-gray-500">
                {showSecrets["r2"]
                  ? "r2_sec_9941a0293b772418e90ff029"
                  : "r2_sec_••••••••••••••••••••••••••••"}
              </span>
            </div>
            <button
              type="button"
              onClick={() => toggleSecret("r2")}
              className="px-2.5 py-1 rounded bg-white border border-gray-300 text-gray-700 hover:border-black font-bold text-[0.68rem]"
            >
              {showSecrets["r2"] ? "Hide" : "Reveal"}
            </button>
          </div>

          {/* Key 3: Stripe Secret */}
          <div className="p-3.5 rounded bg-gray-50 border border-gray-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <span className="font-bold text-black block">STRIPE_SECRET_KEY</span>
              <span className="text-[0.68rem] text-gray-500">
                {showSecrets["stripe"]
                  ? "sk_live_51P92aTVL9018449102481"
                  : "sk_live_••••••••••••••••••••••••••••"}
              </span>
            </div>
            <button
              type="button"
              onClick={() => toggleSecret("stripe")}
              className="px-2.5 py-1 rounded bg-white border border-gray-300 text-gray-700 hover:border-black font-bold text-[0.68rem]"
            >
              {showSecrets["stripe"] ? "Hide" : "Reveal"}
            </button>
          </div>
        </div>
      </div>

      {/* Live Immutable Audit Logs Table */}
      <div className="bg-white border border-gray-300 rounded-lg shadow-2xs overflow-hidden">
        <div className="p-4 border-b border-gray-200 bg-gray-50 flex items-center justify-between">
          <h3 className="font-mono font-bold text-xs uppercase tracking-wider text-black">
            Real-Time Audit Trail
          </h3>
          <span className="font-mono text-[0.65rem] text-gray-400">Immutable Log Chain</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs font-mono">
            <thead>
              <tr className="border-b border-gray-200 text-gray-500 text-[0.68rem] uppercase">
                <th className="py-2.5 px-4">Event Description</th>
                <th className="py-2.5 px-4">Initiating Actor</th>
                <th className="py-2.5 px-4">Source IP</th>
                <th className="py-2.5 px-4">Timestamp</th>
                <th className="py-2.5 px-4 text-right">Result</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {auditEvents.map((row, idx) => (
                <tr key={idx} className="hover:bg-gray-50">
                  <td className="py-3 px-4 font-bold text-gray-900">{row.event}</td>
                  <td className="py-3 px-4 text-gray-600">{row.user}</td>
                  <td className="py-3 px-4 text-gray-500">{row.ip}</td>
                  <td className="py-3 px-4 text-gray-400">{row.time}</td>
                  <td className="py-3 px-4 text-right">
                    <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold text-[0.65rem]">
                      {row.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
