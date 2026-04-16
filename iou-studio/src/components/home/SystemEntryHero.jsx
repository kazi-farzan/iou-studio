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
    <Section className="overflow-hidden" spacing="hero" width="full">
      <div className="grid gap-8 xl:grid-cols-[minmax(0,1.08fr)_minmax(360px,420px)] xl:items-start xl:gap-10">
        <div className="space-y-8 sm:space-y-10">
          <div className="theme-panel inline-flex items-center gap-3 rounded-full px-4 py-2.5 text-[11px] font-medium uppercase tracking-[0.28em] text-[var(--accent-secondary)]">
            <span className="theme-dot h-2 w-2 rounded-full" />
            Restaurant Build System
          </div>

          <div className="space-y-5 sm:space-y-6">
            <h1 className="type-page-title max-w-[12ch]">
              Design your restaurant&apos;s digital system. Know the cost. Launch fast.
            </h1>

            <p className="type-body-lg max-w-2xl">
              Select what you need. See pricing instantly. No calls. No confusion.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <Button className="min-w-[11.5rem] px-6" size="lg" to="/pricing">
              Start Building
            </Button>
            <Button
              className="min-w-[11.5rem] px-6"
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
                className="theme-panel-contrast rounded-[24px] px-4 py-5 sm:px-5"
                key={item.label}
              >
                <p className="text-sm font-semibold text-[var(--text-primary)]">
                  {item.label}
                </p>
                <p className="mt-2 text-sm leading-7 text-[var(--text-secondary)]">
                  {item.detail}
                </p>
              </div>
            ))}
          </div>
        </div>

        <Card className="relative overflow-hidden p-5 sm:p-6 lg:p-7">
          <Hero3D />
          <div
            aria-hidden="true"
            className="theme-divider absolute inset-x-8 top-0 h-px"
          />

          <div className="relative flex min-h-[28rem] flex-col gap-8 sm:min-h-[30rem]">
            <div className="space-y-4">
              <p className="type-kicker">
                System State
              </p>
              <h2 className="type-card-title max-w-[12ch]">
                Selection, pricing, and next step stay visible.
              </h2>
              <p className="type-body max-w-[34ch]">
                Choose the setup, confirm the cost, and move straight into the build flow.
              </p>
            </div>

            <div className="theme-panel-contrast rounded-[28px] p-2.5">
              {systemSteps.map((step, index) => (
                <div
                  className={[
                    "flex items-start gap-4 px-4 py-4 sm:px-5",
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
                    <p className="type-label">
                      {step.label}
                    </p>
                    <p className="mt-2 text-base font-semibold text-[var(--text-primary)]">
                      {step.title}
                    </p>
                    <p className="mt-1 text-sm leading-7 text-[var(--text-secondary)]">
                      {step.detail}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="theme-panel rounded-[24px] px-4 py-4 sm:px-5">
              <p className="type-label">
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
