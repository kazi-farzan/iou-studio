import { formatInr } from "./pricing.js";

const EMPTY_TIMELINE_SUMMARY = {
  description: "Select modules to generate a live delivery estimate.",
  label: "Estimated delivery",
  value: "Timeline updates as you build",
};

export const customBuildModules = [
  {
    id: "branding",
    title: "Branding",
    category: "Identity",
    description: "Identity direction, visual language, and core brand assets.",
    basePrice: 12000,
    timelineDays: {
      minimum: 3,
      maximum: 5,
    },
  },
  {
    id: "website",
    title: "Website",
    category: "Web Surface",
    description: "Responsive website setup shaped around your offer and content flow.",
    basePrice: 18000,
    timelineDays: {
      minimum: 6,
      maximum: 9,
    },
  },
  {
    id: "ordering-system",
    title: "Ordering System",
    category: "Commerce Flow",
    description: "Digital ordering structure with operational handoff points in place.",
    basePrice: 26000,
    timelineDays: {
      minimum: 8,
      maximum: 12,
    },
  },
  {
    id: "customer-capture",
    title: "Customer Capture",
    category: "Lead Intake",
    description: "Lead capture, WhatsApp routing, and inquiry collection entry points.",
    basePrice: 9000,
    timelineDays: {
      minimum: 2,
      maximum: 4,
    },
  },
];

function formatTimelineValue({ maximum, minimum }) {
  if (!minimum || !maximum) {
    return EMPTY_TIMELINE_SUMMARY.value;
  }

  if (minimum === maximum) {
    return `${minimum} day${minimum === 1 ? "" : "s"}`;
  }

  return `${minimum}-${maximum} days`;
}

export function getCustomBuildTimeline(selectedModules = []) {
  if (!selectedModules.length) {
    return EMPTY_TIMELINE_SUMMARY;
  }

  const totalTimelineDays = selectedModules.reduce(
    (runningTotal, module) => ({
      maximum: runningTotal.maximum + module.timelineDays.maximum,
      minimum: runningTotal.minimum + module.timelineDays.minimum,
    }),
    { maximum: 0, minimum: 0 },
  );

  return {
    description: "Live estimate based on the currently selected module set.",
    label: "Estimated delivery",
    value: formatTimelineValue(totalTimelineDays),
  };
}

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
    timeline: getCustomBuildTimeline(selectedModules),
    total,
    summaryItems: selectedModules.map((module) => ({
      id: module.id,
      eyebrow: module.category,
      title: module.title,
      value: formatInr(module.basePrice),
    })),
  };
}
