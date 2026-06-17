import type { Metadata } from "next";
import ForumClient from "@/components/ForumClient";
import PortfolioShell from "@/components/PortfolioShell";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Forum & Reviews",
  description: "Discussion forum and project reviews. Rate, leave comments, and interact with the creator.",
};

export default function ForumPage() {
  return (
    <PortfolioShell>
      <Navbar />
      <main className="relative z-1 block w-full px-6 py-24 text-text md:px-12 md:py-28 lg:px-16">
        <ForumClient />
      </main>
      <Footer />
    </PortfolioShell>
  );
}
