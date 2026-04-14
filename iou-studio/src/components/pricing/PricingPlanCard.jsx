import Button from "../ui/Button.jsx";
import Card from "../ui/Card.jsx";
import { formatInr } from "../../data/pricing.js";

function getCardClasses({ isMostPopular, isSelected }) {
  return [
    "group relative h-full overflow-hidden p-7 sm:p-8",
    isMostPopular || isSelected
      ? "border-[color:var(--border-accent)] bg-[linear-gradient(180deg,var(--surface),var(--surface-accent))] shadow-[var(--shadow-accent)]"
      : "",
  ]
    .filter(Boolean)
    .join(" ");
}

function getCouponClasses(status) {
  if (status === "active") {
    return "theme-panel-contrast border-[color:var(--border-accent)] bg-[var(--surface-accent)]";
  }

  return "theme-panel";
}

export default function PricingPlanCard({
  isSelected = false,
  onSelect,
  plan,
}) {
  const cardClasses = getCardClasses({
    isMostPopular: plan.isMostPopular,
    isSelected,
  });

  return (
    <Card className={cardClasses} interactive>
      <div
        aria-hidden="true"
        className="theme-ambient-orb-2 pointer-events-none absolute right-[-2.5rem] top-[-3rem] h-28 w-28 rounded-full blur-2xl"
      />

      <div className="relative flex h-full flex-col">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="text-xs font-medium uppercase tracking-[0.26em] text-[var(--text-muted)]">
            {plan.audience}
          </p>

          <div className="flex flex-wrap items-center gap-2">
            {plan.isMostPopular ? (
              <span className="theme-chip-strong rounded-full px-3 py-1 text-[11px] font-medium uppercase tracking-[0.22em]">
                Most Popular
              </span>
            ) : null}

            {isSelected ? (
              <span className="theme-panel rounded-full px-3 py-1 text-[11px] font-medium uppercase tracking-[0.22em] text-[var(--accent-secondary)]">
                Breakdown Active
              </span>
            ) : null}
          </div>
        </div>

        <div className="mt-6 space-y-3">
          <h2 className="text-3xl font-semibold tracking-[-0.04em] text-[var(--text-primary)]">
            {plan.name}
          </h2>
          <p className="text-sm leading-7 text-[var(--text-secondary)] sm:text-base">
            {plan.description}
          </p>
        </div>

        <div className="mt-8 rounded-[24px] border border-[color:var(--border-subtle)] bg-[var(--surface-contrast)] p-5">
          <div className="flex items-end gap-2">
            <span className="text-4xl font-semibold tracking-[-0.05em] text-[var(--text-primary)] sm:text-5xl">
              {formatInr(plan.base.headlinePrice)}
            </span>
            <span className="pb-1 text-sm font-medium uppercase tracking-[0.18em] text-[var(--text-muted)]">
              {plan.base.headlineSuffix}
            </span>
          </div>

          <p className="mt-3 text-sm font-medium text-[var(--text-primary)]">
            {plan.base.billingLabel}
          </p>
          <p className="mt-2 text-sm leading-6 text-[var(--text-secondary)]">
            {plan.base.supportingLabel}
          </p>
        </div>

        {plan.coupon ? (
          <div
            className={[
              "mt-6 rounded-[24px] border p-5",
              getCouponClasses(plan.coupon.status),
            ].join(" ")}
          >
            <p className="text-xs font-medium uppercase tracking-[0.26em] text-[var(--accent-secondary)]">
              {plan.coupon.code}
            </p>

            <p className="mt-3 text-lg font-semibold tracking-[-0.03em] text-[var(--text-primary)]">
              {plan.coupon.status === "active"
                ? plan.coupon.primaryLine
                : "Coupon saved for monthly billing"}
            </p>

            <p className="mt-2 text-sm leading-6 text-[var(--text-secondary)]">
              {plan.coupon.status === "active"
                ? plan.coupon.secondaryLine
                : plan.coupon.note}
            </p>
          </div>
        ) : null}

        <div className="mt-8 space-y-3">
          {plan.features.map((feature) => (
            <div key={feature} className="flex items-start gap-3">
              <span className="theme-dot mt-2 h-2.5 w-2.5 shrink-0 rounded-full" />
              <p className="text-sm leading-7 text-[var(--text-secondary)]">{feature}</p>
            </div>
          ))}
        </div>

        <div className="mt-auto pt-8">
          <Button
            className="w-full"
            size="lg"
            to="/contact"
            variant={plan.isMostPopular || isSelected ? "primary" : "secondary"}
          >
            {plan.ctaLabel}
          </Button>

          <button
            className="mt-4 w-full text-sm font-medium text-[var(--accent-secondary)] transition-colors duration-300 hover:text-[var(--text-primary)]"
            onClick={() => onSelect(plan.id)}
            type="button"
          >
            {isSelected ? "Viewing live breakdown below" : "View pricing breakdown"}
          </button>
        </div>
      </div>
    </Card>
  );
}
