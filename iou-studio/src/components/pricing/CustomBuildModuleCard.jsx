import {
  getConfiguredModule,
  getModuleOptionDefaultValue,
} from "../../data/configuratorSchema.js";
import { formatInr } from "../../data/pricing.js";
import DeliverableList from "./DeliverableList.jsx";

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

function formatImpactLabel(priceImpact, timelineImpact, emptyLabel = "Included") {
  const parts = [];

  if (priceImpact > 0) {
    parts.push(`+ ${formatInr(priceImpact)}`);
  }

  const timelineHint = formatTimelineHint(timelineImpact);

  if (timelineHint) {
    parts.push(`+ ${timelineHint}`);
  }

  return parts.join(" / ") || emptyLabel;
}

function getModuleClasses(isSelected) {
  return [
    "group relative flex h-full flex-col overflow-hidden rounded-[30px] border px-5 py-6 text-left transition-[background-color,border-color,box-shadow,transform] duration-200 ease-out motion-reduce:transition-none sm:px-6 sm:py-6",
    isSelected
      ? "border-[color:var(--border-accent)] bg-[linear-gradient(180deg,var(--surface-accent),var(--surface-soft))] shadow-[var(--shadow-soft)]"
      : "border-[color:var(--border-subtle)] bg-[linear-gradient(180deg,var(--surface-muted),var(--surface-soft))] hover:-translate-y-0.5 hover:border-[color:var(--border-strong)] hover:bg-[linear-gradient(180deg,var(--surface),var(--surface-soft))] hover:shadow-[var(--shadow-soft)] motion-reduce:hover:translate-y-0",
  ].join(" ");
}

function getSummaryButtonClasses() {
  return "relative flex w-full min-w-0 flex-col text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--accent-ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--background)]";
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
    "inline-flex min-h-[48px] w-full items-center justify-between gap-3 self-start rounded-[18px] border px-4 py-2.5 text-sm font-semibold tracking-[0.01em] transition-[background-color,border-color,color] duration-200 ease-out motion-reduce:transition-none sm:w-auto sm:self-auto sm:justify-center",
    isSelected
      ? "border-[color:var(--border-accent)] bg-[var(--surface-accent-strong)] text-[var(--accent-contrast-text)]"
      : "border-[color:var(--border-subtle)] bg-[var(--surface)] text-[var(--text-primary)] group-hover:border-[color:var(--border-strong)] group-hover:bg-[var(--surface-soft)]",
  ].join(" ");
}

function getChoiceClasses(isChecked) {
  return [
    "block rounded-[22px] border p-4 transition-[background-color,border-color] duration-200 ease-out motion-reduce:transition-none",
    isChecked
      ? "border-[color:var(--border-accent)] bg-[var(--surface-accent)]"
      : "border-[color:var(--border-subtle)] bg-[var(--surface)] hover:border-[color:var(--border-strong)]",
  ].join(" ");
}

function OptionOutputLine({ summary }) {
  if (!summary) {
    return null;
  }

  return (
    <p className="mt-2 text-sm leading-6 text-[var(--text-secondary)]">
      <span className="text-[11px] font-medium uppercase tracking-[0.18em] text-[var(--text-muted)]">
        Output
      </span>{" "}
      {summary}
    </p>
  );
}

function ModuleBooleanOption({ moduleId, onOptionChange, option }) {
  const checkboxId = `${moduleId}-${option.id}`;

  return (
    <label
      className="flex cursor-pointer items-start gap-4 rounded-[22px] border border-[color:var(--border-subtle)] bg-[var(--surface)] p-4 transition-[background-color,border-color] duration-200 ease-out hover:border-[color:var(--border-strong)] motion-reduce:transition-none"
      htmlFor={checkboxId}
    >
      <input
        checked={Boolean(option.value)}
        className="mt-1 h-4 w-4 rounded border-[color:var(--border-strong)] bg-[var(--surface-soft)] text-[var(--accent-secondary)] focus:ring-[color:var(--accent-ring)]"
        id={checkboxId}
        onChange={(event) =>
          onOptionChange?.(moduleId, option.id, event.target.checked)
        }
        type="checkbox"
      />

      <span className="min-w-0 flex-1">
        <span className="flex flex-wrap items-center gap-2">
          <span className="text-sm font-medium text-[var(--text-primary)]">
            {option.label}
          </span>
          <span className="rounded-full border border-[color:var(--border-subtle)] bg-[var(--surface-soft)] px-2.5 py-1 text-[10px] font-medium uppercase tracking-[0.18em] text-[var(--text-muted)]">
            {option.value ? "Added" : "Optional"}
          </span>
        </span>

        <span className="mt-1 block text-sm leading-6 text-[var(--text-secondary)]">
          {option.description}
        </span>

        {option.value ? (
          <OptionOutputLine summary={option.deliverableSummary} />
        ) : null}

        <span className="mt-3 block text-[11px] font-medium uppercase tracking-[0.2em] text-[var(--text-muted)]">
          {formatImpactLabel(option.priceImpact, option.timelineImpact, "Optional")}
        </span>
      </span>
    </label>
  );
}

function ModuleChoiceOption({ moduleId, onOptionChange, option }) {
  return (
    <fieldset className="rounded-[22px] border border-[color:var(--border-subtle)] bg-[var(--surface)] p-4">
      <legend className="text-sm font-medium text-[var(--text-primary)]">
        {option.label}
      </legend>
      <p className="mt-2 text-sm leading-6 text-[var(--text-secondary)]">
        {option.description}
      </p>

      <div className="mt-4 space-y-3">
        {option.choices.map((choice) => {
          const isChecked = option.value === choice.id;

          return (
            <label className={getChoiceClasses(isChecked)} key={choice.id}>
              <span className="flex items-start gap-3">
                <input
                  checked={isChecked}
                  className="mt-1 h-4 w-4 border-[color:var(--border-strong)] bg-[var(--surface-soft)] text-[var(--accent-secondary)] focus:ring-[color:var(--accent-ring)]"
                  name={`${moduleId}-${option.id}`}
                  onChange={() => onOptionChange?.(moduleId, option.id, choice.id)}
                  type="radio"
                />

                <span className="min-w-0 flex-1">
                  <span className="flex flex-wrap items-center gap-2">
                    <span className="text-sm font-medium text-[var(--text-primary)]">
                      {choice.label}
                    </span>
                    {choice.id === option.defaultValue ? (
                      <span className="rounded-full border border-[color:var(--border-subtle)] bg-[var(--surface-soft)] px-2.5 py-1 text-[10px] font-medium uppercase tracking-[0.18em] text-[var(--text-muted)]">
                        Default
                      </span>
                    ) : null}
                  </span>

                  <span className="mt-1 block text-sm leading-6 text-[var(--text-secondary)]">
                    {choice.description}
                  </span>

                  <OptionOutputLine summary={choice.deliverableSummary} />
                </span>

                <span className="shrink-0 text-[11px] font-medium uppercase tracking-[0.18em] text-[var(--text-muted)]">
                  {formatImpactLabel(
                    choice.priceImpact,
                    choice.timelineImpact,
                    "Included",
                  )}
                </span>
              </span>
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}

function ModuleSelectOption({ moduleId, onOptionChange, option }) {
  const selectId = `${moduleId}-${option.id}`;
  const selectedChoice = option.selectedChoice;

  return (
    <div className="rounded-[22px] border border-[color:var(--border-subtle)] bg-[var(--surface)] p-4">
      <label
        className="text-sm font-medium text-[var(--text-primary)]"
        htmlFor={selectId}
      >
        {option.label}
      </label>

      <p className="mt-2 text-sm leading-6 text-[var(--text-secondary)]">
        {option.description}
      </p>

      <div className="mt-4 grid gap-3 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-start">
        <select
          className="theme-input min-h-[48px] rounded-[18px] px-4 py-3 text-sm text-[var(--text-primary)]"
          id={selectId}
          onChange={(event) =>
            onOptionChange?.(moduleId, option.id, event.target.value)
          }
          value={option.value ?? getModuleOptionDefaultValue(option) ?? ""}
        >
          {option.choices.map((choice) => (
            <option key={choice.id} value={choice.id}>
              {choice.label}
            </option>
          ))}
        </select>

        <span className="text-[11px] font-medium uppercase tracking-[0.18em] text-[var(--text-muted)] sm:pt-3">
          {formatImpactLabel(
            selectedChoice?.priceImpact ?? 0,
            selectedChoice?.timelineImpact,
            "Included",
          )}
        </span>
      </div>

      {selectedChoice?.description ? (
        <p className="mt-3 text-sm leading-6 text-[var(--text-secondary)]">
          {selectedChoice.description}
        </p>
      ) : null}

      <OptionOutputLine summary={selectedChoice?.deliverableSummary} />
    </div>
  );
}

function ModuleOptions({ moduleId, onOptionChange, options }) {
  return (
    <div className="space-y-4">
      {options.map((option) => {
        if (option.type === "boolean") {
          return (
            <ModuleBooleanOption
              key={option.id}
              moduleId={moduleId}
              onOptionChange={onOptionChange}
              option={option}
            />
          );
        }

        if (option.type === "select") {
          return (
            <ModuleSelectOption
              key={option.id}
              moduleId={moduleId}
              onOptionChange={onOptionChange}
              option={option}
            />
          );
        }

        return (
          <ModuleChoiceOption
            key={option.id}
            moduleId={moduleId}
            onOptionChange={onOptionChange}
            option={option}
          />
        );
      })}
    </div>
  );
}

export default function CustomBuildModuleCard({
  isSelected = false,
  module,
  onOptionChange,
  onToggle,
  optionSelections = {},
}) {
  const configuredModule = getConfiguredModule(module, optionSelections) ?? module;
  const descriptionId = `${module.id}-module-description`;
  const hasOptions = Boolean(module.options?.length);
  const timelineHint = formatTimelineHint(
    isSelected ? configuredModule.configuredTimelineDays : module.timelineDays,
  );
  const activeOptionCount = configuredModule.selectedOptionCount ?? 0;
  const baseDeliverableSummary =
    module.baseDeliverableSummary || module.deliverableSummary;

  return (
    <article className={getModuleClasses(isSelected)}>
      <div
        aria-hidden="true"
        className={[
          "pointer-events-none absolute inset-0 rounded-[inherit] transition-opacity duration-200 ease-out motion-reduce:transition-none",
          isSelected
            ? "bg-[linear-gradient(180deg,var(--surface-accent-strong),transparent_44%,transparent)] opacity-100"
            : "bg-[linear-gradient(180deg,var(--surface),transparent_40%,transparent)] opacity-0 group-hover:opacity-100",
        ].join(" ")}
      />

      <div
        aria-hidden="true"
        className={[
          "pointer-events-none absolute inset-[6px] rounded-[24px] border transition-[opacity,border-color] duration-200 ease-out motion-reduce:transition-none",
          isSelected
            ? "border-[color:var(--border-accent)] opacity-100"
            : "border-[color:var(--border-strong)] opacity-0 group-hover:opacity-100",
        ].join(" ")}
      />

      <button
        aria-describedby={descriptionId}
        aria-pressed={isSelected}
        className={getSummaryButtonClasses()}
        onClick={() => onToggle(module.id)}
        type="button"
      >
        <div className="flex flex-wrap items-start justify-between gap-3">
          <span className={getCategoryClasses(isSelected)}>{module.category}</span>

          <div className="flex flex-wrap items-center justify-end gap-2">
            {hasOptions ? (
              <span className="rounded-full border border-[color:var(--border-subtle)] bg-[var(--surface-soft)] px-3 py-1 text-[10px] font-medium uppercase tracking-[0.18em] text-[var(--text-muted)]">
                {isSelected && activeOptionCount
                  ? `${activeOptionCount} active`
                  : "Customizable"}
              </span>
            ) : null}

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
        </div>

        <div className="mt-6 flex-1 space-y-4">
          <h3 className="text-[1.45rem] font-semibold tracking-[-0.04em] text-[var(--text-primary)] transition-colors duration-200 ease-out motion-reduce:transition-none">
            {module.title}
          </h3>
          <p
            className="max-w-[44ch] text-sm leading-7 text-[var(--text-secondary)] transition-colors duration-200 ease-out motion-reduce:transition-none"
            id={descriptionId}
          >
            {module.description}
          </p>

          {baseDeliverableSummary ? (
            <div className="rounded-[22px] border border-[color:var(--border-subtle)] bg-[var(--surface-soft)] px-4 py-4">
              <p className="type-label">
                Includes
              </p>
              <p className="mt-2 text-sm leading-7 text-[var(--text-secondary)]">
                {baseDeliverableSummary}
              </p>
            </div>
          ) : null}

          {hasOptions ? (
            <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-[var(--text-muted)]">
              {isSelected
                ? "Customize below to refine scope"
                : "Customization appears after selection"}
            </p>
          ) : null}
        </div>

        <div className="mt-7 border-t border-[color:var(--border-subtle)] pt-6 transition-colors duration-200 ease-out motion-reduce:transition-none">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
            <dl className="flex flex-wrap gap-x-5 gap-y-4">
              <div className={getMetricClasses()}>
                <dt className="text-[11px] font-medium uppercase tracking-[0.22em] text-[var(--text-muted)]">
                  {isSelected ? "Configured total" : "Starting at"}
                </dt>
                <dd className="mt-1 break-words text-sm font-semibold text-[var(--text-primary)]">
                  {formatInr(
                    isSelected
                      ? configuredModule.configuredPrice ?? module.basePrice
                      : module.basePrice,
                  )}
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
      </button>

      {isSelected && hasOptions ? (
        <div className="relative mt-6 border-t border-[color:var(--border-subtle)] pt-6">
          <div className="rounded-[26px] border border-[color:var(--border-subtle)] bg-[var(--surface-soft)] p-4 sm:p-5">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div className="space-y-2">
                <p className="type-kicker">
                  Customize module
                </p>
                <p className="max-w-[40ch] text-sm leading-7 text-[var(--text-secondary)]">
                  Reveal only the decisions that matter for this module, with every
                  change feeding the live price and timeline.
                </p>
              </div>

              <div className="rounded-full border border-[color:var(--border-subtle)] bg-[var(--surface)] px-3 py-1 text-[10px] font-medium uppercase tracking-[0.18em] text-[var(--text-muted)]">
                {activeOptionCount
                  ? `${activeOptionCount} active customization${
                      activeOptionCount === 1 ? "" : "s"
                    }`
                  : "Defaults active"}
              </div>
            </div>

            <DeliverableList
              className="mt-5"
              compact
              label="Current output"
              maxItemsPerSection={2}
              sections={configuredModule.deliverableSections}
              surface="contrast"
            />

            <div className="mt-5">
              <ModuleOptions
                moduleId={module.id}
                onOptionChange={onOptionChange}
                options={configuredModule.options}
              />
            </div>
          </div>
        </div>
      ) : null}
    </article>
  );
}
