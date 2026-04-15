import { formatInr } from "../../data/pricing.js";

function getModuleClasses(isSelected) {
  return [
    "rounded-[24px] border p-5 transition-all duration-300",
    isSelected
      ? "border-[color:var(--border-accent)] bg-[var(--surface-accent)] shadow-[var(--shadow-soft)]"
      : "border-[color:var(--border-subtle)] bg-[var(--surface-muted)] hover:border-[color:var(--border-accent)] hover:bg-[var(--surface)] hover:shadow-[var(--shadow-soft)]",
  ].join(" ");
}

function getActionClasses(isSelected) {
  return [
    "rounded-full border px-4 py-2 text-sm font-medium tracking-[0.01em] transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--accent-ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--background)]",
    isSelected
      ? "border-[color:var(--border-accent)] bg-[var(--surface-accent)] text-[var(--accent-contrast-text)]"
      : "border-[color:var(--border-subtle)] bg-[var(--surface-soft)] text-[var(--text-primary)] hover:border-[color:var(--border-accent)] hover:bg-[var(--surface)]",
  ].join(" ");
}

export default function CustomBuildModuleCard({
  isSelected = false,
  module,
  onToggle,
}) {
  return (
    <div className={getModuleClasses(isSelected)}>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-xs font-medium uppercase tracking-[0.24em] text-[var(--accent-secondary)]">
          Module
        </p>

        {isSelected ? (
          <span className="theme-chip rounded-full px-3 py-1 text-[11px] font-medium uppercase tracking-[0.22em]">
            Added
          </span>
        ) : null}
      </div>

      <div className="mt-4 space-y-3">
        <h3 className="text-xl font-semibold tracking-[-0.03em] text-[var(--text-primary)]">
          {module.title}
        </h3>
        <p className="text-sm leading-6 text-[var(--text-secondary)]">
          {module.description}
        </p>
      </div>

      <div className="mt-6 flex items-end justify-between gap-4 border-t border-[color:var(--border-subtle)] pt-5">
        <div>
          <p className="text-xs uppercase tracking-[0.22em] text-[var(--text-muted)]">
            Base price
          </p>
          <p className="mt-2 text-base font-semibold text-[var(--text-primary)]">
            {formatInr(module.basePrice)}
          </p>
        </div>

        <button
          aria-pressed={isSelected}
          className={getActionClasses(isSelected)}
          onClick={() => onToggle(module.id)}
          type="button"
        >
          {isSelected ? "Remove" : "Add"}
        </button>
      </div>
    </div>
  );
}
