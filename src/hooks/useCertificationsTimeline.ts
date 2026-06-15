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

      gsap.set(viewport, { opacity: 1 });
      gsap.set(track, { x: 0 });
      gsap.set(cards, { opacity: 1, y: 0 });

      const getTravel = () => {
        const maxTravel = track.scrollWidth - viewport.clientWidth;
        return Math.max(0, maxTravel);
      };

      const getThumbTravel = () => {
        if (!thumb?.parentElement) return 0;
        return Math.max(0, thumb.parentElement.clientWidth - thumb.offsetWidth - 16);
      };

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: () => `+=${Math.max(window.innerHeight * 1.6, getTravel() + window.innerHeight * 0.8)}`,
          pin: true,
          scrub: 1.15,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            if (!thumb) return;
            gsap.set(thumb, { x: self.progress * getThumbTravel() });
          },
        },
      });

      tl.to(track, {
        x: () => -getTravel(),
        duration: 1,
        ease: "none",
      });

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
