import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";

export default function useHoverMotion({
  duration = 0.24,
  enabled = true,
  hoverScale = 1.008,
  hoverY = -4,
} = {}) {
  const elementRef = useRef(null);

  useLayoutEffect(() => {
    if (!enabled || !elementRef.current) {
      return undefined;
    }

    const supportsHover = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (!supportsHover || prefersReducedMotion) {
      return undefined;
    }

    const element = elementRef.current;
    const reset = () =>
      gsap.to(element, {
        duration: 0.28,
        ease: "power2.out",
        overwrite: true,
        scale: 1,
        y: 0,
      });

    const applyHover = () => {
      if ("disabled" in element && element.disabled) {
        return;
      }

      gsap.to(element, {
        duration,
        ease: "power2.out",
        overwrite: true,
        scale: hoverScale,
        y: hoverY,
      });
    };

    const applyPress = () => {
      if ("disabled" in element && element.disabled) {
        return;
      }

      gsap.to(element, {
        duration: 0.16,
        ease: "power2.out",
        overwrite: true,
        scale: Math.max(hoverScale - 0.006, 1),
        y: hoverY / 2,
      });
    };

    const handlePointerUp = () => {
      if (element.matches(":hover")) {
        applyHover();
        return;
      }

      reset();
    };

    gsap.set(element, {
      transformOrigin: "center center",
      willChange: "transform",
    });

    element.addEventListener("pointerenter", applyHover);
    element.addEventListener("pointerleave", reset);
    element.addEventListener("pointerdown", applyPress);
    element.addEventListener("pointerup", handlePointerUp);
    element.addEventListener("blur", reset);

    return () => {
      element.removeEventListener("pointerenter", applyHover);
      element.removeEventListener("pointerleave", reset);
      element.removeEventListener("pointerdown", applyPress);
      element.removeEventListener("pointerup", handlePointerUp);
      element.removeEventListener("blur", reset);
      gsap.killTweensOf(element);
      gsap.set(element, { clearProps: "transform,willChange" });
    };
  }, [duration, enabled, hoverScale, hoverY]);

  return elementRef;
}
