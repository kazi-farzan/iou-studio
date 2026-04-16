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
