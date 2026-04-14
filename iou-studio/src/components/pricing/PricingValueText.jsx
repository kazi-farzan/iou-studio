function splitPricingValue(value) {
  const resolvedValue = String(value ?? "");
  const monthlyMatch = resolvedValue.match(/^(₹[\d,]+)(\/month)$/i);

  if (monthlyMatch) {
    return {
      main: monthlyMatch[1],
      suffix: monthlyMatch[2],
    };
  }

  return {
    main: resolvedValue,
    suffix: "",
  };
}

const sizeClasses = {
  sm: {
    main: "text-base sm:text-lg",
    suffix: "text-[10px]",
  },
  md: {
    main: "text-lg sm:text-xl",
    suffix: "text-[11px]",
  },
  lg: {
    main: "text-2xl sm:text-3xl",
    suffix: "text-xs",
  },
};

function getAlignClasses(align) {
  if (align === "right") {
    return "items-start text-left sm:items-end sm:text-right";
  }

  return "items-start text-left";
}

export default function PricingValueText({
  align = "left",
  size = "md",
  value,
}) {
  const { main, suffix } = splitPricingValue(value);
  const classes = sizeClasses[size] || sizeClasses.md;

  return (
    <div className={["flex min-w-0 flex-col", getAlignClasses(align)].join(" ")}>
      <span
        className={[
          "max-w-full min-w-0 break-words font-semibold leading-tight text-[var(--text-primary)]",
          classes.main,
        ].join(" ")}
      >
        {main}
      </span>

      {suffix ? (
        <span
          className={[
            "mt-1 max-w-full font-medium uppercase tracking-[0.14em] text-[var(--text-muted)]",
            classes.suffix,
          ].join(" ")}
        >
          {suffix}
        </span>
      ) : null}
    </div>
  );
}
