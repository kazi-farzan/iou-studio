import { Link } from "react-router-dom";
import useHoverMotion from "../../hooks/useHoverMotion.js";

const baseClasses =
  "inline-flex items-center justify-center rounded-full border px-5 py-3 text-sm font-medium tracking-[0.01em] transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--accent-ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--background)] disabled:pointer-events-none disabled:opacity-50";

const sizeClasses = {
  sm: "px-4 py-2.5 text-sm",
  md: "px-5 py-3 text-sm",
  lg: "px-6 py-3.5 text-base",
};

const variantClasses = {
  primary:
    "border-[color:var(--border-accent)] bg-[linear-gradient(135deg,var(--accent-primary),var(--accent-secondary))] text-[var(--accent-solid-text)] shadow-[var(--shadow-accent)] hover:brightness-105",
  secondary:
    "border-[color:var(--border-subtle)] bg-[var(--surface-muted)] text-[var(--text-primary)] backdrop-blur-sm hover:border-[color:var(--border-accent)] hover:bg-[var(--surface-accent)] hover:text-[var(--text-primary)]",
};

function getClasses({ variant, size, className }) {
  return [baseClasses, sizeClasses[size], variantClasses[variant], className]
    .filter(Boolean)
    .join(" ");
}

export default function Button({
  children,
  className = "",
  href,
  size = "md",
  to,
  type = "button",
  variant = "primary",
  ...props
}) {
  const elementRef = useHoverMotion({
    hoverScale: 1.01,
    hoverY: -3,
  });
  const classes = getClasses({ variant, size, className });

  if (href) {
    return (
      <a className={classes} href={href} ref={elementRef} {...props}>
        {children}
      </a>
    );
  }

  if (to) {
    return (
      <Link className={classes} ref={elementRef} to={to} {...props}>
        {children}
      </Link>
    );
  }

  return (
    <button className={classes} ref={elementRef} type={type} {...props}>
      {children}
    </button>
  );
}
