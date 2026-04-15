import Button from "../ui/Button.jsx";
import Section from "../ui/Section.jsx";

const steps = [
  {
    number: "01",
    title: "Select services",
    description: "Choose what your business needs.",
  },
  {
    number: "02",
    title: "Customize your setup",
    description: "Adjust features and scope.",
  },
  {
    number: "03",
    title: "Review price & timeline",
    description: "See price and timeline instantly, then launch.",
  },
];

export default function HowItWorks() {
  return (
    <div className="scroll-mt-28" id="how-it-works">
      <Section className="pt-2 sm:pt-4" width="default">
        <div className="border-y border-[color:var(--border-subtle)] py-8 sm:py-10">
          <div className="mx-auto flex max-w-4xl flex-col gap-8">
            <div className="max-w-2xl space-y-3">
              <p className="text-xs font-medium uppercase tracking-[0.32em] text-[var(--accent-secondary)]">
                How It Works
              </p>
              <h2 className="text-2xl font-semibold tracking-[-0.04em] text-[var(--text-primary)] sm:text-3xl">
                Configure the system in three steps.
              </h2>
              <p className="text-sm leading-7 text-[var(--text-secondary)] sm:text-base">
                Choose the right services, shape the setup, and move forward with
                pricing and timing already visible.
              </p>
            </div>

            <div className="grid gap-0 lg:grid-cols-3">
              {steps.map((step, index) => (
                <div
                  className={[
                    "flex flex-col gap-3 py-5 lg:px-6 lg:py-0",
                    index === 0
                      ? "pt-0 lg:pl-0"
                      : "border-t border-[color:var(--border-subtle)] lg:border-l lg:border-t-0",
                    index === steps.length - 1 ? "pb-0 lg:pr-0" : "",
                  ]
                    .filter(Boolean)
                    .join(" ")}
                  key={step.number}
                >
                  <p className="text-xs font-medium uppercase tracking-[0.28em] text-[var(--accent-secondary)]">
                    {step.number}
                  </p>
                  <h3 className="text-lg font-medium tracking-[-0.02em] text-[var(--text-primary)] sm:text-xl">
                    {step.title}
                  </h3>
                  <p className="text-sm leading-7 text-[var(--text-secondary)]">
                    {step.description}
                  </p>
                </div>
              ))}
            </div>

            <div className="flex flex-col gap-4 border-t border-[color:var(--border-subtle)] pt-5 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm text-[var(--text-muted)]">
                Everything updates live as you build.
              </p>
              <Button
                className="w-fit min-w-[9.5rem]"
                size="sm"
                to="/pricing"
                variant="secondary"
              >
                Start Building
              </Button>
            </div>
          </div>
        </div>
      </Section>
    </div>
  );
}
