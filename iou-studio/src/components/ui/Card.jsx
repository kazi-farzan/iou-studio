import { createElement } from "react";
import useHoverMotion from "../../hooks/useHoverMotion.js";

export default function Card({
  as = "div",
  children,
  className = "",
  interactive = false,
}) {
  const elementRef = useHoverMotion({
    enabled: interactive,
    hoverScale: 1.004,
    hoverY: -4,
  });

  const interactiveClasses = interactive
    ? "transition-[transform,border-color,box-shadow,background-color] duration-300 hover:-translate-y-1 hover:border-[color:var(--border-strong)] hover:shadow-[var(--shadow-card)]"
    : "";

  const classes = [
    "theme-card rounded-[32px] p-6 sm:p-7",
    interactiveClasses,
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return createElement(as, { className: classes, ref: elementRef }, children);
}
