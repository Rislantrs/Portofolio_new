"use client";

import dynamic from "next/dynamic";
import { useCallback, useEffect, useState } from "react";
import { performanceConfig } from "@/lib/siteConfig";

function PreloaderFallback() {
  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center overflow-hidden bg-[#f4f4f4]">
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: "radial-gradient(#d3cdc3 1px, transparent 1px)",
          backgroundPosition: "center",
          backgroundSize: "24px 24px",
        }}
      />
      <div className="relative h-44 w-44 rounded-full border border-black/5 bg-[#f4f4f4] shadow-[0_16px_36px_rgba(0,0,0,0.12),inset_0_2px_4px_rgba(255,255,255,0.6)] md:h-56 md:w-56" />
    </div>
  );
}

const Preloader = dynamic(() => import("@/components/Preloader"), {
  loading: PreloaderFallback,
  ssr: false,
});

export default function PortfolioClientEffects() {
  const [loaded, setLoaded] = useState(false);
  const [showPreloader, setShowPreloader] = useState(true);
  const liteMode = false;

  useEffect(() => {
    document.documentElement.dataset.perfMode = "full";
  }, []);

  useEffect(() => {
    if (!loaded) return;
    if (liteMode && !performanceConfig.enableSmoothScrollOnMobile) return;

    let frameId = 0;
    let cancelled = false;
    let lenis: {
      raf: (time: number) => void;
      destroy: () => void;
      scrollTo: (target: HTMLElement, options?: { offset?: number }) => void;
    } | null = null;

    async function startSmoothScroll() {
      const { default: Lenis } = await import("lenis");
      if (cancelled) return;

      lenis = new Lenis({
        duration: 1.2,
        easing: (t: number) => Math.min(1, 1.001 - 2 ** (-10 * t)),
        wheelMultiplier: 1.1,
        touchMultiplier: 1.5,
      });

      const raf = (time: number) => {
        lenis?.raf(time);
        frameId = requestAnimationFrame(raf);
      };

      frameId = requestAnimationFrame(raf);
    }

    const handleAnchorScroll = (event: MouseEvent) => {
      const anchor = (event.target as HTMLElement).closest<HTMLAnchorElement>("a[href^='#']");
      if (!anchor?.hash || !lenis) return;

      const target = document.querySelector<HTMLElement>(anchor.hash);
      if (!target) return;

      event.preventDefault();
      lenis.scrollTo(target, { offset: -80 });
    };

    void startSmoothScroll();
    document.addEventListener("click", handleAnchorScroll);

    return () => {
      cancelled = true;
      cancelAnimationFrame(frameId);
      lenis?.destroy();
      document.removeEventListener("click", handleAnchorScroll);
    };
  }, [loaded, liteMode]);

  const completePreloader = useCallback(() => {
    setLoaded(true);
    setShowPreloader(false);
    setTimeout(() => {
      import("gsap/ScrollTrigger").then(({ ScrollTrigger }) => {
        ScrollTrigger.refresh();
      });
    }, 150);
  }, []);

  return showPreloader ? <Preloader onComplete={completePreloader} /> : null;
}
