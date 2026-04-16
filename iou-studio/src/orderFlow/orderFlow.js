import { formatTimelineRange } from "../data/configuratorSchema.js";
import { getCustomBuildPricing } from "../data/customBuildPricing.js";
import {
  billingOptions,
  formatInr,
  getCouponByCode,
  getPackagePricing,
  getPackageSummaryRows,
  getSelectedPackageSummary,
  pricingPackages,
} from "../data/pricing.js";

export const ORDER_FLOW_MODE_PACKAGES = "packages";
export const ORDER_FLOW_MODE_CUSTOM = "custom";

const EMPTY_PACKAGE_TIMELINE = {
  description: "Select a package to view the baseline delivery window.",
  label: "Estimated timeline",
  rangeDays: null,
  value: "Timeline pending",
};

function formatModuleTimelineHint(timelineDays) {
  if (!timelineDays?.minimum || !timelineDays?.maximum) {
    return "";
  }

  if (timelineDays.minimum === timelineDays.maximum) {
    return `${timelineDays.minimum} day${
      timelineDays.minimum === 1 ? "" : "s"
    }`;
  }

  return `${timelineDays.minimum}-${timelineDays.maximum} days`;
}

function getBillingLabel(billingMode) {
  return (
    billingOptions.find((option) => option.id === billingMode)?.label || "Pricing"
  );
}

function getCustomModuleCountLabel(moduleCount) {
  return `${moduleCount} module${moduleCount === 1 ? "" : "s"}`;
}

function getCustomizationCountLabel(optionCount) {
  return `${optionCount} customization${optionCount === 1 ? "" : "s"}`;
}

function getCustomStatusLabel(moduleCount, optionCount) {
  if (!moduleCount) {
    return "Awaiting selection";
  }

  if (!optionCount) {
    return `${getCustomModuleCountLabel(moduleCount)} active`;
  }

  return `${getCustomModuleCountLabel(moduleCount)} / ${getCustomizationCountLabel(
    optionCount,
  )}`;
}

function getCustomSelectionMeta(moduleCount, optionCount) {
  if (!moduleCount) {
    return "";
  }

  if (!optionCount) {
    return `${getCustomModuleCountLabel(moduleCount)} included`;
  }

  return `${getCustomModuleCountLabel(moduleCount)} / ${getCustomizationCountLabel(
    optionCount,
  )}`;
}

function formatOptionImpactLabel(option) {
  const parts = [];

  if (option.priceImpact > 0) {
    parts.push(`+ ${formatInr(option.priceImpact)}`);
  }

  const timelineLabel = formatTimelineRange(option.timelineImpact, "");

  if (timelineLabel) {
    parts.push(`+ ${timelineLabel}`);
  }

  return parts.join(" / ") || "Included";
}

function getModuleSelectionFallback(module) {
  if (module.options.length) {
    return "Default scope with no add-ons selected.";
  }

  return "Base module scope only.";
}

function buildReviewOptionItem(option) {
  return {
    ...option,
    impactLabel: formatOptionImpactLabel(option),
  };
}

function getPackageTimelineRecord(planId) {
  return pricingPackages.find((plan) => plan.id === planId)?.timelineEstimate || null;
}

function buildPackageTimeline(plan) {
  const timelineEstimate = getPackageTimelineRecord(plan?.id);

  if (!plan || !timelineEstimate) {
    return EMPTY_PACKAGE_TIMELINE;
  }

  return {
    description: "Final delivery depends on scope confirmation and content readiness.",
    label: "Estimated timeline",
    rangeDays: {
      maximum: timelineEstimate.maximumDays,
      minimum: timelineEstimate.minimumDays,
    },
    value: timelineEstimate.label,
  };
}

function buildModuleReviewLineItem(module) {
  return {
    detail: module.description,
    eyebrow: module.category,
    id: module.id,
    selectedOptions: module.selectedOptions.map(buildReviewOptionItem),
    selectionNote: module.selectedOptions.length
      ? module.selectedOptionSummary
      : getModuleSelectionFallback(module),
    timeline: formatModuleTimelineHint(
      module.configuredTimelineDays ?? module.timelineDays,
    ),
    title: module.title,
    value: formatInr(module.configuredPrice ?? module.basePrice),
  };
}

function buildPackageSelection(plan) {
  const includedModules = plan.includedModules ?? [];
  const totalSummary = getPackageTotalSummary(plan);

  return {
    groupedModules: plan.includedModuleGroups ?? [],
    includedModules,
    lineItems: [
      {
        audience: plan.audience,
        billingMode: plan.base.billingMode,
        id: `${plan.id}-package`,
        includedModuleIds: includedModules.map((module) => module.id),
        kind: "package",
        price: plan.effective.todayCharge,
        priceLabel: totalSummary.value,
        title: plan.name,
      },
      ...includedModules.map((module) => ({
        category: module.category,
        categoryId: module.categoryId,
        deliverables: module.deliverables,
        description: module.description,
        id: module.id,
        included: true,
        kind: "module",
        price: module.basePrice,
        priceLabel: "Included",
        tags: module.tags,
        timelineDays: module.baseTimelineDays,
        title: module.title,
      })),
    ],
    plan,
    pricingRows: getPackageSummaryRows(plan),
    selectedSummary: getSelectedPackageSummary(plan),
  };
}

function buildPackageSummaryPanel({ billingLabel, plan, timeline, total }) {
  if (!plan) {
    return {
      ctaLabel: "Continue to Order Summary",
      ctaNote: "Choose a starting configuration to unlock the order summary.",
      ctaTo: "/order-summary",
      description:
        "Monitor the active starting configuration, current pricing, and delivery window while you configure.",
      emptyState: {
        detail: "Choose a package to review the current price and timeline.",
        title: "No starting configuration selected yet.",
      },
      isActionDisabled: true,
      items: [],
      modeLabel: "Packages",
      selectionHint: "The summary will lock onto the package you activate.",
      selectionLabel: "Selected setup",
      statusLabel: billingLabel,
      timeline,
      total,
      validationNote: "Select a package before continuing into the order summary.",
    };
  }

  return {
    ctaLabel: "Continue to Order Summary",
    ctaNote:
      "Move into a structured review and submission surface with the current package state intact.",
    ctaTo: "/order-summary",
    description:
      "Monitor the active starting configuration, current pricing, and delivery window while you configure.",
    emptyState: {
      detail: "Choose a package to review the current price and timeline.",
      title: "No starting configuration selected yet.",
    },
    isActionDisabled: false,
    items: [
      {
        id: plan.id,
        title: plan.name,
        detail: plan.description,
        value: plan.audience,
      },
    ],
    modeLabel: "Packages",
    selectionHint: "This starting configuration can still be customized before handoff.",
    selectionLabel: "Selected setup",
    statusLabel: billingLabel,
    timeline,
    total,
    validationNote: "Select a package before continuing into the order summary.",
  };
}

function buildCustomSummaryPanel({
  customBuildPricing,
  moduleCount,
  optionCount,
}) {
  return {
    ctaLabel: "Continue to Order Summary",
    ctaNote: moduleCount
      ? "Review the active module selection and nested choices, then submit the custom build request from the next screen."
      : "Add modules to prepare a valid custom build summary.",
    ctaTo: "/order-summary",
    description:
      "Monitor the active module selection, configured total, and delivery estimate while the custom build takes shape.",
    emptyState: {
      detail: "Add modules to start building your custom setup.",
      title: "No modules selected yet.",
    },
    isActionDisabled: !moduleCount,
    items: customBuildPricing.summaryItems,
    modeLabel: "Build Your Own",
    selectionHint: moduleCount
      ? optionCount
        ? "Selected modules and nested choices stay synchronized here in real time."
        : "Selected modules stay synchronized here in real time."
      : "Module selections will appear here as soon as you start building.",
    selectionLabel: "Selected modules",
    statusLabel: getCustomStatusLabel(moduleCount, optionCount),
    timeline: customBuildPricing.timeline,
    total: {
      description: moduleCount
        ? optionCount
          ? "Configured total for the current module and add-on selection."
          : "Configured total for the current module selection."
        : "Add modules to generate a live configured total.",
      label: "Configured total",
      meta: getCustomSelectionMeta(moduleCount, optionCount),
      value: moduleCount
        ? formatInr(customBuildPricing.total)
        : "Awaiting selection",
    },
    validationNote:
      "Select at least one custom module before continuing into the order summary.",
  };
}

function buildPackageSubmissionPayload({
  appliedCoupon,
  billingMode,
  packageSelection,
  timeline,
  total,
}) {
  const { plan } = packageSelection;

  return {
    billingMode,
    coupon: appliedCoupon
      ? {
          code: appliedCoupon.code,
          status: plan.coupon?.status ?? "pending",
        }
      : null,
    mode: ORDER_FLOW_MODE_PACKAGES,
    package: {
      audience: plan.audience,
      id: plan.id,
      includedModuleIds: packageSelection.includedModules.map((module) => module.id),
      name: plan.name,
    },
    pricing: {
      annualPrice: plan.base.annualPrice,
      billingLine: plan.base.billingLine,
      currency: "INR",
      displayValue: total.value,
      monthlyEquivalent: plan.base.monthlyEquivalent,
      monthlyPrice: plan.base.monthlyPrice,
      recurringCharge: plan.effective.recurringCharge,
      recurringLabel: plan.effective.recurringLabel,
      todayCharge: plan.effective.todayCharge,
      yearOneSpend: plan.effective.yearOneSpend,
      yearlySavings: plan.base.yearlySavings,
    },
    selection: {
      groupedModules: packageSelection.groupedModules,
      lineItems: packageSelection.lineItems,
    },
    timeline: {
      displayValue: timeline.value,
      maximumDays: timeline.rangeDays?.maximum ?? null,
      minimumDays: timeline.rangeDays?.minimum ?? null,
    },
  };
}

function buildCustomSubmissionPayload(customBuildPricing) {
  if (!customBuildPricing.selectedModules.length) {
    return null;
  }

  return {
    billingMode: null,
    coupon: null,
    mode: ORDER_FLOW_MODE_CUSTOM,
    package: null,
    pricing: {
      currency: "INR",
      displayValue: formatInr(customBuildPricing.total),
      total: customBuildPricing.total,
    },
    selection: {
      groupedModules: customBuildPricing.groupedModules,
      lineItems: customBuildPricing.lineItems,
      moduleIds: customBuildPricing.selectedModules.map((module) => module.id),
      moduleOptions: customBuildPricing.selectedModules.reduce(
        (runningSelections, module) => {
          runningSelections[module.id] = module.optionSelections;
          return runningSelections;
        },
        {},
      ),
    },
    timeline: {
      displayValue: customBuildPricing.timeline.value,
      maximumDays: customBuildPricing.timeline.rangeDays?.maximum ?? null,
      minimumDays: customBuildPricing.timeline.rangeDays?.minimum ?? null,
    },
  };
}

export function getDefaultPlanId() {
  return (
    pricingPackages.find((plan) => plan.isMostPopular)?.id ||
    pricingPackages[0]?.id ||
    null
  );
}

export const getDefaultPackageId = getDefaultPlanId;

export function getDefaultContactDraft() {
  return {
    name: "",
    businessName: "",
    email: "",
    phone: "",
    notes: "",
  };
}

export function getPackageTimeline(planId) {
  return (
    getPackageTimelineRecord(planId)?.label ||
    "Estimated delivery: timeline will be confirmed during scope review"
  );
}

export function getPackageTotalSummary(plan) {
  if (!plan) {
    return {
      description: "Pricing appears here as soon as a starting configuration is active.",
      label: "Current total",
      meta: "",
      value: "Select a package",
    };
  }

  if (plan.base.isYearly) {
    return {
      description: `Effective monthly rate: ${formatInr(plan.base.monthlyEquivalent)}/month.`,
      label: "Current total",
      meta: plan.base.billingLine,
      value: formatInr(plan.effective.todayCharge),
    };
  }

  if (plan.coupon?.status === "active" && plan.coupon.code === "FIRST3") {
    return {
      description: "Intro pricing is active for the first 3 months of monthly billing.",
      label: "Current total",
      meta: `Then ${formatInr(plan.coupon.recurringCharge)}/month from month 4`,
      value: `${formatInr(plan.coupon.todayCharge)}/month`,
    };
  }

  if (plan.coupon?.status === "active" && plan.coupon.code === "TRYONCE") {
    return {
      description: "The first monthly invoice is removed before standard billing resumes.",
      label: "Current total",
      meta: `Then ${formatInr(plan.coupon.recurringCharge)}/month from month 2`,
      value: "Free",
    };
  }

  return {
    description: `Switch to yearly for ${formatInr(plan.base.monthlyEquivalent)}/month effective.`,
    label: "Current total",
    meta: plan.base.billingLine,
    value: `${formatInr(plan.effective.todayCharge)}/month`,
  };
}

export function buildOrderConfiguration({
  appliedCouponCode,
  billingMode,
  mode,
  selectedCustomModuleIds,
  selectedCustomModuleOptions = {},
  selectedPlanId,
}) {
  const billingLabel = getBillingLabel(billingMode);

  if (mode === ORDER_FLOW_MODE_CUSTOM) {
    const customBuildPricing = getCustomBuildPricing(
      selectedCustomModuleIds,
      selectedCustomModuleOptions,
    );
    const moduleCount = customBuildPricing.selectedModules.length;
    const optionCount = customBuildPricing.selectedOptionCount;
    const customStatusLabel = getCustomStatusLabel(moduleCount, optionCount);
    const total = {
      description: moduleCount
        ? optionCount
          ? "Configured total for the selected modules and active add-ons."
          : "Configured total for the current module selection."
        : "Select services to begin pricing.",
      label: "Configured total",
      meta: getCustomSelectionMeta(moduleCount, optionCount),
      value: moduleCount ? formatInr(customBuildPricing.total) : "Awaiting selection",
    };

    return {
      billingLabel: customStatusLabel,
      billingMode,
      coupon: null,
      customSelection: {
        groupedModules: customBuildPricing.groupedModules,
        lineItems: customBuildPricing.selectedModules.map(buildModuleReviewLineItem),
        modules: customBuildPricing.selectedModules,
        selectedOptionCount: optionCount,
      },
      description: moduleCount
        ? optionCount
          ? "Review the selected modules, nested options, configured total, and delivery estimate before you submit."
          : "Review the selected modules, configured total, and delivery estimate before you submit."
        : "Select modules on the configurator to build a valid order request.",
      hasSelection: moduleCount > 0,
      mode,
      modeLabel: "Build Your Own",
      note: "You can still adjust this before submitting.",
      packageSelection: null,
      reviewItems: customBuildPricing.summaryItems,
      selection: {
        billingMode: null,
        couponCode: null,
        customModuleIds: customBuildPricing.selectedModules.map((module) => module.id),
        customModuleOptions: customBuildPricing.selectedModules.reduce(
          (runningSelections, module) => {
            runningSelections[module.id] = module.optionSelections;
            return runningSelections;
          },
          {},
        ),
        mode,
        packageId: null,
      },
      selectionLabel: "Selected modules",
      selectionNote: moduleCount
        ? optionCount
          ? "Selected modules and nested choices stay tied to this request."
          : "Selected modules stay tied to this request."
        : "Module selections appear here once you start building.",
      statusLabel: customStatusLabel,
      structuredSelection: {
        groupedModules: customBuildPricing.groupedModules,
        lineItems: customBuildPricing.lineItems,
        modules: customBuildPricing.selectedModules,
        type: ORDER_FLOW_MODE_CUSTOM,
      },
      submissionPayload: buildCustomSubmissionPayload(customBuildPricing),
      summaryPanel: buildCustomSummaryPanel({
        customBuildPricing,
        moduleCount,
        optionCount,
      }),
      timeline: customBuildPricing.timeline,
      title: moduleCount
        ? optionCount
          ? `Custom build with ${getCustomModuleCountLabel(
              moduleCount,
            )} and ${getCustomizationCountLabel(optionCount)}`
          : `Custom build with ${getCustomModuleCountLabel(moduleCount)}`
        : "Custom build pending",
      total,
    };
  }

  const selectedPlanRecord =
    pricingPackages.find((plan) => plan.id === selectedPlanId) || null;
  const emptyTotal = {
    description: "Pricing appears here as soon as a starting configuration is active.",
    label: "Current total",
    meta: "",
    value: "Select a package",
  };

  if (!selectedPlanRecord) {
    return {
      billingLabel,
      billingMode,
      coupon: null,
      customSelection: null,
      description: "Select a starting configuration on the configurator to build the order summary.",
      hasSelection: false,
      mode,
      modeLabel: "Packages",
      note: "You can still adjust this before submitting.",
      packageSelection: null,
      reviewItems: [],
      selection: {
        billingMode,
        couponCode: appliedCouponCode || null,
        customModuleIds: [],
        mode,
        packageId: null,
      },
      selectionLabel: "Selected setup",
      selectionNote: "Choose a package to continue into review.",
      statusLabel: billingLabel,
      structuredSelection: {
        groupedModules: [],
        lineItems: [],
        modules: [],
        type: ORDER_FLOW_MODE_PACKAGES,
      },
      submissionPayload: null,
      summaryPanel: buildPackageSummaryPanel({
        billingLabel,
        plan: null,
        timeline: EMPTY_PACKAGE_TIMELINE,
        total: emptyTotal,
      }),
      timeline: EMPTY_PACKAGE_TIMELINE,
      title: "No starting configuration selected",
      total: emptyTotal,
    };
  }

  const appliedCoupon = getCouponByCode(appliedCouponCode);
  const selectedPlan = getPackagePricing(
    selectedPlanRecord,
    billingMode,
    appliedCoupon,
  );
  const packageSelection = buildPackageSelection(selectedPlan);
  const timeline = buildPackageTimeline(selectedPlan);
  const total = getPackageTotalSummary(selectedPlan);

  return {
    billingLabel,
    billingMode,
    coupon: selectedPlan.coupon || null,
    customSelection: null,
    description: selectedPlan.description,
    hasSelection: true,
    mode,
    modeLabel: "Packages",
    note: "You can still adjust this before submitting.",
    packageSelection,
    reviewItems: [
      {
        detail: selectedPlan.audience,
        eyebrow: "Package",
        id: selectedPlan.id,
        title: selectedPlan.name,
        value: selectedPlan.base.billingLine,
      },
    ],
    selection: {
      billingMode,
      couponCode: appliedCoupon?.code ?? null,
      customModuleIds: [],
      includedModuleIds: packageSelection.includedModules.map((module) => module.id),
      mode,
      packageId: selectedPlan.id,
    },
    selectionLabel: "Selected setup",
    selectionNote: "This starting configuration can still be refined before handoff.",
    statusLabel: billingLabel,
    structuredSelection: {
      groupedModules: packageSelection.groupedModules,
      lineItems: packageSelection.lineItems,
      modules: packageSelection.includedModules,
      type: ORDER_FLOW_MODE_PACKAGES,
    },
    submissionPayload: buildPackageSubmissionPayload({
      appliedCoupon,
      billingMode,
      packageSelection,
      timeline,
      total,
    }),
    summaryPanel: buildPackageSummaryPanel({
      billingLabel,
      plan: selectedPlan,
      timeline,
      total,
    }),
    timeline,
    title: selectedPlan.name,
    total,
  };
}

export function buildOrderFlowSteps(stage, { hasSelection = true } = {}) {
  if (!hasSelection && stage !== "configure") {
    return buildOrderFlowSteps("configure", { hasSelection: false });
  }

  if (stage === "review") {
    return [
      { id: "configure", label: "Configure", status: "complete" },
      { id: "review", label: "Review", status: "current" },
      { id: "submit", label: "Submit", status: "available" },
      { id: "confirm", label: "Confirm", status: "upcoming" },
    ];
  }

  if (stage === "submit") {
    return [
      { id: "configure", label: "Configure", status: "complete" },
      { id: "review", label: "Review", status: "complete" },
      { id: "submit", label: "Submit", status: "current" },
      { id: "confirm", label: "Confirm", status: "upcoming" },
    ];
  }

  if (stage === "confirm") {
    return [
      { id: "configure", label: "Configure", status: "complete" },
      { id: "review", label: "Review", status: "complete" },
      { id: "submit", label: "Submit", status: "complete" },
      { id: "confirm", label: "Confirm", status: "current" },
    ];
  }

  return [
    { id: "configure", label: "Configure", status: "current" },
    {
      id: "review",
      label: "Review",
      status: hasSelection ? "available" : "upcoming",
    },
    { id: "submit", label: "Submit", status: "upcoming" },
    { id: "confirm", label: "Confirm", status: "upcoming" },
  ];
}

function createReferenceFromTimestamp(submittedAt) {
  const dateToken = submittedAt.slice(0, 10).replaceAll("-", "");
  const entropy = Math.random().toString(36).slice(2, 6).toUpperCase();

  return `IOU-${dateToken}-${entropy}`;
}

function normalizeSubmittedDetails(submittedDetails = {}) {
  return {
    businessName: submittedDetails.businessName?.trim() || "",
    email: submittedDetails.email?.trim() || "",
    name: submittedDetails.name?.trim() || "",
    notes: submittedDetails.notes?.trim() || "",
    phone: submittedDetails.phone?.trim() || "",
  };
}

export function createSubmittedOrder({ configuration, submittedDetails }) {
  const submittedAt = new Date().toISOString();

  return {
    configuration,
    reference: createReferenceFromTimestamp(submittedAt),
    submittedAt,
    submittedDetails: normalizeSubmittedDetails(submittedDetails),
  };
}
