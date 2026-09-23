"use client";

import React, { useState } from "react";
import { db, Client } from "@/db";

interface ClientsViewProps {
  onSelectClient?: (clientId: string) => void;
}

export const ClientsView: React.FC<ClientsViewProps> = ({ onSelectClient }) => {
  const [clients, setClients] = useState<Client[]>(() => db.getClients());
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // New Client Form
  const [name, setName] = useState("");
  const [company, setCompany] = useState("");
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<Client["status"]>("Onboarding");

  const filteredClients = clients.filter((c) => {
    const matchesSearch =
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.company.toLowerCase().includes(search.toLowerCase()) ||
      c.email.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === "all" ? true : c.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const totalRevenue = clients.reduce((acc, c) => acc + c.totalRevenue, 0);

  const handleAddClient = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email) return;

    db.addClient({
      name,
      contactName: name,
      company: company || name,
      email,
      status,
    });

    setClients(db.getClients());
    setIsAddModalOpen(false);
    setName("");
    setCompany("");
    setEmail("");
  };

  return (
    <div className="p-4 sm:p-8 max-w-7xl mx-auto space-y-6 text-[#0F1B2A]">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-gray-200 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="font-mono text-xs font-bold uppercase tracking-wider text-gray-500">
              Operations OS • Client Relationship Management (CRM)
            </span>
          </div>
          <h1 className="font-monument text-2xl sm:text-3xl font-black text-[#0F1B2A] tracking-tight mt-1 uppercase">
            Clients & Accounts
          </h1>
          <p className="text-xs sm:text-sm text-gray-600 mt-1">
            Manage your studio client relationships, lifetime billing values, and delivery room access.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsAddModalOpen(true)}
          className="border-2 border-black bg-black text-[#FFE600] px-4 py-2 font-mono text-xs font-bold uppercase tracking-wider shadow-xs hover:bg-[#FFE600] hover:text-black transition-colors"
        >
          + Add New Client
        </button>
      </div>

      {/* KPI Stats Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-gray-300 p-4 rounded-lg shadow-2xs">
          <span className="font-mono text-xs text-gray-500 block mb-1">Total Client Accounts</span>
          <div className="flex items-baseline justify-between">
            <span className="font-mono text-2xl font-black text-black">{clients.length}</span>
            <span className="font-mono text-[0.68rem] text-emerald-600 font-bold">100% Retained</span>
          </div>
        </div>
        <div className="bg-white border border-gray-300 p-4 rounded-lg shadow-2xs">
          <span className="font-mono text-xs text-gray-500 block mb-1">Lifetime Value (LTV)</span>
          <div className="flex items-baseline justify-between">
            <span className="font-mono text-2xl font-black text-black">${totalRevenue.toLocaleString()}</span>
            <span className="font-mono text-[0.68rem] text-emerald-600 font-bold">↗ Growing</span>
          </div>
        </div>
        <div className="bg-white border border-gray-300 p-4 rounded-lg shadow-2xs">
          <span className="font-mono text-xs text-gray-500 block mb-1">Active Deliveries</span>
          <div className="flex items-baseline justify-between">
            <span className="font-mono text-2xl font-black text-black">
              {clients.filter((c) => c.status === "Active").length}
            </span>
            <span className="font-mono text-[0.68rem] text-amber-700 font-bold">In Production</span>
          </div>
        </div>
        <div className="bg-white border border-gray-300 p-4 rounded-lg shadow-2xs">
          <span className="font-mono text-xs text-gray-500 block mb-1">Studio Client Health</span>
          <div className="flex items-baseline justify-between">
            <span className="font-mono text-2xl font-black text-emerald-600">98%</span>
            <span className="font-mono text-[0.68rem] text-gray-400 font-bold">NPS 9.4/10</span>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 border border-gray-300 rounded-lg shadow-2xs">
        <div className="relative flex-1 max-w-md">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by company, contact, or email..."
            className="w-full border border-gray-300 rounded px-3 py-1.5 font-mono text-xs focus:border-black focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-1.5 font-mono text-xs">
          <span className="text-[0.65rem] text-gray-500 uppercase font-bold mr-1">Status:</span>
          {["all", "Active", "Onboarding", "Completed"].map((st) => (
            <button
              key={st}
              type="button"
              onClick={() => setStatusFilter(st)}
              className={`px-2.5 py-1 rounded font-bold uppercase text-[0.7rem] transition-colors ${
                statusFilter === st
                  ? "bg-black text-[#FFE600]"
                  : "bg-gray-100 text-gray-600 hover:text-black hover:bg-gray-200"
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Clients Table */}
      <div className="bg-white border border-gray-300 rounded-lg shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-200 font-mono text-[0.7rem] uppercase text-gray-500 bg-gray-50">
                <th className="py-3 px-4">Company & Client</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Projects</th>
                <th className="py-3 px-4">Total Revenue</th>
                <th className="py-3 px-4">Contact Email</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-xs">
              {filteredClients.map((client) => (
                <tr key={client.id} className="hover:bg-gray-50 transition-colors">
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-full bg-[#2E1F27] text-[#FFE600] flex items-center justify-center font-bold font-mono text-xs border border-black">
                        {client.company.charAt(0)}
                      </div>
                      <div>
                        <span className="font-bold text-gray-900 block">{client.company}</span>
                        <span className="text-[0.68rem] text-gray-500 font-mono">{client.name}</span>
                      </div>
                    </div>
                  </td>
                  <td className="py-3.5 px-4">
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded text-[0.65rem] font-mono font-bold ${
                        client.status === "Active"
                          ? "bg-emerald-100 text-emerald-800"
                          : client.status === "Onboarding"
                          ? "bg-amber-100 text-amber-800"
                          : "bg-blue-100 text-blue-800"
                      }`}
                    >
                      {client.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 font-mono text-gray-800 font-bold">
                    {client.activeProjectsCount} active
                  </td>
                  <td className="py-3.5 px-4 font-mono font-bold text-black">
                    ${client.totalRevenue.toLocaleString()}
                  </td>
                  <td className="py-3.5 px-4 font-mono text-gray-500 text-[0.72rem]">
                    {client.email}
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <div className="flex items-center justify-end gap-1.5 font-mono text-[0.68rem]">
                      <button
                        type="button"
                        onClick={() => onSelectClient && onSelectClient(client.id)}
                        className="px-2.5 py-1 rounded bg-black text-[#FFE600] font-bold hover:bg-[#FFE600] hover:text-black transition-colors"
                      >
                        Client Room →
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Client Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-fade-in">
          <div className="w-full max-w-md rounded-lg border-2 border-black bg-white p-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-gray-200 pb-3 mb-4">
              <h3 className="font-mono font-black text-base uppercase text-black">
                Add New Client Account
              </h3>
              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                className="font-mono text-sm font-bold text-gray-500 hover:text-black"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddClient} className="space-y-4 font-mono text-xs">
              <div>
                <label className="block text-[0.7rem] font-bold uppercase text-gray-700 mb-1">
                  Company / Organization Name *
                </label>
                <input
                  type="text"
                  required
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  placeholder="e.g. Tidewater Coffee"
                  className="w-full border border-gray-300 rounded p-2 focus:border-black focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[0.7rem] font-bold uppercase text-gray-700 mb-1">
                  Primary Contact Name *
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Arthur Pendelton"
                  className="w-full border border-gray-300 rounded p-2 focus:border-black focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[0.7rem] font-bold uppercase text-gray-700 mb-1">
                  Billing & Primary Email *
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="arthur@company.com"
                  className="w-full border border-gray-300 rounded p-2 focus:border-black focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[0.7rem] font-bold uppercase text-gray-700 mb-1">
                  Lifecycle Status
                </label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as Client["status"])}
                  className="w-full border border-gray-300 rounded p-2 bg-white focus:border-black focus:outline-none"
                >
                  <option value="Onboarding">Onboarding</option>
                  <option value="Active">Active Production</option>
                  <option value="Completed">Completed / Retainer</option>
                </select>
              </div>

              <div className="pt-3 border-t border-gray-200 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 border border-gray-300 rounded font-bold text-gray-700 hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-black text-[#FFE600] border-2 border-black font-bold uppercase tracking-wider hover:bg-[#FFE600] hover:text-black transition-colors"
                >
                  Create Client
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
