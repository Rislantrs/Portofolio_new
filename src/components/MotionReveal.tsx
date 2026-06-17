"use client";

import { motion } from "framer-motion";
import { useLowEndDevice } from "@/hooks/useLowEndDevice";

type MotionRevealProps = {
  children: React.ReactNode;
  className?: string;
  id?: string;
  y?: number;
  duration?: number;
  delay?: number;
  margin?: string;
};

export default function MotionReveal({
  children,
  className,
  id,
  y = 24,
  duration = 0.7,
  delay = 0,
  margin = "-80px",
}: MotionRevealProps) {
  const reduceMotion = useLowEndDevice();

  if (reduceMotion) {
    return (
      <div id={id} className={className}>
        {children}
      </div>
    );
  }

  return (
    <motion.div
      id={id}
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin }}
      transition={{ duration, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  );
}
