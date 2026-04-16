import { useNavigate } from "react-router-dom";
import Button from "../components/ui/Button.jsx";
import Section from "../components/ui/Section.jsx";
import {
  configuratorModules,
  configuratorPackages,
  formatTimelineRange,
  getPackageIncludedModules,
  groupModulesByCategory,
} from "../data/configuratorSchema.js";
import { formatInr } from "../data/pricing.js";
import { ORDER_FLOW_MODE_PACKAGES } from "../orderFlow/orderFlow.js";
import { useOrderFlow } from "../orderFlow/useOrderFlow.js";

const moduleGroups = groupModulesByCategory(configuratorModules);
const startingSetups = configuratorPackages.map((packageConfig) => ({
  ...packageConfig,
  includedModules: getPackageIncludedModules(packageConfig),
}));

const flowSteps = ["Configure", "Review", "Submit", "Confirm"];

function formatModuleTimeline(module) {
  return formatTimelineRange(module.baseTimelineDays, "Timeline pending");
}

function formatPackageStartingPrice(packageConfig) {
  return `${formatInr(packageConfig.pricing.monthly)}/month`;
}

function MenuStat({ detail, label, value }) {
  return (
    <div className="rounded-[24px] border border-[color:var(--border-subtle)] bg-[var(--surface)] px-5 py-4">
      <p className="text-[11px] font-medium uppercase tracking-[0.24em] text-[var(--text-muted)]">
        {label}
      </p>
      <p className="mt-3 text-2xl font-semibold tracking-[-0.03em] text-[var(--text-primary)]">
        {value}
      </p>
      <p className="mt-2 text-sm leading-6 text-[var(--text-secondary)]">
        {detail}
      </p>
    </div>
  );
}

function MetricCell({ label, value }) {
  return (
    <div className="rounded-[20px] border border-[color:var(--border-subtle)] bg-[var(--surface)] px-4 py-3">
      <p className="text-[11px] font-medium uppercase tracking-[0.22em] text-[var(--text-muted)]">
        {label}
      </p>
      <p className="mt-2 text-sm font-semibold text-[var(--text-primary)]">
        {value}
      </p>
    </div>
  );
}

export default function Services() {
  const navigate = useNavigate();
  const {
    mode,
    selectedCustomModuleIds,
    selectedPlanId,
    startCustomBuild,
    startPackageBuild,
  } = useOrderFlow();
  const selectedModuleIds = new Set(selectedCustomModuleIds);
  const activeSetupId = mode === ORDER_FLOW_MODE_PACKAGES ? selectedPlanId : null;

  function handleModuleEntry(moduleId) {
    startCustomBuild(moduleId);
    navigate({
      pathname: "/pricing",
      hash: "#builder",
    });
  }

  function handleSetupEntry(packageId) {
    startPackageBuild(packageId);
    navigate({
      pathname: "/pricing",
      hash: "#builder",
    });
  }

  return (
    <div className="w-full">
      <Section
        className="pt-4 sm:pt-8"
        description="Browse the system by module group, compare baseline price and timeline, and send a preselected setup straight into the build flow."
        eyebrow="System Menu"
        title="Select modules here, then configure the build."
        width="full"
      >
        <div className="space-y-6 sm:space-y-8">
          <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_340px]">
            <div className="rounded-[32px] border border-[color:var(--border-subtle)] bg-[linear-gradient(180deg,var(--surface),var(--surface-soft))] p-6 sm:p-7">
              <p className="text-xs font-medium uppercase tracking-[0.28em] text-[var(--accent-secondary)]">
                Flow Alignment
              </p>
              <p className="mt-3 max-w-3xl text-sm leading-7 text-[var(--text-secondary)] sm:text-base">
                This page acts as the system menu and pre-configuration layer. Every
                entry opens the same build surface and keeps the selected module or
                starting setup attached while you move through the full order flow.
              </p>

              <div className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                {flowSteps.map((step, index) => (
                  <div
                    className="rounded-[22px] border border-[color:var(--border-subtle)] bg-[var(--surface)] px-4 py-4"
                    key={step}
                  >
                    <p className="text-[11px] font-medium uppercase tracking-[0.24em] text-[var(--text-muted)]">
                      Step {index + 1}
                    </p>
                    <p className="mt-2 text-sm font-semibold text-[var(--text-primary)]">
                      {step}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="theme-panel rounded-[32px] p-6 sm:p-7">
              <p className="text-xs font-medium uppercase tracking-[0.28em] text-[var(--accent-secondary)]">
                Entry Logic
              </p>
              <p className="mt-3 text-sm leading-7 text-[var(--text-secondary)]">
                Use <span className="text-[var(--text-primary)]">Add to Build</span>{" "}
                to seed an individual module into the configurator, or{" "}
                <span className="text-[var(--text-primary)]">Use this setup</span> to
                start from a prepared configuration.
              </p>
              <p className="mt-4 text-sm leading-7 text-[var(--text-secondary)]">
                The active configuration stays inside shared order-flow state, so there
                is no dead step between browsing, configuring, reviewing, and
                submitting.
              </p>
            </div>
          </div>

          <div className="grid gap-3 md:grid-cols-3">
            <MenuStat
              detail="Structured directly from the unified configuration schema."
              label="Module groups"
              value={String(moduleGroups.length)}
            />
            <MenuStat
              detail="Each row opens the same configurator with a direct next step."
              label="Modules"
              value={String(configuratorModules.length)}
            />
            <MenuStat
              detail="Prepared entry points built from included modules and shared pricing data."
              label="Starting setups"
              value={String(startingSetups.length)}
            />
          </div>

          <div className="space-y-5 sm:space-y-6">
            {moduleGroups.map((group) => {
              const selectedCount = group.modules.filter((module) =>
                selectedModuleIds.has(module.id),
              ).length;

              return (
                <section
                  className="overflow-hidden rounded-[32px] border border-[color:var(--border-subtle)] bg-[linear-gradient(180deg,var(--surface-muted),var(--surface-soft))]"
                  key={group.id}
                >
                  <div className="grid xl:grid-cols-[280px_minmax(0,1fr)]">
                    <div className="border-b border-[color:var(--border-subtle)] px-6 py-6 sm:px-7 xl:border-b-0 xl:border-r">
                      <p className="text-xs font-medium uppercase tracking-[0.28em] text-[var(--accent-secondary)]">
                        Module Group
                      </p>
                      <h2 className="mt-4 text-3xl font-semibold tracking-[-0.04em] text-[var(--text-primary)]">
                        {group.title}
                      </h2>
                      <p className="mt-3 text-sm leading-7 text-[var(--text-secondary)]">
                        {group.description}
                      </p>

                      <div className="mt-5 flex flex-wrap gap-2">
                        <span className="rounded-full border border-[color:var(--border-subtle)] bg-[var(--surface)] px-3 py-1 text-[11px] font-medium uppercase tracking-[0.22em] text-[var(--text-secondary)]">
                          {group.modules.length} module
                          {group.modules.length === 1 ? "" : "s"}
                        </span>
                        <span className="rounded-full border border-[color:var(--border-subtle)] bg-[var(--surface)] px-3 py-1 text-[11px] font-medium uppercase tracking-[0.22em] text-[var(--text-secondary)]">
                          {selectedCount
                            ? `${selectedCount} in build`
                            : "Ready to configure"}
                        </span>
                      </div>
                    </div>

                    <div className="divide-y divide-[color:var(--border-subtle)]">
                      {group.modules.map((module) => {
                        const isSelected = selectedModuleIds.has(module.id);

                        return (
                          <article
                            className="grid gap-5 px-6 py-6 sm:px-7 lg:grid-cols-[minmax(0,1.35fr)_minmax(220px,0.72fr)_auto] lg:items-center"
                            key={module.id}
                          >
                            <div className="min-w-0">
                              <div className="flex flex-wrap items-center gap-2">
                                <h3 className="text-xl font-semibold tracking-[-0.03em] text-[var(--text-primary)]">
                                  {module.title}
                                </h3>
                                <span className="rounded-full border border-[color:var(--border-subtle)] bg-[var(--surface)] px-3 py-1 text-[10px] font-medium uppercase tracking-[0.18em] text-[var(--text-muted)]">
                                  {isSelected ? "In build" : "Available"}
                                </span>
                              </div>

                              <p className="mt-3 max-w-[56ch] text-sm leading-7 text-[var(--text-secondary)]">
                                {module.description}
                              </p>

                              {module.deliverables.length ? (
                                <p className="mt-4 text-sm leading-7 text-[var(--text-secondary)]">
                                  <span className="font-medium text-[var(--text-primary)]">
                                    Included in setup:
                                  </span>{" "}
                                  {module.deliverables.join(" / ")}
                                </p>
                              ) : null}
                            </div>

                            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
                              <MetricCell
                                label="Base price"
                                value={formatInr(module.basePrice)}
                              />
                              <MetricCell
                                label="Base timeline"
                                value={formatModuleTimeline(module)}
                              />
                            </div>

                            <div className="flex items-center lg:justify-end">
                              <Button
                                className="w-full lg:w-auto"
                                onClick={() => handleModuleEntry(module.id)}
                                size="sm"
                              >
                                {isSelected ? "Configure" : "Add to Build"}
                              </Button>
                            </div>
                          </article>
                        );
                      })}
                    </div>
                  </div>
                </section>
              );
            })}
          </div>
        </div>
      </Section>

      <Section
        className="pt-2 sm:pt-4"
        description="Start from a prepared configuration when you want a faster baseline. These setups open inside the same system and can still be reviewed before submission."
        eyebrow="Starting Setups"
        title="Pre-built configurations for direct entry."
        width="full"
      >
        <div className="overflow-hidden rounded-[32px] border border-[color:var(--border-subtle)] bg-[linear-gradient(180deg,var(--surface),var(--surface-soft))]">
          <div className="divide-y divide-[color:var(--border-subtle)]">
            {startingSetups.map((packageConfig) => {
              const isActive = activeSetupId === packageConfig.id;

              return (
                <article
                  className="grid gap-5 px-6 py-6 sm:px-7 lg:grid-cols-[minmax(0,1.3fr)_minmax(240px,0.8fr)_auto] lg:items-center"
                  key={packageConfig.id}
                >
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <h2 className="text-xl font-semibold tracking-[-0.03em] text-[var(--text-primary)]">
                        {packageConfig.name}
                      </h2>

                      {packageConfig.isMostPopular ? (
                        <span className="rounded-full border border-[color:var(--border-subtle)] bg-[var(--surface)] px-3 py-1 text-[10px] font-medium uppercase tracking-[0.18em] text-[var(--text-muted)]">
                          Common start
                        </span>
                      ) : null}

                      {isActive ? (
                        <span className="rounded-full border border-[color:var(--border-accent)] bg-[var(--surface-accent)] px-3 py-1 text-[10px] font-medium uppercase tracking-[0.18em] text-[var(--accent-contrast-text)]">
                          Active setup
                        </span>
                      ) : null}
                    </div>

                    <p className="mt-3 max-w-[58ch] text-sm leading-7 text-[var(--text-secondary)]">
                      {packageConfig.description}
                    </p>
                    <p className="mt-4 text-sm leading-7 text-[var(--text-secondary)]">
                      <span className="font-medium text-[var(--text-primary)]">
                        Included in setup:
                      </span>{" "}
                      {packageConfig.includedModules.map((module) => module.title).join(" / ")}
                    </p>
                  </div>

                  <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
                    <MetricCell
                      label="Starting price"
                      value={formatPackageStartingPrice(packageConfig)}
                    />
                    <MetricCell
                      label="Timeline"
                      value={packageConfig.timelineEstimate.label}
                    />
                  </div>

                  <div className="flex items-center lg:justify-end">
                    <Button
                      className="w-full lg:w-auto"
                      onClick={() => handleSetupEntry(packageConfig.id)}
                      size="sm"
                    >
                      {isActive ? "Configure" : "Use this setup"}
                    </Button>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </Section>

      <Section
        align="center"
        className="pb-10 sm:pb-14"
        description="Open the configurator directly if you already know the path. The same state continues forward into review, submit, and confirmation."
        eyebrow="Build Surface"
        title="Continue from the menu or go straight into configuration."
        width="default"
      >
        <div className="flex flex-wrap justify-center gap-3">
          <Button size="lg" to="/pricing#builder">
            Open Configurator
          </Button>
          <Button size="lg" to="/contact" variant="secondary">
            Contact Support
          </Button>
        </div>
      </Section>
    </div>
  );
}
