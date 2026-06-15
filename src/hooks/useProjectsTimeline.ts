"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

type ProjectsTimelineArgs = {
  columns: number;
  isPinned: boolean;
  pagesLength: number;
  sectionRef: React.RefObject<HTMLDivElement | null>;
  stageRef: React.RefObject<HTMLDivElement | null>;
  teaserRef: React.RefObject<HTMLDivElement | null>;
  teaserLogoRef: React.RefObject<HTMLDivElement | null>;
  teaserTextRef: React.RefObject<HTMLDivElement | null>;
  pageRefs: React.RefObject<(HTMLDivElement | null)[]>;
};

export function useProjectsTimeline({
  columns,
  isPinned,
  pagesLength,
  sectionRef,
  stageRef,
  teaserRef,
  teaserLogoRef,
  teaserTextRef,
  pageRefs,
}: ProjectsTimelineArgs) {
  useGSAP(
    () => {
      const section = sectionRef.current;
      const stage = stageRef.current;
      const teaser = teaserRef.current;
      const teaserLogo = teaserLogoRef.current;
      const teaserText = teaserTextRef.current;
      const pages = pageRefs.current.filter(Boolean) as HTMLDivElement[];

      if (!section || !stage) return;

      if (!isPinned) {
        gsap.set(stage, { opacity: 1, clearProps: "transform" });
        if (teaser) gsap.set(teaser, { autoAlpha: 0, pointerEvents: "none" });
        pages.forEach((page) => gsap.set(page, { autoAlpha: 1, pointerEvents: "auto", clearProps: "transform" }));
        ScrollTrigger.refresh();
        return;
      }

      const cards = gsap.utils.toArray<HTMLElement>(".proj-card", section);
      const scrollBudget = Math.max(3.2, pagesLength * 1.15 + 2.2);

      gsap.set(stage, { opacity: 0 });
      if (teaser) gsap.set(teaser, { autoAlpha: 1, pointerEvents: "none" });
      if (teaserLogo) gsap.set(teaserLogo, { opacity: 0, scale: 0.18, x: 0 });
      if (teaserText) gsap.set(teaserText, { x: "100vw", opacity: 1 });

      pages.forEach((page, index) => {
        gsap.set(page, {
          autoAlpha: index === 0 ? 1 : 0,
          pointerEvents: index === 0 ? "auto" : "none",
          xPercent: index === 0 ? 0 : 8,
          scale: index === 0 ? 1 : 0.985,
        });
      });

      gsap.set(cards, { opacity: 0, y: 42, scale: 0.965 });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: `+=${Math.round(window.innerHeight * scrollBudget)}`,
          pin: true,
          scrub: 1.25,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      });

      if (teaser) {
        tl.to(teaser, { backgroundColor: "#1e1a16", duration: 0.35, ease: "power1.inOut" }, 0)
          .to(teaser, { backgroundColor: "#ffffff", duration: 0.42, ease: "power1.inOut" }, 0.22);
      }

      if (teaserLogo) {
        tl.to(teaserLogo, { opacity: 1, scale: 1, duration: 0.6, ease: "power3.out" }, 0.18)
          .to(teaserLogo, { x: "125vw", opacity: 0, scale: 0.62, duration: 1.15, ease: "power2.inOut" }, 0.78);
      }

      if (teaserText) {
        tl.fromTo(
          teaserText,
          { x: "100vw" },
          { x: "-150%", duration: 1.8, ease: "none" },
          0.72
        );
      }

      if (teaser) {
        tl.to(teaser, { backgroundColor: "#050505", autoAlpha: 0, duration: 0.55, ease: "power2.inOut" }, 2.55);
      }

      tl.to(stage, { opacity: 1, duration: 0.5, ease: "power2.out" }, 2.7)
        .to(cards, { opacity: 1, y: 0, scale: 1, stagger: 0.035, duration: 0.5, ease: "power3.out" }, 3.6);

      pages.forEach((page, index) => {
        if (index === 0) return;

        const at = 3.5 + index * 0.8;
        const previous = pages[index - 1];

        tl.to(previous, {
          autoAlpha: 0,
          xPercent: -8,
          scale: 0.985,
          pointerEvents: "none",
          duration: 0.42,
          ease: "power2.inOut",
        }, at)
          .to(page, {
            autoAlpha: 1,
            xPercent: 0,
            scale: 1,
            pointerEvents: "auto",
            duration: 0.42,
            ease: "power2.inOut",
          }, at + 0.02)
          .fromTo(
            page.querySelectorAll(".proj-card"),
            { opacity: 0, y: 34, scale: 0.97 },
            { opacity: 1, y: 0, scale: 1, stagger: 0.035, duration: 0.36, ease: "power3.out" },
            at + 0.08
          );
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
      dependencies: [columns, isPinned, pagesLength],
      revertOnUpdate: true,
    }
  );
}
