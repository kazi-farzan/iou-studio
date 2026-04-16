function getStepClasses(status) {
  if (status === "complete") {
    return {
      container:
        "border-[color:var(--border-accent)] bg-[var(--surface-accent)]",
      connector: "bg-[var(--border-accent)]",
      indicator:
        "border-[color:var(--border-accent)] bg-[var(--accent-secondary)] text-[var(--text-inverse)] shadow-[var(--shadow-soft)]",
      label: "text-[var(--text-primary)]",
      meta: "text-[var(--accent-secondary)]",
    };
  }

  if (status === "current") {
    return {
      container:
        "border-[color:var(--border-accent)] bg-[linear-gradient(180deg,var(--surface-accent),var(--surface-soft))] shadow-[var(--shadow-soft)]",
      connector: "bg-[var(--border-accent)]",
      indicator:
        "border-[color:var(--border-accent)] bg-[var(--surface-strong)] text-[var(--text-primary)] shadow-[var(--shadow-soft)]",
      label: "text-[var(--text-primary)]",
      meta: "text-[var(--accent-secondary)]",
    };
  }

  if (status === "available") {
    return {
      container:
        "border-[color:var(--border-subtle)] bg-[var(--surface-soft)]",
      connector: "bg-[var(--border-accent)]",
      indicator:
        "border-[color:var(--border-accent)] bg-[var(--surface-accent)] text-[var(--accent-contrast-text)]",
      label: "text-[var(--text-primary)]",
      meta: "text-[var(--text-muted)]",
    };
  }

  return {
    container: "border-[color:var(--border-subtle)] bg-[var(--surface-soft)]",
    connector: "bg-[var(--border-subtle)]",
    indicator:
      "border-[color:var(--border-subtle)] bg-[var(--surface-muted)] text-[var(--text-muted)]",
    label: "text-[var(--text-secondary)]",
    meta: "text-[var(--text-muted)]",
  };
}

export default function StepFlowIndicator({
  description = "Configure the build, review it, submit the request, then confirm the handoff.",
  steps,
}) {
  const mobileColumns = steps.length >= 4 ? 2 : Math.max(steps.length, 1);

  return (
    <div className="theme-panel rounded-[28px] border border-[color:var(--border-subtle)] px-4 py-4 sm:px-5 sm:py-5">
      <div className="space-y-4">
        <div className="space-y-2">
          <p className="text-xs font-medium uppercase tracking-[0.28em] text-[var(--accent-secondary)]">
            System Flow
          </p>

          {description ? (
            <p className="max-w-3xl text-sm leading-6 text-[var(--text-secondary)]">
              {description}
            </p>
          ) : null}
        </div>

        <ol
          aria-label="Configurator step flow"
          className="grid gap-3 sm:gap-4 [grid-template-columns:repeat(var(--step-columns-mobile),minmax(0,1fr))] lg:[grid-template-columns:repeat(var(--step-columns-desktop),minmax(0,1fr))]"
          style={{
            "--step-columns-desktop": String(Math.max(steps.length, 1)),
            "--step-columns-mobile": String(mobileColumns),
          }}
        >
          {steps.map((step, index) => {
            const classes = getStepClasses(step.status);
            const isLastStep = index === steps.length - 1;
            const connectorClasses = isLastStep
              ? ""
              : getStepClasses(steps[index + 1].status).connector;

            return (
              <li
                aria-current={step.status === "current" ? "step" : undefined}
                className="relative min-w-0"
                key={step.id}
              >
                {!isLastStep ? (
                  <span
                    aria-hidden="true"
                    className={[
                      "absolute left-[calc(50%+1.4rem)] right-[-1rem] top-[1.25rem] hidden h-px lg:block",
                      connectorClasses,
                    ].join(" ")}
                  />
                ) : null}

                <div
                  className={[
                    "relative flex h-full min-w-0 flex-col gap-3 rounded-[22px] border px-3 py-3 sm:px-4 sm:py-4",
                    classes.container,
                  ].join(" ")}
                >
                  <span
                    className={[
                      "inline-flex h-10 w-10 items-center justify-center rounded-full border text-[11px] font-semibold tracking-[0.18em]",
                      classes.indicator,
                    ].join(" ")}
                  >
                    {String(index + 1).padStart(2, "0")}
                  </span>

                  <div className="min-w-0">
                    <p
                      className={[
                        "text-[10px] font-medium uppercase tracking-[0.24em]",
                        classes.meta,
                      ].join(" ")}
                    >
                      Step {index + 1}
                    </p>
                    <p
                      className={[
                        "mt-2 text-sm font-medium tracking-[0.01em] sm:text-base",
                        classes.label,
                      ].join(" ")}
                    >
                      {step.label}
                    </p>
                  </div>
                </div>
              </li>
            );
          })}
        </ol>
      </div>
    </div>
  );
}
