import { useTheme } from "../../theme/useTheme.js";

function SunIcon({ className = "h-4 w-4" }) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.8"
      viewBox="0 0 24 24"
    >
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2.5v2.5M12 19v2.5M4.93 4.93l1.77 1.77M17.3 17.3l1.77 1.77M2.5 12H5M19 12h2.5M4.93 19.07l1.77-1.77M17.3 6.7l1.77-1.77" />
    </svg>
  );
}

function MoonIcon({ className = "h-4 w-4" }) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.8"
      viewBox="0 0 24 24"
    >
      <path d="M20.5 14.2A8.5 8.5 0 0 1 9.8 3.5a8.5 8.5 0 1 0 10.7 10.7Z" />
    </svg>
  );
}

export default function ThemeToggleButton() {
  const { isDark, toggleTheme } = useTheme();
  const modeLabel = isDark ? "Light mode" : "Dark mode";

  return (
    <div className="group relative flex shrink-0">
      <button
        aria-label={`Switch to ${modeLabel.toLowerCase()}`}
        aria-pressed={isDark}
        className="theme-toggle inline-flex h-11 w-11 items-center justify-center rounded-full text-[var(--accent-secondary)] transition-all duration-300 hover:scale-[1.03] hover:text-[var(--text-primary)] hover:shadow-[0_16px_40px_-22px_var(--accent-glow)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--accent-ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--background)]"
        onClick={toggleTheme}
        title={modeLabel}
        type="button"
      >
        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--surface-strong)] text-current transition-all duration-300 group-hover:bg-[var(--surface-accent)] group-hover:text-[var(--accent-contrast-text)] group-focus-within:bg-[var(--surface-accent)] group-focus-within:text-[var(--accent-contrast-text)]">
          {isDark ? (
            <SunIcon className="h-4 w-4 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-[14deg] group-focus-within:scale-110 group-focus-within:rotate-[14deg]" />
          ) : (
            <MoonIcon className="h-4 w-4 transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-[12deg] group-focus-within:scale-110 group-focus-within:-rotate-[12deg]" />
          )}
        </span>
      </button>

      <span className="pointer-events-none absolute left-1/2 top-full z-10 mt-2 -translate-x-1/2 translate-y-1 whitespace-nowrap rounded-full border border-[color:var(--border-subtle)] bg-[var(--surface-strong)] px-3 py-1 text-xs font-medium text-[var(--text-primary)] opacity-0 shadow-[var(--shadow-soft)] backdrop-blur-xl transition-all duration-200 group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:translate-y-0 group-focus-within:opacity-100">
        {modeLabel}
      </span>
    </div>
  );
}
