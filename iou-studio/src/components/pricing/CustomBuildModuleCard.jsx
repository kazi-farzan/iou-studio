import { getConfiguredModule } from "../../data/configuratorSchema.js";
import { formatInr } from "../../data/pricing.js";
import Button from "../ui/Button.jsx";

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
    "rounded-[28px] border px-5 py-5 transition-[background-color,border-color,box-shadow] duration-200 sm:px-6 sm:py-6",
    isSelected
      ? "border-[color:var(--border-accent)] bg-[linear-gradient(180deg,var(--surface-accent),var(--surface-soft))] shadow-[var(--shadow-soft)]"
      : "border-[color:var(--border-subtle)] bg-[var(--surface)]",
  ].join(" ");
}

function getModuleStatusClasses(isSelected) {
  return [
    "inline-flex items-center rounded-full border px-3 py-1 text-[11px] font-medium uppercase tracking-[0.22em]",
    isSelected
      ? "border-[color:var(--border-accent)] bg-[var(--surface-accent-strong)] text-[var(--accent-contrast-text)]"
      : "border-[color:var(--border-subtle)] bg-[var(--surface-soft)] text-[var(--text-muted)]",
  ].join(" ");
}

function getToggleRowClasses(isChecked) {
  return [
    "flex cursor-pointer gap-4 px-4 py-4 transition-[background-color] duration-200",
    isChecked ? "bg-[var(--surface-accent)]" : "bg-transparent",
  ].join(" ");
}

function getChoiceRowClasses(isChecked) {
  return [
    "block cursor-pointer px-4 py-4 transition-[background-color] duration-200",
    isChecked ? "bg-[var(--surface-accent)]" : "bg-transparent hover:bg-[var(--surface-soft)]",
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

function OptionsSectionHeader({ description, title }) {
  return (
    <div className="space-y-1.5">
      <p className="type-label">{title}</p>
      {description ? (
        <p className="text-sm leading-6 text-[var(--text-secondary)]">
          {description}
        </p>
      ) : null}
    </div>
  );
}

function ModuleBooleanOption({ moduleId, onOptionChange, option }) {
  const checkboxId = `${moduleId}-${option.id}`;

  return (
    <label className={getToggleRowClasses(Boolean(option.value))} htmlFor={checkboxId}>
      <span className="relative mt-0.5 inline-flex h-6 w-11 shrink-0 items-center">
        <input
          checked={Boolean(option.value)}
          className="peer sr-only"
          id={checkboxId}
          onChange={(event) =>
            onOptionChange?.(moduleId, option.id, event.target.checked)
          }
          type="checkbox"
        />
        <span className="absolute inset-0 rounded-full border border-[color:var(--border-subtle)] bg-[var(--surface-soft)] transition-[background-color,border-color] duration-200 peer-checked:border-[color:var(--border-accent)] peer-checked:bg-[var(--accent-secondary)]" />
        <span className="absolute left-1 top-1 h-4 w-4 rounded-full bg-white transition-transform duration-200 peer-checked:translate-x-5" />
      </span>

      <span className="min-w-0 flex-1">
        <span className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <span className="min-w-0 flex-1">
            <span className="text-sm font-medium text-[var(--text-primary)]">
              {option.label}
            </span>
            <span className="mt-1 block text-sm leading-6 text-[var(--text-secondary)]">
              {option.description}
            </span>

            {option.value ? (
              <OptionOutputLine summary={option.deliverableSummary} />
            ) : null}
          </span>

          <span className="shrink-0 text-[11px] font-medium uppercase tracking-[0.18em] text-[var(--text-muted)]">
            {formatImpactLabel(
              option.priceImpact,
              option.timelineImpact,
              "Optional",
            )}
          </span>
        </span>
      </span>
    </label>
  );
}

function ModuleChoiceOption({ moduleId, onOptionChange, option }) {
  return (
    <fieldset className="space-y-3">
      <OptionsSectionHeader
        description={option.description}
        title={option.label}
      />

      <div className="overflow-hidden rounded-[22px] border border-[color:var(--border-subtle)] bg-[var(--surface)]">
        {option.choices.map((choice, index) => {
          const isChecked = option.value === choice.id;

          return (
            <label
              className={[
                getChoiceRowClasses(isChecked),
                index > 0 ? "border-t border-[color:var(--border-subtle)]" : "",
              ]
                .filter(Boolean)
                .join(" ")}
              key={choice.id}
            >
              <span className="flex items-start gap-3">
                <input
                  checked={isChecked}
                  className="mt-1 h-4 w-4 border-[color:var(--border-strong)] bg-[var(--surface-soft)] text-[var(--accent-secondary)] focus:ring-[color:var(--accent-ring)]"
                  name={`${moduleId}-${option.id}`}
                  onChange={() => onOptionChange?.(moduleId, option.id, choice.id)}
                  type="radio"
                />

                <span className="min-w-0 flex-1">
                  <span className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <span className="min-w-0 flex-1">
                      <span className="inline-flex flex-wrap items-center gap-2">
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
                </span>
              </span>
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}

function ModuleOptions({ moduleId, onOptionChange, options }) {
  const addOns = options.filter((option) => option.type === "boolean");
  const configurationOptions = options.filter((option) => option.type !== "boolean");

  return (
    <div className="space-y-6">
      {addOns.length ? (
        <div className="space-y-3">
          <OptionsSectionHeader
            description="Add extra outputs only where they help the build."
            title="Add-ons"
          />
          <div className="overflow-hidden rounded-[22px] border border-[color:var(--border-subtle)] bg-[var(--surface)]">
            {addOns.map((option, index) => (
              <div
                className={index > 0 ? "border-t border-[color:var(--border-subtle)]" : ""}
                key={option.id}
              >
                <ModuleBooleanOption
                  moduleId={moduleId}
                  onOptionChange={onOptionChange}
                  option={option}
                />
              </div>
            ))}
          </div>
        </div>
      ) : null}

      {configurationOptions.length ? (
        <div className="space-y-5">
          <OptionsSectionHeader
            description="Choose the level or flow that best matches this module."
            title="Configuration"
          />
          {configurationOptions.map((option) => (
            <ModuleChoiceOption
              key={option.id}
              moduleId={moduleId}
              onOptionChange={onOptionChange}
              option={option}
            />
          ))}
        </div>
      ) : null}
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
      <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
        <div className="min-w-0 flex-1 space-y-3.5">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="text-[1.4rem] font-semibold tracking-[-0.04em] text-[var(--text-primary)]">
              {module.title}
            </h3>

            <span className={getModuleStatusClasses(isSelected)}>
              {isSelected ? "Selected" : "Available"}
            </span>

            {hasOptions ? (
              <span className="rounded-full border border-[color:var(--border-subtle)] bg-[var(--surface-soft)] px-3 py-1 text-[11px] font-medium uppercase tracking-[0.18em] text-[var(--text-muted)]">
                {isSelected && activeOptionCount
                  ? `${activeOptionCount} active`
                  : "Customizable"}
              </span>
            ) : null}
          </div>

          <p
            className="max-w-[52ch] text-sm leading-7 text-[var(--text-secondary)]"
            id={descriptionId}
          >
            {module.description}
          </p>

          {baseDeliverableSummary ? (
            <p className="max-w-[56ch] text-sm leading-7 text-[var(--text-secondary)]">
              <span className="font-medium text-[var(--text-primary)]">
                Includes:
              </span>{" "}
              {baseDeliverableSummary}
            </p>
          ) : null}

          {hasOptions ? (
            <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-[var(--text-muted)]">
              {isSelected
                ? activeOptionCount
                  ? `${activeOptionCount} customization${
                      activeOptionCount === 1 ? "" : "s"
                    } active`
                  : "Defaults active"
                : "Select this module to configure add-ons and tiers"}
            </p>
          ) : null}
        </div>

        <div className="w-full lg:max-w-[14rem]">
          <div className="grid gap-4 rounded-[22px] border border-[color:var(--border-subtle)] bg-[var(--surface-contrast)] p-4 sm:grid-cols-2 lg:grid-cols-1">
            <div>
              <p className="type-label">
                {isSelected ? "Configured total" : "Starting at"}
              </p>
              <p className="mt-1 text-lg font-semibold text-[var(--text-primary)]">
                {formatInr(
                  isSelected
                    ? configuredModule.configuredPrice ?? module.basePrice
                    : module.basePrice,
                )}
              </p>
            </div>

            {timelineHint ? (
              <div>
                <p className="type-label">Timeline</p>
                <p className="mt-1 text-sm font-medium text-[var(--text-primary)]">
                  {timelineHint}
                </p>
              </div>
            ) : null}
          </div>

          <Button
            aria-describedby={descriptionId}
            className="mt-4 w-full"
            onClick={() => onToggle(module.id)}
            size="md"
            variant={isSelected ? "secondary" : "primary"}
          >
            {isSelected ? "Remove module" : "Add module"}
          </Button>
        </div>
      </div>

      {isSelected && hasOptions ? (
        <div className="mt-6 border-t border-[color:var(--border-subtle)] pt-6">
          <div className="space-y-5">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div className="space-y-2">
                <p className="type-kicker">Customize module</p>
                <p className="max-w-[48ch] text-sm leading-6 text-[var(--text-secondary)]">
                  Only the choices that affect this module are shown here, and
                  every change updates the live price and delivery estimate.
                </p>
              </div>

              <div className="rounded-full border border-[color:var(--border-subtle)] bg-[var(--surface-soft)] px-3 py-1 text-[11px] font-medium uppercase tracking-[0.18em] text-[var(--text-muted)]">
                {configuredModule.deliverableSummary || "Output updates live"}
              </div>
            </div>

            <ModuleOptions
              moduleId={module.id}
              onOptionChange={onOptionChange}
              options={configuredModule.options}
            />
          </div>
        </div>
      ) : null}
    </article>
  );
}
