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
      const mobileViewport = window.innerWidth <= performanceConfig.mobileMax;
      const tabletViewport = window.innerWidth <= 1024;
      const mobileLikeDevice = coarsePointerQuery.matches && tabletViewport;
      const constrainedMobileHardware = (lowMemory || lowCpu) && tabletViewport;

      setIsLowEnd(
        reducedMotionQuery.matches ||
          navigatorHints.connection?.saveData === true ||
          mobileViewport ||
          mobileLikeDevice ||
          constrainedMobileHardware,
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

