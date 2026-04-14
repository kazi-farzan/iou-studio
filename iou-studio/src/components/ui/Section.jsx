import usePageAnimation from "../../hooks/usePageAnimation.js";

const widthClasses = {
  narrow: "max-w-3xl",
  default: "max-w-5xl",
  wide: "max-w-7xl",
  full: "max-w-none",
};

const alignmentClasses = {
  left: "items-start text-left",
  center: "items-center text-center",
};

export default function Section({
  align = "left",
  animated = true,
  children,
  className = "",
  description,
  eyebrow,
  title,
  width = "default",
}) {
  const sectionRef = usePageAnimation(animated);
  const contentClasses = [widthClasses[width], alignmentClasses[align]]
    .filter(Boolean)
    .join(" ");

  return (
    <section
      ref={sectionRef}
      className={["relative w-full py-10 sm:py-12", className].filter(Boolean).join(" ")}
    >
      <div className={["flex flex-col gap-6", contentClasses].join(" ")}>
        {(eyebrow || title || description) && (
          <div className="space-y-4">
            {eyebrow ? (
              <p className="text-xs font-medium uppercase tracking-[0.32em] text-[var(--accent-secondary)]">
                {eyebrow}
              </p>
            ) : null}

            {title ? (
              <h1 className="max-w-4xl text-4xl font-semibold tracking-[-0.04em] text-[var(--text-primary)] sm:text-5xl lg:text-6xl">
                {title}
              </h1>
            ) : null}

            {description ? (
              <p className="max-w-3xl text-base leading-8 text-[var(--text-secondary)] sm:text-lg">
                {description}
              </p>
            ) : null}
          </div>
        )}

        {children ? <div className="w-full">{children}</div> : null}
      </div>
    </section>
  );
}
