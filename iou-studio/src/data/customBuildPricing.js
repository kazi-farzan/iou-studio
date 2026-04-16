import {
  configuratorModules,
  formatTimelineRange,
  getConfiguredModules,
  groupModulesByCategory,
  sumTimelineRanges,
} from "./configuratorSchema.js";
import { formatInr } from "./pricing.js";

const EMPTY_TIMELINE_SUMMARY = {
  description: "Select modules to generate a live delivery estimate.",
  label: "Final timeline",
  rangeDays: null,
  value: "Timeline updates as you build",
};

export const customBuildModules = configuratorModules;

function getModuleSummaryDetail(module) {
  if (module.selectedOptions.length) {
    return module.selectedOptions.map((option) => option.summaryLabel).join(" / ");
  }

  if (module.options.length) {
    return "Default scope with no add-ons selected.";
  }

  return module.description;
}

function buildModuleLineItem(module) {
  const summaryDetail = getModuleSummaryDetail(module);

  return {
    activeOptions: module.activeOptions,
    category: module.category,
    categoryId: module.categoryId,
    configuredTimelineDays: module.configuredTimelineDays,
    deliverables: module.deliverables,
    description: module.description,
    id: module.id,
    kind: "module",
    options: module.options,
    price: module.configuredPrice,
    priceLabel: formatInr(module.configuredPrice),
    selectedOptionCount: module.selectedOptionCount,
    selectedOptions: module.selectedOptions,
    summaryDetail,
    tags: module.tags,
    timelineDays: module.configuredTimelineDays,
    title: module.title,
  };
}

export function getCustomBuildTimeline(selectedModules = []) {
  if (!selectedModules.length) {
    return EMPTY_TIMELINE_SUMMARY;
  }

  const totalTimelineDays = sumTimelineRanges(
    selectedModules,
    (module) => module.configuredTimelineDays ?? module.timelineDays,
  );

  return {
    description: "Live estimate based on the selected modules and active option choices.",
    label: "Final timeline",
    rangeDays: totalTimelineDays,
    value: formatTimelineRange(totalTimelineDays, EMPTY_TIMELINE_SUMMARY.value),
  };
}

export function getCustomBuildModules(
  moduleIds = [],
  optionSelectionsByModule = {},
) {
  return getConfiguredModules(moduleIds, optionSelectionsByModule);
}

export function getCustomBuildPricing(
  moduleIds = [],
  optionSelectionsByModule = {},
) {
  const selectedModules = getCustomBuildModules(
    moduleIds,
    optionSelectionsByModule,
  );
  const lineItems = selectedModules.map(buildModuleLineItem);
  const total = lineItems.reduce(
    (runningTotal, item) => runningTotal + item.price,
    0,
  );
  const selectedOptionCount = selectedModules.reduce(
    (runningTotal, module) => runningTotal + module.selectedOptionCount,
    0,
  );

  return {
    groupedModules: groupModulesByCategory(selectedModules),
    lineItems,
    selectedOptionCount,
    selectedModules,
    summaryItems: lineItems.map((item) => ({
      id: item.id,
      eyebrow: item.category,
      detail: item.summaryDetail,
      title: item.title,
      value: item.priceLabel,
    })),
    timeline: getCustomBuildTimeline(selectedModules),
    total,
  };
}
