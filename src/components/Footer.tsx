"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowUp, ArrowUpRight } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger);

function FooterGrid() {
  return (
    <svg
      className="absolute inset-0 z-[1] h-full w-full pointer-events-none"
      xmlns="http://www.w3.org/2000/svg"
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      {[18, 42, 66, 86].map((y) => (
        <line
          key={`h-${y}`}
          className="footer-grid-line"
          x1="0"
          y1={`${y}%`}
          x2="100%"
          y2={`${y}%`}
          stroke="rgba(255,255,255,0.1)"
          strokeWidth="0.8"
          strokeDasharray="3000"
          strokeDashoffset="3000"
        />
      ))}
      {[8, 22, 38, 54, 70, 88].map((x) => (
        <line
          key={`v-${x}`}
          className="footer-grid-line"
          x1={`${x}%`}
          y1="0"
          x2={`${x}%`}
          y2="100%"
          stroke="rgba(255,255,255,0.08)"
          strokeWidth="0.8"
          strokeDasharray="2200"
          strokeDashoffset="2200"
        />
      ))}
      <circle
        className="footer-grid-circle"
        cx="76%"
        cy="43%"
        r="13%"
        stroke="rgba(255,255,255,0.12)"
        strokeWidth="0.8"
        strokeDasharray="10 8"
        fill="none"
        opacity="0"
      />
    </svg>
  );
}

const navLinks = [
  ["Home", "#home"],
  ["About", "#about"],
  ["Projects", "#projects"],
  ["Skills", "#skills"],
];

const socialLinks = [
  ["GitHub", "https://github.com/Rislantrs"],
  ["LinkedIn", "https://www.linkedin.com/in/m-rislan-tristansyah-96669a294/"],
  ["Credly", "https://www.credly.com/users/m-rislan-tristansyah"],
];

export default function Footer() {
  const footerRef = useRef<HTMLElement>(null);
  const wordmarkRef = useRef<HTMLDivElement>(null);
  const firstLetterRef = useRef<HTMLSpanElement>(null);
  const [year, setYear] = useState(2026);

  useEffect(() => {
    setYear(new Date().getFullYear());
  }, []);

  useGSAP(() => {
    const footer = footerRef.current;
    const wordmark = wordmarkRef.current;
    const firstLetter = firstLetterRef.current;
    if (!footer || !wordmark || !firstLetter) return;

    const letters = wordmark.querySelectorAll(".footer-letter");
    const gridLines = footer.querySelectorAll(".footer-grid-line");
    const circle = footer.querySelector(".footer-grid-circle");
    const revealItems = footer.querySelectorAll(".footer-reveal");

    const calculateOffset = () => {
      const parentWidth = wordmark.offsetWidth;
      const letterWidth = firstLetter.offsetWidth;
      const letterLeft = firstLetter.offsetLeft;
      return parentWidth / 2 - (letterLeft + letterWidth / 2);
    };

    gsap.set(firstLetter, { x: calculateOffset(), scale: 0.82, opacity: 0 });
    gsap.set(letters, { opacity: 0, y: 35, filter: "blur(18px)" });
    gsap.set(gridLines, {
      strokeDashoffset: (_, el) => el.getAttribute("stroke-dasharray") || 3000,
    });
    gsap.set(circle, { opacity: 0, scale: 0.8, transformOrigin: "center" });
    gsap.set(revealItems, { y: 28, opacity: 0 });

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: footer,
        start: "top 72%",
        toggleActions: "play none none reverse",
      },
    });

    tl.to(firstLetter, {
      opacity: 1,
      scale: 1,
      duration: 0.8,
      ease: "power4.out",
    })
      .to(firstLetter, {
        x: 0,
        duration: 1.05,
        ease: "power3.inOut",
      }, "+=0.08")
      .to(gridLines, {
        strokeDashoffset: 0,
        duration: 1.1,
        stagger: 0.035,
        ease: "power2.inOut",
      }, "-=0.65")
      .to(circle, {
        opacity: 1,
        scale: 1,
        duration: 0.75,
        ease: "power2.out",
      }, "-=0.55")
      .to(letters, {
        opacity: 1,
        y: 0,
        filter: "blur(0px)",
        duration: 1,
        stagger: 0.055,
        ease: "power3.out",
      }, "-=0.45")
      .to([gridLines, circle], {
        opacity: 0,
        duration: 0.8,
        ease: "power2.inOut",
      }, "+=0.18")
      .to(revealItems, {
        y: 0,
        opacity: 1,
        duration: 0.75,
        stagger: 0.055,
        ease: "power3.out",
      }, "-=0.45");
  }, { scope: footerRef });

  return (
    <footer
      ref={footerRef}
      id="contact-footer"
      className="relative flex min-h-[100svh] w-full overflow-hidden border-t border-white/5 bg-bg py-14 md:py-18"
    >

      <div className="absolute inset-0 z-0 bg-[radial-gradient(ellipse_70%_55%_at_68%_75%,rgba(255,255,255,0.06),transparent)] pointer-events-none" />
      <FooterGrid />

      <div className="section-shell relative z-10 flex flex-1 flex-col justify-between">
        <div className="footer-reveal flex items-start justify-between gap-6 font-mono text-[10px] uppercase tracking-[0.28em] text-white/50 md:text-xs">
          <span className="inline-flex items-center gap-3">
            <span className="h-px w-10 bg-white/45" />
            Endnote / Contact
          </span>
          <span className="hidden text-right text-white/30 md:block">MRT / {year}</span>
        </div>

        <div className="relative my-12 select-none md:my-16">
          <p
            className="pointer-events-none absolute -left-[0.05em] top-1/2 z-0 -translate-y-1/2 font-sans text-[22vw] font-black uppercase leading-none text-transparent opacity-35 [-webkit-text-stroke:1px_rgba(255,255,255,0.13)] md:text-[18vw]"
            aria-hidden="true"
          >
            Rislan
          </p>

          <div
            ref={wordmarkRef}
            className="relative z-10 flex w-full items-end justify-start overflow-hidden"
            aria-label="RISLAN"
          >
            {"RISLAN".split("").map((char, index) => (
              <span
                key={`${char}-${index}`}
                ref={index === 0 ? firstLetterRef : undefined}
                className={`footer-letter relative z-10 font-sans text-[19vw] font-black uppercase leading-[0.74] tracking-[-0.085em] md:text-[15.2vw] ${
                  index % 2 === 0 ? "text-white" : "text-white/82"
                }`}
              >
                {char}
              </span>
            ))}
          </div>

          <div className="footer-reveal mt-5 grid gap-4 border-y border-white/10 py-4 font-mono text-[10px] uppercase tracking-[0.24em] text-white/38 md:grid-cols-[1.15fr_0.85fr] md:text-[11px]">
            <p>M. Rislan Tristansyah / Systems / Intelligent Tech / Infrastructure</p>
            <p className="md:text-right">Purwakarta, Indonesia / Available for thoughtful builds</p>
          </div>
        </div>

        <div className="footer-reveal grid gap-4 md:grid-cols-[1.1fr_1fr_1fr_0.9fr]">
          <div className="border-t border-white/12 pt-5">
            <span className="font-mono text-[10px] uppercase tracking-[0.26em] text-white/35">01 / Explore</span>
            <nav className="mt-5 grid gap-2 font-sans text-xl font-black uppercase leading-none text-white md:text-2xl">
              {navLinks.map(([label, href]) => (
                <a key={label} href={href} className="w-fit text-white/80 transition-colors hover:text-white">
                  {label}
                </a>
              ))}
            </nav>
          </div>

          <div className="border-t border-white/12 pt-5">
            <span className="font-mono text-[10px] uppercase tracking-[0.26em] text-white/35">02 / Connect</span>
            <div className="mt-5 grid gap-3 font-mono text-[11px] uppercase tracking-[0.18em] text-white/55">
              {socialLinks.map(([label, href]) => (
                <a key={label} href={href} target="_blank" rel="noopener noreferrer" className="flex w-fit items-center gap-2 transition-colors hover:text-white">
                  {label} <ArrowUpRight size={12} />
                </a>
              ))}
            </div>
          </div>

          <div className="border-t border-white/12 pt-5">
            <span className="font-mono text-[10px] uppercase tracking-[0.26em] text-white/35">03 / Signal</span>
            <div className="mt-5 grid gap-4">
              <p className="font-sans text-2xl font-black uppercase leading-none text-white">Open to build</p>
              <a href="mailto:rislantristansyah@gmail.com" className="break-all font-mono text-[11px] lowercase tracking-[0.08em] text-white/55 transition-colors hover:text-white">
                rislantristansyah@gmail.com
              </a>
            </div>
          </div>

          <div className="border-t border-white/12 pt-5 md:text-right">
            <span className="font-mono text-[10px] uppercase tracking-[0.26em] text-white/35">04 / Return</span>
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              className="mt-5 inline-flex items-center gap-2 font-sans text-2xl font-black uppercase leading-none text-white/80 transition-colors hover:text-white"
            >
              Top <ArrowUp size={18} />
            </button>
            <p className="mt-8 font-mono text-[10px] uppercase leading-relaxed tracking-[0.18em] text-white/25">
              &copy; {year} M Rislan Tristansyah.<br />All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
