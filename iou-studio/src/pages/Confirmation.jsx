import { useEffect } from "react";
import StepFlowIndicator from "../components/pricing/StepFlowIndicator.jsx";
import StructuredSummaryBreakdown from "../components/pricing/StructuredSummaryBreakdown.jsx";
import Button from "../components/ui/Button.jsx";
import Card from "../components/ui/Card.jsx";
import Section from "../components/ui/Section.jsx";
import { useOrderFlow } from "../orderFlow/useOrderFlow.js";
import { buildOrderFlowSteps } from "../orderFlow/orderFlow.js";

function formatSubmittedAt(submittedAt) {
  return new Intl.DateTimeFormat("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(submittedAt));
}

export default function Confirmation() {
  const { draftConfiguration, lastSubmittedOrder } = useOrderFlow();
  const hasSubmittedOrder = Boolean(lastSubmittedOrder);
  const steps = buildOrderFlowSteps("confirm", {
    hasSelection: hasSubmittedOrder,
  });

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
  }, []);

  return (
    <div className="w-full">
      <Section className="pt-3 sm:pt-4" width="full">
        <div className="space-y-10 sm:space-y-8">
          <div className="max-w-4xl space-y-4 sm:space-y-3">
            <p className="text-xs font-medium uppercase tracking-[0.32em] text-[var(--accent-secondary)]">
              Confirmation
            </p>
            <h1 className="max-w-3xl text-3xl font-semibold tracking-[-0.04em] text-[var(--text-primary)] sm:text-4xl">
              Request received
            </h1>
            <p className="max-w-3xl text-sm leading-7 text-[var(--text-secondary)] sm:text-base">
              The reviewed configuration has been recorded and is ready for the
              next operational step.
            </p>
          </div>

          <StepFlowIndicator
            description="The build has moved through configuration, review, and submission into confirmation."
            steps={steps}
          />

          {!hasSubmittedOrder ? (
            <Card className="p-6 sm:p-8">
              <div className="space-y-5">
                <h2 className="text-2xl font-semibold tracking-[-0.04em] text-[var(--text-primary)]">
                  There is no confirmed submission in this session yet.
                </h2>
                <p className="max-w-2xl text-sm leading-7 text-[var(--text-secondary)] sm:text-base">
                  Start from the configurator, move into the order summary, and
                  submit the request to reach this confirmation state.
                </p>
                <div className="flex flex-col gap-3 sm:flex-row">
                  <Button size="lg" to="/pricing#builder">
                    Return to configurator
                  </Button>
                  {draftConfiguration.hasSelection ? (
                    <Button size="lg" to="/order-summary" variant="secondary">
                      Go to order summary
                    </Button>
                  ) : null}
                </div>
              </div>
            </Card>
          ) : (
            <div className="grid gap-8 xl:grid-cols-[minmax(0,1fr)_340px] xl:items-start">
              <div className="space-y-6">
                <Card className="p-6 sm:p-8">
                  <div className="space-y-5">
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="theme-panel-contrast rounded-[24px] p-5">
                        <p className="text-xs uppercase tracking-[0.22em] text-[var(--text-muted)]">
                          Reference
                        </p>
                        <p className="mt-3 text-2xl font-semibold tracking-[-0.04em] text-[var(--text-primary)]">
                          {lastSubmittedOrder.reference}
                        </p>
                      </div>
                      <div className="theme-panel-contrast rounded-[24px] p-5">
                        <p className="text-xs uppercase tracking-[0.22em] text-[var(--text-muted)]">
                          Submitted
                        </p>
                        <p className="mt-3 text-lg font-semibold text-[var(--text-primary)]">
                          {formatSubmittedAt(lastSubmittedOrder.submittedAt)}
                        </p>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <p className="text-sm leading-6 text-[var(--text-secondary)]">
                        Follow-up will go to{" "}
                        <span className="font-medium text-[var(--text-primary)]">
                          {lastSubmittedOrder.submittedDetails.email}
                        </span>
                        .
                      </p>
                      <div className="space-y-3">
                        <p className="text-sm leading-6 text-[var(--text-secondary)]">
                          1. The selected build is reviewed against the submitted
                          details and notes.
                        </p>
                        <p className="text-sm leading-6 text-[var(--text-secondary)]">
                          2. Scope and delivery assumptions are checked against
                          the configuration you submitted.
                        </p>
                        <p className="text-sm leading-6 text-[var(--text-secondary)]">
                          3. The response uses the contact route attached to this
                          request.
                        </p>
                      </div>
                    </div>
                  </div>
                </Card>

                <Card className="p-6 sm:p-8">
                  <div className="space-y-5">
                    <p className="text-xs font-medium uppercase tracking-[0.28em] text-[var(--accent-secondary)]">
                      Contact record
                    </p>
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="theme-panel rounded-[24px] p-5">
                        <p className="text-xs uppercase tracking-[0.22em] text-[var(--text-muted)]">
                          Primary contact
                        </p>
                        <p className="mt-2 text-base font-semibold text-[var(--text-primary)]">
                          {lastSubmittedOrder.submittedDetails.name}
                        </p>
                        <p className="mt-2 text-sm leading-6 text-[var(--text-secondary)]">
                          {lastSubmittedOrder.submittedDetails.businessName}
                        </p>
                      </div>
                      <div className="theme-panel rounded-[24px] p-5">
                        <p className="text-xs uppercase tracking-[0.22em] text-[var(--text-muted)]">
                          Phone / WhatsApp
                        </p>
                        <p className="mt-2 text-base font-semibold text-[var(--text-primary)]">
                          {lastSubmittedOrder.submittedDetails.phone ||
                            "Not provided"}
                        </p>
                      </div>
                    </div>

                    {lastSubmittedOrder.submittedDetails.notes ? (
                      <div className="rounded-[24px] border border-[color:var(--border-subtle)] bg-[var(--surface-soft)] p-5">
                        <p className="text-xs uppercase tracking-[0.22em] text-[var(--text-muted)]">
                          Project notes
                        </p>
                        <p className="mt-2 whitespace-pre-wrap text-sm leading-7 text-[var(--text-secondary)]">
                          {lastSubmittedOrder.submittedDetails.notes}
                        </p>
                      </div>
                    ) : null}
                  </div>
                </Card>
              </div>

              <Card className="overflow-hidden p-0 xl:sticky xl:top-28">
                <div className="border-b border-[color:var(--border-subtle)] px-5 py-6 sm:px-6">
                  <p className="text-xs font-medium uppercase tracking-[0.28em] text-[var(--accent-secondary)]">
                    Confirmation recap
                  </p>
                  <h2 className="mt-2 text-2xl font-semibold tracking-[-0.04em] text-[var(--text-primary)]">
                    Submitted setup
                  </h2>
                </div>

                <div className="space-y-5 px-5 py-6 sm:px-6">
                  <div className="rounded-[24px] border border-[color:var(--border-accent)] bg-[linear-gradient(180deg,var(--surface-accent),var(--surface-soft))] p-5">
                    <p className="text-[11px] font-medium uppercase tracking-[0.22em] text-[var(--text-muted)]">
                      {lastSubmittedOrder.configuration.total.label}
                    </p>
                    <p className="mt-2 break-words text-[2rem] font-semibold tracking-[-0.05em] text-[var(--text-primary)]">
                      {lastSubmittedOrder.configuration.total.value}
                    </p>
                    {lastSubmittedOrder.configuration.total.meta ? (
                      <p className="mt-2 text-sm font-medium text-[var(--text-secondary)]">
                        {lastSubmittedOrder.configuration.total.meta}
                      </p>
                    ) : null}

                    <div className="mt-4 border-t border-[color:var(--border-subtle)] pt-4">
                      <p className="text-[11px] font-medium uppercase tracking-[0.22em] text-[var(--text-muted)]">
                        {lastSubmittedOrder.configuration.timeline.label}
                      </p>
                      <p className="mt-2 text-base font-semibold text-[var(--text-primary)]">
                        {lastSubmittedOrder.configuration.timeline.value}
                      </p>
                    </div>
                  </div>

                  <StructuredSummaryBreakdown
                    groups={lastSubmittedOrder.configuration.summaryBreakdown.groups}
                  />

                  <div className="flex flex-col gap-3">
                    <Button size="lg" to="/pricing#builder">
                      Configure another setup
                    </Button>
                    <Button size="lg" to="/order-summary" variant="secondary">
                      Review current summary
                    </Button>
                  </div>
                </div>
              </Card>
            </div>
          )}
        </div>
      </Section>
    </div>
  );
}
