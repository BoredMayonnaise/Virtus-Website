"use client";

import React, { useState } from "react";
import { db, MediaAsset } from "@/db";
import { Icon } from "@/components/icons/Icon";

export const MediaLibraryView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"general" | "client">("general");
  const [selectedType, setSelectedType] = useState<string>("all");
  const [assets, setAssets] = useState<MediaAsset[]>(db.getMediaAssets());
  const [previewAsset, setPreviewAsset] = useState<MediaAsset | null>(null);

  const filteredAssets = assets.filter((asset) => {
    const matchesTab = activeTab === "general" ? asset.clientId === null : asset.clientId !== null;
    const matchesType = selectedType === "all" ? true : asset.fileType === selectedType;
    return matchesTab && matchesType;
  });

  return (
    <div className="p-6 sm:p-10 max-w-[88rem] mx-auto text-[#000000]">
      {/* Header & Storage Gauge */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <span className="font-mono text-xs font-bold uppercase tracking-[0.14em] text-gray-500 block mb-1">
            GHL ASSET & MEDIA VAULT
          </span>
          <h1 className="font-monument text-3xl font-black text-[#000000] tracking-tight">
            MEDIA & DOCUMENT LIBRARY
          </h1>
          <p className="text-xs sm:text-sm text-gray-600 mt-1">
            Centralized Cloudflare R2 object storage for agency templates, client deliverables, and production files.
          </p>
        </div>

        {/* Cloudflare R2 Storage Gauge */}
        <div className="bg-white border border-gray-300 p-4 rounded-lg shadow-sm min-w-[16rem]">
          <div className="flex items-center justify-between text-xs font-bold mb-1.5">
            <span className="text-gray-600 font-mono">Cloudflare R2 Storage</span>
            <span className="text-black font-mono">1.8 GB / 10 GB</span>
          </div>
          <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden">
            <div className="bg-[#FBD227] h-full" style={{ width: "18%" }} />
          </div>
          <span className="text-[0.65rem] text-gray-400 mt-1 block">
            Zero egress fees · S3-compatible API
          </span>
        </div>
      </div>

      {/* Tabs & Type Filters Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-300 pb-4 mb-6">
        {/* Tab Buttons */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setActiveTab("general")}
            className={`px-4 py-2 text-xs font-mono font-bold uppercase tracking-wider rounded transition-all ${
              activeTab === "general"
                ? "bg-[#000000] text-white shadow-sm"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            General Library
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("client")}
            className={`px-4 py-2 text-xs font-mono font-bold uppercase tracking-wider rounded transition-all ${
              activeTab === "client"
                ? "bg-[#000000] text-white shadow-sm"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            Client Work Vault
          </button>
        </div>

        {/* Type Filter Buttons */}
        <div className="flex flex-wrap items-center gap-1.5">
          {["all", "document", "image", "video", "audio"].map((type) => (
            <button
              key={type}
              type="button"
              onClick={() => setSelectedType(type)}
              className={`px-3 py-1 text-xs font-mono uppercase rounded transition-colors ${
                selectedType === type
                  ? "bg-[#FBD227] text-black font-bold"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200 font-medium"
              }`}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      {/* Media Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
        {filteredAssets.map((asset) => (
          <div
            key={asset.id}
            className="group border border-gray-300 bg-white rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between"
          >
            <div>
              {/* Type Badge & Category */}
              <div className="flex items-center justify-between mb-3">
                <span className="text-[0.65rem] font-mono font-bold uppercase px-2 py-0.5 rounded bg-gray-100 text-gray-700">
                  {asset.fileType}
                </span>
                <span className="text-[0.65rem] font-mono text-gray-400">
                  {asset.category}
                </span>
              </div>

              {/* Title & Client Name */}
              <h3 className="font-bold text-sm text-black leading-snug group-hover:text-amber-600 transition-colors line-clamp-2">
                {asset.title}
              </h3>
              {asset.clientName && (
                <span className="inline-block text-[0.7rem] font-medium text-amber-800 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded mt-1.5">
                  Client: {asset.clientName}
                </span>
              )}

              {/* File Info */}
              <div className="mt-3 pt-3 border-t border-gray-100 text-xs text-gray-500 font-mono">
                <p className="truncate text-gray-700 font-medium">{asset.filename}</p>
                <div className="flex items-center justify-between mt-1 text-[0.68rem]">
                  <span>{asset.fileSize}</span>
                  <span>{asset.createdAt}</span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between">
              <button
                type="button"
                onClick={() => setPreviewAsset(asset)}
                className="text-xs font-bold text-black hover:underline"
              >
                Preview →
              </button>
              <button
                type="button"
                onClick={() => alert(`Copied share link for ${asset.filename}`)}
                className="text-[0.68rem] font-mono text-gray-500 hover:text-black"
              >
                Copy Link
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Preview Lightbox Modal */}
      {previewAsset && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-white border-2 border-black max-w-2xl w-full p-6 rounded shadow-2xl relative">
            <div className="flex items-center justify-between border-b pb-3 mb-4">
              <div>
                <span className="text-xs font-mono uppercase text-gray-500">Asset Preview</span>
                <h3 className="font-bold text-base text-black">{previewAsset.title}</h3>
              </div>
              <button
                type="button"
                onClick={() => setPreviewAsset(null)}
                className="font-mono font-bold text-lg px-2 hover:bg-gray-100"
              >
                <Icon name="close" className="h-4 w-4" />
              </button>
            </div>

            <div className="bg-gray-50 border border-gray-200 p-8 rounded text-center my-4">
              {previewAsset.fileType === "image" ? (
                <img
                  src={previewAsset.url}
                  alt={previewAsset.title}
                  className="max-h-80 mx-auto rounded shadow-sm object-contain"
                />
              ) : previewAsset.fileType === "video" ? (
                <div className="space-y-2">
                  <div className="h-44 bg-black text-white flex items-center justify-center rounded">
                    <Icon name="video" className="mr-2 inline h-5 w-5 align-[-0.25em]" />Video preview
                  </div>
                  <p className="text-xs text-gray-500">{previewAsset.filename} (4K ProRes)</p>
                </div>
              ) : previewAsset.fileType === "audio" ? (
                <div className="space-y-3">
                  <div className="h-20 bg-gray-900 text-[#FBD227] flex items-center justify-center rounded font-mono text-xs">
                    <Icon name="music" className="mr-2 inline h-5 w-5 align-[-0.25em]" />Audio preview
                  </div>
                  <p className="text-xs text-gray-500">{previewAsset.filename} (Stereo 24-bit 48kHz)</p>
                </div>
              ) : (
                <div className="space-y-2">
                  <div className="h-32 bg-gray-100 border border-gray-300 flex items-center justify-center text-4xl">
                    <Icon name="file" className="h-10 w-10 text-gray-500" />
                  </div>
                  <p className="text-xs text-gray-700 font-bold">{previewAsset.filename}</p>
                </div>
              )}
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setPreviewAsset(null)}
                className="px-4 py-2 border border-gray-300 text-xs font-bold rounded"
              >
                Close
              </button>
              <button
                type="button"
                onClick={() => {
                  alert(`Downloading ${previewAsset.filename}`);
                  setPreviewAsset(null);
                }}
                className="px-4 py-2 bg-[#FBD227] border border-black text-xs font-bold rounded text-black"
              >
                Download File
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
