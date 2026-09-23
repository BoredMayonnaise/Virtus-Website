"use client";

import React from "react";
import Link from "next/link";
import { siteData } from "@/data/siteData";

interface EngagementsProps {
  onSelectTier?: (tier: string) => void;
}

export const Engagements: React.FC<EngagementsProps> = ({ onSelectTier }) => {
  return (
    <section id="engagements" className="scroll-mt-24 bg-shelf/30 pt-20 pb-16 text-seaglass sm:pt-24 sm:pb-20 border-b border-shelf/50">
      <div className="mx-auto w-full max-w-[74rem] px-5 sm:px-8 lg:px-10">
        <header className="mb-12 max-w-[52rem] sm:mb-16" data-reveal="true">
          <div className="mb-5 flex items-center gap-4">
            <span aria-hidden="true" className="block h-px w-10 bg-tvl-amber" />
            <span className="readout readout-caps text-tvl-amber font-mono">Engagement models</span>
          </div>
          <h2 className="text-h2 text-seaglass font-display">
            {siteData.engagements.title}
          </h2>
          <p className="mt-4 max-w-[54ch] text-[1.02rem] leading-relaxed text-tide">
            {siteData.engagements.intro}
          </p>
        </header>

        <div className="grid border-y border-shelf/50 md:grid-cols-3 md:divide-x md:divide-shelf/50">
          {siteData.engagements.models.map((model, idx) => (
            <article
              key={model.name}
              data-reveal="true"
              className="premium-engagement group relative flex flex-col overflow-hidden border-b border-shelf/50 py-8 last:border-b-0 md:border-b-0 md:px-7 md:first:pl-0 md:last:pr-0 hover:bg-shelf/20"
            >
              <span aria-hidden="true" className="premium-engagement__wash" />
              <span className="font-mono text-xs tracking-[0.12em] text-tvl-amber font-bold">
                {String(idx + 1).padStart(2, "0")}
              </span>

              <h3 className="mt-5 font-display text-3xl leading-none text-seaglass sm:text-[2.4rem] font-bold group-hover:text-tvl-amber transition-colors">
                {model.name}
              </h3>

              <p className="mt-4 min-h-[3.25rem] max-w-[28ch] text-[0.95rem] leading-relaxed text-seaglass/88">
                {model.summary}
              </p>

              <div className="mt-7 flex-1 border-t border-shelf/40 pt-5">
                <span className="font-mono text-[0.66rem] uppercase tracking-[0.12em] text-tide font-semibold">
                  Good for
                </span>
                <ul className="mt-4 space-y-2.5 text-sm text-seaglass/90">
                  {model.goodFor.map((item) => (
                    <li key={item} className="flex items-start gap-3">
                      <span aria-hidden="true" className="mt-[0.65rem] h-px w-3 shrink-0 bg-tvl-amber" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-6 pt-4 border-t border-shelf/30 flex items-center justify-between font-mono text-xs">
                <span className="text-tide/75">
                  {model.name === "Focused"
                    ? "2 – 3 weeks"
                    : model.name === "Growth"
                    ? "4 – 6 weeks"
                    : "6 – 8 weeks"}
                </span>
                <span className="text-tvl-amber font-bold">
                  {model.name === "Focused"
                    ? "From $1,800"
                    : model.name === "Growth"
                    ? "From $4,200"
                    : "From $8,500"}
                </span>
              </div>

              <Link
                href="#brief"
                onClick={(e) => {
                  onSelectTier?.(model.name);
                }}
                className="group mt-6 inline-flex items-center justify-between rounded-full border border-tvl-amber/40 bg-tvl-amber/10 px-4 py-2.5 text-xs font-mono font-bold text-tvl-amber hover:border-tvl-amber hover:bg-tvl-amber hover:text-tvl-plum-dark transition-all duration-200"
              >
                <span>Select {model.name}</span>
                <span aria-hidden="true" className="transition-transform duration-200 group-hover:translate-x-1">
                  →
                </span>
              </Link>
            </article>
          ))}
        </div>

        <p data-reveal="true" className="mt-7 max-w-[62ch] text-sm leading-relaxed text-tide">
          {siteData.engagements.note}
        </p>
      </div>
    </section>
  );
};
