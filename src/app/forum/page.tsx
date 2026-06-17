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
      <main
        id="forum-page"
        className="relative z-1 block w-full py-24 text-text md:py-28"
        style={{ paddingInline: "clamp(1.5rem, 4vw, 4rem)" }}
      >
        <ForumClient />
      </main>
      <Footer />
    </PortfolioShell>
  );
}
