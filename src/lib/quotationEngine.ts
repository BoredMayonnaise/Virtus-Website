export interface QuoteInput {
  needs?: string[];
  state?: string;
  feel?: string[];
  when?: string;
  budget?: string;
}

export interface PaymentMilestone {
  label: string;
  percentage: number;
  amount: number;
}

export interface QuoteResult {
  minPrice: number;
  maxPrice: number;
  recommendedTier: "Focused" | "Growth" | "Integrated";
  estimatedWeeks: string;
  deliverables: string[];
  paymentMilestones: PaymentMilestone[];
  breakdown: string;
}

const DISCIPLINE_PRICING: Record<string, { baseMin: number; baseMax: number; deliverables: string[] }> = {
  "Brand & Creative": {
    baseMin: 2200,
    baseMax: 3800,
    deliverables: [
      "Brand Core & Identity System",
      "Vector Logo Suite & Usage Guidelines",
      "Typography & Color Matrix",
      "Social & Marketing Collateral Templates",
    ],
  },
  "Web & Digital": {
    baseMin: 3200,
    baseMax: 5500,
    deliverables: [
      "UX Architecture & Responsive Wireframes",
      "High-Performance Custom Web Development",
      "SEO & Core Web Vitals Optimization",
      "CMS / Content Handoff",
    ],
  },
  "Content & Video": {
    baseMin: 1800,
    baseMax: 3400,
    deliverables: [
      "Creative Direction & Scripting",
      "Short-Form Video Edits (Reels/TikTok/Ads)",
      "High-Resolution Motion Graphics",
      "Multi-Platform Repurposing Package",
    ],
  },
  "AI & Automation": {
    baseMin: 2500,
    baseMax: 4600,
    deliverables: [
      "Custom Workflow Automation Pipeline",
      "CRM & Lead Ingestion Integrations",
      "AI Knowledge Assistant / Agent Setup",
      "Operational Runbook & Staff Training",
    ],
  },
};

export function calculateAgencyQuote(input: QuoteInput): QuoteResult {
  const needs = input.needs && input.needs.length > 0 ? input.needs : ["Brand & Creative"];
  
  let rawMin = 0;
  let rawMax = 0;
  const allDeliverables: string[] = [];

  needs.forEach((need) => {
    const pricing = DISCIPLINE_PRICING[need] || {
      baseMin: 2000,
      baseMax: 3500,
      deliverables: ["Custom Digital Deliverables"],
    };
    rawMin += pricing.baseMin;
    rawMax += pricing.baseMax;
    allDeliverables.push(...pricing.deliverables);
  });

  // Bundle discount for multi-discipline
  if (needs.length === 2) {
    rawMin *= 0.9;
    rawMax *= 0.9;
  } else if (needs.length === 3) {
    rawMin *= 0.85;
    rawMax *= 0.85;
  } else if (needs.length >= 4) {
    rawMin *= 0.8;
    rawMax *= 0.8;
  }

  // State multiplier
  let stateMultiplier = 1.0;
  if (input.state === "Improving what exists") {
    stateMultiplier = 0.88;
  } else if (input.state === "Fixing something that is not working") {
    stateMultiplier = 1.2;
  }

  // Urgency multiplier
  let urgencyMultiplier = 1.0;
  let weeks = "4 – 6 weeks";
  if (input.when === "In a few weeks") {
    urgencyMultiplier = 1.25;
    weeks = "2 – 3 weeks (Expedited)";
  } else if (input.when === "Flexible") {
    urgencyMultiplier = 0.95;
    weeks = "6 – 8 weeks";
  }

  const finalMin = Math.round((rawMin * stateMultiplier * urgencyMultiplier) / 50) * 50;
  const finalMax = Math.round((rawMax * stateMultiplier * urgencyMultiplier) / 50) * 50;

  // Determine recommended tier
  let recommendedTier: "Focused" | "Growth" | "Integrated" = "Focused";
  if (needs.length >= 3 || finalMin > 6000) {
    recommendedTier = "Integrated";
  } else if (needs.length >= 2 || finalMin > 3500) {
    recommendedTier = "Growth";
  }

  const avgPrice = (finalMin + finalMax) / 2;
  const paymentMilestones: PaymentMilestone[] = [
    {
      label: "Kickoff & Discovery Deposit",
      percentage: 50,
      amount: Math.round(avgPrice * 0.5),
    },
    {
      label: "Midway Delivery Milestone",
      percentage: 25,
      amount: Math.round(avgPrice * 0.25),
    },
    {
      label: "Final QA & Asset Handoff",
      percentage: 25,
      amount: Math.round(avgPrice * 0.25),
    },
  ];

  return {
    minPrice: finalMin,
    maxPrice: finalMax,
    recommendedTier,
    estimatedWeeks: weeks,
    deliverables: allDeliverables,
    paymentMilestones,
    breakdown: `${needs.length} Discipline(s) (${needs.join(", ")}) · ${recommendedTier} Tier · ${weeks}`,
  };
}
