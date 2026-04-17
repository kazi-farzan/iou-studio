import { useId, useState } from "react";

function formatCountLabel(count, singular, plural = `${singular}s`) {
  return `${count} ${count === 1 ? singular : plural}`;
}

function getPresenceClasses(presenceState) {
  if (presenceState === "entering") {
    return "translate-y-1 opacity-60";
  }

  if (presenceState === "exiting") {
    return "-translate-y-1 opacity-0";
  }

  return "translate-y-0 opacity-100";
}

function getGroupPreview(group) {
  const rows = group.rows ?? [];
  const includedModuleCount = rows.filter(
    (row) => row.kind === "included-module",
  ).length;
  const optionCount = rows.filter((row) => row.kind === "option").length;

  if (includedModuleCount) {
    return formatCountLabel(includedModuleCount, "included module");
  }

  if (!optionCount) {
    return "Base scope only";
  }

  return `Base scope + ${formatCountLabel(optionCount, "selected option")}`;
}

function getRowTypeLabel(row) {
  if (row.kind === "option") {
    return "Selected option";
  }

  if (row.kind === "base") {
    return "Base scope";
  }

  return row.eyebrow || "Included module";
}

function getMetricPillClasses() {
  return "rounded-full border border-[color:var(--border-subtle)] bg-[var(--surface)] px-3 py-1.5";
}

function RowPill({ tone = "default", value }) {
  if (!value) {
    return null;
  }

  const toneClasses =
    tone === "accent"
      ? "border-[color:var(--border-accent)] bg-[var(--surface-accent)] text-[var(--accent-secondary)]"
      : "border-[color:var(--border-subtle)] bg-[var(--surface-soft)] text-[var(--text-muted)]";

  return (
    <span
      className={[
        "rounded-full border px-2.5 py-1 text-[10px] font-medium uppercase tracking-[0.18em]",
        toneClasses,
      ].join(" ")}
    >
      {value}
    </span>
  );
}

function BreakdownMetric({ metric }) {
  if (!metric?.value) {
    return null;
  }

  return (
    <div className={getMetricPillClasses()}>
      <p className="text-[10px] font-medium uppercase tracking-[0.18em] text-[var(--text-muted)]">
        {metric.label}
      </p>
      <p className="mt-1 text-sm font-semibold text-[var(--text-primary)] tabular-nums">
        {metric.value}
      </p>
    </div>
  );
}

function BreakdownRow({ isFirst, row }) {
  const isOption = row.kind === "option";

  return (
    <div
      className={[
        "grid gap-3 py-3 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-start sm:gap-4",
        isFirst ? "pt-0" : "border-t border-[color:var(--border-subtle)]",
      ].join(" ")}
    >
      <div className={isOption ? "border-l border-[color:var(--border-accent)] pl-4" : ""}>
        <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-[var(--text-muted)]">
          {getRowTypeLabel(row)}
        </p>
        <p className="mt-1.5 text-sm font-medium leading-6 text-[var(--text-primary)]">
          {row.label}
        </p>

        {row.detail ? (
          <p className="mt-1.5 max-w-[54ch] text-sm leading-6 text-[var(--text-secondary)]">
            {row.detail}
          </p>
        ) : null}
      </div>

      <div className="flex flex-wrap gap-2 sm:justify-end">
        <RowPill
          tone={
            row.kind === "option" &&
            row.priceLabel &&
            row.priceLabel !== "Included"
              ? "accent"
              : "default"
          }
          value={row.priceLabel}
        />
        <RowPill value={row.timelineLabel} />
      </div>
    </div>
  );
}

function BreakdownGroup({ group }) {
  const [isOpen, setIsOpen] = useState(false);
  const contentId = useId();

  return (
    <article
      className={[
        "overflow-hidden rounded-[24px] border border-[color:var(--border-subtle)] bg-[var(--surface-soft)] transition-[opacity,transform,border-color,background-color] duration-200 ease-out motion-reduce:transition-none",
        isOpen ? "border-[color:var(--border-strong)] bg-[var(--surface)]" : "",
        getPresenceClasses(group.presenceState),
      ].join(" ")}
    >
      <button
        aria-controls={contentId}
        aria-expanded={isOpen}
        className="w-full px-4 py-4 text-left sm:px-5"
        onClick={() => setIsOpen((current) => !current)}
        type="button"
      >
        <div className="space-y-4">
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              {group.eyebrow ? (
                <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-[var(--text-muted)]">
                  {group.eyebrow}
                </p>
              ) : null}

              <p className="mt-1.5 text-base font-semibold tracking-[-0.02em] text-[var(--text-primary)]">
                {group.title}
              </p>

              <p className="mt-1.5 text-sm leading-6 text-[var(--text-secondary)]">
                {getGroupPreview(group)}
              </p>
            </div>

            <span className="shrink-0 text-[10px] font-medium uppercase tracking-[0.2em] text-[var(--accent-secondary)]">
              {isOpen ? "Hide details" : "Show details"}
            </span>
          </div>

          <div className="flex flex-wrap gap-2">
            <BreakdownMetric metric={group.subtotal} />
            <BreakdownMetric metric={group.timeline} />
          </div>
        </div>
      </button>

      {isOpen ? (
        <div
          className="border-t border-[color:var(--border-subtle)] px-4 py-4 sm:px-5"
          id={contentId}
        >
          <div className="space-y-0">
            {group.rows.map((row, index) => (
              <BreakdownRow isFirst={index === 0} key={row.id} row={row} />
            ))}
          </div>

          {group.note ? (
            <p className="mt-4 text-sm leading-6 text-[var(--text-secondary)]">
              {group.note}
            </p>
          ) : null}
        </div>
      ) : null}
    </article>
  );
}

export default function SummaryBreakdownPanel({ groups = [] }) {
  return (
    <div className="space-y-3">
      {groups.map((group) => (
        <BreakdownGroup group={group} key={group.id} />
      ))}
    </div>
  );
}
