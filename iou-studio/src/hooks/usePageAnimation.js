import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function usePageAnimation(enabled = true) {
  const targetRef = useRef(null);

  useLayoutEffect(() => {
    if (!enabled || !targetRef.current) {
      return undefined;
    }

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (prefersReducedMotion) {
      return undefined;
    }

    const context = gsap.context(() => {
      gsap.fromTo(
        targetRef.current,
        { autoAlpha: 0, y: 28 },
        {
          autoAlpha: 1,
          y: 0,
          duration: 0.75,
          ease: "power2.out",
          scrollTrigger: {
            once: true,
            start: "top 84%",
            trigger: targetRef.current,
          },
        },
      );
    }, targetRef);

    return () => context.revert();
  }, [enabled]);

  return targetRef;
}
