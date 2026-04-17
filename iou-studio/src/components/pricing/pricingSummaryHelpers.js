import {
  formatDeliverableSummary,
  mergeDeliverableSections,
} from "../../data/configuratorSchema.js";

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
