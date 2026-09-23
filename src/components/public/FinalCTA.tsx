import React from "react";
import Link from "next/link";
import { siteData } from "@/data/siteData";

export const FinalCTA: React.FC = () => {
  return (
    <section id="final-cta" className="scroll-mt-24 bg-seaglass py-28 text-abyss sm:py-36">
      <div className="mx-auto w-full max-w-[74rem] px-5 sm:px-8 lg:px-10">
        <div data-reveal="true" className="final-cta-arrival max-w-[64rem]">
          <span className="font-mono text-[0.72rem] font-bold uppercase tracking-[0.14em] text-deep-2">
            {siteData.finalCta.eyebrow}
          </span>
          <span aria-hidden="true" className="mt-5 block h-px w-24 bg-deep-2/45" />

          <p className="mt-6 max-w-[14ch] font-display text-[clamp(2.8rem,7vw,6.5rem)] leading-[0.94] tracking-[-0.035em] text-abyss font-bold">
            {siteData.finalCta.line}
          </p>

          <p className="mt-3 font-display text-[clamp(2rem,4vw,4.2rem)] italic leading-[1] text-tvl-ochre">
            {siteData.finalCta.subline}
          </p>

          <div className="mt-10">
            <Link
              href="#brief"
              className="group inline-flex min-h-12 items-center justify-center gap-2.5 rounded-full px-7 py-3.5 text-sm font-semibold tracking-tight transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] bg-abyss text-seaglass hover:bg-tvl-plum"
            >
              {siteData.finalCta.action.label}
              <span aria-hidden="true" className="transition-transform duration-200 group-hover:translate-x-1 text-tvl-amber">
                →
              </span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};
