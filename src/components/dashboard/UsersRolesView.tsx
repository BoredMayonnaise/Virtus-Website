"use client";

import React, { useState } from "react";
import { db, TeamMemberUser } from "@/db";

export const UsersRolesView: React.FC = () => {
  const [members, setMembers] = useState<TeamMemberUser[]>(() => db.getTeamMembers());
  const [isInviteOpen, setIsInviteOpen] = useState(false);

  // Invite Form
  const [name, setName] = useState("");
  const [roleTitle, setRoleTitle] = useState("");
  const [email, setEmail] = useState("");
  const [permission, setPermission] = useState<TeamMemberUser["permission"]>("Specialist");

  const handleInvite = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email) return;

    db.addTeamMember({
      name,
      roleTitle,
      email,
      permission,
      avatar: name.charAt(0).toUpperCase(),
      activeProjects: ["Onboarding Pod"],
      status: "Active",
    });

    setMembers(db.getTeamMembers());
    setIsInviteOpen(false);
    setName("");
    setRoleTitle("");
    setEmail("");
  };

  const matrix = [
    { capability: "Access Financials & Revenue", admin: true, podLead: false, specialist: false, client: false },
    { capability: "Manage GHL CRM Pipeline", admin: true, podLead: true, specialist: false, client: false },
    { capability: "View Assigned Sprint Tasks", admin: true, podLead: true, specialist: true, client: false },
    { capability: "Approve Client Deliverables", admin: true, podLead: true, specialist: false, client: true },
    { capability: "Execute Legal Contracts & MSAs", admin: true, podLead: false, specialist: false, client: true },
    { capability: "Manage Workspace Settings", admin: true, podLead: false, specialist: false, client: false },
  ];

  return (
    <div className="p-4 sm:p-8 max-w-7xl mx-auto space-y-6 text-[#000000]">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-gray-200 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-blue-500 animate-pulse" />
            <span className="font-mono text-xs font-bold uppercase tracking-wider text-gray-500">
              Operations OS • Team Directory & Role-Based Access Control
            </span>
          </div>
          <h1 className="font-monument text-2xl sm:text-3xl font-black text-[#000000] tracking-tight mt-1 uppercase">
            Users & Roles
          </h1>
          <p className="text-xs sm:text-sm text-gray-600 mt-1">
            Configure studio team member access levels, assigned project pods, and client guest scopes.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsInviteOpen(true)}
          className="border-2 border-black bg-black text-[#FBD227] px-4 py-2 font-mono text-xs font-bold uppercase tracking-wider shadow-xs hover:bg-[#FBD227] hover:text-black transition-colors"
        >
          + Invite Team Member
        </button>
      </div>

      {/* Team Roster Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {members.map((m) => (
          <div
            key={m.id}
            className="border border-gray-300 bg-white p-5 rounded-lg shadow-2xs flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="h-10 w-10 rounded-full bg-[#FBD227] border-2 border-black flex items-center justify-center font-black font-mono text-base text-black">
                  {m.avatar}
                </div>
                <span
                  className={`font-mono text-[0.65rem] font-bold px-2 py-0.5 rounded uppercase ${
                    m.permission.includes("Owner")
                      ? "bg-amber-100 text-amber-900 border border-amber-300"
                      : m.permission.includes("Lead")
                      ? "bg-blue-100 text-blue-900"
                      : "bg-gray-100 text-gray-800"
                  }`}
                >
                  {m.permission}
                </span>
              </div>

              <h3 className="font-bold text-base text-black">{m.name}</h3>
              <p className="text-xs text-gray-500 font-medium">{m.roleTitle}</p>
              <p className="text-[0.7rem] text-gray-400 font-mono mt-1">{m.email}</p>

              <div className="mt-4 pt-3 border-t border-gray-100 text-xs font-mono">
                <span className="text-gray-400 text-[0.65rem] uppercase font-bold block mb-1">
                  Assigned Pods:
                </span>
                <span className="text-gray-800 font-bold">{m.activeProjects.length} projects</span>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between text-xs font-mono">
              <span className="text-emerald-600 font-bold">● {m.status}</span>
              <button
                type="button"
                onClick={() => alert(`Configuring permissions for ${m.name}`)}
                className="text-gray-500 hover:text-black font-bold underline"
              >
                Edit →
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Permissions Matrix Table */}
      <div className="bg-white border border-gray-300 rounded-lg shadow-2xs p-5">
        <h3 className="font-mono font-bold text-sm uppercase tracking-wider text-black mb-3">
          Role Permission Policy Matrix
        </h3>
        <p className="text-xs text-gray-500 mb-4 font-mono">
          Strict policy enforcement governing UI rendering and data access across the platform.
        </p>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs font-mono">
            <thead>
              <tr className="border-b border-gray-200 uppercase text-gray-500 bg-gray-50 text-[0.7rem]">
                <th className="py-2.5 px-3">System Capability</th>
                <th className="py-2.5 px-3 text-center">Owner / Admin</th>
                <th className="py-2.5 px-3 text-center">Pod Lead</th>
                <th className="py-2.5 px-3 text-center">Specialist</th>
                <th className="py-2.5 px-3 text-center">Client Guest</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {matrix.map((row, idx) => (
                <tr key={idx} className="hover:bg-gray-50">
                  <td className="py-2.5 px-3 font-bold text-gray-900">{row.capability}</td>
                  <td className="py-2.5 px-3 text-center text-emerald-600 font-bold">
                    {row.admin ? "✓ Allowed" : "—"}
                  </td>
                  <td className="py-2.5 px-3 text-center font-bold">
                    {row.podLead ? <span className="text-emerald-600">✓ Allowed</span> : <span className="text-gray-400">Restricted</span>}
                  </td>
                  <td className="py-2.5 px-3 text-center font-bold">
                    {row.specialist ? <span className="text-emerald-600">✓ Allowed</span> : <span className="text-gray-400">Restricted</span>}
                  </td>
                  <td className="py-2.5 px-3 text-center font-bold">
                    {row.client ? <span className="text-emerald-600">✓ Allowed</span> : <span className="text-gray-400">Restricted</span>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Invite Member Modal */}
      {isInviteOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-fade-in">
          <div className="w-full max-w-md rounded-lg border-2 border-black bg-white p-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-gray-200 pb-3 mb-4">
              <h3 className="font-mono font-black text-base uppercase text-black">
                Invite New Team Member
              </h3>
              <button
                type="button"
                onClick={() => setIsInviteOpen(false)}
                className="font-mono text-sm font-bold text-gray-500 hover:text-black"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleInvite} className="space-y-4 font-mono text-xs">
              <div>
                <label className="block text-[0.7rem] font-bold uppercase text-gray-700 mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Maya Chen"
                  className="w-full border border-gray-300 rounded p-2 focus:border-black focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[0.7rem] font-bold uppercase text-gray-700 mb-1">
                  Role / Specialization *
                </label>
                <input
                  type="text"
                  required
                  value={roleTitle}
                  onChange={(e) => setRoleTitle(e.target.value)}
                  placeholder="e.g. Motion Designer & 3D Artist"
                  className="w-full border border-gray-300 rounded p-2 focus:border-black focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[0.7rem] font-bold uppercase text-gray-700 mb-1">
                  Studio Work Email *
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="maya@thevirtuslabs.com"
                  className="w-full border border-gray-300 rounded p-2 focus:border-black focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[0.7rem] font-bold uppercase text-gray-700 mb-1">
                  Assigned Permission Tier
                </label>
                <select
                  value={permission}
                  onChange={(e) => setPermission(e.target.value as TeamMemberUser["permission"])}
                  className="w-full border border-gray-300 rounded p-2 bg-white focus:border-black focus:outline-none"
                >
                  <option value="Pod Lead">Pod Lead</option>
                  <option value="Specialist">Specialist</option>
                  <option value="Owner / Admin">Owner / Admin</option>
                  <option value="Client Guest">Client Guest</option>
                </select>
              </div>

              <div className="pt-3 border-t border-gray-200 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsInviteOpen(false)}
                  className="px-4 py-2 border border-gray-300 rounded font-bold text-gray-700 hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-black text-[#FBD227] border-2 border-black font-bold uppercase tracking-wider hover:bg-[#FBD227] hover:text-black transition-colors"
                >
                  Send Invite Link
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
