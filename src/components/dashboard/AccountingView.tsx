"use client";

import React, { useState } from "react";
import { db, Invoice } from "@/db";

export const AccountingView: React.FC = () => {
  const [invoices, setInvoices] = useState<Invoice[]>(() => db.getInvoices());
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [isInvoiceModalOpen, setIsInvoiceModalOpen] = useState(false);

  // New Invoice Form
  const [clientCompany, setClientCompany] = useState("Tidewater Coffee");
  const [amount, setAmount] = useState(3000);
  const [dueDate, setDueDate] = useState("2026-10-15");

  const clients = db.getClients();

  const handleIssueInvoice = (e: React.FormEvent) => {
    e.preventDefault();
    const selectedClient = clients.find((c) => c.company === clientCompany) || clients[0];
    const randomNum = Math.floor(100 + Math.random() * 900);

    db.addInvoice({
      clientId: selectedClient ? selectedClient.id : "cli-1",
      clientName: clientCompany,
      invoiceNumber: `INV-2026-${randomNum}`,
      amount,
      status: "Pending",
      dueDate,
    });

    setInvoices(db.getInvoices());
    setIsInvoiceModalOpen(false);
  };

  const handleMarkPaid = (id: string) => {
    const inv = invoices.find((i) => i.id === id);
    if (!inv) return;
    inv.status = "Paid";
    inv.paidAt = new Date().toISOString().split("T")[0];
    setInvoices([...invoices]);
  };

  const paidTotal = invoices.filter((i) => i.status === "Paid").reduce((acc, i) => acc + i.amount, 0);
  const pendingTotal = invoices.filter((i) => i.status === "Pending").reduce((acc, i) => acc + i.amount, 0);
  const totalBilled = paidTotal + pendingTotal;

  const filteredInvoices = invoices.filter((i) => {
    if (statusFilter === "all") return true;
    return i.status === statusFilter;
  });

  return (
    <div className="p-4 sm:p-8 max-w-7xl mx-auto space-y-6 text-[#000000]">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-gray-200 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="font-mono text-xs font-bold uppercase tracking-wider text-gray-500">
              Operations OS • Financial Ledger & Invoicing
            </span>
          </div>
          <h1 className="font-monument text-2xl sm:text-3xl font-black text-[#000000] tracking-tight mt-1 uppercase">
            Accounting & Billing
          </h1>
          <p className="text-xs sm:text-sm text-gray-600 mt-1">
            Real-time cash flow, Stripe settlement payouts, client retainers, and accounts receivable.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsInvoiceModalOpen(true)}
          className="border-2 border-black bg-black text-[#FBD227] px-4 py-2 font-mono text-xs font-bold uppercase tracking-wider shadow-xs hover:bg-[#FBD227] hover:text-black transition-colors"
        >
          + Issue New Invoice
        </button>
      </div>

      {/* 4 Financial KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-gray-300 p-4 rounded-lg shadow-2xs">
          <span className="font-mono text-xs text-gray-500 block mb-1">Revenue Collected</span>
          <div className="flex items-baseline justify-between">
            <span className="font-mono text-2xl font-black text-emerald-600">
              ${paidTotal.toLocaleString()}
            </span>
            <span className="font-mono text-[0.68rem] text-emerald-600 font-bold">✓ Settled</span>
          </div>
        </div>

        <div className="bg-white border border-gray-300 p-4 rounded-lg shadow-2xs">
          <span className="font-mono text-xs text-gray-500 block mb-1">Accounts Receivable</span>
          <div className="flex items-baseline justify-between">
            <span className="font-mono text-2xl font-black text-amber-700">
              ${pendingTotal.toLocaleString()}
            </span>
            <span className="font-mono text-[0.68rem] text-amber-700 font-bold">● Pending</span>
          </div>
        </div>

        <div className="bg-white border border-gray-300 p-4 rounded-lg shadow-2xs">
          <span className="font-mono text-xs text-gray-500 block mb-1">Total Studio Billed</span>
          <div className="flex items-baseline justify-between">
            <span className="font-mono text-2xl font-black text-black">
              ${totalBilled.toLocaleString()}
            </span>
            <span className="font-mono text-[0.68rem] text-gray-400 font-bold">FY2026</span>
          </div>
        </div>

        <div className="bg-white border border-gray-300 p-4 rounded-lg shadow-2xs">
          <span className="font-mono text-xs text-gray-500 block mb-1">Gross Studio Margin</span>
          <div className="flex items-baseline justify-between">
            <span className="font-mono text-2xl font-black text-black">82.4%</span>
            <span className="font-mono text-[0.68rem] text-emerald-600 font-bold">High Efficiency</span>
          </div>
        </div>
      </div>

      {/* Stripe Connect & Payout Status Banner */}
      <div className="bg-white border border-gray-300 rounded-lg p-4 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded bg-[#635BFF] text-white flex items-center justify-center font-bold text-xs font-mono">
            S
          </div>
          <div>
            <span className="font-mono text-xs font-bold text-black uppercase block">
              Stripe Connect Auto-Payouts Active
            </span>
            <p className="text-xs text-gray-500">
              Next scheduled deposit: $3,600 USD to Studio Operating Account (•••• 8821).
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => alert("Connecting to Stripe Express Portal")}
          className="border border-gray-300 bg-gray-50 px-3 py-1.5 font-mono text-xs font-bold text-gray-800 hover:border-black rounded transition-colors"
        >
          View Stripe Portal ↗
        </button>
      </div>

      {/* Filters */}
      <div className="flex items-center justify-between">
        <h3 className="font-mono font-bold text-sm uppercase tracking-wider text-black">
          Master Invoice Ledger
        </h3>
        <div className="flex items-center gap-1 font-mono text-xs">
          {["all", "Paid", "Pending", "Overdue"].map((st) => (
            <button
              key={st}
              type="button"
              onClick={() => setStatusFilter(st)}
              className={`px-2.5 py-1 rounded font-bold uppercase text-[0.7rem] transition-colors ${
                statusFilter === st
                  ? "bg-black text-[#FBD227]"
                  : "bg-gray-100 text-gray-600 hover:text-black hover:bg-gray-200"
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Invoices Table */}
      <div className="bg-white border border-gray-300 rounded-lg shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-200 font-mono text-[0.7rem] uppercase text-gray-500 bg-gray-50">
                <th className="py-3 px-4">Invoice #</th>
                <th className="py-3 px-4">Client / Counterparty</th>
                <th className="py-3 px-4">Invoice Amount</th>
                <th className="py-3 px-4">Payment Due</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-xs">
              {filteredInvoices.map((inv) => (
                <tr key={inv.id} className="hover:bg-gray-50 transition-colors">
                  <td className="py-3.5 px-4 font-mono font-bold text-black">{inv.invoiceNumber}</td>
                  <td className="py-3.5 px-4 font-medium text-gray-800">{inv.clientName}</td>
                  <td className="py-3.5 px-4 font-mono font-black text-black">
                    ${inv.amount.toLocaleString()}
                  </td>
                  <td className="py-3.5 px-4 font-mono text-gray-500 text-[0.75rem]">{inv.dueDate}</td>
                  <td className="py-3.5 px-4">
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded text-[0.65rem] font-mono font-bold ${
                        inv.status === "Paid"
                          ? "bg-emerald-100 text-emerald-800"
                          : inv.status === "Pending"
                          ? "bg-amber-100 text-amber-800"
                          : "bg-rose-100 text-rose-800"
                      }`}
                    >
                      {inv.status}
                    </span>
                    {inv.paidAt && (
                      <span className="text-[0.65rem] font-mono text-emerald-700 block mt-0.5">
                        Paid on {inv.paidAt}
                      </span>
                    )}
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <div className="flex items-center justify-end gap-2 font-mono text-[0.7rem]">
                      {inv.status === "Pending" && (
                        <button
                          type="button"
                          onClick={() => handleMarkPaid(inv.id)}
                          className="px-2.5 py-1 bg-[#FBD227] text-black border border-black font-bold rounded hover:bg-black hover:text-[#FBD227] transition-colors"
                        >
                          Mark Paid ✓
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => alert(`Downloading PDF receipt for ${inv.invoiceNumber}`)}
                        className="px-2 py-1 bg-gray-100 border border-gray-300 rounded font-semibold text-gray-700 hover:border-black transition-colors"
                      >
                        PDF
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Issue Invoice Modal */}
      {isInvoiceModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-fade-in">
          <div className="w-full max-w-md rounded-lg border-2 border-black bg-white p-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-gray-200 pb-3 mb-4">
              <h3 className="font-mono font-black text-base uppercase text-black">
                Issue Client Invoice
              </h3>
              <button
                type="button"
                onClick={() => setIsInvoiceModalOpen(false)}
                className="font-mono text-sm font-bold text-gray-500 hover:text-black"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleIssueInvoice} className="space-y-4 font-mono text-xs">
              <div>
                <label className="block text-[0.7rem] font-bold uppercase text-gray-700 mb-1">
                  Client Account
                </label>
                <select
                  value={clientCompany}
                  onChange={(e) => setClientCompany(e.target.value)}
                  className="w-full border border-gray-300 rounded p-2 bg-white focus:border-black focus:outline-none"
                >
                  {clients.map((c) => (
                    <option key={c.id} value={c.company}>
                      {c.company} ({c.name})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[0.7rem] font-bold uppercase text-gray-700 mb-1">
                  Invoice Amount ($ USD) *
                </label>
                <input
                  type="number"
                  required
                  value={amount}
                  onChange={(e) => setAmount(Number(e.target.value))}
                  className="w-full border border-gray-300 rounded p-2 focus:border-black focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[0.7rem] font-bold uppercase text-gray-700 mb-1">
                  Payment Due Date *
                </label>
                <input
                  type="date"
                  required
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className="w-full border border-gray-300 rounded p-2 focus:border-black focus:outline-none"
                />
              </div>

              <div className="pt-3 border-t border-gray-200 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsInvoiceModalOpen(false)}
                  className="px-4 py-2 border border-gray-300 rounded font-bold text-gray-700 hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-black text-[#FBD227] border-2 border-black font-bold uppercase tracking-wider hover:bg-[#FBD227] hover:text-black transition-colors"
                >
                  Issue & Send via Stripe
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
