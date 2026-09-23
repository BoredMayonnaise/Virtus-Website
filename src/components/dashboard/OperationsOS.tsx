"use client";

import React, { useState, useEffect } from "react";
import { CommandCenterOverview } from "./CommandCenterOverview";
import { PipelineView } from "./PipelineView";
import { MediaLibraryView } from "./MediaLibraryView";
import { ProjectsTasksView } from "./ProjectsTasksView";
import { ClientRoomView } from "./ClientRoomView";
import { BookingsView } from "./BookingsView";
import { ClientsView } from "./ClientsView";
import { ProposalsView } from "./ProposalsView";
import { ContractsView } from "./ContractsView";
import { AccountingView } from "./AccountingView";
import { BusinessEmailView } from "./BusinessEmailView";
import { ReportsView } from "./ReportsView";
import { UsersRolesView } from "./UsersRolesView";
import { SecurityAuditView } from "./SecurityAuditView";
import { WorkspaceSettingsView } from "./WorkspaceSettingsView";
import { PortalRole } from "../portal/PortalModal";

interface OperationsOSProps {
  initialRole?: PortalRole;
  onExit: () => void;
}

export const OperationsOS: React.FC<OperationsOSProps> = ({
  initialRole = "admin",
  onExit,
}) => {
  const [role, setRole] = useState<PortalRole>(initialRole);
  const [activeTab, setActiveTab] = useState<string>(
    initialRole === "client" ? "client_room" : initialRole === "team" ? "tasks" : "overview"
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [dbStatus, setDbStatus] = useState<{ configured?: boolean; mode?: string; latencyMs?: number } | null>(null);

  useEffect(() => {
    fetch("/api/db/init")
      .then((res) => res.json())
      .then((data) => setDbStatus(data))
      .catch(() => setDbStatus({ configured: false, mode: "local_fallback", latencyMs: 0 }));
  }, []);

  // Role simulation states:
  const [activeTeamMember, setActiveTeamMember] = useState<string>("Kai (Brand Lead)");
  const [activeClientId, setActiveClientId] = useState<string>("cli-1");

  // Admin Sidebar Items (Full Access)
  const adminWorkspaceItems = [
    { id: "overview", label: "Overview", icon: "⊞" },
    { id: "leads", label: "Leads", icon: "⚡" },
    { id: "clients", label: "Clients", icon: "👥" },
    { id: "bookings", label: "Bookings", icon: "📅" },
    { id: "proposals", label: "Proposals", icon: "📄" },
    { id: "contracts", label: "Contracts", icon: "✍" },
    { id: "projects", label: "Projects", icon: "📁" },
    { id: "tasks", label: "Team tasks", icon: "✓" },
    { id: "accounting", label: "Accounting", icon: "📊" },
    { id: "library", label: "Library", icon: "🗂" },
    { id: "email", label: "Business email", icon: "✉" },
  ];

  const adminManageItems = [
    { id: "reports", label: "Reports", icon: "📈" },
    { id: "users", label: "Users & roles", icon: "👤" },
    { id: "security", label: "Security", icon: "🛡" },
    { id: "settings", label: "Settings", icon: "⚙" },
  ];

  // Team Member Sidebar Items (Scoped Delivery Floor Only)
  const teamWorkspaceItems = [
    { id: "tasks", label: "My Sprint Tasks", icon: "✓" },
    { id: "projects", label: "My Projects", icon: "📁" },
    { id: "bookings", label: "My Schedule", icon: "📅" },
    { id: "library", label: "Studio Assets", icon: "🗂" },
  ];

  const activeSidebarItems = role === "admin" ? adminWorkspaceItems : teamWorkspaceItems;

  const handleRoleChange = (newRole: PortalRole) => {
    setRole(newRole);
    if (newRole === "client") {
      setActiveTab("client_room");
    } else if (newRole === "team") {
      setActiveTab("tasks");
    } else {
      setActiveTab("overview");
    }
  };

  return (
    <div className="min-h-screen bg-[#F3F4F6] text-[#0F1B2A] flex flex-col font-sans">
      {/* Top Global Bar */}
      <header className="sticky top-0 z-30 flex h-14 w-full items-center justify-between border-b border-gray-300 bg-white px-4 sm:px-6 shadow-2xs">
        {/* Search Input or Client Branding */}
        <div className="flex items-center gap-3 w-72 sm:w-96">
          {role === "client" ? (
            <div className="flex items-center gap-2">
              <div className="h-6 w-6 rounded bg-[#2E1F27] text-[#FFE600] flex items-center justify-center font-bold text-xs font-mono">
                V
              </div>
              <span className="font-mono text-xs font-bold uppercase tracking-wider text-black">
                The Virtus Labs · Client Portal
              </span>
            </div>
          ) : (
            <div className="relative w-full">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={role === "admin" ? "SEARCH WORKSPACE..." : "SEARCH SPRINT TASKS..."}
                className="w-full rounded border border-gray-300 bg-gray-50 px-3 py-1.5 font-mono text-xs uppercase tracking-wider text-black placeholder-gray-400 focus:border-black focus:bg-white focus:outline-none"
              />
            </div>
          )}
        </div>

        {/* Right Controls */}
        <div className="flex items-center gap-2 sm:gap-4">
          {/* Active Role Indicator & Switcher */}
          <div className="flex items-center gap-1 bg-gray-100 p-1 rounded border border-gray-300 text-xs">
            <span className="font-mono text-[0.62rem] text-gray-500 uppercase px-1 font-bold">
              View:
            </span>
            <button
              type="button"
              onClick={() => handleRoleChange("admin")}
              className={`px-2 py-0.5 rounded font-mono font-bold uppercase text-[0.7rem] transition-colors ${
                role === "admin"
                  ? "bg-[#FFE600] text-black shadow-2xs"
                  : "text-gray-600 hover:text-black"
              }`}
            >
              Admin
            </button>
            <button
              type="button"
              onClick={() => handleRoleChange("team")}
              className={`px-2 py-0.5 rounded font-mono font-bold uppercase text-[0.7rem] transition-colors ${
                role === "team"
                  ? "bg-[#FFE600] text-black shadow-2xs"
                  : "text-gray-600 hover:text-black"
              }`}
            >
              Team
            </button>
            <button
              type="button"
              onClick={() => handleRoleChange("client")}
              className={`px-2 py-0.5 rounded font-mono font-bold uppercase text-[0.7rem] transition-colors ${
                role === "client"
                  ? "bg-[#FFE600] text-black shadow-2xs"
                  : "text-gray-600 hover:text-black"
              }`}
            >
              Client
            </button>
          </div>

          {/* Workspace / Pod Scope Pill */}
          {role === "admin" ? (
            <div className="hidden md:flex items-center gap-1.5 border border-gray-300 rounded px-2.5 py-1 text-xs font-mono font-bold">
              <span>TEAM7641 - OWNER</span>
              <span className="text-gray-400">▾</span>
            </div>
          ) : role === "team" ? (
            <div className="hidden md:flex items-center gap-1.5 border border-blue-300 bg-blue-50 text-blue-900 rounded px-2.5 py-1 text-xs font-mono font-bold">
              <span>POD: DELIVERY FLOOR</span>
            </div>
          ) : null}

          {/* Database Connection Pill */}
          {role === "admin" && (
            dbStatus?.configured ? (
              <span className="hidden lg:inline-flex items-center gap-1 font-mono text-[0.62rem] px-2 py-1 rounded bg-emerald-100 text-emerald-800 font-bold border border-emerald-300">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Neon Cloud ({dbStatus.latencyMs}ms)
              </span>
            ) : (
              <span className="hidden lg:inline-flex items-center gap-1 font-mono text-[0.62rem] px-2 py-1 rounded bg-amber-50 text-amber-900 font-bold border border-amber-300" title="Set DATABASE_URL in .env.local to activate Neon Cloud">
                <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
                DB: Local Bridge
              </span>
            )
          )}

          {/* "+ New workspace" button (ADMIN ONLY) */}
          {role === "admin" && (
            <button
              type="button"
              onClick={() => alert("Create new workspace modal (Admin feature)")}
              className="hidden sm:inline-flex items-center border border-gray-300 bg-white px-3 py-1 text-xs font-mono font-semibold hover:border-black transition-colors"
            >
              + New workspace
            </button>
          )}

          {/* User Profile Avatar */}
          <div className="flex items-center gap-2 border-l border-gray-200 pl-3">
            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#FFE600] border border-black font-bold text-xs text-black">
              {role === "admin" ? "P" : role === "team" ? activeTeamMember.charAt(0) : "C"}
            </div>
            <span className="hidden sm:inline text-xs font-bold font-mono">
              {role === "admin"
                ? "Paks (Owner)"
                : role === "team"
                ? activeTeamMember.split(" ")[0]
                : "Client"}
            </span>
          </div>

          {/* Return to Public Site Button */}
          <button
            type="button"
            onClick={onExit}
            className="border-2 border-black bg-black text-[#FFE600] px-3.5 py-1 text-xs font-mono font-bold uppercase tracking-wider hover:bg-[#FFE600] hover:text-black transition-colors shrink-0"
          >
            Exit Portal ✕
          </button>
        </div>
      </header>

      {/* Main Body Layout */}
      {role === "client" ? (
        /* CLIENT VIEW: Pure Dedicated Client Room without Internal Agency Sidebar */
        <main className="flex-1 overflow-y-auto bg-[#F9FAFB]">
          <ClientRoomView initialClientId={activeClientId} />
        </main>
      ) : (
        /* ADMIN & TEAM VIEW: Internal Studio Operations with Scoped Left Sidebar */
        <div className="flex flex-1 overflow-hidden">
          {/* Left Dark Sidebar matching Image 2 */}
          <aside className="w-56 shrink-0 bg-[#0C0C0C] text-[#A1A1AA] flex flex-col justify-between border-r border-[#27272A] select-none">
            <div className="p-3">
              {/* Brand Header */}
              <div className="flex items-center gap-2.5 px-3 py-4 border-b border-[#27272A] mb-3">
                <div className="h-6 w-6 rounded bg-[#FFE600] flex items-center justify-center text-black font-black text-xs">
                  V
                </div>
                <div className="flex flex-col leading-tight">
                  <span className="font-mono text-xs font-bold text-white tracking-wider">TEAM 7641</span>
                  <span className="text-[0.62rem] text-gray-400 font-mono">
                    {role === "admin" ? "Operations OS" : "Delivery Floor"}
                  </span>
                </div>
              </div>

              {/* Section 1: WORKSPACE */}
              <div className="mb-4">
                <div className="flex items-center justify-between px-3 mb-1">
                  <span className="text-[0.65rem] font-mono uppercase tracking-[0.14em] text-gray-500 font-semibold">
                    {role === "admin" ? "WORKSPACE" : "SPRINT SCOPE"}
                  </span>
                  <span
                    className={`text-[0.55rem] font-mono px-1 rounded font-bold ${
                      role === "admin"
                        ? "bg-[#FFE600]/20 text-[#FFE600]"
                        : "bg-blue-500/20 text-blue-400"
                    }`}
                  >
                    {role === "admin" ? "OWNER" : "MEMBER"}
                  </span>
                </div>

                <div className="space-y-0.5">
                  {activeSidebarItems.map((item) => {
                    const isActive = activeTab === item.id;
                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => setActiveTab(item.id)}
                        className={`w-full flex items-center gap-2.5 px-3 py-1.5 rounded text-xs transition-colors ${
                          isActive
                            ? "bg-[#FFE600] text-black font-bold shadow-xs"
                            : "text-gray-400 hover:text-white hover:bg-white/5 font-medium"
                        }`}
                      >
                        <span className="text-sm opacity-80">{item.icon}</span>
                        <span>{item.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Section 2: MANAGE (ADMIN ONLY - HIDDEN FROM TEAM) */}
              {role === "admin" && (
                <div>
                  <span className="text-[0.65rem] font-mono uppercase tracking-[0.14em] text-gray-500 font-semibold px-3 block mb-1">
                    MANAGE
                  </span>
                  <div className="space-y-0.5">
                    {adminManageItems.map((item) => {
                      const isActive = activeTab === item.id;
                      return (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => setActiveTab(item.id)}
                          className={`w-full flex items-center gap-2.5 px-3 py-1.5 rounded text-xs transition-colors ${
                            isActive
                              ? "bg-[#FFE600] text-black font-bold"
                              : "text-gray-400 hover:text-white hover:bg-white/5 font-medium"
                          }`}
                        >
                          <span className="text-sm opacity-80">{item.icon}</span>
                          <span>{item.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Bottom Sidebar Scoped Data Notice */}
            <div className="p-3 border-t border-[#27272A] m-2 rounded bg-white/5">
              <p className="text-[0.65rem] font-mono text-gray-400 leading-snug">
                {role === "admin"
                  ? "Full Studio Admin: Unrestricted access across all client workspaces & financial ledgers."
                  : `Team Scoped Floor: Showing assigned tasks & project deliverables for ${activeTeamMember.split(" ")[0]}.`}
              </p>
            </div>
          </aside>

          {/* Dynamic Center Workspace View */}
          <main className="flex-1 overflow-y-auto bg-[#F9FAFB]">
            {role === "team" ? (
              activeTab === "projects" ? (
                <ProjectsTasksView
                  role="team"
                  activeMember={activeTeamMember}
                  onMemberChange={setActiveTeamMember}
                />
              ) : activeTab === "bookings" ? (
                <BookingsView role="team" activeMember={activeTeamMember} />
              ) : activeTab === "library" ? (
                <MediaLibraryView />
              ) : (
                <ProjectsTasksView
                  role="team"
                  activeMember={activeTeamMember}
                  onMemberChange={setActiveTeamMember}
                />
              )
            ) : (
              /* Admin Views */
              activeTab === "leads" ? (
                <PipelineView />
              ) : activeTab === "clients" ? (
                <ClientsView
                  onSelectClient={(id) => {
                    setActiveClientId(id);
                    setRole("client");
                  }}
                />
              ) : activeTab === "proposals" ? (
                <ProposalsView />
              ) : activeTab === "contracts" ? (
                <ContractsView />
              ) : activeTab === "accounting" ? (
                <AccountingView />
              ) : activeTab === "email" ? (
                <BusinessEmailView />
              ) : activeTab === "library" ? (
                <MediaLibraryView />
              ) : activeTab === "projects" ? (
                <ProjectsTasksView
                  role="admin"
                  activeMember={activeTeamMember}
                  onMemberChange={setActiveTeamMember}
                />
              ) : activeTab === "tasks" ? (
                <ProjectsTasksView
                  role="admin"
                  activeMember={activeTeamMember}
                  onMemberChange={setActiveTeamMember}
                />
              ) : activeTab === "bookings" ? (
                <BookingsView role="admin" />
              ) : activeTab === "reports" ? (
                <ReportsView />
              ) : activeTab === "users" ? (
                <UsersRolesView />
              ) : activeTab === "security" ? (
                <SecurityAuditView />
              ) : activeTab === "settings" ? (
                <WorkspaceSettingsView />
              ) : (
                <CommandCenterOverview onNavigate={(view) => setActiveTab(view)} />
              )
            )}
          </main>
        </div>
      )}
    </div>
  );
};
