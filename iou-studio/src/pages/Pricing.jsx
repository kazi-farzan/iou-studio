import { useEffect, useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import PricingPlanCard from "../components/pricing/PricingPlanCard.jsx";
import PricingSummaryPanel from "../components/pricing/PricingSummaryPanel.jsx";
import PricingValueText from "../components/pricing/PricingValueText.jsx";
import Button from "../components/ui/Button.jsx";
import Card from "../components/ui/Card.jsx";
import Section from "../components/ui/Section.jsx";
import {
  BILLING_MODE_MONTHLY,
  billingOptions,
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

const customBuildCategories = ["Branding", "Website", "Ordering Systems"];

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
    () => plans.find((plan) => plan.id === selectedPlanId) || plans[0],
    [plans, selectedPlanId],
  );

  const activeBillingLabel = billingOptions.find(
    (option) => option.id === billingMode,
  )?.label;
  const isPackagesMode = mode === "packages";

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

          <div
            className={isPackagesMode ? "space-y-8 transition-all duration-300" : "hidden"}
          >
          <div className="grid gap-6 xl:grid-cols-[minmax(0,1.08fr)_380px] xl:items-start">
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
                Choose a baseline setup. Live totals and the breakdown panel follow the
                configuration you select.
              </p>
            </div>

            <div className="grid gap-5 xl:grid-cols-3">
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

          <div className="grid gap-6 xl:grid-cols-[minmax(0,1.08fr)_380px] xl:items-start">
            <Card className="p-6 sm:p-8">
              <div className="space-y-6">
                <div className="max-w-3xl space-y-3">
                  <p className="text-xs font-medium uppercase tracking-[0.28em] text-[var(--accent-secondary)]">
                    Live Comparison
                  </p>
                  <h2 className="text-3xl font-semibold tracking-[-0.04em] text-[var(--text-primary)] sm:text-4xl">
                    Compare the active billing view without re-reading every card.
                  </h2>
                  <p className="text-sm leading-7 text-[var(--text-secondary)] sm:text-base">
                    The selected billing mode and coupon logic update every number
                    below, so this comparison stays aligned with the plan cards and
                    the breakdown panel.
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
                                  <PricingValueText size="md" value={metric.value} />
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

            <PricingSummaryPanel
              billingLabel={activeBillingLabel}
              couponFeedback={couponFeedback}
              plan={selectedPlan}
            />
          </div>
          </div>

          {isPackagesMode ? null : (
            <Card className="p-6 sm:p-8 lg:p-10">
              <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px] lg:items-start">
                <div className="max-w-3xl space-y-4">
                  <p className="text-xs font-medium uppercase tracking-[0.28em] text-[var(--accent-secondary)]">
                    Custom Build
                  </p>
                  <h2 className="text-3xl font-semibold tracking-[-0.04em] text-[var(--text-primary)] sm:text-4xl">
                    Build your custom setup
                  </h2>
                  <p className="text-sm leading-7 text-[var(--text-secondary)] sm:text-base">
                    Select services and configure your system. Pricing updates as you
                    build.
                  </p>
                  <p className="text-sm leading-7 text-[var(--text-muted)]">
                    Module selection and live pricing controls will appear here in the
                    next layer of the configurator.
                  </p>
                </div>

                <div className="grid gap-3">
                  {customBuildCategories.map((category) => (
                    <div
                      key={category}
                      className="theme-panel rounded-[22px] px-4 py-4"
                    >
                      <p className="text-xs font-medium uppercase tracking-[0.24em] text-[var(--accent-secondary)]">
                        Module
                      </p>
                      <p className="mt-2 text-base font-semibold text-[var(--text-primary)]">
                        {category}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          )}
        </div>
      </Section>
    </div>
  );
}
