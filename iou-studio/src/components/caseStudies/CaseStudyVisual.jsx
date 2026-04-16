function MetricTile({ metric }) {
  return (
    <div className="theme-panel-contrast rounded-[18px] p-3 sm:p-4">
      <p className="text-[10px] font-medium uppercase tracking-[0.22em] text-[var(--text-muted)]">
        {metric.label}
      </p>
      <p className="mt-2 text-sm font-semibold text-[var(--text-primary)] sm:text-base">
        {metric.value}
      </p>
    </div>
  );
}

function PrimaryRow({ row }) {
  return (
    <div className="rounded-[18px] border border-[color:var(--border-subtle)] bg-[var(--surface-soft)] px-3 py-3 sm:px-4">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-sm font-medium text-[var(--text-primary)]">
            {row.label}
          </p>
          <p className="mt-1 text-xs uppercase tracking-[0.16em] text-[var(--text-muted)]">
            {row.detail}
          </p>
        </div>
        <span className="shrink-0 text-xs font-medium text-[var(--accent-secondary)]">
          {row.meta}
        </span>
      </div>
    </div>
  );
}

function SecondaryRow({ row }) {
  return (
    <div className="rounded-[14px] border border-[color:var(--border-subtle)] bg-[var(--surface-muted)] px-3 py-2.5">
      <p className="text-[10px] font-medium uppercase tracking-[0.22em] text-[var(--text-muted)]">
        {row.label}
      </p>
      <p className="mt-1.5 text-sm font-medium text-[var(--text-primary)]">
        {row.value}
      </p>
    </div>
  );
}

export default function CaseStudyVisual({ visual }) {
  return (
    <div className="rounded-[30px] border border-[color:var(--border-subtle)] bg-[linear-gradient(180deg,var(--surface),var(--surface-soft))] p-3 shadow-[var(--shadow-soft)] sm:p-4">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[color:var(--border-subtle)] pb-3">
        <div className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-[var(--surface-accent-strong)]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[var(--surface-contrast)]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[var(--surface-muted)]" />
        </div>

        <div className="flex flex-wrap items-center justify-end gap-2">
          <span className="text-[10px] font-medium uppercase tracking-[0.24em] text-[var(--text-muted)]">
            {visual.surfaceLabel}
          </span>
          <span className="theme-chip rounded-full px-3 py-1 text-[10px] font-medium uppercase tracking-[0.18em]">
            {visual.status}
          </span>
        </div>
      </div>

      <div className="mt-4 grid gap-4 xl:grid-cols-[minmax(0,1.08fr)_minmax(220px,0.92fr)]">
        <div className="theme-panel rounded-[24px] p-4 sm:p-5">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <p className="text-[10px] font-medium uppercase tracking-[0.24em] text-[var(--text-muted)]">
                {visual.primary.viewport}
              </p>
              <h3 className="mt-2 text-lg font-semibold tracking-[-0.02em] text-[var(--text-primary)]">
                {visual.primary.title}
              </h3>
            </div>

            <div className="flex flex-wrap gap-2">
              {visual.primary.chips.map((chip) => (
                <span
                  className="rounded-full border border-[color:var(--border-subtle)] px-2.5 py-1 text-[10px] font-medium uppercase tracking-[0.16em] text-[var(--text-secondary)]"
                  key={chip}
                >
                  {chip}
                </span>
              ))}
            </div>
          </div>

          <div className="mt-4 space-y-2.5">
            {visual.primary.rows.map((row) => (
              <PrimaryRow key={row.label} row={row} />
            ))}
          </div>

          <div className="mt-4 rounded-[20px] border border-[color:var(--border-subtle)] bg-[var(--surface-contrast)] p-3 sm:p-4">
            <p className="text-[10px] font-medium uppercase tracking-[0.24em] text-[var(--text-muted)]">
              {visual.primary.summaryLabel}
            </p>
            <p className="mt-2 text-sm leading-6 text-[var(--text-secondary)]">
              {visual.primary.summaryValue}
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="mx-auto w-full max-w-[240px] rounded-[28px] border border-[color:var(--border-subtle)] bg-[linear-gradient(180deg,var(--surface),var(--surface-strong))] p-3 shadow-[var(--shadow-soft)]">
            <div className="mx-auto h-1.5 w-14 rounded-full bg-[var(--surface-contrast)]" />

            <div className="mt-3 rounded-[22px] border border-[color:var(--border-subtle)] bg-[var(--surface-soft)] p-4">
              <p className="text-[10px] font-medium uppercase tracking-[0.24em] text-[var(--text-muted)]">
                {visual.secondary.viewport}
              </p>
              <h3 className="mt-2 text-base font-semibold tracking-[-0.02em] text-[var(--text-primary)]">
                {visual.secondary.title}
              </h3>

              <div className="mt-4 space-y-2">
                {visual.secondary.rows.map((row) => (
                  <SecondaryRow key={row.label} row={row} />
                ))}
              </div>

              <div className="mt-4 rounded-full bg-[var(--surface-accent)] px-3 py-2 text-center text-[10px] font-medium uppercase tracking-[0.18em] text-[var(--accent-contrast-text)]">
                {visual.secondary.actionLabel}
              </div>
            </div>
          </div>

          <div className="grid gap-2 sm:grid-cols-3 xl:grid-cols-1">
            {visual.metrics.map((metric) => (
              <MetricTile key={metric.label} metric={metric} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
