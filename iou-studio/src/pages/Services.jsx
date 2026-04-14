import Button from "../components/ui/Button.jsx";
import Card from "../components/ui/Card.jsx";
import Section from "../components/ui/Section.jsx";

const serviceCategories = [
  {
    id: "01",
    title: "Development",
    summary:
      "Digital products, websites, and app experiences designed to launch quickly and scale cleanly.",
    deliverables: [
      "Marketing websites",
      "Web applications",
      "Landing pages",
      "Product UI systems",
    ],
    fit: "Best for teams that need premium execution with a strong technical base.",
  },
  {
    id: "02",
    title: "Branding",
    summary:
      "Identity systems that bring clarity, trust, and consistency across every audience touchpoint.",
    deliverables: [
      "Brand identity systems",
      "Logo direction",
      "Typography and color systems",
      "Brand guidelines",
    ],
    fit: "Best for businesses shaping a stronger visual position or refining how they are perceived.",
  },
  {
    id: "03",
    title: "Design",
    summary:
      "Creative assets and visual communication designed to feel cohesive, sharp, and commercially useful.",
    deliverables: [
      "Graphic design",
      "Social media content",
      "Campaign visuals",
      "Presentation assets",
    ],
    fit: "Best for brands that need ongoing creative output without losing consistency.",
  },
  {
    id: "04",
    title: "Marketing",
    summary:
      "Execution-focused marketing support that aligns creative, messaging, and delivery into one system.",
    deliverables: [
      "Offer positioning",
      "Content direction",
      "Campaign support",
      "Growth-focused creative planning",
    ],
    fit: "Best for teams that want clearer messaging and a faster route to market momentum.",
  },
];

export default function Services() {
  return (
    <div className="w-full">
      <Section
        className="pt-4 sm:pt-8"
        description="IOU Studio combines technical execution with brand and creative clarity so clients can build what they need without piecing together multiple vendors."
        eyebrow="Services"
        title="Four focused capabilities, designed to work as one system."
        width="full"
      >
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {serviceCategories.map((service) => (
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
                  <span className="theme-chip rounded-full px-3 py-1 text-[11px] font-medium uppercase tracking-[0.24em] transition-all duration-300 group-hover:bg-[var(--surface-accent-strong)]">
                    Category
                  </span>
                </div>

                <div className="mt-7 space-y-4">
                  <h2 className="text-2xl font-semibold tracking-[-0.03em] text-[var(--text-primary)]">
                    {service.title}
                  </h2>
                  <p className="text-sm leading-7 text-[var(--text-secondary)]">
                    {service.summary}
                  </p>
                </div>

                <div className="mt-8 space-y-3">
                  {service.deliverables.map((item) => (
                    <div
                      key={item}
                      className="theme-panel flex items-center gap-3 rounded-2xl px-4 py-3 transition-all duration-300 group-hover:border-[color:var(--border-strong)] group-hover:bg-[var(--surface)]"
                    >
                      <span className="theme-dot h-2 w-2 rounded-full" />
                      <span className="text-sm text-[var(--text-primary)]">{item}</span>
                    </div>
                  ))}
                </div>

                <div className="mt-auto pt-8">
                  <div className="theme-panel-contrast rounded-2xl p-4">
                    <p className="text-xs font-medium uppercase tracking-[0.24em] text-[var(--text-muted)]">
                      Ideal Fit
                    </p>
                    <p className="mt-3 text-sm leading-7 text-[var(--text-secondary)]">
                      {service.fit}
                    </p>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </Section>

      <Section
        align="center"
        className="pb-10 sm:pb-14"
        description="Need a combination of services? The package flow helps narrow the right starting point before you submit a request."
        eyebrow="Next Step"
        title="Choose the right mix before the project begins."
        width="default"
      >
        <div className="flex flex-wrap justify-center gap-3">
          <Button size="lg" to="/pricing">
            Build Your Package
          </Button>
          <Button size="lg" to="/contact" variant="secondary">
            Contact IOU Studio
          </Button>
        </div>
      </Section>
    </div>
  );
}
