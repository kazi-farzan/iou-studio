import { NavLink } from "react-router-dom";
import Button from "../ui/Button.jsx";

const footerLinks = [
  { label: "Services", path: "/services" },
  { label: "Case Studies", path: "/case-studies" },
  { label: "How It Works", path: "/how-it-works" },
];

function getFooterLinkClasses({ isActive }) {
  return [
    "text-sm transition-colors duration-300",
    isActive
      ? "text-[var(--text-primary)]"
      : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]",
  ].join(" ");
}

export default function Footer() {
  return (
    <footer className="border-t border-[color:var(--border-subtle)] bg-[color:var(--nav-background)] backdrop-blur-xl">
      <div className="mx-auto grid w-full max-w-[84rem] gap-8 px-6 py-8 text-sm sm:px-8 sm:py-10 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center lg:px-10">
        <div className="space-y-3">
          <p className="type-kicker">IOU Studio</p>
          <p className="max-w-xl text-sm leading-7 text-[var(--text-secondary)]">
            System-led delivery for product, brand, design, and growth execution.
          </p>
        </div>

        <div className="flex flex-col items-start gap-4 lg:items-end">
          <nav aria-label="Footer navigation" className="flex flex-wrap gap-x-5 gap-y-2">
            {footerLinks.map((item) => (
              <NavLink key={item.path} className={getFooterLinkClasses} to={item.path}>
                {item.label}
              </NavLink>
            ))}
            <NavLink className={getFooterLinkClasses} to="/contact">
              Contact
            </NavLink>
          </nav>

          <div className="flex flex-wrap items-center gap-3">
            <Button size="sm" to="/pricing">
              Start Build
            </Button>
            <NavLink
              className="text-sm text-[var(--text-secondary)] transition-colors duration-300 hover:text-[var(--text-primary)]"
              to="/contact"
            >
              Contact Support
            </NavLink>
          </div>
        </div>
      </div>
    </footer>
  );
}
