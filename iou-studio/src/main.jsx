import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App.jsx";
import "./index.css";
import { OrderFlowProvider } from "./orderFlow/OrderFlowContext.jsx";
import { ThemeProvider } from "./theme/ThemeProvider.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ThemeProvider>
      <BrowserRouter>
        <OrderFlowProvider>
          <App />
        </OrderFlowProvider>
      </BrowserRouter>
    </ThemeProvider>
  </React.StrictMode>,
);
