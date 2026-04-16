const configuratorCategoriesList = [
  {
    id: "branding",
    title: "Branding",
    description: "Identity direction, visual language, and foundational brand assets.",
  },
  {
    id: "website",
    title: "Website",
    description: "Responsive web surfaces shaped around offers, content, and conversion flow.",
  },
  {
    id: "ordering",
    title: "Ordering",
    description: "Commerce and operational handoff systems for digital ordering flows.",
  },
  {
    id: "customer-capture",
    title: "Customer Capture",
    description: "Lead collection, routing, and inquiry entry points across the build.",
  },
];

const categoryById = new Map(
  configuratorCategoriesList.map((category) => [category.id, category]),
);

function cloneTimelineDays(timelineDays = {}) {
  return {
    maximum: timelineDays.maximum ?? 0,
    minimum: timelineDays.minimum ?? 0,
  };
}

function buildModule(definition) {
  const resolvedCategory = categoryById.get(definition.categoryId);
  const baseTimelineDays = cloneTimelineDays(definition.baseTimelineDays);

  return {
    addOns: definition.addOns ?? [],
    basePrice: definition.basePrice,
    baseTimelineDays,
    category: resolvedCategory?.title ?? definition.categoryId,
    categoryDescription: resolvedCategory?.description ?? "",
    categoryId: definition.categoryId,
    deliverables: definition.deliverables ?? [],
    description: definition.description,
    id: definition.id,
    metadata: definition.metadata ?? {},
    options: definition.options ?? [],
    tags: definition.tags ?? [],
    timelineDays: baseTimelineDays,
    title: definition.title,
  };
}

function buildPackage(definition) {
  return {
    ctaLabel: definition.ctaLabel,
    description: definition.description,
    features: definition.features ?? [],
    id: definition.id,
    includedModuleIds: definition.includedModuleIds ?? [],
    isMostPopular: definition.isMostPopular ?? false,
    metadata: definition.metadata ?? {},
    name: definition.name,
    options: definition.options ?? [],
    audience: definition.audience,
    pricing: definition.pricing,
    timelineEstimate: definition.timelineEstimate,
  };
}

export const configuratorCategories = configuratorCategoriesList;

export const configuratorModules = [
  buildModule({
    id: "branding",
    title: "Branding",
    categoryId: "branding",
    description: "Identity direction, visual language, and core brand assets.",
    basePrice: 12000,
    baseTimelineDays: {
      minimum: 3,
      maximum: 5,
    },
    tags: ["Identity", "Visual Language"],
    deliverables: [
      "Identity direction",
      "Visual language system",
      "Core brand assets",
    ],
  }),
  buildModule({
    id: "website",
    title: "Website",
    categoryId: "website",
    description: "Responsive website setup shaped around your offer and content flow.",
    basePrice: 18000,
    baseTimelineDays: {
      minimum: 6,
      maximum: 9,
    },
    tags: ["Responsive", "Conversion"],
    deliverables: [
      "Responsive page structure",
      "Content flow setup",
      "Conversion-focused web surface",
    ],
  }),
  buildModule({
    id: "ordering-system",
    title: "Ordering System",
    categoryId: "ordering",
    description: "Digital ordering structure with operational handoff points in place.",
    basePrice: 26000,
    baseTimelineDays: {
      minimum: 8,
      maximum: 12,
    },
    tags: ["Commerce", "Operations"],
    deliverables: [
      "Ordering flow structure",
      "Operational handoff points",
      "Commerce system baseline",
    ],
  }),
  buildModule({
    id: "customer-capture",
    title: "Customer Capture",
    categoryId: "customer-capture",
    description: "Lead capture, WhatsApp routing, and inquiry collection entry points.",
    basePrice: 9000,
    baseTimelineDays: {
      minimum: 2,
      maximum: 4,
    },
    tags: ["Lead Intake", "Routing"],
    deliverables: [
      "Lead capture entry points",
      "WhatsApp routing",
      "Inquiry collection setup",
    ],
  }),
];

export const configuratorPackages = [
  buildPackage({
    id: "starter",
    name: "Starter",
    audience: "Local businesses",
    description:
      "A polished digital foundation for service brands that need credibility, faster inquiries, and a premium first impression.",
    pricing: {
      monthly: 18000,
      yearly: 180000,
    },
    includedModuleIds: ["branding", "website", "customer-capture"],
    timelineEstimate: {
      label: "Estimated delivery: 3-4 weeks",
      maximumDays: 28,
      minimumDays: 21,
    },
    features: [
      "Conversion-focused structure for local lead generation",
      "Responsive visual design tuned for mobile-first browsing",
      "Lead forms, WhatsApp handoff, and contact setup",
      "Basic SEO, analytics, and launch performance checks",
      "Two structured revision rounds for a sharper finish",
    ],
    ctaLabel: "Start with Starter",
  }),
  buildPackage({
    id: "growth",
    name: "Growth",
    audience: "Growing brands and startups",
    description:
      "A stronger multi-page system built for brands that are validating offers, running campaigns, and scaling with more intention.",
    pricing: {
      monthly: 33000,
      yearly: 330000,
    },
    includedModuleIds: ["branding", "website", "customer-capture"],
    timelineEstimate: {
      label: "Estimated delivery: 4-6 weeks",
      maximumDays: 42,
      minimumDays: 28,
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
  }),
  buildPackage({
    id: "premium",
    name: "Premium",
    audience: "Custom product and flagship builds",
    description:
      "High-touch custom execution for ambitious launches, complex user journeys, and premium digital products that need senior direction.",
    pricing: {
      monthly: 72000,
      yearly: 720000,
    },
    includedModuleIds: [
      "branding",
      "website",
      "ordering-system",
      "customer-capture",
    ],
    timelineEstimate: {
      label: "Estimated delivery: 6-8 weeks",
      maximumDays: 56,
      minimumDays: 42,
    },
    features: [
      "Custom UX, product, or premium brand experience planning",
      "Advanced interactions, platform flows, and integration-ready architecture",
      "Design system thinking for scalable implementation consistency",
      "Performance, accessibility, and quality review baked into delivery",
      "Dedicated sprint planning for deeper collaboration and scope flexibility",
    ],
    ctaLabel: "Request Custom Scope",
  }),
];

const moduleById = new Map(
  configuratorModules.map((module) => [module.id, module]),
);

const packageById = new Map(
  configuratorPackages.map((packageConfig) => [packageConfig.id, packageConfig]),
);

function getUniqueIds(ids = []) {
  return [...new Set(ids.filter(Boolean))];
}

export function getConfiguratorCategory(categoryId) {
  return categoryById.get(categoryId) ?? null;
}

export function getConfiguratorModule(moduleId) {
  return moduleById.get(moduleId) ?? null;
}

export function getConfiguratorModules(moduleIds = []) {
  return getUniqueIds(moduleIds)
    .map((moduleId) => getConfiguratorModule(moduleId))
    .filter(Boolean);
}

export function getConfiguratorPackage(packageId) {
  return packageById.get(packageId) ?? null;
}

export function getPackageIncludedModules(packageOrId) {
  const packageConfig =
    typeof packageOrId === "string"
      ? getConfiguratorPackage(packageOrId)
      : packageOrId;

  if (!packageConfig) {
    return [];
  }

  return getConfiguratorModules(packageConfig.includedModuleIds);
}

export function groupModulesByCategory(modules = []) {
  const groupedModules = new Map();

  modules.forEach((module) => {
    if (!groupedModules.has(module.categoryId)) {
      groupedModules.set(module.categoryId, []);
    }

    groupedModules.get(module.categoryId).push(module);
  });

  return configuratorCategories
    .map((category) => {
      const items = groupedModules.get(category.id) ?? [];

      if (!items.length) {
        return null;
      }

      return {
        ...category,
        modules: items,
      };
    })
    .filter(Boolean);
}

export function sumTimelineRanges(
  entries = [],
  getTimeline = (entry) => entry?.baseTimelineDays ?? entry?.timelineDays,
) {
  return entries.reduce(
    (runningTotal, entry) => {
      const timeline = getTimeline(entry);

      return {
        maximum: runningTotal.maximum + (timeline?.maximum ?? 0),
        minimum: runningTotal.minimum + (timeline?.minimum ?? 0),
      };
    },
    { maximum: 0, minimum: 0 },
  );
}

export function formatTimelineRange(range, emptyValue = "Timeline updates as you build") {
  if (!range?.minimum || !range?.maximum) {
    return emptyValue;
  }

  if (range.minimum === range.maximum) {
    return `${range.minimum} day${range.minimum === 1 ? "" : "s"}`;
  }

  return `${range.minimum}-${range.maximum} days`;
}
