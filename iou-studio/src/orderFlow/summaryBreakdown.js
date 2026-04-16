import { formatTimelineRange } from "../data/configuratorSchema.js";
import { formatInr } from "../data/pricing.js";

function formatTimelineContribution(timelineDays) {
  const timelineValue = formatTimelineRange(timelineDays, "");

  return timelineValue ? `+ ${timelineValue}` : "";
}

function formatTimelineWindow(timelineDays) {
  return formatTimelineRange(timelineDays, "");
}

function buildModuleBaseRow(module) {
  return {
    detail: module.description,
    id: `${module.id}-base`,
    kind: "base",
    label: "Base scope",
    priceLabel: formatInr(module.basePrice),
    timelineLabel: formatTimelineWindow(module.baseTimelineDays),
  };
}

function buildModuleOptionRow(module, option) {
  return {
    detail: option.description || "",
    id: `${module.id}-${option.id}`,
    kind: "option",
    label: option.summaryLabel || option.label,
    priceLabel: option.priceImpact > 0 ? `+ ${formatInr(option.priceImpact)}` : "Included",
    timelineLabel: formatTimelineContribution(option.timelineImpact),
  };
}

function buildPackageModuleRow(module) {
  return {
    detail: module.description,
    eyebrow: module.category,
    id: module.id,
    kind: "included-module",
    label: module.title,
    priceLabel: "Included",
    timelineLabel: "",
  };
}

function buildCustomModuleGroup(module) {
  return {
    description: "",
    eyebrow: module.category,
    id: module.id,
    rows: [
      buildModuleBaseRow(module),
      ...module.selectedOptions.map((option) => buildModuleOptionRow(module, option)),
    ],
    rowsLabel: "Selected scope",
    subtotal: {
      label: "Subtotal",
      value: formatInr(module.configuredPrice ?? module.basePrice),
    },
    timeline: {
      label: "Timeline",
      value: formatTimelineWindow(
        module.configuredTimelineDays ?? module.timelineDays,
      ),
    },
    title: module.title,
  };
}

export function buildCustomSummaryBreakdown(customBuildPricing) {
  return {
    emptyState: {
      detail: "Add modules to start building your custom setup.",
      title: "No modules selected yet.",
    },
    groups: customBuildPricing.selectedModules.map(buildCustomModuleGroup),
  };
}

export function buildPackageSummaryBreakdown({
  packageSelection,
  plan,
  timeline,
  total,
}) {
  if (!plan || !packageSelection) {
    return {
      emptyState: {
        detail: "Choose a package to review the included scope.",
        title: "No starting configuration selected yet.",
      },
      groups: [],
    };
  }

  return {
    emptyState: {
      detail: "Choose a package to review the included scope.",
      title: "No starting configuration selected yet.",
    },
    groups: [
      {
        description: plan.description,
        eyebrow: "Selected package",
        id: plan.id,
        rows: packageSelection.includedModules.map(buildPackageModuleRow),
        rowsLabel: "Included modules",
        subtotal: {
          label: "Package total",
          value: total.value,
        },
        timeline: {
          label: "Timeline",
          value: timeline.value,
        },
        title: plan.name,
      },
    ],
  };
}

export function buildReviewItemsFromBreakdown(summaryBreakdown) {
  return (summaryBreakdown?.groups ?? []).map((group) => {
    const rowLabels = group.rows
      .slice(0, 3)
      .map((row) => row.label)
      .filter(Boolean)
      .join(" / ");

    return {
      detail: rowLabels || group.description || "",
      eyebrow: group.eyebrow,
      id: group.id,
      title: group.title,
      value: group.subtotal?.value || "",
    };
  });
}
