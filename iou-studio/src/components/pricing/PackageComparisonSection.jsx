import { getPlanSnapshot } from "../../data/pricing.js";
import Button from "../ui/Button.jsx";
import Card from "../ui/Card.jsx";
import PricingPlanCard from "./PricingPlanCard.jsx";

const planComparisonCopy = {
  starter: {
    output: "Brand foundation, responsive website, and inquiry capture.",
    setup: "Polished core web presence without extra operational layers.",
    when: "You want the fastest clean launch path for a local business.",
  },
  growth: {
    output: "Expanded website system for deeper services, campaigns, and proof.",
    setup: "Broader content structure with more room to refine the experience.",
    when: "You need more range than Starter without moving into full custom scope.",
  },
  premium: {
    output: "Custom website, ordering flow, and intake system in one starting setup.",
    setup: "Higher-touch operational scope for complex journeys and handoff needs.",
    when: "You need deeper UX, ordering, or senior-led custom delivery.",
  },
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

function getToggleClasses(isActive) {
  return [
    "flex min-h-[88px] flex-col justify-between rounded-[20px] border px-4 py-4 text-left transition-all duration-300 sm:min-h-[94px] sm:px-5 sm:py-5",
    isActive
      ? "border-[color:var(--border-accent)] bg-[linear-gradient(180deg,var(--surface-accent),var(--surface-accent-strong))] text-[var(--text-primary)] shadow-[var(--shadow-accent)]"
      : "border-[color:var(--border-subtle)] bg-[var(--surface)] text-[var(--text-secondary)] hover:border-[color:var(--border-strong)] hover:text-[var(--text-primary)]",
  ].join(" ");
}

function formatTimelineLabel(label = "") {
  return label.replace(/^Estimated delivery:\s*/i, "").trim();
}

function getPlanComparisonMeta(plan) {
  const snapshot = getPlanSnapshot(plan);
  const comparisonCopy = planComparisonCopy[plan.id] ?? {
    output: plan.packageDeliverableSummary || plan.description,
    setup: plan.description,
    when: "Use this when the included scope matches the build you already know you need.",
  };

  return {
    ...comparisonCopy,
    dueTodayLabel: snapshot.metrics[1]?.label ?? "Due today",
    dueTodayValue: snapshot.metrics[1]?.value ?? "",
    priceLabel: snapshot.metrics[0]?.label ?? "Current rate",
    priceValue: snapshot.metrics[0]?.value ?? "",
    timelineLabel: formatTimelineLabel(plan.timelineEstimate?.label),
  };
}

function ComparisonMatrixDesktop({ comparisonPlans, selectedPlanId }) {
  const rows = [
    {
      label: "Best for",
      renderValue: ({ plan }) => plan.audience,
    },
    {
      label: "Core setup",
      renderValue: ({ meta }) => meta.setup,
    },
    {
      label: "Primary output",
      renderValue: ({ meta }) => meta.output,
    },
    {
      label: "Delivery",
      renderValue: ({ meta }) => meta.timelineLabel,
    },
    {
      label: "Best when",
      renderValue: ({ meta }) => meta.when,
    },
  ];

  return (
    <div className="hidden overflow-hidden rounded-[30px] border border-[color:var(--border-subtle)] lg:block">
      <div className="grid grid-cols-[180px_repeat(3,minmax(0,1fr))]">
        <div className="bg-[var(--surface-soft)] px-5 py-5">
          <p className="type-label">Quick compare</p>
          <p className="mt-3 max-w-[14ch] text-sm leading-7 text-[var(--text-secondary)]">
            Compare the trade-offs first, then use the cards below to choose.
          </p>
        </div>

        {comparisonPlans.map(({ meta, plan }) => {
          const isSelected = selectedPlanId === plan.id;

          return (
            <div
              className={[
                "border-l border-[color:var(--border-subtle)] px-5 py-5",
                isSelected
                  ? "bg-[linear-gradient(180deg,var(--surface-accent),var(--surface-soft))]"
                  : "bg-[var(--surface)]",
              ].join(" ")}
              key={plan.id}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-lg font-semibold tracking-[-0.03em] text-[var(--text-primary)]">
                    {plan.name}
                  </p>
                  <p className="mt-1 text-sm text-[var(--text-secondary)]">
                    {plan.audience}
                  </p>
                </div>

                <div className="flex flex-wrap justify-end gap-2">
                  {plan.isMostPopular ? (
                    <span className="theme-chip-strong rounded-full px-3 py-1 text-[10px] font-medium uppercase tracking-[0.22em]">
                      Most selected
                    </span>
                  ) : null}

                  {isSelected ? (
                    <span className="theme-panel rounded-full px-3 py-1 text-[10px] font-medium uppercase tracking-[0.22em] text-[var(--accent-secondary)]">
                      Selected
                    </span>
                  ) : null}
                </div>
              </div>

              <div className="mt-5 space-y-2">
                <p className="type-label">{meta.priceLabel}</p>
                <p className="text-[2rem] font-semibold leading-none tracking-[-0.06em] text-[var(--text-primary)]">
                  {meta.priceValue}
                </p>
                <p className="text-sm leading-6 text-[var(--text-secondary)]">
                  {meta.dueTodayLabel}:{" "}
                  <span className="font-medium text-[var(--text-primary)]">
                    {meta.dueTodayValue}
                  </span>
                </p>
              </div>
            </div>
          );
        })}

        {rows.map((row) => (
          <div className="contents" key={row.label}>
            <div className="border-t border-[color:var(--border-subtle)] bg-[var(--surface-soft)] px-5 py-4">
              <p className="type-label">{row.label}</p>
            </div>

            {comparisonPlans.map((comparisonPlan) => (
              <div
                className="border-l border-t border-[color:var(--border-subtle)] bg-[var(--surface)] px-5 py-4"
                key={`${comparisonPlan.plan.id}-${row.label}`}
              >
                <p className="text-sm leading-7 text-[var(--text-secondary)]">
                  {row.renderValue(comparisonPlan)}
                </p>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

function ComparisonMatrixMobile({ comparisonPlans, selectedPlanId }) {
  const rows = [
    {
      label: "Best for",
      renderValue: ({ plan }) => plan.audience,
    },
    {
      label: "Core setup",
      renderValue: ({ meta }) => meta.setup,
    },
    {
      label: "Primary output",
      renderValue: ({ meta }) => meta.output,
    },
    {
      label: "Delivery",
      renderValue: ({ meta }) => meta.timelineLabel,
    },
  ];

  return (
    <div className="space-y-3 lg:hidden">
      {comparisonPlans.map((comparisonPlan) => {
        const { meta, plan } = comparisonPlan;
        const isSelected = selectedPlanId === plan.id;

        return (
          <article
            className={[
              "rounded-[24px] border px-4 py-4 sm:px-5",
              isSelected
                ? "border-[color:var(--border-accent)] bg-[linear-gradient(180deg,var(--surface-accent),var(--surface-soft))]"
                : "border-[color:var(--border-subtle)] bg-[var(--surface)]",
            ].join(" ")}
            key={plan.id}
          >
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="text-lg font-semibold tracking-[-0.03em] text-[var(--text-primary)]">
                  {plan.name}
                </p>
                <p className="mt-1 text-sm text-[var(--text-secondary)]">
                  {meta.priceValue}
                </p>
              </div>

              <div className="flex flex-wrap justify-end gap-2">
                {plan.isMostPopular ? (
                  <span className="theme-chip-strong rounded-full px-3 py-1 text-[10px] font-medium uppercase tracking-[0.22em]">
                    Most selected
                  </span>
                ) : null}

                {isSelected ? (
                  <span className="theme-panel rounded-full px-3 py-1 text-[10px] font-medium uppercase tracking-[0.22em] text-[var(--accent-secondary)]">
                    Selected
                  </span>
                ) : null}
              </div>
            </div>

            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {rows.map((row) => (
                <div
                  className="rounded-[18px] border border-[color:var(--border-subtle)] bg-[var(--surface-soft)] px-4 py-3"
                  key={`${plan.id}-${row.label}`}
                >
                  <p className="type-label">{row.label}</p>
                  <p className="mt-2 text-sm leading-6 text-[var(--text-secondary)]">
                    {row.renderValue(comparisonPlan)}
                  </p>
                </div>
              ))}
            </div>
          </article>
        );
      })}
    </div>
  );
}

export default function PackageComparisonSection({
  appliedCoupon,
  billingMode,
  billingOptions,
  couponError,
  couponInput,
  id,
  onBillingModeChange,
  onCouponApply,
  onCouponChange,
  onCouponClear,
  onSelectPlan,
  packageStatusLabel,
  packageStatusNotice,
  plans,
  selectedPlanId,
}) {
  const comparisonPlans = plans.map((plan) => ({
    meta: getPlanComparisonMeta(plan),
    plan,
  }));
  const selectedPlan =
    plans.find((plan) => plan.id === selectedPlanId) ?? comparisonPlans[0]?.plan;

  return (
    <div className="space-y-6 sm:space-y-7" id={id}>
      <Card className="p-6 sm:p-7 xl:p-8">
        <div className="grid gap-7 xl:grid-cols-[minmax(0,1fr)_minmax(320px,0.86fr)] xl:items-start">
          <div className="max-w-3xl space-y-4">
            <p className="type-kicker">Compare Packages</p>
            <h2 className="type-section-title max-w-[12ch]">
              Compare billing and setup choices without re-reading every card.
            </h2>
            <p className="max-w-[56ch] text-base leading-8 text-[var(--text-secondary)]">
              Billing and coupon changes update the comparison view and the
              package cards together. Scan the trade-offs once, then select the
              setup that matches your current scope.
            </p>
          </div>

          <div className="theme-panel rounded-[28px] border border-[color:var(--border-subtle)] p-5 sm:p-6">
            <div className="space-y-5">
              <div className="space-y-3">
                <p className="type-label">Billing</p>
                <div className="grid grid-cols-2 gap-3">
                  {billingOptions.map((option) => (
                    <button
                      key={option.id}
                      aria-pressed={billingMode === option.id}
                      className={getToggleClasses(billingMode === option.id)}
                      onClick={() => onBillingModeChange(option.id)}
                      type="button"
                    >
                      <span className="block text-[0.95rem] font-semibold tracking-[0.01em]">
                        {option.label}
                      </span>
                      <span className="mt-2 block text-sm leading-6 opacity-80">
                        {option.note}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="border-t border-[color:var(--border-subtle)] pt-5">
                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-2">
                    <p className="type-label">Coupon</p>
                    <p className="text-sm leading-6 text-[var(--text-secondary)]">
                      Preview{" "}
                      <span className="font-medium text-[var(--text-primary)]">
                        FIRST3
                      </span>{" "}
                      or{" "}
                      <span className="font-medium text-[var(--text-primary)]">
                        TRYONCE
                      </span>
                      .
                    </p>
                  </div>

                  {appliedCoupon ? (
                    <button
                      className="text-sm font-medium text-[var(--accent-secondary)] transition-colors duration-300 hover:text-[var(--text-primary)]"
                      onClick={onCouponClear}
                      type="button"
                    >
                      Clear
                    </button>
                  ) : null}
                </div>

                <div className="mt-4 flex flex-col gap-3 sm:flex-row">
                  <input
                    className={[
                      "theme-input min-h-[54px] flex-1 rounded-full px-5 py-3 text-sm tracking-[0.08em] uppercase",
                      couponError
                        ? "border-[rgba(217,93,106,0.38)] bg-[rgba(217,93,106,0.08)]"
                        : "",
                    ]
                      .filter(Boolean)
                      .join(" ")}
                    onChange={onCouponChange}
                    placeholder="Enter coupon code"
                    value={couponInput}
                  />

                  <Button
                    className="sm:min-w-[132px]"
                    onClick={onCouponApply}
                    size="lg"
                  >
                    Apply
                  </Button>
                </div>

                {couponError ? (
                  <div className="mt-4 rounded-[20px] border border-[rgba(217,93,106,0.32)] bg-[rgba(217,93,106,0.08)] px-4 py-3">
                    <p className="text-sm leading-6 text-[var(--text-primary)]">
                      {couponError}
                    </p>
                  </div>
                ) : null}
              </div>

              <div
                className={[
                  "rounded-[24px] border p-5",
                  getSurfaceClasses(packageStatusNotice.tone),
                ].join(" ")}
              >
                <p className="type-kicker">{packageStatusLabel}</p>
                <p className="mt-2 text-base font-semibold text-[var(--text-primary)]">
                  {packageStatusNotice.title}
                </p>
                <p className="mt-2 text-sm leading-6 text-[var(--text-secondary)]">
                  {packageStatusNotice.detail}
                </p>
              </div>
            </div>
          </div>
        </div>
      </Card>

      <div className="theme-panel rounded-[34px] border border-[color:var(--border-subtle)] px-4 py-4 sm:px-5 sm:py-5 lg:px-6 lg:py-6">
        <div className="space-y-5">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl space-y-3">
              <p className="type-label">Decision support</p>
              <h3 className="type-card-title max-w-[16ch]">
                Compare the key differences in one pass.
              </h3>
              <p className="max-w-[56ch] text-sm leading-7 text-[var(--text-secondary)] sm:text-base sm:leading-8">
                Rates stay visible, but the comparison focuses on where each
                setup fits, what it produces, and how much system depth it adds.
              </p>
            </div>

            {selectedPlan ? (
              <div className="rounded-[22px] border border-[color:var(--border-subtle)] bg-[var(--surface)] px-4 py-3 sm:min-w-[14rem]">
                <p className="type-label">Current package</p>
                <p className="mt-2 text-base font-semibold text-[var(--text-primary)]">
                  {selectedPlan.name}
                </p>
                <p className="mt-1 text-sm text-[var(--text-secondary)]">
                  Active in the live summary and ready for review.
                </p>
              </div>
            ) : null}
          </div>

          <ComparisonMatrixMobile
            comparisonPlans={comparisonPlans}
            selectedPlanId={selectedPlanId}
          />
          <ComparisonMatrixDesktop
            comparisonPlans={comparisonPlans}
            selectedPlanId={selectedPlanId}
          />
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl space-y-3">
            <p className="type-label">Select package</p>
            <h3 className="type-card-title max-w-[16ch]">
              Choose the setup that already feels closest to the build.
            </h3>
            <p className="max-w-[56ch] text-sm leading-7 text-[var(--text-secondary)] sm:text-base sm:leading-8">
              The cards below are now for final selection, not for repeating
              the entire comparison again.
            </p>
          </div>
        </div>

        <div className="grid gap-5 xl:grid-cols-3">
          {plans.map((plan) => (
            <PricingPlanCard
              isSelected={selectedPlanId === plan.id}
              key={plan.id}
              onSelect={onSelectPlan}
              plan={plan}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
