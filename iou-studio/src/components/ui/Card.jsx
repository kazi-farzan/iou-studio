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
    ? "transition-colors duration-300 hover:border-violet-300/25"
    : "";

  const classes = [
    "rounded-[28px] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.06),rgba(255,255,255,0.03))] p-6 shadow-[0_20px_60px_rgba(0,0,0,0.28)] backdrop-blur-sm",
    interactiveClasses,
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return createElement(as, { className: classes, ref: elementRef }, children);
}
