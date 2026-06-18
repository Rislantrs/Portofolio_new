"use client";

import dynamic from "next/dynamic";
import { useLowEndDevice } from "@/hooks/useLowEndDevice";

const CustomCursor = dynamic(() => import("./CustomCursor"), { ssr: false });

export default function ClientOnlyCustomCursor() {
  const { isLiteMode, isTouchOnly } = useLowEndDevice();

  if (isTouchOnly || isLiteMode) return null;

  return <CustomCursor />;
}
