"use client";

import React, { useState } from "react";
import { db, Contract } from "@/db";

export const ContractsView: React.FC = () => {
  const [contracts, setContracts] = useState<Contract[]>(() => db.getContracts());
  const [isDraftModalOpen, setIsDraftModalOpen] = useState(false);
  const [signingContract, setSigningContract] = useState<Contract | null>(null);
  const [signerNameInput, setSignerNameInput] = useState("");
  const [signerEmailInput, setSignerEmailInput] = useState("");

  // Form State
  const [clientCompany, setClientCompany] = useState("Tidewater Coffee");
  const [title, setTitle] = useState("");
  const [contractType, setContractType] = useState<Contract["contractType"]>("Statement of Work (SOW)");
  const [value, setValue] = useState(5500);

  const clients = db.getClients();

  const handleDraft = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title) return;

    const randomNum = Math.floor(10 + Math.random() * 90);
    const selectedClient = clients.find((c) => c.company === clientCompany) || clients[0];

    db.addContract({
      contractNumber: `${contractType.split(" ")[0]}-2026-0${randomNum}`,
      clientId: selectedClient ? selectedClient.id : "cli-1",
      clientName: selectedClient ? selectedClient.name : "Client",
      company: clientCompany,
      title,
      contractType,
      value,
      status: "Pending Signature",
    });

    setContracts(db.getContracts());
    setIsDraftModalOpen(false);
    setTitle("");
  };

  const handleExecuteSignature = (e: React.FormEvent) => {
    e.preventDefault();
    if (!signingContract || !signerNameInput || !signerEmailInput) return;

    db.signContract(signingContract.id, signerNameInput, signerEmailInput);
    setContracts(db.getContracts());
    setSigningContract(null);
    setSignerNameInput("");
    setSignerEmailInput("");
  };

  return (
    <div className="p-4 sm:p-8 max-w-7xl mx-auto space-y-6 text-[#000000]">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-gray-200 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="font-mono text-xs font-bold uppercase tracking-wider text-gray-500">
              Operations OS • Legal & Master Service Agreements
            </span>
          </div>
          <h1 className="font-monument text-2xl sm:text-3xl font-black text-[#000000] tracking-tight mt-1 uppercase">
            Contracts & Agreements
          </h1>
          <p className="text-xs sm:text-sm text-gray-600 mt-1">
            Execute binding Master Service Agreements, Statements of Work, and mutual NDAs with cryptographic audit logs.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsDraftModalOpen(true)}
          className="border-2 border-black bg-black text-[#FBD227] px-4 py-2 font-mono text-xs font-bold uppercase tracking-wider shadow-xs hover:bg-[#FBD227] hover:text-black transition-colors"
        >
          + Draft New Agreement
        </button>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white border border-gray-300 p-4 rounded-lg shadow-2xs">
          <span className="font-mono text-xs text-gray-500 block mb-1">Total Executed Agreements</span>
          <span className="font-mono text-2xl font-black text-black">
            {contracts.filter((c) => c.status === "Signed").length} / {contracts.length}
          </span>
        </div>
        <div className="bg-white border border-gray-300 p-4 rounded-lg shadow-2xs">
          <span className="font-mono text-xs text-gray-500 block mb-1">Under Contract Value</span>
          <span className="font-mono text-2xl font-black text-black">
            ${contracts.filter((c) => c.status === "Signed").reduce((a, b) => a + b.value, 0).toLocaleString()}
          </span>
        </div>
        <div className="bg-white border border-gray-300 p-4 rounded-lg shadow-2xs">
          <span className="font-mono text-xs text-gray-500 block mb-1">Pending Client e-Signature</span>
          <span className="font-mono text-2xl font-black text-amber-700">
            {contracts.filter((c) => c.status === "Pending Signature").length}
          </span>
        </div>
      </div>

      {/* Contracts Table */}
      <div className="bg-white border border-gray-300 rounded-lg shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-200 font-mono text-[0.7rem] uppercase text-gray-500 bg-gray-50">
                <th className="py-3 px-4">Contract Ref & Type</th>
                <th className="py-3 px-4">Agreement Title</th>
                <th className="py-3 px-4">Counterparty / Client</th>
                <th className="py-3 px-4">Contract Value</th>
                <th className="py-3 px-4">Signing Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-xs">
              {contracts.map((c) => (
                <tr key={c.id} className="hover:bg-gray-50 transition-colors">
                  <td className="py-3 px-4 font-mono">
                    <span className="font-bold text-gray-900 block">{c.contractNumber}</span>
                    <span className="text-[0.68rem] text-gray-500">{c.contractType}</span>
                  </td>
                  <td className="py-3 px-4">
                    <span className="font-bold text-gray-900 block">{c.title}</span>
                    <span className="text-[0.68rem] text-gray-400 font-mono">Created {c.createdAt}</span>
                  </td>
                  <td className="py-3 px-4">
                    <span className="font-bold text-gray-800 block">{c.company}</span>
                    <span className="text-[0.68rem] text-gray-500 font-mono">{c.clientName}</span>
                  </td>
                  <td className="py-3 px-4 font-mono font-bold text-black">
                    {c.value === 0 ? "Non-monetary (NDA)" : `$${c.value.toLocaleString()}`}
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded text-[0.65rem] font-mono font-bold ${
                        c.status === "Signed"
                          ? "bg-emerald-100 text-emerald-800"
                          : "bg-amber-100 text-amber-800"
                      }`}
                    >
                      {c.status}
                    </span>
                    {c.signedAt && (
                      <span className="text-[0.65rem] font-mono text-gray-400 block mt-0.5">
                        {c.signedAt}
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-4 text-right">
                    {c.status === "Pending Signature" ? (
                      <button
                        type="button"
                        onClick={() => {
                          setSigningContract(c);
                          setSignerNameInput(c.clientName);
                        }}
                        className="px-3 py-1 bg-[#FBD227] text-black border border-black font-mono text-[0.7rem] font-bold rounded hover:bg-black hover:text-[#FBD227] transition-colors"
                      >
                        ✍ e-Sign Now
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => alert(`Downloading verified PDF copy for ${c.contractNumber}`)}
                        className="px-2.5 py-1 bg-gray-100 border border-gray-300 font-mono text-[0.7rem] font-bold text-gray-700 hover:border-black rounded transition-colors"
                      >
                        Download PDF ↓
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* e-Signature Modal */}
      {signingContract && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-fade-in">
          <div className="w-full max-w-lg rounded-lg border-2 border-black bg-white p-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-gray-200 pb-3 mb-4">
              <div>
                <span className="font-mono text-xs font-bold bg-amber-100 text-amber-900 px-2 py-0.5 rounded">
                  E-SIGNATURE PORTAL
                </span>
                <h3 className="font-mono font-black text-lg text-black uppercase mt-1">
                  Execute {signingContract.contractNumber}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setSigningContract(null)}
                className="font-mono text-sm font-bold text-gray-500 hover:text-black"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleExecuteSignature} className="space-y-4 font-mono text-xs">
              <div className="p-3 bg-gray-50 rounded border border-gray-200">
                <span className="text-[0.65rem] text-gray-400 uppercase font-bold block">Document</span>
                <p className="font-bold text-black">{signingContract.title}</p>
                <p className="text-gray-500 mt-0.5">Counterparty: {signingContract.company}</p>
              </div>

              <div>
                <label className="block text-[0.7rem] font-bold uppercase text-gray-700 mb-1">
                  Legal Signatory Name *
                </label>
                <input
                  type="text"
                  required
                  value={signerNameInput}
                  onChange={(e) => setSignerNameInput(e.target.value)}
                  placeholder="e.g. Elena Vance, MD"
                  className="w-full border border-gray-300 rounded p-2 focus:border-black focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[0.7rem] font-bold uppercase text-gray-700 mb-1">
                  Authorized Signer Email *
                </label>
                <input
                  type="email"
                  required
                  value={signerEmailInput}
                  onChange={(e) => setSignerEmailInput(e.target.value)}
                  placeholder="elena@meridianhealth.org"
                  className="w-full border border-gray-300 rounded p-2 focus:border-black focus:outline-none"
                />
              </div>

              {/* Digital Signature Pad Preview */}
              <div>
                <label className="block text-[0.7rem] font-bold uppercase text-gray-700 mb-1">
                  Digital Signature Stamp
                </label>
                <div className="h-20 bg-gray-50 border-2 border-dashed border-gray-300 rounded flex items-center justify-center font-mono italic text-lg text-gray-800">
                  {signerNameInput ? `✍ ${signerNameInput}` : "Type name above to generate e-sign stamp"}
                </div>
                <span className="text-[0.65rem] text-gray-400 mt-1 block">
                  Legally binding electronic signature under the ESIGN & UETA Acts.
                </span>
              </div>

              <div className="pt-3 border-t border-gray-200 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setSigningContract(null)}
                  className="px-4 py-2 border border-gray-300 rounded font-bold text-gray-700 hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-black text-[#FBD227] border-2 border-black font-bold uppercase tracking-wider hover:bg-[#FBD227] hover:text-black transition-colors"
                >
                  Sign & Execute Agreement
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Draft Contract Modal */}
      {isDraftModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-fade-in">
          <div className="w-full max-w-lg rounded-lg border-2 border-black bg-white p-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-gray-200 pb-3 mb-4">
              <h3 className="font-mono font-black text-base uppercase text-black">
                Draft New Agreement
              </h3>
              <button
                type="button"
                onClick={() => setIsDraftModalOpen(false)}
                className="font-mono text-sm font-bold text-gray-500 hover:text-black"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleDraft} className="space-y-4 font-mono text-xs">
              <div>
                <label className="block text-[0.7rem] font-bold uppercase text-gray-700 mb-1">
                  Contract Type
                </label>
                <select
                  value={contractType}
                  onChange={(e) => setContractType(e.target.value as Contract["contractType"])}
                  className="w-full border border-gray-300 rounded p-2 bg-white focus:border-black focus:outline-none"
                >
                  <option value="Statement of Work (SOW)">Statement of Work (SOW)</option>
                  <option value="Master Service Agreement (MSA)">Master Service Agreement (MSA)</option>
                  <option value="Retainer Agreement">Retainer Agreement</option>
                  <option value="NDA">Mutual Non-Disclosure Agreement (NDA)</option>
                </select>
              </div>

              <div>
                <label className="block text-[0.7rem] font-bold uppercase text-gray-700 mb-1">
                  Counterparty Client
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
                  Agreement Title *
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Statement of Work: Custom AI Automation Build"
                  className="w-full border border-gray-300 rounded p-2 focus:border-black focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[0.7rem] font-bold uppercase text-gray-700 mb-1">
                  Total Contract Consideration ($ USD)
                </label>
                <input
                  type="number"
                  required
                  value={value}
                  onChange={(e) => setValue(Number(e.target.value))}
                  className="w-full border border-gray-300 rounded p-2 focus:border-black focus:outline-none"
                />
              </div>

              <div className="pt-3 border-t border-gray-200 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsDraftModalOpen(false)}
                  className="px-4 py-2 border border-gray-300 rounded font-bold text-gray-700 hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-black text-[#FBD227] border-2 border-black font-bold uppercase tracking-wider hover:bg-[#FBD227] hover:text-black transition-colors"
                >
                  Create & Send For e-Sign
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
