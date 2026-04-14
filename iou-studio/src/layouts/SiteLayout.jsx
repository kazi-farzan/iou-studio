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
        <div className="theme-ambient-orb-1 absolute left-[-12rem] top-[-10rem] h-[24rem] w-[24rem] rounded-full blur-3xl" />
        <div className="theme-ambient-orb-2 absolute right-[-10rem] top-24 h-[20rem] w-[20rem] rounded-full blur-3xl" />
        <div className="theme-ambient-shell absolute inset-0" />
      </div>

      <div className="relative z-10 flex min-h-screen flex-col">
        <Navbar />

        <main className="mx-auto flex w-full max-w-7xl flex-1 flex-col px-5 pb-14 pt-8 sm:px-8 sm:pt-10 lg:px-10 lg:pt-14">
          <Outlet />
        </main>

        <Footer />
      </div>
    </div>
  );
}
