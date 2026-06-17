"use client";

import dynamic from "next/dynamic";
import { useLowEndDevice } from "@/hooks/useLowEndDevice";

const CustomCursor = dynamic(() => import("./CustomCursor"), { ssr: false });

export default function ClientOnlyCustomCursor() {
  const isLowEnd = useLowEndDevice();

  if (isLowEnd) return null;

  return <CustomCursor />;
}
