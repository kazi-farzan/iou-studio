import {
  configuratorModules,
  formatTimelineRange,
  getConfiguratorModules,
  groupModulesByCategory,
  sumTimelineRanges,
} from "./configuratorSchema.js";
import { formatInr } from "./pricing.js";

const EMPTY_TIMELINE_SUMMARY = {
  description: "Select modules to generate a live delivery estimate.",
  label: "Estimated delivery",
  rangeDays: null,
  value: "Timeline updates as you build",
};

export const customBuildModules = configuratorModules;

function buildModuleLineItem(module) {
  return {
    category: module.category,
    categoryId: module.categoryId,
    deliverables: module.deliverables,
    description: module.description,
    id: module.id,
    kind: "module",
    options: module.options,
    price: module.basePrice,
    priceLabel: formatInr(module.basePrice),
    tags: module.tags,
    timelineDays: module.baseTimelineDays,
    title: module.title,
  };
}

export function getCustomBuildTimeline(selectedModules = []) {
  if (!selectedModules.length) {
    return EMPTY_TIMELINE_SUMMARY;
  }

  const totalTimelineDays = sumTimelineRanges(selectedModules);

  return {
    description: "Live estimate based on the currently selected module set.",
    label: "Estimated delivery",
    rangeDays: totalTimelineDays,
    value: formatTimelineRange(totalTimelineDays, EMPTY_TIMELINE_SUMMARY.value),
  };
}

export function getCustomBuildModules(moduleIds = []) {
  return getConfiguratorModules(moduleIds);
}

export function getCustomBuildPricing(moduleIds = []) {
  const selectedModules = getCustomBuildModules(moduleIds);
  const lineItems = selectedModules.map(buildModuleLineItem);
  const total = lineItems.reduce(
    (runningTotal, item) => runningTotal + item.price,
    0,
  );

  return {
    groupedModules: groupModulesByCategory(selectedModules),
    lineItems,
    selectedModules,
    summaryItems: lineItems.map((item) => ({
      id: item.id,
      eyebrow: item.category,
      title: item.title,
      value: item.priceLabel,
    })),
    timeline: getCustomBuildTimeline(selectedModules),
    total,
  };
}
