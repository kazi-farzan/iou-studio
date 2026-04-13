import Card from "../components/ui/Card.jsx";
import Section from "../components/ui/Section.jsx";

const principles = [
  {
    title: "Precision over noise",
    description:
      "Every decision should make the brand, product, or message feel clearer instead of more complicated.",
  },
  {
    title: "Speed with structure",
    description:
      "Fast execution matters most when it is built on repeatable systems that still allow for thoughtful customization.",
  },
  {
    title: "Design that supports trust",
    description:
      "Strong visual work should not just look premium. It should also reduce friction and strengthen confidence.",
  },
];

export default function About() {
  return (
    <div className="w-full">
      <Section
        animated={false}
        className="pt-4 sm:pt-8"
        description="IOU Labs is a tech-driven creative agency built around one idea: the best client experiences come from combining intelligent systems with polished execution."
        eyebrow="About"
        title="Built for brands that need clarity, quality, and forward motion."
        width="full"
      >
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1.05fr)_minmax(320px,0.95fr)] lg:items-start">
          <Card className="p-7 sm:p-8">
            <p className="text-xs font-medium uppercase tracking-[0.28em] text-[var(--accent-secondary)]">
              Vision
            </p>
            <h2 className="mt-5 text-3xl font-semibold tracking-[-0.04em] text-white sm:text-4xl">
              A studio model that feels faster, sharper, and more guided.
            </h2>
            <p className="mt-5 text-base leading-8 text-[var(--text-secondary)]">
              IOU Labs is designed to remove the usual friction between strategy,
              design, and execution. Instead of forcing clients to figure out every
              detail upfront, the studio uses structured offers and scalable systems
              to make better decisions easier.
            </p>
            <p className="mt-4 text-base leading-8 text-[var(--text-secondary)]">
              The goal is simple: deliver work that looks premium, moves quickly,
              and leaves room for deeper custom growth when the project demands it.
            </p>
          </Card>

          <Card className="p-7 sm:p-8">
            <p className="text-xs font-medium uppercase tracking-[0.28em] text-[var(--accent-secondary)]">
              Philosophy
            </p>
            <div className="mt-5 space-y-4">
              {principles.map((principle) => (
                <div
                  key={principle.title}
                  className="rounded-2xl border border-white/10 bg-white/[0.03] p-5"
                >
                  <h3 className="text-lg font-semibold text-white">
                    {principle.title}
                  </h3>
                  <p className="mt-2 text-sm leading-7 text-[var(--text-secondary)]">
                    {principle.description}
                  </p>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </Section>

      <Section
        animated={false}
        className="pb-10 sm:pb-14"
        description="The studio works best for businesses that value premium presentation, clearer systems, and a more thoughtful route from brief to execution."
        eyebrow="Positioning"
        title="A modern agency shaped like a product system."
        width="default"
      >
        <Card className="p-7 sm:p-8">
          <p className="text-base leading-8 text-[var(--text-secondary)]">
            That means combining templates where they create speed, custom thinking
            where it creates leverage, and guided flows where they reduce decision
            fatigue. The result is a studio process that feels efficient without
            feeling generic.
          </p>
        </Card>
      </Section>
    </div>
  );
}
