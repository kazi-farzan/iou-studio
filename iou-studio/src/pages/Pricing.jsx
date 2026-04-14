import { useMemo, useState } from "react";
import PricingPlanCard from "../components/pricing/PricingPlanCard.jsx";
import PricingSummaryPanel from "../components/pricing/PricingSummaryPanel.jsx";
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
    label: "All prices in INR",
    detail: "Set up for Indian-market retainers, scaling brands, and premium custom work.",
  },
  {
    label: "Yearly saves 2 months",
    detail: "Switching to yearly reveals the lower effective monthly rate and bills once upfront.",
  },
  {
    label: "Coupon simulation only",
    detail: "FIRST3 and TRYONCE stay frontend-only, but the rules are structured for backend handoff later.",
  },
];

function getSurfaceClasses(tone) {
  if (tone === "accent") {
    return "theme-panel-contrast border-[color:var(--border-accent)] bg-[var(--surface-accent)]";
  }

  if (tone === "muted") {
    return "theme-panel border-[color:var(--border-subtle)]";
  }

  return "theme-panel-contrast border-[color:var(--border-subtle)]";
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
    <div className="w-full">
      <Section
        className="pt-4 sm:pt-8"
        description="Choose how IOU Labs pricing is billed, preview launch-offer coupons, and compare plan totals without losing clarity."
        eyebrow="Pricing"
        title="Pricing that stays clear from first click to final invoice."
        width="full"
      >
        <div className="space-y-8">
          <div className="grid gap-6 xl:grid-cols-[minmax(0,1.08fr)_380px] xl:items-start">
            <Card className="relative overflow-hidden p-6 sm:p-8 lg:p-10">
              <div
                aria-hidden="true"
                className="theme-ambient-orb-1 pointer-events-none absolute left-[-4rem] top-[-5rem] h-40 w-40 rounded-full blur-2xl"
              />
              <div
                aria-hidden="true"
                className="theme-ambient-orb-2 pointer-events-none absolute bottom-[-5rem] right-[-4rem] h-40 w-40 rounded-full blur-2xl"
              />

              <div className="relative space-y-8">
                <div className="max-w-3xl space-y-4">
                  <div className="theme-panel inline-flex items-center gap-3 rounded-full px-4 py-2 text-[11px] font-medium uppercase tracking-[0.26em] text-[var(--accent-secondary)]">
                    <span className="theme-dot h-2 w-2 rounded-full" />
                    Frontend Pricing Simulation
                  </div>

                  <p className="text-base leading-8 text-[var(--text-secondary)] sm:text-lg">
                    IOU Labs pricing is designed to feel straightforward even when the
                    billing logic changes. Monthly billing stays flexible. Yearly
                    billing lowers the effective monthly rate. Coupons preview launch
                    offers without scattering business rules across the page.
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
                        <div className="flex flex-col gap-5 xl:flex-row xl:items-start xl:justify-between">
                          <div className="max-w-sm">
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

                          <div className="grid flex-1 gap-4 sm:grid-cols-3">
                            {snapshot.metrics.map((metric) => (
                              <div
                                className="theme-panel-contrast rounded-[20px] p-4"
                                key={metric.label}
                              >
                                <p className="text-xs uppercase tracking-[0.22em] text-[var(--text-muted)]">
                                  {metric.label}
                                </p>
                                <p className="mt-2 text-lg font-semibold text-[var(--text-primary)]">
                                  {metric.value}
                                </p>
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
      </Section>
    </div>
  );
}
