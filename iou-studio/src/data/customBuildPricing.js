import { formatInr } from "./pricing.js";

export const customBuildModules = [
  {
    id: "branding",
    title: "Branding",
    category: "Identity",
    description: "Identity direction, visual language, and core brand assets.",
    basePrice: 12000,
    timeline: "1-2 weeks",
  },
  {
    id: "website",
    title: "Website",
    category: "Web Surface",
    description: "Responsive website setup shaped around your offer and content flow.",
    basePrice: 18000,
    timeline: "2-4 weeks",
  },
  {
    id: "ordering-system",
    title: "Ordering System",
    category: "Commerce Flow",
    description: "Digital ordering structure with operational handoff points in place.",
    basePrice: 26000,
    timeline: "3-5 weeks",
  },
  {
    id: "customer-capture",
    title: "Customer Capture",
    category: "Lead Intake",
    description: "Lead capture, WhatsApp routing, and inquiry collection entry points.",
    basePrice: 9000,
    timeline: "1-2 weeks",
  },
];

export function getCustomBuildModules(moduleIds = []) {
  if (!moduleIds.length) {
    return [];
  }

  const selectedIds = new Set(moduleIds);

  return customBuildModules.filter((module) => selectedIds.has(module.id));
}

export function getCustomBuildPricing(moduleIds = []) {
  const selectedModules = getCustomBuildModules(moduleIds);
  const total = selectedModules.reduce(
    (runningTotal, module) => runningTotal + module.basePrice,
    0,
  );

  return {
    selectedModules,
    total,
    summaryItems: selectedModules.map((module) => ({
      id: module.id,
      eyebrow: module.category,
      title: module.title,
      value: formatInr(module.basePrice),
    })),
  };
}
