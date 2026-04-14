import { useMemo, useState } from "react";
import PricingPlanCard from "../components/pricing/PricingPlanCard.jsx";
import Button from "../components/ui/Button.jsx";
import Card from "../components/ui/Card.jsx";
import Section from "../components/ui/Section.jsx";
import {
  BILLING_MODE_MONTHLY,
  billingOptions,
  getCouponBanner,
  getCouponByCode,
  getPlanPricing,
  getPlanSnapshot,
  getPlanSummaryRows,
  pricingPlans,
  validateCouponCode,
} from "../data/pricing.js";

const pricingSignals = [
  {
    label: "India-first pricing",
    value: "INR across every tier",
    detail: "Structured for local businesses, scaling startups, and premium custom work.",
  },
  {
    label: "Built-in annual savings",
    value: "2 months included free",
    detail: "Yearly pricing is intentionally set at 10x the monthly rate.",
  },
  {
    label: "Promo simulation",
    value: "FIRST3 and TRYONCE",
    detail: "Coupons stay centralized in frontend business logic with instant UI updates.",
  },
];

function getBannerClasses(tone) {
  if (tone === "accent") {
    return "theme-panel-contrast border-[color:var(--border-accent)] bg-[var(--surface-accent)]";
  }

  if (tone === "muted") {
    return "theme-panel";
  }

  return "theme-panel-contrast";
}

function getToggleClasses(isActive) {
  return [
    "rounded-[20px] px-4 py-3 text-left transition-all duration-300",
    isActive
      ? "border border-[color:var(--border-accent)] bg-[linear-gradient(135deg,var(--accent-primary),var(--accent-secondary))] text-[var(--accent-solid-text)] shadow-[var(--shadow-accent)]"
      : "border border-transparent text-[var(--text-secondary)] hover:border-[color:var(--border-accent)] hover:bg-[var(--surface)] hover:text-[var(--text-primary)]",
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

  const couponBanner = useMemo(
    () => getCouponBanner(appliedCoupon, billingMode),
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

  const selectedSnapshot = useMemo(
    () => getPlanSnapshot(selectedPlan),
    [selectedPlan],
  );

  const selectedPlanRows = useMemo(
    () => getPlanSummaryRows(selectedPlan),
    [selectedPlan],
  );

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
        description="Choose the billing rhythm that fits the engagement, preview India-market pricing in INR, and simulate coupon logic before any backend exists."
        eyebrow="Pricing"
        title="Flexible retainers and premium builds with cleaner billing logic."
        width="full"
      >
        <div className="space-y-8">
          <Card className="relative overflow-hidden p-6 sm:p-8 lg:p-10">
            <div
              aria-hidden="true"
              className="theme-ambient-orb-1 pointer-events-none absolute left-[-4rem] top-[-5rem] h-40 w-40 rounded-full blur-2xl"
            />
            <div
              aria-hidden="true"
              className="theme-ambient-orb-2 pointer-events-none absolute bottom-[-5rem] right-[-4rem] h-44 w-44 rounded-full blur-2xl"
            />

            <div className="relative grid gap-8 xl:grid-cols-[minmax(0,1fr)_380px] xl:items-start">
              <div className="space-y-8">
                <div className="max-w-3xl space-y-4">
                  <p className="text-base leading-8 text-[var(--text-secondary)] sm:text-lg">
                    IOU Labs pricing is structured for brands that want premium
                    execution without muddying the buying decision. Monthly plans keep
                    things flexible. Yearly plans surface the stronger long-term rate.
                    Coupons simulate launch offers cleanly without scattering logic
                    through the UI.
                  </p>
                </div>

                <div className="grid gap-4 md:grid-cols-3">
                  {pricingSignals.map((signal) => (
                    <div
                      key={signal.label}
                      className="theme-panel rounded-[24px] p-5 transition-all duration-300 hover:border-[color:var(--border-accent)] hover:bg-[var(--surface)]"
                    >
                      <p className="text-xs font-medium uppercase tracking-[0.26em] text-[var(--accent-secondary)]">
                        {signal.label}
                      </p>
                      <p className="mt-3 text-lg font-semibold tracking-[-0.03em] text-[var(--text-primary)]">
                        {signal.value}
                      </p>
                      <p className="mt-2 text-sm leading-6 text-[var(--text-secondary)]">
                        {signal.detail}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <div className="theme-panel rounded-[28px] p-2">
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
                </div>

                <div className="theme-panel rounded-[28px] p-4 sm:p-5">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-xs font-medium uppercase tracking-[0.26em] text-[var(--accent-secondary)]">
                        Coupon
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

                  <div className="mt-4 flex flex-col gap-3 sm:flex-row">
                    <input
                      className={[
                        "theme-input min-h-13 rounded-full px-5 py-3 text-sm tracking-[0.08em] uppercase",
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
                      Apply Code
                    </Button>
                  </div>

                  {couponError ? (
                    <div className="mt-3 rounded-[20px] border border-[rgba(217,93,106,0.32)] bg-[rgba(217,93,106,0.08)] px-4 py-3">
                      <p className="text-sm leading-6 text-[var(--text-primary)]">
                        {couponError}
                      </p>
                    </div>
                  ) : null}
                </div>

                <div
                  className={[
                    "rounded-[28px] border p-5",
                    getBannerClasses(couponBanner.tone),
                  ].join(" ")}
                >
                  <p className="text-xs font-medium uppercase tracking-[0.26em] text-[var(--accent-secondary)]">
                    Live Summary
                  </p>
                  <h2 className="mt-3 text-2xl font-semibold tracking-[-0.04em] text-[var(--text-primary)]">
                    {couponBanner.title}
                  </h2>
                  <p className="mt-3 text-sm leading-7 text-[var(--text-secondary)]">
                    {couponBanner.detail}
                  </p>

                  <div className="mt-5 grid gap-3 sm:grid-cols-2">
                    <div className="theme-panel rounded-[20px] p-4">
                      <p className="text-xs uppercase tracking-[0.22em] text-[var(--text-muted)]">
                        Active Billing
                      </p>
                      <p className="mt-2 text-base font-semibold text-[var(--text-primary)]">
                        {billingOptions.find((option) => option.id === billingMode)?.label}
                      </p>
                    </div>

                    <div className="theme-panel rounded-[20px] p-4">
                      <p className="text-xs uppercase tracking-[0.22em] text-[var(--text-muted)]">
                        Selected Plan
                      </p>
                      <p className="mt-2 text-base font-semibold text-[var(--text-primary)]">
                        {selectedPlan.name}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Card>

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

          <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px] xl:items-start">
            <Card className="p-6 sm:p-8">
              <div className="space-y-6">
                <div className="max-w-3xl space-y-3">
                  <p className="text-xs font-medium uppercase tracking-[0.28em] text-[var(--accent-secondary)]">
                    Live Pricing Snapshot
                  </p>
                  <h2 className="text-3xl font-semibold tracking-[-0.04em] text-[var(--text-primary)] sm:text-4xl">
                    Every visible plan updates the moment billing or coupon logic changes.
                  </h2>
                  <p className="text-sm leading-7 text-[var(--text-secondary)] sm:text-base">
                    This summary mirrors the same business logic powering the cards, so
                    monthly promos and yearly savings always stay internally consistent.
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
                            : "theme-panel hover:border-[color:var(--border-accent)] hover:bg-[var(--surface)]",
                        ].join(" ")}
                      >
                        <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
                          <div className="max-w-sm">
                            <p className="text-xs font-medium uppercase tracking-[0.24em] text-[var(--accent-secondary)]">
                              {plan.name}
                            </p>
                            <p className="mt-3 text-base font-semibold text-[var(--text-primary)]">
                              {plan.audience}
                            </p>
                            <p className="mt-2 text-sm leading-7 text-[var(--text-secondary)]">
                              {snapshot.note}
                            </p>
                          </div>

                          <div className="grid flex-1 gap-4 sm:grid-cols-3">
                            <div className="theme-panel-contrast rounded-[20px] p-4">
                              <p className="text-xs uppercase tracking-[0.22em] text-[var(--text-muted)]">
                                {snapshot.todayLabel}
                              </p>
                              <p className="mt-2 text-lg font-semibold text-[var(--text-primary)]">
                                {snapshot.todayValue}
                              </p>
                            </div>

                            <div className="theme-panel-contrast rounded-[20px] p-4">
                              <p className="text-xs uppercase tracking-[0.22em] text-[var(--text-muted)]">
                                {snapshot.recurringLabel}
                              </p>
                              <p className="mt-2 text-lg font-semibold text-[var(--text-primary)]">
                                {snapshot.recurringValue}
                              </p>
                            </div>

                            <div className="theme-panel-contrast rounded-[20px] p-4">
                              <p className="text-xs uppercase tracking-[0.22em] text-[var(--text-muted)]">
                                {snapshot.yearOneLabel}
                              </p>
                              <p className="mt-2 text-lg font-semibold text-[var(--text-primary)]">
                                {snapshot.yearOneValue}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </Card>

            <Card className="p-6 sm:p-8 xl:sticky xl:top-28">
              <div className="space-y-6">
                <div className="space-y-3">
                  <p className="text-xs font-medium uppercase tracking-[0.28em] text-[var(--accent-secondary)]">
                    Selected Breakdown
                  </p>
                  <h2 className="text-3xl font-semibold tracking-[-0.04em] text-[var(--text-primary)]">
                    {selectedPlan.name}
                  </h2>
                  <p className="text-sm leading-7 text-[var(--text-secondary)]">
                    {selectedPlan.description}
                  </p>
                </div>

                <div className="theme-panel-contrast rounded-[24px] p-5">
                  <div className="flex items-end justify-between gap-4">
                    <div>
                      <p className="text-xs uppercase tracking-[0.22em] text-[var(--text-muted)]">
                        {selectedSnapshot.todayLabel}
                      </p>
                      <p className="mt-2 text-3xl font-semibold tracking-[-0.04em] text-[var(--text-primary)]">
                        {selectedSnapshot.todayValue}
                      </p>
                    </div>

                    <div className="text-right">
                      <p className="text-xs uppercase tracking-[0.22em] text-[var(--text-muted)]">
                        {selectedSnapshot.yearOneLabel}
                      </p>
                      <p className="mt-2 text-lg font-semibold text-[var(--text-primary)]">
                        {selectedSnapshot.yearOneValue}
                      </p>
                    </div>
                  </div>

                  <p className="mt-4 text-sm leading-7 text-[var(--text-secondary)]">
                    {selectedSnapshot.note}
                  </p>
                </div>

                <div className="space-y-3">
                  {selectedPlanRows.map((row) => (
                    <div key={row.label} className="theme-panel rounded-[22px] p-4">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <p className="text-xs uppercase tracking-[0.22em] text-[var(--text-muted)]">
                            {row.label}
                          </p>
                          <p className="mt-2 text-sm leading-6 text-[var(--text-secondary)]">
                            {row.detail}
                          </p>
                        </div>
                        <p className="text-right text-base font-semibold text-[var(--text-primary)]">
                          {row.value}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="theme-panel rounded-[24px] p-5">
                  <p className="text-xs font-medium uppercase tracking-[0.22em] text-[var(--text-muted)]">
                    Current billing mode
                  </p>
                  <p className="mt-2 text-lg font-semibold text-[var(--text-primary)]">
                    {billingOptions.find((option) => option.id === billingMode)?.label}
                  </p>
                  <p className="mt-2 text-sm leading-7 text-[var(--text-secondary)]">
                    {appliedCoupon
                      ? `${appliedCoupon.code} is being simulated on the frontend.`
                      : `No coupon applied. Pricing is showing the standard ${billingMode} rate.`}
                  </p>
                </div>

                <Button className="w-full" size="lg" to="/contact">
                  Talk To IOU Labs
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </Section>
    </div>
  );
}
