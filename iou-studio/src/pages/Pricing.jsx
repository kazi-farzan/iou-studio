import { useEffect, useMemo, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import CustomBuildModuleCard from "../components/pricing/CustomBuildModuleCard.jsx";
import MobilePricingSummaryBar from "../components/pricing/MobilePricingSummaryBar.jsx";
import PackageComparisonSection from "../components/pricing/PackageComparisonSection.jsx";
import PricingSummaryBottomSheet from "../components/pricing/PricingSummaryBottomSheet.jsx";
import PricingSummaryPanel from "../components/pricing/PricingSummaryPanel.jsx";
import RecentBuilds from "../components/pricing/RecentBuilds.jsx";
import StickyPricingSummaryPill from "../components/pricing/StickyPricingSummaryPill.jsx";
import StepFlowIndicator from "../components/pricing/StepFlowIndicator.jsx";
import WhatHappensNext from "../components/pricing/WhatHappensNext.jsx";
import { hasActiveSummarySelection } from "../components/pricing/pricingSummaryHelpers.js";
import Card from "../components/ui/Card.jsx";
import Section from "../components/ui/Section.jsx";
import { groupModulesByCategory } from "../data/configuratorSchema.js";
import { customBuildModules } from "../data/customBuildPricing.js";
import {
  billingOptions,
  getCouponByCode,
  getCouponFeedback,
  getPlanPricing,
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

const configurationModes = [
  {
    id: ORDER_FLOW_MODE_PACKAGES,
    label: "Packages",
    detail: "Compare guided starting points.",
    summary:
      "Best when you want to compare preset scope, current price, and delivery timing before refining the build.",
  },
  {
    id: ORDER_FLOW_MODE_CUSTOM,
    label: "Custom Build",
    detail: "Assemble the system module by module.",
    summary:
      "Best when you already know the parts you need and want options to appear only after each module is active.",
  },
];

const PACKAGE_SELECTION_SECTION_ID = "pricing-package-selection-surface";
const CUSTOM_BUILD_SECTION_ID = "pricing-custom-build-selection-surface";

function getModeToggleClasses(isActive) {
  return [
    "flex min-h-[116px] flex-col justify-between rounded-[24px] border px-5 py-5 text-left transition-all duration-300 sm:min-h-[124px] sm:px-6 sm:py-6",
    isActive
      ? "border-[color:var(--border-accent)] bg-[linear-gradient(180deg,var(--surface-accent),var(--surface-accent-strong))] text-[var(--text-primary)] shadow-[var(--shadow-raised)]"
      : "border-[color:var(--border-subtle)] bg-[var(--surface)] text-[var(--text-secondary)] hover:border-[color:var(--border-strong)] hover:text-[var(--text-primary)]",
  ].join(" ");
}

function formatCountLabel(count, noun) {
  return `${count} ${noun}${count === 1 ? "" : "s"}`;
}

function getCategorySelectionLabel(category, selectedModuleIds) {
  const selectedCount = category.modules.filter((module) =>
    selectedModuleIds.includes(module.id),
  ).length;

  if (selectedCount) {
    return `${formatCountLabel(selectedCount, "module")} selected`;
  }

  return formatCountLabel(category.modules.length, "module");
}

export default function Pricing() {
  const location = useLocation();
  const lowerFullWidthSectionRef = useRef(null);
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
  const [isLowerSummaryPillVisible, setIsLowerSummaryPillVisible] =
    useState(false);
  const [isLowerSummarySheetOpen, setIsLowerSummarySheetOpen] = useState(false);

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

  const customBuildModuleGroups = useMemo(
    () => groupModulesByCategory(customBuildModules),
    [],
  );

  const activeConfigurationMode = useMemo(
    () =>
      configurationModes.find((option) => option.id === mode) ??
      configurationModes[0],
    [mode],
  );

  const packageStatusNotice = appliedCoupon
    ? couponFeedback
    : pricingModeSummary;
  const packageStatusLabel =
    packageStatusNotice.label ?? packageStatusNotice.eyebrow;

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
      ? `${formatCountLabel(selectedCustomModulesCount, "module")} / ${formatCountLabel(
          selectedCustomOptionCount,
          "customization",
        )}`
      : `${formatCountLabel(selectedCustomModulesCount, "module")} selected`
    : "Select modules to begin";

  const summaryPanelData = useMemo(
    () => draftConfiguration.summaryPanel,
    [draftConfiguration.summaryPanel],
  );
  const hasSummarySelection = useMemo(
    () => hasActiveSummarySelection(summaryPanelData),
    [summaryPanelData],
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

  useEffect(() => {
    const sectionNode = lowerFullWidthSectionRef.current;

    if (!sectionNode) {
      return undefined;
    }

    let frameId = 0;

    const updateVisibility = () => {
      frameId = 0;
      const nextVisibility = sectionNode.getBoundingClientRect().top <= 96;

      setIsLowerSummaryPillVisible((current) =>
        current === nextVisibility ? current : nextVisibility,
      );
    };

    const requestVisibilityUpdate = () => {
      if (frameId) {
        return;
      }

      frameId = window.requestAnimationFrame(updateVisibility);
    };

    updateVisibility();

    window.addEventListener("scroll", requestVisibilityUpdate, {
      passive: true,
    });
    window.addEventListener("resize", requestVisibilityUpdate);

    return () => {
      if (frameId) {
        window.cancelAnimationFrame(frameId);
      }

      window.removeEventListener("scroll", requestVisibilityUpdate);
      window.removeEventListener("resize", requestVisibilityUpdate);
    };
  }, []);

  useEffect(() => {
    if (hasSummarySelection) {
      return;
    }

    setIsLowerSummarySheetOpen(false);
  }, [hasSummarySelection]);

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

  function handleLowerSummaryInvalidAction() {
    setIsLowerSummarySheetOpen(false);
    handleSelectionGuidance();
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

          <div className="space-y-8 sm:space-y-10 xl:space-y-12">
            <div className="grid gap-8 xl:grid-cols-[minmax(0,1.16fr)_minmax(360px,0.84fr)] xl:items-start 2xl:gap-12 2xl:grid-cols-[minmax(0,1.2fr)_minmax(392px,0.88fr)]">
              <div className="min-w-0">
                <Card className="p-6 sm:p-7 lg:p-8 xl:p-9">
                  <div className="flex flex-col gap-6 sm:gap-7">
                    <div className="space-y-4 sm:space-y-5">
                      <p className="type-kicker">Start path</p>
                      <h2 className="type-section-title max-w-[15ch]">
                        Choose a guided package or build the system module by
                        module.
                      </h2>
                      <p className="max-w-[52ch] text-base leading-8 text-[var(--text-secondary)]">
                        Switch between the two routes without losing the live
                        summary. Packages are faster to compare. Custom Build
                        is for selecting specific sections and revealing options
                        only where they matter.
                      </p>
                    </div>

                    <div className="w-full">
                      <div className="theme-panel w-full rounded-[28px] border border-[color:var(--border-subtle)] p-3 sm:p-4">
                        <div className="flex flex-row gap-3">
                          {configurationModes.map((option) => (
                            <button
                              key={option.id}
                              aria-pressed={mode === option.id}
                              className={[getModeToggleClasses(mode === option.id), "min-w-0 flex-1"].join(
                                " ",
                              )}
                              onClick={() => setMode(option.id)}
                              type="button"
                            >
                              <span className="flex items-center justify-between gap-3">
                                <span className="text-base font-semibold tracking-[0.01em]">
                                  {option.label}
                                </span>
                                {mode === option.id ? (
                                  <span className="rounded-full border border-[color:var(--border-accent)] bg-[var(--surface)] px-3 py-1 text-[10px] font-medium uppercase tracking-[0.18em] text-[var(--accent-secondary)]">
                                    Active
                                  </span>
                                ) : null}
                              </span>
                              <span className="mt-3 block max-w-[28ch] text-sm leading-7 opacity-90">
                                {option.detail}
                              </span>
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="w-full rounded-[24px] border border-[color:var(--border-subtle)] bg-[var(--surface-contrast)] px-5 py-4 sm:px-6">
                      <p className="type-label">Current path</p>
                      <p className="mt-2 text-base font-semibold text-[var(--text-primary)]">
                        {activeConfigurationMode.label}
                      </p>
                      <p className="mt-2 text-sm leading-6 text-[var(--text-secondary)]">
                        {activeConfigurationMode.summary}
                      </p>
                    </div>
                  </div>
                </Card>
              </div>

              <div className="hidden min-w-0 xl:block xl:self-start">
                <PricingSummaryPanel summary={summaryPanelData} />
              </div>
            </div>

            <div
              className="min-w-0 space-y-8 sm:space-y-10 xl:space-y-12"
              ref={lowerFullWidthSectionRef}
            >
              {isPackagesMode ? (
                <PackageComparisonSection
                  appliedCoupon={appliedCoupon}
                  billingMode={billingMode}
                  billingOptions={billingOptions}
                  couponError={couponError}
                  couponInput={couponInput}
                  id={PACKAGE_SELECTION_SECTION_ID}
                  onBillingModeChange={setBillingMode}
                  onCouponApply={handleCouponApply}
                  onCouponChange={handleCouponChange}
                  onCouponClear={handleCouponClear}
                  onSelectPlan={setSelectedPlanId}
                  packageStatusLabel={packageStatusLabel}
                  packageStatusNotice={packageStatusNotice}
                  plans={plans}
                  selectedPlanId={selectedPlanId}
                />
              ) : (
                <div
                  className="space-y-6 sm:space-y-7"
                  id={CUSTOM_BUILD_SECTION_ID}
                >
                  <Card className="p-6 sm:p-7 lg:p-8">
                    <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
                      <div className="max-w-3xl space-y-4">
                        <p className="type-kicker">Custom Build</p>
                        <h2 className="type-section-title max-w-[15ch]">
                          Build the system by section, then refine only the
                          active modules.
                        </h2>
                        <p className="max-w-[56ch] text-base leading-8 text-[var(--text-secondary)]">
                          Modules are grouped by function so you can scan the
                          build in steps. Once a module is active, its add-ons
                          and configuration controls appear inline without
                          fragmenting the page into stacks of mini cards.
                        </p>
                      </div>

                      <div className="rounded-[24px] border border-[color:var(--border-subtle)] bg-[var(--surface-contrast)] px-5 py-4 sm:min-w-[16rem] sm:px-6">
                        <p className="type-label">Selection status</p>
                        <p className="mt-2 text-base font-semibold text-[var(--text-primary)]">
                          {selectedCustomModulesLabel}
                        </p>
                        <p className="mt-2 text-sm leading-6 text-[var(--text-secondary)]">
                          Select a module to reveal the relevant add-ons and
                          tier choices below it.
                        </p>
                      </div>
                    </div>
                  </Card>

                  <Card className="overflow-hidden p-0">
                    <div className="divide-y divide-[color:var(--border-subtle)]">
                      {customBuildModuleGroups.map((category) => (
                        <section
                          className="px-6 py-6 sm:px-7 sm:py-7 lg:px-8 lg:py-8"
                          key={category.id}
                        >
                          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
                            <div className="max-w-3xl space-y-2">
                              <p className="type-kicker">{category.title}</p>
                              <p className="text-sm leading-7 text-[var(--text-secondary)]">
                                {category.description}
                              </p>
                            </div>

                            <div className="rounded-full border border-[color:var(--border-subtle)] bg-[var(--surface-soft)] px-3 py-1 text-[11px] font-medium uppercase tracking-[0.18em] text-[var(--text-muted)]">
                              {getCategorySelectionLabel(
                                category,
                                selectedCustomModuleIds,
                              )}
                            </div>
                          </div>

                          <div className="mt-5 grid gap-4 xl:grid-cols-2">
                            {category.modules.map((module) => (
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
                        </section>
                      ))}
                    </div>
                  </Card>
                </div>
              )}
            </div>
          </div>
        </div>
      </Section>

      <StickyPricingSummaryPill
        isOpen={isLowerSummarySheetOpen}
        isVisible={hasSummarySelection && isLowerSummaryPillVisible}
        onClick={() => setIsLowerSummarySheetOpen(true)}
        summary={summaryPanelData}
      />
      <PricingSummaryBottomSheet
        isOpen={isLowerSummarySheetOpen}
        onClose={() => setIsLowerSummarySheetOpen(false)}
        onInvalidAction={handleLowerSummaryInvalidAction}
        summary={summaryPanelData}
      />
      <RecentBuilds />
      <WhatHappensNext ctaLabel="Review Setup" ctaTo="/summary" />
      <MobilePricingSummaryBar
        onInvalidAction={handleSelectionGuidance}
        summary={summaryPanelData}
      />
    </div>
  );
}
