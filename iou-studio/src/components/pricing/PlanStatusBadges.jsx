const badgeDefinitions = [
  {
    key: "popular",
    label: "Popular",
    tone: "popular",
  },
  {
    key: "selected",
    label: "Selected",
    tone: "selected",
  },
];

const badgeSizeClasses = {
  compact: "px-3 py-1 text-[10px]",
  default: "px-3 py-1 text-[11px]",
};

function getBadgeClasses({ isVisible, size, tone }) {
  return [
    "inline-flex items-center rounded-full font-medium uppercase tracking-[0.22em] whitespace-nowrap transition-opacity duration-200",
    tone === "popular"
      ? "theme-chip-strong"
      : "theme-panel text-[var(--accent-secondary)]",
    badgeSizeClasses[size] ?? badgeSizeClasses.default,
    isVisible ? "opacity-100" : "invisible opacity-0",
  ].join(" ");
}

export default function PlanStatusBadges({
  className = "",
  isMostPopular = false,
  isSelected = false,
  size = "default",
}) {
  const badgeVisibility = {
    popular: isMostPopular,
    selected: isSelected,
  };

  return (
    <div
      className={[
        "flex min-h-[4.5rem] w-full min-w-0 flex-col items-end gap-2",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {badgeDefinitions.map((badge) => {
        const isVisible = badgeVisibility[badge.key];

        return (
          <div className="flex min-h-[1.875rem] w-full justify-end" key={badge.key}>
            <span
              aria-hidden={!isVisible}
              className={getBadgeClasses({
                isVisible,
                size,
                tone: badge.tone,
              })}
            >
              {badge.label}
            </span>
          </div>
        );
      })}
    </div>
  );
}
