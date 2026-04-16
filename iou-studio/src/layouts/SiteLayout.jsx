import { Outlet } from "react-router-dom";
import Footer from "../components/layout/Footer.jsx";
import Navbar from "../components/layout/Navbar.jsx";

export default function SiteLayout() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-[var(--background)] text-[var(--text-primary)]">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
      >
        <div className="theme-ambient-orb-1 absolute left-[-14rem] top-[-11rem] h-[28rem] w-[28rem] rounded-full blur-3xl" />
        <div className="theme-ambient-orb-2 absolute right-[-9rem] top-16 h-[22rem] w-[22rem] rounded-full blur-3xl" />
        <div className="theme-ambient-shell absolute inset-0" />
      </div>

      <div className="relative z-10 flex min-h-screen flex-col">
        <Navbar />

        <main className="mx-auto flex w-full max-w-[84rem] flex-1 flex-col px-5 pb-16 pt-4 sm:px-8 sm:pb-20 sm:pt-6 lg:px-10 lg:pt-8">
          <Outlet />
        </main>

        <Footer />
      </div>
    </div>
  );
}
