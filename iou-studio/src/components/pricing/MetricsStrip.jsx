import Section from "../ui/Section.jsx";

const defaultMetrics = [
  {
    detail:
      "Current package paths surface delivery windows before final scope review.",
    value: "3-8 week delivery range",
  },
  {
    detail:
      "Billing mode, coupon rules, and selected scope stay synchronized in the summary.",
    value: "Live pricing visible upfront",
  },
  {
    detail:
      "Requirements, pricing, and timeline are reviewed before production begins.",
    value: "Scope confirmed before build",
  },
  {
    detail:
      "Start from a package baseline or assemble a modular setup around the work needed.",
    value: "2 ways to configure",
  },
];

export default function MetricsStrip({ items = defaultMetrics }) {
  return (
    <div className="scroll-mt-28 sm:scroll-mt-32" id="metrics-strip">
      <Section spacing="compact" width="full">
        <div className="mx-auto max-w-6xl">
          <h2 className="sr-only">How the system performs</h2>

          <div className="overflow-hidden rounded-[30px] border border-[color:var(--border-subtle)] bg-[var(--border-subtle)] shadow-[var(--shadow-raised)]">
            <div className="grid gap-px md:grid-cols-2 xl:grid-cols-4">
              {items.map((metric) => (
                <article
                  className="bg-[var(--surface-soft)] px-5 py-5 sm:px-6 sm:py-6"
                  key={metric.value}
                >
                  <p className="text-lg font-semibold tracking-[-0.03em] text-[var(--text-primary)]">
                    {metric.value}
                  </p>
                  <p className="mt-2 max-w-[28ch] text-sm leading-7 text-[var(--text-secondary)]">
                    {metric.detail}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </div>
      </Section>
    </div>
  );
}
