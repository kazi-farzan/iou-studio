import { useMemo, useState } from "react";
import {
  getConfiguratorModule,
  getConfiguratorPackage,
} from "../data/configuratorSchema.js";
import { BILLING_MODE_MONTHLY } from "../data/pricing.js";
import { OrderFlowContext } from "./OrderFlowState.js";
import {
  buildOrderConfiguration,
  createSubmittedOrder,
  getDefaultContactDraft,
  getDefaultPlanId,
  ORDER_FLOW_MODE_CUSTOM,
  ORDER_FLOW_MODE_PACKAGES,
} from "./orderFlow.js";

function getValidUniqueModuleIds(moduleIds = []) {
  return [...new Set(moduleIds.filter((moduleId) => getConfiguratorModule(moduleId)))];
}

export function OrderFlowProvider({ children }) {
  const [mode, setMode] = useState(ORDER_FLOW_MODE_PACKAGES);
  const [billingMode, setBillingMode] = useState(BILLING_MODE_MONTHLY);
  const [couponInput, setCouponInput] = useState("");
  const [appliedCouponCode, setAppliedCouponCode] = useState("");
  const [selectedPlanId, setSelectedPlanId] = useState(getDefaultPlanId());
  const [selectedCustomModuleIds, setSelectedCustomModuleIds] = useState([]);
  const [selectedCustomModuleOptions, setSelectedCustomModuleOptions] = useState(
    {},
  );
  const [contactDraft, setContactDraft] = useState(getDefaultContactDraft());
  const [lastSubmittedOrder, setLastSubmittedOrder] = useState(null);

  function startCustomBuild(moduleIds = []) {
    const requestedModuleIds = Array.isArray(moduleIds) ? moduleIds : [moduleIds];
    const validModuleIds = getValidUniqueModuleIds(requestedModuleIds);

    if (!validModuleIds.length) {
      return;
    }

    setMode(ORDER_FLOW_MODE_CUSTOM);
    setSelectedCustomModuleIds((current) =>
      getValidUniqueModuleIds([...current, ...validModuleIds]),
    );
  }

  function startPackageBuild(packageId) {
    if (!getConfiguratorPackage(packageId)) {
      return;
    }

    setMode(ORDER_FLOW_MODE_PACKAGES);
    setSelectedPlanId(packageId);
  }

  const draftConfiguration = useMemo(
    () =>
      buildOrderConfiguration({
        appliedCouponCode,
        billingMode,
        mode,
        selectedCustomModuleIds,
        selectedCustomModuleOptions,
        selectedPlanId,
      }),
    [
      appliedCouponCode,
      billingMode,
      mode,
      selectedCustomModuleIds,
      selectedCustomModuleOptions,
      selectedPlanId,
    ],
  );

  function submitOrder(submittedDetails) {
    if (!draftConfiguration.hasSelection) {
      return null;
    }

    const submittedOrder = createSubmittedOrder({
      configuration: draftConfiguration,
      submittedDetails,
    });

    setContactDraft(submittedOrder.submittedDetails);
    setLastSubmittedOrder(submittedOrder);

    return submittedOrder;
  }

  const value = {
    appliedCouponCode,
    billingMode,
    contactDraft,
    couponInput,
    draftConfiguration,
    hasActiveSelection: draftConfiguration.hasSelection,
    lastSubmittedOrder,
    mode,
    selectedCustomModuleIds,
    selectedCustomModuleOptions,
    selectedPlanId,
    setAppliedCouponCode,
    setBillingMode,
    setContactDraft,
    setCouponInput,
    setMode,
    setSelectedCustomModuleIds,
    setSelectedCustomModuleOptions,
    setSelectedPlanId,
    startCustomBuild,
    startPackageBuild,
    submitOrder,
  };

  return (
    <OrderFlowContext.Provider value={value}>
      {children}
    </OrderFlowContext.Provider>
  );
}
