import { useTheme } from "../../theme/useTheme.js";

function SunIcon() {
  return (
    <svg
      aria-hidden="true"
      className="h-4 w-4"
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

function MoonIcon() {
  return (
    <svg
      aria-hidden="true"
      className="h-4 w-4"
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

  return (
    <button
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      className="theme-toggle inline-flex h-11 items-center gap-2 rounded-full px-4 text-sm font-medium text-[var(--text-primary)] transition-all duration-300 hover:text-[var(--accent-contrast-text)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--accent-ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--background)]"
      onClick={toggleTheme}
      type="button"
    >
      <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[var(--surface-strong)] text-[var(--accent-secondary)]">
        {isDark ? <SunIcon /> : <MoonIcon />}
      </span>
      <span className="hidden sm:inline">{isDark ? "Light mode" : "Dark mode"}</span>
    </button>
  );
}
