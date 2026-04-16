import Button from "../ui/Button.jsx";
import Card from "../ui/Card.jsx";
import Section from "../ui/Section.jsx";
import Hero3D from "./Hero3D.jsx";

const entryIndicators = [
  {
    label: "Clear pricing",
    detail: "See the cost before you move forward.",
  },
  {
    label: "Modular setup",
    detail: "Select only the parts your restaurant needs.",
  },
  {
    label: "Fast delivery",
    detail: "Move from scope to launch with less back-and-forth.",
  },
];

const systemSteps = [
  {
    label: "Selection",
    title: "Choose the setup",
    detail: "Start with the modules that match your restaurant's current needs.",
  },
  {
    label: "Pricing",
    title: "Review the cost",
    detail: "Pricing stays visible as the scope becomes clearer.",
  },
  {
    label: "Next step",
    title: "Start building",
    detail: "Submit a structured request when the system looks right.",
  },
];

export default function SystemEntryHero() {
  return (
    <Section className="overflow-hidden pt-4 sm:pt-8 lg:pt-10" width="full">
      <div className="grid gap-6 xl:grid-cols-[minmax(0,1.14fr)_380px] xl:items-start">
        <div className="space-y-7">
          <div className="theme-panel inline-flex items-center gap-3 rounded-full px-4 py-2 text-[11px] font-medium uppercase tracking-[0.28em] text-[var(--accent-secondary)] shadow-[var(--shadow-soft)]">
            <span className="theme-dot h-2 w-2 rounded-full" />
            Restaurant Build System
          </div>

          <div className="space-y-5">
            <h1 className="max-w-3xl text-4xl font-semibold tracking-[-0.05em] text-[var(--text-primary)] sm:text-5xl lg:text-[3.75rem]">
              Design your restaurant&apos;s digital system. Know the cost. Launch fast.
            </h1>

            <p className="max-w-2xl text-base leading-8 text-[var(--text-secondary)] sm:text-lg">
              Select what you need. See pricing instantly. No calls. No confusion.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Button className="min-w-[11.5rem] px-6" size="lg" to="/pricing">
              Start Building
            </Button>
            <Button
              className="min-w-[11.5rem] border-[color:var(--border-strong)] px-6"
              href="#how-it-works"
              size="lg"
              variant="secondary"
            >
              See How It Works
            </Button>
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            {entryIndicators.map((item) => (
              <div
                className="theme-panel rounded-2xl px-4 py-4"
                key={item.label}
              >
                <p className="text-sm font-medium text-[var(--text-primary)]">
                  {item.label}
                </p>
                <p className="mt-2 text-sm leading-6 text-[var(--text-secondary)]">
                  {item.detail}
                </p>
              </div>
            ))}
          </div>
        </div>

        <Card className="relative overflow-hidden p-6 sm:p-7 lg:p-8">
          <Hero3D />

          <div className="relative space-y-6">
            <div className="space-y-3">
              <p className="text-xs font-medium uppercase tracking-[0.28em] text-[var(--accent-secondary)]">
                System State
              </p>
              <h2 className="max-w-sm text-2xl font-semibold tracking-[-0.04em] text-[var(--text-primary)] sm:text-[2rem]">
                Selection, pricing, and next step stay visible.
              </h2>
              <p className="text-sm leading-7 text-[var(--text-secondary)] sm:text-base">
                Choose the setup, confirm the cost, and move straight into the build flow.
              </p>
            </div>

            <div className="theme-panel-contrast rounded-[26px] p-2">
              {systemSteps.map((step, index) => (
                <div
                  className={[
                    "flex items-start gap-4 px-4 py-4",
                    index < systemSteps.length - 1
                      ? "border-b border-[color:var(--border-subtle)]"
                      : "",
                  ]
                    .filter(Boolean)
                    .join(" ")}
                  key={step.label}
                >
                  <span className="theme-chip flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-xs font-semibold">
                    0{index + 1}
                  </span>

                  <div className="min-w-0">
                    <p className="text-[11px] font-medium uppercase tracking-[0.24em] text-[var(--text-muted)]">
                      {step.label}
                    </p>
                    <p className="mt-2 text-base font-medium text-[var(--text-primary)]">
                      {step.title}
                    </p>
                    <p className="mt-1 text-sm leading-6 text-[var(--text-secondary)]">
                      {step.detail}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="theme-panel rounded-2xl px-4 py-4">
              <p className="text-[11px] font-medium uppercase tracking-[0.24em] text-[var(--text-muted)]">
                Current flow
              </p>
              <div className="mt-3 flex flex-wrap items-center gap-2 text-sm text-[var(--text-secondary)]">
                <span className="theme-chip rounded-full px-3 py-1 text-[11px] font-medium uppercase tracking-[0.22em]">
                  Select
                </span>
                <span>Review</span>
                <span className="text-[var(--text-muted)]">/</span>
                <span>Price</span>
                <span className="text-[var(--text-muted)]">/</span>
                <span className="font-medium text-[var(--text-primary)]">Build</span>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </Section>
  );
}
