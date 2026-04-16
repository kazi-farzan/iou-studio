import DeliverableList from "./DeliverableList.jsx";

function getGroupClasses(presenceState, variant) {
  return [
    "overflow-hidden border transition-[opacity,transform,background-color,border-color,box-shadow] duration-200 ease-out motion-reduce:transition-none",
    variant === "page"
      ? "rounded-[28px] border-[color:var(--border-strong)] bg-[linear-gradient(180deg,var(--surface-contrast),var(--surface-soft))] shadow-[var(--shadow-soft)]"
      : "rounded-[24px] border-[color:var(--border-subtle)] bg-[linear-gradient(180deg,var(--surface-contrast),var(--surface-soft))]",
    presenceState === "entering"
      ? "translate-y-1 opacity-60"
      : presenceState === "exiting"
        ? "-translate-y-1 opacity-0"
        : "translate-y-0 opacity-100",
  ].join(" ");
}

function getMetricClasses() {
  return "rounded-[18px] border border-[color:var(--border-subtle)] bg-[var(--surface-soft)] px-3 py-2.5";
}

function getBadgeClasses(tone = "default") {
  if (tone === "accent") {
    return "rounded-full border border-[color:var(--border-accent)] bg-[var(--surface-accent)] px-2.5 py-1 text-[10px] font-medium uppercase tracking-[0.18em] text-[var(--accent-secondary)]";
  }

  if (tone === "timeline") {
    return "rounded-full border border-[color:var(--border-subtle)] bg-[var(--surface-muted)] px-2.5 py-1 text-[10px] font-medium uppercase tracking-[0.18em] text-[var(--text-secondary)]";
  }

  return "rounded-full border border-[color:var(--border-subtle)] bg-[var(--surface-soft)] px-2.5 py-1 text-[10px] font-medium uppercase tracking-[0.18em] text-[var(--text-muted)]";
}

function SummaryMetric({ metric }) {
  if (!metric?.value) {
    return null;
  }

  return (
    <div className={getMetricClasses()}>
      <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-[var(--text-muted)]">
        {metric.label}
      </p>
      <p className="mt-1.5 text-sm font-semibold text-[var(--text-primary)] tabular-nums">
        {metric.value}
      </p>
    </div>
  );
}

function SummaryRowBadge({ tone, value }) {
  if (!value) {
    return null;
  }

  return <span className={getBadgeClasses(tone)}>{value}</span>;
}

function BreakdownRow({ row }) {
  return (
    <div className="grid gap-3 border-t border-[color:var(--border-subtle)] pt-3 first:border-t-0 first:pt-0 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-start sm:gap-4">
      <div className="min-w-0">
        {row.eyebrow ? (
          <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-[var(--text-muted)]">
            {row.eyebrow}
          </p>
        ) : null}

        <p
          className={[
            "text-sm font-medium leading-6 text-[var(--text-primary)]",
            row.eyebrow ? "mt-1.5" : "",
          ]
            .filter(Boolean)
            .join(" ")}
        >
          {row.label}
        </p>

        {row.detail ? (
          <p className="mt-1.5 max-w-[56ch] text-sm leading-6 text-[var(--text-secondary)]">
            {row.detail}
          </p>
        ) : null}

        {row.outputSummary ? (
          <p className="mt-2 max-w-[56ch] text-sm leading-6 text-[var(--text-secondary)]">
            <span className="text-[11px] font-medium uppercase tracking-[0.18em] text-[var(--text-muted)]">
              Output
            </span>{" "}
            {row.outputSummary}
          </p>
        ) : null}
      </div>

      <div className="flex flex-wrap gap-2 sm:justify-end">
        <SummaryRowBadge
          tone={
            row.kind === "option" && row.priceLabel && row.priceLabel !== "Included"
              ? "accent"
              : "default"
          }
          value={row.priceLabel}
        />
        <SummaryRowBadge tone="timeline" value={row.timelineLabel} />
      </div>
    </div>
  );
}

function BreakdownGroup({ group, variant }) {
  return (
    <article className={getGroupClasses(group.presenceState, variant)}>
      <div className="border-b border-[color:var(--border-subtle)] px-4 py-4 sm:px-5 sm:py-5">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div className="min-w-0">
            {group.eyebrow ? (
              <p className="text-[11px] font-medium uppercase tracking-[0.22em] text-[var(--accent-secondary)]">
                {group.eyebrow}
              </p>
            ) : null}

            <h3
              className={[
                "text-lg font-semibold tracking-[-0.03em] text-[var(--text-primary)]",
                group.eyebrow ? "mt-2" : "",
                variant === "page" ? "sm:text-xl" : "",
              ]
                .filter(Boolean)
                .join(" ")}
            >
              {group.title}
            </h3>

            {group.description ? (
              <p className="mt-2 max-w-[60ch] text-sm leading-6 text-[var(--text-secondary)]">
                {group.description}
              </p>
            ) : null}
          </div>

          <div className="grid gap-2 sm:grid-cols-2 lg:min-w-[15rem] lg:grid-cols-1">
            <SummaryMetric metric={group.subtotal} />
            <SummaryMetric metric={group.timeline} />
          </div>
        </div>
      </div>

      <div className="px-4 py-4 sm:px-5 sm:py-5">
        {group.rowsLabel ? (
          <p className="text-[11px] font-medium uppercase tracking-[0.22em] text-[var(--text-muted)]">
            {group.rowsLabel}
          </p>
        ) : null}

        <div className={group.rowsLabel ? "mt-3 space-y-3" : "space-y-3"}>
          {group.rows.map((row) => (
            <BreakdownRow key={row.id} row={row} />
          ))}
        </div>

        {group.deliverables?.sections?.length ? (
          <DeliverableList
            className="mt-4"
            compact={variant !== "page"}
            label={group.deliverables.label || "Deliverables"}
            maxItemsPerSection={variant === "page" ? null : 3}
            sections={group.deliverables.sections}
            surface="contrast"
          />
        ) : null}

        {group.note ? (
          <p className="mt-4 text-sm leading-6 text-[var(--text-secondary)]">
            {group.note}
          </p>
        ) : null}
      </div>
    </article>
  );
}

export default function StructuredSummaryBreakdown({
  groups = [],
  variant = "panel",
}) {
  return (
    <div className="space-y-4">
      {groups.map((group) => (
        <BreakdownGroup group={group} key={group.id} variant={variant} />
      ))}
    </div>
  );
}
