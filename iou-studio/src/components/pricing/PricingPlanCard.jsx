import Button from "../ui/Button.jsx";
import Card from "../ui/Card.jsx";
import PlanStatusBadges from "./PlanStatusBadges.jsx";
import {
  getMetricValues,
  getScopeHighlights,
} from "./packagePlanContent.js";

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

function getDetailToggleClasses(isActive) {
  return [
    "inline-flex items-center gap-2 rounded-full border px-3 py-2 text-sm font-medium transition-[background-color,border-color,color] duration-200",
    isActive
      ? "border-[color:var(--border-accent)] bg-[var(--surface-accent)] text-[var(--text-primary)]"
      : "border-[color:var(--border-subtle)] bg-[var(--surface)] text-[var(--text-secondary)] hover:border-[color:var(--border-strong)] hover:text-[var(--text-primary)]",
  ].join(" ");
}

function MetricPanel({ className = "", label, value }) {
  if (!label || !value) {
    return null;
  }

  return (
    <div
      className={[
        "flex min-h-[5.75rem] min-w-0 flex-col justify-between rounded-[22px] border border-[color:var(--border-subtle)] bg-[var(--surface-contrast)] px-4 py-4",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <p className="type-label">{label}</p>
      <p className="mt-3 min-w-0 text-base font-semibold tracking-[-0.04em] text-[var(--text-primary)] sm:text-[1.15rem]">
        {value}
      </p>
    </div>
  );
}

function ScopeHighlightList({ items = [] }) {
  if (!items.length) {
    return null;
  }

  return (
    <div className="mt-5 space-y-3">
      <p className="type-label">Scope highlights</p>

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
  isDetailActive = false,
  isSelected = false,
  onSelect,
  onShowDetails,
  plan,
}) {
  const cardClasses = getCardClasses({
    isMostPopular: plan.isMostPopular,
    isSelected,
  });
  const metricValues = getMetricValues(plan);
  const scopeHighlights = getScopeHighlights(plan);

  return (
    <Card className={cardClasses} interactive>
      <div className="flex h-full min-w-0 flex-col">
        <div className="grid grid-cols-[minmax(0,1fr)_7.5rem] items-start gap-x-4 gap-y-3 sm:grid-cols-[minmax(0,1fr)_8rem]">
          <div className="min-w-0 space-y-2">
            <p className="type-label">{plan.audience}</p>
            <h2 className="type-card-title">{plan.name}</h2>
          </div>

          <PlanStatusBadges
            className="min-w-0"
            isMostPopular={plan.isMostPopular}
            isSelected={isSelected}
          />
        </div>

        <p className="mt-4 text-sm leading-7 text-[var(--text-secondary)]">
          {plan.description}
        </p>

        <div className="mt-5 grid grid-cols-2 gap-3">
          <MetricPanel label="Current rate" value={metricValues.currentRate} />
          <MetricPanel label="Due today" value={metricValues.dueToday} />
          <MetricPanel
            className="col-span-2"
            label="Delivery"
            value={metricValues.delivery}
          />
        </div>

        <IncludedModules modules={plan.includedModules} />
        <ScopeHighlightList items={scopeHighlights} />

        <div className="mt-6 border-t border-[color:var(--border-subtle)] pt-5">
          <button
            aria-pressed={isDetailActive}
            className={getDetailToggleClasses(isDetailActive)}
            onClick={() => onShowDetails(plan.id)}
            type="button"
          >
            <span>{isDetailActive ? "Showing details" : "View package detail"}</span>
            <svg
              aria-hidden="true"
              className={[
                "h-4 w-4 transition-transform duration-200",
                isDetailActive ? "rotate-180" : "rotate-0",
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
