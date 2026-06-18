"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Award, Briefcase, GraduationCap, Users } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

interface JourneyItem {
  id: number;
  period: string;
  title: string;
  subtitle: string;
  description: string;
  category: "education" | "organization" | "internship" | "certification";
  details?: string[];
  badges?: { name: string; icon: string }[];
}

const journeyData: JourneyItem[] = [
  {
    id: 1,
    period: "2024 — 2025",
    title: "Secretary & Staff - Dept. Profesi & Kejuruan",
    subtitle: "HIMASISTEKOM (Himpunan Mahasiswa Sistem Telekomunikasi UPI)",
    category: "organization",
    description: "Managed departmental correspondences, documentation, accountability reports (LPJ), and served as the Project In Charge (PIC) of the Skilltopia Program to distribute academic and career insights.",
    details: [
      "Department Secretary — meeting minutes & administrative support",
      "LPJ curation and accountability reports",
      "Skilltopia PIC — managed training & certification sharing",
    ],
  },
  {
    id: 2,
    period: "2023 — Present",
    title: "Universitas Pendidikan Indonesia",
    subtitle: "S1 — Telecommunication System Engineering",
    category: "education",
    description: "Pursuing bachelor's degree in Telecommunication Systems. Deepening expertise in Machine Learning, Software-Defined Networks (SDN), Cloud Computing, and Embedded IoT Solutions.",
    badges: [
      { name: "Gemini Certified", icon: "/assets/Gemini_compressed.webp" },
      { name: "ACA Cloud", icon: "/assets/ACA_compressed.webp" },
      { name: "Google Cloud", icon: "/assets/GCP_compressed.webp" },
      { name: "Alibaba Cloud Dev", icon: "/assets/DEV_compressed.webp" },
      { name: "HTML/JS — JHU", icon: "/assets/JohnCer_compressed.webp" },
      { name: "Machine Learning", icon: "/assets/MachineLearning_compressed.webp" },
    ],
  },
  {
    id: 3,
    period: "2019 — 2022",
    title: "SMA Negeri 1 Cibatu",
    subtitle: "Science Major — High School Degree",
    category: "education",
    description: "Graduated with honors, laying the academic foundations in advanced mathematics, physics, and computer logic.",
  },
  {
    id: 4,
    period: "2016 — 2019",
    title: "SMP Negeri 1 Campaka",
    subtitle: "Purwakarta — Junior High School",
    category: "education",
    description: "Discovered a passion for technology, algorithms, and early hardware electronics.",
  },
];

export default function Journey() {
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollSectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mm = gsap.matchMedia();

    mm.add("(min-width: 1024px)", () => {
      const sections = gsap.utils.toArray(".journey-card-item");
      
      const getScrollAmount = () => {
        return scrollSectionRef.current
          ? scrollSectionRef.current.scrollWidth - scrollSectionRef.current.clientWidth
          : 0;
      };

      const horizontalTween = gsap.to(scrollSectionRef.current, {
        x: () => -getScrollAmount(),
        ease: "none",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: () => `+=${getScrollAmount()}`,
          pin: true,
          scrub: 1.2,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      });

      // Animate cards scale & opacity active focus
      (sections as HTMLElement[]).forEach((section) => {
        gsap.from(section, {
          scale: 0.9,
          opacity: 0.5,
          scrollTrigger: {
            trigger: section,
            containerAnimation: horizontalTween,
            start: "left right",
            end: "left center",
            scrub: true,
          },
        });
      });
    });

    return () => mm.revert();
  }, []);

  const getIcon = (category: string) => {
    switch (category) {
      case "education":
        return <GraduationCap size={16} className="text-accent-light" />;
      case "organization":
        return <Users size={16} className="text-accent-light" />;
      case "internship":
        return <Briefcase size={16} className="text-accent-light" />;
      default:
        return <Award size={16} className="text-accent-light" />;
    }
  };

  return (
    <div
      ref={containerRef}
      id="journey"
      className="relative w-full min-h-[80vh] lg:min-h-screen bg-bg flex flex-col justify-center overflow-hidden py-32 md:py-40"
    >
      {/* Section Header */}
      <div className="section-shell mb-16 flex flex-col gap-4">
        <div className="flex items-center gap-3 font-display font-bold text-xs tracking-widest text-accent uppercase select-none">
          <span className="w-8 h-[1px] bg-accent" />
          02 — PROFESSIONAL JOURNEY
        </div>
        <h2 className="font-display font-black text-4xl md:text-6xl tracking-tighter leading-none select-none">
          Education & <span className="text-accent-light italic">Experiences</span>
        </h2>
      </div>

      {/* Horizontal Carousel Track Container */}
      <div
        ref={scrollSectionRef}
        data-cursor="drag"
        className="section-shell flex gap-8 pb-12 items-stretch lg:flex-row flex-col"
      >
        {journeyData.map((item) => (
          <div
            key={item.id}
            className="journey-card-item w-full max-w-xl md:w-[480px] flex-shrink-0 flex flex-col select-none"
          >
            {/* Timeline connection dots */}
            <div className="hidden lg:flex items-center gap-4 mb-6">
              <div className="w-6 h-6 rounded-full border-2 border-accent flex items-center justify-center bg-bg shadow-[0_0_10px_rgba(255,255,255,0.16)]">
                <span className="w-2.5 h-2.5 rounded-full bg-accent" />
              </div>
              <div className="h-[2px] bg-gradient-to-r from-accent to-white/5 flex-grow" />
            </div>

            {/* Glass Card content */}
            <div className="flex-1 p-8 bg-surface border border-white/5 rounded-2xl flex flex-col justify-between gap-6 hover:border-accent/25 hover:shadow-[0_20px_40px_rgba(0,0,0,0.3)] transition-all duration-300 group">
              <div className="flex flex-col gap-4">
                {/* Meta details */}
                <div className="flex justify-between items-center">
                  <span className="px-3 py-1 text-[10px] uppercase font-bold tracking-widest bg-accent/10 border border-accent/20 rounded-full text-accent-light">
                    {item.period}
                  </span>
                  <div className="p-2 rounded-xl bg-accent/5 border border-accent/10 group-hover:border-accent/30 transition-colors">
                    {getIcon(item.category)}
                  </div>
                </div>

                {/* Card Title info */}
                <div>
                  <h3 className="font-display font-extrabold text-xl leading-tight group-hover:text-accent-light transition-colors">
                    {item.title}
                  </h3>
                  <h4 className="font-sans font-medium text-xs text-accent/80 mt-1 uppercase">
                    {item.subtitle}
                  </h4>
                </div>

                <p className="font-sans text-xs md:text-sm text-text-muted leading-relaxed mt-2">
                  {item.description}
                </p>

                {/* Sub Bullet Details */}
                {item.details && (
                  <ul className="list-disc pl-5 mt-2 flex flex-col gap-1.5 text-xs text-text-muted leading-relaxed">
                    {item.details.map((detail, idx) => (
                      <li key={idx}>{detail}</li>
                    ))}
                  </ul>
                )}
              </div>

              {/* Dynamic Badges Certifications */}
              {item.badges && (
                <div className="flex flex-wrap gap-2.5 mt-4 pt-4 border-t border-white/5">
                  {item.badges.map((badge, idx) => (
                    <div
                      key={idx}
                      className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-bg-elevated border border-white/10 text-[10px] font-medium text-text-muted hover:text-accent-light hover:border-accent/40 transition-all select-none"
                    >
                      <Image
                        src={badge.icon}
                        alt={badge.name}
                        width={16}
                        height={16}
                        className="w-4 h-4 rounded-md object-cover"
                      />
                      {badge.name}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
