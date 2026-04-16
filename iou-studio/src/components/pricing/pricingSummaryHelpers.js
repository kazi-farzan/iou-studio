export function getSummaryActionLabel(summary, compact = false) {
  if (!summary) {
    return "Continue";
  }

  if (summary.isActionDisabled) {
    return summary.modeLabel === "Build Your Own"
      ? "Select modules"
      : "Select setup";
  }

  if (!compact) {
    return summary.ctaLabel || "Continue";
  }

  return summary.ctaLabel?.toLowerCase().includes("order summary")
    ? "Review"
    : "Continue";
}
