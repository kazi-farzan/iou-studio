import Button from "../ui/Button.jsx";
import {
  getSummaryActionLabel,
  getSummaryBreakdownCards,
  getSummaryBreakdownOverflowNote,
  getSummaryTopContext,
} from "./pricingSummaryHelpers.js";

const DEFAULT_CTA_BUTTON_CLASSNAME = "w-full";

function getTotalValueClasses(value) {
  return String(value ?? "").length > 16
    ? "text-[clamp(1.8rem,4vw,2.3rem)] tracking-[-0.05em]"
    : "text-[clamp(2.15rem,4.4vw,2.7rem)] tracking-[-0.06em]";
}

function getBreakdownGridClasses(surface, itemCount) {
  if (surface === "sheet" && itemCount > 1) {
    return "grid gap-4 lg:grid-cols-2";
  }

  return "space-y-4";
}

function SurfaceBadge({ tone = "muted", value }) {
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
        "inline-flex rounded-full border px-3 py-1.5 text-[10px] font-medium uppercase tracking-[0.18em]",
        toneClasses,
      ].join(" ")}
    >
      {value}
    </span>
  );
}

function SummaryMetric({ label, value }) {
  if (!value) {
    return null;
  }

  return (
    <div className="rounded-[18px] border border-[color:var(--border-subtle)] bg-[var(--surface-soft)] px-3.5 py-3">
      <p className="text-[10px] font-medium uppercase tracking-[0.18em] text-[var(--text-muted)]">
        {label}
      </p>
      <p className="mt-1.5 whitespace-nowrap text-sm font-semibold text-[var(--text-primary)] tabular-nums">
        {value}
      </p>
    </div>
  );
}

function SummaryLine({ label, value }) {
  if (!value) {
    return null;
  }

  return (
    <div className="grid gap-1.5 sm:grid-cols-[5.75rem_minmax(0,1fr)] sm:gap-4">
      <dt className="text-[10px] font-medium uppercase tracking-[0.18em] text-[var(--text-muted)]">
        {label}
      </dt>
      <dd className="text-sm leading-6 text-[var(--text-secondary)]">
        {value}
      </dd>
    </div>
  );
}

function EmptyState({ detail, title }) {
  return (
    <div className="rounded-[24px] border border-dashed border-[color:var(--border-subtle)] bg-[var(--surface-soft)] px-4 py-5 sm:px-5">
      <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-[var(--text-muted)]">
        Awaiting selection
      </p>
      <p className="mt-2 text-base font-semibold tracking-[-0.02em] text-[var(--text-primary)]">
        {title}
      </p>
      <p className="mt-2 text-sm leading-6 text-[var(--text-secondary)]">
        {detail}
      </p>
    </div>
  );
}

function SummaryHeader({
  action,
  eyebrow,
  modeLabel,
  title,
  titleId,
}) {
  return (
    <div className="flex items-start justify-between gap-4">
      <div className="min-w-0 space-y-3">
        <div className="space-y-2">
          <p className="type-kicker">{eyebrow}</p>
          <h2
            className="text-[1.55rem] font-semibold leading-tight tracking-[-0.045em] text-[var(--text-primary)] sm:text-[1.85rem]"
            id={titleId}
          >
            {title}
          </h2>
        </div>

        <SurfaceBadge tone="accent" value={modeLabel} />
      </div>

      {action ? <div className="shrink-0">{action}</div> : null}
    </div>
  );
}

function SummaryHero({ contextLabel, surface, timeline, total }) {
  return (
    <section
      aria-atomic="true"
      aria-live="polite"
      className="rounded-[28px] border border-[color:var(--border-accent)] bg-[linear-gradient(180deg,var(--surface-accent),var(--surface-soft))] px-5 py-5 shadow-[var(--shadow-soft)] sm:px-6 sm:py-6"
    >
      <div
        className={[
          "flex flex-col gap-4",
          surface === "sheet"
            ? "lg:flex-row lg:items-end lg:justify-between lg:gap-6"
            : "",
        ].join(" ")}
      >
        <div className="min-w-0 space-y-3">
          <p className="type-label">{total.label || "Final total"}</p>
          <p
            className={[
              "min-w-0 whitespace-nowrap font-semibold leading-none text-[var(--text-primary)] tabular-nums",
              getTotalValueClasses(total.value),
            ].join(" ")}
          >
            {total.value || "Awaiting selection"}
          </p>

          {contextLabel ? (
            <p className="max-w-[28ch] text-sm font-medium leading-6 text-[var(--text-secondary)]">
              {contextLabel}
            </p>
          ) : null}
        </div>

        <div className="rounded-[22px] border border-[color:var(--border-subtle)] bg-[var(--surface-strong)] px-4 py-4 sm:px-5">
          <div className="flex items-center justify-between gap-4">
            <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-[var(--text-muted)]">
              Delivery
            </p>
            <p className="whitespace-nowrap text-sm font-semibold leading-6 text-[var(--text-primary)] tabular-nums sm:text-base">
              {timeline.value || "Timeline pending"}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

function BreakdownCard({ item, surface }) {
  return (
    <article className="rounded-[24px] border border-[color:var(--border-subtle)] bg-[linear-gradient(180deg,var(--surface-contrast),var(--surface-soft))] px-4 py-4 sm:px-5">
      <div
        className={[
          "flex flex-col gap-4",
          surface === "sheet" ? "sm:flex-row sm:items-start sm:justify-between" : "",
        ].join(" ")}
      >
        <div className="min-w-0">
          {item.eyebrow ? (
            <p className="type-kicker">{item.eyebrow}</p>
          ) : null}

          <h3
            className={[
              "text-base font-semibold tracking-[-0.03em] text-[var(--text-primary)] sm:text-[1.05rem]",
              item.eyebrow ? "mt-1.5" : "",
            ]
              .filter(Boolean)
              .join(" ")}
          >
            {item.title}
          </h3>
        </div>

        {item.subtotal || item.timeline ? (
          <div className="grid gap-2 sm:min-w-[14rem] sm:grid-cols-2">
            <SummaryMetric
              label={item.subtotal?.label || "Subtotal"}
              value={item.subtotal?.value}
            />
            <SummaryMetric
              label={item.timeline?.label || "Delivery"}
              value={item.timeline?.value}
            />
          </div>
        ) : null}
      </div>

      {item.lines?.length ? (
        <dl className="mt-4 space-y-3">
          {item.lines.map((line) => (
            <SummaryLine key={`${item.id}-${line.label}`} label={line.label} value={line.value} />
          ))}
        </dl>
      ) : null}
    </article>
  );
}

export default function PricingSummarySurface({
  ctaButtonClassName = DEFAULT_CTA_BUTTON_CLASSNAME,
  ctaButtonLabel,
  headerAction = null,
  headerEyebrow = "Build Overview",
  headerTitle = "Current build",
  onInvalidAction,
  summary,
  surface = "panel",
  titleId,
}) {
  const resolvedSummary = summary ?? {};
  const {
    ctaNote,
    ctaTo,
    emptyState = {},
    isActionDisabled,
    modeLabel,
    timeline = {},
    total = {},
    validationNote,
  } = resolvedSummary;
  const contextLabel = getSummaryTopContext({
    statusLabel: resolvedSummary.statusLabel,
    total,
  });
  const { hiddenCount, items } = getSummaryBreakdownCards(resolvedSummary, {
    limit: surface === "sheet" ? 4 : 3,
  });
  const overflowNote = getSummaryBreakdownOverflowNote(
    resolvedSummary,
    hiddenCount,
  );
  const footerNote = isActionDisabled ? validationNote : ctaNote;
  const resolvedCtaLabel =
    ctaButtonLabel || getSummaryActionLabel(resolvedSummary);

  return (
    <div className="flex flex-col gap-6 px-5 py-5 sm:px-6 sm:py-6">
      <SummaryHeader
        action={headerAction}
        eyebrow={headerEyebrow}
        modeLabel={modeLabel}
        title={headerTitle}
        titleId={titleId}
      />

      <SummaryHero
        contextLabel={contextLabel}
        surface={surface}
        timeline={timeline}
        total={total}
      />

      <section className="space-y-4">
        <div className="space-y-1">
          <p className="type-label">Build breakdown</p>
          <p className="text-sm leading-6 text-[var(--text-secondary)]">
            {items.length
              ? "Selected scope grouped into a clean review snapshot."
              : emptyState.detail || "Build details appear after selection."}
          </p>
        </div>

        {items.length ? (
          <>
            <div className={getBreakdownGridClasses(surface, items.length)}>
              {items.map((item) => (
                <BreakdownCard item={item} key={item.id} surface={surface} />
              ))}
            </div>

            {overflowNote ? (
              <p className="text-sm leading-6 text-[var(--text-secondary)]">
                {overflowNote}
              </p>
            ) : null}
          </>
        ) : (
          <EmptyState detail={emptyState.detail} title={emptyState.title} />
        )}
      </section>

      <div className="rounded-[24px] border border-[color:var(--border-subtle)] bg-[var(--surface-soft)] px-4 py-4 sm:px-5">
        <div className="space-y-4">
          {footerNote ? (
            <p className="text-sm leading-6 text-[var(--text-secondary)]">
              {footerNote}
            </p>
          ) : null}

          {isActionDisabled ? (
            onInvalidAction ? (
              <Button
                className={ctaButtonClassName}
                onClick={onInvalidAction}
                size="lg"
                variant="secondary"
              >
                {resolvedCtaLabel}
              </Button>
            ) : (
              <Button
                className={ctaButtonClassName}
                disabled
                size="lg"
                variant="secondary"
              >
                {resolvedCtaLabel}
              </Button>
            )
          ) : (
            <Button
              className={ctaButtonClassName}
              size="lg"
              to={ctaTo}
              variant="primary"
            >
              {resolvedCtaLabel}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
