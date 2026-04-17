import { useMemo } from "react";
import {
  getCompactSummaryTimeline,
  getCompactSummaryTotal,
  hasActiveSummarySelection,
} from "./pricingSummaryHelpers.js";

function SummaryGlyph() {
  return (
    <svg
      aria-hidden="true"
      className="h-4 w-4"
      fill="none"
      viewBox="0 0 20 20"
    >
      <rect
        height="8"
        rx="2"
        stroke="currentColor"
        strokeWidth="1.5"
        width="8"
        x="3"
        y="3"
      />
      <rect
        height="8"
        rx="2"
        stroke="currentColor"
        strokeWidth="1.5"
        width="8"
        x="9"
        y="9"
      />
    </svg>
  );
}

export default function StickyPricingSummaryPill({
  isOpen = false,
  isVisible = false,
  onClick,
  summary,
}) {
  const compactTotal = useMemo(() => getCompactSummaryTotal(summary), [summary]);
  const compactTimeline = useMemo(
    () => getCompactSummaryTimeline(summary),
    [summary],
  );
  const hasSelection = hasActiveSummarySelection(summary);

  if (!hasSelection || !compactTotal || !compactTimeline) {
    return null;
  }

  return (
    <div
      className={[
        "fixed bottom-6 right-6 z-30 hidden transition-[opacity,transform] duration-200 ease-out motion-reduce:transition-none xl:block",
        isVisible
          ? "pointer-events-auto translate-y-0 opacity-100"
          : "pointer-events-none translate-y-2 opacity-0",
      ].join(" ")}
    >
      <button
        aria-expanded={isOpen}
        aria-label={`Open current build summary. ${compactTotal}, ${compactTimeline}.`}
        className={[
          "flex items-center gap-3 rounded-full border px-3 py-2.5 shadow-[var(--shadow-card)] backdrop-blur-xl transition-[transform,border-color,background-color,box-shadow] duration-200 ease-out motion-reduce:transition-none",
          isOpen
            ? "border-[color:var(--border-accent)] bg-[var(--surface-strong)]"
            : "border-[color:var(--border-strong)] bg-[var(--nav-background)] hover:-translate-y-0.5 hover:border-[color:var(--border-accent)]",
        ].join(" ")}
        onClick={onClick}
        type="button"
      >
        <span className="flex h-9 w-9 items-center justify-center rounded-full border border-[color:var(--border-subtle)] bg-[var(--surface-soft)] text-[var(--accent-secondary)]">
          <SummaryGlyph />
        </span>

        <span className="flex items-center gap-2">
          <span className="text-sm font-semibold text-[var(--text-primary)] tabular-nums">
            {compactTotal}
          </span>
          <span className="h-1 w-1 rounded-full bg-[var(--border-strong)]" />
          <span className="text-sm font-medium text-[var(--text-secondary)] tabular-nums">
            {compactTimeline}
          </span>
        </span>
      </button>
    </div>
  );
}
