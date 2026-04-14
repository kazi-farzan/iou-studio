import Button from "../components/ui/Button.jsx";
import Card from "../components/ui/Card.jsx";
import Section from "../components/ui/Section.jsx";

const heroSignals = [
  {
    label: "Fast execution",
    description: "Launch-ready systems built with premium speed and cleaner delivery.",
  },
  {
    label: "Custom structure",
    description: "Scalable foundations that go beyond one-size-fits-all templates.",
  },
  {
    label: "Guided selection",
    description: "A smart path that helps clients choose exactly what they need.",
  },
];

const heroHighlights = [
  {
    title: "Web & app development",
    detail: "Product websites, platforms, dashboards, and scalable interfaces.",
  },
  {
    title: "Brand and design systems",
    detail: "Identity, visual consistency, and creative assets that feel deliberate.",
  },
  {
    title: "Marketing execution",
    detail: "Campaign support, content direction, and growth-focused creative rollouts.",
  },
];

const services = [
  {
    id: "01",
    token: "DEV",
    title: "Development",
    description:
      "Websites, web apps, and digital products designed to look premium and scale cleanly.",
    detail: "From launch pages to custom product experiences.",
  },
  {
    id: "02",
    token: "BRD",
    title: "Branding",
    description:
      "Identity systems, logo direction, and visual language that strengthens trust fast.",
    detail: "Built for clarity, recall, and long-term consistency.",
  },
  {
    id: "03",
    token: "DSN",
    title: "Design",
    description:
      "Graphic design, social media assets, and polished content systems for daily visibility.",
    detail: "Creative output that feels consistent across every touchpoint.",
  },
  {
    id: "04",
    token: "MKT",
    title: "Marketing",
    description:
      "Structured marketing support that aligns messaging, creative, and delivery speed.",
    detail: "Designed to turn momentum into measurable presence.",
  },
];

const process = [
  {
    step: "01",
    title: "Choose your foundation",
    description:
      "Start with the core service or package that matches your current stage and primary goal.",
    note: "A clear starting point removes friction before any custom work begins.",
  },
  {
    step: "02",
    title: "Refine the scope",
    description:
      "Add the right features, creative support, or marketing layers without overcomplicating the build.",
    note: "The system is designed to stay simple while still feeling tailored.",
  },
  {
    step: "03",
    title: "Submit with confidence",
    description:
      "Send a structured request so the project starts with better context, faster alignment, and less back-and-forth.",
    note: "That means quicker decisions and stronger execution from day one.",
  },
];

export default function Home() {
  return (
    <div className="w-full">
      <Section className="pt-4 sm:pt-8 lg:pt-10" width="full">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1.12fr)_minmax(320px,0.88fr)] lg:items-end">
          <div className="space-y-8">
            <div className="inline-flex items-center gap-3 rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-[11px] font-medium uppercase tracking-[0.28em] text-[var(--accent-secondary)] shadow-[0_12px_40px_rgba(0,0,0,0.18)]">
              <span className="h-2 w-2 rounded-full bg-violet-300 shadow-[0_0_16px_rgba(167,139,250,0.95)]" />
              Tech-Driven Creative Agency
            </div>

            <div className="space-y-6">
              <h1 className="max-w-4xl text-5xl font-semibold tracking-[-0.05em] text-white sm:text-6xl lg:text-7xl">
                Build sharper digital experiences with speed, structure, and style.
              </h1>

              <p className="max-w-2xl text-base leading-8 text-[var(--text-secondary)] sm:text-lg">
                IOU Studio combines premium execution with a guided package system so
                brands can move from idea to launch with more clarity and less drag.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <Button size="lg" to="/pricing">
                Build Your Package
              </Button>
              <Button size="lg" to="/services" variant="secondary">
                Explore Services
              </Button>
            </div>

            <div className="grid gap-3 sm:grid-cols-3">
              {heroSignals.map((signal) => (
                <div
                  key={signal.label}
                  className="rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-4 transition-all duration-300 hover:border-violet-300/25 hover:bg-white/[0.06]"
                >
                  <p className="text-sm font-medium text-white">{signal.label}</p>
                  <p className="mt-2 text-sm leading-6 text-[var(--text-secondary)]">
                    {signal.description}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <Card className="relative overflow-hidden p-7 sm:p-8">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute right-[-3rem] top-[-4rem] h-40 w-40 rounded-full bg-[radial-gradient(circle,rgba(124,58,237,0.32),transparent_72%)] blur-2xl"
            />

            <div className="relative space-y-6">
              <div className="space-y-3">
                <p className="text-xs font-medium uppercase tracking-[0.28em] text-[var(--accent-secondary)]">
                  Structured Delivery
                </p>
                <h2 className="text-2xl font-semibold tracking-[-0.04em] text-white sm:text-3xl">
                  A faster route from brief to launch.
                </h2>
                <p className="text-sm leading-7 text-[var(--text-secondary)] sm:text-base">
                  Start with proven foundations, shape the right package, and grow
                  into custom execution when the project needs more depth.
                </p>
              </div>

              <div className="space-y-3">
                {heroHighlights.map((item, index) => (
                  <div
                    key={item.title}
                    className="group rounded-2xl border border-white/10 bg-white/[0.03] p-4 transition-all duration-300 hover:border-violet-300/25 hover:bg-white/[0.05]"
                  >
                    <div className="flex items-start gap-4">
                      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-violet-300/20 bg-violet-500/10 text-xs font-semibold text-white transition-all duration-300 group-hover:shadow-[0_0_0_6px_rgba(124,58,237,0.12)]">
                        0{index + 1}
                      </span>

                      <div>
                        <p className="text-base font-medium text-white">{item.title}</p>
                        <p className="mt-1 text-sm leading-6 text-[var(--text-secondary)]">
                          {item.detail}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                  <p className="text-xs uppercase tracking-[0.24em] text-[var(--text-muted)]">
                    Delivery Focus
                  </p>
                  <p className="mt-2 text-lg font-semibold text-white">
                    Premium quality without unnecessary friction
                  </p>
                </div>

                <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                  <p className="text-xs uppercase tracking-[0.24em] text-[var(--text-muted)]">
                    Best Fit
                  </p>
                  <p className="mt-2 text-lg font-semibold text-white">
                    Brands that need clarity, speed, and long-term flexibility
                  </p>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </Section>

      <Section className="pt-4" width="full">
        <div className="space-y-8">
          <div className="max-w-3xl space-y-4">
            <p className="text-xs font-medium uppercase tracking-[0.32em] text-[var(--accent-secondary)]">
              Services Preview
            </p>
            <h2 className="text-3xl font-semibold tracking-[-0.04em] text-white sm:text-4xl">
              One studio for product, brand, design, and growth execution.
            </h2>
            <p className="text-base leading-8 text-[var(--text-secondary)] sm:text-lg">
              Start with a single priority or combine multiple capabilities into one
              guided engagement that feels cohesive from the start.
            </p>
          </div>

          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            {services.map((service) => (
              <Card
                key={service.id}
                className="group h-full p-7"
                interactive
              >
                <div className="flex h-full flex-col">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium uppercase tracking-[0.24em] text-[var(--text-muted)]">
                      {service.id}
                    </span>
                    <span className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.04] text-[11px] font-medium tracking-[0.22em] text-[var(--accent-secondary)] transition-all duration-300 group-hover:border-violet-300/30 group-hover:bg-violet-500/12 group-hover:text-white">
                      {service.token}
                    </span>
                  </div>

                  <h3 className="mt-8 text-2xl font-semibold tracking-[-0.03em] text-white">
                    {service.title}
                  </h3>
                  <p className="mt-3 text-sm leading-7 text-[var(--text-secondary)]">
                    {service.description}
                  </p>

                  <p className="mt-auto pt-8 text-sm font-medium text-[var(--accent-secondary)]">
                    {service.detail}
                  </p>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </Section>

      <Section width="full">
        <div className="space-y-8">
          <div className="max-w-3xl space-y-4">
            <p className="text-xs font-medium uppercase tracking-[0.32em] text-[var(--accent-secondary)]">
              How It Works
            </p>
            <h2 className="text-3xl font-semibold tracking-[-0.04em] text-white sm:text-4xl">
              A guided flow that keeps decisions clear from day one.
            </h2>
            <p className="text-base leading-8 text-[var(--text-secondary)] sm:text-lg">
              Instead of guessing what to ask for, clients move through a simple
              system that narrows the right solution before the project even starts.
            </p>
          </div>

          <div className="grid gap-5 lg:grid-cols-3">
            {process.map((step) => (
              <Card
                key={step.step}
                className="group h-full p-7"
                interactive
              >
                <div className="flex h-full flex-col">
                  <span className="flex h-12 w-12 items-center justify-center rounded-2xl border border-violet-300/20 bg-violet-500/10 text-sm font-semibold text-white transition-all duration-300 group-hover:shadow-[0_0_0_8px_rgba(124,58,237,0.12)]">
                    {step.step}
                  </span>

                  <h3 className="mt-7 text-2xl font-semibold tracking-[-0.03em] text-white">
                    {step.title}
                  </h3>
                  <p className="mt-3 text-sm leading-7 text-[var(--text-secondary)]">
                    {step.description}
                  </p>

                  <p className="mt-auto pt-8 text-sm text-[var(--text-muted)]">
                    {step.note}
                  </p>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </Section>

      <Section
        align="center"
        className="pb-10 sm:pb-14"
        width="default"
      >
        <Card className="relative overflow-hidden px-6 py-10 sm:px-10 sm:py-12">
          <div
            aria-hidden="true"
            className="absolute inset-x-10 top-0 h-px bg-[linear-gradient(90deg,transparent,rgba(183,148,246,0.9),transparent)]"
          />

          <div className="relative mx-auto max-w-3xl">
            <p className="text-xs font-medium uppercase tracking-[0.32em] text-[var(--accent-secondary)]">
              Ready To Start
            </p>
            <h2 className="mt-5 text-3xl font-semibold tracking-[-0.04em] text-white sm:text-4xl">
              Build a package that matches your goals before the first call.
            </h2>
            <p className="mt-4 text-base leading-8 text-[var(--text-secondary)] sm:text-lg">
              Use the guided pricing flow to choose the right foundation, add what
              you need, and send a structured request with more confidence.
            </p>

            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Button size="lg" to="/pricing">
                Build Your Package
              </Button>
              <Button size="lg" to="/contact" variant="secondary">
                Contact IOU Studio
              </Button>
            </div>
          </div>
        </Card>
      </Section>
    </div>
  );
}
