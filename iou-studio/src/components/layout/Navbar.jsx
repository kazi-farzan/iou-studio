import { NavLink, useLocation, useNavigate } from "react-router-dom";
import Button from "../ui/Button.jsx";
import ThemeToggleButton from "../ui/ThemeToggleButton.jsx";

const navigation = [
  { label: "Services", path: "/services" },
  { label: "Case Studies", path: "/case-studies" },
  { label: "How It Works", path: "/how-it-works" },
];

function ArrowRightIcon({ className = "h-4 w-4" }) {
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
      <path d="M5 12h14" />
      <path d="m13 6 6 6-6 6" />
    </svg>
  );
}

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();

  const getLinkClasses = ({ isActive }) =>
    [
      "shrink-0 whitespace-nowrap rounded-[18px] px-4 py-2.5 text-sm font-medium tracking-[0.01em] transition-[background-color,border-color,color,box-shadow] duration-200",
      isActive
        ? "border border-[color:var(--border-accent)] bg-[var(--surface-accent)] text-[var(--accent-contrast-text)] shadow-[var(--shadow-raised)]"
        : "border border-transparent text-[var(--text-secondary)] hover:border-[color:var(--border-subtle)] hover:bg-[var(--surface-soft)] hover:text-[var(--text-primary)]",
    ].join(" ");

  function scrollToBuilder() {
    const builderSection = document.getElementById("builder");

    if (!builderSection) {
      return;
    }

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    builderSection.scrollIntoView({
      behavior: prefersReducedMotion ? "auto" : "smooth",
      block: "start",
    });
  }

  function handleStartBuild() {
    if (location.pathname === "/pricing") {
      if (location.hash !== "#builder") {
        navigate("/pricing#builder", { replace: true });
      }

      scrollToBuilder();
      return;
    }

    navigate("/pricing#builder");
  }

  return (
    <header className="sticky top-0 z-40">
      <div className="theme-nav-shell">
        <div className="mx-auto grid w-full max-w-[84rem] grid-cols-[minmax(0,1fr)_auto] items-center gap-4 px-5 py-3.5 sm:gap-5 sm:px-8 xl:grid-cols-[auto_minmax(0,1fr)_auto] xl:gap-6 xl:px-10">
          <NavLink className="group flex min-w-0 items-center gap-3" to="/">
            <span className="theme-brand-mark flex h-11 w-11 items-center justify-center rounded-[18px]">
              <span className="text-sm font-semibold tracking-[0.18em] text-[var(--accent-solid-text)]">
                IOU
              </span>
            </span>

            <span className="min-w-0 space-y-0.5">
              <span className="block text-[0.72rem] font-semibold uppercase tracking-[0.3em] text-[var(--accent-secondary)]">
                IOU Studio
              </span>
              <span className="hidden text-sm text-[var(--text-secondary)] transition-colors duration-300 group-hover:text-[var(--text-primary)] sm:block">
                System-led digital builds
              </span>
            </span>
          </NavLink>

          <div className="flex items-center justify-end gap-2.5 sm:gap-3 xl:col-start-3 xl:row-start-1">
            <Button
              className="shrink-0 px-4"
              onClick={handleStartBuild}
              size="sm"
            >
              <span>Start Build</span>
              <ArrowRightIcon />
            </Button>
            <ThemeToggleButton />
          </div>

          <div className="col-span-2 min-w-0 xl:col-span-1 xl:col-start-2 xl:row-start-1">
            <div className="min-w-0 overflow-x-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
              <nav
                aria-label="Primary navigation"
                className="theme-nav-rail mx-auto flex w-max min-w-max items-center gap-1.5 rounded-[22px] p-1.5"
              >
                {navigation.map((item) => (
                  <NavLink
                    key={item.path}
                    className={getLinkClasses}
                    end={item.path === "/"}
                    to={item.path}
                  >
                    {item.label}
                  </NavLink>
                ))}
              </nav>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
