"use client";

import React, { useState } from "react";

export const WorkspaceSettingsView: React.FC = () => {
  const [studioName, setStudioName] = useState("The Virtus Labs");
  const [workspaceSlug, setWorkspaceSlug] = useState("team7641");
  const [customDomain, setCustomDomain] = useState("portal.thevirtuslabs.com");
  const [currency, setCurrency] = useState("USD ($)");
  const [timeZone, setTimeZone] = useState("Asia/Manila (UTC+8)");
  const [savedNotice, setSavedNotice] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedNotice(true);
    setTimeout(() => setSavedNotice(false), 3000);
  };

  return (
    <div className="p-4 sm:p-8 max-w-5xl mx-auto space-y-6 text-[#000000]">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-gray-200 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-gray-500 animate-pulse" />
            <span className="font-mono text-xs font-bold uppercase tracking-wider text-gray-500">
              Operations OS • Workspace Configuration
            </span>
          </div>
          <h1 className="font-monument text-2xl sm:text-3xl font-black text-[#000000] tracking-tight mt-1 uppercase">
            Workspace Settings
          </h1>
          <p className="text-xs sm:text-sm text-gray-600 mt-1">
            Global agency parameters, custom white-label domains, and webhook integrations.
          </p>
        </div>

        {savedNotice && (
          <span className="font-mono text-xs text-emerald-700 bg-emerald-50 border border-emerald-300 px-3 py-1.5 rounded font-bold animate-fade-in">
            ✓ Settings Saved Successfully!
          </span>
        )}
      </div>

      <form onSubmit={handleSave} className="space-y-6 font-mono text-xs">
        {/* Section 1: Studio Details */}
        <div className="bg-white border border-gray-300 rounded-lg p-5 shadow-2xs space-y-4">
          <h3 className="font-mono font-bold text-sm uppercase tracking-wider text-black">
            Studio Identity & Custom Domain
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[0.7rem] font-bold uppercase text-gray-700 mb-1">
                Agency Studio Name
              </label>
              <input
                type="text"
                value={studioName}
                onChange={(e) => setStudioName(e.target.value)}
                className="w-full border border-gray-300 rounded p-2 focus:border-black focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-[0.7rem] font-bold uppercase text-gray-700 mb-1">
                Workspace Slug / ID
              </label>
              <input
                type="text"
                value={workspaceSlug}
                onChange={(e) => setWorkspaceSlug(e.target.value)}
                className="w-full border border-gray-300 rounded p-2 focus:border-black focus:outline-none bg-gray-50"
              />
            </div>
          </div>

          <div>
            <label className="block text-[0.7rem] font-bold uppercase text-gray-700 mb-1">
              White-label Custom Portal Domain (CNAME)
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={customDomain}
                onChange={(e) => setCustomDomain(e.target.value)}
                className="flex-1 border border-gray-300 rounded p-2 focus:border-black focus:outline-none"
              />
              <span className="inline-flex items-center px-3 py-1 bg-emerald-50 text-emerald-800 border border-emerald-300 rounded font-bold text-[0.7rem]">
                ✓ SSL Active
              </span>
            </div>
          </div>
        </div>

        {/* Section 2: Regional & Financial Localization */}
        <div className="bg-white border border-gray-300 rounded-lg p-5 shadow-2xs space-y-4">
          <h3 className="font-mono font-bold text-sm uppercase tracking-wider text-black">
            Localization & Currency
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[0.7rem] font-bold uppercase text-gray-700 mb-1">
                Studio Primary Currency
              </label>
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                className="w-full border border-gray-300 rounded p-2 bg-white focus:border-black focus:outline-none"
              >
                <option value="USD ($)">USD ($) - United States Dollar</option>
                <option value="EUR (€)">EUR (€) - Euro</option>
                <option value="GBP (£)">GBP (£) - British Pound</option>
                <option value="PHP (₱)">PHP (₱) - Philippine Peso</option>
              </select>
            </div>

            <div>
              <label className="block text-[0.7rem] font-bold uppercase text-gray-700 mb-1">
                Primary Studio Timezone
              </label>
              <select
                value={timeZone}
                onChange={(e) => setTimeZone(e.target.value)}
                className="w-full border border-gray-300 rounded p-2 bg-white focus:border-black focus:outline-none"
              >
                <option value="Asia/Manila (UTC+8)">Asia/Manila (UTC+8)</option>
                <option value="America/New_York (UTC-5)">America/New_York (UTC-5)</option>
                <option value="America/Los_Angeles (UTC-8)">America/Los_Angeles (UTC-8)</option>
                <option value="Europe/London (UTC+0)">Europe/London (UTC+0)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Section 3: Webhook Endpoints */}
        <div className="bg-white border border-gray-300 rounded-lg p-5 shadow-2xs space-y-4">
          <h3 className="font-mono font-bold text-sm uppercase tracking-wider text-black">
            Connected Webhooks & Automations
          </h3>

          <div className="space-y-3">
            <div className="p-3 bg-gray-50 rounded border border-gray-200 flex items-center justify-between">
              <div>
                <span className="font-bold text-black block">Cal.com Booking Webhook</span>
                <span className="text-gray-500 text-[0.68rem]">https://portal.thevirtuslabs.com/api/webhooks/cal</span>
              </div>
              <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold text-[0.65rem]">
                Connected
              </span>
            </div>

            <div className="p-3 bg-gray-50 rounded border border-gray-200 flex items-center justify-between">
              <div>
                <span className="font-bold text-black block">Stripe Invoice & Checkout Webhook</span>
                <span className="text-gray-500 text-[0.68rem]">https://portal.thevirtuslabs.com/api/webhooks/stripe</span>
              </div>
              <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold text-[0.65rem]">
                Connected
              </span>
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            type="submit"
            className="border-2 border-black bg-black text-[#FBD227] px-6 py-2.5 font-bold uppercase tracking-wider hover:bg-[#FBD227] hover:text-black transition-colors"
          >
            Save Changes
          </button>
        </div>
      </form>
    </div>
  );
};
