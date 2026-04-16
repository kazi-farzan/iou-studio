import { Link } from "react-router-dom";
import useHoverMotion from "../../hooks/useHoverMotion.js";

const baseClasses =
  "inline-flex items-center justify-center gap-2 rounded-[20px] border px-5 py-3 text-sm font-semibold tracking-[0.01em] transition-[transform,background-color,border-color,color,box-shadow,filter] duration-200 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--accent-ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--background)] disabled:pointer-events-none disabled:opacity-50";

const sizeClasses = {
  sm: "min-h-[42px] px-4 py-2.5 text-sm",
  md: "min-h-[48px] px-5 py-3 text-sm",
  lg: "min-h-[54px] px-6 py-3.5 text-[0.96rem]",
};

const variantClasses = {
  primary:
    "border-[color:var(--border-accent)] bg-[linear-gradient(135deg,var(--accent-primary),var(--accent-secondary))] text-[var(--accent-solid-text)] shadow-[var(--shadow-accent)] hover:-translate-y-[1px] hover:brightness-[1.03] active:translate-y-0 active:brightness-95",
  secondary:
    "border-[color:var(--border-subtle)] bg-[var(--surface-overlay)] text-[var(--text-primary)] shadow-[var(--shadow-raised)] backdrop-blur-sm hover:-translate-y-[1px] hover:border-[color:var(--border-strong)] hover:bg-[var(--surface)] hover:text-[var(--text-primary)] active:translate-y-0",
  ghost:
    "border-transparent bg-transparent text-[var(--text-secondary)] shadow-none hover:border-[color:var(--border-subtle)] hover:bg-[var(--surface-soft)] hover:text-[var(--text-primary)]",
};

function getClasses({ variant, size, className }) {
  return [
    baseClasses,
    sizeClasses[size] || sizeClasses.md,
    variantClasses[variant] || variantClasses.primary,
    className,
  ]
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
    hoverY: -2,
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
