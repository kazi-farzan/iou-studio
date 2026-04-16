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
      <Section spacing="compact" width="full">
        <div className="theme-panel rounded-[34px] px-5 py-6 sm:px-7 sm:py-8">
          <div className="mx-auto flex max-w-6xl flex-col gap-8">
            <div className="max-w-2xl space-y-3 sm:space-y-4">
              <p className="type-kicker">
                How It Works
              </p>
              <h2 className="type-section-title max-w-[12ch]">
                Configure the system in three steps.
              </h2>
              <p className="type-body max-w-[46ch]">
                Choose the right services, shape the setup, and move forward with
                pricing and timing already visible.
              </p>
            </div>

            <div className="grid gap-3 lg:grid-cols-3">
              {steps.map((step, index) => (
                <div
                  className={[
                    "theme-panel-contrast flex flex-col gap-3 rounded-[26px] px-5 py-5",
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
