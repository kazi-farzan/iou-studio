import Button from "../ui/Button.jsx";
import Card from "../ui/Card.jsx";
import { formatInr } from "../../data/pricing.js";

function getCardClasses({ isMostPopular, isSelected }) {
  return [
    "group relative h-full overflow-hidden p-6 sm:p-8",
    isSelected
      ? "border-[color:var(--border-accent)] bg-[linear-gradient(180deg,var(--surface),var(--surface-soft))] shadow-[var(--shadow-soft)]"
      : "",
    isMostPopular && !isSelected
      ? "border-[color:var(--border-strong)] bg-[linear-gradient(180deg,var(--surface),var(--surface-soft))]"
      : "",
  ]
    .filter(Boolean)
    .join(" ");
}

function getCalloutClasses(tone) {
  if (tone === "accent") {
    return "border-[color:var(--border-accent)] bg-[var(--surface-accent)]";
  }

  if (tone === "muted") {
    return "border-[color:var(--border-subtle)] bg-[var(--surface-contrast)]";
  }

  return "border-[color:var(--border-subtle)] bg-[var(--surface-contrast)]";
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
      {isSelected ? (
        <div
          aria-hidden="true"
          className="theme-ambient-orb-2 pointer-events-none absolute right-[-2.5rem] top-[-3rem] h-28 w-28 rounded-full blur-2xl"
        />
      ) : null}

      <div className="relative flex h-full flex-col">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="space-y-3">
            <p className="text-xs font-medium uppercase tracking-[0.24em] text-[var(--text-muted)]">
              {plan.audience}
            </p>
            <h2 className="text-3xl font-semibold tracking-[-0.04em] text-[var(--text-primary)]">
              {plan.name}
            </h2>
          </div>

          <div className="flex flex-wrap items-center gap-2 self-start">
            {plan.isMostPopular ? (
              <span className="theme-chip-strong rounded-full px-3 py-1 text-[11px] font-medium uppercase tracking-[0.22em]">
                Most Selected
              </span>
            ) : null}

            {isSelected ? (
              <span className="theme-panel rounded-full px-3 py-1 text-[11px] font-medium uppercase tracking-[0.22em] text-[var(--accent-secondary)]">
                Active
              </span>
            ) : null}
          </div>
        </div>

        <p className="mt-5 text-sm leading-7 text-[var(--text-secondary)] sm:text-base">
          {plan.description}
        </p>

        <p className="mt-3 text-xs leading-6 text-[var(--text-muted)]">
          This is a starting configuration. You can customize this setup later.
        </p>

        <div className="mt-7 rounded-[24px] border border-[color:var(--border-subtle)] bg-[var(--surface-contrast)] p-5">
          <p className="text-xs font-medium uppercase tracking-[0.22em] text-[var(--text-muted)]">
            Starting configuration
          </p>

          <div className="flex items-end gap-2">
            <span className="text-4xl font-semibold tracking-[-0.05em] text-[var(--text-primary)] sm:text-5xl">
              {formatInr(plan.base.headlinePrice)}
            </span>
            <span className="pb-1 text-sm font-medium tracking-[0.01em] text-[var(--text-muted)]">
              {plan.base.headlineSuffix}
            </span>
          </div>

          <p className="mt-3 text-sm font-medium text-[var(--text-primary)]">
            {plan.base.billingLine}
          </p>
          <p className="mt-2 text-sm leading-6 text-[var(--text-secondary)]">
            {plan.base.supportLine}
          </p>
        </div>

        <div
          className={[
            "mt-5 rounded-[22px] border p-4",
            getCalloutClasses(plan.callout.tone),
          ].join(" ")}
        >
          <p className="text-[11px] font-medium uppercase tracking-[0.24em] text-[var(--accent-secondary)]">
            {plan.callout.eyebrow}
          </p>
          <p className="mt-2 text-base font-semibold text-[var(--text-primary)]">
            {plan.callout.title}
          </p>
          <p className="mt-1 text-sm leading-6 text-[var(--text-secondary)]">
            {plan.callout.detail}
          </p>
        </div>

        <div className="mt-7 space-y-3 border-t border-[color:var(--border-subtle)] pt-6">
          {plan.features.map((feature) => (
            <div key={feature} className="flex items-start gap-3">
              <span className="theme-dot mt-2 h-2 w-2 shrink-0 rounded-full" />
              <p className="text-sm leading-7 text-[var(--text-secondary)]">{feature}</p>
            </div>
          ))}
        </div>

        {plan.coupon ? (
          <div
            className={[
              "mt-6 rounded-[22px] border p-4",
              getCalloutClasses(plan.coupon.tone),
            ].join(" ")}
          >
            <p className="text-[11px] font-medium uppercase tracking-[0.24em] text-[var(--accent-secondary)]">
              {plan.coupon.badgeLabel}
            </p>

            <p className="mt-2 text-sm font-medium text-[var(--text-primary)]">
              {plan.coupon.title}
            </p>

            <p className="mt-1 text-sm leading-6 text-[var(--text-secondary)]">
              {plan.coupon.note}
            </p>
          </div>
        ) : null}

        <div className="mt-auto pt-8">
          <Button
            className="w-full"
            onClick={() => onSelect(plan.id)}
            size="lg"
            variant={isSelected ? "primary" : "secondary"}
          >
            {isSelected ? "Customize This Setup" : "Start with this"}
          </Button>

          <p className="mt-3 text-sm leading-6 text-[var(--text-secondary)]">
            {isSelected
              ? "This configuration is active below and can still be refined."
              : "Use this as a base setup, then adjust the details as needed."}
          </p>
        </div>
      </div>
    </Card>
  );
}
