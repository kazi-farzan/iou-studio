export const BILLING_MODE_MONTHLY = "monthly";
export const BILLING_MODE_YEARLY = "yearly";

export const billingOptions = [
  {
    id: BILLING_MODE_MONTHLY,
    label: "Monthly",
    note: "Flexible month-to-month billing",
  },
  {
    id: BILLING_MODE_YEARLY,
    label: "Yearly",
    note: "Pay yearly and save the equivalent of 2 months",
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
      "Conversion-focused site structure for local lead generation",
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
      "Advanced analytics events, SEO structure, and lead funnel thinking",
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

function normalizeCouponCode(code) {
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

  return {
    billingMode,
    monthlyPrice,
    annualPrice,
    monthlyEquivalent,
    yearlySavings,
    headlinePrice: isYearly ? monthlyEquivalent : monthlyPrice,
    headlineSuffix: "/month",
    billingLabel: isYearly ? `${formatInr(annualPrice)} billed yearly` : "Billed monthly",
    supportingLabel: isYearly
      ? `Save ${formatInr(yearlySavings)} compared with monthly billing`
      : `Switch to yearly and save ${formatInr(yearlySavings)} a year`,
    immediateCharge: isYearly ? annualPrice : monthlyPrice,
    recurringCharge: isYearly ? annualPrice : monthlyPrice,
    recurringLabel: isYearly ? "Renews yearly" : "Renews monthly",
    yearOneSpend: isYearly ? annualPrice : monthlyPrice * 12,
  };
}

function buildCouponEffect(basePricing, coupon, billingMode) {
  if (!coupon) {
    return null;
  }

  if (billingMode !== coupon.appliesTo) {
    return {
      ...coupon,
      status: "inactive",
      note: `${coupon.code} is available on monthly billing only.`,
    };
  }

  if (coupon.code === "FIRST3") {
    const promoPrice = roundCurrency(
      basePricing.monthlyPrice * (1 - coupon.discountRate),
    );
    const yearOneSpend =
      promoPrice * coupon.promoMonths +
      basePricing.monthlyPrice * (12 - coupon.promoMonths);

    return {
      ...coupon,
      status: "active",
      promoPrice,
      promoMonths: coupon.promoMonths,
      immediateCharge: promoPrice,
      recurringCharge: basePricing.monthlyPrice,
      recurringLabel: `Then ${formatInr(basePricing.monthlyPrice)}/month from month 4`,
      yearOneSpend,
      savings: basePricing.monthlyPrice * 12 - yearOneSpend,
      primaryLine: `${formatInr(promoPrice)}/month for months 1-3`,
      secondaryLine: `You save ${formatInr(
        basePricing.monthlyPrice - promoPrice,
      )} on each of the first 3 months.`,
    };
  }

  if (coupon.code === "TRYONCE") {
    const yearOneSpend =
      basePricing.monthlyPrice * (12 - coupon.freeMonths);

    return {
      ...coupon,
      status: "active",
      immediateCharge: 0,
      recurringCharge: basePricing.monthlyPrice,
      recurringLabel: `Then ${formatInr(basePricing.monthlyPrice)}/month from month 2`,
      yearOneSpend,
      savings: basePricing.monthlyPrice * 12 - yearOneSpend,
      primaryLine: "Month 1 free",
      secondaryLine: `Your regular rate starts at ${formatInr(
        basePricing.monthlyPrice,
      )}/month after the free month.`,
    };
  }

  return null;
}

function buildEffectivePricing(basePricing, couponEffect) {
  if (!couponEffect || couponEffect.status !== "active") {
    return {
      immediateCharge: basePricing.immediateCharge,
      recurringCharge: basePricing.recurringCharge,
      recurringLabel: basePricing.recurringLabel,
      yearOneSpend: basePricing.yearOneSpend,
      savings:
        basePricing.billingMode === BILLING_MODE_YEARLY ? basePricing.yearlySavings : 0,
    };
  }

  return {
    immediateCharge: couponEffect.immediateCharge,
    recurringCharge: couponEffect.recurringCharge,
    recurringLabel: couponEffect.recurringLabel,
    yearOneSpend: couponEffect.yearOneSpend,
    savings: couponEffect.savings,
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

export function getCouponBanner(coupon, billingMode) {
  if (!coupon) {
    return {
      tone: "neutral",
      title: "No coupon applied",
      detail:
        "Use FIRST3 for 20% off the first 3 months or TRYONCE for 1 free month.",
    };
  }

  if (billingMode !== coupon.appliesTo) {
    return {
      tone: "muted",
      title: `${coupon.code} saved for monthly billing`,
      detail: coupon.description,
    };
  }

  return {
    tone: "accent",
    title: `${coupon.code} applied`,
    detail: coupon.description,
  };
}

export function getPlanPricing(plan, billingMode, coupon) {
  const base = buildBasePricing(plan, billingMode);
  const couponEffect = buildCouponEffect(base, coupon, billingMode);
  const effective = buildEffectivePricing(base, couponEffect);

  return {
    ...plan,
    base,
    coupon: couponEffect,
    effective,
  };
}

export function getPlanSnapshot(planPricing) {
  const { base, coupon, effective } = planPricing;

  if (base.billingMode === BILLING_MODE_YEARLY) {
    return {
      todayLabel: "Today",
      todayValue: formatInr(effective.immediateCharge),
      recurringLabel: "Renews",
      recurringValue: formatInr(effective.recurringCharge),
      yearOneLabel: "Year-one spend",
      yearOneValue: formatInr(effective.yearOneSpend),
      note: `${formatInr(base.monthlyEquivalent)}/month effective. Save ${formatInr(
        base.yearlySavings,
      )} a year.`,
    };
  }

  if (coupon?.status === "active" && coupon.code === "FIRST3") {
    return {
      todayLabel: "Months 1-3",
      todayValue: `${formatInr(coupon.promoPrice)}/month`,
      recurringLabel: "Month 4 onward",
      recurringValue: `${formatInr(coupon.recurringCharge)}/month`,
      yearOneLabel: "Year-one spend",
      yearOneValue: formatInr(coupon.yearOneSpend),
      note: `Promo savings: ${formatInr(coupon.savings)} across the first year.`,
    };
  }

  if (coupon?.status === "active" && coupon.code === "TRYONCE") {
    return {
      todayLabel: "Month 1",
      todayValue: "Free",
      recurringLabel: "Month 2 onward",
      recurringValue: `${formatInr(coupon.recurringCharge)}/month`,
      yearOneLabel: "Year-one spend",
      yearOneValue: formatInr(coupon.yearOneSpend),
      note: `One free month saves ${formatInr(coupon.savings)} in year one.`,
    };
  }

  return {
    todayLabel: "Today",
    todayValue: `${formatInr(effective.immediateCharge)}/month`,
    recurringLabel: "Renews",
    recurringValue: `${formatInr(effective.recurringCharge)}/month`,
    yearOneLabel: "Year-one spend",
    yearOneValue: formatInr(effective.yearOneSpend),
    note: "Standard monthly pricing with no promotional discount applied.",
  };
}

export function getPlanSummaryRows(planPricing) {
  const { base, coupon, effective } = planPricing;

  if (base.billingMode === BILLING_MODE_YEARLY) {
    return [
      {
        label: "Annual invoice",
        value: formatInr(effective.immediateCharge),
        detail: "Billed upfront for the full year.",
      },
      {
        label: "Effective monthly rate",
        value: `${formatInr(base.monthlyEquivalent)}/month`,
        detail: "How the yearly plan averages out month to month.",
      },
      {
        label: "Annual savings",
        value: formatInr(base.yearlySavings),
        detail: "Compared with staying on monthly billing for 12 months.",
      },
      {
        label: "Coupon status",
        value: coupon?.status === "inactive" ? "Monthly only" : "Not needed",
        detail:
          coupon?.status === "inactive"
            ? coupon.note
            : "Yearly pricing already includes the built-in savings.",
      },
    ];
  }

  if (coupon?.status === "active" && coupon.code === "FIRST3") {
    return [
      {
        label: "Months 1-3",
        value: `${formatInr(coupon.promoPrice)}/month`,
        detail: "Discounted introductory rate.",
      },
      {
        label: "Month 4 onward",
        value: `${formatInr(coupon.recurringCharge)}/month`,
        detail: "Regular monthly price after the first 3 cycles.",
      },
      {
        label: "Year-one spend",
        value: formatInr(coupon.yearOneSpend),
        detail: "Total projected spend across the first 12 months.",
      },
      {
        label: "Promo savings",
        value: formatInr(coupon.savings),
        detail: "Saved across the first 3 months with FIRST3.",
      },
    ];
  }

  if (coupon?.status === "active" && coupon.code === "TRYONCE") {
    return [
      {
        label: "Month 1",
        value: "Free",
        detail: "No invoice for the first month.",
      },
      {
        label: "Month 2 onward",
        value: `${formatInr(coupon.recurringCharge)}/month`,
        detail: "Regular monthly price begins after the free month.",
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
      label: "Today",
      value: `${formatInr(effective.immediateCharge)}/month`,
      detail: "Your first monthly invoice.",
    },
    {
      label: "Recurring",
      value: `${formatInr(effective.recurringCharge)}/month`,
      detail: "Standard monthly renewal rate.",
    },
    {
      label: "Year-one spend",
      value: formatInr(effective.yearOneSpend),
      detail: "Projected total across 12 monthly billing cycles.",
    },
    {
      label: "Upgrade path",
      value: formatInr(base.yearlySavings),
      detail: "Available annual savings if you switch to yearly billing.",
    },
  ];
}
