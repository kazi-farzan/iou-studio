import { useEffect, useMemo, useRef, useState } from "react";
import Button from "../ui/Button.jsx";
import DeliverableList from "./DeliverableList.jsx";
import SummaryBreakdownPanel from "./SummaryBreakdownPanel.jsx";
import {
  getSummaryActionLabel,
  getSummaryBreakdownDescription,
  getSummaryDeliverablePreview,
  getSummaryDeliverableSections,
  getSummarySetup,
  getSummaryTimelineBreakdown,
  getSummaryTopContext,
} from "./pricingSummaryHelpers.js";

const SUMMARY_LIST_TRANSITION_MS = 180;
const SUMMARY_FEEDBACK_MS = 420;
const DEFAULT_CTA_BUTTON_CLASSNAME = "w-full";

function getSummarySignal(values = []) {
  return values.map((value) => String(value ?? "")).join("||");
}

function getSettlingClasses(isSettling) {
  return [
    "transition-[opacity,transform] duration-200 ease-out motion-reduce:transition-none",
    isSettling ? "translate-y-1 opacity-75" : "translate-y-0 opacity-100",
  ].join(" ");
}

function getOverviewSurfaceClasses(isActive) {
  return [
    "rounded-[28px] border px-5 py-5 sm:px-6 sm:py-6 transition-[background-color,border-color,box-shadow] duration-500 ease-out motion-reduce:transition-none",
    isActive
      ? "border-[color:var(--border-accent)] bg-[linear-gradient(180deg,var(--surface-accent),var(--surface-soft))] shadow-[var(--shadow-soft)]"
      : "border-[color:var(--border-strong)] bg-[linear-gradient(180deg,var(--surface-contrast),var(--surface-soft))]",
  ].join(" ");
}

function getTotalValueClasses(value) {
  return String(value ?? "").length > 18
    ? "text-[1.8rem] tracking-[-0.04em] sm:text-[2.2rem]"
    : "text-[2.4rem] tracking-[-0.06em] sm:text-[3rem]";
}

function getSummaryGroupSignal(group) {
  return getSummarySignal([
    group.id,
    group.eyebrow,
    group.title,
    group.description,
    group.rowsLabel,
    group.deliverables?.label,
    group.subtotal?.label,
    group.subtotal?.value,
    group.timeline?.label,
    group.timeline?.value,
    ...(group.rows ?? []).map((row) =>
      getSummarySignal([
        row.id,
        row.eyebrow,
        row.label,
        row.detail,
        row.outputSummary,
        row.priceLabel,
        row.timelineLabel,
      ]),
    ),
  ]);
}

function toStableSummaryItems(items) {
  return items.map((item, index) => ({
    ...item,
    presenceState: "stable",
    sortIndex: index,
  }));
}

function usePrefersReducedMotion() {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const updatePreference = () => {
      setPrefersReducedMotion(mediaQuery.matches);
    };

    updatePreference();

    if (typeof mediaQuery.addEventListener === "function") {
      mediaQuery.addEventListener("change", updatePreference);

      return () => {
        mediaQuery.removeEventListener("change", updatePreference);
      };
    }

    mediaQuery.addListener(updatePreference);

    return () => {
      mediaQuery.removeListener(updatePreference);
    };
  }, []);

  return prefersReducedMotion;
}

function useFeedbackPulse(signal, enabled, duration = SUMMARY_FEEDBACK_MS) {
  const [isActive, setIsActive] = useState(false);
  const isFirstRender = useRef(true);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return undefined;
    }

    if (!enabled) {
      return undefined;
    }

    let activateFrameId = 0;
    let timeoutId = 0;

    activateFrameId = window.requestAnimationFrame(() => {
      setIsActive(true);
      timeoutId = window.setTimeout(() => {
        setIsActive(false);
      }, duration);
    });

    return () => {
      window.cancelAnimationFrame(activateFrameId);
      window.clearTimeout(timeoutId);
    };
  }, [duration, enabled, signal]);

  return enabled && isActive;
}

function useSettlingChange(signal, enabled) {
  const [isSettling, setIsSettling] = useState(false);
  const isFirstRender = useRef(true);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return undefined;
    }

    if (!enabled) {
      return undefined;
    }

    let activateFrameId = 0;
    let releaseFrameId = 0;

    activateFrameId = window.requestAnimationFrame(() => {
      setIsSettling(true);
      releaseFrameId = window.requestAnimationFrame(() => {
        setIsSettling(false);
      });
    });

    return () => {
      window.cancelAnimationFrame(activateFrameId);
      window.cancelAnimationFrame(releaseFrameId);
    };
  }, [enabled, signal]);

  return enabled && isSettling;
}

function useStagedSummaryItems(items, enabled) {
  const itemsSignature = useMemo(
    () => items.map(getSummaryGroupSignal).join("::"),
    [items],
  );
  const stableItems = useMemo(() => toStableSummaryItems(items), [items]);
  const [stagedItems, setStagedItems] = useState(() => stableItems);
  const isFirstRender = useRef(true);

  useEffect(() => {
    if (!enabled) {
      isFirstRender.current = false;
      const frameId = window.requestAnimationFrame(() => {
        setStagedItems(stableItems);
      });

      return () => {
        window.cancelAnimationFrame(frameId);
      };
    }

    if (isFirstRender.current) {
      isFirstRender.current = false;
      return undefined;
    }

    let applyFrameId = 0;
    let settleFrameId = 0;
    let timeoutId = 0;

    applyFrameId = window.requestAnimationFrame(() => {
      setStagedItems((current) => {
        const currentIds = new Set(current.map((entry) => entry.id));
        const nextIndexMap = new Map(
          items.map((item, index) => [item.id, index]),
        );

        const mergedItems = current.map((entry, index) => {
          const nextIndex = nextIndexMap.get(entry.id);

          if (nextIndex === undefined) {
            return {
              ...entry,
              presenceState: "exiting",
              sortIndex: index - 0.1,
            };
          }

          return {
            ...entry,
            ...items[nextIndex],
            presenceState: "stable",
            sortIndex: nextIndex,
          };
        });

        const enteringItems = items
          .filter((item) => !currentIds.has(item.id))
          .map((item, index) => ({
            ...item,
            presenceState: "entering",
            sortIndex: nextIndexMap.get(item.id) ?? index,
          }));

        return [...mergedItems, ...enteringItems].sort(
          (left, right) => left.sortIndex - right.sortIndex,
        );
      });

      settleFrameId = window.requestAnimationFrame(() => {
        setStagedItems((current) =>
          current.map((entry) =>
            entry.presenceState === "entering"
              ? { ...entry, presenceState: "stable" }
              : entry,
          ),
        );
      });

      timeoutId = window.setTimeout(() => {
        setStagedItems((current) =>
          current.filter((entry) => entry.presenceState !== "exiting"),
        );
      }, SUMMARY_LIST_TRANSITION_MS);
    });

    return () => {
      window.cancelAnimationFrame(applyFrameId);
      window.cancelAnimationFrame(settleFrameId);
      window.clearTimeout(timeoutId);
    };
  }, [enabled, items, itemsSignature, stableItems]);

  return enabled ? stagedItems : stableItems;
}

function EmptyState({ detail, title }) {
  return (
    <div className="rounded-[24px] border border-dashed border-[color:var(--border-subtle)] bg-[var(--surface-soft)] px-4 py-5">
      <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-[var(--text-muted)]">
        Awaiting selection
      </p>
      <p className="mt-2 text-sm font-medium text-[var(--text-primary)]">
        {title}
      </p>
      <p className="mt-2 text-sm leading-6 text-[var(--text-secondary)]">
        {detail}
      </p>
    </div>
  );
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
        "rounded-full border px-3 py-1.5 text-[10px] font-medium uppercase tracking-[0.18em]",
        toneClasses,
      ].join(" ")}
    >
      {value}
    </span>
  );
}

function SectionShell({
  action = null,
  children,
  description,
  live = false,
  title,
}) {
  return (
    <section
      aria-atomic={live ? "true" : undefined}
      aria-live={live ? "polite" : undefined}
      className="px-5 py-5 sm:px-6 sm:py-6"
    >
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="type-label">
            {title}
          </p>

          {description ? (
            <p className="mt-2 max-w-[34ch] text-sm leading-6 text-[var(--text-secondary)]">
              {description}
            </p>
          ) : null}
        </div>

        {action ? <div className="shrink-0">{action}</div> : null}
      </div>

      <div className="mt-4">{children}</div>
    </section>
  );
}

function DisclosureButton({
  expanded,
  onClick,
  collapsedLabel = "Show details",
  expandedLabel = "Hide details",
}) {
  return (
    <button
      aria-expanded={expanded}
      className="text-[10px] font-medium uppercase tracking-[0.2em] text-[var(--accent-secondary)] transition-colors duration-200 hover:text-[var(--text-primary)]"
      onClick={onClick}
      type="button"
    >
      {expanded ? expandedLabel : collapsedLabel}
    </button>
  );
}

function PreviewSurface({ children }) {
  return (
    <div className="rounded-[22px] border border-[color:var(--border-subtle)] bg-[var(--surface-soft)] px-4 py-4">
      <p className="text-sm leading-6 text-[var(--text-primary)]">
        {children}
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
    <div className="border-b border-[color:var(--border-subtle)] px-5 py-5 sm:px-6 sm:py-6">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0 space-y-3">
          <div className="space-y-2">
            <p className="type-kicker">
              {eyebrow}
            </p>
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
    </div>
  );
}

function SummaryOverview({
  contextLabel,
  timeline,
  timelineFeedbackActive,
  timelineSettling,
  total,
  totalFeedbackActive,
  totalSettling,
}) {
  return (
    <div
      aria-atomic="true"
      aria-live="polite"
      className={getOverviewSurfaceClasses(
        totalFeedbackActive || timelineFeedbackActive,
      )}
    >
      <div className="space-y-5">
        <div className="space-y-3">
          <p className="type-label">
            {total.label}
          </p>

          <p
            className={[
              "break-words font-semibold leading-none text-[var(--text-primary)] tabular-nums",
              getTotalValueClasses(total.value),
              getSettlingClasses(totalSettling),
            ].join(" ")}
          >
            {total.value}
          </p>

          {contextLabel ? (
            <p
              className={[
                "text-sm font-medium leading-6 text-[var(--text-secondary)]",
                getSettlingClasses(totalSettling),
              ].join(" ")}
            >
              {contextLabel}
            </p>
          ) : null}
        </div>

        <div className="flex items-end justify-between gap-4 border-t border-[color:var(--border-subtle)] pt-4">
          <div className="space-y-1">
            <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-[var(--text-muted)]">
              {timeline.label}
            </p>
            <p className="text-sm leading-6 text-[var(--text-secondary)]">
              Current delivery estimate
            </p>
          </div>

          <p
            className={[
              "max-w-[11rem] text-right text-base font-semibold leading-6 text-[var(--text-primary)] tabular-nums",
              getSettlingClasses(timelineSettling),
            ].join(" ")}
          >
            {timeline.value}
          </p>
        </div>
      </div>
    </div>
  );
}

function CurrentSetupSection({ setup, statusLabel }) {
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        <SurfaceBadge value={statusLabel} />
      </div>

      <div className="space-y-2">
        <p className="text-lg font-semibold tracking-[-0.02em] text-[var(--text-primary)]">
          {setup.title}
        </p>

        {setup.detail ? (
          <p className="text-sm leading-6 text-[var(--text-secondary)]">
            {setup.detail}
          </p>
        ) : null}
      </div>

      {setup.items?.length ? (
        <div className="flex flex-wrap gap-2">
          {setup.items.slice(0, 4).map((item) => (
            <SurfaceBadge key={item} value={item} />
          ))}

          {setup.items.length > 4 ? (
            <SurfaceBadge value={`+${setup.items.length - 4} more`} />
          ) : null}
        </div>
      ) : null}
    </div>
  );
}

function TimelineBreakdownList({ items = [] }) {
  return (
    <div className="rounded-[22px] border border-[color:var(--border-subtle)] bg-[var(--surface-soft)] px-4 py-4">
      <div className="space-y-3">
        {items.map((item, index) => (
          <div
            className={[
              "grid gap-2 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-start sm:gap-4",
              index ? "border-t border-[color:var(--border-subtle)] pt-3" : "",
            ].join(" ")}
            key={item.id}
          >
            <div>
              <p className="text-sm font-medium text-[var(--text-primary)]">
                {item.label}
              </p>
              {item.detail ? (
                <p className="mt-1 text-sm leading-6 text-[var(--text-secondary)]">
                  {item.detail}
                </p>
              ) : null}
            </div>

            <p className="text-sm font-semibold text-[var(--text-primary)] tabular-nums sm:text-right">
              {item.value}
            </p>
          </div>
        ))}
      </div>
    </div>
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
  titleId,
}) {
  const resolvedSummary = summary ?? {};
  const {
    ctaNote,
    ctaTo,
    emptyState = {},
    groups = [],
    isActionDisabled,
    modeLabel,
    statusLabel,
    timeline = {},
    total = {},
    validationNote,
  } = resolvedSummary;
  const prefersReducedMotion = usePrefersReducedMotion();
  const stagedItems = useStagedSummaryItems(groups, !prefersReducedMotion);
  const [isDeliverablesExpanded, setIsDeliverablesExpanded] = useState(false);
  const [isTimelineExpanded, setIsTimelineExpanded] = useState(false);
  const itemSignal = useMemo(
    () => groups.map(getSummaryGroupSignal).join("::"),
    [groups],
  );
  const totalSignal = useMemo(
    () =>
      getSummarySignal([
        total.label,
        total.value,
        total.meta,
        total.description,
      ]),
    [total.description, total.label, total.meta, total.value],
  );
  const timelineSignal = useMemo(
    () =>
      getSummarySignal([
        timeline.label,
        timeline.value,
        timeline.description,
      ]),
    [timeline.description, timeline.label, timeline.value],
  );
  const selectionSettling = useSettlingChange(itemSignal, !prefersReducedMotion);
  const totalSettling = useSettlingChange(totalSignal, !prefersReducedMotion);
  const timelineSettling = useSettlingChange(
    timelineSignal,
    !prefersReducedMotion,
  );
  const totalFeedbackActive = useFeedbackPulse(
    totalSignal,
    !prefersReducedMotion,
  );
  const timelineFeedbackActive = useFeedbackPulse(
    timelineSignal,
    !prefersReducedMotion,
  );
  const setup = useMemo(
    () => getSummarySetup({ emptyState, groups, modeLabel }),
    [emptyState, groups, modeLabel],
  );
  const breakdownDescription = useMemo(
    () => getSummaryBreakdownDescription({ emptyState, groups, modeLabel }),
    [emptyState, groups, modeLabel],
  );
  const topContext = useMemo(
    () => getSummaryTopContext({ statusLabel, total }),
    [statusLabel, total],
  );
  const deliverableSections = useMemo(
    () => getSummaryDeliverableSections({ groups }),
    [groups],
  );
  const deliverablePreview = useMemo(
    () => getSummaryDeliverablePreview({ emptyState, groups }),
    [emptyState, groups],
  );
  const timelineBreakdown = useMemo(
    () => getSummaryTimelineBreakdown({ groups }),
    [groups],
  );
  const resolvedCtaLabel =
    ctaButtonLabel || getSummaryActionLabel(resolvedSummary);
  const timelineSectionDescription = timelineBreakdown.length
    ? `${timelineBreakdown.length} grouped estimate${
        timelineBreakdown.length === 1 ? "" : "s"
      } ready to inspect.`
    : timeline.description || "Timeline updates appear after selection.";

  useEffect(() => {
    if (!deliverableSections.length) {
      setIsDeliverablesExpanded(false);
    }
  }, [deliverableSections.length]);

  useEffect(() => {
    if (!timelineBreakdown.length) {
      setIsTimelineExpanded(false);
    }
  }, [timelineBreakdown.length]);

  return (
    <div className="flex h-full min-h-0 flex-col">
      <SummaryHeader
        action={headerAction}
        eyebrow={headerEyebrow}
        modeLabel={modeLabel}
        title={headerTitle}
        titleId={titleId}
      />

      <div className="flex-1 min-h-0 overflow-y-auto">
        <div className="sticky top-0 z-10 border-b border-[color:var(--border-subtle)] bg-[var(--surface-strong)] px-5 py-5 sm:px-6 sm:py-6">
          <SummaryOverview
            contextLabel={topContext}
            timeline={timeline}
            timelineFeedbackActive={timelineFeedbackActive}
            timelineSettling={timelineSettling}
            total={total}
            totalFeedbackActive={totalFeedbackActive}
            totalSettling={totalSettling}
          />
        </div>

        <div className="divide-y divide-[color:var(--border-subtle)]">
          <SectionShell live title="Current setup">
            {groups.length ? (
              <div
                className={[
                  "transition-[opacity,transform] duration-200 ease-out motion-reduce:transition-none",
                  selectionSettling
                    ? "translate-y-1 opacity-85"
                    : "translate-y-0 opacity-100",
                ].join(" ")}
              >
                <CurrentSetupSection setup={setup} statusLabel={statusLabel} />
              </div>
            ) : (
              <EmptyState detail={emptyState.detail} title={emptyState.title} />
            )}
          </SectionShell>

          <SectionShell description={breakdownDescription} live title="Build breakdown">
            {stagedItems.length ? (
              <div
                className={[
                  "transition-[opacity,transform] duration-200 ease-out motion-reduce:transition-none",
                  selectionSettling
                    ? "translate-y-1 opacity-85"
                    : "translate-y-0 opacity-100",
                ].join(" ")}
              >
                <SummaryBreakdownPanel groups={stagedItems} />
              </div>
            ) : (
              <EmptyState detail={emptyState.detail} title={emptyState.title} />
            )}
          </SectionShell>

          <SectionShell
            action={
              deliverableSections.length ? (
                <DisclosureButton
                  collapsedLabel="Show full list"
                  expanded={isDeliverablesExpanded}
                  expandedLabel="Hide full list"
                  onClick={() =>
                    setIsDeliverablesExpanded((current) => !current)
                  }
                />
              ) : null
            }
            description={
              deliverableSections.length
                ? `${deliverableSections.length} grouped output section${
                    deliverableSections.length === 1 ? "" : "s"
                  }.`
                : "Deliverables appear after selection."
            }
            title="Deliverables"
          >
            {deliverableSections.length ? (
              <div className="space-y-4">
                <PreviewSurface>{deliverablePreview}</PreviewSurface>

                {isDeliverablesExpanded ? (
                  <div className="rounded-[22px] border border-[color:var(--border-subtle)] bg-[var(--surface-soft)] px-4 py-4">
                    <DeliverableList
                      label=""
                      sections={deliverableSections}
                      surface="plain"
                    />
                  </div>
                ) : null}
              </div>
            ) : (
              <EmptyState
                detail="Deliverables will populate as soon as a package or module is active."
                title="No deliverables yet."
              />
            )}
          </SectionShell>

          <SectionShell
            action={
              timelineBreakdown.length ? (
                <DisclosureButton
                  expanded={isTimelineExpanded}
                  onClick={() => setIsTimelineExpanded((current) => !current)}
                />
              ) : null
            }
            description={timelineSectionDescription}
            title="Timeline"
          >
            {timelineBreakdown.length ? (
              <div className="space-y-4">
                <PreviewSurface>
                  {timelineBreakdown.length === 1
                    ? `Grouped timing is available for ${timelineBreakdown[0].label}.`
                    : `${timelineBreakdown.length} grouped timing windows are available for review.`}
                </PreviewSurface>

                {isTimelineExpanded ? (
                  <TimelineBreakdownList items={timelineBreakdown} />
                ) : null}
              </div>
            ) : (
              <PreviewSurface>
                {timeline.description || "Timeline updates appear after selection."}
              </PreviewSurface>
            )}
          </SectionShell>
        </div>
      </div>

      <div className="border-t border-[color:var(--border-subtle)] bg-[var(--surface-strong)] px-5 py-5 sm:px-6 sm:py-6">
        <div className="space-y-4">
          {isActionDisabled && validationNote ? (
            <div className="rounded-[22px] border border-[color:var(--border-subtle)] bg-[var(--surface-soft)] px-4 py-3">
              <p className="text-sm leading-6 text-[var(--text-secondary)]">
                {validationNote}
              </p>
            </div>
          ) : ctaNote ? (
            <p className="text-sm leading-6 text-[var(--text-secondary)]">
              {ctaNote}
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
