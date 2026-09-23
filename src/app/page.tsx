"use client";

import React, { useState, useEffect } from "react";
import { Nav } from "@/components/public/Nav";
import { Hero } from "@/components/public/Hero";
import { Trust } from "@/components/public/Trust";
import { Marquee } from "@/components/public/Marquee";
import { WorkShowcase } from "@/components/public/WorkShowcase";
import { Services } from "@/components/public/Services";
import { Products } from "@/components/public/Products";
import { WhyUs } from "@/components/public/WhyUs";
import { Process } from "@/components/public/Process";
import { Engagements } from "@/components/public/Engagements";
import { BriefBuilder } from "@/components/public/BriefBuilder";
import { FAQ } from "@/components/public/FAQ";
import { FinalCTA } from "@/components/public/FinalCTA";
import { Footer } from "@/components/public/Footer";
import { PortalModal, PortalRole } from "@/components/portal/PortalModal";
import { OperationsOS } from "@/components/dashboard/OperationsOS";

export default function Home() {
  const [isPortalModalOpen, setIsPortalModalOpen] = useState(false);
  const [activePortalRole, setActivePortalRole] = useState<PortalRole | null>(null);

  // Scroll reveal observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-revealed");
          }
        });
      },
      { threshold: 0.1 }
    );

    const revealElements = document.querySelectorAll("[data-reveal]");
    revealElements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  // If a portal is active (Admin, Team Member, or Client), show the Operations OS workspace!
  if (activePortalRole) {
    return (
      <OperationsOS
        initialRole={activePortalRole}
        onExit={() => setActivePortalRole(null)}
      />
    );
  }

  return (
    <div className="relative min-h-screen bg-abyss text-seaglass">
      {/* Skip to Content for Accessibility */}
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-full focus:bg-tvl-amber focus:px-5 focus:py-2.5 focus:font-semibold focus:text-black focus:shadow-lg focus:outline-none"
      >
        Skip to content
      </a>

      {/* Main Navigation with Portal Door Trigger */}
      <Nav onOpenPortal={() => setIsPortalModalOpen(true)} />

      {/* Main Page Flow */}
      <main id="main">
        <Hero />
        <Trust />
        <Marquee />
        <WorkShowcase />
        <Services />
        <Products />
        <WhyUs />
        <Process />
        <Engagements />
        <BriefBuilder />
        <FAQ />
        <FinalCTA />
      </main>

      <Footer />

      {/* Secure Workspace Access Portal Gateway Modal (Image 1) */}
      <PortalModal
        isOpen={isPortalModalOpen}
        onClose={() => setIsPortalModalOpen(false)}
        onSelectRole={(role) => {
          setIsPortalModalOpen(false);
          setActivePortalRole(role);
        }}
      />
    </div>
  );
}
