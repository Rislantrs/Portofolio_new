"use client";

import { useSyncExternalStore } from "react";

function getLowEndSnapshot() {
  if (typeof window === "undefined") return false;

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  return reduceMotion;
}

function subscribeToDeviceChanges(callback: () => void) {
  if (typeof window === "undefined") return () => {};

  const reduceMotionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
  reduceMotionQuery.addEventListener("change", callback);

  return () => {
    reduceMotionQuery.removeEventListener("change", callback);
  };
}

export function useLowEndDevice() {
  return useSyncExternalStore(subscribeToDeviceChanges, getLowEndSnapshot, () => false);
}

