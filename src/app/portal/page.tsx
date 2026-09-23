import React from "react";
import Link from "next/link";
import { Logo } from "@/components/public/Logo";

export const metadata = {
  title: "Workspace Portal · The Virtus Labs",
  description: "Secure gateway for Admin, Team Members, and Clients.",
};

export default function PortalGatewayPage() {
  return (
    <div className="min-h-screen bg-[#0A1118] text-[#F3F4F6] flex flex-col justify-between selection:bg-[#FFE600] selection:text-black">
      {/* Header */}
      <header className="border-b border-white/10 px-6 py-4 flex items-center justify-between">
        <Link href="/" className="hover:opacity-85 transition-opacity">
          <Logo />
        </Link>
        <Link
          href="/"
          className="text-xs font-mono text-gray-400 hover:text-[#FFE600] transition-colors"
        >
          ← Return to Agency Showcase
        </Link>
      </header>

      {/* Main Container */}
      <main className="flex-1 flex items-center justify-center p-4 sm:p-8">
        <div className="w-full max-w-4xl border-4 border-[#FFE600] bg-[#F3F4F6] text-[#0F1B2A] shadow-[16px_16px_0px_0px_rgba(0,0,0,0.85)] rounded-sm overflow-hidden">
          {/* Header bar */}
          <div className="flex items-center justify-between border-b-2 border-[#0F1B2A] bg-white px-6 py-3.5">
            <span className="font-mono text-xs font-bold uppercase tracking-[0.18em] text-[#0F1B2A]">
              WORKSPACE PORTAL GATEWAY · TEAM 7641
            </span>
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="font-mono text-[0.68rem] text-emerald-800 font-bold bg-emerald-100 px-2 py-0.5 rounded border border-emerald-300">
                Cloud Connected
              </span>
            </div>
          </div>

          <div className="p-6 sm:p-10">
            <div className="flex items-center justify-between gap-4">
              <span className="font-mono text-xs font-bold uppercase tracking-[0.18em] text-[#0F1B2A]/70">
                SECURE WORKSPACE ACCESS
              </span>
              <span className="bg-[#FFE600] border-2 border-[#0F1B2A] px-3 py-1 font-mono text-xs font-black tracking-wider text-[#0F1B2A]">
                TEAM 7641
              </span>
            </div>

            <h1 className="mt-3 font-monument text-3xl sm:text-5xl font-black tracking-tight text-[#0F1B2A] uppercase">
              Choose Your Portal.
            </h1>

            <p className="mt-3 max-w-[58ch] text-sm sm:text-base leading-relaxed text-[#0F1B2A]/80 font-medium">
              Select your workspace door. Your invitation and account permissions determine what you can view and execute.
            </p>

            {/* 3 Portal Doors */}
            <div className="mt-8 grid grid-cols-1 gap-5 md:grid-cols-3">
              {/* Door 01: ADMIN */}
              <Link
                href="/admin"
                className="group flex flex-col justify-between border-2 border-[#0F1B2A] bg-white p-6 transition-all duration-200 hover:-translate-y-1 hover:shadow-[6px_6px_0px_0px_#0F1B2A] active:translate-y-0"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold text-[#0F1B2A]/60">01</span>
                    <span className="font-mono text-base font-bold text-[#0F1B2A] transition-transform duration-200 group-hover:translate-x-1 group-hover:-translate-y-1">
                      ↗
                    </span>
                  </div>
                  <h2 className="mt-4 font-monument text-xl sm:text-2xl font-black text-[#0F1B2A]">
                    ADMIN
                  </h2>
                  <p className="mt-3 text-xs sm:text-sm leading-relaxed text-[#0F1B2A]/80 font-normal">
                    Manage leads, clients, projects, billing, contracts and studio infrastructure.
                  </p>
                </div>

                <div className="mt-8 pt-4 border-t-2 border-[#0F1B2A] flex items-center justify-between">
                  <span className="font-mono text-[0.7rem] font-bold uppercase tracking-[0.14em] text-[#0F1B2A]">
                    OPERATIONS DESK
                  </span>
                  <span className="text-xs font-mono font-bold text-[#0F1B2A]">Enter →</span>
                </div>
              </Link>

              {/* Door 02: TEAM MEMBER */}
              <Link
                href="/team"
                className="group flex flex-col justify-between border-2 border-[#0F1B2A] bg-white p-6 transition-all duration-200 hover:-translate-y-1 hover:shadow-[6px_6px_0px_0px_#0F1B2A] active:translate-y-0"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold text-[#0F1B2A]/60">02</span>
                    <span className="font-mono text-base font-bold text-[#0F1B2A] transition-transform duration-200 group-hover:translate-x-1 group-hover:-translate-y-1">
                      ↗
                    </span>
                  </div>
                  <h2 className="mt-4 font-monument text-xl sm:text-2xl font-black text-[#0F1B2A]">
                    TEAM MEMBER
                  </h2>
                  <p className="mt-3 text-xs sm:text-sm leading-relaxed text-[#0F1B2A]/80 font-normal">
                    Assigned delivery tasks, client deliverable files, calendar schedules, and studio comms.
                  </p>
                </div>

                <div className="mt-8 pt-4 border-t-2 border-[#0F1B2A] flex items-center justify-between">
                  <span className="font-mono text-[0.7rem] font-bold uppercase tracking-[0.14em] text-[#0F1B2A]">
                    SPRINT FLOOR
                  </span>
                  <span className="text-xs font-mono font-bold text-[#0F1B2A]">Enter →</span>
                </div>
              </Link>

              {/* Door 03: CLIENT */}
              <Link
                href="/client"
                className="group flex flex-col justify-between border-2 border-[#0F1B2A] bg-white p-6 transition-all duration-200 hover:-translate-y-1 hover:shadow-[6px_6px_0px_0px_#0F1B2A] active:translate-y-0"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold text-[#0F1B2A]/60">03</span>
                    <span className="font-mono text-base font-bold text-[#0F1B2A] transition-transform duration-200 group-hover:translate-x-1 group-hover:-translate-y-1">
                      ↗
                    </span>
                  </div>
                  <h2 className="mt-4 font-monument text-xl sm:text-2xl font-black text-[#0F1B2A]">
                    CLIENT
                  </h2>
                  <p className="mt-3 text-xs sm:text-sm leading-relaxed text-[#0F1B2A]/80 font-normal">
                    Review milestones, download deliverables, approve revisions, and settle invoices.
                  </p>
                </div>

                <div className="mt-8 pt-4 border-t-2 border-[#0F1B2A] flex items-center justify-between">
                  <span className="font-mono text-[0.7rem] font-bold uppercase tracking-[0.14em] text-[#0F1B2A]">
                    CLIENT ROOM
                  </span>
                  <span className="text-xs font-mono font-bold text-[#0F1B2A]">Enter →</span>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/10 px-6 py-4 text-center font-mono text-xs text-gray-500">
        The Virtus Labs Operations OS · End-to-end Encrypted · SOC2 Compliant
      </footer>
    </div>
  );
}
