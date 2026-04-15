import { formatInr } from "../../data/pricing.js";

function getModuleClasses(isSelected) {
  return [
    "group relative overflow-hidden rounded-[24px] border p-5 transition-[background-color,border-color,box-shadow,transform] duration-200 ease-out motion-reduce:transition-none",
    isSelected
      ? "border-[color:var(--border-accent)] bg-[var(--surface-accent)] shadow-[var(--shadow-soft)]"
      : "border-[color:var(--border-subtle)] bg-[var(--surface-muted)] hover:-translate-y-0.5 hover:border-[color:var(--border-accent)] hover:bg-[var(--surface)] hover:shadow-[var(--shadow-soft)] motion-reduce:hover:translate-y-0",
  ].join(" ");
}

function getStatusClasses(isSelected) {
  return [
    "inline-flex items-center gap-2 rounded-full border px-3 py-1 text-[11px] font-medium uppercase tracking-[0.22em] transition-[background-color,border-color,color,box-shadow] duration-200 ease-out motion-reduce:transition-none",
    isSelected
      ? "border-[color:var(--border-accent)] bg-[var(--surface-accent-strong)] text-[var(--accent-contrast-text)]"
      : "border-[color:var(--border-subtle)] bg-[var(--surface-soft)] text-[var(--text-muted)]",
  ].join(" ");
}

function getIndicatorClasses(isSelected) {
  return [
    "flex h-4 w-4 items-center justify-center rounded-full border transition-[background-color,border-color,transform] duration-200 ease-out motion-reduce:transition-none",
    isSelected
      ? "border-[color:var(--border-accent)] bg-[var(--accent-secondary)]"
      : "border-[color:var(--border-subtle)] bg-transparent",
  ].join(" ");
}

function getActionClasses(isSelected) {
  return [
    "rounded-full border px-4 py-2 text-sm font-medium tracking-[0.01em] transition-[background-color,border-color,color,transform,box-shadow] duration-200 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--accent-ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--background)] active:translate-y-px active:scale-[0.99] motion-reduce:transition-none",
    isSelected
      ? "border-[color:var(--border-accent)] bg-[var(--surface-accent-strong)] text-[var(--accent-contrast-text)] hover:bg-[var(--surface-accent)]"
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
      <div
        aria-hidden="true"
        className={[
          "pointer-events-none absolute inset-0 rounded-[inherit] transition-opacity duration-200 ease-out motion-reduce:transition-none",
          isSelected
            ? "bg-[linear-gradient(180deg,var(--surface-accent-strong),transparent_58%)] opacity-100"
            : "bg-[linear-gradient(180deg,var(--surface),transparent_52%)] opacity-0 group-hover:opacity-100",
        ].join(" ")}
      />

      <div className="relative flex h-full flex-col">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="text-xs font-medium uppercase tracking-[0.24em] text-[var(--accent-secondary)]">
            Module
          </p>

          <span className={getStatusClasses(isSelected)}>
            <span className={getIndicatorClasses(isSelected)}>
              <svg
                aria-hidden="true"
                className={[
                  "h-2.5 w-2.5 text-[var(--accent-solid-text)] transition-[opacity,transform] duration-200 ease-out motion-reduce:transition-none",
                  isSelected ? "scale-100 opacity-100" : "scale-75 opacity-0",
                ].join(" ")}
                fill="none"
                viewBox="0 0 12 12"
              >
                <path
                  d="M2.5 6.4L4.9 8.8L9.5 3.8"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="1.4"
                />
              </svg>
            </span>
            <span>{isSelected ? "Added" : "Available"}</span>
          </span>
        </div>

        <div className="mt-4 space-y-3">
          <h3 className="text-xl font-semibold tracking-[-0.03em] text-[var(--text-primary)] transition-colors duration-200 ease-out motion-reduce:transition-none">
            {module.title}
          </h3>
          <p className="text-sm leading-6 text-[var(--text-secondary)] transition-colors duration-200 ease-out motion-reduce:transition-none">
            {module.description}
          </p>
        </div>

        <div className="mt-6 flex items-end justify-between gap-4 border-t border-[color:var(--border-subtle)] pt-5 transition-colors duration-200 ease-out motion-reduce:transition-none">
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
    </div>
  );
}
