import { useEffect, useId, useMemo, useState } from "react";
import Button from "../ui/Button.jsx";
import PricingSummarySurface from "./PricingSummarySurface.jsx";
import { getSummaryActionLabel } from "./pricingSummaryHelpers.js";

const MOBILE_BAR_CTA_CLASSNAME =
  "min-w-[6.25rem] rounded-[18px] border-[color:var(--border-strong)] bg-[var(--surface-muted)] px-4 text-[var(--text-primary)] shadow-none hover:border-[color:var(--border-accent)] hover:bg-[var(--surface-accent)]";
const SHEET_CLOSE_BUTTON_CLASSNAME =
  "inline-flex min-h-[44px] items-center justify-center rounded-full border border-[color:var(--border-subtle)] bg-[var(--surface-soft)] px-4 text-sm font-medium text-[var(--text-primary)] transition-colors duration-200 hover:border-[color:var(--border-accent)] hover:bg-[var(--surface-accent)]";

function getCollapsedStatusLine(summary) {
  const parts = [summary.modeLabel, summary.statusLabel].filter(Boolean);

  return parts.join(" / ");
}

export default function MobilePricingSummaryBar({
  onInvalidAction,
  summary,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const titleId = useId();
  const dialogId = useId();
  const compactActionLabel = getSummaryActionLabel(summary, true);
  const expandedActionLabel = getSummaryActionLabel(summary);
  const statusLine = useMemo(() => getCollapsedStatusLine(summary), [summary]);

  useEffect(() => {
    if (!isOpen) {
      return undefined;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) {
      return undefined;
    }

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  function handleInvalidSelectionAction() {
    setIsOpen(false);
    onInvalidAction?.();
  }

  return (
    <>
      <div className="fixed inset-x-0 bottom-0 z-40 px-4 pb-[calc(0.75rem+env(safe-area-inset-bottom))] xl:hidden">
        <div className="mx-auto w-full max-w-5xl">
          <div className="overflow-hidden rounded-[24px] border border-[color:var(--border-strong)] bg-[var(--nav-background)] backdrop-blur-xl">
            <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 px-4 py-3 sm:px-5">
              <button
                aria-controls={dialogId}
                aria-expanded={isOpen}
                className="min-w-0 text-left"
                onClick={() => setIsOpen(true)}
                type="button"
              >
                <div className="flex flex-wrap items-center gap-2">
                  <p className="text-[11px] font-medium uppercase tracking-[0.24em] text-[var(--accent-secondary)]">
                    Build Summary
                  </p>

                  {statusLine ? (
                    <p className="truncate text-[11px] uppercase tracking-[0.18em] text-[var(--text-muted)]">
                      {statusLine}
                    </p>
                  ) : null}
                </div>

                <div className="mt-2 grid grid-cols-2 gap-3">
                  <div className="min-w-0">
                    <p className="text-[11px] uppercase tracking-[0.2em] text-[var(--text-muted)]">
                      {summary.total.label}
                    </p>
                    <p className="mt-1 truncate text-sm font-semibold text-[var(--text-primary)] tabular-nums sm:text-base">
                      {summary.total.value}
                    </p>
                  </div>

                  <div className="min-w-0">
                    <p className="text-[11px] uppercase tracking-[0.2em] text-[var(--text-muted)]">
                      {summary.timeline.label}
                    </p>
                    <p className="mt-1 truncate text-sm font-semibold text-[var(--text-primary)] tabular-nums sm:text-base">
                      {summary.timeline.value}
                    </p>
                  </div>
                </div>
              </button>

              {summary.isActionDisabled ? (
                <Button
                  className={MOBILE_BAR_CTA_CLASSNAME}
                  onClick={handleInvalidSelectionAction}
                  size="md"
                  variant="secondary"
                >
                  {compactActionLabel}
                </Button>
              ) : (
                <Button
                  className={MOBILE_BAR_CTA_CLASSNAME}
                  size="md"
                  to={summary.ctaTo}
                  variant="secondary"
                >
                  {compactActionLabel}
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>

      <div
        className={[
          "fixed inset-0 z-50 xl:hidden transition-opacity duration-200 ease-out motion-reduce:transition-none",
          isOpen ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0",
        ].join(" ")}
      >
        <button
          aria-label="Close build summary"
          className="absolute inset-0"
          onClick={() => setIsOpen(false)}
          style={{
            background: "color-mix(in srgb, var(--background) 78%, transparent)",
          }}
          tabIndex={isOpen ? 0 : -1}
          type="button"
        />

        <div className="absolute inset-x-0 bottom-0 px-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))] sm:px-4">
          <div
            className={[
              "mx-auto w-full max-w-3xl transition-[transform,opacity] duration-200 ease-out motion-reduce:transition-none",
              isOpen ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0",
            ].join(" ")}
          >
            <div
              aria-labelledby={titleId}
              aria-modal="true"
              className="overflow-hidden rounded-[30px] border border-[color:var(--border-strong)] bg-[var(--surface-strong)] shadow-[var(--shadow-card)] backdrop-blur-xl"
              id={dialogId}
              role="dialog"
            >
              <div className="flex justify-center pt-3">
                <span className="h-1.5 w-12 rounded-full bg-[var(--border-strong)]" />
              </div>

              <div className="max-h-[min(78vh,42rem)] overflow-y-auto">
                <PricingSummarySurface
                  ctaButtonLabel={expandedActionLabel}
                  headerAction={
                    <button
                      className={SHEET_CLOSE_BUTTON_CLASSNAME}
                      onClick={() => setIsOpen(false)}
                      type="button"
                    >
                      Close
                    </button>
                  }
                  onInvalidAction={handleInvalidSelectionAction}
                  summary={summary}
                  titleId={titleId}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
