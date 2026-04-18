import { getPlanSnapshot } from "../../data/pricing.js";
import Card from "../ui/Card.jsx";
import DeliverableList from "./DeliverableList.jsx";
import {
  getAdditionalCoverage,
  getScopeHighlights,
} from "./packagePlanContent.js";

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
    <div className="space-y-3">
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

export default function PackageDetailPanel({
  isSelected = false,
  plan,
}) {
  if (!plan) {
    return null;
  }

  const snapshot = getPlanSnapshot(plan);
  const scopeHighlights = getScopeHighlights(plan);
  const additionalCoverage = getAdditionalCoverage(plan, scopeHighlights);

  return (
    <Card className="overflow-hidden p-0">
      <div className="px-6 py-6 sm:px-7 sm:py-7 xl:px-8 xl:py-8">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
          <div className="max-w-3xl space-y-3">
            <p className="type-label">Package detail</p>
            <h3 className="type-card-title">{plan.name}</h3>
            <p className="text-sm font-medium text-[var(--text-secondary)]">
              {plan.audience}
            </p>
            <p className="max-w-[62ch] text-sm leading-7 text-[var(--text-secondary)] sm:text-base sm:leading-8">
              {plan.description}
            </p>
          </div>

          <div className="rounded-[24px] border border-[color:var(--border-subtle)] bg-[var(--surface-contrast)] px-5 py-4 sm:min-w-[18rem]">
            <p className="type-label">Detail state</p>
            <p className="mt-2 text-base font-semibold text-[var(--text-primary)]">
              {isSelected ? "Selected package" : "Previewing package detail"}
            </p>
            <p className="mt-2 text-sm leading-6 text-[var(--text-secondary)]">
              {isSelected
                ? "This package is active in the live summary and the detail surface below."
                : "You are reviewing this package without changing the currently selected setup."}
            </p>
          </div>
        </div>
      </div>

      <div className="border-t border-[color:var(--border-subtle)] px-6 py-6 sm:px-7 sm:py-7 xl:px-8 xl:py-8">
        <div className="grid gap-6 xl:grid-cols-[minmax(0,1.04fr)_minmax(0,0.96fr)]">
          <div className="space-y-5">
            <div className="space-y-3">
              <p className="type-label">Scope explanation</p>
              <p className="text-sm leading-6 text-[var(--text-secondary)]">
                {snapshot.note}
              </p>
            </div>

            <DeliverableList
              className="space-y-0"
              label="Package outputs"
              sections={plan.packageDeliverableSections}
              surface="plain"
            />
          </div>

          <div className="space-y-5 border-t border-[color:var(--border-subtle)] pt-5 xl:border-l xl:border-t-0 xl:pl-6 xl:pt-0">
            <DetailList
              items={scopeHighlights}
              label="Scope highlights"
            />
            <IncludedModules modules={plan.includedModules} />
            <DetailList
              items={additionalCoverage}
              label="Additional coverage"
            />
          </div>
        </div>
      </div>
    </Card>
  );
}
