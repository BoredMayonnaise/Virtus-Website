import React from "react";
import Link from "next/link";
import Image from "next/image";
import { siteData } from "@/data/siteData";

export const Hero: React.FC = () => {
  return (
    <section
      id="top"
      className="relative flex min-h-[100svh] items-center overflow-hidden pt-24 pb-20 sm:pt-28 sm:pb-24 lg:pt-20 lg:pb-20 bg-abyss"
    >
      {/* Background gradients */}
      <div className="absolute inset-0 bg-gradient-to-r from-abyss via-abyss/86 to-transparent sm:via-abyss/64 pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-t from-abyss via-transparent to-abyss/40 pointer-events-none" />

      {/* Decorative ambient brand glows */}
      <div className="absolute -top-32 right-1/4 h-96 w-96 rounded-full bg-tvl-amber/5 blur-[120px] pointer-events-none" />
      <div className="absolute -bottom-20 left-10 h-80 w-80 rounded-full bg-tvl-orange/5 blur-[100px] pointer-events-none" />

      <div className="mx-auto w-full max-w-[74rem] px-5 sm:px-8 lg:px-10 relative z-10 flex min-h-[72svh] items-center">
        <div className="grid grid-cols-1 lg:grid-cols-[1.3fr_0.9fr] gap-10 lg:gap-12 items-center w-full">
          <div className="max-w-[48rem]">
            {/* Eyebrow & Live Status */}
            <div className="hero-rise hero-rise-1 mb-7 flex flex-wrap items-center gap-x-4 gap-y-2">
              <span className="readout readout-caps text-tide">
                {siteData.hero.eyebrow}
              </span>
              <span aria-hidden="true" className="hidden h-px w-8 bg-shelf sm:block" />
              <span className="inline-flex items-center gap-2 text-[0.72rem] font-medium uppercase tracking-[0.12em] text-seaglass">
                <span
                  aria-hidden="true"
                  className="h-1.5 w-1.5 rounded-full bg-tvl-amber animate-ping"
                />
                <span
                  aria-hidden="true"
                  className="h-1.5 w-1.5 rounded-full bg-tvl-amber -ml-3.5"
                />
                {siteData.availability}
              </span>
            </div>

            {/* Main Headline */}
            <h1 className="hero-rise hero-rise-2 font-display text-[clamp(2.7rem,5vw,5.5rem)] leading-[0.96] tracking-[-0.035em] text-seaglass">
              Where brand, technology, and content move together.
            </h1>

            {/* Subtitle */}
            <p className="hero-rise hero-rise-3 mt-6 max-w-[50ch] text-base leading-relaxed text-tide sm:mt-7 sm:text-lg">
              {siteData.hero.body}
            </p>

            {/* CTA Action Buttons */}
            <div className="hero-rise hero-rise-4 mt-9 flex flex-wrap items-center gap-3.5 sm:mt-10">
              <Link
                href="#brief"
                className="group inline-flex min-h-12 items-center justify-center gap-2.5 rounded-full px-6 py-3 text-sm font-medium tracking-tight transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] bg-seaglass text-abyss hover:bg-tvl-amber hover:text-tvl-plum-dark"
              >
                {siteData.hero.primary.label}
              </Link>

              <Link
                href="#work"
                className="group inline-flex min-h-12 items-center justify-center gap-2.5 rounded-full px-6 py-3 text-sm font-medium tracking-tight transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] border border-shelf/80 bg-transparent text-seaglass hover:border-tvl-amber hover:bg-tvl-amber/10"
              >
                {siteData.hero.secondary.label}
                <span
                  aria-hidden="true"
                  className="transition-transform duration-200 group-hover:translate-x-1"
                >
                  →
                </span>
              </Link>
            </div>

            {/* Disciplines Bar */}
            <div className="hero-rise hero-rise-4 mt-10 border-t border-shelf/55 pt-5">
              <div className="flex flex-wrap gap-x-2 gap-y-2">
                {siteData.hero.disciplines.map((discipline) => (
                  <Link
                    key={discipline}
                    href="#services"
                    className="readout readout-caps rounded-full border border-shelf/40 bg-shelf/10 px-3.5 py-1.5 text-tide/90 transition-all duration-300 hover:border-tvl-amber/60 hover:text-tvl-amber"
                  >
                    <span className="inline-block h-1.5 w-1.5 rounded-full bg-tvl-amber mr-2" />
                    {discipline}
                  </Link>
                ))}
              </div>
            </div>

            {/* Scroll Cue */}
            <Link
              href="#work"
              className="mt-8 inline-flex items-center gap-3 text-tide transition-colors hover:text-seaglass"
            >
              <span className="readout readout-caps">Scroll to descend</span>
              <span aria-hidden="true" className="animate-bounce">
                ↓
              </span>
            </Link>
          </div>

          {/* Right Column: Facebook Banner Visual Artwork */}
          <div className="relative flex items-center justify-center lg:justify-end">
            <div className="relative w-full max-w-lg rounded-2xl border border-tvl-amber/25 bg-gradient-to-br from-tvl-amber/10 via-black/40 to-transparent p-4 sm:p-6 backdrop-blur-md shadow-2xl shadow-tvl-amber/10 group hover:border-tvl-amber/50 transition-all duration-500">
              {/* Corner industrial accents */}
              <div className="absolute top-3 left-3 font-mono text-[0.62rem] text-tvl-amber/70 tracking-widest font-bold">
                EST. 2026 // STUDIO BANNER
              </div>
              <div className="absolute bottom-3 right-3 font-mono text-[0.62rem] text-tvl-amber/70 tracking-widest font-bold">
                MANILA → GLOBAL
              </div>

              {/* Glowing halo */}
              <div className="absolute inset-0 bg-tvl-amber/10 blur-2xl rounded-2xl pointer-events-none" />

              <Image
                src="/virtus-banner.png"
                alt="The Virtus Labs - One Team Banner"
                width={1024}
                height={576}
                priority
                className="relative z-10 w-full h-auto object-contain drop-shadow-[0_12px_30px_rgba(255,230,0,0.2)] group-hover:scale-[1.02] transition-transform duration-500"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
