import Button from "../components/ui/Button.jsx";
import Card from "../components/ui/Card.jsx";
import Section from "../components/ui/Section.jsx";

const caseStudies = [
  {
    id: "01",
    output: "Launch platform",
    title: "Premium digital launch system for a modern consumer brand",
    summary:
      "A structured web platform designed to make the offer clearer, reduce friction, and support faster iteration after launch.",
    result: "Clearer conversion flow with a stronger base for ongoing rollout.",
  },
  {
    id: "02",
    output: "Brand system",
    title: "Identity framework for a service business moving upmarket",
    summary:
      "A tighter visual system used to align presentation, content, and trust signals across every public touchpoint.",
    result: "Sharper positioning and more consistent delivery across channels.",
  },
  {
    id: "03",
    output: "Content delivery",
    title: "Repeatable campaign system for recurring marketing execution",
    summary:
      "A content structure that reduced production friction while keeping brand continuity intact across ongoing releases.",
    result: "Faster asset production without losing clarity or quality.",
  },
  {
    id: "04",
    output: "Client workflow",
    title: "Custom interface direction for a high-clarity internal process",
    summary:
      "A modular UI concept focused on decision speed, better hierarchy, and cleaner handoff across a complex workflow.",
    result: "A more durable product foundation with clearer next-step logic.",
  },
];

export default function CaseStudies() {
  return (
    <div className="w-full">
      <Section
        animated={false}
        className="pt-4 sm:pt-8"
        description="These case studies represent the kind of configured outputs the IOU system is designed to produce: clear scope, practical delivery decisions, and measurable operational value."
        eyebrow="Case Studies"
        title="System outputs shaped for clarity, speed, and follow-through."
        width="full"
      >
        <div className="grid gap-5 md:grid-cols-2">
          {caseStudies.map((study) => (
            <Card key={study.id} className="group h-full p-7" interactive>
              <div className="flex h-full flex-col">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium uppercase tracking-[0.24em] text-[var(--text-muted)]">
                    {study.id}
                  </span>
                  <span className="theme-panel rounded-full px-3 py-1 text-[11px] font-medium uppercase tracking-[0.24em] text-[var(--accent-secondary)] transition-all duration-300 group-hover:border-[color:var(--border-accent)] group-hover:bg-[var(--surface-accent)] group-hover:text-[var(--accent-contrast-text)]">
                    {study.output}
                  </span>
                </div>

                <h2 className="mt-8 max-w-xl text-3xl font-semibold tracking-[-0.04em] text-[var(--text-primary)]">
                  {study.title}
                </h2>
                <p className="mt-4 text-sm leading-7 text-[var(--text-secondary)]">
                  {study.summary}
                </p>

                <div className="mt-auto pt-8">
                  <div className="theme-panel-contrast rounded-2xl p-4">
                    <p className="text-xs font-medium uppercase tracking-[0.24em] text-[var(--text-muted)]">
                      System Result
                    </p>
                    <p className="mt-3 text-sm leading-7 text-[var(--text-secondary)]">
                      {study.result}
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
        description="Use the same build flow to map your own requirements into a structured setup before any handoff begins."
        eyebrow="Start Build"
        title="Turn your own requirements into a configured setup."
      >
        <div className="flex flex-wrap justify-center gap-3">
          <Button size="lg" to="/pricing">
            Start Build
          </Button>
          <Button size="lg" to="/contact" variant="secondary">
            Contact Support
          </Button>
        </div>
      </Section>
    </div>
  );
}
