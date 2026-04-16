function formatWorkingDayRange(minimum = 0, maximum = 0) {
  if (!minimum || !maximum) {
    return "Timeline logged per build";
  }

  if (minimum === maximum) {
    return `${minimum} working day${minimum === 1 ? "" : "s"}`;
  }

  return `${minimum}-${maximum} working days`;
}

function getTimelineBounds(studies = []) {
  return studies.reduce(
    (runningTotal, study) => ({
      maximum: Math.max(runningTotal.maximum, study.timelineDays?.maximum ?? 0),
      minimum:
        runningTotal.minimum === 0
          ? study.timelineDays?.minimum ?? 0
          : Math.min(runningTotal.minimum, study.timelineDays?.minimum ?? 0),
    }),
    {
      maximum: 0,
      minimum: 0,
    },
  );
}

export const caseStudies = [
  {
    id: "CS-01",
    title: "Maple Street Cafe",
    businessType: "Neighborhood cafe / pickup-heavy service",
    summary:
      "Configured for a 42-seat cafe that was juggling lunch orders across Instagram DMs, phone calls, and handwritten counter notes.",
    configuredFor:
      "Restaurant with a daily lunch rush, seasonal menu changes, pickup windows, and staff-led order confirmation.",
    scopeSummary: "Website + menu design + ordering handoff",
    buildSummary:
      "Built a six-page website, a mobile menu for 46 items, a pickup-first ordering flow, payment-link handoff, and WhatsApp confirmation routing.",
    modulesUsed: ["Branding", "Website", "Ordering System", "Customer Capture"],
    configuredDetails: [
      "Menu design",
      "6-10 page website",
      "WhatsApp integration",
      "Payment link handoff",
    ],
    deliverables: [
      "6-page responsive website",
      "Menu and cart surfaces",
      "Pickup window selector",
      "WhatsApp confirmation handoff",
    ],
    timeline: "Delivered in 8 working days",
    timelineDays: {
      minimum: 8,
      maximum: 8,
    },
    outcome:
      "Weekend intake moved into one queue before service, and staff stopped rebuilding orders from DMs and phone notes.",
    visual: {
      surfaceLabel: "Ordering output",
      status: "Live build",
      primary: {
        viewport: "Desktop / menu",
        title: "Lunch pickup ordering",
        chips: ["Pickup active", "46 menu items", "Pay by link"],
        rows: [
          {
            label: "Masala omelette toast",
            meta: "INR 320",
            detail: "Breakfast / 12-15 min",
          },
          {
            label: "Cold brew concentrate",
            meta: "INR 180",
            detail: "Beverage / same-day",
          },
          {
            label: "Roasted paneer bowl",
            meta: "INR 410",
            detail: "Lunch / 18-20 min",
          },
        ],
        summaryLabel: "Configured surface",
        summaryValue:
          "Pickup windows, cart totals, and payment-link handoff stay visible in one customer flow.",
      },
      secondary: {
        viewport: "Mobile / confirmation",
        title: "Order confirmation",
        rows: [
          {
            label: "Order",
            value: "#184 confirmed",
          },
          {
            label: "Pickup",
            value: "1:45 PM",
          },
          {
            label: "Handoff",
            value: "WhatsApp sent",
          },
        ],
        actionLabel: "Kitchen queue updated",
      },
      metrics: [
        {
          label: "Menu items mapped",
          value: "46",
        },
        {
          label: "First 14 days",
          value: "118 orders",
        },
        {
          label: "Avg confirmation",
          value: "3 min",
        },
      ],
    },
  },
  {
    id: "CS-02",
    title: "Northside Dental",
    businessType: "Local dental clinic / new-patient intake",
    summary:
      "Configured for a two-chair clinic that needed treatment-specific requests instead of generic contact messages.",
    configuredFor:
      "Clinic intake with treatment selection, preferred slot capture, and phone follow-up routed to front-desk staff.",
    scopeSummary: "Service website + intake routing",
    buildSummary:
      "Built an eight-page website, treatment pages, a new-patient intake flow, callback routing, and a clearer mobile-first service menu.",
    modulesUsed: ["Branding", "Website", "Customer Capture"],
    configuredDetails: [
      "6-10 page website",
      "Booking or contact form",
      "Inquiry routing",
    ],
    deliverables: [
      "8-page responsive website",
      "Treatment overview sections",
      "New-patient intake form",
      "Callback routing summary",
    ],
    timeline: "Delivered in 6 working days",
    timelineDays: {
      minimum: 6,
      maximum: 6,
    },
    outcome:
      "Requests started arriving with treatment type, preferred slot, and insurance note, which reduced manual follow-up before confirmation calls.",
    visual: {
      surfaceLabel: "Intake output",
      status: "Live build",
      primary: {
        viewport: "Desktop / service flow",
        title: "Treatment request intake",
        chips: ["New patients", "Call-back routing", "Mobile first"],
        rows: [
          {
            label: "Cleaning + exam",
            meta: "Routine care",
            detail: "Preferred mornings",
          },
          {
            label: "Root canal consult",
            meta: "Specialist review",
            detail: "Insurance note captured",
          },
          {
            label: "Pediatric visit",
            meta: "Family intake",
            detail: "Guardian phone verified",
          },
        ],
        summaryLabel: "Configured surface",
        summaryValue:
          "Treatment-specific forms, callback routing, and service navigation sit inside one clinic-facing structure.",
      },
      secondary: {
        viewport: "Mobile / request",
        title: "Patient request",
        rows: [
          {
            label: "Treatment",
            value: "Cleaning + exam",
          },
          {
            label: "Preferred slot",
            value: "Tue / 11:30 AM",
          },
          {
            label: "Insurance",
            value: "Noted",
          },
        ],
        actionLabel: "Front desk notified",
      },
      metrics: [
        {
          label: "Service pages",
          value: "8",
        },
        {
          label: "30-day intake",
          value: "52 forms",
        },
        {
          label: "Follow-up saved",
          value: "1 step",
        },
      ],
    },
  },
  {
    id: "CS-03",
    title: "Cedar Studio",
    businessType: "Interior styling studio / quote-led service",
    summary:
      "Configured for a small studio moving from a single-page site and manual chat qualification into a clearer inquiry system.",
    configuredFor:
      "Service business that needed a cleaner brand layer, a focused website, and inquiry capture before discovery calls.",
    scopeSummary: "Brand refresh + service website + quote intake",
    buildSummary:
      "Built a five-page service website, an identity cleanup, gallery blocks, a quote intake form, and launch social assets for repeatable rollout.",
    modulesUsed: ["Branding", "Website", "Customer Capture"],
    configuredDetails: [
      "Up to 5 pages",
      "Booking or contact form",
      "Social kit",
    ],
    deliverables: [
      "5-page responsive website",
      "Lead qualification form",
      "Core brand refresh",
      "Launch social kit",
    ],
    timeline: "Delivered in 5 working days",
    timelineDays: {
      minimum: 5,
      maximum: 5,
    },
    outcome:
      "The studio started receiving inquiries with room type, budget range, and location before the first call, so screening moved out of chat.",
    visual: {
      surfaceLabel: "Service output",
      status: "Live build",
      primary: {
        viewport: "Desktop / services",
        title: "Quote-first website flow",
        chips: ["5 pages", "Quote intake", "Launch assets"],
        rows: [
          {
            label: "Room styling package",
            meta: "Design service",
            detail: "Timeline + budget visible",
          },
          {
            label: "Renovation consult",
            meta: "Advisory",
            detail: "Scope notes collected",
          },
          {
            label: "Gallery intake",
            meta: "Proof blocks",
            detail: "Before / after structure",
          },
        ],
        summaryLabel: "Configured surface",
        summaryValue:
          "Service hierarchy, proof sections, and quote intake stay aligned with the refreshed brand layer.",
      },
      secondary: {
        viewport: "Mobile / lead intake",
        title: "Inquiry summary",
        rows: [
          {
            label: "Room type",
            value: "Living room",
          },
          {
            label: "Budget range",
            value: "INR 1.5L-2L",
          },
          {
            label: "Location",
            value: "South Delhi",
          },
        ],
        actionLabel: "Lead routed to quote review",
      },
      metrics: [
        {
          label: "Inquiry fields",
          value: "7",
        },
        {
          label: "Launch assets",
          value: "12",
        },
        {
          label: "Lead fit",
          value: "Pre-qualified",
        },
      ],
    },
  },
  {
    id: "CS-04",
    title: "Field Supply Co.",
    businessType: "Single-product retail / weekly inventory drops",
    summary:
      "Configured for a small retail brand running limited weekly restocks and needing a clearer order handoff than DMs and manual payment reminders.",
    configuredFor:
      "Product drop workflow with timed stock releases, direct checkout, and post-order updates pushed into one repeatable system.",
    scopeSummary: "Landing flow + checkout + order updates",
    buildSummary:
      "Built a product landing system, integrated checkout, order status messaging, and a support capture layer for post-purchase exceptions.",
    modulesUsed: ["Branding", "Website", "Ordering System", "Customer Capture"],
    configuredDetails: [
      "6-10 page website",
      "Integrated checkout",
      "WhatsApp integration",
    ],
    deliverables: [
      "Product landing system",
      "Integrated checkout flow",
      "Order status message templates",
      "Support capture form",
    ],
    timeline: "Delivered in 9 working days",
    timelineDays: {
      minimum: 9,
      maximum: 9,
    },
    outcome:
      "Each restock now uses the same page and checkout structure, and manual order verification only happens on exceptions.",
    visual: {
      surfaceLabel: "Checkout output",
      status: "Live build",
      primary: {
        viewport: "Desktop / product drop",
        title: "Single-product release flow",
        chips: ["Integrated checkout", "Stock window", "Support capture"],
        rows: [
          {
            label: "Release banner",
            meta: "Friday / 7 PM",
            detail: "Stock timer visible",
          },
          {
            label: "Product module",
            meta: "Core SKU",
            detail: "Variant + quantity controls",
          },
          {
            label: "Checkout status",
            meta: "Card payment",
            detail: "Confirmation auto-sent",
          },
        ],
        summaryLabel: "Configured surface",
        summaryValue:
          "Drop timing, checkout, and support routing stay reusable from one release to the next.",
      },
      secondary: {
        viewport: "Mobile / order status",
        title: "Purchase confirmation",
        rows: [
          {
            label: "Order",
            value: "#FS-208",
          },
          {
            label: "Status",
            value: "Paid",
          },
          {
            label: "Dispatch",
            value: "Queued",
          },
        ],
        actionLabel: "Customer update sent",
      },
      metrics: [
        {
          label: "Restock cadence",
          value: "Weekly",
        },
        {
          label: "Checkout steps",
          value: "3",
        },
        {
          label: "Exception handling",
          value: "Manual only",
        },
      ],
    },
  },
];

export function getCaseStudyOverview(studies = caseStudies) {
  const moduleCount = new Set(
    studies.flatMap((study) => study.modulesUsed),
  ).size;
  const totalDeliverables = studies.reduce(
    (runningTotal, study) => runningTotal + study.deliverables.length,
    0,
  );
  const timelineBounds = getTimelineBounds(studies);

  return [
    {
      label: "Documented builds",
      value: `${studies.length}`,
      detail: "Each record includes scope, modules, timeline, and outcome.",
    },
    {
      label: "Module lanes used",
      value: `${moduleCount}`,
      detail: "The same module vocabulary used in the live configurator.",
    },
    {
      label: "Delivery window",
      value: formatWorkingDayRange(
        timelineBounds.minimum,
        timelineBounds.maximum,
      ),
      detail: `${totalDeliverables} deliverables logged across the current set.`,
    },
  ];
}
