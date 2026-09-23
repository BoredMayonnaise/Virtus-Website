import React from "react";
import { siteData } from "@/data/siteData";

export const Process: React.FC = () => {
  return (
    <section id="process" className="scroll-mt-24 bg-abyss-2/96 py-24 sm:py-32 border-b border-shelf/50">
      <div className="mx-auto w-full max-w-[74rem] px-5 sm:px-8 lg:px-10">
        <header className="mb-12 max-w-[52rem] sm:mb-16" data-reveal="true">
          <div className="mb-5 flex items-center gap-4">
            <span aria-hidden="true" className="block h-px w-10 bg-tvl-amber" />
            <span className="readout readout-caps text-tvl-amber font-mono">Process</span>
          </div>
          <h2 className="text-h2 text-seaglass font-display">
            {siteData.process.title}
          </h2>
          <p className="mt-4 max-w-[54ch] text-[1.02rem] leading-relaxed text-tide">
            {siteData.process.intro}
          </p>
        </header>

        <ol className="border-t border-shelf/60">
          {siteData.process.steps.map((step, idx) => (
            <li
              key={step.name}
              data-reveal="true"
              className="premium-process-row group relative grid grid-cols-[3.5rem_1fr] gap-5 border-b border-shelf/60 py-8 sm:grid-cols-[5rem_13rem_1fr] sm:gap-8 sm:py-9 hover:bg-abyss/40"
            >
              <span aria-hidden="true" className="premium-process-row__progress" />
              <div>
                <span className="premium-process-row__number font-display text-2xl leading-none text-tvl-amber sm:text-3xl font-bold">
                  {String(idx + 1).padStart(2, "0")}
                </span>
                <span className="readout mt-2 block text-[0.62rem] uppercase tracking-[0.12em] text-tide/70">
                  Phase
                </span>
              </div>
              <h3 className="premium-process-row__title font-sans text-xl font-semibold text-seaglass sm:text-2xl group-hover:text-tvl-amber transition-colors">
                {step.name}
              </h3>
              <p className="premium-process-row__copy max-w-[52ch] text-[0.95rem] leading-relaxed text-tide">
                {step.desc}
              </p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
};
