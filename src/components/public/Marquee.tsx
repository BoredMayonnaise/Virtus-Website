import React from "react";
import { siteData } from "@/data/siteData";

export const Marquee: React.FC = () => {
  const disciplines = siteData.hero.disciplines;

  return (
    <section className="discipline-marquee" aria-label="The Virtus Labs disciplines">
      <div className="discipline-marquee__track">
        {/* First group */}
        <div className="discipline-marquee__group">
          {disciplines.map((item, idx) => (
            <span key={`group1-${idx}`} className="discipline-marquee__item">
              <span className="hover:text-tvl-amber transition-colors cursor-default">
                {item}
              </span>
              <span aria-hidden="true" className="discipline-marquee__diamond bg-tvl-amber/60" />
            </span>
          ))}
        </div>

        {/* Cloned group for seamless loop */}
        <div className="discipline-marquee__group" aria-hidden="true">
          {disciplines.map((item, idx) => (
            <span key={`group2-${idx}`} className="discipline-marquee__item">
              <span>{item}</span>
              <span aria-hidden="true" className="discipline-marquee__diamond bg-tvl-amber/60" />
            </span>
          ))}
        </div>

        {/* Third group to ensure wide screens don't have gaps */}
        <div className="discipline-marquee__group" aria-hidden="true">
          {disciplines.map((item, idx) => (
            <span key={`group3-${idx}`} className="discipline-marquee__item">
              <span>{item}</span>
              <span aria-hidden="true" className="discipline-marquee__diamond bg-tvl-amber/60" />
            </span>
          ))}
        </div>
      </div>
    </section>
  );
};
