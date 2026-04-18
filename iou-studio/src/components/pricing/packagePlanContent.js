const INR_SYMBOL = "\u20B9";

function trimTrailingZeroes(value) {
  return String(value).replace(/\.0$/, "");
}

function getUniqueItems(items = []) {
  return [...new Set(items.filter(Boolean))];
}

export function formatTimelineLabel(label = "") {
  return label.replace(/^Estimated delivery:\s*/i, "").trim();
}

export function formatCompactCurrency(value, suffix = "") {
  if (!Number.isFinite(value)) {
    return "";
  }

  if (value === 0) {
    return "Free";
  }

  const absoluteValue = Math.abs(value);

  if (absoluteValue >= 1000000) {
    const precision = absoluteValue >= 10000000 ? 0 : 1;
    return `${INR_SYMBOL}${trimTrailingZeroes((value / 1000000).toFixed(precision))}M${suffix}`;
  }

  if (absoluteValue >= 1000) {
    const precision = absoluteValue >= 100000 ? 0 : 1;
    return `${INR_SYMBOL}${trimTrailingZeroes((value / 1000).toFixed(precision))}K${suffix}`;
  }

  return `${INR_SYMBOL}${Math.round(value)}${suffix}`;
}

export function getMetricValues(plan) {
  const currentRate = plan.base?.isYearly
    ? formatCompactCurrency(plan.base.monthlyEquivalent, "/mo")
    : formatCompactCurrency(plan.effective?.todayCharge, "/mo");

  return {
    currentRate,
    delivery:
      formatTimelineLabel(plan.timelineEstimate?.label) ||
      "Timeline shared on review",
    dueToday: formatCompactCurrency(plan.effective?.todayCharge),
  };
}

export function getScopeHighlights(plan) {
  const packageDeliverables = (plan.packageDeliverableSections ?? []).flatMap(
    (section) => section.items ?? [],
  );

  return getUniqueItems([
    ...packageDeliverables,
    ...(plan.features ?? []),
  ]).slice(0, 3);
}

export function getAdditionalCoverage(plan, scopeHighlights = getScopeHighlights(plan)) {
  return (plan.features ?? []).filter(
    (feature) => !scopeHighlights.includes(feature),
  );
}
