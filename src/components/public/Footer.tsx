import React from "react";
import Link from "next/link";
import { Logo } from "./Logo";
import { siteData } from "@/data/siteData";

export const Footer: React.FC = () => {
  return (
    <footer id="footer" className="relative z-[1] border-t border-shelf/55 bg-abyss py-14 sm:py-20">
      <div className="mx-auto w-full max-w-[74rem] px-5 sm:px-8 lg:px-10">
        {/* Top Tier: Straightened Navigation Columns */}
        <div className="grid grid-cols-2 gap-8 sm:gap-10 md:grid-cols-4 lg:gap-12">
          {siteData.footer.groups.map((group) => (
            <nav key={group.title} aria-label={group.title}>
              <p className="readout readout-caps font-mono text-xs font-bold uppercase tracking-wider text-tvl-amber">
                {group.title}
              </p>
              <div className="mt-4 flex flex-col gap-2.5">
                {group.links.map((link) => (
                  <Link
                    key={link.label}
                    href={link.href}
                    className="text-sm text-seaglass/85 transition-colors hover:text-tvl-amber"
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </nav>
          ))}
        </div>

        {/* Lower Tier: The Virtus Labs Bit Below, Spread Out */}
        <div className="mt-14 border-t border-shelf/55 pt-10">
          <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-2xl">
              <Logo size="lg" />
              <p className="mt-4 font-display text-xl sm:text-2xl text-seaglass font-normal leading-snug tracking-tight">
                {siteData.footer.tagline}
              </p>
              <p className="mt-2.5 font-mono text-xs text-tide/75 uppercase tracking-widest">
                The Virtus Labs · Digital Studio & Operational Infrastructure
              </p>
            </div>

            <div className="flex flex-col gap-4 sm:flex-row sm:items-end lg:flex-col lg:items-end lg:text-right">
              <div className="inline-flex items-center gap-2 rounded-full border border-tvl-amber/30 bg-tvl-amber/10 px-3.5 py-1.5 font-mono text-xs text-tvl-amber">
                <span className="h-1.5 w-1.5 rounded-full bg-tvl-amber animate-pulse" />
                <span className="font-semibold tracking-wide">Available for Select Engagements</span>
              </div>

              <div>
                <p className="readout font-mono text-sm font-semibold text-seaglass">
                  {siteData.footer.built}
                </p>
                <p className="readout mt-1 font-mono text-[0.68rem] text-tide/70">
                  {siteData.footer.disclosure}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
