"use client";

import React from "react";

export type PortalRole = "admin" | "team" | "client";

interface PortalModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectRole: (role: PortalRole) => void;
}

export const PortalModal: React.FC<PortalModalProps> = ({
  isOpen,
  onClose,
  onSelectRole,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-md animate-fadeIn">
      {/* Outer Modal Container with Industrial Yellow Outline */}
      <div className="relative w-full max-w-4xl border-4 border-[#FFE600] bg-[#F3F4F6] text-[#0F1B2A] shadow-2xl rounded-sm overflow-hidden animate-scaleUp">
        
        {/* Top Header Bar */}
        <div className="flex items-center justify-between border-b-2 border-[#0F1B2A] bg-white px-5 py-3 sm:px-6">
          <span className="font-mono text-xs font-bold uppercase tracking-[0.16em] text-[#0F1B2A]">
            WORKSPACE PORTAL · TEAM 7641
          </span>
          <button
            type="button"
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center bg-[#FFE600] border-2 border-[#0F1B2A] text-[#0F1B2A] font-bold text-lg hover:bg-black hover:text-[#FFE600] transition-colors"
            aria-label="Close portal modal"
          >
            ✕
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 sm:p-10">
          {/* Eyebrow & Badge */}
          <div className="flex items-center justify-between gap-4">
            <span className="font-mono text-xs font-bold uppercase tracking-[0.18em] text-[#0F1B2A]/70">
              SECURE WORKSPACE ACCESS
            </span>
            <span className="bg-[#FFE600] border-2 border-[#0F1B2A] px-3 py-1 font-mono text-xs font-black tracking-wider text-[#0F1B2A]">
              TEAM 7641
            </span>
          </div>

          {/* Heading */}
          <h2 className="mt-3 font-monument text-3xl sm:text-5xl font-black tracking-tight text-[#0F1B2A]">
            CHOOSE YOUR PORTAL.
          </h2>

          <p className="mt-3 max-w-[58ch] text-sm sm:text-base leading-relaxed text-[#0F1B2A]/80 font-medium">
            Choose the workspace door that matches your role. Your invitation and account permissions determine what you can see and do next.
          </p>

          {/* 3 Portal Doors (Cards) */}
          <div className="mt-8 grid grid-cols-1 gap-5 md:grid-cols-3">
            {/* Door 01: ADMIN */}
            <button
              type="button"
              onClick={() => onSelectRole("admin")}
              className="group flex flex-col justify-between text-left border-2 border-[#0F1B2A] bg-white p-6 transition-all duration-200 hover:-translate-y-1 hover:shadow-[6px_6px_0px_0px_#0F1B2A] hover:border-[#0F1B2A] active:translate-y-0"
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-bold text-[#0F1B2A]/60">01</span>
                  <span className="font-mono text-base font-bold text-[#0F1B2A] transition-transform duration-200 group-hover:translate-x-1 group-hover:-translate-y-1">
                    ↗
                  </span>
                </div>
                <h3 className="mt-4 font-monument text-xl sm:text-2xl font-black text-[#0F1B2A]">
                  ADMIN
                </h3>
                <p className="mt-3 text-xs sm:text-sm leading-relaxed text-[#0F1B2A]/80 font-normal">
                  Manage leads, clients, projects, billing, contracts and the team workspace.
                </p>
              </div>

              <div className="mt-8 pt-4 border-t-2 border-[#0F1B2A]">
                <span className="font-mono text-[0.7rem] font-bold uppercase tracking-[0.14em] text-[#0F1B2A]">
                  OPERATIONS DESK
                </span>
              </div>
            </button>

            {/* Door 02: TEAM MEMBER */}
            <button
              type="button"
              onClick={() => onSelectRole("team")}
              className="group flex flex-col justify-between text-left border-2 border-[#0F1B2A] bg-white p-6 transition-all duration-200 hover:-translate-y-1 hover:shadow-[6px_6px_0px_0px_#0F1B2A] hover:border-[#0F1B2A] active:translate-y-0"
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-bold text-[#0F1B2A]/60">02</span>
                  <span className="font-mono text-base font-bold text-[#0F1B2A] transition-transform duration-200 group-hover:translate-x-1 group-hover:-translate-y-1">
                    ↗
                  </span>
                </div>
                <h3 className="mt-4 font-monument text-xl sm:text-2xl font-black text-[#0F1B2A]">
                  TEAM MEMBER
                </h3>
                <p className="mt-3 text-xs sm:text-sm leading-relaxed text-[#0F1B2A]/80 font-normal">
                  See assigned work, update task progress and keep delivery moving.
                </p>
              </div>

              <div className="mt-8 pt-4 border-t-2 border-[#0F1B2A]">
                <span className="font-mono text-[0.7rem] font-bold uppercase tracking-[0.14em] text-[#0F1B2A]">
                  DELIVERY FLOOR
                </span>
              </div>
            </button>

            {/* Door 03: CLIENT */}
            <button
              type="button"
              onClick={() => onSelectRole("client")}
              className="group flex flex-col justify-between text-left border-2 border-[#0F1B2A] bg-white p-6 transition-all duration-200 hover:-translate-y-1 hover:shadow-[6px_6px_0px_0px_#0F1B2A] hover:border-[#0F1B2A] active:translate-y-0"
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-bold text-[#0F1B2A]/60">03</span>
                  <span className="font-mono text-base font-bold text-[#0F1B2A] transition-transform duration-200 group-hover:translate-x-1 group-hover:-translate-y-1">
                    ↗
                  </span>
                </div>
                <h3 className="mt-4 font-monument text-xl sm:text-2xl font-black text-[#0F1B2A]">
                  CLIENT
                </h3>
                <p className="mt-3 text-xs sm:text-sm leading-relaxed text-[#0F1B2A]/80 font-normal">
                  Review project progress, approvals, contracts, invoices and deliverables.
                </p>
              </div>

              <div className="mt-8 pt-4 border-t-2 border-[#0F1B2A]">
                <span className="font-mono text-[0.7rem] font-bold uppercase tracking-[0.14em] text-[#0F1B2A]">
                  CLIENT ROOM
                </span>
              </div>
            </button>
          </div>

          {/* Bottom Disclaimer */}
          <div className="mt-8 border-t border-[#0F1B2A]/20 pt-4">
            <p className="text-xs text-[#0F1B2A]/70 font-mono">
              Invitation-only access. If you do not have an account yet, ask an administrator to invite you.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
