import React from "react";
import Link from "next/link";
import { siteData } from "@/data/siteData";

export const Services: React.FC = () => {
  return (
    <section
      id="services"
      className="scroll-mt-24 bg-abyss pt-16 pb-24 sm:pt-20 sm:pb-32 border-b border-shelf/50"
    >
      <div className="mx-auto w-full max-w-[74rem] px-5 sm:px-8 lg:px-10">
        <header className="mb-12 max-w-[52rem] sm:mb-16" data-reveal="true">
          <div className="mb-5 flex items-center gap-4">
            <span aria-hidden="true" className="block h-px w-10 bg-tvl-amber" />
            <span className="readout readout-caps text-tvl-amber font-mono">Capabilities</span>
          </div>
          <h2 className="text-h2 text-seaglass font-display">
            {siteData.services.title}
          </h2>
          <p className="mt-4 max-w-[54ch] text-[1.02rem] leading-relaxed text-tide">
            {siteData.services.intro}
          </p>
        </header>

        <div className="border-t border-shelf/60">
          {siteData.services.pillars.map((pillar, idx) => (
            <div
              key={pillar.id}
              data-reveal="true"
              className="premium-service-row group relative grid gap-5 overflow-hidden border-b border-shelf/60 py-9 outline-none sm:grid-cols-[4.5rem_14rem_1fr] sm:gap-8 sm:py-10 hover:bg-abyss-2/30"
            >
              <span aria-hidden="true" className="premium-service-row__edge" />
              <span className="premium-service-row__index readout pt-1 text-tvl-amber font-mono font-semibold">
                {String(idx + 1).padStart(2, "0")}
              </span>
              <h3 className="premium-service-row__title font-sans text-xl font-semibold text-seaglass sm:text-2xl group-hover:text-tvl-amber transition-colors">
                {pillar.name}
              </h3>
              <div>
                <p className="max-w-[46ch] text-[1rem] leading-relaxed text-seaglass/90">
                  {pillar.outcome}
                </p>
                <div className="mt-5 flex max-w-[48rem] flex-wrap gap-x-3 gap-y-2">
                  {pillar.capabilities.map((cap) => (
                    <span
                      key={cap}
                      className="rounded-full bg-shelf/20 border border-shelf/40 px-3 py-1 text-[0.78rem] text-tide transition-colors group-hover:border-tvl-amber/40 group-hover:text-seaglass"
                    >
                      {cap}
                    </span>
                  ))}
                </div>
                <div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-2 pt-2">
                  <span className="readout readout-caps text-tide/70">Related Case:</span>
                  <span className="text-sm font-medium text-tvl-amber">
                    {pillar.relatedWork}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Footer callout */}
        <div
          data-reveal="true"
          className="mt-10 flex flex-col gap-5 border-l-2 border-tvl-amber pl-5 sm:flex-row sm:items-center sm:justify-between"
        >
          <p className="max-w-[55ch] text-base leading-relaxed text-seaglass">
            {siteData.services.closing}
          </p>
          <div className="flex flex-wrap items-center gap-x-5 gap-y-3">
            <Link
              href="#brief"
              className="group inline-flex items-center gap-2 text-sm font-semibold text-tvl-amber transition-colors hover:text-white"
            >
              Build your brief
              <span aria-hidden="true" className="transition-transform duration-200 group-hover:translate-x-1">
                →
              </span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};
