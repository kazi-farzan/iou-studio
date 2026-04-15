import { useEffect, useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import CustomBuildModuleCard from "../components/pricing/CustomBuildModuleCard.jsx";
import PricingPlanCard from "../components/pricing/PricingPlanCard.jsx";
import PricingSummaryPanel from "../components/pricing/PricingSummaryPanel.jsx";
import PricingValueText from "../components/pricing/PricingValueText.jsx";
import Button from "../components/ui/Button.jsx";
import Card from "../components/ui/Card.jsx";
import Section from "../components/ui/Section.jsx";
import {
  customBuildModules,
  getCustomBuildPricing,
} from "../data/customBuildPricing.js";
import {
  BILLING_MODE_MONTHLY,
  billingOptions,
  formatInr,
  getCouponByCode,
  getCouponFeedback,
  getPlanPricing,
  getPlanSnapshot,
  getPricingModeSummary,
  pricingPlans,
  validateCouponCode,
} from "../data/pricing.js";

const pricingNotes = [
  {
    label: "All selections update live",
    detail: "Billing mode, coupon checks, and the active starting configuration stay aligned as you adjust the setup.",
  },
  {
    label: "Clear scope before you proceed",
    detail: "Review totals, billing terms, and delivery context in one place before moving into the next step.",
  },
  {
    label: "Transparent inputs",
    detail: "Switch between billing modes, test available coupons, and see the resulting changes immediately.",
  },
];

const configurationModes = [
  {
    id: "packages",
    label: "Packages",
    detail: "Start from preset configurations.",
  },
  {
    id: "custom",
    label: "Build Your Own",
    detail: "Move into a custom system build.",
  },
];

const packageTimelineEstimates = {
  starter: "Estimated delivery: 3-4 weeks",
  growth: "Estimated delivery: 4-6 weeks",
  premium: "Estimated delivery: 6-8 weeks",
};

function getSurfaceClasses(tone) {
  if (tone === "accent") {
    return "theme-panel-contrast border-[color:var(--border-accent)] bg-[var(--surface-accent)]";
  }

  if (tone === "muted") {
    return "theme-panel border-[color:var(--border-subtle)]";
  }

  return "theme-panel-contrast border-[color:var(--border-subtle)]";
}

function getModeToggleClasses(isActive) {
  return [
    "flex-1 rounded-[22px] border px-4 py-4 text-left transition-all duration-300",
    isActive
      ? "border-[color:var(--border-accent)] bg-[var(--surface-accent)] text-[var(--text-primary)]"
      : "border-transparent bg-transparent text-[var(--text-secondary)] hover:border-[color:var(--border-subtle)] hover:bg-[var(--surface)] hover:text-[var(--text-primary)]",
  ].join(" ");
}

function getToggleClasses(isActive) {
  return [
    "rounded-[22px] border px-4 py-4 text-left transition-all duration-300",
    isActive
      ? "border-[color:var(--border-accent)] bg-[linear-gradient(180deg,var(--surface-accent),var(--surface-accent-strong))] text-[var(--text-primary)] shadow-[var(--shadow-accent)]"
      : "border-transparent bg-transparent text-[var(--text-secondary)] hover:border-[color:var(--border-accent)] hover:bg-[var(--surface)] hover:text-[var(--text-primary)]",
  ].join(" ");
}

function getPackageTimeline(planId) {
  return (
    packageTimelineEstimates[planId] ||
    "Estimated delivery: timeline will be confirmed during scope review"
  );
}

function getPackageTotalSummary(plan) {
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

const defaultPlanId =
  pricingPlans.find((plan) => plan.isMostPopular)?.id || pricingPlans[0].id;

export default function Pricing() {
  const location = useLocation();
  const [mode, setMode] = useState("packages");
  const [billingMode, setBillingMode] = useState(BILLING_MODE_MONTHLY);
  const [couponInput, setCouponInput] = useState("");
  const [appliedCouponCode, setAppliedCouponCode] = useState("");
  const [couponError, setCouponError] = useState("");
  const [selectedPlanId, setSelectedPlanId] = useState(defaultPlanId);
  const [selectedCustomModuleIds, setSelectedCustomModuleIds] = useState([]);

  const appliedCoupon = useMemo(
    () => getCouponByCode(appliedCouponCode),
    [appliedCouponCode],
  );

  const couponFeedback = useMemo(
    () => getCouponFeedback(appliedCoupon, billingMode),
    [appliedCoupon, billingMode],
  );

  const pricingModeSummary = useMemo(
    () => getPricingModeSummary(billingMode, appliedCoupon),
    [appliedCoupon, billingMode],
  );

  const plans = useMemo(
    () =>
      pricingPlans.map((plan) => getPlanPricing(plan, billingMode, appliedCoupon)),
    [appliedCoupon, billingMode],
  );

  const selectedPlan = useMemo(
    () => plans.find((plan) => plan.id === selectedPlanId) || null,
    [plans, selectedPlanId],
  );

  const activeBillingLabel =
    billingOptions.find((option) => option.id === billingMode)?.label || "Pricing";
  const isPackagesMode = mode === "packages";

  const customBuildPricing = useMemo(
    () => getCustomBuildPricing(selectedCustomModuleIds),
    [selectedCustomModuleIds],
  );

  const selectedCustomModules = customBuildPricing.selectedModules;
  const selectedCustomModulesLabel = selectedCustomModules.length
    ? `${selectedCustomModules.length} module${
        selectedCustomModules.length === 1 ? "" : "s"
      } selected`
    : "Select modules to begin";

  const summaryPanelData = useMemo(() => {
    if (isPackagesMode) {
      return {
        ctaLabel: "Continue",
        ctaNote: selectedPlan
          ? "Move into scope review and confirm the next step."
          : "Choose a starting configuration to unlock the next step.",
        description:
          "Monitor the active starting configuration, current pricing, and delivery window while you configure.",
        emptyState: {
          title: "No starting configuration selected yet.",
          detail: "Choose a package to review the current price and timeline.",
        },
        isActionDisabled: !selectedPlan,
        items: selectedPlan
          ? [
              {
                id: selectedPlan.id,
                title: selectedPlan.name,
                detail: selectedPlan.description,
                value: selectedPlan.audience,
              },
            ]
          : [],
        modeLabel: "Packages",
        selectionHint: selectedPlan
          ? "This starting configuration can still be customized before handoff."
          : "The summary will lock onto the package you activate.",
        selectionLabel: "Selected setup",
        statusLabel: activeBillingLabel,
        timeline: {
          description: selectedPlan
            ? "Final delivery depends on scope confirmation and content readiness."
            : "Select a package to view the baseline delivery window.",
          label: "Estimated timeline",
          value: selectedPlan
            ? getPackageTimeline(selectedPlan.id)
            : "Timeline pending",
        },
        total: getPackageTotalSummary(selectedPlan),
      };
    }

    return {
      ctaLabel: "Continue",
      ctaNote: selectedCustomModules.length
        ? "Review the live module total with us and turn it into a scoped build."
        : "Add modules to prepare a custom build summary and next step.",
      description:
        "Monitor the active module selection, base total, and delivery estimate while the custom build takes shape.",
      emptyState: {
        title: "No modules selected yet.",
        detail: "Add modules to start building your custom setup.",
      },
      isActionDisabled: !selectedCustomModules.length,
      items: customBuildPricing.summaryItems,
      modeLabel: "Build Your Own",
      selectionHint: selectedCustomModules.length
        ? "Selected modules stay synchronized here in real time."
        : "Module selections will appear here as soon as you start building.",
      selectionLabel: "Selected modules",
      statusLabel: selectedCustomModules.length
        ? `${selectedCustomModules.length} active`
        : "Awaiting selection",
      timeline: customBuildPricing.timeline,
      total: {
        description: selectedCustomModules.length
          ? "Base total for the current module selection."
          : "Select services to begin pricing.",
        label: "Total",
        meta: selectedCustomModules.length
          ? `${selectedCustomModules.length} module${
              selectedCustomModules.length === 1 ? "" : "s"
            } included`
          : "",
        value: formatInr(customBuildPricing.total),
      },
    };
  }, [
    activeBillingLabel,
    customBuildPricing,
    isPackagesMode,
    selectedCustomModules,
    selectedPlan,
  ]);

  useEffect(() => {
    if (location.hash !== "#builder") {
      return;
    }

    const builderSection = document.getElementById("builder");

    if (!builderSection) {
      return;
    }

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    builderSection.scrollIntoView({
      behavior: prefersReducedMotion ? "auto" : "smooth",
      block: "start",
    });
  }, [location.hash]);

  function handleCouponApply() {
    const result = validateCouponCode(couponInput);

    if (!result.isValid) {
      setCouponError(result.message);
      return;
    }

    setAppliedCouponCode(result.coupon.code);
    setCouponInput(result.coupon.code);
    setCouponError("");
  }

  function handleCouponClear() {
    setAppliedCouponCode("");
    setCouponInput("");
    setCouponError("");
  }

  function handleCouponChange(event) {
    setCouponInput(event.target.value.toUpperCase());
    setCouponError("");
  }

  function handleCustomModuleToggle(moduleId) {
    setSelectedCustomModuleIds((current) => {
      if (current.includes(moduleId)) {
        return current.filter((item) => item !== moduleId);
      }

      return [...current, moduleId];
    });
  }

  return (
    <div className="w-full scroll-mt-28 sm:scroll-mt-32" id="builder">
      <Section className="pt-2 sm:pt-4" width="full">
        <div className="space-y-8">
          <div className="max-w-4xl space-y-3">
            <p className="text-xs font-medium uppercase tracking-[0.32em] text-[var(--accent-secondary)]">
              System Configuration
            </p>

            <h1 className="max-w-3xl text-3xl font-semibold tracking-[-0.04em] text-[var(--text-primary)] sm:text-4xl">
              Configure Your Setup
            </h1>

            <p className="max-w-3xl text-sm leading-7 text-[var(--text-secondary)] sm:text-base">
              Select a starting configuration or build your own setup.
              <span className="block">
                Pricing updates live as you adjust billing and coupon inputs.
              </span>
            </p>

            <p className="text-xs uppercase tracking-[0.22em] text-[var(--text-muted)]">
              All selections update live. Clear scope before you proceed.
            </p>
          </div>

          <div className="grid gap-8 xl:grid-cols-[minmax(0,1fr)_360px] xl:items-start">
            <div className="space-y-8">
              <div className="max-w-4xl space-y-3">
                <p className="text-xs font-medium uppercase tracking-[0.28em] text-[var(--accent-secondary)]">
                  Configuration Mode
                </p>

                <div className="theme-panel flex flex-col gap-2 rounded-[28px] border border-[color:var(--border-subtle)] p-2 sm:flex-row">
                  {configurationModes.map((option) => (
                    <button
                      key={option.id}
                      aria-pressed={mode === option.id}
                      className={getModeToggleClasses(mode === option.id)}
                      onClick={() => setMode(option.id)}
                      type="button"
                    >
                      <span className="block text-sm font-semibold tracking-[0.01em]">
                        {option.label}
                      </span>
                      <span className="mt-1 block text-xs leading-5 opacity-80">
                        {option.detail}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {isPackagesMode ? (
                <>
                  <div className="grid gap-6 lg:grid-cols-[minmax(0,1.05fr)_minmax(280px,0.7fr)] lg:items-start">
            <Card className="p-5 sm:p-6 lg:p-7">
              <div className="space-y-6">
                <div className="max-w-3xl space-y-3">
                  <div className="theme-panel inline-flex items-center gap-3 rounded-full px-4 py-2 text-[11px] font-medium uppercase tracking-[0.26em] text-[var(--accent-secondary)]">
                    <span className="theme-dot h-2 w-2 rounded-full" />
                    Configuration Overview
                  </div>

                  <p className="text-sm leading-7 text-[var(--text-secondary)] sm:text-base">
                    Use this surface to switch billing, test coupon rules, and review
                    starting configurations in one place. Every change updates the
                    active totals immediately, so the setup stays clear while you work.
                  </p>
                </div>

                <div className="grid gap-4 md:grid-cols-3">
                  {pricingNotes.map((note) => (
                    <div key={note.label} className="theme-panel rounded-[24px] p-5">
                      <p className="text-xs font-medium uppercase tracking-[0.24em] text-[var(--accent-secondary)]">
                        {note.label}
                      </p>
                      <p className="mt-3 text-sm leading-7 text-[var(--text-secondary)]">
                        {note.detail}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </Card>

            <div className="space-y-4">
              <Card className="p-4 sm:p-5">
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-2">
                    {billingOptions.map((option) => (
                      <button
                        key={option.id}
                        aria-pressed={billingMode === option.id}
                        className={getToggleClasses(billingMode === option.id)}
                        onClick={() => setBillingMode(option.id)}
                        type="button"
                      >
                        <span className="block text-sm font-semibold tracking-[0.01em]">
                          {option.label}
                        </span>
                        <span className="mt-1 block text-xs leading-5 opacity-80">
                          {option.note}
                        </span>
                      </button>
                    ))}
                  </div>

                  <div
                    className={[
                      "rounded-[24px] border p-4",
                      getSurfaceClasses(pricingModeSummary.tone),
                    ].join(" ")}
                  >
                    <p className="text-xs font-medium uppercase tracking-[0.24em] text-[var(--accent-secondary)]">
                      {pricingModeSummary.eyebrow}
                    </p>
                    <p className="mt-2 text-base font-semibold text-[var(--text-primary)]">
                      {pricingModeSummary.title}
                    </p>
                    <p className="mt-2 text-sm leading-6 text-[var(--text-secondary)]">
                      {pricingModeSummary.detail}
                    </p>
                  </div>
                </div>
              </Card>

              <Card className="p-4 sm:p-5">
                <div className="space-y-4">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-xs font-medium uppercase tracking-[0.26em] text-[var(--accent-secondary)]">
                        Coupon Simulation
                      </p>
                      <p className="mt-2 text-sm leading-6 text-[var(--text-secondary)]">
                        Try <span className="font-medium text-[var(--text-primary)]">FIRST3</span> or{" "}
                        <span className="font-medium text-[var(--text-primary)]">TRYONCE</span>.
                      </p>
                    </div>

                    {appliedCoupon ? (
                      <button
                        className="text-sm font-medium text-[var(--accent-secondary)] transition-colors duration-300 hover:text-[var(--text-primary)]"
                        onClick={handleCouponClear}
                        type="button"
                      >
                        Clear
                      </button>
                    ) : null}
                  </div>

                  <div className="flex flex-col gap-3 sm:flex-row">
                    <input
                      className={[
                        "theme-input min-h-[52px] rounded-full px-5 py-3 text-sm tracking-[0.08em] uppercase",
                        couponError
                          ? "border-[rgba(217,93,106,0.38)] bg-[rgba(217,93,106,0.08)]"
                          : "",
                      ]
                        .filter(Boolean)
                        .join(" ")}
                      onChange={handleCouponChange}
                      placeholder="Enter coupon code"
                      value={couponInput}
                    />

                    <Button
                      className="sm:min-w-[132px]"
                      onClick={handleCouponApply}
                      size="lg"
                    >
                      Apply
                    </Button>
                  </div>

                  {couponError ? (
                    <div className="rounded-[20px] border border-[rgba(217,93,106,0.32)] bg-[rgba(217,93,106,0.08)] px-4 py-3">
                      <p className="text-sm leading-6 text-[var(--text-primary)]">
                        {couponError}
                      </p>
                    </div>
                  ) : null}

                  <div
                    className={[
                      "rounded-[24px] border p-4",
                      getSurfaceClasses(couponFeedback.tone),
                    ].join(" ")}
                  >
                    <p className="text-xs font-medium uppercase tracking-[0.24em] text-[var(--accent-secondary)]">
                      {couponFeedback.label}
                    </p>
                    <p className="mt-2 text-base font-semibold text-[var(--text-primary)]">
                      {couponFeedback.title}
                    </p>
                    <p className="mt-2 text-sm leading-6 text-[var(--text-secondary)]">
                      {couponFeedback.detail}
                    </p>
                  </div>
                </div>
              </Card>
            </div>
          </div>

                  <div className="space-y-4">
                    <div className="max-w-3xl space-y-2">
                      <p className="text-xs font-medium uppercase tracking-[0.28em] text-[var(--accent-secondary)]">
                        Starting Configurations
                      </p>
                      <p className="text-sm leading-6 text-[var(--text-secondary)]">
                        Choose a baseline setup. The summary panel follows the active
                        configuration so you always have the current state in view.
                      </p>
                    </div>

                    <div className="grid gap-5 lg:grid-cols-2 2xl:grid-cols-3">
                      {plans.map((plan) => (
                        <PricingPlanCard
                          isSelected={selectedPlanId === plan.id}
                          key={plan.id}
                          onSelect={setSelectedPlanId}
                          plan={plan}
                        />
                      ))}
                    </div>
                  </div>

                  <Card className="p-6 sm:p-8">
                    <div className="space-y-6">
                      <div className="max-w-3xl space-y-3">
                        <p className="text-xs font-medium uppercase tracking-[0.28em] text-[var(--accent-secondary)]">
                          Live Comparison
                        </p>
                        <h2 className="text-3xl font-semibold tracking-[-0.04em] text-[var(--text-primary)] sm:text-4xl">
                          Compare the active billing view without re-reading every
                          card.
                        </h2>
                        <p className="text-sm leading-7 text-[var(--text-secondary)] sm:text-base">
                          The selected billing mode and coupon logic update every number
                          below, so this comparison stays aligned with the plan cards
                          and the summary panel.
                        </p>
                      </div>

                      <div className="space-y-4">
                        {plans.map((plan) => {
                          const snapshot = getPlanSnapshot(plan);
                          const isSelected = plan.id === selectedPlanId;

                          return (
                            <div
                              key={plan.id}
                              className={[
                                "rounded-[26px] border p-5 transition-all duration-300",
                                isSelected
                                  ? "border-[color:var(--border-accent)] bg-[var(--surface-accent)] shadow-[var(--shadow-accent)]"
                                  : "theme-panel",
                              ].join(" ")}
                            >
                              <div className="flex min-w-0 flex-col gap-5 xl:flex-row xl:items-start xl:justify-between">
                                <div className="max-w-sm min-w-0">
                                  <div className="flex flex-wrap items-center gap-2">
                                    <p className="text-base font-semibold text-[var(--text-primary)]">
                                      {plan.name}
                                    </p>

                                    {plan.isMostPopular ? (
                                      <span className="theme-chip-strong rounded-full px-3 py-1 text-[11px] font-medium uppercase tracking-[0.22em]">
                                        Most Popular
                                      </span>
                                    ) : null}

                                    {isSelected ? (
                                      <span className="theme-panel rounded-full px-3 py-1 text-[11px] font-medium uppercase tracking-[0.22em] text-[var(--accent-secondary)]">
                                        Selected
                                      </span>
                                    ) : null}
                                  </div>

                                  <p className="mt-2 text-sm leading-6 text-[var(--text-secondary)]">
                                    {plan.audience}
                                  </p>
                                  <p className="mt-3 text-sm leading-7 text-[var(--text-secondary)]">
                                    {snapshot.note}
                                  </p>
                                </div>

                                <div className="grid min-w-0 flex-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
                                  {snapshot.metrics.map((metric) => (
                                    <div
                                      className="theme-panel-contrast min-w-0 rounded-[20px] p-4 sm:p-5"
                                      key={metric.label}
                                    >
                                      <p className="text-xs uppercase tracking-[0.22em] text-[var(--text-muted)]">
                                        {metric.label}
                                      </p>
                                      <div className="mt-2 min-w-0">
                                        <PricingValueText
                                          size="md"
                                          value={metric.value}
                                        />
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </Card>
                </>
              ) : (
                <Card className="p-6 sm:p-8 lg:p-10">
                  <div className="space-y-8">
                    <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
                      <div className="max-w-3xl space-y-4">
                        <p className="text-xs font-medium uppercase tracking-[0.28em] text-[var(--accent-secondary)]">
                          Custom Build
                        </p>
                        <h2 className="text-3xl font-semibold tracking-[-0.04em] text-[var(--text-primary)] sm:text-4xl">
                          Build your custom setup
                        </h2>
                        <p className="text-sm leading-7 text-[var(--text-secondary)] sm:text-base">
                          Select any module card to add or remove it from your
                          system. The base total and delivery estimate update
                          immediately as the active module set changes.
                        </p>
                      </div>

                      <div className="theme-panel inline-flex w-fit items-center gap-3 rounded-full px-4 py-2 text-[11px] font-medium uppercase tracking-[0.24em] text-[var(--accent-secondary)]">
                        <span className="theme-dot h-2 w-2 rounded-full" />
                        {selectedCustomModulesLabel}
                      </div>
                    </div>

                    <div className="grid gap-4 sm:gap-5 md:grid-cols-2">
                      {customBuildModules.map((module) => (
                        <CustomBuildModuleCard
                          isSelected={selectedCustomModuleIds.includes(module.id)}
                          key={module.id}
                          module={module}
                          onToggle={handleCustomModuleToggle}
                        />
                      ))}
                    </div>
                  </div>
                </Card>
              )}
            </div>

            <div className="xl:self-start">
              <PricingSummaryPanel summary={summaryPanelData} />
            </div>
          </div>
        </div>
      </Section>
    </div>
  );
}
