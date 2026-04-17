import {
  formatDeliverableSummary,
  mergeDeliverableSections,
} from "../../data/configuratorSchema.js";

function getNumericValue(value = "") {
  const match = String(value).match(/[\d,]+(?:\.\d+)?/);

  if (!match) {
    return null;
  }

  const numericValue = Number(match[0].replace(/,/g, ""));

  return Number.isFinite(numericValue) ? numericValue : null;
}

function formatCompactThousands(value) {
  if (value < 1000) {
    return String(Math.round(value));
  }

  const valueInThousands = value / 1000;
  const roundedValue =
    valueInThousands >= 100
      ? Math.round(valueInThousands)
      : Math.round(valueInThousands * 10) / 10;

  return `${Number.isInteger(roundedValue) ? roundedValue : roundedValue.toFixed(1).replace(/\.0$/, "")}K`;
}

function formatCountLabel(count, singular, plural = `${singular}s`) {
  return `${count} ${count === 1 ? singular : plural}`;
}

function countSelectedOptions(groups = []) {
  return groups.reduce(
    (total, group) =>
      total +
      (group.rows ?? []).filter((row) => row.kind === "option").length,
    0,
  );
}

function getGroupTitles(groups = []) {
  return groups.map((group) => group.title).filter(Boolean);
}

function getRowOutputSummaries(groups = []) {
  return groups.flatMap((group) =>
    (group.rows ?? []).map((row) => row.outputSummary).filter(Boolean),
  );
}

function formatCompactRange(rangeDays) {
  const minimum = Number(rangeDays?.minimum);
  const maximum = Number(rangeDays?.maximum);

  if (
    !Number.isFinite(minimum) ||
    !Number.isFinite(maximum) ||
    minimum <= 0 ||
    maximum <= 0
  ) {
    return "";
  }

  const useWeeks = minimum % 7 === 0 && maximum % 7 === 0;

  if (useWeeks) {
    const minimumWeeks = minimum / 7;
    const maximumWeeks = maximum / 7;

    return minimumWeeks === maximumWeeks
      ? `${minimumWeeks}w`
      : `${minimumWeeks}-${maximumWeeks}w`;
  }

  return minimum === maximum ? `${minimum}d` : `${minimum}-${maximum}d`;
}

export function getSummaryActionLabel(summary, compact = false) {
  if (!summary) {
    return "Continue";
  }

  if (summary.isActionDisabled) {
    return summary.modeLabel === "Packages" ? "Select setup" : "Select modules";
  }

  if (!compact) {
    return summary.ctaLabel || "Continue";
  }

  return summary.ctaLabel?.toLowerCase().includes("review")
    ? "Review"
    : "Continue";
}

export function getSummaryTopContext(summary) {
  if (!summary) {
    return "";
  }

  return summary.total?.meta || summary.statusLabel || "";
}

export function hasActiveSummarySelection(summary) {
  return Boolean(
    summary &&
      !summary.isActionDisabled &&
      (summary.groups?.length ?? 0) > 0,
  );
}

export function getCompactSummaryTotal(summary) {
  const rawValue = String(summary?.total?.value || "").trim();

  if (!rawValue) {
    return "";
  }

  if (!/\d/.test(rawValue)) {
    return /^free$/i.test(rawValue) ? "Free" : "";
  }

  const numericValue = getNumericValue(rawValue);

  if (numericValue === null) {
    return "";
  }

  const currencySymbol = rawValue.includes("\u20B9") ? "\u20B9" : "";

  return `${currencySymbol}${formatCompactThousands(numericValue)}`;
}

export function getCompactSummaryTimeline(summary) {
  const rangeValue = formatCompactRange(summary?.timeline?.rangeDays);

  if (rangeValue) {
    return rangeValue;
  }

  const timelineValue = String(summary?.timeline?.value || "")
    .replace(/^Estimated delivery:\s*/i, "")
    .trim();

  if (
    !timelineValue ||
    /pending|confirmed during scope review|updates as you build/i.test(
      timelineValue,
    )
  ) {
    return "";
  }

  const parsedValue = timelineValue.match(
    /(\d+)(?:\s*-\s*(\d+))?\s*(week|weeks|day|days)\b/i,
  );

  if (!parsedValue) {
    return "";
  }

  const minimum = Number(parsedValue[1]);
  const maximum = parsedValue[2] ? Number(parsedValue[2]) : minimum;
  const unit = /^week/i.test(parsedValue[3]) ? "w" : "d";

  return minimum === maximum
    ? `${minimum}${unit}`
    : `${minimum}-${maximum}${unit}`;
}

export function getSummarySetup(summary) {
  const groups = summary?.groups ?? [];

  if (!groups.length) {
    return {
      detail: summary?.emptyState?.detail || "",
      items: [],
      title: summary?.emptyState?.title || "No active build yet.",
    };
  }

  if (summary?.modeLabel === "Packages") {
    const selectedGroup = groups[0];
    const moduleCount = selectedGroup?.rows?.length ?? 0;

    return {
      detail: moduleCount
        ? `${formatCountLabel(moduleCount, "included module")} in the current setup`
        : "Selected setup ready for review.",
      items: [],
      title: selectedGroup?.title || "Selected package",
    };
  }

  const optionCount = countSelectedOptions(groups);

  if (groups.length === 1) {
    return {
      detail: optionCount
        ? `${formatCountLabel(optionCount, "selected option")} active in this module`
        : "Base scope active for this module",
      items: [],
      title: groups[0]?.title || "Selected module",
    };
  }

  return {
    detail: optionCount
      ? `${formatCountLabel(optionCount, "selected option")} across the current build`
      : "Base scope only across the selected modules",
    items: getGroupTitles(groups),
    title: `${formatCountLabel(groups.length, "module")} active`,
  };
}

export function getSummaryBreakdownDescription(summary) {
  const groups = summary?.groups ?? [];

  if (!groups.length) {
    return summary?.emptyState?.detail || "Build details appear after selection.";
  }

  if (summary?.modeLabel === "Packages") {
    const rowCount = groups[0]?.rows?.length ?? 0;

    return `${formatCountLabel(rowCount, "included module")} grouped under the selected package.`;
  }

  const optionCount = countSelectedOptions(groups);

  if (!optionCount) {
    return `${formatCountLabel(groups.length, "module")} grouped with base scope only.`;
  }

  return `${formatCountLabel(groups.length, "module")} and ${formatCountLabel(optionCount, "selected option")} grouped below.`;
}

export function getSummaryDeliverableSections(summary) {
  const groups = summary?.groups ?? [];
  const outputHighlights = getRowOutputSummaries(groups);

  return mergeDeliverableSections(
    ...groups.map((group) => group.deliverables?.sections ?? []),
    outputHighlights.length
      ? [
          {
            key: "outputs",
            label: "Output highlights",
            items: outputHighlights,
          },
        ]
      : [],
  );
}

export function getSummaryDeliverablePreview(summary, limit = 4) {
  return formatDeliverableSummary(
    getSummaryDeliverableSections(summary),
    limit,
    summary?.emptyState?.detail || "Deliverables appear after selection.",
  );
}

export function getSummaryTimelineBreakdown(summary) {
  return (summary?.groups ?? [])
    .map((group) => {
      const optionContributions = (group.rows ?? [])
        .filter((row) => row.kind === "option" && row.timelineLabel)
        .map((row) => `${row.label} ${row.timelineLabel}`);
      const includedModuleCount = (group.rows ?? []).filter(
        (row) => row.kind === "included-module",
      ).length;

      return {
        detail: optionContributions.length
          ? optionContributions.join(" / ")
          : includedModuleCount
            ? `${formatCountLabel(includedModuleCount, "included module")} in this estimate`
            : "Base scope estimate",
        id: group.id,
        label: group.title,
        value: group.timeline?.value || "",
      };
    })
    .filter((item) => item.value);
}
