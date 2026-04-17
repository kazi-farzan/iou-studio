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

function StepCard({ isFirstStep, isLastStep, step }) {
  return (
    <li className="relative pl-16 sm:pl-20">
      {!isLastStep ? (
        <span
          aria-hidden="true"
          className="absolute left-[1.45rem] top-12 bottom-[-1rem] w-px bg-[var(--border-subtle)] sm:left-[1.75rem]"
        />
      ) : null}

      <span
        className={[
          "absolute left-0 top-0 inline-flex h-12 w-12 items-center justify-center rounded-full border text-[11px] font-semibold tracking-[0.18em] sm:h-14 sm:w-14",
          isFirstStep
            ? "border-[color:var(--border-accent)] bg-[var(--surface-accent)] text-[var(--accent-contrast-text)] shadow-[var(--shadow-raised)]"
            : "border-[color:var(--border-subtle)] bg-[var(--surface)] text-[var(--text-primary)]",
        ].join(" ")}
      >
        {step.number}
      </span>

      <div
        className={[
          "rounded-[28px] border px-5 py-5 sm:px-6 sm:py-6",
          isFirstStep
            ? "border-[color:var(--border-accent)] bg-[linear-gradient(180deg,var(--surface-accent),var(--surface-soft))]"
            : "border-[color:var(--border-subtle)] bg-[var(--surface)]",
        ].join(" ")}
      >
        <p className="type-label">Step {step.number}</p>
        <h3 className="mt-3 text-xl font-semibold tracking-[-0.04em] text-[var(--text-primary)] sm:text-[1.45rem]">
          {step.title}
        </h3>
        <p className="mt-3 text-sm leading-7 text-[var(--text-secondary)] sm:text-base sm:leading-8">
          {step.description}
        </p>
      </div>
    </li>
  );
}

export default function WhatHappensNext({
  ctaLabel = "Continue",
  ctaTo = "/contact",
  steps = defaultSteps,
  trustNote = "No calls are required to get started. You will know scope and pricing before anything begins.",
}) {
  return (
    <div className="scroll-mt-28 sm:scroll-mt-32" id="what-happens-next">
      <Section spacing="default" width="full">
        <div className="theme-panel rounded-[38px] px-5 py-6 sm:px-7 sm:py-8 lg:px-10 lg:py-10">
          <div className="mx-auto grid max-w-[82rem] gap-8 xl:grid-cols-[minmax(0,0.9fr)_minmax(340px,1.1fr)] xl:items-start">
            <div className="space-y-6">
              <div className="max-w-2xl space-y-4">
                <p className="type-kicker">What Happens Next</p>
                <h2 className="type-section-title max-w-[10ch]">
                  What happens after you continue.
                </h2>
                <p className="max-w-[48ch] text-base leading-8 text-[var(--text-secondary)]">
                  Your current setup moves into a structured review. This
                  section is here to clarify the handoff, not to resell the
                  builder.
                </p>
              </div>

              <div className="rounded-[28px] border border-[color:var(--border-subtle)] bg-[var(--surface)] px-5 py-5 sm:px-6">
                <p className="type-label">What carries forward</p>
                <p className="mt-3 text-sm leading-7 text-[var(--text-secondary)] sm:text-base sm:leading-8">
                  The package or custom-module selection you made stays attached
                  to the review step. We use that as the working starting point
                  instead of sending you into a blank inquiry.
                </p>
              </div>

              <div className="rounded-[28px] border border-[color:var(--border-subtle)] bg-[var(--surface-soft)] px-5 py-5 sm:px-6">
                <p className="type-label">Before build begins</p>
                <p className="mt-3 text-sm leading-7 text-[var(--text-secondary)] sm:text-base sm:leading-8">
                  {trustNote}
                </p>

                <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center">
                  <Button
                    className="w-fit min-w-[10rem]"
                    size="lg"
                    to={ctaTo}
                    variant="secondary"
                  >
                    {ctaLabel}
                  </Button>
                  <p className="text-sm text-[var(--text-muted)]">
                    Opens the review step with your current configuration intact.
                  </p>
                </div>
              </div>
            </div>

            <ol className="space-y-4 sm:space-y-5">
              {steps.map((step, index) => (
                <StepCard
                  isFirstStep={index === 0}
                  isLastStep={index === steps.length - 1}
                  key={step.number}
                  step={step}
                />
              ))}
            </ol>
          </div>
        </div>
      </Section>
    </div>
  );
}
