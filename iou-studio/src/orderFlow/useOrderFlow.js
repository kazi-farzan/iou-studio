import { useContext } from "react";
import { OrderFlowContext } from "./OrderFlowState.js";

export function useOrderFlow() {
  const context = useContext(OrderFlowContext);

  if (!context) {
    throw new Error("useOrderFlow must be used within an OrderFlowProvider.");
  }

  return context;
}
