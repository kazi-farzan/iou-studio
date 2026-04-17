function getStepClasses(status) {
  if (status === "complete") {
    return {
      container:
        "border-[color:var(--border-accent)] bg-[var(--surface-accent)] shadow-[var(--shadow-raised)]",
      connector: "bg-[var(--border-accent)]",
      indicator:
        "border-[color:var(--border-accent)] bg-[var(--accent-secondary)] text-[var(--text-inverse)] shadow-[var(--shadow-raised)]",
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
    <div className="theme-panel rounded-[32px] border border-[color:var(--border-subtle)] px-5 py-6 sm:px-7 sm:py-7 lg:px-8">
      <div className="space-y-6 sm:space-y-7">
        <div className="max-w-4xl space-y-3">
          <p className="type-kicker">
            System Flow
          </p>

          {description ? (
            <p className="text-[0.98rem] leading-7 text-[var(--text-secondary)] sm:text-base sm:leading-8">
              {description}
            </p>
          ) : null}
        </div>

        <ol
          aria-label="Configurator step flow"
          className="grid gap-4 lg:gap-5 [grid-template-columns:repeat(var(--step-columns-mobile),minmax(0,1fr))] lg:[grid-template-columns:repeat(var(--step-columns-desktop),minmax(0,1fr))]"
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
                      "absolute left-[calc(50%+1.6rem)] right-[-1.4rem] top-[1.45rem] hidden h-px lg:block",
                      connectorClasses,
                    ].join(" ")}
                  />
                ) : null}

                <div
                  className={[
                    "relative flex h-full min-w-0 flex-col gap-4 rounded-[26px] border px-5 py-5 sm:px-6 sm:py-6",
                    classes.container,
                  ].join(" ")}
                >
                  <span
                    className={[
                      "inline-flex h-11 w-11 items-center justify-center rounded-full border text-[11px] font-semibold tracking-[0.18em]",
                      classes.indicator,
                    ].join(" ")}
                  >
                    {String(index + 1).padStart(2, "0")}
                  </span>

                  <div className="min-w-0 space-y-2">
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
                        "text-base font-semibold tracking-[0.01em] sm:text-[1.05rem]",
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
