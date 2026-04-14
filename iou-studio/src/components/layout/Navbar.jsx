import { NavLink } from "react-router-dom";
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

export default function Navbar() {
  const getLinkClasses = ({ isActive }) =>
    [
      "rounded-full px-4 py-2 text-sm font-medium tracking-[0.01em] transition-all duration-300",
      isActive
        ? "border border-[color:var(--border-accent)] bg-[var(--surface-accent)] text-[var(--accent-contrast-text)] shadow-[var(--shadow-accent)]"
        : "text-[var(--text-secondary)] hover:bg-[var(--surface-accent)] hover:text-[var(--text-primary)]",
    ].join(" ");

  return (
    <header className="sticky top-0 z-40">
      <div className="theme-nav-shell">
        <div className="mx-auto flex w-full max-w-7xl flex-col gap-5 px-5 py-5 sm:px-8 lg:flex-row lg:items-center lg:justify-between lg:px-10">
          <NavLink className="group flex items-center gap-3" to="/">
            <span className="theme-brand-mark flex h-11 w-11 items-center justify-center rounded-2xl">
              <span className="text-sm font-semibold tracking-[0.18em] text-[var(--accent-solid-text)]">
                IOU
              </span>
            </span>

            <span className="space-y-0.5">
              <span className="block text-sm uppercase tracking-[0.28em] text-[var(--accent-secondary)]">
                IOU Studio
              </span>
              <span className="block text-sm text-[var(--text-secondary)] transition-colors duration-300 group-hover:text-[var(--text-primary)]">
                Tech-driven creative systems
              </span>
            </span>
          </NavLink>

          <div className="flex flex-col gap-4 lg:flex-row lg:items-center">
            <nav
              aria-label="Primary navigation"
              className="theme-nav-rail flex max-w-full flex-nowrap gap-2 overflow-x-auto rounded-full p-1.5 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
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

            <div className="flex flex-wrap items-center justify-end gap-3">
              <Button className="sm:w-auto" size="sm" to="/pricing" variant="secondary">
                Build Your Package
              </Button>
              <ThemeToggleButton />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
