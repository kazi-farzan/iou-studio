const OPTION_TYPE_BOOLEAN = "boolean";
const OPTION_TYPE_SINGLE_CHOICE = "single-choice";
const OPTION_TYPE_SELECT = "select";
const DEFAULT_DELIVERABLE_SECTION_ID = "outputs";

const DELIVERABLE_SECTION_LABELS = {
  outputs: "Outputs",
  pages: "Pages included",
  integrations: "Integrations included",
  assets: "Assets included",
  modules: "Modules included",
  addOns: "Add-ons selected",
};

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

function getUniqueStringValues(values = []) {
  return [...new Set(
    values
      .map((value) => (typeof value === "string" ? value.trim() : ""))
      .filter(Boolean),
  )];
}

function buildDeliverableSection(section, index = 0) {
  if (typeof section === "string") {
    const item = section.trim();

    if (!item) {
      return null;
    }

    return {
      id: `${DEFAULT_DELIVERABLE_SECTION_ID}-${index}`,
      key: DEFAULT_DELIVERABLE_SECTION_ID,
      label: DELIVERABLE_SECTION_LABELS[DEFAULT_DELIVERABLE_SECTION_ID],
      items: [item],
    };
  }

  if (!section) {
    return null;
  }

  const key =
    section.key ?? section.id ?? `${DEFAULT_DELIVERABLE_SECTION_ID}-${index}`;
  const items = getUniqueStringValues(section.items ?? []);

  if (!items.length) {
    return null;
  }

  return {
    id: section.id ?? key,
    key,
    label:
      section.label ??
      DELIVERABLE_SECTION_LABELS[key] ??
      DELIVERABLE_SECTION_LABELS[DEFAULT_DELIVERABLE_SECTION_ID],
    items,
  };
}

export function mergeDeliverableSections(...sectionCollections) {
  const mergedSections = new Map();
  const orderedSections = [];

  sectionCollections
    .flat()
    .filter(Boolean)
    .forEach((section, index) => {
      const normalizedSection = buildDeliverableSection(section, index);

      if (!normalizedSection) {
        return;
      }

      const sectionKey =
        normalizedSection.key ??
        normalizedSection.id ??
        normalizedSection.label ??
        `${DEFAULT_DELIVERABLE_SECTION_ID}-${index}`;

      if (!mergedSections.has(sectionKey)) {
        const nextSection = {
          id: normalizedSection.id ?? sectionKey,
          key: sectionKey,
          label:
            normalizedSection.label ??
            DELIVERABLE_SECTION_LABELS[sectionKey] ??
            DELIVERABLE_SECTION_LABELS[DEFAULT_DELIVERABLE_SECTION_ID],
          items: [],
        };

        mergedSections.set(sectionKey, nextSection);
        orderedSections.push(nextSection);
      }

      const targetSection = mergedSections.get(sectionKey);

      normalizedSection.items.forEach((item) => {
        if (!targetSection.items.includes(item)) {
          targetSection.items.push(item);
        }
      });
    });

  return orderedSections.filter((section) => section.items.length);
}

export function flattenDeliverableSections(sections = []) {
  return getUniqueStringValues(
    mergeDeliverableSections(sections).flatMap((section) => section.items),
  );
}

export function formatDeliverableSummary(
  sections = [],
  limit = 3,
  emptyValue = "",
) {
  const deliverableItems = flattenDeliverableSections(sections);

  if (!deliverableItems.length) {
    return emptyValue;
  }

  return deliverableItems.slice(0, limit).join(" / ");
}

function buildDeliverableCollection(definition) {
  const sourceSections = Array.isArray(definition)
    ? definition
    : definition?.sections ?? [];
  const sections = mergeDeliverableSections(sourceSections);

  return {
    items: flattenDeliverableSections(sections),
    sections,
    summary: formatDeliverableSummary(sections),
  };
}

function resolveDeliverableSelection(...sectionCollections) {
  const sections = mergeDeliverableSections(...sectionCollections);

  return {
    items: flattenDeliverableSections(sections),
    sections,
    summary: formatDeliverableSummary(sections),
  };
}

function hasTimelineImpact(timelineDays = {}) {
  return Boolean(timelineDays.minimum || timelineDays.maximum);
}

function buildOptionChoice(definition) {
  const deliverables = buildDeliverableCollection(definition.deliverables);

  return {
    deliverableSections: deliverables.sections,
    deliverableSummary: deliverables.summary,
    deliverables: deliverables.items,
    description: definition.description ?? "",
    id: definition.id,
    label: definition.label,
    priceImpact: definition.priceImpact ?? 0,
    timelineImpact: cloneTimelineDays(definition.timelineImpact),
  };
}

function buildModuleOption(definition) {
  const optionDeliverables = buildDeliverableCollection(definition.deliverables);

  if (definition.type === OPTION_TYPE_BOOLEAN) {
    return {
      defaultValue: Boolean(definition.defaultValue),
      deliverableSections: optionDeliverables.sections,
      deliverableSummary: optionDeliverables.summary,
      deliverables: optionDeliverables.items,
      description: definition.description ?? "",
      display: "checkbox",
      id: definition.id,
      label: definition.label,
      priceImpact: definition.priceImpact ?? 0,
      timelineImpact: cloneTimelineDays(definition.timelineImpact),
      type: definition.type,
    };
  }

  const choices = (definition.choices ?? []).map(buildOptionChoice);
  const hasDefaultChoice = choices.some(
    (choice) => choice.id === definition.defaultValue,
  );

  return {
    choices,
    defaultValue: hasDefaultChoice ? definition.defaultValue : choices[0]?.id ?? null,
    deliverableSections: optionDeliverables.sections,
    deliverableSummary: optionDeliverables.summary,
    deliverables: optionDeliverables.items,
    description: definition.description ?? "",
    display:
      definition.display ??
      (definition.type === OPTION_TYPE_SELECT ? "select" : "radio"),
    id: definition.id,
    label: definition.label,
    type: definition.type,
  };
}

function buildModule(definition) {
  const resolvedCategory = categoryById.get(definition.categoryId);
  const baseTimelineDays = cloneTimelineDays(definition.baseTimelineDays);
  const baseDeliverables = buildDeliverableCollection(
    definition.baseDeliverables ?? definition.deliverables,
  );

  return {
    addOns: definition.addOns ?? [],
    baseDeliverableSections: baseDeliverables.sections,
    baseDeliverableSummary: baseDeliverables.summary,
    baseDeliverables: baseDeliverables.items,
    basePrice: definition.basePrice,
    baseTimelineDays,
    category: resolvedCategory?.title ?? definition.categoryId,
    categoryDescription: resolvedCategory?.description ?? "",
    categoryId: definition.categoryId,
    deliverableSections: baseDeliverables.sections,
    deliverableSummary: baseDeliverables.summary,
    deliverables: baseDeliverables.items,
    description: definition.description,
    id: definition.id,
    metadata: definition.metadata ?? {},
    options: (definition.options ?? []).map(buildModuleOption),
    tags: definition.tags ?? [],
    timelineDays: baseTimelineDays,
    title: definition.title,
  };
}

function buildPackage(definition) {
  const packageDeliverables = buildDeliverableCollection(
    definition.packageDeliverables ?? definition.deliverables,
  );

  return {
    audience: definition.audience,
    ctaLabel: definition.ctaLabel,
    description: definition.description,
    features: definition.features ?? [],
    id: definition.id,
    includedModuleIds: definition.includedModuleIds ?? [],
    isMostPopular: definition.isMostPopular ?? false,
    metadata: definition.metadata ?? {},
    name: definition.name,
    options: definition.options ?? [],
    packageDeliverableSections: packageDeliverables.sections,
    packageDeliverableSummary: packageDeliverables.summary,
    packageDeliverables: packageDeliverables.items,
    pricing: definition.pricing,
    timelineEstimate: definition.timelineEstimate,
  };
}

function getConfiguredOptionChoice(option, value) {
  return option.choices?.find((choice) => choice.id === value) ?? null;
}

function getOptionSelectionDeliverables(option) {
  if (option.type === OPTION_TYPE_BOOLEAN) {
    if (!option.value) {
      return resolveDeliverableSelection();
    }

    return resolveDeliverableSelection(option.deliverableSections);
  }

  return resolveDeliverableSelection(
    option.deliverableSections,
    option.selectedChoice?.deliverableSections ?? [],
  );
}

function buildBooleanSelection(option) {
  if (!option.value) {
    return {
      activeSelection: null,
      selection: null,
    };
  }

  const selectedDeliverables = getOptionSelectionDeliverables(option);
  const selection = {
    deliverableSections: selectedDeliverables.sections,
    deliverableSummary: selectedDeliverables.summary,
    deliverables: selectedDeliverables.items,
    description: option.description,
    groupLabel: option.label,
    id: `${option.id}:enabled`,
    isDefault: option.value === Boolean(option.defaultValue),
    label: option.label,
    optionId: option.id,
    priceImpact: option.priceImpact,
    summaryLabel: option.label,
    timelineImpact: cloneTimelineDays(option.timelineImpact),
    type: option.type,
    value: true,
    valueLabel: "Included",
  };
  const isActive =
    !selection.isDefault ||
    selection.priceImpact > 0 ||
    hasTimelineImpact(selection.timelineImpact);

  return {
    activeSelection: isActive ? selection : null,
    selection,
  };
}

function buildChoiceSelection(option) {
  if (!option.selectedChoice) {
    return {
      activeSelection: null,
      selection: null,
    };
  }

  const selectedDeliverables = getOptionSelectionDeliverables(option);
  const selection = {
    deliverableSections: selectedDeliverables.sections,
    deliverableSummary: selectedDeliverables.summary,
    deliverables: selectedDeliverables.items,
    description: option.selectedChoice.description || option.description,
    groupLabel: option.label,
    id: `${option.id}:${option.selectedChoice.id}`,
    isDefault: option.selectedChoice.id === option.defaultValue,
    label: `${option.label}: ${option.selectedChoice.label}`,
    optionId: option.id,
    priceImpact: option.selectedChoice.priceImpact,
    summaryLabel: `${option.label}: ${option.selectedChoice.label}`,
    timelineImpact: cloneTimelineDays(option.selectedChoice.timelineImpact),
    type: option.type,
    value: option.selectedChoice.id,
    valueLabel: option.selectedChoice.label,
  };
  const isActive =
    !selection.isDefault ||
    selection.priceImpact > 0 ||
    hasTimelineImpact(selection.timelineImpact);

  return {
    activeSelection: isActive ? selection : null,
    selection,
  };
}

function buildResolvedModuleOption(option, rawValue) {
  const value = getResolvedModuleOptionValue(option, rawValue);

  if (option.type === OPTION_TYPE_BOOLEAN) {
    return {
      ...option,
      value,
    };
  }

  const selectedChoice =
    getConfiguredOptionChoice(option, value) ?? option.choices?.[0] ?? null;

  return {
    ...option,
    selectedChoice,
    value: selectedChoice?.id ?? null,
  };
}

function buildModuleSelections(options = []) {
  return options.reduce(
    (runningSelections, option) => {
      const { activeSelection, selection } =
        option.type === OPTION_TYPE_BOOLEAN
          ? buildBooleanSelection(option)
          : buildChoiceSelection(option);

      if (selection) {
        runningSelections.selectedOptions.push(selection);
      }

      if (activeSelection) {
        runningSelections.activeOptions.push(activeSelection);
      }

      return runningSelections;
    },
    {
      activeOptions: [],
      selectedOptions: [],
    },
  );
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
    baseDeliverables: {
      sections: [
        {
          key: "outputs",
          items: [
            "Visual identity system",
            "Brand direction aligned to the approved offer",
          ],
        },
        {
          key: "assets",
          items: [
            "Core logo lockup set",
            "Color and typography direction",
            "Brand-use foundation assets",
          ],
        },
      ],
    },
    options: [
      {
        id: "social-kit",
        label: "Social kit",
        type: OPTION_TYPE_BOOLEAN,
        description:
          "Launch-ready profile, story, and post assets aligned to the core identity.",
        priceImpact: 3500,
        timelineImpact: {
          minimum: 1,
          maximum: 2,
        },
        defaultValue: false,
        deliverables: {
          sections: [
            {
              key: "assets",
              items: [
                "Profile image set",
                "Story template set",
                "Post-ready social assets",
              ],
            },
          ],
        },
      },
      {
        id: "menu-design",
        label: "Menu design",
        type: OPTION_TYPE_BOOLEAN,
        description:
          "A service or product menu layout that fits the approved brand system.",
        priceImpact: 2500,
        timelineImpact: {
          minimum: 1,
          maximum: 1,
        },
        defaultValue: false,
        deliverables: {
          sections: [
            {
              key: "assets",
              items: [
                "Menu layout file",
                "Brand-aligned menu presentation asset",
              ],
            },
          ],
        },
      },
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
    baseDeliverables: {
      sections: [
        {
          key: "outputs",
          items: [
            "Mobile-responsive website",
            "Production-ready content structure",
          ],
        },
        {
          key: "pages",
          items: [
            "Core website page set tied to offer, proof, and contact flow",
          ],
        },
      ],
    },
    options: [
      {
        id: "page-count",
        label: "Page count",
        type: OPTION_TYPE_SINGLE_CHOICE,
        display: "radio",
        description: "Scale the website structure to match the amount of content and flow.",
        defaultValue: "core",
        choices: [
          {
            id: "core",
            label: "Up to 5 pages",
            description: "A focused site structure for the main offer, proof, and contact flow.",
            priceImpact: 0,
            timelineImpact: {
              minimum: 0,
              maximum: 0,
            },
            deliverables: {
              sections: [
                {
                  key: "pages",
                  items: ["Up to 5 production pages"],
                },
              ],
            },
          },
          {
            id: "expanded",
            label: "6-10 pages",
            description:
              "A broader information structure for services, campaigns, or deeper content.",
            priceImpact: 6000,
            timelineImpact: {
              minimum: 2,
              maximum: 3,
            },
            deliverables: {
              sections: [
                {
                  key: "pages",
                  items: ["6-10 production pages"],
                },
              ],
            },
          },
          {
            id: "extended",
            label: "11-16 pages",
            description:
              "A larger site map for layered offers, landing flows, or more complex content.",
            priceImpact: 12000,
            timelineImpact: {
              minimum: 4,
              maximum: 5,
            },
            deliverables: {
              sections: [
                {
                  key: "pages",
                  items: ["11-16 production pages"],
                },
              ],
            },
          },
        ],
      },
      {
        id: "contact-flow",
        label: "Booking or contact form",
        type: OPTION_TYPE_BOOLEAN,
        description:
          "A structured inquiry or booking form routed into the website conversion flow.",
        priceImpact: 4000,
        timelineImpact: {
          minimum: 1,
          maximum: 2,
        },
        defaultValue: false,
        deliverables: {
          sections: [
            {
              key: "outputs",
              items: ["Booking or contact form"],
            },
            {
              key: "integrations",
              items: ["Inquiry routing into the website intake flow"],
            },
          ],
        },
      },
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
    baseDeliverables: {
      sections: [
        {
          key: "outputs",
          items: [
            "QR or link-based ordering flow",
            "Operational order intake setup",
          ],
        },
        {
          key: "integrations",
          items: ["Order handoff structure for fulfillment follow-through"],
        },
      ],
    },
    options: [
      {
        id: "whatsapp-handoff",
        label: "WhatsApp integration",
        type: OPTION_TYPE_BOOLEAN,
        description:
          "Order confirmations and customer handoff connected into a WhatsApp touchpoint.",
        priceImpact: 3000,
        timelineImpact: {
          minimum: 1,
          maximum: 1,
        },
        defaultValue: false,
        deliverables: {
          sections: [
            {
              key: "integrations",
              items: ["WhatsApp order handoff"],
            },
          ],
        },
      },
      {
        id: "payment-integration",
        label: "Payment integration",
        type: OPTION_TYPE_SELECT,
        display: "select",
        description:
          "Choose how payments are handled inside or around the ordering experience.",
        defaultValue: "none",
        choices: [
          {
            id: "none",
            label: "No online payment",
            description: "Orders are placed first, then payment is handled manually afterward.",
            priceImpact: 0,
            timelineImpact: {
              minimum: 0,
              maximum: 0,
            },
            deliverables: {
              sections: [
                {
                  key: "integrations",
                  items: ["Manual payment handoff after order submission"],
                },
              ],
            },
          },
          {
            id: "payment-link",
            label: "Payment link handoff",
            description:
              "Customers receive a branded payment link after the order is submitted.",
            priceImpact: 5000,
            timelineImpact: {
              minimum: 1,
              maximum: 2,
            },
            deliverables: {
              sections: [
                {
                  key: "integrations",
                  items: ["Payment link handoff after order submission"],
                },
              ],
            },
          },
          {
            id: "integrated-checkout",
            label: "Integrated checkout",
            description:
              "Customers complete payment directly inside the ordering flow.",
            priceImpact: 9000,
            timelineImpact: {
              minimum: 2,
              maximum: 3,
            },
            deliverables: {
              sections: [
                {
                  key: "integrations",
                  items: ["Integrated checkout inside the ordering flow"],
                },
              ],
            },
          },
        ],
      },
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
    baseDeliverables: {
      sections: [
        {
          key: "outputs",
          items: ["Lead capture flow", "Inquiry collection setup"],
        },
        {
          key: "integrations",
          items: ["WhatsApp intake routing"],
        },
      ],
    },
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
    packageDeliverables: {
      sections: [
        {
          key: "outputs",
          items: [
            "Brand foundation across core digital touchpoints",
            "Responsive website with inquiry capture",
          ],
        },
        {
          key: "integrations",
          items: ["Contact and WhatsApp intake routing"],
        },
      ],
    },
    features: [
      "Core brand system and responsive website scope",
      "Lead capture routes tied to contact and WhatsApp intake",
      "Basic SEO, analytics, and launch checks",
      "Two revision rounds inside the agreed scope",
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
    packageDeliverables: {
      sections: [
        {
          key: "outputs",
          items: [
            "Expanded website system for services, campaigns, or proof content",
            "Brand and intake scope sized for a broader content structure",
          ],
        },
        {
          key: "pages",
          items: ["Multi-page implementation scope"],
        },
      ],
    },
    features: [
      "Broader page structure for services, campaigns, or updates",
      "CMS-ready content planning and conversion-focused layout scope",
      "Analytics events, SEO structure, and iteration support",
      "Monthly refinement room within the selected build direction",
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
    packageDeliverables: {
      sections: [
        {
          key: "outputs",
          items: [
            "Brand, website, ordering, and customer intake system",
            "Implementation-ready scope for deeper operational flows",
          ],
        },
        {
          key: "integrations",
          items: ["Ordering and intake handoff infrastructure"],
        },
      ],
    },
    features: [
      "Custom UX and system planning for more complex delivery scope",
      "Ordering flow and intake stack included in the starting configuration",
      "Integration-ready architecture and quality review inside delivery",
      "Sprint-based collaboration for higher-touch implementation decisions",
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

export function getConfiguredModules(
  moduleIds = [],
  optionSelectionsByModule = {},
) {
  return getConfiguratorModules(moduleIds)
    .map((module) =>
      getConfiguredModule(module, optionSelectionsByModule[module.id] ?? {}),
    )
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

export function getModuleOptionDefaultValue(option) {
  if (!option) {
    return null;
  }

  if (option.type === OPTION_TYPE_BOOLEAN) {
    return Boolean(option.defaultValue);
  }

  return option.defaultValue ?? option.choices?.[0]?.id ?? null;
}

export function getResolvedModuleOptionValue(option, rawValue) {
  const defaultValue = getModuleOptionDefaultValue(option);

  if (!option) {
    return null;
  }

  if (option.type === OPTION_TYPE_BOOLEAN) {
    return typeof rawValue === "boolean" ? rawValue : defaultValue;
  }

  return getConfiguredOptionChoice(option, rawValue)?.id ?? defaultValue;
}

export function getConfiguredModule(moduleOrId, optionSelections = {}) {
  const module =
    typeof moduleOrId === "string"
      ? getConfiguratorModule(moduleOrId)
      : moduleOrId;

  if (!module) {
    return null;
  }

  const resolvedOptions = module.options.map((option) =>
    buildResolvedModuleOption(option, optionSelections[option.id]),
  );
  const { activeOptions, selectedOptions } = buildModuleSelections(resolvedOptions);
  const optionTimelineDays = sumTimelineRanges(
    activeOptions,
    (entry) => entry.timelineImpact,
  );
  const configuredPrice =
    module.basePrice +
    activeOptions.reduce(
      (runningTotal, option) => runningTotal + (option.priceImpact ?? 0),
      0,
    );
  const configuredTimelineDays = {
    maximum: module.baseTimelineDays.maximum + optionTimelineDays.maximum,
    minimum: module.baseTimelineDays.minimum + optionTimelineDays.minimum,
  };
  const normalizedOptionSelections = resolvedOptions.reduce(
    (runningSelections, option) => {
      runningSelections[option.id] = option.value;
      return runningSelections;
    },
    {},
  );
  const selectedOptionDeliverables = selectedOptions
    .filter((option) => option.deliverableSections.length)
    .map((option) => ({
      id: option.id,
      label: option.summaryLabel,
      sections: option.deliverableSections,
      summary: option.deliverableSummary,
    }));
  const resolvedDeliverables = resolveDeliverableSelection(
    module.baseDeliverableSections,
    selectedOptionDeliverables.flatMap((option) => option.sections),
  );

  return {
    ...module,
    activeOptions,
    configuredPrice,
    configuredTimelineDays,
    deliverableSections: resolvedDeliverables.sections,
    deliverableSummary: resolvedDeliverables.summary,
    deliverables: resolvedDeliverables.items,
    hasActiveOptions: activeOptions.length > 0,
    optionSelections: normalizedOptionSelections,
    options: resolvedOptions,
    selectedOptionCount: activeOptions.length,
    selectedOptionDeliverables,
    selectedOptionSummary: selectedOptions
      .map((option) => option.summaryLabel)
      .join(" / "),
    selectedOptions,
    timelineDays: configuredTimelineDays,
  };
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

export function formatTimelineRange(
  range,
  emptyValue = "Timeline updates as you build",
) {
  if (!range?.minimum || !range?.maximum) {
    return emptyValue;
  }

  if (range.minimum === range.maximum) {
    return `${range.minimum} day${range.minimum === 1 ? "" : "s"}`;
  }

  return `${range.minimum}-${range.maximum} days`;
}
