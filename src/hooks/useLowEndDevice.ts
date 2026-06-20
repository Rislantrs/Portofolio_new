"use client";

import { useEffect, useState } from "react";
import { performanceConfig } from "@/lib/siteConfig";

type NavigatorWithHints = Navigator & {
  connection?: {
    saveData?: boolean;
  };
  deviceMemory?: number;
};

export function useLowEndDevice(): boolean {
  const [isLowEnd, setIsLowEnd] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const navigatorHints = navigator as NavigatorWithHints;
    const hasMatchMedia = typeof window.matchMedia === "function";
    const matches = (query: string) => hasMatchMedia && window.matchMedia(query).matches;

    const detect = () => {
      const width = window.innerWidth || document.documentElement.clientWidth || 0;
      const isTouchOnly = matches("(pointer: coarse)") && matches("(hover: none)");
      const isPhoneViewport = width <= performanceConfig.mobileMax;
      const isMobile = isPhoneViewport || (isTouchOnly && width <= performanceConfig.mobileMax);

      const lowMemory =
        typeof navigatorHints.deviceMemory === "number" &&
        navigatorHints.deviceMemory <= performanceConfig.lowMemoryGB;
      const lowCpu =
        typeof navigator.hardwareConcurrency === "number" &&
        navigator.hardwareConcurrency <= performanceConfig.lowCpuCores;

      const isLiteMode =
        matches("(prefers-reduced-motion: reduce)") ||
        navigatorHints.connection?.saveData === true ||
        ((lowMemory || lowCpu) && isMobile);

      setIsLowEnd(isLiteMode);
    };

    detect();

    const reducedMotionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const coarsePointerQuery = window.matchMedia("(pointer: coarse)");
    const noHoverQuery = window.matchMedia("(hover: none)");

    reducedMotionQuery.addEventListener("change", detect);
    coarsePointerQuery.addEventListener("change", detect);
    noHoverQuery.addEventListener("change", detect);
    window.addEventListener("resize", detect);

    return () => {
      reducedMotionQuery.removeEventListener("change", detect);
      coarsePointerQuery.removeEventListener("change", detect);
      noHoverQuery.removeEventListener("change", detect);
      window.removeEventListener("resize", detect);
    };
  }, []);

  return isLowEnd;
}
