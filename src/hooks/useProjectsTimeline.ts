"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ProjectArticle } from "@/lib/projects";

gsap.registerPlugin(ScrollTrigger);

type ProjectsTimelineArgs = {
  columns: number;
  isPinned: boolean;
  pagesLength: number;
  projectList: ProjectArticle[];
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
  projectList,
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

      const scrollBudget = Math.max(3.4, pagesLength * 1.15 + 2.2);
      const getPageCards = (page: HTMLDivElement) => gsap.utils.toArray<HTMLElement>(".proj-card", page);
      const getColumn = (index: number) => (columns > 0 ? index % columns : index % 3);
      const isShortLastRow = (index: number, total: number) => {
        const rest = columns > 1 ? total % columns : 0;
        return rest > 0 && index >= total - rest;
      };
      const getEnterVars = (index: number, total: number) => {
        const column = getColumn(index);
        const shortRow = isShortLastRow(index, total);

        if (columns === 3) {
          return column === 1
            ? { opacity: 0, x: 0, y: shortRow ? 82 : 108, scale: 0.965 }
            : { opacity: 0, x: 0, y: shortRow ? -74 : -104, scale: 0.965 };
        }

        if (columns === 2) {
          return {
            opacity: 0,
            x: shortRow ? (column === 0 ? -34 : 34) : 0,
            y: column === 0 ? -96 : -82,
            scale: 0.965,
          };
        }

        return { opacity: 0, x: 0, y: index % 2 === 0 ? -78 : 78, scale: 0.965 };
      };
      const getFinalExitVars = (index: number, total: number) => {
        const column = getColumn(index);
        const shortRow = isShortLastRow(index, total);

        if (columns === 3) {
          if (column === 1) return { opacity: 0, x: 0, y: -150, scale: 0.955 };
          return { opacity: 0, x: column === 0 ? -170 : 170, y: shortRow ? 16 : 0, scale: 0.955 };
        }

        if (columns === 2) {
          return {
            opacity: 0,
            x: column === 0 ? -160 : 160,
            y: shortRow ? 14 : 0,
            scale: 0.955,
          };
        }

        return { opacity: 0, x: 0, y: -130, scale: 0.955 };
      };
      const primePageCards = (page: HTMLDivElement) => {
        const pageCards = getPageCards(page);
        pageCards.forEach((card, index) => gsap.set(card, getEnterVars(index, pageCards.length)));
      };
      const animatePageIn = (tl: gsap.core.Timeline, page: HTMLDivElement, at: number) => {
        const pageCards = getPageCards(page);
        const stagger = pageCards.length % Math.max(columns, 1) === 0 ? 0.035 : 0.046;

        pageCards.forEach((card, index) => {
          tl.to(
            card,
            {
              opacity: 1,
              x: 0,
              y: 0,
              scale: 1,
              duration: 0.48,
              ease: "power3.out",
            },
            at + index * stagger
          );
        });
      };
      const animateFinalPageOut = (tl: gsap.core.Timeline, page: HTMLDivElement, at: number) => {
        const pageCards = getPageCards(page);
        const stagger = pageCards.length % Math.max(columns, 1) === 0 ? 0.026 : 0.038;

        pageCards.forEach((card, index) => {
          tl.to(
            card,
            {
              ...getFinalExitVars(index, pageCards.length),
              duration: 0.43,
              ease: "power2.inOut",
            },
            at + index * stagger
          );
        });
      };

      gsap.set(stage, { opacity: 0 });
      if (teaser) gsap.set(teaser, { autoAlpha: 1, pointerEvents: "none" });
      if (teaserLogo) gsap.set(teaserLogo, { opacity: 0, scale: 0.18, x: 0 });
      if (teaserText) gsap.set(teaserText, { x: "100vw", opacity: 1 });

      pages.forEach((page, index) => {
        gsap.set(page, {
          autoAlpha: index === 0 ? 1 : 0,
          pointerEvents: index === 0 ? "auto" : "none",
          xPercent: 0,
          scale: 1,
        });
        primePageCards(page);
      });

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
        tl.to(teaserLogo, { opacity: 1, scale: 1, duration: 0.5, ease: "power3.out" }, 0.18)
          .to(teaserLogo, { x: "120vw", scale: 0.65, duration: 0.9, ease: "power2.inOut" }, 1.1)
          .to(teaserLogo, { opacity: 0, duration: 0.4, ease: "power2.in" }, 1.15);
      }

      if (teaserText) {
        tl.fromTo(
          teaserText,
          { x: "100vw" },
          { x: "-150%", duration: 1.28, ease: "none" },
          0.72
        );
      }

      if (teaser) {
        tl.to(teaser, { backgroundColor: "#050505", autoAlpha: 0, duration: 0.3, ease: "power2.inOut" }, 1.6);
      }

      tl.to(stage, { opacity: 1, duration: 0.3, ease: "power2.out" }, 1.65);

      if (pages[0]) {
        animatePageIn(tl, pages[0], 2.05);
      }

      pages.forEach((page, index) => {
        if (index === 0) return;

        const at = 2.78 + (index - 1) * 1.02;
        const previous = pages[index - 1];

        tl.to(previous, {
          autoAlpha: 0,
          pointerEvents: "none",
          duration: 0.24,
          ease: "power1.out",
        }, at)
          .set(page, {
            autoAlpha: 1,
            pointerEvents: "auto",
          }, at + 0.12);
        primePageCards(page);
        animatePageIn(tl, page, at + 0.16);
      });

      const lastPage = pages[pages.length - 1];
      if (lastPage) {
        const finalExitAt = 2.92 + Math.max(0, pages.length - 1) * 1.02;
        animateFinalPageOut(tl, lastPage, finalExitAt);
        tl.set(lastPage, { pointerEvents: "none" }, finalExitAt)
          .to(lastPage, { autoAlpha: 0, duration: 0.2, ease: "power1.out" }, finalExitAt + 0.58);
      }

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
      dependencies: [columns, isPinned, pagesLength, projectList],
      revertOnUpdate: true,
    }
  );
}
