import CaseStudyVisual from "../components/caseStudies/CaseStudyVisual.jsx";
import Button from "../components/ui/Button.jsx";
import Card from "../components/ui/Card.jsx";
import Section from "../components/ui/Section.jsx";
import {
  caseStudies,
  getCaseStudyOverview,
} from "../data/caseStudies.js";

function OverviewCard({ item }) {
  return (
    <div className="theme-panel-contrast rounded-[26px] p-4 sm:p-5">
      <p className="type-label">
        {item.label}
      </p>
      <p className="mt-3 type-stat">
        {item.value}
      </p>
      <p className="mt-2 text-sm leading-6 text-[var(--text-secondary)]">
        {item.detail}
      </p>
    </div>
  );
}

function DetailBlock({ children, label, tone = "default" }) {
  const toneClasses =
    tone === "accent"
      ? "border-[color:var(--border-accent)] bg-[var(--surface-accent)]"
      : "border-[color:var(--border-subtle)] bg-[var(--surface-muted)]";

  return (
    <div className={["rounded-[24px] border p-4 sm:p-5", toneClasses].join(" ")}>
      <p className="type-label">
        {label}
      </p>
      <div className="mt-3">{children}</div>
    </div>
  );
}

function StudyToken({ item, tone = "default" }) {
  const toneClasses =
    tone === "accent"
      ? "theme-chip"
      : "border border-[color:var(--border-subtle)] bg-[var(--surface-soft)] text-[var(--text-secondary)]";

  return (
    <span
      className={[
        "rounded-full px-3 py-1.5 text-[10px] font-medium uppercase tracking-[0.18em]",
        toneClasses,
      ].join(" ")}
    >
      {item}
    </span>
  );
}

function DeliverableRow({ item }) {
  return (
    <div className="rounded-[20px] border border-[color:var(--border-subtle)] bg-[var(--surface-soft)] px-3 py-3 text-sm text-[var(--text-secondary)] sm:px-4">
      {item}
    </div>
  );
}

function CaseStudyRecord({ study }) {
  return (
    <Card as="article" className="overflow-hidden p-4 sm:p-6 lg:p-7">
      <div className="flex flex-wrap items-start justify-between gap-4 border-b border-[color:var(--border-subtle)] pb-5">
        <div className="min-w-0">
          <p className="type-label">
            {study.id}
          </p>
          <h2 className="mt-3 text-2xl font-semibold tracking-[-0.04em] text-[var(--text-primary)] sm:text-3xl">
            {study.title}
          </h2>
          <p className="mt-2 text-sm text-[var(--text-secondary)] sm:text-base">
            {study.businessType}
          </p>
        </div>

        <div className="theme-panel-contrast rounded-[22px] px-4 py-3 text-left sm:min-w-[220px]">
          <p className="type-label">
            Delivery timeline
          </p>
          <p className="mt-2 text-sm font-semibold text-[var(--text-primary)]">
            {study.timeline}
          </p>
        </div>
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-[minmax(0,1.08fr)_minmax(320px,0.92fr)]">
        <div className="space-y-4">
          <div className="rounded-[24px] border border-[color:var(--border-subtle)] bg-[var(--surface-soft)] p-4 sm:p-5">
            <p className="text-[10px] font-medium uppercase tracking-[0.26em] text-[var(--text-muted)]">
              Problem / context
            </p>
            <p className="mt-3 text-sm leading-7 text-[var(--text-secondary)] sm:text-base">
              {study.summary}
            </p>
          </div>

          <CaseStudyVisual visual={study.visual} />
        </div>

        <div className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-1 2xl:grid-cols-2">
            <DetailBlock label="Configured for">
              <p className="text-sm leading-7 text-[var(--text-secondary)]">
                {study.configuredFor}
              </p>
            </DetailBlock>

            <DetailBlock label="Scope summary">
              <p className="text-sm leading-7 text-[var(--text-secondary)]">
                {study.scopeSummary}
              </p>
            </DetailBlock>
          </div>

          <DetailBlock label="What was built">
            <p className="text-sm leading-7 text-[var(--text-secondary)]">
              {study.buildSummary}
            </p>
          </DetailBlock>

          <DetailBlock label="Modules used">
            <div className="flex flex-wrap gap-2">
              {study.modulesUsed.map((item) => (
                <StudyToken item={item} key={item} tone="accent" />
              ))}
            </div>
          </DetailBlock>

          <DetailBlock label="Configured details">
            <div className="flex flex-wrap gap-2">
              {study.configuredDetails.map((item) => (
                <StudyToken item={item} key={item} />
              ))}
            </div>
          </DetailBlock>

          <DetailBlock label="Deliverables">
            <div className="grid gap-2.5">
              {study.deliverables.map((item) => (
                <DeliverableRow item={item} key={item} />
              ))}
            </div>
          </DetailBlock>

          <DetailBlock label="Outcome" tone="accent">
            <p className="text-sm leading-7 text-[var(--text-primary)]">
              {study.outcome}
            </p>
          </DetailBlock>
        </div>
      </div>
    </Card>
  );
}

export default function CaseStudies() {
  const overview = getCaseStudyOverview();

  return (
    <div className="w-full">
      <Section
        animated={false}
        spacing="hero"
        description="Each case study is logged as a build record: business context, configured modules, delivery timeline, output, and result. This page is meant to read like evidence of execution, not a gallery."
        eyebrow="Case Studies"
        title="Documented builds from the same system users configure."
        titleAs="h1"
        width="full"
      >
        <div className="space-y-8 lg:space-y-10">
          <div className="grid gap-3 md:grid-cols-3">
            {overview.map((item) => (
              <OverviewCard item={item} key={item.label} />
            ))}
          </div>

          <div className="space-y-6 lg:space-y-7">
            {caseStudies.map((study) => (
              <CaseStudyRecord key={study.id} study={study} />
            ))}
          </div>
        </div>
      </Section>

      <Section
        align="center"
        animated={false}
        spacing="compact"
        description="Use the same build flow to configure your own scope before any handoff begins."
        eyebrow="Start Build"
        title="Configure your system with the same module logic shown above."
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
