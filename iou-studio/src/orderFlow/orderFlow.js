import { getCustomBuildPricing } from "../data/customBuildPricing.js";
import {
  billingOptions,
  formatInr,
  getCouponByCode,
  getPlanPricing,
  getPlanSummaryRows,
  getSelectedPlanSummary,
  pricingPlans,
} from "../data/pricing.js";

export const ORDER_FLOW_MODE_PACKAGES = "packages";
export const ORDER_FLOW_MODE_CUSTOM = "custom";

const packageTimelineEstimates = {
  starter: "Estimated delivery: 3-4 weeks",
  growth: "Estimated delivery: 4-6 weeks",
  premium: "Estimated delivery: 6-8 weeks",
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

export function getDefaultPlanId() {
  return pricingPlans.find((plan) => plan.isMostPopular)?.id || pricingPlans[0]?.id || null;
}

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
    packageTimelineEstimates[planId] ||
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
  selectedPlanId,
}) {
  const billingLabel = getBillingLabel(billingMode);

  if (mode === ORDER_FLOW_MODE_CUSTOM) {
    const customBuildPricing = getCustomBuildPricing(selectedCustomModuleIds);
    const moduleCount = customBuildPricing.selectedModules.length;
    const customStatusLabel = moduleCount
      ? `${moduleCount} active`
      : "Awaiting selection";

    return {
      billingLabel: customStatusLabel,
      billingMode,
      coupon: null,
      customSelection: {
        lineItems: customBuildPricing.selectedModules.map((module) => ({
          detail: module.description,
          eyebrow: module.category,
          id: module.id,
          timeline: formatModuleTimelineHint(module.timelineDays),
          title: module.title,
          value: formatInr(module.basePrice),
        })),
        modules: customBuildPricing.selectedModules,
      },
      description: moduleCount
        ? "Review the selected modules, base total, and delivery estimate before you submit."
        : "Select modules on the configurator to build a valid order request.",
      hasSelection: moduleCount > 0,
      mode,
      modeLabel: "Build Your Own",
      note: "You can still adjust this before submitting.",
      packageSelection: null,
      reviewItems: customBuildPricing.summaryItems,
      selectionLabel: "Selected modules",
      selectionNote: moduleCount
        ? "Selected modules stay tied to this request."
        : "Module selections appear here once you start building.",
      statusLabel: customStatusLabel,
      timeline: customBuildPricing.timeline,
      title: moduleCount
        ? `Custom build with ${moduleCount} active module${
            moduleCount === 1 ? "" : "s"
          }`
        : "Custom build pending",
      total: {
        description: moduleCount
          ? "Base total for the current module selection."
          : "Select services to begin pricing.",
        label: "Base total",
        meta: moduleCount
          ? `${moduleCount} module${moduleCount === 1 ? "" : "s"} included`
          : "",
        value: formatInr(customBuildPricing.total),
      },
    };
  }

  const selectedPlanRecord =
    pricingPlans.find((plan) => plan.id === selectedPlanId) || null;

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
      selectionLabel: "Selected setup",
      selectionNote: "Choose a package to continue into review.",
      statusLabel: billingLabel,
      timeline: {
        description: "Select a package to view the baseline delivery window.",
        label: "Estimated timeline",
        value: "Timeline pending",
      },
      title: "No starting configuration selected",
      total: {
        description: "Pricing appears here as soon as a starting configuration is active.",
        label: "Current total",
        meta: "",
        value: "Select a package",
      },
    };
  }

  const appliedCoupon = getCouponByCode(appliedCouponCode);
  const selectedPlan = getPlanPricing(
    selectedPlanRecord,
    billingMode,
    appliedCoupon,
  );

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
    packageSelection: {
      plan: selectedPlan,
      pricingRows: getPlanSummaryRows(selectedPlan),
      selectedSummary: getSelectedPlanSummary(selectedPlan),
    },
    reviewItems: [
      {
        detail: selectedPlan.audience,
        eyebrow: "Package",
        id: selectedPlan.id,
        title: selectedPlan.name,
        value: selectedPlan.base.billingLine,
      },
    ],
    selectionLabel: "Selected setup",
    selectionNote: "This starting configuration can still be refined before handoff.",
    statusLabel: billingLabel,
    timeline: {
      description: "Final delivery depends on scope confirmation and content readiness.",
      label: "Estimated timeline",
      value: getPackageTimeline(selectedPlan.id),
    },
    title: selectedPlan.name,
    total: getPackageTotalSummary(selectedPlan),
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
