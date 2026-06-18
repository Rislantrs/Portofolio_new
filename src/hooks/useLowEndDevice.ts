"use client";

import { useEffect, useState } from "react";
import { performanceConfig } from "@/lib/siteConfig";

type NavigatorWithHints = Navigator & {
  connection?: {
    saveData?: boolean;
  };
  deviceMemory?: number;
};

export type DeviceTier = "full" | "tablet" | "mobile" | "lite";

export type DeviceMode = {
  isMobile: boolean;
  isTablet: boolean;
  isTouchOnly: boolean;
  isLiteMode: boolean;
  tier: DeviceTier;
};

const defaultMode: DeviceMode = {
  isMobile: false,
  isTablet: false,
  isTouchOnly: false,
  isLiteMode: false,
  tier: "full",
};

function detectDeviceMode(): DeviceMode {
  if (typeof window === "undefined") return defaultMode;

  const navigatorHints = navigator as NavigatorWithHints;
  const hasMatchMedia = typeof window.matchMedia === "function";
  const matches = (query: string) => hasMatchMedia && window.matchMedia(query).matches;

  const width = window.innerWidth || document.documentElement.clientWidth || 0;
  const isTouchOnly = matches("(pointer: coarse)") && matches("(hover: none)");
  const isPhoneViewport = width <= performanceConfig.mobileMax;
  const isMobile = isPhoneViewport || (isTouchOnly && width <= performanceConfig.mobileMax);
  const isTablet = !isMobile && (width <= performanceConfig.tabletMax || (isTouchOnly && width <= 1180));

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
  const tier: DeviceTier = isLiteMode ? "lite" : isMobile ? "mobile" : isTablet ? "tablet" : "full";

  return { isMobile, isTablet, isTouchOnly, isLiteMode, tier };
}

export function useLowEndDevice(): DeviceMode {
  const [mode, setMode] = useState<DeviceMode>(defaultMode);

  useEffect(() => {
    const reducedMotionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const coarsePointerQuery = window.matchMedia("(pointer: coarse)");
    const noHoverQuery = window.matchMedia("(hover: none)");

    const detect = () => setMode(detectDeviceMode());
    detect();

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

  return mode;
}
