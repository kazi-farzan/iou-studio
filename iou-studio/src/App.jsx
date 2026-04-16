import { Navigate, Route, Routes } from "react-router-dom";
import SiteLayout from "./layouts/SiteLayout.jsx";
import About from "./pages/About.jsx";
import CaseStudies from "./pages/CaseStudies.jsx";
import Confirmation from "./pages/Confirmation.jsx";
import Contact from "./pages/Contact.jsx";
import Home from "./pages/Home.jsx";
import OrderSummary from "./pages/OrderSummary.jsx";
import Pricing from "./pages/Pricing.jsx";
import Services from "./pages/Services.jsx";

function App() {
  return (
    <Routes>
      <Route element={<SiteLayout />}>
        <Route index element={<Home />} />
        <Route path="services" element={<Services />} />
        <Route path="pricing" element={<Pricing />} />
        <Route path="summary" element={<OrderSummary />} />
        <Route path="confirmation" element={<Confirmation />} />
        <Route path="case-studies" element={<CaseStudies />} />
        <Route path="how-it-works" element={<About />} />
        <Route path="contact" element={<Contact />} />
      </Route>
      <Route path="*" element={<Navigate replace to="/" />} />
    </Routes>
  );
}

export default App;
