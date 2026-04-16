import { startTransition, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import StepFlowIndicator from "../components/pricing/StepFlowIndicator.jsx";
import Button from "../components/ui/Button.jsx";
import Card from "../components/ui/Card.jsx";
import Section from "../components/ui/Section.jsx";
import { useOrderFlow } from "../orderFlow/useOrderFlow.js";
import { buildOrderFlowSteps } from "../orderFlow/orderFlow.js";

function getFieldClasses(hasError) {
  return [
    "theme-input rounded-[20px] border px-4 py-3 text-sm leading-6",
    hasError
      ? "border-[rgba(217,93,106,0.38)] bg-[rgba(217,93,106,0.08)]"
      : "",
  ]
    .filter(Boolean)
    .join(" ");
}

function validateOrderDetails(values) {
  const errors = {};
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!values.name.trim()) {
    errors.name = "Enter a name for the primary contact.";
  }

  if (!values.businessName.trim()) {
    errors.businessName = "Add the business or brand name.";
  }

  if (!values.email.trim()) {
    errors.email = "Enter an email so we can reply.";
  } else if (!emailPattern.test(values.email.trim())) {
    errors.email = "Enter a valid email address.";
  }

  return errors;
}

export default function OrderSummary() {
  const navigate = useNavigate();
  const { contactDraft, draftConfiguration, setContactDraft, submitOrder } =
    useOrderFlow();
  const [formErrors, setFormErrors] = useState({});
  const hasSelection = draftConfiguration.hasSelection;
  const isPackageMode = Boolean(draftConfiguration.packageSelection);
  const steps = buildOrderFlowSteps("review", { hasSelection });

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
  }, []);

  function handleFieldChange(event) {
    const { name, value } = event.target;

    setContactDraft((current) => ({ ...current, [name]: value }));
    setFormErrors((current) => {
      if (!current[name]) {
        return current;
      }

      const nextErrors = { ...current };
      delete nextErrors[name];
      return nextErrors;
    });
  }

  function handleSubmit(event) {
    event.preventDefault();

    if (!hasSelection) {
      navigate("/pricing#builder");
      return;
    }

    const nextErrors = validateOrderDetails(contactDraft);

    if (Object.keys(nextErrors).length) {
      setFormErrors(nextErrors);
      return;
    }

    const submittedOrder = submitOrder(contactDraft);

    if (!submittedOrder) {
      return;
    }

    startTransition(() => {
      navigate("/confirmation");
    });
  }

  return (
    <div className="w-full">
      <Section className="pt-3 sm:pt-4" width="full">
        <div className="space-y-10 sm:space-y-8">
          <div className="max-w-4xl space-y-4 sm:space-y-3">
            <p className="text-xs font-medium uppercase tracking-[0.32em] text-[var(--accent-secondary)]">
              Order Review
            </p>
            <h1 className="max-w-3xl text-3xl font-semibold tracking-[-0.04em] text-[var(--text-primary)] sm:text-4xl">
              Review your setup
            </h1>
            <p className="max-w-3xl text-sm leading-7 text-[var(--text-secondary)] sm:text-base">
              Confirm the active configuration, then submit a structured request
              tied to the reviewed build.
            </p>
          </div>

          <StepFlowIndicator
            description="Review the configured build, submit the request, and move into confirmation."
            steps={steps}
          />

          {!hasSelection ? (
            <Card className="p-6 sm:p-8">
              <div className="space-y-5">
                <h2 className="text-2xl font-semibold tracking-[-0.04em] text-[var(--text-primary)]">
                  There is no active setup to review yet.
                </h2>
                <p className="max-w-2xl text-sm leading-7 text-[var(--text-secondary)] sm:text-base">
                  Return to the configurator and choose a package or add custom
                  modules before continuing.
                </p>
                <div className="flex flex-col gap-3 sm:flex-row">
                  <Button size="lg" to="/pricing#builder">
                    Return to configurator
                  </Button>
                  <Button size="lg" to="/pricing" variant="secondary">
                    View pricing page
                  </Button>
                </div>
              </div>
            </Card>
          ) : (
            <div className="grid gap-8 xl:grid-cols-[minmax(0,1fr)_340px] xl:items-start">
              <div className="space-y-6">
                <Card className="p-6 sm:p-8">
                  <div className="space-y-5">
                    <div className="flex flex-wrap items-start justify-between gap-4">
                      <div className="max-w-3xl space-y-3">
                        <p className="text-xs font-medium uppercase tracking-[0.28em] text-[var(--accent-secondary)]">
                          Selected setup
                        </p>
                        <h2 className="text-3xl font-semibold tracking-[-0.04em] text-[var(--text-primary)] sm:text-4xl">
                          {draftConfiguration.title}
                        </h2>
                        <p className="text-sm leading-7 text-[var(--text-secondary)] sm:text-base">
                          {draftConfiguration.description}
                        </p>
                      </div>

                      <div className="flex flex-wrap gap-2">
                        <span className="theme-chip-strong rounded-full px-3 py-1.5 text-[11px] font-medium uppercase tracking-[0.22em]">
                          {draftConfiguration.modeLabel}
                        </span>
                        <span className="theme-panel rounded-full px-3 py-1.5 text-[11px] font-medium uppercase tracking-[0.22em] text-[var(--text-secondary)]">
                          {draftConfiguration.billingLabel}
                        </span>
                      </div>
                    </div>

                    {isPackageMode ? (
                      <div className="space-y-4">
                        <div className="grid gap-4 md:grid-cols-2">
                          <div className="theme-panel-contrast rounded-[24px] p-5">
                            <p className="text-xs uppercase tracking-[0.22em] text-[var(--text-muted)]">
                              {
                                draftConfiguration.packageSelection.selectedSummary
                                  .headlineLabel
                              }
                            </p>
                            <p className="mt-3 text-2xl font-semibold tracking-[-0.04em] text-[var(--text-primary)]">
                              {
                                draftConfiguration.packageSelection.selectedSummary
                                  .headlineValue
                              }
                            </p>
                          </div>
                          <div className="theme-panel-contrast rounded-[24px] p-5">
                            <p className="text-xs uppercase tracking-[0.22em] text-[var(--text-muted)]">
                              {
                                draftConfiguration.packageSelection.selectedSummary
                                  .secondaryLabel
                              }
                            </p>
                            <p className="mt-3 text-2xl font-semibold tracking-[-0.04em] text-[var(--text-primary)]">
                              {
                                draftConfiguration.packageSelection.selectedSummary
                                  .secondaryValue
                              }
                            </p>
                          </div>
                        </div>

                        <div className="rounded-[24px] border border-[color:var(--border-subtle)] bg-[var(--surface-soft)] p-5">
                          {draftConfiguration.packageSelection.pricingRows.map((row) => (
                            <div
                              className="grid gap-2 border-b border-[color:var(--border-subtle)] py-4 last:border-b-0 last:pb-0 first:pt-0 sm:grid-cols-[minmax(0,1fr)_auto]"
                              key={row.label}
                            >
                              <div>
                                <p className="text-sm font-medium text-[var(--text-primary)]">
                                  {row.label}
                                </p>
                                <p className="mt-1 text-sm leading-6 text-[var(--text-secondary)]">
                                  {row.detail}
                                </p>
                              </div>
                              <p className="text-sm font-medium text-[var(--text-primary)] sm:text-right">
                                {row.value}
                              </p>
                            </div>
                          ))}
                        </div>

                        <div className="grid gap-4 md:grid-cols-2">
                          {draftConfiguration.packageSelection.plan.features.map((feature) => (
                            <div className="theme-panel rounded-[24px] p-5" key={feature}>
                              <p className="text-sm leading-7 text-[var(--text-secondary)]">
                                {feature}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <div className="grid gap-4">
                        {draftConfiguration.customSelection.lineItems.map((item) => (
                          <div className="theme-panel rounded-[24px] p-5" key={item.id}>
                            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                              <div>
                                <p className="text-[11px] font-medium uppercase tracking-[0.22em] text-[var(--accent-secondary)]">
                                  {item.eyebrow}
                                </p>
                                <p className="mt-2 text-lg font-semibold text-[var(--text-primary)]">
                                  {item.title}
                                </p>
                                <p className="mt-2 text-sm leading-6 text-[var(--text-secondary)]">
                                  {item.detail}
                                </p>
                              </div>
                              <div className="sm:text-right">
                                <p className="text-base font-semibold text-[var(--text-primary)]">
                                  {item.value}
                                </p>
                                {item.timeline ? (
                                  <p className="mt-1 text-sm leading-6 text-[var(--text-secondary)]">
                                    {item.timeline}
                                  </p>
                                ) : null}
                              </div>
                            </div>

                            <div className="mt-4 rounded-[20px] border border-[color:var(--border-subtle)] bg-[var(--surface-soft)] p-4">
                              <p className="text-[11px] font-medium uppercase tracking-[0.22em] text-[var(--text-muted)]">
                                Module configuration
                              </p>

                              {item.selectedOptions.length ? (
                                <div className="mt-3 space-y-3">
                                  {item.selectedOptions.map((option) => (
                                    <div
                                      className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between"
                                      key={option.id}
                                    >
                                      <div className="min-w-0">
                                        <p className="text-sm font-medium text-[var(--text-primary)]">
                                          {option.label}
                                        </p>
                                        {option.description ? (
                                          <p className="mt-1 text-sm leading-6 text-[var(--text-secondary)]">
                                            {option.description}
                                          </p>
                                        ) : null}
                                      </div>

                                      <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-[var(--text-muted)] sm:text-right">
                                        {option.impactLabel}
                                      </p>
                                    </div>
                                  ))}
                                </div>
                              ) : (
                                <p className="mt-3 text-sm leading-6 text-[var(--text-secondary)]">
                                  {item.selectionNote}
                                </p>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </Card>

                <Card className="p-6 sm:p-8">
                  <form className="space-y-5" noValidate onSubmit={handleSubmit}>
                    <div className="space-y-3">
                      <p className="text-xs font-medium uppercase tracking-[0.28em] text-[var(--accent-secondary)]">
                        Submission details
                      </p>
                      <h2 className="text-2xl font-semibold tracking-[-0.04em] text-[var(--text-primary)]">
                        Submit this request
                      </h2>
                      <p className="text-sm leading-7 text-[var(--text-secondary)]">
                        This form stays attached to the reviewed configuration.
                      </p>
                    </div>

                    <div className="grid gap-5 md:grid-cols-2">
                      <div className="space-y-2">
                        <span className="text-sm font-medium text-[var(--text-primary)]">
                          Name
                        </span>
                        <input
                          className={getFieldClasses(Boolean(formErrors.name))}
                          name="name"
                          onChange={handleFieldChange}
                          value={contactDraft.name}
                        />
                        {formErrors.name ? (
                          <p className="text-sm leading-6 text-[var(--text-primary)]">
                            {formErrors.name}
                          </p>
                        ) : null}
                      </div>

                      <div className="space-y-2">
                        <span className="text-sm font-medium text-[var(--text-primary)]">
                          Business / Brand name
                        </span>
                        <input
                          className={getFieldClasses(Boolean(formErrors.businessName))}
                          name="businessName"
                          onChange={handleFieldChange}
                          value={contactDraft.businessName}
                        />
                        {formErrors.businessName ? (
                          <p className="text-sm leading-6 text-[var(--text-primary)]">
                            {formErrors.businessName}
                          </p>
                        ) : null}
                      </div>

                      <div className="space-y-2">
                        <span className="text-sm font-medium text-[var(--text-primary)]">
                          Email
                        </span>
                        <input
                          className={getFieldClasses(Boolean(formErrors.email))}
                          name="email"
                          onChange={handleFieldChange}
                          type="email"
                          value={contactDraft.email}
                        />
                        {formErrors.email ? (
                          <p className="text-sm leading-6 text-[var(--text-primary)]">
                            {formErrors.email}
                          </p>
                        ) : null}
                      </div>

                      <div className="space-y-2">
                        <span className="text-sm font-medium text-[var(--text-primary)]">
                          Phone / WhatsApp
                        </span>
                        <input
                          className={getFieldClasses(false)}
                          name="phone"
                          onChange={handleFieldChange}
                          type="tel"
                          value={contactDraft.phone}
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <span className="text-sm font-medium text-[var(--text-primary)]">
                        Project notes
                      </span>
                      <textarea
                        className={getFieldClasses(false)}
                        name="notes"
                        onChange={handleFieldChange}
                        rows={5}
                        value={contactDraft.notes}
                      />
                    </div>

                    <div className="flex flex-col gap-3 border-t border-[color:var(--border-subtle)] pt-5 sm:flex-row">
                      <Button size="lg" to="/pricing#builder" variant="secondary">
                        Adjust configuration
                      </Button>
                      <Button size="lg" type="submit">
                        Submit request
                      </Button>
                    </div>
                  </form>
                </Card>
              </div>

              <Card className="overflow-hidden p-0 xl:sticky xl:top-28">
                <div className="border-b border-[color:var(--border-subtle)] px-5 py-6 sm:px-6">
                  <p className="text-xs font-medium uppercase tracking-[0.28em] text-[var(--accent-secondary)]">
                    Order output
                  </p>
                  <h2 className="mt-2 text-2xl font-semibold tracking-[-0.04em] text-[var(--text-primary)]">
                    Final check
                  </h2>
                </div>

                <div className="space-y-5 px-5 py-6 sm:px-6">
                  {draftConfiguration.reviewItems.map((item) => (
                    <div
                      className="border-b border-[color:var(--border-subtle)] pb-4 last:border-b-0 last:pb-0"
                      key={item.id}
                    >
                      {item.eyebrow ? (
                        <p className="text-[11px] font-medium uppercase tracking-[0.22em] text-[var(--text-muted)]">
                          {item.eyebrow}
                        </p>
                      ) : null}
                      <p className="mt-2 text-sm font-medium text-[var(--text-primary)]">
                        {item.title}
                      </p>
                      {item.detail ? (
                        <p className="mt-1 text-sm leading-6 text-[var(--text-secondary)]">
                          {item.detail}
                        </p>
                      ) : null}
                    </div>
                  ))}

                  <div className="rounded-[24px] border border-[color:var(--border-accent)] bg-[linear-gradient(180deg,var(--surface-accent),var(--surface-soft))] p-5">
                    <p className="text-[11px] font-medium uppercase tracking-[0.22em] text-[var(--text-muted)]">
                      {draftConfiguration.total.label}
                    </p>
                    <p className="mt-2 break-words text-[2rem] font-semibold tracking-[-0.05em] text-[var(--text-primary)]">
                      {draftConfiguration.total.value}
                    </p>
                    {draftConfiguration.total.meta ? (
                      <p className="mt-2 text-sm font-medium text-[var(--text-secondary)]">
                        {draftConfiguration.total.meta}
                      </p>
                    ) : null}

                    <div className="mt-4 border-t border-[color:var(--border-subtle)] pt-4">
                      <p className="text-[11px] font-medium uppercase tracking-[0.22em] text-[var(--text-muted)]">
                        {draftConfiguration.timeline.label}
                      </p>
                      <p className="mt-2 text-base font-semibold text-[var(--text-primary)]">
                        {draftConfiguration.timeline.value}
                      </p>
                      <p className="mt-2 text-sm leading-6 text-[var(--text-secondary)]">
                        {draftConfiguration.timeline.description}
                      </p>
                    </div>
                  </div>

                  <p className="text-sm leading-6 text-[var(--text-secondary)]">
                    {draftConfiguration.selectionNote}
                  </p>
                </div>
              </Card>
            </div>
          )}
        </div>
      </Section>
    </div>
  );
}
