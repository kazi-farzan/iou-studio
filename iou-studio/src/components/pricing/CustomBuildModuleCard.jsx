import { formatInr } from "../../data/pricing.js";

function formatTimelineHint(timelineDays) {
  if (!timelineDays?.minimum || !timelineDays?.maximum) {
    return "";
  }

  if (timelineDays.minimum === timelineDays.maximum) {
    return `${timelineDays.minimum} day${
      timelineDays.minimum === 1 ? "" : "s"
    }`;
  }

  return `${timelineDays.minimum}-${timelineDays.maximum} days`;
}

function getModuleClasses(isSelected) {
  return [
    "group relative flex h-full cursor-pointer touch-manipulation flex-col overflow-hidden rounded-[26px] border px-5 py-6 text-left transition-[background-color,border-color,box-shadow,transform] duration-200 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--accent-ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--background)] motion-reduce:transition-none sm:px-6 sm:py-6",
    isSelected
      ? "border-[color:var(--border-accent)] bg-[linear-gradient(180deg,var(--surface-accent),var(--surface-soft))] shadow-[var(--shadow-soft)]"
      : "border-[color:var(--border-subtle)] bg-[linear-gradient(180deg,var(--surface-muted),var(--surface-soft))] hover:-translate-y-0.5 hover:border-[color:var(--border-strong)] hover:bg-[linear-gradient(180deg,var(--surface),var(--surface-soft))] hover:shadow-[var(--shadow-soft)] motion-reduce:hover:translate-y-0",
  ].join(" ");
}

function getCategoryClasses(isSelected) {
  return [
    "inline-flex min-h-[32px] items-center rounded-full border px-3 py-1 text-[11px] font-medium uppercase tracking-[0.22em] transition-[background-color,border-color,color] duration-200 ease-out motion-reduce:transition-none",
    isSelected
      ? "border-[color:var(--border-subtle)] bg-[var(--surface-soft)] text-[var(--text-secondary)]"
      : "border-[color:var(--border-subtle)] bg-[var(--surface-soft)] text-[var(--text-muted)]",
  ].join(" ");
}

function getStatusClasses(isSelected) {
  return [
    "inline-flex min-h-[32px] items-center gap-2 rounded-full border px-3 py-1 text-[11px] font-medium uppercase tracking-[0.22em] transition-[background-color,border-color,color] duration-200 ease-out motion-reduce:transition-none",
    isSelected
      ? "border-[color:var(--border-accent)] bg-[var(--surface-accent-strong)] text-[var(--accent-contrast-text)]"
      : "border-[color:var(--border-subtle)] bg-[var(--surface)] text-[var(--text-secondary)]",
  ].join(" ");
}

function getStatusIndicatorClasses(isSelected) {
  return [
    "flex h-4 w-4 items-center justify-center rounded-full border transition-[background-color,border-color,transform] duration-200 ease-out motion-reduce:transition-none",
    isSelected
      ? "border-[color:var(--border-accent)] bg-[var(--accent-secondary)] text-[var(--accent-solid-text)]"
      : "border-[color:var(--border-strong)] bg-transparent text-transparent",
  ].join(" ");
}

function getMetricClasses() {
  return "min-w-[7.25rem] transition-colors duration-200 ease-out motion-reduce:transition-none sm:min-w-[8rem]";
}

function getActionClasses(isSelected) {
  return [
    "inline-flex min-h-[48px] w-full items-center justify-between gap-3 self-start rounded-full border px-4 py-2.5 text-sm font-medium tracking-[0.01em] transition-[background-color,border-color,color] duration-200 ease-out motion-reduce:transition-none sm:w-auto sm:self-auto sm:justify-center",
    isSelected
      ? "border-[color:var(--border-accent)] bg-[var(--surface-accent-strong)] text-[var(--accent-contrast-text)]"
      : "border-[color:var(--border-subtle)] bg-[var(--surface)] text-[var(--text-primary)] group-hover:border-[color:var(--border-strong)] group-hover:bg-[var(--surface-soft)]",
  ].join(" ");
}

function handleKeyDown(event, onToggle, moduleId) {
  if (
    event.key !== "Enter" &&
    event.key !== " " &&
    event.key !== "Spacebar"
  ) {
    return;
  }

  event.preventDefault();
  onToggle(moduleId);
}

export default function CustomBuildModuleCard({
  isSelected = false,
  module,
  onToggle,
}) {
  const descriptionId = `${module.id}-module-description`;
  const timelineHint = formatTimelineHint(module.timelineDays);

  return (
    <div
      aria-describedby={descriptionId}
      aria-pressed={isSelected}
      className={getModuleClasses(isSelected)}
      onClick={() => onToggle(module.id)}
      onKeyDown={(event) => handleKeyDown(event, onToggle, module.id)}
      role="button"
      tabIndex={0}
    >
      <div
        aria-hidden="true"
        className={[
          "pointer-events-none absolute inset-0 rounded-[inherit] transition-opacity duration-200 ease-out motion-reduce:transition-none",
          isSelected
            ? "bg-[linear-gradient(180deg,var(--surface-accent-strong),transparent_44%,transparent)] opacity-100"
            : "bg-[linear-gradient(180deg,var(--surface),transparent_40%,transparent)] opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100",
        ].join(" ")}
      />

      <div
        aria-hidden="true"
        className={[
          "pointer-events-none absolute inset-[6px] rounded-[20px] border transition-[opacity,border-color] duration-200 ease-out motion-reduce:transition-none",
          isSelected
            ? "border-[color:var(--border-accent)] opacity-100"
            : "border-[color:var(--border-strong)] opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100",
        ].join(" ")}
      />

      <div className="relative flex h-full min-w-0 flex-col">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <span className={getCategoryClasses(isSelected)}>{module.category}</span>

          <span className={getStatusClasses(isSelected)}>
            <span className={getStatusIndicatorClasses(isSelected)}>
              <svg
                aria-hidden="true"
                className={[
                  "h-2.5 w-2.5 transition-[opacity,transform] duration-200 ease-out motion-reduce:transition-none",
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
            <span>{isSelected ? "Selected" : "Not selected"}</span>
          </span>
        </div>

        <div className="mt-6 flex-1 space-y-4">
          <h3 className="text-xl font-semibold tracking-[-0.03em] text-[var(--text-primary)] transition-colors duration-200 ease-out motion-reduce:transition-none">
            {module.title}
          </h3>
          <p
            className="max-w-[44ch] text-sm leading-6 text-[var(--text-secondary)] transition-colors duration-200 ease-out motion-reduce:transition-none"
            id={descriptionId}
          >
            {module.description}
          </p>
        </div>

        <div className="mt-7 border-t border-[color:var(--border-subtle)] pt-6 transition-colors duration-200 ease-out motion-reduce:transition-none">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
            <dl className="flex flex-wrap gap-x-5 gap-y-4">
              <div className={getMetricClasses()}>
                <dt className="text-[11px] font-medium uppercase tracking-[0.22em] text-[var(--text-muted)]">
                  Starting at
                </dt>
                <dd className="mt-1 break-words text-sm font-semibold text-[var(--text-primary)]">
                  {formatInr(module.basePrice)}
                </dd>
              </div>

              {timelineHint ? (
                <div className={getMetricClasses()}>
                  <dt className="text-[11px] font-medium uppercase tracking-[0.22em] text-[var(--text-muted)]">
                    Timeline
                  </dt>
                  <dd className="mt-1 break-words text-sm font-medium text-[var(--text-secondary)]">
                    {timelineHint}
                  </dd>
                </div>
              ) : null}
            </dl>

            <span className={getActionClasses(isSelected)}>
              <span
                className={[
                  "flex h-6 w-6 items-center justify-center rounded-full border transition-[background-color,border-color,color] duration-200 ease-out motion-reduce:transition-none",
                  isSelected
                    ? "border-[color:var(--border-accent)] bg-[var(--surface-accent)] text-[var(--accent-contrast-text)]"
                    : "border-[color:var(--border-strong)] bg-[var(--surface-soft)] text-[var(--text-primary)]",
                ].join(" ")}
              >
                <svg
                  aria-hidden="true"
                  className="h-3 w-3"
                  fill="none"
                  viewBox="0 0 12 12"
                >
                  <path
                    d="M2 6H10"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="1.4"
                  />
                  {isSelected ? null : (
                    <path
                      d="M6 2V10"
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="1.4"
                    />
                  )}
                </svg>
              </span>
              <span>{isSelected ? "Remove" : "Select"}</span>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
