import { useMemo, useState } from "react";
import { BILLING_MODE_MONTHLY } from "../data/pricing.js";
import { OrderFlowContext } from "./OrderFlowState.js";
import {
  buildOrderConfiguration,
  createSubmittedOrder,
  getDefaultContactDraft,
  getDefaultPlanId,
  ORDER_FLOW_MODE_PACKAGES,
} from "./orderFlow.js";

export function OrderFlowProvider({ children }) {
  const [mode, setMode] = useState(ORDER_FLOW_MODE_PACKAGES);
  const [billingMode, setBillingMode] = useState(BILLING_MODE_MONTHLY);
  const [couponInput, setCouponInput] = useState("");
  const [appliedCouponCode, setAppliedCouponCode] = useState("");
  const [selectedPlanId, setSelectedPlanId] = useState(getDefaultPlanId());
  const [selectedCustomModuleIds, setSelectedCustomModuleIds] = useState([]);
  const [contactDraft, setContactDraft] = useState(getDefaultContactDraft());
  const [lastSubmittedOrder, setLastSubmittedOrder] = useState(null);

  const draftConfiguration = useMemo(
    () =>
      buildOrderConfiguration({
        appliedCouponCode,
        billingMode,
        mode,
        selectedCustomModuleIds,
        selectedPlanId,
      }),
    [
      appliedCouponCode,
      billingMode,
      mode,
      selectedCustomModuleIds,
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
    selectedPlanId,
    setAppliedCouponCode,
    setBillingMode,
    setContactDraft,
    setCouponInput,
    setMode,
    setSelectedCustomModuleIds,
    setSelectedPlanId,
    submitOrder,
  };

  return (
    <OrderFlowContext.Provider value={value}>
      {children}
    </OrderFlowContext.Provider>
  );
}
