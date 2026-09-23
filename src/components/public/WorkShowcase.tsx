"use client";

import React, { useState, useRef } from "react";
import Image from "next/image";
import { siteData } from "@/data/siteData";

export const WorkShowcase: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const projects = siteData.work.projects;
  const trackRef = useRef<HTMLDivElement>(null);

  const handleNext = () => {
    setCurrentIndex((prev) => (prev < projects.length - 1 ? prev + 1 : 0));
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : projects.length - 1));
  };

  return (
    <section id="work" aria-labelledby="work-title" className="work-showcase relative scroll-mt-24 py-20 bg-abyss border-b border-shelf/50">
      <div className="mx-auto w-full max-w-[74rem] px-5 sm:px-8 lg:px-10 mb-10">
        <header data-reveal="true" className="flex items-end justify-between gap-8">
          <div className="max-w-[50rem]">
            <span className="readout readout-caps text-tvl-amber font-mono">Portfolio</span>
            <h2
              id="work-title"
              className="mt-3 font-display text-[clamp(2.2rem,4.5vw,4.2rem)] font-bold leading-[1.08] tracking-tight text-seaglass"
            >
              {siteData.work.title}
            </h2>
            <p className="mt-3 max-w-[60ch] text-sm leading-relaxed text-tide sm:text-base">
              {siteData.work.intro}
            </p>
            <p className="mt-2 max-w-[66ch] text-[0.72rem] leading-relaxed text-tide/65">
              {siteData.work.note}
            </p>
          </div>

          <div className="hidden shrink-0 flex-col items-end gap-3 pb-1 md:flex">
            {/* Live project counter 01 / 05 */}
            <div className="flex items-baseline gap-2" aria-label={`Project ${currentIndex + 1} of ${projects.length}`}>
              <span className="font-mono text-3xl font-semibold tabular-nums text-tvl-amber">
                {String(currentIndex + 1).padStart(2, "0")}
              </span>
              <span className="readout text-shelf">/</span>
              <span className="readout tabular-nums text-tide">
                {String(projects.length).padStart(2, "0")}
              </span>
            </div>

            {/* Navigation buttons */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handlePrev}
                className="flex h-9 w-9 items-center justify-center rounded-full border border-shelf bg-shelf/20 text-seaglass transition-colors hover:border-tvl-amber hover:text-tvl-amber"
                aria-label="Previous project"
              >
                ←
              </button>
              <button
                type="button"
                onClick={handleNext}
                className="flex h-9 w-9 items-center justify-center rounded-full border border-shelf bg-shelf/20 text-seaglass transition-colors hover:border-tvl-amber hover:text-tvl-amber"
                aria-label="Next project"
              >
                →
              </button>
            </div>
          </div>
        </header>
      </div>

      {/* Horizontal Interactive Showcase Cards */}
      <div className="relative overflow-x-auto pb-8 pt-4 px-5 sm:px-8 lg:px-10 scrollbar-none" ref={trackRef}>
        <div className="flex gap-6 items-stretch min-w-max mx-auto max-w-[74rem]">
          {projects.map((project, idx) => {
            const isActive = idx === currentIndex;
            return (
              <article
                key={project.id}
                onClick={() => setCurrentIndex(idx)}
                data-work-card="true"
                className={`group relative cursor-pointer overflow-hidden rounded-xl border transition-all duration-500 w-[22rem] sm:w-[26rem] lg:w-[28rem] shrink-0 ${
                  isActive
                    ? "border-tvl-amber ring-2 ring-tvl-amber/30 shadow-2xl shadow-tvl-amber/10 scale-[1.02]"
                    : "border-shelf/60 opacity-75 hover:opacity-100 hover:border-shelf"
                }`}
                style={{
                  aspectRatio: "16 / 11",
                }}
              >
                <div className="relative h-full w-full">
                  <Image
                    src={project.image}
                    alt={project.imageAlt}
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="work-showcase__image-shade" />

                  {/* Credit tag */}
                  <div className="absolute top-4 left-4 z-10">
                    <span className="readout text-[0.6rem] uppercase tracking-[0.14em] text-seaglass/80 bg-abyss/70 backdrop-blur-sm px-2.5 py-1 rounded-full border border-shelf/40">
                      {project.visualCredit}
                    </span>
                  </div>

                  {/* View case study badge */}
                  <div className="absolute top-4 right-4 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <span className="readout text-[0.62rem] uppercase tracking-wider text-tvl-amber bg-abyss/80 backdrop-blur-sm px-3 py-1 rounded-full border border-tvl-amber/40">
                      View concept →
                    </span>
                  </div>

                  {/* Title and details overlay */}
                  <div className="work-showcase__title-overlay">
                    <div className="flex items-center gap-2.5">
                      <span className="readout text-[0.62rem] font-mono uppercase text-tvl-amber">
                        {String(idx + 1).padStart(2, "0")}
                      </span>
                      <span aria-hidden="true" className="h-px w-4 bg-tvl-amber/60" />
                      <span className="readout text-[0.62rem] uppercase text-seaglass/90">
                        {project.pillar}
                      </span>
                    </div>

                    <h3 className="mt-2 font-display text-2xl font-bold tracking-tight text-seaglass group-hover:text-tvl-amber transition-colors">
                      {project.name}
                    </h3>

                    <p className="mt-2 text-xs text-seaglass/80 line-clamp-2 leading-relaxed">
                      {project.statement}
                    </p>

                    {/* Capabilities Tags */}
                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {project.capabilities.map((cap) => (
                        <span
                          key={cap}
                          className="rounded bg-abyss-2/80 px-2 py-0.5 text-[0.62rem] font-mono text-tide border border-shelf/30"
                        >
                          {cap}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
};
