"use client";

import { useRef } from "react";
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
  const wordmarkRef = useRef<HTMLHeadingElement>(null);

  useGSAP(() => {
    const footer = footerRef.current;
    const wordmark = wordmarkRef.current;
    if (!footer || !wordmark) return;

    const gridLines = footer.querySelectorAll(".footer-grid-line");
    const circle = footer.querySelector(".footer-grid-circle");
    const revealItems = footer.querySelectorAll(".footer-reveal");

    gsap.set(wordmark, {
      opacity: 0,
      x: -24,
      y: 0,
      scale: 1,
      clipPath: "inset(0 100% 0 0)",
      filter: "blur(10px)",
      transformOrigin: "0% 50%",
    });
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

    tl.to(gridLines, {
      strokeDashoffset: 0,
      duration: 1.1,
      stagger: 0.035,
      ease: "power2.inOut",
    }, 0)
      .to(circle, {
        opacity: 1,
        scale: 1,
        duration: 0.75,
        ease: "power2.out",
      }, 0.18)
      .to(wordmark, {
        opacity: 1,
        x: 0,
        clipPath: "inset(0 0% 0 0)",
        filter: "blur(0px)",
        duration: 1.05,
        ease: "power3.out",
      }, 0.28)
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
      className="relative flex min-h-[100svh] w-full overflow-hidden border-t border-white/5 bg-bg px-[clamp(1.25rem,5vw,6rem)] py-14 md:py-18"
    >

      <div className="absolute inset-0 z-0 bg-[radial-gradient(ellipse_70%_55%_at_68%_75%,rgba(255,255,255,0.06),transparent)] pointer-events-none" />
      <FooterGrid />

      <div className="relative z-10 mx-auto flex w-full max-w-[92rem] flex-1 flex-col justify-between">
        <div className="footer-reveal type-meta flex items-start justify-between gap-6 text-white/50">
          <span className="inline-flex items-center gap-3">
            <span className="h-px w-10 bg-white/45" />
            Endnote / Contact
          </span>
          <span className="hidden text-right text-white/30 md:block">MRT / 2026</span>
        </div>

        <div className="relative my-12 select-none md:my-16">
          <h2
            ref={wordmarkRef}
            className="relative z-10 w-full overflow-visible py-[0.08em] font-sans text-[clamp(5rem,18vw,18rem)] font-black uppercase leading-none tracking-[-0.085em] text-white md:text-[clamp(8rem,14vw,16rem)]"
          >
            RISLAN
          </h2>

          <div className="footer-reveal type-meta mt-5 grid gap-4 border-y border-white/10 py-4 text-white/38 md:grid-cols-[1.15fr_0.85fr]">
            <p>M. Rislan Tristansyah / Systems / Intelligent Tech / Infrastructure</p>
            <p className="md:text-right">Purwakarta, Indonesia / Available for thoughtful builds</p>
          </div>
        </div>

        <div className="footer-reveal grid gap-4 md:grid-cols-[1.1fr_1fr_1fr_0.9fr]">
          <div className="border-t border-white/12 pt-5">
            <span className="type-meta text-white/35">01 / Explore</span>
            <nav className="mt-5 grid gap-2 text-[clamp(1.1rem,1.6vw,1.45rem)] font-black uppercase leading-none text-white">
              {navLinks.map(([label, href]) => (
                <a key={label} href={href} className="w-fit text-white/80 transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded-sm">
                  {label}
                </a>
              ))}
            </nav>
          </div>

          <div className="border-t border-white/12 pt-5">
            <span className="type-meta text-white/35">02 / Connect</span>
            <div className="type-meta mt-5 grid gap-3 text-white/55">
              {socialLinks.map(([label, href]) => (
                <a key={label} href={href} target="_blank" rel="noopener noreferrer" className="flex w-fit items-center gap-2 transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded-sm">
                  {label} <ArrowUpRight size={12} />
                </a>
              ))}
            </div>
          </div>

          <div className="border-t border-white/12 pt-5">
            <span className="type-meta text-white/35">03 / Signal</span>
            <div className="mt-5 grid gap-4">
              <p className="type-panel-title uppercase text-white">Open to build</p>
              <a href="mailto:rislantristansyah@gmail.com" className="type-small break-all lowercase text-white/55 transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded-sm">
                rislantristansyah@gmail.com
              </a>
            </div>
          </div>

          <div className="border-t border-white/12 pt-5 md:text-right">
            <span className="type-meta text-white/35">04 / Return</span>
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              className="mt-5 inline-flex items-center gap-2 text-[clamp(1.1rem,1.6vw,1.45rem)] font-black uppercase leading-none text-white/80 transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-accent rounded-md"
            >
              Top <ArrowUp size={18} />
            </button>
            <p className="type-meta mt-8 leading-relaxed text-white/25">
              &copy; 2026 M Rislan Tristansyah.<br />All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
