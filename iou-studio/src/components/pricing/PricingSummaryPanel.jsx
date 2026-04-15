import { useEffect, useMemo, useRef, useState } from "react";
import Button from "../ui/Button.jsx";
import Card from "../ui/Card.jsx";

const SUMMARY_LIST_TRANSITION_MS = 180;
const SUMMARY_FEEDBACK_MS = 420;

function getSummarySignal(values = []) {
  return values.map((value) => String(value ?? "")).join("||");
}

function getSummaryItemClasses(presenceState) {
  return [
    "grid gap-x-4 gap-y-3 border-b border-[color:var(--border-subtle)] py-4 first:pt-0 last:border-b-0 last:pb-0 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-start sm:gap-x-6 sm:gap-y-2 transition-[opacity,transform] duration-200 ease-out motion-reduce:transition-none",
    presenceState === "entering"
      ? "translate-y-1 opacity-60"
      : presenceState === "exiting"
        ? "-translate-y-1 opacity-0"
        : "translate-y-0 opacity-100",
  ].join(" ");
}

function getSettlingClasses(isSettling) {
  return [
    "transition-[opacity,transform] duration-200 ease-out motion-reduce:transition-none",
    isSettling ? "translate-y-1 opacity-75" : "translate-y-0 opacity-100",
  ].join(" ");
}

function getOutputSurfaceClasses(isActive) {
  return [
    "rounded-[26px] border px-5 py-5 sm:px-6 sm:py-6 transition-[background-color,border-color,box-shadow] duration-500 ease-out motion-reduce:transition-none",
    isActive
      ? "border-[color:var(--border-accent)] bg-[linear-gradient(180deg,var(--surface-accent),var(--surface-soft))] shadow-[var(--shadow-soft)]"
      : "border-[color:var(--border-strong)] bg-[linear-gradient(180deg,var(--surface-contrast),var(--surface-soft))]",
  ].join(" ");
}

function getTotalValueClasses(value) {
  return String(value ?? "").length > 18
    ? "text-[1.65rem] tracking-[-0.04em] sm:text-[2rem]"
    : "text-[2.2rem] tracking-[-0.06em] sm:text-[2.8rem]";
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
    () =>
      items
        .map((item) =>
          getSummarySignal([
            item.id,
            item.eyebrow,
            item.title,
            item.detail,
            item.value,
          ]),
        )
        .join("::"),
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

function SummaryList({ items }) {
  return (
    <div className="rounded-[24px] bg-[var(--surface-contrast)] px-4 sm:px-5">
      <ul>
        {items.map((item) => (
          <li className={getSummaryItemClasses(item.presenceState)} key={item.id}>
            <div className="min-w-0">
              {item.eyebrow ? (
                <p className="text-[11px] font-medium uppercase tracking-[0.22em] text-[var(--text-muted)]">
                  {item.eyebrow}
                </p>
              ) : null}

              <p
                className={[
                  "text-sm font-medium leading-6 text-[var(--text-primary)]",
                  item.eyebrow ? "mt-1.5" : "",
                ]
                  .filter(Boolean)
                  .join(" ")}
              >
                {item.title}
              </p>

              {item.detail ? (
                <p className="mt-1.5 max-w-[34ch] text-sm leading-6 text-[var(--text-secondary)]">
                  {item.detail}
                </p>
              ) : null}
            </div>

            {item.value ? (
              <p className="max-w-full break-words text-sm font-medium leading-6 text-[var(--text-primary)] sm:max-w-[11rem] sm:justify-self-end sm:text-right">
                {item.value}
              </p>
            ) : null}
          </li>
        ))}
      </ul>
    </div>
  );
}

function EmptyState({ detail, title }) {
  return (
    <div className="rounded-[24px] border border-dashed border-[color:var(--border-subtle)] bg-[var(--surface-soft)] px-5 py-7 transition-[background-color,border-color,opacity,transform] duration-200 ease-out motion-reduce:transition-none">
      <p className="text-[11px] font-medium uppercase tracking-[0.24em] text-[var(--text-muted)]">
        Awaiting selection
      </p>
      <p className="mt-3 text-sm font-medium text-[var(--text-primary)]">
        {title}
      </p>
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
      className="border-t border-[color:var(--border-subtle)] px-5 py-6 sm:px-6 sm:py-6"
    >
      <div className="space-y-4 sm:space-y-5">
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
    <div className="flex flex-wrap items-center gap-2">
      <span className="theme-panel rounded-full px-3 py-1.5 text-[11px] font-medium uppercase tracking-[0.22em] text-[var(--accent-secondary)]">
        {modeLabel}
      </span>

      {statusLabel ? (
        <span className="rounded-full border border-[color:var(--border-subtle)] bg-[var(--surface-soft)] px-3 py-1.5 text-[11px] font-medium uppercase tracking-[0.22em] text-[var(--text-muted)]">
          {statusLabel}
        </span>
      ) : null}
    </div>
  );
}

function SystemOutput({
  timeline,
  timelineFeedbackActive,
  timelineSettling,
  total,
  totalFeedbackActive,
  totalSettling,
}) {
  return (
    <div
      className={getOutputSurfaceClasses(
        totalFeedbackActive || timelineFeedbackActive,
      )}
    >
      <div className="space-y-5 sm:space-y-6">
        <div className="space-y-3">
          <p className="text-[11px] font-medium uppercase tracking-[0.22em] text-[var(--text-muted)]">
            {total.label}
          </p>

          <div className="space-y-3">
            <p
              className={[
                "max-w-full break-words font-semibold leading-none text-[var(--text-primary)] tabular-nums",
                getTotalValueClasses(total.value),
                getSettlingClasses(totalSettling),
              ].join(" ")}
            >
              {total.value}
            </p>

            {total.meta ? (
              <p
                className={[
                  "break-words text-sm font-medium leading-6 text-[var(--text-secondary)]",
                  getSettlingClasses(totalSettling),
                ].join(" ")}
              >
                {total.meta}
              </p>
            ) : null}
          </div>

          {total.description ? (
            <p className="max-w-[34ch] text-sm leading-6 text-[var(--text-secondary)]">
              {total.description}
            </p>
          ) : null}
        </div>

        <div className="border-t border-[color:var(--border-subtle)] pt-5">
          <div className="grid gap-3 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-end sm:gap-4">
            <div className="space-y-2">
              <p className="text-[11px] font-medium uppercase tracking-[0.22em] text-[var(--text-muted)]">
                {timeline.label}
              </p>

              {timeline.description ? (
                <p className="max-w-[30ch] text-sm leading-6 text-[var(--text-secondary)]">
                  {timeline.description}
                </p>
              ) : null}
            </div>

            <p
              className={[
                "max-w-full break-words text-base font-semibold leading-6 text-[var(--text-primary)] tabular-nums sm:max-w-[11rem] sm:text-right",
                getSettlingClasses(timelineSettling),
              ].join(" ")}
            >
              {timeline.value}
            </p>
          </div>
        </div>
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
  const prefersReducedMotion = usePrefersReducedMotion();
  const stagedItems = useStagedSummaryItems(items, !prefersReducedMotion);
  const itemSignal = useMemo(
    () =>
      items
        .map((item) =>
          getSummarySignal([
            item.id,
            item.eyebrow,
            item.title,
            item.detail,
            item.value,
          ]),
        )
        .join("::"),
    [items],
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
  const ctaButtonClassName =
    "w-full rounded-[18px] border-[color:var(--border-strong)] bg-[var(--surface-strong)] text-[var(--text-primary)] shadow-[var(--shadow-soft)] transition-[background-color,border-color,transform,box-shadow] duration-200 ease-out hover:border-[color:var(--border-accent)] hover:bg-[var(--surface-accent)] active:translate-y-px active:scale-[0.995] motion-reduce:transition-none";

  return (
    <Card className="overflow-hidden p-0 xl:sticky xl:top-28">
      <div className="flex flex-col">
        <div className="px-5 py-6 sm:px-6 sm:py-6">
          <div className="space-y-4 sm:space-y-5">
            <div className="space-y-2">
              <p className="text-xs font-medium uppercase tracking-[0.28em] text-[var(--accent-secondary)]">
                Build Summary
              </p>
              <h2 className="text-[1.7rem] font-semibold leading-tight tracking-[-0.04em] text-[var(--text-primary)] sm:text-2xl">
                Current setup
              </h2>
            </div>

            <SummaryMeta modeLabel={modeLabel} statusLabel={statusLabel} />

            <p className="max-w-[35ch] text-sm leading-6 text-[var(--text-secondary)]">
              {description}
            </p>
          </div>
        </div>

        <SummarySection description={selectionHint} label={selectionLabel} live>
          <div
            className={[
              "overflow-hidden transition-[opacity,transform] duration-200 ease-out motion-reduce:transition-none",
              selectionSettling
                ? "translate-y-1 opacity-85"
                : "translate-y-0 opacity-100",
            ].join(" ")}
          >
            {stagedItems.length ? (
              <SummaryList items={stagedItems} />
            ) : (
              <EmptyState detail={emptyState.detail} title={emptyState.title} />
            )}
          </div>
        </SummarySection>

        <SummarySection label="System output" live>
          <SystemOutput
            timeline={timeline}
            timelineFeedbackActive={timelineFeedbackActive}
            timelineSettling={timelineSettling}
            total={total}
            totalFeedbackActive={totalFeedbackActive}
            totalSettling={totalSettling}
          />
        </SummarySection>

        <SummarySection description={ctaNote} label="Next step">
          {isActionDisabled ? (
            <Button
              className={ctaButtonClassName}
              disabled
              size="lg"
              variant="secondary"
            >
              {ctaLabel}
            </Button>
          ) : (
            <Button
              className={ctaButtonClassName}
              size="lg"
              to="/contact"
              variant="secondary"
            >
              {ctaLabel}
            </Button>
          )}
        </SummarySection>
      </div>
    </Card>
  );
}
