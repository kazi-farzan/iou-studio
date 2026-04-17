import Button from "../ui/Button.jsx";
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

function PreviewPill({ children, tone = "default" }) {
  const toneClasses =
    tone === "accent"
      ? "theme-chip"
      : "border border-[color:var(--border-subtle)] bg-[var(--surface)] text-[var(--text-secondary)]";

  return (
    <span
      className={[
        "rounded-full px-2.5 py-1 text-[10px] font-medium uppercase tracking-[0.18em]",
        toneClasses,
      ].join(" ")}
    >
      {children}
    </span>
  );
}

function PreviewLine({ tone = "default", widthClass = "w-full" }) {
  const toneClasses =
    tone === "accent"
      ? "bg-[var(--surface-accent-strong)]"
      : "bg-[var(--surface-contrast)]";

  return (
    <div
      className={["h-2 rounded-full", toneClasses, widthClass].join(" ")}
    />
  );
}

function PreviewPanel({ children, className = "" }) {
  return (
    <div
      className={[
        "rounded-[18px] border border-[color:var(--border-subtle)] bg-[var(--surface)]",
        className,
      ].join(" ")}
    >
      {children}
    </div>
  );
}

function VisualShell({ children, label }) {
  return (
    <div className="rounded-[28px] border border-[color:var(--border-subtle)] bg-[linear-gradient(180deg,var(--surface),var(--surface-strong))] p-3 shadow-[var(--shadow-raised)] sm:p-4">
      <div className="flex items-center justify-between border-b border-[color:var(--border-subtle)] pb-3">
        <div className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-[var(--surface-accent-strong)]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[var(--surface-contrast)]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[var(--surface-muted)]" />
        </div>

        <div className="flex items-center gap-2">
          <PreviewPill tone="accent">Output</PreviewPill>
          <span className="text-[10px] font-medium uppercase tracking-[0.24em] text-[var(--text-muted)]">
            {label}
          </span>
        </div>
      </div>

      <div className="pt-3">{children}</div>
    </div>
  );
}

function OrderingPreview() {
  return (
    <VisualShell label="Ordering flow">
      <div className="grid grid-cols-[minmax(0,1.05fr)_108px] gap-3 sm:grid-cols-[minmax(0,1.15fr)_124px]">
        <div className="space-y-3">
          <PreviewPanel className="p-3">
            <div className="flex flex-wrap gap-2">
              <PreviewPill tone="accent">Menu</PreviewPill>
              <PreviewPill>Pickup</PreviewPill>
            </div>

            <div className="mt-3 rounded-[16px] border border-[color:var(--border-subtle)] bg-[var(--surface-soft)] p-3">
              <PreviewLine tone="accent" widthClass="w-24" />
              <div className="mt-2 space-y-1.5">
                <PreviewLine widthClass="w-full" />
                <PreviewLine widthClass="w-4/5" />
              </div>
            </div>
          </PreviewPanel>

          <div className="grid grid-cols-3 gap-2">
            {["Breakfast", "Coffee", "Snacks"].map((item) => (
              <PreviewPanel className="p-2.5" key={item}>
                <div className="rounded-[12px] bg-[var(--surface-soft)] px-2 py-2 text-[9px] font-medium uppercase tracking-[0.16em] text-[var(--text-secondary)]">
                  {item}
                </div>
                <div className="mt-2 space-y-1.5">
                  <PreviewLine widthClass="w-3/4" />
                  <PreviewLine tone="accent" widthClass="w-1/2" />
                </div>
              </PreviewPanel>
            ))}
          </div>
        </div>

        <PreviewPanel className="flex flex-col p-3">
          <p className="text-[9px] font-medium uppercase tracking-[0.2em] text-[var(--text-muted)]">
            Cart
          </p>
          <div className="mt-3 space-y-2">
            {["2x Iced Latte", "1x Sandwich", "Pickup 8:30"].map((item) => (
              <div
                className="rounded-[14px] border border-[color:var(--border-subtle)] bg-[var(--surface-soft)] px-2 py-2 text-[9px] font-medium uppercase tracking-[0.14em] text-[var(--text-secondary)]"
                key={item}
              >
                {item}
              </div>
            ))}
          </div>
          <div className="mt-auto rounded-full bg-[var(--surface-accent)] px-3 py-2 text-center text-[10px] font-medium uppercase tracking-[0.18em] text-[var(--accent-contrast-text)]">
            Pay now
          </div>
        </PreviewPanel>
      </div>
    </VisualShell>
  );
}

function ServicesPreview() {
  return (
    <VisualShell label="Service website">
      <div className="space-y-3">
        <PreviewPanel className="p-3 sm:p-4">
          <div className="flex items-center justify-between gap-3">
            <PreviewLine tone="accent" widthClass="w-20" />
            <div className="flex gap-1.5">
              <PreviewPill>Services</PreviewPill>
              <PreviewPill>Proof</PreviewPill>
            </div>
          </div>

          <div className="mt-4 grid gap-3 sm:grid-cols-[minmax(0,1.12fr)_minmax(0,0.88fr)]">
            <div>
              <PreviewLine widthClass="w-3/4" />
              <div className="mt-2 space-y-1.5">
                <PreviewLine widthClass="w-11/12" />
                <PreviewLine tone="accent" widthClass="w-2/3" />
              </div>
            </div>

            <div className="grid gap-2">
              <div className="rounded-[16px] bg-[var(--surface-soft)] px-3 py-3 text-[9px] font-medium uppercase tracking-[0.16em] text-[var(--text-secondary)]">
                Hero
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div className="rounded-[14px] bg-[var(--surface-soft)] px-3 py-3 text-[9px] font-medium uppercase tracking-[0.16em] text-[var(--text-secondary)]">
                  Offers
                </div>
                <div className="rounded-[14px] bg-[var(--surface-accent)] px-3 py-3 text-[9px] font-medium uppercase tracking-[0.16em] text-[var(--accent-contrast-text)]">
                  Contact
                </div>
              </div>
            </div>
          </div>
        </PreviewPanel>

        <div className="grid grid-cols-3 gap-2">
          {["Identity", "Services", "Lead Form"].map((item) => (
            <PreviewPanel className="px-3 py-3" key={item}>
              <p className="text-[9px] font-medium uppercase tracking-[0.16em] text-[var(--text-secondary)]">
                {item}
              </p>
              <div className="mt-2 space-y-1.5">
                <PreviewLine widthClass="w-3/4" />
                <PreviewLine widthClass="w-1/2" />
              </div>
            </PreviewPanel>
          ))}
        </div>
      </div>
    </VisualShell>
  );
}

function IntakePreview() {
  return (
    <VisualShell label="Intake flow">
      <div className="grid grid-cols-[106px_minmax(0,1fr)] gap-3 sm:grid-cols-[118px_minmax(0,1fr)]">
        <PreviewPanel className="p-2.5">
          <div className="mx-auto h-1.5 w-12 rounded-full bg-[var(--surface-contrast)]" />
          <div className="mt-3 rounded-[18px] bg-[var(--surface-soft)] p-3">
            <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-[14px] bg-[var(--surface-accent)] text-[9px] font-medium uppercase tracking-[0.16em] text-[var(--accent-contrast-text)]">
              Form
            </div>
            <div className="mt-3 space-y-1.5">
              <PreviewLine widthClass="w-full" />
              <PreviewLine widthClass="w-3/4" />
            </div>
            <div className="mt-4 space-y-2">
              {["Name", "Service", "Date"].map((item) => (
                <div
                  className="rounded-[12px] bg-[var(--surface)] px-2 py-2 text-[9px] font-medium uppercase tracking-[0.16em] text-[var(--text-secondary)]"
                  key={item}
                >
                  {item}
                </div>
              ))}
            </div>
          </div>
        </PreviewPanel>

        <div className="space-y-3">
          <PreviewPanel className="p-3">
            <PreviewPill tone="accent">Intake steps</PreviewPill>
            <div className="mt-3 grid gap-2">
              {["Appointment type", "Patient details", "Confirmation"].map((item) => (
                <div
                  className="rounded-[14px] border border-[color:var(--border-subtle)] bg-[var(--surface-soft)] px-3 py-2.5 text-[9px] font-medium uppercase tracking-[0.16em] text-[var(--text-secondary)]"
                  key={item}
                >
                  {item}
                </div>
              ))}
            </div>
          </PreviewPanel>

          <div className="grid grid-cols-2 gap-2">
            {["Services", "FAQ"].map((item) => (
              <PreviewPanel className="px-3 py-3" key={item}>
                <p className="text-[9px] font-medium uppercase tracking-[0.16em] text-[var(--text-secondary)]">
                  {item}
                </p>
                <div className="mt-2 space-y-1.5">
                  <PreviewLine widthClass="w-2/3" />
                  <PreviewLine widthClass="w-full" />
                </div>
              </PreviewPanel>
            ))}
          </div>
        </div>
      </div>
    </VisualShell>
  );
}

function CommercePreview() {
  return (
    <VisualShell label="Checkout system">
      <div className="space-y-3">
        <div className="grid gap-3 sm:grid-cols-[minmax(0,0.94fr)_minmax(0,1.06fr)]">
          <PreviewPanel className="p-3">
            <PreviewPill tone="accent">Product</PreviewPill>
            <div className="mt-3 rounded-[16px] bg-[var(--surface-soft)] p-3">
              <div className="h-16 rounded-[14px] border border-[color:var(--border-subtle)] bg-[var(--surface)]" />
            </div>
            <div className="mt-3 space-y-1.5">
              <PreviewLine widthClass="w-4/5" />
              <PreviewLine widthClass="w-2/3" />
            </div>
          </PreviewPanel>

          <PreviewPanel className="p-3">
            <p className="text-[9px] font-medium uppercase tracking-[0.2em] text-[var(--text-muted)]">
              Checkout states
            </p>
            <div className="mt-3 grid grid-cols-2 gap-2">
              {["Cart", "Address", "Payment", "Confirm"].map((item) => (
                <div
                  className="rounded-[16px] bg-[var(--surface-soft)] px-3 py-3 text-[9px] font-medium uppercase tracking-[0.16em] text-[var(--text-secondary)]"
                  key={item}
                >
                  {item}
                </div>
              ))}
            </div>
          </PreviewPanel>
        </div>

        <PreviewPanel className="flex items-center justify-between gap-3 px-3 py-3">
          <PreviewLine widthClass="w-20" />
          <div className="rounded-full bg-[var(--surface-accent)] px-3 py-1.5 text-[10px] font-medium uppercase tracking-[0.18em] text-[var(--accent-contrast-text)]">
            Ready
          </div>
        </PreviewPanel>
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
    <article className="theme-card overflow-hidden rounded-[34px] p-0">
      <div className="grid lg:grid-cols-[minmax(260px,0.9fr)_minmax(0,1.1fr)]">
        <div className="border-b border-[color:var(--border-subtle)] bg-[linear-gradient(180deg,var(--surface-muted),var(--surface-soft))] p-4 sm:p-5 lg:border-b-0 lg:border-r">
          <BuildPreview preview={build.preview} />
        </div>

        <div className="flex flex-col p-5 sm:p-6">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="min-w-0 space-y-2">
              <p className="type-label">Build {build.id}</p>
              <h3 className="type-card-title">{build.name}</h3>
              <p className="text-sm font-medium text-[var(--text-secondary)]">
                {build.descriptor}
              </p>
            </div>

            <div className="rounded-[20px] border border-[color:var(--border-subtle)] bg-[var(--surface-soft)] px-4 py-3 sm:min-w-[11rem]">
              <p className="type-label">Delivery</p>
              <p className="mt-2 text-sm font-semibold text-[var(--text-primary)]">
                {build.timeline}
              </p>
            </div>
          </div>

          <div className="mt-5 grid gap-3 sm:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
            <div className="rounded-[22px] border border-[color:var(--border-subtle)] bg-[var(--surface-soft)] px-4 py-4">
              <p className="type-label">Output type</p>
              <p className="mt-2 text-sm font-medium leading-6 text-[var(--text-primary)]">
                {build.scope}
              </p>
            </div>

            <div className="rounded-[22px] border border-[color:var(--border-subtle)] bg-[var(--surface-soft)] px-4 py-4">
              <p className="type-label">Modules in play</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {build.tags.map((tag, index) => (
                  <span
                    className={[
                      "rounded-full px-3 py-1.5 text-[10px] font-medium uppercase tracking-[0.18em]",
                      index === 0
                        ? "theme-chip"
                        : "border border-[color:var(--border-subtle)] bg-[var(--surface)] text-[var(--text-secondary)]",
                    ].join(" ")}
                    key={tag}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-5 border-t border-[color:var(--border-subtle)] pt-5">
            <p className="type-label">What shipped</p>
            <p className="mt-3 text-sm leading-7 text-[var(--text-secondary)]">
              {build.outcome}
            </p>
          </div>
        </div>
      </div>
    </article>
  );
}

export default function RecentBuilds() {
  return (
    <div className="scroll-mt-28 sm:scroll-mt-32" id="recent-builds">
      <Section spacing="default" width="full">
        <div className="mx-auto max-w-[82rem] space-y-8 lg:space-y-10">
          <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(280px,0.42fr)] lg:items-end">
            <div className="max-w-3xl space-y-4">
              <p className="type-kicker">Proof</p>
              <h2 className="type-section-title max-w-[11ch]">
                Recent Build Log
              </h2>
              <p className="max-w-[48ch] text-base leading-8 text-[var(--text-secondary)]">
                Representative build records that show the kinds of outputs this
                system already produces. Use them for quick proof here, then go
                deeper only if you need the full case-study detail.
              </p>
            </div>

            <div className="theme-panel-contrast rounded-[28px] border border-[color:var(--border-subtle)] px-5 py-5 sm:px-6">
              <p className="type-label">Use this section for</p>
              <p className="mt-3 text-sm leading-7 text-[var(--text-secondary)]">
                Scan what gets built, how it is packaged, and how recent outputs
                are structured without leaving the flow.
              </p>
              <Button
                className="mt-4 w-fit"
                size="sm"
                to="/case-studies"
                variant="ghost"
              >
                View documented builds
              </Button>
            </div>
          </div>

          <div className="grid gap-5 xl:grid-cols-2">
            {recentBuilds.map((build) => (
              <BuildCard build={build} key={build.id} />
            ))}
          </div>
        </div>
      </Section>
    </div>
  );
}
