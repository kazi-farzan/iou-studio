import { NavLink } from "react-router-dom";
import Button from "../ui/Button.jsx";

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
        ? "border border-violet-300/20 bg-violet-500/12 text-white shadow-[0_10px_35px_rgba(124,58,237,0.22)]"
        : "text-[var(--text-secondary)] hover:bg-white/5 hover:text-white",
    ].join(" ");

  return (
    <header className="sticky top-0 z-40">
      <div className="border-b border-white/8 bg-[rgba(7,8,12,0.72)] backdrop-blur-xl">
        <div className="mx-auto flex w-full max-w-7xl flex-col gap-5 px-5 py-5 sm:px-8 lg:flex-row lg:items-center lg:justify-between lg:px-10">
          <NavLink className="group flex items-center gap-3" to="/">
            <span className="flex h-11 w-11 items-center justify-center rounded-2xl border border-violet-300/20 bg-[linear-gradient(180deg,rgba(124,58,237,0.34),rgba(124,58,237,0.08))] shadow-[0_18px_50px_rgba(124,58,237,0.18)]">
              <span className="text-sm font-semibold tracking-[0.18em] text-white">IOU</span>
            </span>

            <span className="space-y-0.5">
              <span className="block text-sm uppercase tracking-[0.28em] text-[var(--accent-secondary)]">
                IOU Studio
              </span>
              <span className="block text-sm text-[var(--text-secondary)] transition-colors duration-300 group-hover:text-white">
                Tech-driven creative systems
              </span>
            </span>
          </NavLink>

          <div className="flex flex-col gap-4 lg:flex-row lg:items-center">
            <nav
              aria-label="Primary navigation"
              className="flex max-w-full flex-nowrap gap-2 overflow-x-auto rounded-full border border-white/6 bg-white/[0.03] p-1.5 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
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

            <Button className="w-full sm:w-auto" size="sm" to="/pricing" variant="secondary">
              Build Your Package
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
