import React from "react";
import Link from "next/link";
import { siteData } from "@/data/siteData";

export const Products: React.FC = () => {
  return (
    <section
      id="products"
      className="scroll-mt-24 bg-seaglass py-24 text-abyss sm:py-32"
    >
      <div className="mx-auto w-full max-w-[74rem] px-5 sm:px-8 lg:px-10">
        <header className="mb-12 max-w-[52rem] sm:mb-16" data-reveal="true">
          <div className="mb-5 flex items-center gap-4">
            <span aria-hidden="true" className="block h-px w-10 bg-deep-2" />
            <span className="readout readout-caps text-deep-2 font-mono font-semibold">
              {siteData.products.eyebrow}
            </span>
          </div>
          <h2 className="text-h2 text-abyss font-display">
            {siteData.products.title}
          </h2>
          <p className="mt-4 max-w-[54ch] text-[1.02rem] leading-relaxed text-deep-2 font-medium">
            {siteData.products.intro}
          </p>
        </header>

        <div className="grid border-t border-deep-2/45 md:grid-cols-2">
          {siteData.products.families.map((family, idx) => (
            <div
              key={family.id}
              data-reveal="true"
              className="premium-product-family group relative block overflow-hidden border-b border-deep-2/45 py-9 outline-none md:odd:border-r md:odd:pr-10 md:even:pl-10"
            >
              <div className="mb-6 flex items-center justify-between gap-4">
                <span className="font-mono text-xs font-bold tracking-[0.12em] text-deep-2">
                  {String(idx + 1).padStart(2, "0")}
                </span>
                <span className="font-mono text-[0.68rem] uppercase tracking-[0.12em] text-deep-2/80 font-medium">
                  Product Family
                </span>
              </div>

              <h3 className="premium-product-family__title font-display text-[clamp(1.8rem,3vw,2.8rem)] leading-[1] tracking-[-0.025em] text-abyss font-bold group-hover:text-tvl-ochre transition-colors">
                {family.name}
              </h3>

              <p className="mt-4 max-w-[42ch] text-[0.95rem] leading-relaxed text-deep-2">
                {family.desc}
              </p>

              <div className="mt-6 flex flex-wrap gap-x-4 gap-y-2 border-t border-deep-2/25 pt-5">
                {family.includes.map((inc) => (
                  <span
                    key={inc}
                    className="text-[0.8rem] font-semibold text-abyss/80 bg-deep-2/10 px-2.5 py-1 rounded"
                  >
                    {inc}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div
          data-reveal="true"
          className="mt-8 flex flex-col gap-5 border-l-2 border-deep-2 pl-5 sm:flex-row sm:items-center sm:justify-between"
        >
          <p className="max-w-[58ch] text-sm leading-relaxed text-deep-2 font-medium">
            {siteData.products.note}
          </p>
          <Link
            href="#brief"
            className="group inline-flex shrink-0 items-center gap-2 text-sm font-bold text-abyss hover:text-tvl-ochre transition-colors"
          >
            Inquire about custom products
            <span aria-hidden="true" className="transition-transform duration-200 group-hover:translate-x-1">
              →
            </span>
          </Link>
        </div>
      </div>
    </section>
  );
};
