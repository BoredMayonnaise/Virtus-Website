import React from "react";
import { siteData } from "@/data/siteData";

export const FAQ: React.FC = () => {
  return (
    <section id="faq" className="scroll-mt-24 bg-abyss-2/96 py-24 sm:py-32 border-b border-shelf/50">
      <div className="mx-auto w-full max-w-[74rem] px-5 sm:px-8 lg:px-10">
        <header className="mb-12 max-w-[52rem] sm:mb-16" data-reveal="true">
          <div className="mb-5 flex items-center gap-4">
            <span aria-hidden="true" className="block h-px w-10 bg-tvl-amber" />
            <span className="readout readout-caps text-tvl-amber font-mono">FAQ</span>
          </div>
          <h2 className="text-h2 text-seaglass font-display">
            {siteData.faq.title}
          </h2>
        </header>

        <div className="border-t border-shelf/60">
          {siteData.faq.items.map((item, idx) => (
            <details
              key={item.q}
              name="virtus-faq"
              className="group border-b border-shelf/60 transition-colors duration-200 hover:bg-shelf/10 [&_summary::-webkit-details-marker]:hidden"
            >
              <summary className="grid cursor-pointer list-none grid-cols-[2.5rem_1fr_auto] items-center gap-3 py-5 text-[1rem] font-medium text-seaglass focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-tide sm:grid-cols-[3.5rem_1fr_auto] sm:py-6 sm:text-[1.05rem]">
                <span className="readout text-tvl-amber font-mono font-bold">
                  {String(idx + 1).padStart(2, "0")}
                </span>
                <span className="group-hover:text-tvl-amber transition-colors">
                  {item.q}
                </span>
                <span aria-hidden="true" className="relative h-3 w-3 shrink-0 text-tide group-hover:text-tvl-amber">
                  <span className="absolute left-0 top-1/2 h-px w-3 -translate-y-1/2 bg-current" />
                  <span className="absolute left-1/2 top-0 h-3 w-px -translate-x-1/2 bg-current transition-all duration-200 group-open:rotate-90 group-open:opacity-0" />
                </span>
              </summary>
              <div className="faq-answer-grid">
                <div className="overflow-hidden">
                  <p className="max-w-[66ch] pb-6 pl-[2.5rem] pr-8 text-[0.95rem] leading-relaxed text-tide sm:pl-[3.5rem]">
                    {item.a}
                  </p>
                </div>
              </div>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
};
