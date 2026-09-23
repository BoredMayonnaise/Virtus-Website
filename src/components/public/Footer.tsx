import React from "react";
import Link from "next/link";
import { Logo } from "./Logo";
import { siteData } from "@/data/siteData";

export const Footer: React.FC = () => {
  return (
    <footer id="footer" className="relative z-[1] border-t border-shelf/55 bg-abyss py-14 sm:py-18">
      <div className="mx-auto w-full max-w-[74rem] px-5 sm:px-8 lg:px-10">
        <div className="grid gap-12 lg:grid-cols-[1.4fr_1fr_1fr]">
          <div className="max-w-[34rem]">
            <Logo size="lg" />
            <p className="mt-4 max-w-[28ch] font-display text-xl leading-snug text-tide">
              {siteData.footer.tagline}
            </p>
          </div>

          {siteData.footer.groups.map((group) => (
            <nav key={group.title} aria-label={group.title}>
              <p className="readout readout-caps text-tvl-amber font-mono font-bold">
                {group.title}
              </p>
              <div className="mt-4 flex flex-col gap-2.5">
                {group.links.map((link) => (
                  <Link
                    key={link.label}
                    href={link.href}
                    className="text-sm text-seaglass/90 transition-colors hover:text-tvl-amber"
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </nav>
          ))}
        </div>

        <div className="mt-12 grid gap-6 border-t border-shelf/55 pt-7 sm:grid-cols-[1fr_auto] sm:items-end">
          <div aria-hidden="true">
            <span className="font-mono text-xs text-tide/70">
              The Virtus Labs · Digital Studio & Operational Infrastructure
            </span>
          </div>
          <div className="sm:text-right">
            <p className="readout text-seaglass font-mono font-semibold">
              {siteData.footer.built}
            </p>
            <p className="readout mt-1 text-[0.66rem] text-tide/70">
              {siteData.footer.disclosure}
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};
