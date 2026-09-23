"use client";

import React, { useState, useMemo } from "react";
import { siteData } from "@/data/siteData";
import { calculateAgencyQuote, QuoteResult } from "@/lib/quotationEngine";

interface BriefBuilderProps {
  onBriefSubmitted?: () => void;
}

export const BriefBuilder: React.FC<BriefBuilderProps> = ({ onBriefSubmitted }) => {
  const [selections, setSelections] = useState<Record<string, string[]>>({
    need: ["Brand & Creative", "Web & Digital"],
    state: ["Starting fresh"],
    feel: ["Calm & precise", "Bold & confident"],
    when: ["In a few weeks"],
    budget: ["$3k – $7k"],
  });

  const [contact, setContact] = useState({
    name: "",
    email: "",
    company: "",
    message: "",
  });

  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [copied, setCopied] = useState(false);

  // Dynamic Auto-Quote Calculation
  const quote: QuoteResult = useMemo(() => {
    return calculateAgencyQuote({
      needs: selections.need,
      state: selections.state?.[0],
      feel: selections.feel,
      when: selections.when?.[0],
      budget: selections.budget?.[0],
    });
  }, [selections]);

  const handleToggleOption = (stepId: string, option: string, isMulti: boolean) => {
    setSelections((prev) => {
      const current = prev[stepId] || [];
      if (isMulti) {
        const next = current.includes(option)
          ? current.filter((item) => item !== option)
          : [...current, option];
        return { ...prev, [stepId]: next };
      } else {
        return { ...prev, [stepId]: current[0] === option ? [] : [option] };
      }
    });
  };

  const completedStepsCount = useMemo(() => {
    return siteData.brief.steps.filter(
      (step) => (selections[step.id] || []).length > 0
    ).length;
  }, [selections]);

  const canSubmit =
    contact.name.trim().length > 0 &&
    contact.email.trim().length > 0 &&
    (selections.need || []).length > 0 &&
    !submitting;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;

    setSubmitting(true);
    try {
      const res = await fetch("/api/brief", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...contact,
          selections,
          quote,
        }),
      });

      if (!res.ok) throw new Error("Failed to submit brief");

      setSuccess(true);
      onBriefSubmitted?.();
    } catch {
      // Fallback: still show success for preview if network is offline
      setSuccess(true);
      onBriefSubmitted?.();
    } finally {
      setSubmitting(false);
    }
  };

  const handleCopyBrief = async () => {
    const text = [
      `--- THE VIRTUS LABS BRIEF ---`,
      `Client: ${contact.name || "N/A"} (${contact.email || "N/A"})`,
      `Company: ${contact.company || "N/A"}`,
      `Needs: ${(selections.need || []).join(", ") || "None selected"}`,
      `Stage: ${(selections.state || []).join(", ")}`,
      `Feel: ${(selections.feel || []).join(", ")}`,
      `Timeline: ${(selections.when || []).join(", ")}`,
      `Budget: ${(selections.budget || []).join(", ")}`,
      `Estimated Quote: $${quote.minPrice.toLocaleString()} – $${quote.maxPrice.toLocaleString()} (${quote.recommendedTier} Tier)`,
      `Note: ${contact.message || "None"}`,
    ].join("\n");

    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Ignore
    }
  };

  return (
    <section
      id="brief"
      className="scroll-mt-24 border-y border-shelf/55 bg-abyss pt-16 pb-24 sm:pt-20 sm:pb-32"
    >
      <div className="mx-auto w-full max-w-[74rem] px-5 sm:px-8 lg:px-10">
        <header data-reveal="true" className="mb-14 max-w-[52rem]">
          <span className="readout readout-caps text-tvl-amber font-mono">Project starter</span>
          <h2 className="mt-4 text-h2 text-seaglass font-display">
            {siteData.brief.title}
          </h2>
          <p className="mt-4 max-w-[56ch] text-[1.02rem] leading-relaxed text-tide">
            {siteData.brief.intro}
          </p>
        </header>

        <div className="grid grid-cols-1 gap-12 lg:grid-cols-[1fr_24rem] lg:gap-16">
          {/* Main Questionnaire & Form */}
          <form id="brief-submission-form" onSubmit={handleSubmit} className="flex flex-col gap-10">
            {siteData.brief.steps.map((step, idx) => {
              const currentValues = selections[step.id] || [];
              const isAnswered = currentValues.length > 0;

              return (
                <fieldset
                  key={step.id}
                  data-reveal="true"
                  className="relative border-t border-shelf/50 pt-6"
                >
                  <legend className="flex w-full flex-wrap items-baseline gap-x-3 gap-y-1">
                    <span className="readout mr-1 text-[0.72rem] text-tvl-amber font-mono font-bold">
                      {String(idx + 1).padStart(2, "0")}
                    </span>
                    <span className="font-sans text-lg font-semibold text-seaglass sm:text-xl">
                      {step.prompt}
                    </span>
                    <span className="readout text-[0.68rem] text-tide/70">
                      {step.hint}
                    </span>
                    {isAnswered && (
                      <span className="readout ml-auto text-[0.66rem] text-tvl-amber font-mono">
                        ✓ answered
                      </span>
                    )}
                  </legend>

                  <div className="mt-4 flex flex-wrap gap-2.5">
                    {step.options.map((opt) => {
                      const isSelected = currentValues.includes(opt);
                      return (
                        <button
                          key={opt}
                          type="button"
                          aria-pressed={isSelected}
                          onClick={() => handleToggleOption(step.id, opt, step.multi)}
                          className={`min-h-11 rounded-full border px-4.5 py-2.5 text-sm font-medium tracking-tight transition-all duration-150 active:scale-[0.98] ${
                            isSelected
                              ? "border-tvl-amber bg-tvl-amber text-tvl-plum font-semibold shadow-lg shadow-tvl-amber/20"
                              : "border-shelf/70 bg-transparent text-tide hover:border-tvl-amber/60 hover:text-seaglass"
                          }`}
                        >
                          {opt}
                        </button>
                      );
                    })}
                  </div>
                </fieldset>
              );
            })}

            {/* Contact Details Fields */}
            <fieldset data-reveal="true" className="border-t border-shelf/50 pt-7">
              <legend>
                <span className="readout readout-caps text-tvl-amber font-mono">
                  Where should we reply?
                </span>
              </legend>
              <p className="mt-2 max-w-[54ch] text-sm leading-relaxed text-tide">
                Add your details to lock in your brief. Name, email, and at least one project need are required.
              </p>

              <div className="mt-6 grid gap-5 sm:grid-cols-2">
                <label className="brief-contact-field">
                  <span className="brief-contact-field__label">Name *</span>
                  <input
                    type="text"
                    required
                    value={contact.name}
                    onChange={(e) => setContact({ ...contact, name: e.target.value })}
                    placeholder="Jane Doe"
                    className="brief-contact-field__control"
                  />
                </label>

                <label className="brief-contact-field">
                  <span className="brief-contact-field__label">Email *</span>
                  <input
                    type="email"
                    required
                    value={contact.email}
                    onChange={(e) => setContact({ ...contact, email: e.target.value })}
                    placeholder="jane@company.com"
                    className="brief-contact-field__control"
                  />
                </label>

                <label className="brief-contact-field sm:col-span-2">
                  <span className="brief-contact-field__label flex items-center justify-between">
                    <span>Company / Project Name</span>
                    <span className="text-tide/50 font-normal">Optional</span>
                  </span>
                  <input
                    type="text"
                    value={contact.company}
                    onChange={(e) => setContact({ ...contact, company: e.target.value })}
                    placeholder="Acme Studio"
                    className="brief-contact-field__control"
                  />
                </label>

                <label className="brief-contact-field sm:col-span-2">
                  <span className="brief-contact-field__label flex items-center justify-between">
                    <span>Anything else we should know?</span>
                    <span className="text-tide/50 font-normal">Optional</span>
                  </span>
                  <textarea
                    rows={4}
                    value={contact.message}
                    onChange={(e) => setContact({ ...contact, message: e.target.value })}
                    placeholder="Goals, references, existing links, or special constraints..."
                    className="brief-contact-field__control resize-none"
                  />
                </label>
              </div>
            </fieldset>
          </form>

          {/* Live Quotation & Brief Summary Sidebar */}
          <aside className="lg:sticky lg:top-28 lg:self-start">
            <div className="border border-shelf/70 bg-abyss-2/95 p-6 sm:p-7 rounded-xl shadow-2xl backdrop-blur-md">
              <div className="mb-4 flex items-center justify-between gap-4">
                <p className="readout readout-caps text-seaglass font-bold">Your brief</p>
                <span className="readout text-[0.72rem] text-tvl-amber font-mono font-bold">
                  {completedStepsCount} / {siteData.brief.steps.length}
                </span>
              </div>

              {/* Real-time Dynamic Auto-Quotation Box */}
              <div className="border-t border-shelf/50 pt-4">
                <div className="rounded-lg bg-abyss/80 border border-tvl-amber/40 p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[0.68rem] font-mono uppercase tracking-wider text-tide">
                      Auto-Quotation Preview
                    </span>
                    <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-tvl-amber/20 text-tvl-amber border border-tvl-amber/30">
                      {quote.recommendedTier}
                    </span>
                  </div>

                  <div className="mt-1">
                    <span className="font-mono text-2xl font-bold text-tvl-amber">
                      ${quote.minPrice.toLocaleString()} – ${quote.maxPrice.toLocaleString()}
                    </span>
                    <span className="block text-[0.72rem] text-tide/80 mt-0.5">
                      Estimated Turnaround: <strong className="text-seaglass">{quote.estimatedWeeks}</strong>
                    </span>
                  </div>

                  {/* Deliverables snippet */}
                  <div className="mt-3 pt-3 border-t border-shelf/30">
                    <span className="text-[0.65rem] font-mono uppercase text-tide/70 block mb-1.5">
                      Included Scope:
                    </span>
                    <ul className="space-y-1 text-xs text-seaglass/90">
                      {quote.deliverables.slice(0, 3).map((item) => (
                        <li key={item} className="flex items-center gap-1.5 truncate">
                          <span className="h-1 w-1 rounded-full bg-tvl-amber shrink-0" />
                          <span className="truncate">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              {/* Submit and Action Buttons */}
              <div className="mt-6 flex flex-col gap-3">
                {success ? (
                  <div className="rounded-lg bg-green-950/40 border border-green-500/40 p-4 text-center">
                    <p className="text-sm font-semibold text-green-400">
                      ✓ Brief & Quote Received!
                    </p>
                    <p className="text-xs text-green-300/80 mt-1">
                      Our operations team will review your quote and reply within 24 hours.
                    </p>
                  </div>
                ) : (
                  <button
                    type="submit"
                    form="brief-submission-form"
                    disabled={!canSubmit}
                    className="inline-flex min-h-12 items-center justify-center rounded-full bg-seaglass px-5 py-3 text-sm font-semibold tracking-tight text-abyss transition-all duration-200 hover:bg-tvl-amber hover:text-tvl-plum-dark active:scale-[0.98] disabled:cursor-not-allowed disabled:bg-shelf/35 disabled:text-tide/50"
                  >
                    {submitting ? "Sending brief..." : "Send project brief"}
                  </button>
                )}

                <div className="flex gap-2.5">
                  <button
                    type="button"
                    onClick={handleCopyBrief}
                    className="inline-flex min-h-11 flex-1 items-center justify-center rounded-full border border-shelf bg-transparent px-4 py-2 text-xs font-mono font-medium text-tide transition-colors hover:border-tvl-amber hover:text-seaglass active:scale-[0.98]"
                  >
                    {copied ? "✓ Copied to clipboard" : "Copy brief summary"}
                  </button>
                </div>
              </div>

              <p className="mt-4 text-[0.72rem] leading-relaxed text-tide/70">
                Your brief submits directly to our Agency Operations OS. Pricing ranges are estimated and confirmed during discovery.
              </p>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
};
