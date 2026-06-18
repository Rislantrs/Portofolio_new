"use client";

import { useEffect, useState } from "react";
import { performanceConfig } from "@/lib/siteConfig";

type NavigatorWithHints = Navigator & {
  connection?: {
    saveData?: boolean;
  };
  deviceMemory?: number;
};

export function useLowEndDevice() {
  const [isLowEnd, setIsLowEnd] = useState(false);

  useEffect(() => {
    const reducedMotionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const coarsePointerQuery = window.matchMedia("(pointer: coarse)");

    const detect = () => {
      const navigatorHints = navigator as NavigatorWithHints;
      const lowMemory =
        typeof navigatorHints.deviceMemory === "number" &&
        navigatorHints.deviceMemory <= performanceConfig.lowMemoryGB;
      const lowCpu =
        typeof navigator.hardwareConcurrency === "number" &&
        navigator.hardwareConcurrency <= performanceConfig.lowCpuCores;
      const constrainedViewport = window.innerWidth <= performanceConfig.mobileMax;
      const touchFirstDevice =
        coarsePointerQuery.matches && !performanceConfig.enableCustomCursorOnTouch;

      setIsLowEnd(
        reducedMotionQuery.matches ||
          touchFirstDevice ||
          constrainedViewport ||
          lowMemory ||
          lowCpu ||
          navigatorHints.connection?.saveData === true,
      );
    };

    detect();

    reducedMotionQuery.addEventListener("change", detect);
    coarsePointerQuery.addEventListener("change", detect);
    window.addEventListener("resize", detect);

    return () => {
      reducedMotionQuery.removeEventListener("change", detect);
      coarsePointerQuery.removeEventListener("change", detect);
      window.removeEventListener("resize", detect);
    };
  }, []);

  return isLowEnd;
}

