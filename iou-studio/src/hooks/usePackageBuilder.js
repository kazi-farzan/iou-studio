import { useMemo, useState } from "react";

export const basePackages = [
  {
    id: "launch",
    name: "Launch",
    price: 2800,
    timeline: "Fast setup",
    description:
      "A premium starting point for brands that need a sharp digital presence without a long production cycle.",
  },
  {
    id: "growth",
    name: "Growth",
    price: 5600,
    timeline: "Balanced build",
    description:
      "A broader package for teams combining design, development, and stronger brand or campaign support.",
  },
  {
    id: "scale",
    name: "Scale",
    price: 9200,
    timeline: "Custom-ready",
    description:
      "A more flexible foundation for custom product work, layered creative systems, and deeper execution.",
  },
];

export const addOnFeatures = [
  {
    id: "brand-identity",
    name: "Brand Identity Pack",
    price: 950,
    description: "Logo direction, type pairing, and a cleaner visual identity system.",
  },
  {
    id: "ui-kit",
    name: "UI Design System",
    price: 1400,
    description: "Reusable interface patterns for a more consistent product or website build.",
  },
  {
    id: "social-content",
    name: "Social Content Kit",
    price: 780,
    description: "A ready-to-use content starter set for launch content and recurring posts.",
  },
  {
    id: "marketing-setup",
    name: "Marketing Setup",
    price: 1100,
    description: "Core messaging structure, content direction, and campaign planning support.",
  },
  {
    id: "seo-foundation",
    name: "SEO Foundation",
    price: 620,
    description: "Basic search setup to support visibility and cleaner page structure.",
  },
  {
    id: "analytics-dashboard",
    name: "Analytics Dashboard",
    price: 850,
    description: "Performance tracking setup for launches, campaigns, and ongoing optimization.",
  },
];

const currencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

export function formatPrice(value) {
  return currencyFormatter.format(value);
}

function buildRequestPreview({ selectedBase, selectedFeatures, total }) {
  if (!selectedBase) {
    return "";
  }

  const featureLines = selectedFeatures.length
    ? selectedFeatures.map((feature) => `- ${feature.name} (${formatPrice(feature.price)})`)
    : ["- No add-on features selected"];

  return [
    "IOU Studio Package Request",
    "",
    `Base Package: ${selectedBase.name} (${formatPrice(selectedBase.price)})`,
    "Add-On Features:",
    ...featureLines,
    "",
    `Estimated Total: ${formatPrice(total)}`,
  ].join("\n");
}

export default function usePackageBuilder() {
  const [selectedBaseId, setSelectedBaseId] = useState(null);
  const [selectedFeatureIds, setSelectedFeatureIds] = useState([]);
  const [submittedRequest, setSubmittedRequest] = useState(null);

  const selectedBase = useMemo(
    () => basePackages.find((item) => item.id === selectedBaseId) ?? null,
    [selectedBaseId],
  );

  const selectedFeatures = useMemo(
    () => addOnFeatures.filter((feature) => selectedFeatureIds.includes(feature.id)),
    [selectedFeatureIds],
  );

  const featuresTotal = useMemo(
    () => selectedFeatures.reduce((sum, feature) => sum + feature.price, 0),
    [selectedFeatures],
  );

  const total = (selectedBase?.price ?? 0) + featuresTotal;

  const requestPreview = useMemo(
    () => buildRequestPreview({ selectedBase, selectedFeatures, total }),
    [selectedBase, selectedFeatures, total],
  );

  function selectBase(packageId) {
    setSelectedBaseId(packageId);
    setSubmittedRequest(null);
  }

  function toggleFeature(featureId) {
    setSelectedFeatureIds((current) => {
      if (current.includes(featureId)) {
        return current.filter((item) => item !== featureId);
      }

      return [...current, featureId];
    });

    setSubmittedRequest(null);
  }

  function submitRequest() {
    if (!selectedBase) {
      return;
    }

    setSubmittedRequest({
      total,
      preview: requestPreview,
    });
  }

  function resetBuilder() {
    setSelectedBaseId(null);
    setSelectedFeatureIds([]);
    setSubmittedRequest(null);
  }

  return {
    addOnFeatures,
    basePackages,
    featuresTotal,
    requestPreview,
    resetBuilder,
    selectBase,
    selectedBase,
    selectedBaseId,
    selectedFeatureIds,
    selectedFeatures,
    submittedRequest,
    submitRequest,
    toggleFeature,
    total,
  };
}
