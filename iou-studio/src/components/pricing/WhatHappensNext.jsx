import Button from "../ui/Button.jsx";
import Section from "../ui/Section.jsx";

const defaultSteps = [
  {
    number: "01",
    title: "Submit your setup",
    description:
      "You continue with the package or module selection already configured in the builder.",
  },
  {
    number: "02",
    title: "Review & scope",
    description:
      "We review the setup, confirm requirements, and flag anything that affects delivery.",
  },
  {
    number: "03",
    title: "Approve the plan",
    description:
      "You receive the final scope, pricing, and timeline before any build work starts.",
  },
  {
    number: "04",
    title: "Build begins",
    description:
      "Once approved, the system moves into production against the agreed scope and timeline.",
  },
];

export default function WhatHappensNext({
  ctaLabel = "Continue",
  ctaTo = "/contact",
  steps = defaultSteps,
  trustNote = "No calls are required to get started. You will know scope and pricing before anything begins.",
}) {
  return (
    <div className="scroll-mt-28" id="what-happens-next">
      <Section spacing="compact" width="full">
        <div className="theme-panel rounded-[34px] px-5 py-6 sm:px-7 sm:py-8">
          <div className="mx-auto flex max-w-6xl flex-col gap-8">
            <div className="max-w-2xl space-y-3 sm:space-y-4">
              <p className="type-kicker">
                What Happens Next
              </p>
              <h2 className="type-section-title max-w-[12ch]">
                What happens after you continue.
              </h2>
              <p className="type-body max-w-[48ch]">
                Your configuration moves into a structured review so scope,
                timing, and pricing are confirmed before build work starts.
              </p>
            </div>

            <div className="grid gap-3 lg:grid-cols-4">
              {steps.map((step, index) => (
                <div
                  className={[
                    "theme-panel-contrast flex flex-col gap-3 rounded-[24px] px-5 py-5",
                    index === steps.length - 1 ? "" : "",
                  ]
                    .filter(Boolean)
                    .join(" ")}
                  key={step.number}
                >
                  <p className="type-kicker">
                    {step.number}
                  </p>
                  <h3 className="text-lg font-semibold tracking-[-0.03em] text-[var(--text-primary)] sm:text-xl">
                    {step.title}
                  </h3>
                  <p className="text-sm leading-7 text-[var(--text-secondary)]">
                    {step.description}
                  </p>
                </div>
              ))}
            </div>

            <div className="flex flex-col gap-4 border-t border-[color:var(--border-subtle)] pt-6 sm:flex-row sm:items-center sm:justify-between">
              <p className="max-w-2xl text-sm text-[var(--text-muted)]">
                {trustNote}
              </p>
              <Button
                className="w-fit min-w-[8.5rem]"
                size="sm"
                to={ctaTo}
                variant="secondary"
              >
                {ctaLabel}
              </Button>
            </div>
          </div>
        </div>
      </Section>
    </div>
  );
}
