import Button from "../components/ui/Button.jsx";
import Card from "../components/ui/Card.jsx";
import Section from "../components/ui/Section.jsx";

const systemStages = [
  {
    id: "01",
    title: "Configure the build",
    description:
      "Start from services, packages, or custom modules and shape the setup inside one guided interface.",
  },
  {
    id: "02",
    title: "Review the setup",
    description:
      "The summary step groups scope, pricing, and timing into a readable structure before submission.",
  },
  {
    id: "03",
    title: "Confirm the request",
    description:
      "Once submitted, the build moves into confirmation with the reviewed configuration still attached.",
  },
];

const systemPrinciples = [
  {
    title: "Structure removes friction",
    description:
      "The system is designed to replace vague discovery with clear inputs, live outputs, and an obvious next step.",
  },
  {
    title: "Visibility builds trust",
    description:
      "Scope, pricing, and delivery context stay visible so decisions do not depend on guesswork or back-and-forth.",
  },
  {
    title: "One flow, multiple lanes",
    description:
      "Services, custom modules, and review all plug into the same interface so the product feels cohesive instead of stitched together.",
  },
];

export default function About() {
  return (
    <div className="w-full">
      <Section
        animated={false}
        className="pt-4 sm:pt-8"
        description="This is the system view of IOU: how the interface works, why the flow is structured the way it is, and how setup turns into a reviewable build request."
        eyebrow="How It Works"
        title="How the IOU system moves from setup to confirmation."
        width="full"
      >
        <div className="grid gap-5 lg:grid-cols-3">
          {systemStages.map((stage) => (
            <Card key={stage.id} className="h-full p-7 sm:p-8">
              <p className="text-xs font-medium uppercase tracking-[0.28em] text-[var(--accent-secondary)]">
                {stage.id}
              </p>
              <h2 className="mt-5 text-2xl font-semibold tracking-[-0.03em] text-[var(--text-primary)] sm:text-3xl">
                {stage.title}
              </h2>
              <p className="mt-4 text-sm leading-7 text-[var(--text-secondary)] sm:text-base">
                {stage.description}
              </p>
            </Card>
          ))}
        </div>
      </Section>

      <Section
        animated={false}
        className="pb-10 sm:pb-14"
        description="The structure exists to make decisions faster, outputs clearer, and the transition from intent to execution more reliable."
        eyebrow="About System"
        title="Why the system is structured this way."
        width="default"
      >
        <div className="space-y-5">
          {systemPrinciples.map((principle) => (
            <Card key={principle.title} className="p-7 sm:p-8">
              <h2 className="text-2xl font-semibold tracking-[-0.03em] text-[var(--text-primary)]">
                {principle.title}
              </h2>
              <p className="mt-4 text-base leading-8 text-[var(--text-secondary)]">
                {principle.description}
              </p>
            </Card>
          ))}
        </div>
      </Section>

      <Section
        align="center"
        animated={false}
        className="pt-0 pb-10 sm:pb-14"
        description="Move straight into the build flow when the system fits your use case, or use support for edge cases that need a direct conversation."
        eyebrow="Next Step"
        title="Use the system first, then branch into support only when needed."
        width="default"
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
