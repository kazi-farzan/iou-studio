import Button from "../ui/Button.jsx";
import Card from "../ui/Card.jsx";

function SummaryList({ items }) {
  return (
    <ul className="space-y-3">
      {items.map((item) => (
        <li
          className="flex items-start justify-between gap-4 rounded-[20px] border border-[color:var(--border-subtle)] bg-[var(--surface-soft)] px-4 py-4"
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
                "text-sm font-medium text-[var(--text-primary)]",
                item.eyebrow ? "mt-2" : "",
              ]
                .filter(Boolean)
                .join(" ")}
            >
              {item.title}
            </p>

            {item.detail ? (
              <p className="mt-2 text-sm leading-6 text-[var(--text-secondary)]">
                {item.detail}
              </p>
            ) : null}
          </div>

          {item.value ? (
            <p className="max-w-[9.5rem] shrink-0 break-words text-right text-sm font-medium leading-6 text-[var(--text-primary)]">
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
    <div className="rounded-[20px] border border-dashed border-[color:var(--border-subtle)] bg-[var(--surface-soft)] px-4 py-4">
      <p className="text-sm font-medium text-[var(--text-primary)]">{title}</p>
      <p className="mt-2 text-sm leading-6 text-[var(--text-secondary)]">
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
      className="border-t border-[color:var(--border-subtle)] px-5 py-5 sm:px-6"
    >
      <div className="space-y-4">
        <div className="space-y-2">
          <p className="text-xs font-medium uppercase tracking-[0.24em] text-[var(--text-muted)]">
            {label}
          </p>

          {description ? (
            <p className="text-sm leading-6 text-[var(--text-secondary)]">
              {description}
            </p>
          ) : null}
        </div>

        {children}
      </div>
    </section>
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
        <div className="px-5 py-5 sm:px-6">
          <div className="flex flex-wrap items-center gap-2">
            <span className="theme-panel rounded-full px-3 py-1 text-[11px] font-medium uppercase tracking-[0.22em] text-[var(--accent-secondary)]">
              {modeLabel}
            </span>

            {statusLabel ? (
              <span className="theme-panel-contrast rounded-full px-3 py-1 text-[11px] font-medium uppercase tracking-[0.22em] text-[var(--text-secondary)]">
                {statusLabel}
              </span>
            ) : null}
          </div>

          <div className="mt-4 space-y-3">
            <p className="text-xs font-medium uppercase tracking-[0.28em] text-[var(--accent-secondary)]">
              Build Summary
            </p>
            <h2 className="text-2xl font-semibold tracking-[-0.04em] text-[var(--text-primary)]">
              Current setup and next step.
            </h2>
            <p className="text-sm leading-7 text-[var(--text-secondary)]">
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
          <div className="theme-panel-contrast rounded-[22px] p-5">
            <p className="break-words text-3xl font-semibold tracking-[-0.05em] text-[var(--text-primary)] sm:text-4xl">
              {total.value}
            </p>

            {total.meta ? (
              <p className="mt-3 text-sm font-medium text-[var(--text-primary)]">
                {total.meta}
              </p>
            ) : null}
          </div>
        </SummarySection>

        <SummarySection description={timeline.description} label={timeline.label} live>
          <div className="rounded-[20px] border border-[color:var(--border-subtle)] bg-[var(--surface-soft)] px-4 py-4">
            <p className="text-sm font-medium text-[var(--text-primary)]">
              {timeline.value}
            </p>
          </div>
        </SummarySection>

        <div className="border-t border-[color:var(--border-subtle)] px-5 py-5 sm:px-6">
          <div className="space-y-4">
            {isActionDisabled ? (
              <Button className="w-full" disabled size="lg">
                {ctaLabel}
              </Button>
            ) : (
              <Button className="w-full" size="lg" to="/contact">
                {ctaLabel}
              </Button>
            )}

            <p className="text-sm leading-6 text-[var(--text-secondary)]">
              {ctaNote}
            </p>
          </div>
        </div>
      </div>
    </Card>
  );
}
