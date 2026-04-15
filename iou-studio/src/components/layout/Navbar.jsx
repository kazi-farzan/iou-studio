import { NavLink, useLocation, useNavigate } from "react-router-dom";
import Button from "../ui/Button.jsx";
import ThemeToggleButton from "../ui/ThemeToggleButton.jsx";

const navigation = [
  { label: "Home", path: "/" },
  { label: "Services", path: "/services" },
  { label: "Pricing", path: "/pricing" },
  { label: "Products", path: "/products" },
  { label: "Portfolio", path: "/portfolio" },
  { label: "About", path: "/about" },
  { label: "Contact", path: "/contact" },
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
      "shrink-0 whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium tracking-[0.01em] transition-all duration-300",
      isActive
        ? "border border-[color:var(--border-accent)] bg-[var(--surface-accent)] text-[var(--accent-contrast-text)] shadow-[var(--shadow-accent)]"
        : "text-[var(--text-secondary)] hover:bg-[var(--surface-accent)] hover:text-[var(--text-primary)]",
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

  function handleStartBuilding() {
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
        <div className="mx-auto grid w-full max-w-7xl grid-cols-[minmax(0,1fr)_auto] items-center gap-4 px-5 py-4 sm:gap-5 sm:px-8 xl:grid-cols-[auto_minmax(0,1fr)_auto] xl:gap-6 xl:px-10">
          <NavLink className="group flex min-w-0 items-center gap-3" to="/">
            <span className="theme-brand-mark flex h-11 w-11 items-center justify-center rounded-2xl">
              <span className="text-sm font-semibold tracking-[0.18em] text-[var(--accent-solid-text)]">
                IOU
              </span>
            </span>

            <span className="min-w-0 space-y-0.5">
              <span className="block text-sm uppercase tracking-[0.28em] text-[var(--accent-secondary)]">
                IOU Studio
              </span>
              <span className="hidden text-sm text-[var(--text-secondary)] transition-colors duration-300 group-hover:text-[var(--text-primary)] sm:block">
                Tech-driven creative systems
              </span>
            </span>
          </NavLink>

          <div className="flex items-center justify-end gap-2.5 sm:gap-3 xl:col-start-3 xl:row-start-1">
            <Button
              className="shrink-0 gap-2 px-4 active:translate-y-px active:brightness-95"
              onClick={handleStartBuilding}
              size="sm"
            >
              <span>Start Building</span>
              <ArrowRightIcon />
            </Button>
            <ThemeToggleButton />
          </div>

          <div className="col-span-2 min-w-0 xl:col-span-1 xl:col-start-2 xl:row-start-1">
            <div className="min-w-0 overflow-x-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
              <nav
                aria-label="Primary navigation"
                className="theme-nav-rail mx-auto flex w-max min-w-max items-center gap-1.5 rounded-full p-1.5"
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
