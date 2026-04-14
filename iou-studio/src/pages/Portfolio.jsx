import Button from "../components/ui/Button.jsx";
import Card from "../components/ui/Card.jsx";
import Section from "../components/ui/Section.jsx";

const projects = [
  {
    id: "01",
    category: "Web Experience",
    title: "Launch platform for a premium digital brand",
    summary:
      "A conversion-led web presence built to feel lighter, sharper, and easier to scale over time.",
    outcome: "Structured for growth, trust, and faster content rollout.",
  },
  {
    id: "02",
    category: "Brand System",
    title: "Identity direction for a modern service business",
    summary:
      "A refined visual system designed to unify presentation, social content, and audience perception.",
    outcome: "Clearer positioning with stronger visual consistency.",
  },
  {
    id: "03",
    category: "Creative Delivery",
    title: "Content system for recurring campaign execution",
    summary:
      "A flexible content framework that supported ongoing social and marketing output without losing quality.",
    outcome: "Faster production with cleaner brand continuity.",
  },
  {
    id: "04",
    category: "Product Design",
    title: "Interface direction for a custom client workflow",
    summary:
      "A modular UI concept focused on clarity, speed, and practical decision-making for end users.",
    outcome: "A stronger foundation for future product expansion.",
  },
];

export default function Portfolio() {
  return (
    <div className="w-full">
      <Section
        animated={false}
        className="pt-4 sm:pt-8"
        description="The portfolio structure is ready for future case studies, with placeholder project blocks that reflect the kind of work IOU Studio is built to deliver."
        eyebrow="Portfolio"
        title="Selected work, structured for future expansion."
        width="full"
      >
        <div className="grid gap-5 md:grid-cols-2">
          {projects.map((project) => (
            <Card
              key={project.id}
              className="group h-full p-7"
              interactive
            >
              <div className="flex h-full flex-col">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium uppercase tracking-[0.24em] text-[var(--text-muted)]">
                    {project.id}
                  </span>
                  <span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-[11px] font-medium uppercase tracking-[0.24em] text-[var(--accent-secondary)] transition-all duration-300 group-hover:border-violet-300/30 group-hover:text-white">
                    {project.category}
                  </span>
                </div>

                <h2 className="mt-8 max-w-xl text-3xl font-semibold tracking-[-0.04em] text-white">
                  {project.title}
                </h2>
                <p className="mt-4 text-sm leading-7 text-[var(--text-secondary)]">
                  {project.summary}
                </p>

                <div className="mt-auto pt-8">
                  <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                    <p className="text-xs font-medium uppercase tracking-[0.24em] text-[var(--text-muted)]">
                      Intended Outcome
                    </p>
                    <p className="mt-3 text-sm leading-7 text-[var(--text-secondary)]">
                      {project.outcome}
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
        description="Case studies can be expanded later with visuals, metrics, and deeper project narratives."
        eyebrow="Next"
        title="Want work shaped around your own goals?"
      >
        <div className="flex flex-wrap justify-center gap-3">
          <Button size="lg" to="/pricing">
            Build Your Package
          </Button>
          <Button size="lg" to="/contact" variant="secondary">
            Start A Conversation
          </Button>
        </div>
      </Section>
    </div>
  );
}
