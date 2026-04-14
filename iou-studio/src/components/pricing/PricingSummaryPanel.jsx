import Button from "../ui/Button.jsx";
import Card from "../ui/Card.jsx";
import {
  getPlanSummaryRows,
  getSelectedPlanSummary,
} from "../../data/pricing.js";

function getChipClasses(tone) {
  if (tone === "accent") {
    return "theme-chip-strong";
  }

  if (tone === "muted") {
    return "theme-panel";
  }

  return "theme-panel";
}

export default function PricingSummaryPanel({
  billingLabel,
  couponFeedback,
  plan,
}) {
  const summary = getSelectedPlanSummary(plan);
  const rows = getPlanSummaryRows(plan);

  return (
    <Card className="p-6 sm:p-8 xl:sticky xl:top-28">
      <div className="space-y-6">
        <div className="flex flex-wrap items-center gap-2">
          <span className="theme-panel rounded-full px-3 py-1 text-[11px] font-medium uppercase tracking-[0.22em] text-[var(--accent-secondary)]">
            {billingLabel}
          </span>

          {plan.isMostPopular ? (
            <span className="theme-chip-strong rounded-full px-3 py-1 text-[11px] font-medium uppercase tracking-[0.22em]">
              Most Popular
            </span>
          ) : null}

          <span
            className={[
              "rounded-full px-3 py-1 text-[11px] font-medium uppercase tracking-[0.22em]",
              getChipClasses(couponFeedback.tone),
            ].join(" ")}
          >
            {couponFeedback.label}
          </span>
        </div>

        <div className="space-y-3">
          <p className="text-xs font-medium uppercase tracking-[0.28em] text-[var(--accent-secondary)]">
            Selected Plan
          </p>
          <h2 className="text-3xl font-semibold tracking-[-0.04em] text-[var(--text-primary)]">
            {plan.name}
          </h2>
          <p className="text-sm leading-7 text-[var(--text-secondary)]">
            {plan.description}
          </p>
        </div>

        <div className="theme-panel-contrast rounded-[24px] p-5">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.22em] text-[var(--text-muted)]">
                {summary.headlineLabel}
              </p>
              <p className="mt-2 text-3xl font-semibold tracking-[-0.04em] text-[var(--text-primary)]">
                {summary.headlineValue}
              </p>
            </div>

            <div className="sm:text-right">
              <p className="text-xs uppercase tracking-[0.22em] text-[var(--text-muted)]">
                {summary.secondaryLabel}
              </p>
              <p className="mt-2 text-xl font-semibold text-[var(--text-primary)]">
                {summary.secondaryValue}
              </p>
            </div>
          </div>

          <p className="mt-4 text-sm leading-7 text-[var(--text-secondary)]">
            {summary.note}
          </p>
        </div>

        <div className="space-y-3">
          {rows.map((row) => (
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
            Billing note
          </p>
          <p className="mt-2 text-sm font-medium text-[var(--text-primary)]">
            {plan.base.billingLine}
          </p>
          <p className="mt-2 text-sm leading-7 text-[var(--text-secondary)]">
            {summary.footer}
          </p>
        </div>

        <Button className="w-full" size="lg" to="/contact">
          {plan.ctaLabel}
        </Button>
      </div>
    </Card>
  );
}
