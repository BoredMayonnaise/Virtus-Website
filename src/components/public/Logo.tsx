import React from "react";

interface LogoProps {
  className?: string;
  showWordmark?: boolean;
  size?: "sm" | "md" | "lg";
}

export const Logo: React.FC<LogoProps> = ({
  className = "",
  showWordmark = true,
  size = "md",
}) => {
  const iconSizes = {
    sm: "h-6 w-6",
    md: "h-8 w-8",
    lg: "h-11 w-11",
  };

  return (
    <div className={`inline-flex items-center gap-2.5 ${className}`}>
      {/* Two-tone split diagonal "V" symbol from The Virtus Labs brand guidelines */}
      <svg
        viewBox="0 0 100 100"
        className={`${iconSizes[size]} shrink-0 transition-transform duration-300 hover:scale-105`}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        {/* Left arm: Clean crisp white / light slate */}
        <polygon
          points="14,18 36,18 52,78 30,78"
          fill="#FFFFFF"
        />
        {/* Right arm: Distinctive angled Golden Amber #F4C05D */}
        <polygon
          points="46,55 64,18 86,18 64,78 46,78"
          fill="#F4C05D"
        />
      </svg>

      {showWordmark && (
        <div className="flex flex-col leading-none">
          <span className="font-mono text-[0.55rem] font-semibold uppercase tracking-[0.2em] text-[#F4C05D]">
            THE
          </span>
          <div className="flex items-baseline gap-1 mt-0.5">
            <span className="font-monument text-lg tracking-tight text-seaglass">
              VIRTUS
            </span>
            <span className="font-sans text-xs uppercase tracking-[0.2em] text-tide font-light">
              LABS
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
