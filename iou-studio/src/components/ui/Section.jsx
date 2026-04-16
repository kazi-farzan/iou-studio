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

const spacingClasses = {
  compact: "py-10 sm:py-12 lg:py-14",
  default: "py-14 sm:py-16 lg:py-20",
  airy: "py-16 sm:py-20 lg:py-24",
  hero: "pb-14 pt-6 sm:pb-16 sm:pt-8 lg:pb-20 lg:pt-10",
};

export default function Section({
  align = "left",
  animated = true,
  children,
  className = "",
  contentClassName = "",
  description,
  eyebrow,
  spacing = "default",
  title,
  titleAs: TitleTag = "h2",
  width = "default",
}) {
  const sectionRef = usePageAnimation(animated);
  const contentClasses = [widthClasses[width], alignmentClasses[align]]
    .filter(Boolean)
    .join(" ");
  const spacingClass = spacingClasses[spacing] || spacingClasses.default;

  return (
    <section
      ref={sectionRef}
      className={["relative w-full", spacingClass, className].filter(Boolean).join(" ")}
    >
      <div className={["flex flex-col gap-8 sm:gap-10", contentClasses, contentClassName].join(" ")}>
        {(eyebrow || title || description) && (
          <div className="space-y-4 sm:space-y-5">
            {eyebrow ? <p className="type-kicker">{eyebrow}</p> : null}

            {title ? (
              <TitleTag className={TitleTag === "h1" ? "type-page-title" : "type-section-title"}>
                {title}
              </TitleTag>
            ) : null}

            {description ? (
              <p className="type-body-lg">
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
