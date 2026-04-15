import Button from "../ui/Button.jsx";
import Card from "../ui/Card.jsx";

function SummaryList({ items }) {
  return (
    <ul className="divide-y divide-[color:var(--border-subtle)]">
      {items.map((item) => (
        <li
          className="grid gap-x-6 gap-y-2 py-4 first:pt-0 last:pb-0 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-start"
          key={item.id}
        >
          <div className="min-w-0 flex-1">
            {item.eyebrow ? (
              <p className="text-[11px] font-medium uppercase tracking-[0.22em] text-[var(--text-muted)]">
                {item.eyebrow}
              </p>
            ) : null}

            <p
              className={[
                "text-sm font-medium leading-6 text-[var(--text-primary)]",
                item.eyebrow ? "mt-1" : "",
              ]
                .filter(Boolean)
                .join(" ")}
            >
              {item.title}
            </p>

            {item.detail ? (
              <p className="mt-1 text-sm leading-6 text-[var(--text-secondary)]">
                {item.detail}
              </p>
            ) : null}
          </div>

          {item.value ? (
            <p className="max-w-full text-sm font-medium leading-6 text-[var(--text-primary)] sm:max-w-[10.5rem] sm:justify-self-end sm:text-right">
              {item.value}
            </p>
          ) : null}
        </li>
      ))}
    </ul>
  );
}

function EmptyState({ detail, title }) {
  return (
    <div className="theme-panel rounded-[22px] border border-dashed border-[color:var(--border-subtle)] px-4 py-5">
      <p className="text-sm font-medium text-[var(--text-primary)]">{title}</p>
      <p className="mt-2 max-w-[32ch] text-sm leading-6 text-[var(--text-secondary)]">
        {detail}
      </p>
    </div>
  );
}

function SummarySection({
  children,
  description,
  label,
  live = false,
}) {
  return (
    <section
      aria-atomic={live ? "true" : undefined}
      aria-live={live ? "polite" : undefined}
      className="border-t border-[color:var(--border-subtle)] px-5 py-5 sm:px-6 sm:py-6"
    >
      <div className="space-y-4">
        <div className="space-y-2">
          <p className="text-xs font-medium uppercase tracking-[0.24em] text-[var(--text-muted)]">
            {label}
          </p>

          {description ? (
            <p className="max-w-[34ch] text-sm leading-6 text-[var(--text-secondary)]">
              {description}
            </p>
          ) : null}
        </div>

        {children}
      </div>
    </section>
  );
}

function SummaryMeta({ modeLabel, statusLabel }) {
  return (
    <div className="flex flex-wrap items-center gap-2 text-[11px] font-medium uppercase tracking-[0.22em] text-[var(--text-muted)]">
      <span className="text-[var(--accent-secondary)]">{modeLabel}</span>

      {statusLabel ? (
        <>
          <span className="h-1 w-1 rounded-full bg-[var(--border-strong)]" />
          <span>{statusLabel}</span>
        </>
      ) : null}
    </div>
  );
}

function TotalSummary({ timeline, total }) {
  return (
    <div className="space-y-4">
      <div className="rounded-[24px] border border-[color:var(--border-strong)] bg-[var(--surface-soft)] px-4 py-5 sm:px-5">
        <p className="max-w-full break-words text-3xl font-semibold tracking-[-0.05em] text-[var(--text-primary)] tabular-nums sm:text-[2.5rem]">
          {total.value}
        </p>

        {total.meta ? (
          <p className="mt-3 text-sm font-medium leading-6 text-[var(--text-secondary)]">
            {total.meta}
          </p>
        ) : null}
      </div>

      <div className="grid gap-x-6 gap-y-2 border-t border-[color:var(--border-subtle)] pt-4 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-start">
        <div className="space-y-2">
          <p className="text-[11px] font-medium uppercase tracking-[0.22em] text-[var(--text-muted)]">
            {timeline.label}
          </p>

          {timeline.description ? (
            <p className="max-w-[32ch] text-sm leading-6 text-[var(--text-secondary)]">
              {timeline.description}
            </p>
          ) : null}
        </div>

        <p className="text-sm font-medium leading-6 text-[var(--text-primary)] sm:justify-self-end sm:text-right">
          {timeline.value}
        </p>
      </div>
    </div>
  );
}

export default function PricingSummaryPanel({ summary }) {
  const {
    ctaLabel,
    ctaNote,
    description,
    emptyState,
    isActionDisabled,
    items,
    modeLabel,
    selectionHint,
    selectionLabel,
    statusLabel,
    timeline,
    total,
  } = summary;

  return (
    <Card className="overflow-hidden p-0 xl:sticky xl:top-28">
      <div className="flex flex-col">
        <div className="px-5 py-5 sm:px-6 sm:py-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <p className="text-xs font-medium uppercase tracking-[0.28em] text-[var(--accent-secondary)]">
                Build Summary
              </p>
              <h2 className="text-2xl font-semibold tracking-[-0.04em] text-[var(--text-primary)]">
                Current setup
              </h2>
            </div>

            <SummaryMeta modeLabel={modeLabel} statusLabel={statusLabel} />

            <p className="max-w-[36ch] text-sm leading-7 text-[var(--text-secondary)]">
              {description}
            </p>
          </div>
        </div>

        <SummarySection description={selectionHint} label={selectionLabel} live>
          {items.length ? (
            <SummaryList items={items} />
          ) : (
            <EmptyState detail={emptyState.detail} title={emptyState.title} />
          )}
        </SummarySection>

        <SummarySection description={total.description} label={total.label} live>
          <TotalSummary timeline={timeline} total={total} />
        </SummarySection>

        <div className="border-t border-[color:var(--border-subtle)] px-5 py-5 sm:px-6 sm:py-6">
          <div className="space-y-4">
            {isActionDisabled ? (
              <Button
                className="w-full border-[color:var(--border-accent)] bg-[var(--surface-accent)] text-[var(--text-primary)] hover:bg-[var(--surface-accent-strong)]"
                disabled
                size="lg"
                variant="secondary"
              >
                {ctaLabel}
              </Button>
            ) : (
              <Button
                className="w-full border-[color:var(--border-accent)] bg-[var(--surface-accent)] text-[var(--text-primary)] hover:bg-[var(--surface-accent-strong)]"
                size="lg"
                to="/contact"
                variant="secondary"
              >
                {ctaLabel}
              </Button>
            )}

            <p className="max-w-[34ch] text-sm leading-6 text-[var(--text-secondary)]">
              {ctaNote}
            </p>
          </div>
        </div>
      </div>
    </Card>
  );
}
