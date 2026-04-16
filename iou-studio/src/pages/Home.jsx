import Button from "../components/ui/Button.jsx";
import Card from "../components/ui/Card.jsx";
import Section from "../components/ui/Section.jsx";
import HowItWorks from "../components/home/HowItWorks.jsx";
import SystemEntryHero from "../components/home/SystemEntryHero.jsx";

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

export default function Home() {
  return (
    <div className="w-full">
      <SystemEntryHero />
      <HowItWorks />

      <Section spacing="compact" width="full">
        <div className="space-y-8 sm:space-y-10">
          <div className="max-w-3xl space-y-4 sm:space-y-5">
            <p className="type-kicker">
              System Capabilities
            </p>
            <h2 className="type-section-title max-w-[14ch]">
              Four capability lanes, one build system.
            </h2>
            <p className="type-body-lg">
              Start with a single lane or combine multiple capabilities into one
              configured request that stays clear from scope selection through handoff.
            </p>
          </div>

          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            {services.map((service) => (
              <Card
                key={service.id}
                className="group h-full p-6"
                interactive
              >
                <div className="flex h-full flex-col">
                  <div className="flex items-center justify-between">
                    <span className="type-label">
                      {service.id}
                    </span>
                    <span className="theme-panel flex h-12 w-12 items-center justify-center rounded-[18px] text-[11px] font-medium tracking-[0.22em] text-[var(--accent-secondary)] transition-all duration-300 group-hover:border-[color:var(--border-accent)] group-hover:bg-[var(--surface-accent)] group-hover:text-[var(--accent-contrast-text)]">
                      {service.token}
                    </span>
                  </div>

                  <h3 className="mt-7 text-[1.6rem] font-semibold tracking-[-0.04em] text-[var(--text-primary)]">
                    {service.title}
                  </h3>
                  <p className="mt-3 text-sm leading-7 text-[var(--text-secondary)]">
                    {service.description}
                  </p>

                  <p className="mt-auto pt-8 text-sm font-semibold text-[var(--accent-secondary)]">
                    {service.detail}
                  </p>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </Section>

      <Section
        align="center"
        spacing="compact"
        width="default"
      >
        <Card className="relative overflow-hidden px-6 py-10 sm:px-10 sm:py-12">
          <div
            aria-hidden="true"
            className="theme-divider absolute inset-x-10 top-0 h-px"
          />

          <div className="relative mx-auto max-w-3xl">
            <p className="type-kicker">
              Start Build
            </p>
            <h2 className="mt-5 type-section-title max-w-[14ch] sm:mx-auto">
              Configure the right setup before the first conversation starts.
            </h2>
            <p className="mt-4 type-body-lg sm:mx-auto">
              Use the guided build flow to select a starting point, shape the scope,
              and move into review with the system output already visible.
            </p>

            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Button size="lg" to="/pricing">
                Start Build
              </Button>
              <Button size="lg" to="/contact" variant="secondary">
                Contact Support
              </Button>
            </div>
          </div>
        </Card>
      </Section>
    </div>
  );
}
