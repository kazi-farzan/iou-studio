import { useState } from "react";
import { getPlanSnapshot } from "../../data/pricing.js";
import Button from "../ui/Button.jsx";
import Card from "../ui/Card.jsx";
import DeliverableList from "./DeliverableList.jsx";

function getCardClasses({ isMostPopular, isSelected }) {
  return [
    "h-full overflow-hidden p-5 sm:p-6 xl:p-7",
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

function formatTimelineLabel(label = "") {
  return label.replace(/^Estimated delivery:\s*/i, "").trim();
}

function getUniqueItems(items = []) {
  return [...new Set(items.filter(Boolean))];
}

function getScopeHighlights(plan) {
  const packageDeliverables = (plan.packageDeliverableSections ?? []).flatMap(
    (section) => section.items ?? [],
  );

  return getUniqueItems([
    ...packageDeliverables,
    ...(plan.features ?? []),
  ]).slice(0, 3);
}

function getAdditionalCoverage(plan, scopeHighlights) {
  return (plan.features ?? []).filter(
    (feature) => !scopeHighlights.includes(feature),
  );
}

function getDetailToggleClasses(isOpen) {
  return [
    "inline-flex items-center gap-2 rounded-full border px-3 py-2 text-sm font-medium transition-[background-color,border-color,color] duration-200",
    isOpen
      ? "border-[color:var(--border-accent)] bg-[var(--surface-accent)] text-[var(--text-primary)]"
      : "border-[color:var(--border-subtle)] bg-[var(--surface)] text-[var(--text-secondary)] hover:border-[color:var(--border-strong)] hover:text-[var(--text-primary)]",
  ].join(" ");
}

function StatPanel({ label, value }) {
  if (!label || !value) {
    return null;
  }

  return (
    <div className="rounded-[22px] border border-[color:var(--border-subtle)] bg-[var(--surface-contrast)] px-4 py-4">
      <p className="type-label">{label}</p>
      <p className="mt-2 text-lg font-semibold tracking-[-0.03em] text-[var(--text-primary)] sm:text-xl">
        {value}
      </p>
    </div>
  );
}

function DetailList({ items = [], label }) {
  if (!items.length) {
    return null;
  }

  return (
    <div className="space-y-3">
      <p className="type-label">{label}</p>
      <ul className="space-y-2.5">
        {items.map((item) => (
          <li className="flex items-start gap-3" key={item}>
            <span className="theme-dot mt-2 h-1.5 w-1.5 shrink-0 rounded-full" />
            <span className="text-sm leading-6 text-[var(--text-secondary)]">
              {item}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function IncludedModules({ modules = [] }) {
  if (!modules.length) {
    return null;
  }

  return (
    <div className="mt-5 space-y-3">
      <p className="type-label">Included modules</p>
      <div className="flex flex-wrap gap-2">
        {modules.map((module) => (
          <span
            className="rounded-full border border-[color:var(--border-subtle)] bg-[var(--surface)] px-3 py-1.5 text-[10px] font-medium uppercase tracking-[0.18em] text-[var(--text-secondary)]"
            key={module.id}
          >
            {module.title}
          </span>
        ))}
      </div>
    </div>
  );
}

export default function PricingPlanCard({
  isSelected = false,
  onSelect,
  plan,
}) {
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const cardClasses = getCardClasses({
    isMostPopular: plan.isMostPopular,
    isSelected,
  });
  const snapshot = getPlanSnapshot(plan);
  const primaryMetric = snapshot.metrics[0];
  const secondaryMetric = snapshot.metrics[1];
  const timelineLabel = formatTimelineLabel(plan.timelineEstimate?.label);
  const scopeHighlights = getScopeHighlights(plan);
  const additionalCoverage = getAdditionalCoverage(plan, scopeHighlights);

  return (
    <Card className={cardClasses} interactive>
      <div className="flex h-full min-w-0 flex-col">
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-2">
            <p className="type-label">{plan.audience}</p>
            <h2 className="type-card-title">{plan.name}</h2>
          </div>

          <div className="flex flex-wrap items-center justify-end gap-2">
            {plan.isMostPopular ? (
              <span className="theme-chip-strong rounded-full px-3 py-1 text-[11px] font-medium uppercase tracking-[0.22em]">
                Most selected
              </span>
            ) : null}

            {isSelected ? (
              <span className="theme-panel rounded-full px-3 py-1 text-[11px] font-medium uppercase tracking-[0.22em] text-[var(--accent-secondary)]">
                Selected
              </span>
            ) : null}
          </div>
        </div>

        <p className="mt-4 text-sm leading-7 text-[var(--text-secondary)]">
          {plan.description}
        </p>

        <div className="mt-5 grid gap-3 sm:grid-cols-3">
          <StatPanel label={primaryMetric?.label} value={primaryMetric?.value} />
          <StatPanel
            label={secondaryMetric?.label}
            value={secondaryMetric?.value}
          />
          <StatPanel label="Delivery" value={timelineLabel} />
        </div>

        <IncludedModules modules={plan.includedModules} />

        <div className="mt-5 space-y-3">
          <p className="type-label">Scope highlights</p>

          <ul className="space-y-2.5">
            {scopeHighlights.map((item) => (
              <li className="flex items-start gap-3" key={item}>
                <span className="theme-dot mt-2 h-1.5 w-1.5 shrink-0 rounded-full" />
                <span className="text-sm leading-6 text-[var(--text-secondary)]">
                  {item}
                </span>
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-6 border-t border-[color:var(--border-subtle)] pt-5">
          <button
            aria-expanded={isDetailsOpen}
            className={getDetailToggleClasses(isDetailsOpen)}
            onClick={() => setIsDetailsOpen((current) => !current)}
            type="button"
          >
            <span>{isDetailsOpen ? "Hide package detail" : "View package detail"}</span>
            <svg
              aria-hidden="true"
              className={[
                "h-4 w-4 transition-transform duration-200",
                isDetailsOpen ? "rotate-180" : "rotate-0",
              ].join(" ")}
              fill="none"
              viewBox="0 0 20 20"
            >
              <path
                d="M5 7.5L10 12.5L15 7.5"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1.6"
              />
            </svg>
          </button>

          {isDetailsOpen ? (
            <div className="mt-5 space-y-5">
              <p className="text-sm leading-6 text-[var(--text-secondary)]">
                {snapshot.note}
              </p>

              <DeliverableList
                compact
                label="Package outputs"
                maxItemsPerSection={2}
                sections={plan.packageDeliverableSections}
                surface="contrast"
              />

              <DetailList
                items={additionalCoverage}
                label="Additional coverage"
              />
            </div>
          ) : null}
        </div>

        <div className="mt-auto pt-6">
          <Button
            className="w-full"
            onClick={() => onSelect(plan.id)}
            size="lg"
            variant={isSelected ? "primary" : "secondary"}
          >
            {isSelected ? "Selected package" : plan.ctaLabel || "Select package"}
          </Button>

          <p className="mt-3 text-sm leading-6 text-[var(--text-secondary)]">
            {isSelected
              ? "This package is active in the live summary and can still be refined before review."
              : "Use this as the starting point, then continue into review with the same scope kept in sync."}
          </p>
        </div>
      </div>
    </Card>
  );
}
