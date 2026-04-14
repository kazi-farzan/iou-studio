import Button from "../components/ui/Button.jsx";
import Card from "../components/ui/Card.jsx";
import Section from "../components/ui/Section.jsx";

const products = [
  {
    id: "01",
    name: "IOU Flow",
    status: "Concept",
    description:
      "A guided intake and scope-planning tool designed to help clients choose the right service mix faster.",
    focus: "Service discovery and package alignment",
  },
  {
    id: "02",
    name: "IOU Pulse",
    status: "Upcoming",
    description:
      "A lightweight reporting layer for tracking launch progress, campaign assets, and creative output in one place.",
    focus: "Project visibility and delivery clarity",
  },
  {
    id: "03",
    name: "IOU Grid",
    status: "Future SaaS",
    description:
      "A reusable content and design system platform for teams that need faster creative execution at scale.",
    focus: "Brand systems and recurring content workflows",
  },
];

export default function Products() {
  return (
    <div className="w-full">
      <Section
        animated={false}
        className="pt-4 sm:pt-8"
        description="IOU Studio is shaping a small ecosystem of internal tools and future SaaS products built around speed, structure, and better decision-making."
        eyebrow="Products"
        title="Future tools designed to make execution feel smarter."
        width="full"
      >
        <div className="grid gap-5 lg:grid-cols-3">
          {products.map((product) => (
            <Card
              key={product.id}
              className="group h-full p-7"
              interactive
            >
              <div className="flex h-full flex-col">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium uppercase tracking-[0.24em] text-[var(--text-muted)]">
                    {product.id}
                  </span>
                  <span className="rounded-full border border-violet-300/20 bg-violet-500/10 px-3 py-1 text-[11px] font-medium uppercase tracking-[0.24em] text-[var(--accent-secondary)] transition-all duration-300 group-hover:border-violet-300/30 group-hover:text-white">
                    {product.status}
                  </span>
                </div>

                <h2 className="mt-8 text-3xl font-semibold tracking-[-0.04em] text-white">
                  {product.name}
                </h2>
                <p className="mt-4 text-sm leading-7 text-[var(--text-secondary)]">
                  {product.description}
                </p>

                <div className="mt-auto pt-8">
                  <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                    <p className="text-xs font-medium uppercase tracking-[0.24em] text-[var(--text-muted)]">
                      Focus
                    </p>
                    <p className="mt-3 text-sm leading-7 text-[var(--text-secondary)]">
                      {product.focus}
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
        animated={false}
        className="pb-10 sm:pb-14"
        description="These products are being shaped alongside client work, so each one solves a real operational or creative friction point."
        eyebrow="Roadmap"
        title="Built from the same systems we use to deliver."
      >
        <div className="flex flex-wrap justify-center gap-3">
          <Button size="lg" to="/contact">
            Ask About The Roadmap
          </Button>
          <Button size="lg" to="/pricing" variant="secondary">
            Build Your Package
          </Button>
        </div>
      </Section>
    </div>
  );
}
