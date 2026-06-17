import type { Metadata } from "next";
import DashboardClient from "@/components/DashboardClient";
import PortfolioShell from "@/components/PortfolioShell";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Dashboard",
  description: "Personal metrics dashboard covering GitHub, WakaTime, Umami Analytics, and Web Performance.",
};

export default function DashboardPage() {
  return (
    <PortfolioShell>
      <Navbar />
      <main className="relative z-1 block w-full py-24 md:py-28">
        <DashboardClient />
      </main>
      <Footer />
    </PortfolioShell>
  );
}
