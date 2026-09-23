"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Logo } from "./Logo";
import { siteData } from "@/data/siteData";

interface NavProps {
  onOpenPortal: () => void;
}

export const Nav: React.FC<NavProps> = ({ onOpenPortal }) => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-40 transition-all duration-300 ${
        scrolled
          ? "border-b border-shelf/55 bg-abyss/90 backdrop-blur-md py-2.5 shadow-lg shadow-black/20"
          : "border-b border-transparent bg-transparent py-4"
      }`}
    >
      <div className="mx-auto flex max-w-[74rem] items-center justify-between px-5 sm:px-8 lg:px-10">
        <Link
          href="#top"
          className="shrink-0 transition-opacity hover:opacity-85 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-tide"
          aria-label="The Virtus Labs — Home"
        >
          <Logo />
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-7 lg:flex">
          {siteData.nav.links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="relative py-1 text-sm tracking-tight font-medium text-tide transition-colors duration-200 after:absolute after:bottom-0 after:left-0 after:h-px after:w-0 after:bg-tvl-amber after:transition-all after:duration-200 hover:text-seaglass hover:after:w-full"
            >
              {link.label}
            </Link>
          ))}

          {/* Portal Access Doorway Button */}
          <button
            type="button"
            onClick={onOpenPortal}
            className="group inline-flex items-center gap-2 rounded-full border border-tvl-amber/40 bg-tvl-amber/10 px-4 py-1.5 text-xs font-mono font-semibold tracking-wider text-tvl-amber transition-all duration-200 hover:border-tvl-amber hover:bg-tvl-amber hover:text-tvl-plum-dark"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-tvl-amber animate-pulse group-hover:bg-tvl-plum-dark"></span>
            PORTAL ACCESS
          </button>

          <Link
            href="#brief"
            className="inline-flex min-h-10 items-center justify-center rounded-full bg-seaglass px-5 py-2 text-sm font-semibold tracking-tight text-abyss transition-all duration-300 hover:bg-tvl-amber hover:text-tvl-plum-dark active:scale-[0.98]"
          >
            {siteData.nav.action.label}
          </Link>
        </nav>

        {/* Mobile Hamburger Button */}
        <div className="flex items-center gap-3 lg:hidden">
          <button
            type="button"
            onClick={onOpenPortal}
            className="rounded-full border border-tvl-amber/60 bg-tvl-amber/15 px-3 py-1 text-[0.65rem] font-mono font-semibold uppercase text-tvl-amber"
          >
            Portal
          </button>

          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="flex h-11 w-11 items-center justify-center rounded-full text-seaglass transition-colors hover:text-tvl-amber focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-tide"
            aria-expanded={mobileMenuOpen}
            aria-label="Toggle navigation menu"
          >
            <span className="relative block h-3.5 w-5">
              <span
                className={`absolute left-0 block h-px w-5 bg-current transition-transform duration-200 ${
                  mobileMenuOpen ? "top-1.5 rotate-45" : "top-0"
                }`}
              ></span>
              <span
                className={`absolute left-0 top-1.5 block h-px w-5 bg-current transition-opacity duration-200 ${
                  mobileMenuOpen ? "opacity-0" : "opacity-100"
                }`}
              ></span>
              <span
                className={`absolute left-0 block h-px w-5 bg-current transition-transform duration-200 ${
                  mobileMenuOpen ? "top-1.5 -rotate-45" : "top-3"
                }`}
              ></span>
            </span>
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="border-b border-shelf/55 bg-abyss-2/98 px-5 py-6 backdrop-blur-xl lg:hidden">
          <div className="flex flex-col gap-4">
            {siteData.nav.links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="text-base font-medium text-seaglass hover:text-tvl-amber py-1"
              >
                {link.label}
              </Link>
            ))}
            <div className="mt-3 flex flex-col gap-2.5 pt-3 border-t border-shelf/40">
              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenPortal();
                }}
                className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full border border-tvl-amber bg-tvl-amber/15 px-5 text-sm font-mono font-semibold text-tvl-amber"
              >
                Open Workspace Portal
              </button>
              <Link
                href="#brief"
                onClick={() => setMobileMenuOpen(false)}
                className="inline-flex min-h-11 items-center justify-center rounded-full bg-seaglass px-5 text-sm font-semibold text-abyss"
              >
                Build your brief
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
