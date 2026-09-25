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
      <div className="relative w-full max-w-4xl border-4 border-[#FBD227] bg-[#FFFFFF] text-[#000000] shadow-2xl rounded-sm overflow-hidden animate-scaleUp">
        
        {/* Top Header Bar */}
        <div className="flex items-center justify-between border-b-2 border-[#000000] bg-white px-5 py-3 sm:px-6">
          <span className="font-sans text-xs font-bold uppercase tracking-[0.16em] text-[#000000]">
            WORKSPACE PORTAL · TEAM 7641
          </span>
          <button
            type="button"
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center bg-[#FBD227] border-2 border-[#000000] text-[#000000] font-bold text-lg hover:bg-black hover:text-[#FBD227] transition-colors"
            aria-label="Close portal modal"
          >
            ✕
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 sm:p-10">
          {/* Eyebrow & Badge */}
          <div className="flex items-center justify-between gap-4">
            <span className="font-sans text-xs font-bold uppercase tracking-[0.18em] text-[#000000]/70">
              SECURE WORKSPACE ACCESS
            </span>
            <span className="bg-[#FBD227] border-2 border-[#000000] px-3 py-1 font-sans text-xs font-bold tracking-wider text-[#000000]">
              TEAM 7641
            </span>
          </div>

          {/* Heading */}
          <h2 className="mt-3 font-monument text-3xl sm:text-5xl font-bold tracking-tight text-[#000000]">
            CHOOSE YOUR PORTAL.
          </h2>

          <p className="mt-3 max-w-[58ch] text-sm sm:text-base leading-relaxed text-[#000000]/80 font-medium">
            Choose the workspace door that matches your role. Your invitation and account permissions determine what you can see and do next.
          </p>

          {/* 3 Portal Doors (Cards) */}
          <div className="mt-8 grid grid-cols-1 gap-5 md:grid-cols-3">
            {/* Door 01: ADMIN */}
            <button
              type="button"
              onClick={() => onSelectRole("admin")}
              className="group flex flex-col justify-between text-left border-2 border-[#000000] bg-white p-6 transition-all duration-200 hover:-translate-y-1 hover:shadow-[6px_6px_0px_0px_#000000] hover:border-[#000000] active:translate-y-0"
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="font-sans text-xs font-bold text-[#000000]/60">01</span>
                  <span className="font-sans text-base font-bold text-[#000000] transition-transform duration-200 group-hover:translate-x-1 group-hover:-translate-y-1">
                    ↗
                  </span>
                </div>
                <h3 className="mt-4 font-monument text-xl sm:text-2xl font-bold text-[#000000]">
                  ADMIN
                </h3>
                <p className="mt-3 text-xs sm:text-sm leading-relaxed text-[#000000]/80 font-normal">
                  Manage leads, clients, projects, billing, contracts and the team workspace.
                </p>
              </div>

              <div className="mt-8 pt-4 border-t-2 border-[#000000]">
                <span className="font-sans text-[0.7rem] font-bold uppercase tracking-[0.14em] text-[#000000]">
                  OPERATIONS DESK
                </span>
              </div>
            </button>

            {/* Door 02: TEAM MEMBER */}
            <button
              type="button"
              onClick={() => onSelectRole("team")}
              className="group flex flex-col justify-between text-left border-2 border-[#000000] bg-white p-6 transition-all duration-200 hover:-translate-y-1 hover:shadow-[6px_6px_0px_0px_#000000] hover:border-[#000000] active:translate-y-0"
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="font-sans text-xs font-bold text-[#000000]/60">02</span>
                  <span className="font-sans text-base font-bold text-[#000000] transition-transform duration-200 group-hover:translate-x-1 group-hover:-translate-y-1">
                    ↗
                  </span>
                </div>
                <h3 className="mt-4 font-monument text-xl sm:text-2xl font-bold text-[#000000]">
                  TEAM MEMBER
                </h3>
                <p className="mt-3 text-xs sm:text-sm leading-relaxed text-[#000000]/80 font-normal">
                  See assigned work, update task progress and keep delivery moving.
                </p>
              </div>

              <div className="mt-8 pt-4 border-t-2 border-[#000000]">
                <span className="font-sans text-[0.7rem] font-bold uppercase tracking-[0.14em] text-[#000000]">
                  DELIVERY FLOOR
                </span>
              </div>
            </button>

            {/* Door 03: CLIENT */}
            <button
              type="button"
              onClick={() => onSelectRole("client")}
              className="group flex flex-col justify-between text-left border-2 border-[#000000] bg-white p-6 transition-all duration-200 hover:-translate-y-1 hover:shadow-[6px_6px_0px_0px_#000000] hover:border-[#000000] active:translate-y-0"
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="font-sans text-xs font-bold text-[#000000]/60">03</span>
                  <span className="font-sans text-base font-bold text-[#000000] transition-transform duration-200 group-hover:translate-x-1 group-hover:-translate-y-1">
                    ↗
                  </span>
                </div>
                <h3 className="mt-4 font-monument text-xl sm:text-2xl font-bold text-[#000000]">
                  CLIENT
                </h3>
                <p className="mt-3 text-xs sm:text-sm leading-relaxed text-[#000000]/80 font-normal">
                  Review project progress, approvals, contracts, invoices and deliverables.
                </p>
              </div>

              <div className="mt-8 pt-4 border-t-2 border-[#000000]">
                <span className="font-sans text-[0.7rem] font-bold uppercase tracking-[0.14em] text-[#000000]">
                  CLIENT ROOM
                </span>
              </div>
            </button>
          </div>

          {/* Bottom Disclaimer */}
          <div className="mt-8 border-t border-[#000000]/20 pt-4">
            <p className="text-xs text-[#000000]/70 font-sans">
              Invitation-only access. If you do not have an account yet, ask an administrator to invite you.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
