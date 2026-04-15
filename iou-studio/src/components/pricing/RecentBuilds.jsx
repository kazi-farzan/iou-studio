import Section from "../ui/Section.jsx";

const recentBuilds = [
  {
    id: "B-01",
    name: "Maple Street Cafe",
    descriptor: "Restaurant ordering system",
    outcome:
      "Online ordering, pickup scheduling, and card payment for a neighborhood cafe.",
    preview: "ordering",
    scope: "Website + mobile ordering",
    timeline: "4 week build",
    tags: ["Website", "Ordering System", "Payments"],
  },
  {
    id: "B-02",
    name: "Cedar Studio",
    descriptor: "Service website and brand system",
    outcome:
      "Lead capture, service pages, and a cleaner visual system for a small design practice.",
    preview: "services",
    scope: "Website + branding",
    timeline: "3 week build",
    tags: ["Website", "Branding", "Lead Capture"],
  },
  {
    id: "B-03",
    name: "Northside Dental",
    descriptor: "Clinic intake website",
    outcome:
      "Appointment request flow with intake details and clear service navigation for new patients.",
    preview: "intake",
    scope: "Website + intake flow",
    timeline: "5 week build",
    tags: ["Website", "Intake", "Scheduling"],
  },
  {
    id: "B-04",
    name: "Field Supply Co.",
    descriptor: "Product landing and checkout system",
    outcome:
      "Single-product storefront with repeatable campaign sections and a lightweight checkout path.",
    preview: "commerce",
    scope: "Landing page + checkout",
    timeline: "4 week build",
    tags: ["Website", "Branding", "Commerce"],
  },
];

function VisualShell({ children, label }) {
  return (
    <div className="rounded-[26px] border border-[color:var(--border-subtle)] bg-[linear-gradient(180deg,var(--surface),var(--surface-soft))] p-3 sm:p-4">
      <div className="flex items-center justify-between border-b border-[color:var(--border-subtle)] pb-3">
        <div className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-[var(--surface-accent-strong)]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[var(--surface-contrast)]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[var(--surface-muted)]" />
        </div>
        <span className="text-[10px] font-medium uppercase tracking-[0.24em] text-[var(--text-muted)]">
          {label}
        </span>
      </div>
      <div className="pt-3">{children}</div>
    </div>
  );
}

function OrderingPreview() {
  return (
    <VisualShell label="Ordering">
      <div className="grid grid-cols-[minmax(0,1.1fr)_112px] gap-3 sm:grid-cols-[minmax(0,1.2fr)_minmax(128px,0.8fr)]">
        <div className="space-y-3">
          <div className="theme-panel rounded-[18px] p-3">
            <div className="flex flex-wrap gap-2">
              <span className="theme-chip rounded-full px-2.5 py-1 text-[10px] font-medium uppercase tracking-[0.18em]">
                Pickup
              </span>
              <span className="rounded-full border border-[color:var(--border-subtle)] px-2.5 py-1 text-[10px] font-medium uppercase tracking-[0.18em] text-[var(--text-muted)]">
                Menu
              </span>
            </div>
            <div className="mt-3 rounded-[16px] border border-[color:var(--border-subtle)] bg-[var(--surface-soft)] p-3">
              <div className="h-2.5 w-24 rounded-full bg-[var(--surface-accent)]" />
              <div className="mt-2 h-2 w-full rounded-full bg-[var(--surface-contrast)]" />
              <div className="mt-1.5 h-2 w-4/5 rounded-full bg-[var(--surface-contrast)]" />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2">
            {[0, 1, 2].map((item) => (
              <div
                className="rounded-[16px] border border-[color:var(--border-subtle)] bg-[var(--surface-soft)] p-2.5"
                key={item}
              >
                <div className="h-10 rounded-[12px] bg-[var(--surface-contrast)]" />
                <div className="mt-2 h-2 w-3/4 rounded-full bg-[var(--surface-contrast)]" />
                <div className="mt-1.5 h-2 w-1/2 rounded-full bg-[var(--surface-accent)]" />
              </div>
            ))}
          </div>
        </div>

        <div className="theme-panel-contrast flex flex-col rounded-[18px] p-3">
          <div className="h-2.5 w-16 rounded-full bg-[var(--surface-accent)]" />
          <div className="mt-3 space-y-2.5">
            {[0, 1, 2].map((item) => (
              <div
                className="rounded-[14px] border border-[color:var(--border-subtle)] bg-[var(--surface-soft)] p-2"
                key={item}
              >
                <div className="h-2 w-full rounded-full bg-[var(--surface-contrast)]" />
                <div className="mt-1.5 h-2 w-2/3 rounded-full bg-[var(--surface-contrast)]" />
              </div>
            ))}
          </div>
          <div className="mt-auto rounded-full bg-[var(--surface-accent)] px-3 py-2 text-center text-[10px] font-medium uppercase tracking-[0.18em] text-[var(--accent-contrast-text)]">
            Pay
          </div>
        </div>
      </div>
    </VisualShell>
  );
}

function ServicesPreview() {
  return (
    <VisualShell label="Website">
      <div className="space-y-3">
        <div className="rounded-[20px] border border-[color:var(--border-subtle)] bg-[var(--surface-soft)] p-3 sm:p-4">
          <div className="flex items-center justify-between gap-3">
            <div className="h-2.5 w-20 rounded-full bg-[var(--surface-accent)]" />
            <div className="flex gap-1.5">
              {[0, 1, 2].map((item) => (
                <span
                  className="h-2 w-8 rounded-full bg-[var(--surface-contrast)]"
                  key={item}
                />
              ))}
            </div>
          </div>

          <div className="mt-4 grid gap-3 sm:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)]">
            <div>
              <div className="h-3 w-3/4 rounded-full bg-[var(--surface-contrast)]" />
              <div className="mt-2 h-3 w-11/12 rounded-full bg-[var(--surface-contrast)]" />
              <div className="mt-2 h-2 w-2/3 rounded-full bg-[var(--surface-accent)]" />
              <div className="mt-4 flex flex-wrap gap-2">
                <span className="theme-chip rounded-full px-2.5 py-1 text-[10px] font-medium uppercase tracking-[0.16em]">
                  Identity
                </span>
                <span className="rounded-full border border-[color:var(--border-subtle)] px-2.5 py-1 text-[10px] font-medium uppercase tracking-[0.16em] text-[var(--text-muted)]">
                  Services
                </span>
              </div>
            </div>

            <div className="grid gap-2">
              <div className="h-14 rounded-[16px] bg-[var(--surface-contrast)]" />
              <div className="grid grid-cols-2 gap-2">
                <div className="h-12 rounded-[14px] bg-[var(--surface-contrast)]" />
                <div className="h-12 rounded-[14px] bg-[var(--surface-accent)]" />
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2">
          {[0, 1, 2].map((item) => (
            <div
              className="rounded-[16px] border border-[color:var(--border-subtle)] bg-[var(--surface-soft)] p-3"
              key={item}
            >
              <div className="h-2 w-3/4 rounded-full bg-[var(--surface-contrast)]" />
              <div className="mt-2 h-8 rounded-[12px] bg-[var(--surface-contrast)]" />
            </div>
          ))}
        </div>
      </div>
    </VisualShell>
  );
}

function IntakePreview() {
  return (
    <VisualShell label="Intake">
      <div className="grid grid-cols-[104px_minmax(0,1fr)] gap-3 sm:grid-cols-[116px_minmax(0,1fr)]">
        <div className="theme-panel-contrast rounded-[22px] p-2.5">
          <div className="mx-auto h-1.5 w-12 rounded-full bg-[var(--surface-contrast)]" />
          <div className="mt-3 rounded-[18px] border border-[color:var(--border-subtle)] bg-[var(--surface-soft)] p-3">
            <div className="mx-auto h-10 w-10 rounded-[14px] bg-[var(--surface-accent)]" />
            <div className="mt-3 h-2 w-full rounded-full bg-[var(--surface-contrast)]" />
            <div className="mt-1.5 h-2 w-3/4 rounded-full bg-[var(--surface-contrast)]" />
            <div className="mt-4 space-y-2">
              {[0, 1, 2].map((item) => (
                <div
                  className="h-8 rounded-[12px] bg-[var(--surface-contrast)]"
                  key={item}
                />
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <div className="rounded-[18px] border border-[color:var(--border-subtle)] bg-[var(--surface-soft)] p-3">
            <div className="h-2.5 w-24 rounded-full bg-[var(--surface-accent)]" />
            <div className="mt-3 grid gap-2">
              {[0, 1, 2].map((item) => (
                <div
                  className="rounded-[14px] border border-[color:var(--border-subtle)] bg-[var(--surface-muted)] px-3 py-2.5"
                  key={item}
                >
                  <div className="h-2 w-20 rounded-full bg-[var(--surface-contrast)]" />
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            {[0, 1].map((item) => (
              <div
                className="rounded-[16px] border border-[color:var(--border-subtle)] bg-[var(--surface-soft)] p-3"
                key={item}
              >
                <div className="h-2 w-2/3 rounded-full bg-[var(--surface-contrast)]" />
                <div className="mt-2 h-8 rounded-[12px] bg-[var(--surface-contrast)]" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </VisualShell>
  );
}

function CommercePreview() {
  return (
    <VisualShell label="Checkout">
      <div className="space-y-3">
        <div className="grid gap-3 sm:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)]">
          <div className="rounded-[20px] border border-[color:var(--border-subtle)] bg-[var(--surface-soft)] p-3">
            <div className="h-2.5 w-16 rounded-full bg-[var(--surface-accent)]" />
            <div className="mt-3 rounded-[16px] bg-[var(--surface-contrast)] p-3">
              <div className="h-16 rounded-[14px] border border-[color:var(--border-subtle)] bg-[var(--surface-soft)]" />
            </div>
            <div className="mt-3 space-y-2">
              <div className="h-2 w-4/5 rounded-full bg-[var(--surface-contrast)]" />
              <div className="h-2 w-2/3 rounded-full bg-[var(--surface-contrast)]" />
            </div>
          </div>

          <div className="theme-panel-contrast rounded-[20px] p-3">
            <div className="grid grid-cols-2 gap-2">
              {[0, 1, 2, 3].map((item) => (
                <div
                  className="rounded-[16px] border border-[color:var(--border-subtle)] bg-[var(--surface-soft)] p-2.5"
                  key={item}
                >
                  <div className="h-8 rounded-[12px] bg-[var(--surface-contrast)]" />
                  <div className="mt-2 h-2 w-3/4 rounded-full bg-[var(--surface-contrast)]" />
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="rounded-[18px] border border-[color:var(--border-subtle)] bg-[var(--surface-soft)] p-3">
          <div className="flex items-center justify-between gap-3">
            <div className="h-2.5 w-20 rounded-full bg-[var(--surface-contrast)]" />
            <div className="rounded-full bg-[var(--surface-accent)] px-3 py-1.5 text-[10px] font-medium uppercase tracking-[0.18em] text-[var(--accent-contrast-text)]">
              Ready
            </div>
          </div>
        </div>
      </div>
    </VisualShell>
  );
}

const previewComponents = {
  commerce: CommercePreview,
  intake: IntakePreview,
  ordering: OrderingPreview,
  services: ServicesPreview,
};

function BuildPreview({ preview }) {
  const PreviewComponent = previewComponents[preview] || ServicesPreview;

  return <PreviewComponent />;
}

function BuildCard({ build }) {
  return (
    <article className="group rounded-[30px] border border-[color:var(--border-subtle)] bg-[var(--surface-muted)] p-4 transition-[transform,border-color,opacity] duration-300 hover:-translate-y-1 hover:border-[color:var(--border-accent)] sm:p-5">
      <BuildPreview preview={build.preview} />

      <div className="mt-5 space-y-4">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="min-w-0 space-y-1">
            <p className="text-[10px] font-medium uppercase tracking-[0.28em] text-[var(--text-muted)]">
              {build.id}
            </p>
            <h3 className="text-xl font-semibold tracking-[-0.03em] text-[var(--text-primary)]">
              {build.name}
            </h3>
            <p className="text-sm text-[var(--text-secondary)]">
              {build.descriptor}
            </p>
          </div>

          <div className="theme-panel-contrast rounded-[18px] px-3 py-2 text-right">
            <span className="block text-[10px] font-medium uppercase tracking-[0.22em] text-[var(--text-muted)]">
              Delivery
            </span>
            <span className="mt-1 block text-sm font-medium text-[var(--text-primary)]">
              {build.timeline}
            </span>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          {build.tags.map((tag) => (
            <span
              className="theme-chip rounded-full px-3 py-1.5 text-[10px] font-medium uppercase tracking-[0.18em]"
              key={tag}
            >
              {tag}
            </span>
          ))}
        </div>

        <p className="text-sm leading-7 text-[var(--text-secondary)]">
          {build.outcome}
        </p>

        <div className="flex items-center justify-between gap-3 border-t border-[color:var(--border-subtle)] pt-4">
          <span className="text-[10px] font-medium uppercase tracking-[0.24em] text-[var(--text-muted)]">
            Configured Output
          </span>
          <span className="text-sm font-medium text-[var(--text-primary)]">
            {build.scope}
          </span>
        </div>
      </div>
    </article>
  );
}

export default function RecentBuilds() {
  return (
    <div className="scroll-mt-28 sm:scroll-mt-32" id="recent-builds">
      <Section className="pt-0 pb-10 sm:pb-12" width="full">
        <div className="mx-auto max-w-6xl space-y-8">
          <div className="max-w-3xl space-y-3">
            <h2 className="text-2xl font-semibold tracking-[-0.04em] text-[var(--text-primary)] sm:text-3xl">
              Recent Builds
            </h2>
            <p className="text-sm leading-7 text-[var(--text-secondary)] sm:text-base">
              Examples of systems built using this process.
            </p>
          </div>

          <div className="grid gap-5 lg:grid-cols-2">
            {recentBuilds.map((build) => (
              <BuildCard build={build} key={build.id} />
            ))}
          </div>
        </div>
      </Section>
    </div>
  );
}
