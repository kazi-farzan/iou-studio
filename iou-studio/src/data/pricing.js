export const BILLING_MODE_MONTHLY = "monthly";
export const BILLING_MODE_YEARLY = "yearly";

export const billingOptions = [
  {
    id: BILLING_MODE_MONTHLY,
    label: "Monthly",
    note: "Pay month to month",
    caption: "Flexible billing with pricing shown exactly as invoiced.",
  },
  {
    id: BILLING_MODE_YEARLY,
    label: "Yearly",
    note: "2 months included",
    caption: "See the lower effective monthly rate while billing once per year.",
  },
];

export const pricingPlans = [
  {
    id: "starter",
    name: "Starter",
    audience: "Local businesses",
    description:
      "A polished digital foundation for service brands that need credibility, faster inquiries, and a premium first impression.",
    pricing: {
      monthly: 18000,
      yearly: 180000,
    },
    features: [
      "Conversion-focused structure for local lead generation",
      "Responsive visual design tuned for mobile-first browsing",
      "Lead forms, WhatsApp handoff, and contact setup",
      "Basic SEO, analytics, and launch performance checks",
      "Two structured revision rounds for a sharper finish",
    ],
    ctaLabel: "Start with Starter",
  },
  {
    id: "growth",
    name: "Growth",
    audience: "Growing brands and startups",
    description:
      "A stronger multi-page system built for brands that are validating offers, running campaigns, and scaling with more intention.",
    pricing: {
      monthly: 33000,
      yearly: 330000,
    },
    features: [
      "Multi-page website or campaign system with strategic page hierarchy",
      "Conversion sections for launches, offers, and paid traffic support",
      "CMS-ready content blocks for services, case studies, or updates",
      "Advanced analytics events, SEO structure, and funnel thinking",
      "Monthly iteration support for ongoing refinements and experiments",
    ],
    ctaLabel: "Choose Growth",
    isMostPopular: true,
  },
  {
    id: "premium",
    name: "Premium",
    audience: "Custom product and flagship builds",
    description:
      "High-touch custom execution for ambitious launches, complex user journeys, and premium digital products that need senior direction.",
    pricing: {
      monthly: 72000,
      yearly: 720000,
    },
    features: [
      "Custom UX, product, or premium brand experience planning",
      "Advanced interactions, platform flows, and integration-ready architecture",
      "Design system thinking for scalable implementation consistency",
      "Performance, accessibility, and quality review baked into delivery",
      "Dedicated sprint planning for deeper collaboration and scope flexibility",
    ],
    ctaLabel: "Request Custom Scope",
  },
];

export const couponCatalog = {
  FIRST3: {
    code: "FIRST3",
    name: "First 3 Months",
    appliesTo: BILLING_MODE_MONTHLY,
    description: "20% off the monthly rate for your first 3 billing cycles.",
    kind: "percentage_discount",
    discountRate: 0.2,
    promoMonths: 3,
  },
  TRYONCE: {
    code: "TRYONCE",
    name: "Try Once",
    appliesTo: BILLING_MODE_MONTHLY,
    description: "Your first month is free, then the regular monthly rate begins.",
    kind: "free_month",
    freeMonths: 1,
  },
};

const inrFormatter = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0,
});

function normalizeCouponCode(code = "") {
  return code.trim().toUpperCase();
}

function roundCurrency(value) {
  return Math.round(value);
}

function buildBasePricing(plan, billingMode) {
  const monthlyPrice = plan.pricing.monthly;
  const annualPrice = plan.pricing.yearly;
  const monthlyEquivalent = roundCurrency(annualPrice / 12);
  const yearlySavings = monthlyPrice * 12 - annualPrice;
  const isYearly = billingMode === BILLING_MODE_YEARLY;
  const yearlySavingsPercent = roundCurrency(
    (yearlySavings / (monthlyPrice * 12)) * 100,
  );

  return {
    billingMode,
    isYearly,
    monthlyPrice,
    annualPrice,
    monthlyEquivalent,
    yearlySavings,
    yearlySavingsPercent,
    headlinePrice: isYearly ? monthlyEquivalent : monthlyPrice,
    headlineSuffix: "/month",
    billingLine: isYearly ? `${formatInr(annualPrice)} billed yearly` : "Billed monthly",
    supportLine: isYearly
      ? `Save ${formatInr(yearlySavings)} a year compared with monthly billing`
      : `Switch to yearly for ${formatInr(monthlyEquivalent)}/month effective`,
    todayCharge: isYearly ? annualPrice : monthlyPrice,
    recurringCharge: isYearly ? annualPrice : monthlyPrice,
    recurringLabel: isYearly ? "Renews yearly" : "Renews monthly",
    yearOneSpend: isYearly ? annualPrice : monthlyPrice * 12,
  };
}

function buildCouponEffect(basePricing, coupon) {
  if (!coupon) {
    return null;
  }

  if (basePricing.billingMode !== coupon.appliesTo) {
    return {
      ...coupon,
      status: "inactive",
      tone: "muted",
      badgeLabel: "Saved for monthly",
      title: `${coupon.code} is available on monthly billing`,
      detail: coupon.description,
      note: `${coupon.code} will apply if you switch back to monthly billing.`,
    };
  }

  if (coupon.code === "FIRST3") {
    const promoPrice = roundCurrency(
      basePricing.monthlyPrice * (1 - coupon.discountRate),
    );
    const yearOneSpend =
      promoPrice * coupon.promoMonths +
      basePricing.monthlyPrice * (12 - coupon.promoMonths);
    const savings = basePricing.monthlyPrice * 12 - yearOneSpend;

    return {
      ...coupon,
      status: "active",
      tone: "accent",
      badgeLabel: "20% intro offer",
      title: `${formatInr(promoPrice)}/month for the first 3 months`,
      detail: `Then ${formatInr(basePricing.monthlyPrice)}/month from month 4 onward.`,
      note: `FIRST3 saves ${formatInr(savings)} across the first year.`,
      promoPrice,
      todayCharge: promoPrice,
      recurringCharge: basePricing.monthlyPrice,
      recurringLabel: `Then ${formatInr(basePricing.monthlyPrice)}/month from month 4`,
      yearOneSpend,
      savings,
    };
  }

  if (coupon.code === "TRYONCE") {
    const yearOneSpend =
      basePricing.monthlyPrice * (12 - coupon.freeMonths);
    const savings = basePricing.monthlyPrice * 12 - yearOneSpend;

    return {
      ...coupon,
      status: "active",
      tone: "accent",
      badgeLabel: "1 month free",
      title: "First month free",
      detail: `Then ${formatInr(basePricing.monthlyPrice)}/month starting from month 2.`,
      note: `TRYONCE removes the first invoice and saves ${formatInr(savings)} in year one.`,
      todayCharge: 0,
      recurringCharge: basePricing.monthlyPrice,
      recurringLabel: `Then ${formatInr(basePricing.monthlyPrice)}/month from month 2`,
      yearOneSpend,
      savings,
    };
  }

  return null;
}

function buildEffectivePricing(basePricing, couponEffect) {
  if (!couponEffect || couponEffect.status !== "active") {
    return {
      todayCharge: basePricing.todayCharge,
      recurringCharge: basePricing.recurringCharge,
      recurringLabel: basePricing.recurringLabel,
      yearOneSpend: basePricing.yearOneSpend,
      savings:
        basePricing.billingMode === BILLING_MODE_YEARLY ? basePricing.yearlySavings : 0,
    };
  }

  return {
    todayCharge: couponEffect.todayCharge,
    recurringCharge: couponEffect.recurringCharge,
    recurringLabel: couponEffect.recurringLabel,
    yearOneSpend: couponEffect.yearOneSpend,
    savings: couponEffect.savings,
  };
}

function buildPlanCallout(basePricing, couponEffect) {
  if (couponEffect?.status === "active") {
    return {
      tone: "accent",
      eyebrow: couponEffect.code,
      title: couponEffect.title,
      detail: couponEffect.detail,
    };
  }

  if (couponEffect?.status === "inactive") {
    return {
      tone: "muted",
      eyebrow: couponEffect.code,
      title: "Saved for monthly billing",
      detail: couponEffect.note,
    };
  }

  if (basePricing.isYearly) {
    return {
      tone: "muted",
      eyebrow: "Yearly value",
      title: `${formatInr(basePricing.monthlyEquivalent)}/month effective`,
      detail: `Billed yearly once and saves ${formatInr(basePricing.yearlySavings)} a year.`,
    };
  }

  return {
    tone: "default",
    eyebrow: "Monthly billing",
    title: "Flexible month-to-month pricing",
    detail: `Switch to yearly for ${formatInr(basePricing.monthlyEquivalent)}/month effective.`,
  };
}

export function formatInr(value) {
  return inrFormatter.format(value);
}

export function getCouponByCode(code) {
  const normalizedCode = normalizeCouponCode(code);

  return couponCatalog[normalizedCode] || null;
}

export function validateCouponCode(code) {
  const normalizedCode = normalizeCouponCode(code);

  if (!normalizedCode) {
    return {
      isValid: false,
      message: "Enter a coupon code to preview a pricing offer.",
    };
  }

  const coupon = getCouponByCode(normalizedCode);

  if (!coupon) {
    return {
      isValid: false,
      message: "That code is not active right now. Try FIRST3 or TRYONCE.",
    };
  }

  return {
    isValid: true,
    coupon,
  };
}

export function getCouponFeedback(coupon, billingMode) {
  if (!coupon) {
    return {
      tone: "neutral",
      label: "No code applied",
      title: "Add a coupon to preview launch offers",
      detail: "Use FIRST3 for 20% off the first 3 months or TRYONCE for 1 free month.",
    };
  }

  if (billingMode !== coupon.appliesTo) {
    return {
      tone: "muted",
      label: "Saved for monthly",
      title: `${coupon.code} is ready if you switch back to monthly`,
      detail: coupon.description,
    };
  }

  return {
    tone: "accent",
    label: `${coupon.code} applied`,
    title: coupon.name,
    detail: coupon.description,
  };
}

export function getPricingModeSummary(billingMode, coupon) {
  if (billingMode === BILLING_MODE_YEARLY) {
    return {
      tone: coupon ? "muted" : "accent",
      eyebrow: "Yearly billing active",
      title: "Lower effective monthly pricing is now visible across every plan",
      detail: coupon
        ? "Yearly billing already includes the built-in savings. Your coupon stays saved for monthly pricing."
        : "You are seeing the effective monthly rate while yearly billing is invoiced once upfront.",
    };
  }

  if (coupon) {
    return {
      tone: "accent",
      eyebrow: `${coupon.code} active`,
      title: "Monthly pricing is reflecting your selected launch offer",
      detail: coupon.description,
    };
  }

  return {
    tone: "neutral",
    eyebrow: "Monthly billing active",
    title: "Flexible month-to-month pricing is currently selected",
    detail: "Use coupons to simulate intro offers, or switch to yearly for the stronger long-term rate.",
  };
}

export function getPlanPricing(plan, billingMode, coupon) {
  const base = buildBasePricing(plan, billingMode);
  const couponEffect = buildCouponEffect(base, coupon);
  const effective = buildEffectivePricing(base, couponEffect);

  return {
    ...plan,
    base,
    coupon: couponEffect,
    effective,
    callout: buildPlanCallout(base, couponEffect),
  };
}

export function getPlanSnapshot(planPricing) {
  const { base, coupon, effective } = planPricing;

  if (base.isYearly) {
    return {
      note: `Billed yearly once. Save ${formatInr(base.yearlySavings)} a year versus monthly billing.`,
      metrics: [
        {
          label: "Effective rate",
          value: `${formatInr(base.monthlyEquivalent)}/month`,
        },
        {
          label: "Due today",
          value: formatInr(effective.todayCharge),
        },
        {
          label: "Year 1",
          value: formatInr(effective.yearOneSpend),
        },
      ],
    };
  }

  if (coupon?.status === "active" && coupon.code === "FIRST3") {
    return {
      note: `20% off for the first 3 months, then ${formatInr(
        coupon.recurringCharge,
      )}/month.`,
      metrics: [
        {
          label: "Starting rate",
          value: `${formatInr(coupon.todayCharge)}/month`,
        },
        {
          label: "Due today",
          value: formatInr(coupon.todayCharge),
        },
        {
          label: "Year 1",
          value: formatInr(coupon.yearOneSpend),
        },
      ],
    };
  }

  if (coupon?.status === "active" && coupon.code === "TRYONCE") {
    return {
      note: `First month free, then ${formatInr(coupon.recurringCharge)}/month from month 2.`,
      metrics: [
        {
          label: "Starting rate",
          value: "Free",
        },
        {
          label: "Due today",
          value: formatInr(coupon.todayCharge),
        },
        {
          label: "Year 1",
          value: formatInr(coupon.yearOneSpend),
        },
      ],
    };
  }

  return {
    note: `Pay month to month or switch to yearly to save ${formatInr(
      base.yearlySavings,
    )} a year.`,
    metrics: [
      {
        label: "Current rate",
        value: `${formatInr(effective.todayCharge)}/month`,
      },
      {
        label: "Due today",
        value: formatInr(effective.todayCharge),
      },
      {
        label: "Year 1",
        value: formatInr(effective.yearOneSpend),
      },
    ],
  };
}

export function getPlanSummaryRows(planPricing) {
  const { base, coupon, effective } = planPricing;

  if (base.isYearly) {
    return [
      {
        label: "Effective monthly rate",
        value: `${formatInr(base.monthlyEquivalent)}/month`,
        detail: "The yearly invoice averaged into a monthly view.",
      },
      {
        label: "Annual invoice",
        value: formatInr(effective.todayCharge),
        detail: "Billed once upfront for the full year.",
      },
      {
        label: "Annual savings",
        value: formatInr(base.yearlySavings),
        detail: "Savings compared with 12 monthly payments.",
      },
      {
        label: "Coupon status",
        value: coupon?.status === "inactive" ? "Monthly only" : "Built-in savings active",
        detail: coupon?.status === "inactive"
          ? coupon.note
          : "Yearly billing already reflects the strongest available rate.",
      },
    ];
  }

  if (coupon?.status === "active" && coupon.code === "FIRST3") {
    return [
      {
        label: "Months 1-3",
        value: `${formatInr(coupon.todayCharge)}/month`,
        detail: "Discounted intro rate with FIRST3 applied.",
      },
      {
        label: "Month 4 onward",
        value: `${formatInr(coupon.recurringCharge)}/month`,
        detail: "Regular monthly billing resumes after the promo window.",
      },
      {
        label: "Year-one spend",
        value: formatInr(coupon.yearOneSpend),
        detail: "Projected total across the first 12 months.",
      },
      {
        label: "Promo savings",
        value: formatInr(coupon.savings),
        detail: "Saved over the first year through the intro offer.",
      },
    ];
  }

  if (coupon?.status === "active" && coupon.code === "TRYONCE") {
    return [
      {
        label: "First invoice",
        value: "Free",
        detail: "No charge for the first month with TRYONCE.",
      },
      {
        label: "Month 2 onward",
        value: `${formatInr(coupon.recurringCharge)}/month`,
        detail: "Regular monthly billing resumes after the free month.",
      },
      {
        label: "Year-one spend",
        value: formatInr(coupon.yearOneSpend),
        detail: "Equivalent to 11 paid months in the first year.",
      },
      {
        label: "Promo savings",
        value: formatInr(coupon.savings),
        detail: "Saved by skipping the first invoice.",
      },
    ];
  }

  return [
    {
      label: "Current monthly rate",
      value: `${formatInr(effective.todayCharge)}/month`,
      detail: "Standard month-to-month pricing with no promo applied.",
    },
    {
      label: "Recurring invoice",
      value: `${formatInr(effective.recurringCharge)}/month`,
      detail: "The ongoing monthly rate if you stay on this plan.",
    },
    {
      label: "Year-one spend",
      value: formatInr(effective.yearOneSpend),
      detail: "Projected total across 12 monthly billing cycles.",
    },
    {
      label: "Yearly upgrade savings",
      value: formatInr(base.yearlySavings),
      detail: `Switching to yearly lowers the effective rate to ${formatInr(
        base.monthlyEquivalent,
      )}/month.`,
    },
  ];
}

export function getSelectedPlanSummary(planPricing) {
  const { base, coupon, effective } = planPricing;

  if (base.isYearly) {
    return {
      headlineLabel: "Effective monthly rate",
      headlineValue: `${formatInr(base.monthlyEquivalent)}/month`,
      secondaryLabel: "Due today",
      secondaryValue: formatInr(effective.todayCharge),
      note: `Yearly billing keeps the lowest rate active and saves ${formatInr(
        base.yearlySavings,
      )} over 12 months.`,
      footer: "Your yearly invoice is paid once upfront while the displayed price reflects the monthly equivalent.",
    };
  }

  if (coupon?.status === "active" && coupon.code === "FIRST3") {
    return {
      headlineLabel: "Months 1-3",
      headlineValue: `${formatInr(coupon.todayCharge)}/month`,
      secondaryLabel: "Month 4 onward",
      secondaryValue: `${formatInr(coupon.recurringCharge)}/month`,
      note: `FIRST3 is active. You save ${formatInr(coupon.savings)} across the first year.`,
      footer: "This promo applies to monthly billing only and automatically rolls into the standard monthly rate after month 3.",
    };
  }

  if (coupon?.status === "active" && coupon.code === "TRYONCE") {
    return {
      headlineLabel: "First invoice",
      headlineValue: "Free",
      secondaryLabel: "Month 2 onward",
      secondaryValue: `${formatInr(coupon.recurringCharge)}/month`,
      note: `TRYONCE removes the first invoice and saves ${formatInr(
        coupon.savings,
      )} over the first year.`,
      footer: "After the free month, billing resumes at the standard monthly rate automatically.",
    };
  }

  return {
    headlineLabel: "Current monthly rate",
    headlineValue: `${formatInr(effective.todayCharge)}/month`,
    secondaryLabel: "Year-one spend",
    secondaryValue: formatInr(effective.yearOneSpend),
    note: `Flexible monthly pricing is active. Switch to yearly to save ${formatInr(
      base.yearlySavings,
    )} over the year.`,
    footer: "Monthly billing keeps the first invoice lighter and leaves room to upgrade into yearly pricing later.",
  };
}
