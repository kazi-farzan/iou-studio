import { useEffect, useId } from "react";
import PricingSummarySurface from "./PricingSummarySurface.jsx";

const SHEET_CLOSE_BUTTON_CLASSNAME =
  "inline-flex min-h-[44px] items-center justify-center rounded-[18px] border border-[color:var(--border-subtle)] bg-[var(--surface-soft)] px-4 text-sm font-medium text-[var(--text-primary)] transition-colors duration-200 hover:border-[color:var(--border-strong)] hover:bg-[var(--surface-overlay)]";

export default function PricingSummaryBottomSheet({
  isOpen = false,
  onClose,
  onInvalidAction,
  summary,
}) {
  const titleId = useId();
  const dialogId = useId();

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
        onClose?.();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  useEffect(() => {
    if (!isOpen) {
      return undefined;
    }

    const mediaQuery = window.matchMedia("(max-width: 1279px)");
    const handleViewportChange = (event) => {
      if (event.matches) {
        onClose?.();
      }
    };

    if (typeof mediaQuery.addEventListener === "function") {
      mediaQuery.addEventListener("change", handleViewportChange);

      return () => {
        mediaQuery.removeEventListener("change", handleViewportChange);
      };
    }

    mediaQuery.addListener(handleViewportChange);

    return () => {
      mediaQuery.removeListener(handleViewportChange);
    };
  }, [isOpen, onClose]);

  function handleInvalidSelectionAction() {
    onClose?.();
    onInvalidAction?.();
  }

  return (
    <div
      className={[
        "fixed inset-0 z-40 hidden transition-opacity duration-200 ease-out motion-reduce:transition-none xl:block",
        isOpen ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0",
      ].join(" ")}
    >
      <button
        aria-label="Close build summary"
        className="absolute inset-0"
        onClick={() => onClose?.()}
        style={{
          background: "color-mix(in srgb, var(--background) 76%, transparent)",
        }}
        tabIndex={isOpen ? 0 : -1}
        type="button"
      />

      <div className="absolute inset-x-0 bottom-0 px-6 pb-6 2xl:px-8">
        <div
          className={[
            "mx-auto w-full max-w-[62rem] transition-[transform,opacity] duration-200 ease-out motion-reduce:transition-none",
            isOpen ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0",
          ].join(" ")}
        >
          <div
            aria-labelledby={titleId}
            aria-modal="true"
            className="max-h-[min(88vh,52rem)] overflow-y-auto rounded-[34px] border border-[color:var(--border-strong)] bg-[var(--surface-strong)] shadow-[var(--shadow-card)] backdrop-blur-xl"
            id={dialogId}
            role="dialog"
          >
            <div className="flex justify-center pt-3">
              <span className="h-1.5 w-14 rounded-full bg-[var(--border-strong)]" />
            </div>

            <PricingSummarySurface
              headerAction={
                <button
                  className={SHEET_CLOSE_BUTTON_CLASSNAME}
                  onClick={() => onClose?.()}
                  type="button"
                >
                  Close
                </button>
              }
              onInvalidAction={handleInvalidSelectionAction}
              surface="sheet"
              summary={summary}
              titleId={titleId}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
