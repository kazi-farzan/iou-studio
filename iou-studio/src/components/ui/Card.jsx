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
    hoverScale: 1.006,
    hoverY: -6,
  });

  const interactiveClasses = interactive
    ? "transition-colors duration-300 hover:border-[color:var(--border-accent)]"
    : "";

  const classes = [
    "theme-card rounded-[28px] p-6",
    interactiveClasses,
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return createElement(as, { className: classes, ref: elementRef }, children);
}
