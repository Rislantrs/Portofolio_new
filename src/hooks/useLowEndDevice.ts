"use client";

import { useEffect, useState } from "react";

export function useLowEndDevice() {
  const [isLowEnd, setIsLowEnd] = useState(false);

  useEffect(() => {
    const nav = window.navigator as Navigator & {
      deviceMemory?: number;
      hardwareConcurrency?: number;
    };

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const coarsePointer = window.matchMedia("(pointer: coarse)").matches;
    const lowMemory = typeof nav.deviceMemory === "number" && nav.deviceMemory <= 4;
    const lowCpu =
      typeof nav.hardwareConcurrency === "number" && nav.hardwareConcurrency <= 4;

    setIsLowEnd(reduceMotion || coarsePointer || lowMemory || lowCpu);
  }, []);

  return isLowEnd;
}
