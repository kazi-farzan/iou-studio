import { useEffect, useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import CustomBuildModuleCard from "../components/pricing/CustomBuildModuleCard.jsx";
import MetricsStrip from "../components/pricing/MetricsStrip.jsx";
import MobilePricingSummaryBar from "../components/pricing/MobilePricingSummaryBar.jsx";
import PricingPlanCard from "../components/pricing/PricingPlanCard.jsx";
import PricingSummaryPanel from "../components/pricing/PricingSummaryPanel.jsx";
import PricingValueText from "../components/pricing/PricingValueText.jsx";
import RecentBuilds from "../components/pricing/RecentBuilds.jsx";
import StepFlowIndicator from "../components/pricing/StepFlowIndicator.jsx";
import WhatHappensNext from "../components/pricing/WhatHappensNext.jsx";
import Button from "../components/ui/Button.jsx";
import Card from "../components/ui/Card.jsx";
import Section from "../components/ui/Section.jsx";
import { customBuildModules } from "../data/customBuildPricing.js";
import {
  billingOptions,
  getCouponByCode,
  getCouponFeedback,
  getPlanPricing,
  getPlanSnapshot,
  getPricingModeSummary,
  pricingPlans,
  validateCouponCode,
} from "../data/pricing.js";
import {
  buildOrderFlowSteps,
  ORDER_FLOW_MODE_CUSTOM,
  ORDER_FLOW_MODE_PACKAGES,
} from "../orderFlow/orderFlow.js";
import { useOrderFlow } from "../orderFlow/useOrderFlow.js";

const pricingNotes = [
  {
    label: "All selections update live",
    detail:
      "Billing mode, coupon checks, and the active starting configuration stay aligned as you adjust the setup.",
  },
  {
    label: "Clear scope before you proceed",
    detail:
      "Review totals, billing terms, and delivery context in one place before moving into the next step.",
  },
  {
    label: "Transparent inputs",
    detail:
      "Switch between billing modes, test available coupons, and see the resulting changes immediately.",
  },
];

const configurationModes = [
  {
    id: ORDER_FLOW_MODE_PACKAGES,
    label: "Packages",
    detail: "Start from preset configurations.",
  },
  {
    id: ORDER_FLOW_MODE_CUSTOM,
    label: "Custom Build",
    detail: "Assemble a modular system build.",
  },
];

const PACKAGE_SELECTION_SECTION_ID = "pricing-package-selection-surface";
const CUSTOM_BUILD_SECTION_ID = "pricing-custom-build-selection-surface";

function getSurfaceClasses(tone) {
  if (tone === "accent") {
    return "theme-panel-contrast border-[color:var(--border-accent)] bg-[var(--surface-accent)]";
  }

  if (tone === "muted") {
    return "theme-panel border-[color:var(--border-subtle)]";
  }

  return "theme-panel-contrast border-[color:var(--border-subtle)]";
}

function getModeToggleClasses(isActive) {
  return [
    "flex min-h-[108px] flex-1 flex-col justify-between rounded-[26px] border px-5 py-5 text-left transition-all duration-300 sm:min-h-[120px] sm:px-6 sm:py-6",
    isActive
      ? "border-[color:var(--border-accent)] bg-[linear-gradient(180deg,var(--surface-accent),var(--surface-accent-strong))] text-[var(--text-primary)] shadow-[var(--shadow-raised)]"
      : "border-transparent bg-transparent text-[var(--text-secondary)] hover:border-[color:var(--border-subtle)] hover:bg-[var(--surface)] hover:text-[var(--text-primary)]",
  ].join(" ");
}

function getToggleClasses(isActive) {
  return [
    "flex min-h-[94px] flex-col justify-between rounded-[24px] border px-4 py-4 text-left transition-all duration-300 sm:min-h-[104px] sm:px-5 sm:py-5",
    isActive
      ? "border-[color:var(--border-accent)] bg-[linear-gradient(180deg,var(--surface-accent),var(--surface-accent-strong))] text-[var(--text-primary)] shadow-[var(--shadow-accent)]"
      : "border-transparent bg-transparent text-[var(--text-secondary)] hover:border-[color:var(--border-accent)] hover:bg-[var(--surface)] hover:text-[var(--text-primary)]",
  ].join(" ");
}

export default function Pricing() {
  const location = useLocation();
  const {
    appliedCouponCode,
    billingMode,
    couponInput,
    draftConfiguration,
    mode,
    selectedCustomModuleIds,
    selectedCustomModuleOptions,
    selectedPlanId,
    setAppliedCouponCode,
    setBillingMode,
    setCouponInput,
    setMode,
    setSelectedCustomModuleIds,
    setSelectedCustomModuleOptions,
    setSelectedPlanId,
  } = useOrderFlow();
  const [couponError, setCouponError] = useState("");

  const appliedCoupon = useMemo(
    () => getCouponByCode(appliedCouponCode),
    [appliedCouponCode],
  );

  const couponFeedback = useMemo(
    () => getCouponFeedback(appliedCoupon, billingMode),
    [appliedCoupon, billingMode],
  );

  const pricingModeSummary = useMemo(
    () => getPricingModeSummary(billingMode, appliedCoupon),
    [appliedCoupon, billingMode],
  );

  const plans = useMemo(
    () =>
      pricingPlans.map((plan) =>
        getPlanPricing(plan, billingMode, appliedCoupon),
      ),
    [appliedCoupon, billingMode],
  );

  const isPackagesMode = mode === ORDER_FLOW_MODE_PACKAGES;

  const customBuildPricing = useMemo(
    () => draftConfiguration.customSelection,
    [draftConfiguration.customSelection],
  );

  const selectedCustomModules = customBuildPricing?.modules ?? [];
  const selectedCustomModulesCount = selectedCustomModules.length;
  const selectedCustomOptionCount = customBuildPricing?.selectedOptionCount ?? 0;
  const selectedCustomModulesLabel = selectedCustomModulesCount
    ? selectedCustomOptionCount
      ? `${selectedCustomModulesCount} module${
          selectedCustomModulesCount === 1 ? "" : "s"
        } / ${selectedCustomOptionCount} customization${
          selectedCustomOptionCount === 1 ? "" : "s"
        }`
      : `${selectedCustomModulesCount} module${
          selectedCustomModulesCount === 1 ? "" : "s"
        } selected`
    : "Select modules to begin";

  const summaryPanelData = useMemo(
    () => draftConfiguration.summaryPanel,
    [draftConfiguration.summaryPanel],
  );

  const stepFlowSteps = useMemo(
    () =>
      buildOrderFlowSteps("configure", {
        hasSelection: !summaryPanelData.isActionDisabled,
      }),
    [summaryPanelData.isActionDisabled],
  );

  useEffect(() => {
    if (location.hash !== "#builder") {
      return;
    }

    const builderSection = document.getElementById("builder");

    if (!builderSection) {
      return;
    }

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    builderSection.scrollIntoView({
      behavior: prefersReducedMotion ? "auto" : "smooth",
      block: "start",
    });
  }, [location.hash]);

  function handleCouponApply() {
    const result = validateCouponCode(couponInput);

    if (!result.isValid) {
      setCouponError(result.message);
      return;
    }

    setAppliedCouponCode(result.coupon.code);
    setCouponInput(result.coupon.code);
    setCouponError("");
  }

  function handleCouponClear() {
    setAppliedCouponCode("");
    setCouponInput("");
    setCouponError("");
  }

  function handleCouponChange(event) {
    setCouponInput(event.target.value.toUpperCase());
    setCouponError("");
  }

  function handleCustomModuleToggle(moduleId) {
    setSelectedCustomModuleIds((current) => {
      if (current.includes(moduleId)) {
        return current.filter((item) => item !== moduleId);
      }

      return [...current, moduleId];
    });
  }

  function handleCustomModuleOptionChange(moduleId, optionId, value) {
    setSelectedCustomModuleOptions((current) => ({
      ...current,
      [moduleId]: {
        ...(current[moduleId] ?? {}),
        [optionId]: value,
      },
    }));
  }

  function handleSelectionGuidance() {
    const selectionSurfaceId = isPackagesMode
      ? PACKAGE_SELECTION_SECTION_ID
      : CUSTOM_BUILD_SECTION_ID;
    const target =
      document.getElementById(selectionSurfaceId) ||
      document.getElementById("builder");

    if (!target) {
      return;
    }

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    target.scrollIntoView({
      behavior: prefersReducedMotion ? "auto" : "smooth",
      block: "start",
    });
  }

  return (
    <div
      className="w-full scroll-mt-28 pb-[calc(8.5rem+env(safe-area-inset-bottom))] sm:scroll-mt-32 xl:pb-0"
      id="builder"
    >
      <Section
        spacing="hero"
        width="full"
        contentClassName="mx-auto max-w-[82rem] gap-10 sm:gap-12 2xl:gap-14"
      >
        <div className="space-y-10 sm:space-y-12 xl:space-y-14">
          <div className="max-w-5xl space-y-5 sm:space-y-6">
            <p className="type-kicker">Start Build</p>

            <h1 className="type-page-title max-w-[13ch]">
              Configure your build
            </h1>

            <p className="max-w-[58ch] text-[1.02rem] leading-8 text-[var(--text-secondary)] sm:text-[1.12rem]">
              Select a starting configuration or assemble a custom system build.
              Keep the active scope, totals, and delivery timing visible while
              you configure, then move into review with the current build
              already clarified.
            </p>

            <p className="type-label">Select. Configure. Review.</p>
          </div>

          <StepFlowIndicator
            description="Choose a starting path, configure the active scope, then move into review before submission and confirmation."
            steps={stepFlowSteps}
          />

          <div className="grid gap-8 xl:grid-cols-[minmax(0,1.16fr)_minmax(360px,0.84fr)] xl:items-start 2xl:gap-12 2xl:grid-cols-[minmax(0,1.2fr)_minmax(392px,0.88fr)]">
            <div className="min-w-0 space-y-8 sm:space-y-10 xl:space-y-12">
              <Card className="p-6 sm:p-7 lg:p-8 xl:p-9">
                <div className="grid gap-6 xl:grid-cols-[minmax(0,0.92fr)_minmax(0,1.08fr)] xl:gap-8">
                  <div className="max-w-2xl space-y-4 sm:space-y-5">
                    <p className="type-kicker">Select</p>
                    <h2 className="type-section-title max-w-[15ch]">
                      Choose how you want to start the build.
                    </h2>
                    <p className="max-w-[52ch] text-base leading-8 text-[var(--text-secondary)]">
                      Pick a package baseline or open the custom builder. The
                      active configuration surface below and the review summary
                      stay synchronized as you work.
                    </p>
                  </div>

                  <div className="theme-panel flex flex-col gap-3 rounded-[30px] border border-[color:var(--border-subtle)] p-3 sm:p-4">
                    {configurationModes.map((option) => (
                      <button
                        key={option.id}
                        aria-pressed={mode === option.id}
                        className={getModeToggleClasses(mode === option.id)}
                        onClick={() => setMode(option.id)}
                        type="button"
                      >
                        <span className="block text-base font-semibold tracking-[0.01em]">
                          {option.label}
                        </span>
                        <span className="mt-2 block max-w-[22ch] text-sm leading-7 opacity-85">
                          {option.detail}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              </Card>

              {isPackagesMode ? (
                <>
                  <div className="grid gap-6 xl:grid-cols-[minmax(0,1.14fr)_minmax(320px,0.86fr)] xl:items-start xl:gap-7 2xl:grid-cols-[minmax(0,1.18fr)_minmax(340px,0.9fr)]">
                    <Card className="p-6 sm:p-7 xl:p-8">
                      <div className="space-y-8">
                        <div className="max-w-3xl space-y-4">
                          <div className="theme-panel inline-flex items-center gap-3 rounded-full px-4 py-2.5 text-[11px] font-medium uppercase tracking-[0.26em] text-[var(--accent-secondary)]">
                            <span className="theme-dot h-2 w-2 rounded-full" />
                            Configuration Overview
                          </div>

                          <h2 className="type-section-title max-w-[15ch]">
                            Configure a package baseline with live scope
                            clarity.
                          </h2>

                          <p className="max-w-[56ch] text-base leading-8 text-[var(--text-secondary)]">
                            Switch billing, test coupon rules, and review
                            starting configurations in one place. Every change
                            updates the active totals immediately so the setup
                            stays easy to read while you work.
                          </p>
                        </div>

                        <div className="grid gap-4 xl:grid-cols-3">
                          {pricingNotes.map((note) => (
                            <div
                              className="theme-panel-contrast rounded-[26px] p-5 sm:p-6"
                              key={note.label}
                            >
                              <p className="type-kicker">{note.label}</p>
                              <p className="mt-3 text-base leading-7 text-[var(--text-secondary)]">
                                {note.detail}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>
                    </Card>

                    <div className="grid gap-5">
                      <Card className="p-5 sm:p-6 xl:p-7">
                        <div className="space-y-5">
                          <div className="space-y-3">
                            <p className="type-kicker">Configure</p>
                            <p className="text-sm leading-7 text-[var(--text-secondary)]">
                              Switch how pricing is expressed without losing the
                              active selection or summary state.
                            </p>
                          </div>

                          <div className="grid grid-cols-2 gap-3">
                            {billingOptions.map((option) => (
                              <button
                                key={option.id}
                                aria-pressed={billingMode === option.id}
                                className={getToggleClasses(
                                  billingMode === option.id,
                                )}
                                onClick={() => setBillingMode(option.id)}
                                type="button"
                              >
                                <span className="block text-[0.95rem] font-semibold tracking-[0.01em]">
                                  {option.label}
                                </span>
                                <span className="mt-2 block text-sm leading-6 opacity-80">
                                  {option.note}
                                </span>
                              </button>
                            ))}
                          </div>

                          <div
                            className={[
                              "rounded-[24px] border p-5 sm:p-6",
                              getSurfaceClasses(pricingModeSummary.tone),
                            ].join(" ")}
                          >
                            <p className="type-kicker">
                              {pricingModeSummary.eyebrow}
                            </p>
                            <p className="mt-2 text-lg font-semibold text-[var(--text-primary)]">
                              {pricingModeSummary.title}
                            </p>
                            <p className="mt-2 text-sm leading-7 text-[var(--text-secondary)]">
                              {pricingModeSummary.detail}
                            </p>
                          </div>
                        </div>
                      </Card>

                      <Card className="p-5 sm:p-6 xl:p-7">
                        <div className="space-y-5">
                          <div className="flex items-start justify-between gap-4">
                            <div className="space-y-3">
                              <p className="type-kicker">Coupon Simulation</p>
                              <p className="text-sm leading-7 text-[var(--text-secondary)]">
                                Try{" "}
                                <span className="font-medium text-[var(--text-primary)]">
                                  FIRST3
                                </span>{" "}
                                or{" "}
                                <span className="font-medium text-[var(--text-primary)]">
                                  TRYONCE
                                </span>
                                .
                              </p>
                            </div>

                            {appliedCoupon ? (
                              <button
                                className="text-sm font-medium text-[var(--accent-secondary)] transition-colors duration-300 hover:text-[var(--text-primary)]"
                                onClick={handleCouponClear}
                                type="button"
                              >
                                Clear
                              </button>
                            ) : null}
                          </div>

                          <div className="flex flex-col gap-3.5 sm:flex-row">
                            <input
                              className={[
                                "theme-input min-h-[54px] rounded-full px-5 py-3 text-sm tracking-[0.08em] uppercase",
                                couponError
                                  ? "border-[rgba(217,93,106,0.38)] bg-[rgba(217,93,106,0.08)]"
                                  : "",
                              ]
                                .filter(Boolean)
                                .join(" ")}
                              onChange={handleCouponChange}
                              placeholder="Enter coupon code"
                              value={couponInput}
                            />

                            <Button
                              className="sm:min-w-[132px]"
                              onClick={handleCouponApply}
                              size="lg"
                            >
                              Apply
                            </Button>
                          </div>

                          {couponError ? (
                            <div className="rounded-[20px] border border-[rgba(217,93,106,0.32)] bg-[rgba(217,93,106,0.08)] px-4 py-3">
                              <p className="text-sm leading-6 text-[var(--text-primary)]">
                                {couponError}
                              </p>
                            </div>
                          ) : null}

                          <div
                            className={[
                              "rounded-[24px] border p-5 sm:p-6",
                              getSurfaceClasses(couponFeedback.tone),
                            ].join(" ")}
                          >
                            <p className="type-kicker">{couponFeedback.label}</p>
                            <p className="mt-2 text-lg font-semibold text-[var(--text-primary)]">
                              {couponFeedback.title}
                            </p>
                            <p className="mt-2 text-sm leading-7 text-[var(--text-secondary)]">
                              {couponFeedback.detail}
                            </p>
                          </div>
                        </div>
                      </Card>
                    </div>
                  </div>

                  <div
                    className="space-y-6 sm:space-y-7"
                    id={PACKAGE_SELECTION_SECTION_ID}
                  >
                    <div className="max-w-4xl space-y-4">
                      <p className="type-kicker">Configure</p>
                      <h2 className="type-section-title max-w-[14ch]">
                        Select a starting configuration.
                      </h2>
                      <p className="max-w-[56ch] text-base leading-8 text-[var(--text-secondary)]">
                        Choose a baseline setup. The summary panel follows the
                        active configuration so pricing and timeline stay in
                        view while you compare options.
                      </p>
                    </div>

                    <div className="grid gap-6 xl:grid-cols-2">
                      {plans.map((plan) => (
                        <PricingPlanCard
                          isSelected={selectedPlanId === plan.id}
                          key={plan.id}
                          onSelect={setSelectedPlanId}
                          plan={plan}
                        />
                      ))}
                    </div>
                  </div>

                  <Card className="p-6 sm:p-8 xl:p-9">
                    <div className="space-y-7">
                      <div className="max-w-4xl space-y-4">
                        <p className="type-kicker">Review</p>
                        <h2 className="type-section-title max-w-[15ch]">
                          Compare the active billing view without re-reading
                          every card.
                        </h2>
                        <p className="max-w-[56ch] text-base leading-8 text-[var(--text-secondary)]">
                          The selected billing mode and coupon logic update
                          every number below, so this comparison stays aligned
                          with the plan cards and the live summary.
                        </p>
                      </div>

                      <div className="space-y-4">
                        {plans.map((plan) => {
                          const snapshot = getPlanSnapshot(plan);
                          const isSelected = plan.id === selectedPlanId;

                          return (
                            <div
                              key={plan.id}
                              className={[
                                "rounded-[28px] border p-5 transition-all duration-300 sm:p-6 lg:p-7",
                                isSelected
                                  ? "border-[color:var(--border-accent)] bg-[var(--surface-accent)] shadow-[var(--shadow-accent)]"
                                  : "theme-panel",
                              ].join(" ")}
                            >
                              <div className="flex min-w-0 flex-col gap-5 xl:flex-row xl:items-start xl:justify-between">
                                <div className="max-w-sm min-w-0">
                                  <div className="flex flex-wrap items-center gap-2">
                                    <p className="text-lg font-semibold text-[var(--text-primary)]">
                                      {plan.name}
                                    </p>

                                    {plan.isMostPopular ? (
                                      <span className="theme-chip-strong rounded-full px-3 py-1 text-[11px] font-medium uppercase tracking-[0.22em]">
                                        Most Popular
                                      </span>
                                    ) : null}

                                    {isSelected ? (
                                      <span className="theme-panel rounded-full px-3 py-1 text-[11px] font-medium uppercase tracking-[0.22em] text-[var(--accent-secondary)]">
                                        Selected
                                      </span>
                                    ) : null}
                                  </div>

                                  <p className="mt-2 text-base leading-7 text-[var(--text-secondary)]">
                                    {plan.audience}
                                  </p>
                                  <p className="mt-3 text-sm leading-7 text-[var(--text-secondary)]">
                                    {snapshot.note}
                                  </p>
                                </div>

                                <div className="grid min-w-0 flex-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
                                  {snapshot.metrics.map((metric) => (
                                    <div
                                      className="theme-panel-contrast min-w-0 rounded-[22px] p-4 sm:p-5"
                                      key={metric.label}
                                    >
                                      <p className="type-label">
                                        {metric.label}
                                      </p>
                                      <div className="mt-2 min-w-0">
                                        <PricingValueText
                                          size="md"
                                          value={metric.value}
                                        />
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </Card>
                </>
              ) : (
                <div
                  className="space-y-6 sm:space-y-7"
                  id={CUSTOM_BUILD_SECTION_ID}
                >
                  <div className="max-w-4xl space-y-4">
                    <p className="type-kicker">Configure</p>
                    <h2 className="type-section-title max-w-[14ch]">
                      Shape a custom system build.
                    </h2>
                    <p className="max-w-[56ch] text-base leading-8 text-[var(--text-secondary)]">
                      Select the modules you need, reveal focused options only
                      when they matter, and keep the live summary visible while
                      pricing and timeline update in real time.
                    </p>
                  </div>

                  <Card className="p-6 sm:p-8 lg:p-9 xl:p-10">
                    <div className="space-y-8">
                      <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
                        <div className="max-w-3xl space-y-4">
                          <p className="type-kicker">Custom Build Modules</p>
                          <p className="text-base leading-8 text-[var(--text-secondary)]">
                            Select any module card to add or remove it from
                            your system. Selected modules reveal focused options
                            and add-ons inline, and every price and timeline
                            change updates immediately.
                          </p>
                        </div>

                        <div className="theme-panel inline-flex w-fit items-center gap-3 rounded-full px-4 py-2.5 text-[11px] font-medium uppercase tracking-[0.24em] text-[var(--accent-secondary)]">
                          <span className="theme-dot h-2 w-2 rounded-full" />
                          {selectedCustomModulesLabel}
                        </div>
                      </div>

                      <div className="grid gap-6 xl:grid-cols-2">
                        {customBuildModules.map((module) => (
                          <CustomBuildModuleCard
                            isSelected={selectedCustomModuleIds.includes(
                              module.id,
                            )}
                            key={module.id}
                            module={module}
                            onOptionChange={handleCustomModuleOptionChange}
                            onToggle={handleCustomModuleToggle}
                            optionSelections={
                              selectedCustomModuleOptions[module.id] ?? {}
                            }
                          />
                        ))}
                      </div>
                    </div>
                  </Card>
                </div>
              )}
            </div>

            <div className="hidden min-w-0 xl:block xl:self-start">
              <PricingSummaryPanel summary={summaryPanelData} />
            </div>
          </div>
        </div>
      </Section>

      <RecentBuilds />
      <MetricsStrip />
      <WhatHappensNext ctaLabel="Review Setup" ctaTo="/summary" />
      <MobilePricingSummaryBar
        onInvalidAction={handleSelectionGuidance}
        summary={summaryPanelData}
      />
    </div>
  );
}
