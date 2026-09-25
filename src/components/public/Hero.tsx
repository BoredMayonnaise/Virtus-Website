import React from "react";
import Link from "next/link";
import { siteData } from "@/data/siteData";

interface HeroProps {
  onOpenInquiry: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onOpenInquiry }) => {
  return (
    <section
      id="top"
      className="relative flex min-h-[calc(100svh-4rem)] items-center overflow-hidden bg-black pb-14 pt-8 sm:pb-20 sm:pt-12 lg:min-h-[calc(100svh-4.5rem)]"
    >
      <div aria-hidden="true" className="absolute bottom-0 left-0 h-1 w-1/2 bg-tvl-amber sm:w-1/3" />

      {/* Approved logo artwork: white + yellow on black. Decorative, never distorted. */}
      <svg
        aria-hidden="true"
        focusable="false"
        viewBox="0 0 100 90"
        className="pointer-events-none absolute right-[max(2.5rem,calc((100%-74rem)/2+2.5rem))] top-1/2 hidden h-[clamp(16rem,32vw,28rem)] w-auto -translate-y-1/2 lg:block"
      >
        <polygon points="0,0 29.6,0 50.2,59.8 79.6,59.8 69,90 31,90" fill="#FFFFFF" />
        <polygon points="70.6,0 100,0 82.9,50.2 53.5,50.2" fill="#FBD227" />
      </svg>

      <div className="relative z-10 mx-auto w-full max-w-[74rem] px-5 sm:px-8 lg:px-10">
        <div className="max-w-[46rem] lg:max-w-[42rem] xl:max-w-[48rem]">
          <div className="hero-rise hero-rise-1 mb-6 flex flex-wrap items-center gap-x-4 gap-y-2 sm:mb-8">
            <span className="text-eyebrow font-sans font-bold uppercase text-white">
              {siteData.hero.eyebrow}
            </span>
          </div>

          <h1 className="hero-rise hero-rise-2 type-display text-[clamp(3.5rem,11vw,8.5rem)] text-seaglass">
            {siteData.hero.displayLines.map((line, index) => (
              <span key={line} className={`block ${index === 1 ? "text-tvl-amber" : ""}`}>
                {line}
              </span>
            ))}
          </h1>

          <p className="hero-rise hero-rise-3 mt-6 max-w-[40ch] font-sans text-lg leading-[1.5] text-white sm:mt-8 sm:text-xl">
            {siteData.hero.body}
          </p>

          <div className="hero-rise hero-rise-4 mt-8 flex flex-col gap-4 sm:mt-10 sm:flex-row sm:items-center sm:gap-8">
            <button
              type="button"
              onClick={onOpenInquiry}
              aria-haspopup="dialog"
              className="inline-flex min-h-14 items-center justify-center bg-tvl-amber px-8 font-sans text-sm font-bold uppercase tracking-[0.16em] text-black transition-colors hover:bg-white focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-4 focus-visible:outline-white"
            >
              {siteData.hero.primary.label}
            </button>
            <Link
              href={siteData.hero.secondary.href}
              className="group inline-flex min-h-11 items-center gap-2 self-start font-sans text-sm font-bold uppercase tracking-[0.12em] text-white transition-colors hover:text-tvl-amber focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-4 focus-visible:outline-tvl-amber sm:self-auto"
            >
              {siteData.hero.secondary.label}
              <span aria-hidden="true" className="transition-transform duration-200 group-hover:translate-x-1">
                →
              </span>
            </Link>
          </div>

          <ul className="hero-rise hero-rise-4 mt-10 flex flex-wrap gap-x-5 gap-y-2 border-t border-shelf pt-5 font-sans text-xs font-semibold uppercase tracking-[0.14em] text-tide sm:mt-12">
            {siteData.hero.disciplines.map((discipline) => (
              <li key={discipline} className="flex items-center gap-2.5">
                <span aria-hidden="true" className="h-1 w-1 bg-tvl-amber" />
                {discipline}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
};
