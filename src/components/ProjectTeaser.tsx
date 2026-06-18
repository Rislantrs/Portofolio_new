"use client";

import Image from "next/image";
import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger);

export default function ProjectTeaser() {
  const containerRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (!containerRef.current) return;

    // Create the animation timeline
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top top",
        end: "+=160%", // Faster scroll budget to make the transition snappy and direct
        pin: true,
        scrub: 1.5,
      },
    });

    // 1. Breathing Space / Lepas Landas:
    // - Transitions Black -> Charcoal (#1e1a16) -> Pure White (#ffffff) smoothly.
    tl.to(
      containerRef.current,
      { backgroundColor: "#1e1a16", duration: 0.6, ease: "power1.inOut" }
    )
    .to(
      containerRef.current,
      { backgroundColor: "#ffffff", duration: 0.8, ease: "power1.inOut" }
    );

    // 2. Logo Reveal:
    tl.fromTo(
      logoRef.current,
      { opacity: 0, scale: 0.1 },
      { opacity: 1, scale: 1, duration: 1.0, ease: "power2.out" }
    );

    // 3. Very brief pause for the logo
    tl.to({}, { duration: 0.3 });

    // 4. Slide Action:
    // - Logo slides to the right and disappears.
    // - Text slides from right (100vw) to completely off-screen left (-130%).
    tl.to(
      logoRef.current,
      { x: "130vw", opacity: 0, scale: 0.6, duration: 2.2, ease: "power2.inOut" },
      "slide"
    )
    .fromTo(
      textRef.current,
      { x: "100vw" },
      { x: "-130%", duration: 2.8, ease: "none" },
      "slide"
    );

    // 5. Overlapping Outro:
    // - Fade background back to dark (#050505) during the text slide.
    // - Starts at slide+=0.8 and finishes in 1.0s, so it is fully black before the text finishes sliding.
    // - Eliminates any empty dark page/dead scroll delay after the text goes away.
    tl.to(
      containerRef.current,
      { backgroundColor: "#050505", duration: 1.0, ease: "power2.inOut" },
      "slide+=0.8"
    );

    // ─── Prevents early triggering / layout shifts ───
    const refreshAll = () => {
      ScrollTrigger.sort();
      ScrollTrigger.refresh();
    };

    refreshAll();
    window.addEventListener("load", refreshAll);
    
    const t1 = setTimeout(refreshAll, 100);
    const t2 = setTimeout(refreshAll, 600);
    const t3 = setTimeout(refreshAll, 1500);

    return () => {
      window.removeEventListener("load", refreshAll);
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };

  }, { dependencies: [] });

  return (
    <section
      ref={containerRef}
      className="relative w-full h-screen overflow-hidden flex flex-col items-center justify-center z-10"
      style={{ backgroundColor: "#050505" }}
    >
      {/* Subtle clean grid backdrop (only visible when background turns white) */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.02] bg-[linear-gradient(to_right,#000_1px,transparent_1px),linear-gradient(to_bottom,#000_1px,transparent_1px)] bg-[size:5rem_5rem]" />

      {/* 1. Logo Slider Image (Fades & scales, then moves right) */}
      <div
        ref={logoRef}
        className="absolute w-[300px] h-[300px] md:w-[500px] md:h-[500px] flex items-center justify-center pointer-events-none z-10"
        style={{ opacity: 0 }} // Initially invisible for the breathing room effect
      >
        <Image
          src="/assets/Logo_sider.webp"
          alt="Slider Logo"
          width={500}
          height={500}
          className="w-full h-full object-contain filter drop-shadow-[0_15px_35px_rgba(0,0,0,0.15)]"
          priority
        />
      </div>

      {/* 2. Massive Text Marquee Title (Slides in from right to left, ONCE only) */}
      <div className="absolute w-full flex items-center overflow-hidden pointer-events-none z-20 mix-blend-difference">
        <div
          ref={textRef}
          className="whitespace-nowrap flex gap-8 md:gap-10 items-center text-[12vw] md:text-[9vw] font-mega uppercase tracking-normal leading-none select-none px-4 text-white"
        >
          <span className="font-black opacity-60">EXPLORE MY</span>
          <span className="font-black italic drop-shadow-[0_12px_24px_rgba(255,255,255,0.14)]">PROJECTS</span>
          <span className="text-accent font-black">✦</span>
          <span className="font-black opacity-60">THE WORKS I</span>
          <span className="font-black italic drop-shadow-[0_12px_24px_rgba(255,255,255,0.14)]">BUILT</span>
        </div>
      </div>

      {/* Bottom marker/indicator */}
      <div className="absolute bottom-10 left-10 text-black/20 dark:text-white/10 font-mono text-[10px] tracking-widest uppercase pointer-events-none select-none">
        03b — PROJECT TEASER
      </div>
    </section>
  );
}
