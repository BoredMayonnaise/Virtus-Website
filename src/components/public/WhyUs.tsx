import React from "react";
import { siteData } from "@/data/siteData";

export const WhyUs: React.FC = () => {
  return (
    <section id="why-us" className="scroll-mt-24 bg-abyss py-24 sm:py-32 border-b border-shelf/50">
      <div className="mx-auto w-full max-w-[74rem] px-5 sm:px-8 lg:px-10">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-[21rem_1fr] lg:gap-20">
          <header data-reveal="true" className="lg:sticky lg:top-28 lg:self-start">
            <span className="readout readout-caps text-tvl-amber font-mono">Studio model</span>
            <h2 className="mt-4 text-h2 text-seaglass font-display">
              {siteData.why.title}
            </h2>
            <p className="mt-4 max-w-[34ch] text-[1rem] leading-relaxed text-tide">
              {siteData.why.intro}
            </p>
          </header>

          <div className="border-t border-shelf/60">
            {siteData.why.points.map((point, idx) => (
              <article
                key={point.name}
                data-reveal="true"
                className="premium-why-row group relative grid grid-cols-[2.75rem_1fr] gap-4 border-b border-shelf/60 py-8 sm:grid-cols-[4rem_1fr] sm:gap-6 sm:py-9 hover:bg-abyss-2/30"
              >
                <span aria-hidden="true" className="premium-why-row__line" />
                <span className="premium-why-row__index readout pt-1 text-tvl-amber font-mono font-bold">
                  {String(idx + 1).padStart(2, "0")}
                </span>
                <div>
                  <h3 className="premium-why-row__title font-sans text-lg font-semibold text-seaglass sm:text-xl group-hover:text-tvl-amber transition-colors">
                    {point.name}
                  </h3>
                  <p className="premium-why-row__copy mt-2.5 max-w-[52ch] text-[0.95rem] leading-relaxed text-tide">
                    {point.desc}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
