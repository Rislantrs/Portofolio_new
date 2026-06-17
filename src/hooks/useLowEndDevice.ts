"use client";

import { useSyncExternalStore } from "react";
import { performanceConfig } from "@/lib/siteConfig";

function getLowEndSnapshot() {
  if (typeof window === "undefined") return true;

  const nav = window.navigator as Navigator & {
    deviceMemory?: number;
    hardwareConcurrency?: number;
  };

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const coarsePointer = window.matchMedia("(pointer: coarse)").matches;
  const smallScreen = window.innerWidth <= performanceConfig.smallScreenMax;
  const mobileScreen = window.innerWidth <= performanceConfig.mobileMax;
  const lowMemory =
    typeof nav.deviceMemory === "number" &&
    nav.deviceMemory <= performanceConfig.lowMemoryGB;
  const lowCpu =
    typeof nav.hardwareConcurrency === "number" &&
    nav.hardwareConcurrency <= performanceConfig.lowCpuCores;

  return reduceMotion || coarsePointer || smallScreen || mobileScreen || lowMemory || lowCpu;
}

function subscribeToDeviceChanges(callback: () => void) {
  if (typeof window === "undefined") return () => {};

  const reduceMotionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
  const pointerQuery = window.matchMedia("(pointer: coarse)");

  window.addEventListener("resize", callback);
  reduceMotionQuery.addEventListener("change", callback);
  pointerQuery.addEventListener("change", callback);

  return () => {
    window.removeEventListener("resize", callback);
    reduceMotionQuery.removeEventListener("change", callback);
    pointerQuery.removeEventListener("change", callback);
  };
}

export function useLowEndDevice() {
  return useSyncExternalStore(subscribeToDeviceChanges, getLowEndSnapshot, () => true);
}
