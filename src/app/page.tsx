import dynamic from "next/dynamic";
import PortfolioShell from "@/components/PortfolioShell";

const Navbar = dynamic(() => import("@/components/Navbar"));
const Hero = dynamic(() => import("@/components/Hero"));
const About = dynamic(() => import("@/components/About"));
const Certifications = dynamic(() => import("@/components/Certifications"));
const Projects = dynamic(() => import("@/components/Projects"));
const Footer = dynamic(() => import("@/components/Footer"));

export default function Home() {
  return (
    <PortfolioShell>
      <Navbar />
      <main className="relative z-1 block w-full">
        <Hero />
        <About />
        <Certifications />
        <Projects />
      </main>
      <Footer />
    </PortfolioShell>
  );
}
