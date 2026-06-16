"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

type CertificationsTimelineArgs = {
  isPinned: boolean;
  sectionRef: React.RefObject<HTMLElement | null>;
  trackViewportRef: React.RefObject<HTMLDivElement | null>;
  trackRef: React.RefObject<HTMLDivElement | null>;
  sliderThumbRef: React.RefObject<HTMLDivElement | null>;
};

export function useCertificationsTimeline({
  isPinned,
  sectionRef,
  trackViewportRef,
  trackRef,
  sliderThumbRef,
}: CertificationsTimelineArgs) {
  useGSAP(
    () => {
      const section = sectionRef.current;
      const viewport = trackViewportRef.current;
      const track = trackRef.current;
      const thumb = sliderThumbRef.current;

      if (!section || !viewport || !track) return;

      if (!isPinned) {
        gsap.set(track, { clearProps: "transform" });
        if (thumb) gsap.set(thumb, { clearProps: "transform" });
        ScrollTrigger.refresh();
        return;
      }

      const cards = gsap.utils.toArray<HTMLElement>("[data-cert-card], .cert-card", section);
      const noiseOverlays = gsap.utils.toArray<HTMLElement>(".noise-overlay", section);
      const scannerLines = gsap.utils.toArray<HTMLElement>(".cert-scanner-line", section);

      gsap.fromTo(section, {
        y: 56,
        opacity: 0.92,
      }, {
        y: 0,
        opacity: 1,
        ease: "power2.out",
        scrollTrigger: {
          trigger: section,
          start: "top 92%",
          end: "top top",
          scrub: 0.9,
          invalidateOnRefresh: true,
        },
      });

      gsap.set(viewport, { opacity: 1 });
      gsap.set(track, { x: 0 });
      gsap.set(cards, { opacity: 1, y: 0 });
      gsap.set(noiseOverlays, { yPercent: 0, opacity: 1 });
      gsap.set(scannerLines, { yPercent: 0, opacity: 0.9 });

      const getTravel = () => {
        const maxTravel = track.scrollWidth - viewport.clientWidth;
        return Math.max(0, maxTravel);
      };

      const getThumbTravel = () => {
        if (!thumb?.parentElement) return 0;
        return Math.max(0, thumb.parentElement.clientWidth - thumb.offsetWidth - 16);
      };

      const revealDuration = 0.42;
      const scrollDuration = 1;
      const holdDuration = 0.25;

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: () => `+=${Math.max(window.innerHeight * 2.3, getTravel() + window.innerHeight * 1.45)}`,
          pin: true,
          scrub: 1.15,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            if (!thumb) return;
            const horizontalProgress = Math.max(0, (self.progress - revealDuration) / scrollDuration);
            gsap.set(thumb, { x: Math.min(1, horizontalProgress) * getThumbTravel() });
          },
        },
      });

      tl.to(noiseOverlays, {
        yPercent: 112,
        opacity: 0,
        duration: revealDuration,
        ease: "power2.inOut",
      }, 0)
        .to(scannerLines, {
          yPercent: 520,
          opacity: 0,
          duration: revealDuration,
          ease: "power2.inOut",
        }, 0)
        .fromTo(cards, {
          filter: "brightness(0.72)",
        }, {
          filter: "brightness(1)",
          duration: revealDuration,
          ease: "power2.out",
        }, 0.08)
        .to(track, {
          x: () => -getTravel(),
          duration: scrollDuration,
          ease: "none",
        }, revealDuration)
        .to(track, {
          x: () => -getTravel(),
          duration: holdDuration,
          ease: "none",
        }, revealDuration + scrollDuration);

      const refreshAll = () => {
        ScrollTrigger.sort();
        ScrollTrigger.refresh();
      };

      refreshAll();
      window.addEventListener("load", refreshAll);
      const t1 = window.setTimeout(refreshAll, 120);
      const t2 = window.setTimeout(refreshAll, 700);

      return () => {
        window.removeEventListener("load", refreshAll);
        window.clearTimeout(t1);
        window.clearTimeout(t2);
        tl.kill();
      };
    },
    {
      scope: sectionRef,
      dependencies: [isPinned],
      revertOnUpdate: true,
    }
  );
}
