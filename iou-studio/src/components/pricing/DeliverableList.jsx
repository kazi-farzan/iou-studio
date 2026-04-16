function getSurfaceClasses(surface) {
  if (surface === "contrast") {
    return "rounded-[22px] border border-[color:var(--border-subtle)] bg-[var(--surface)] px-4 py-4";
  }

  if (surface === "plain") {
    return "";
  }

  return "rounded-[22px] border border-[color:var(--border-subtle)] bg-[var(--surface-soft)] px-4 py-4";
}

function getGridClasses(sectionCount) {
  if (sectionCount > 1) {
    return "grid gap-4 sm:grid-cols-2";
  }

  return "space-y-4";
}

export default function DeliverableList({
  className = "",
  compact = false,
  label = "Deliverables",
  maxItemsPerSection = null,
  sections = [],
  surface = "soft",
}) {
  if (!sections.length) {
    return null;
  }

  return (
    <div
      className={[getSurfaceClasses(surface), className].filter(Boolean).join(" ")}
    >
      {label ? (
        <p
          className={
            compact
              ? "text-[10px] font-medium uppercase tracking-[0.2em] text-[var(--text-muted)]"
              : "text-[11px] font-medium uppercase tracking-[0.22em] text-[var(--text-muted)]"
          }
        >
          {label}
        </p>
      ) : null}

      <div className={[label ? "mt-3" : "", getGridClasses(sections.length)].join(" ")}>
        {sections.map((section) => {
          const items =
            maxItemsPerSection && maxItemsPerSection > 0
              ? section.items.slice(0, maxItemsPerSection)
              : section.items;

          if (!items.length) {
            return null;
          }

          return (
            <div key={section.id || section.key || section.label}>
              <p
                className={
                  compact
                    ? "text-[10px] font-medium uppercase tracking-[0.18em] text-[var(--accent-secondary)]"
                    : "text-[11px] font-medium uppercase tracking-[0.2em] text-[var(--accent-secondary)]"
                }
              >
                {section.label}
              </p>

              <ul className={compact ? "mt-2 space-y-1.5" : "mt-2 space-y-2"}>
                {items.map((item) => (
                  <li className="flex items-start gap-2" key={item}>
                    <span className="theme-dot mt-2 h-1.5 w-1.5 shrink-0 rounded-full" />
                    <span
                      className={
                        compact
                          ? "text-sm leading-6 text-[var(--text-secondary)]"
                          : "text-sm leading-6 text-[var(--text-secondary)]"
                      }
                    >
                      {item}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>
    </div>
  );
}
