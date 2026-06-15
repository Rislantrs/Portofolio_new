"use client";

import { useEffect, useRef } from "react";

export default function InkCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d");
    if (!canvas || !context) return;

    let frameId = 0;
    let width = 0;
    let height = 0;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      width = Math.max(1, Math.floor(rect.width));
      height = Math.max(1, Math.floor(rect.height));
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      context.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const draw = (time: number) => {
      const t = time * 0.001;
      context.clearRect(0, 0, width, height);

      for (let i = 0; i < 5; i += 1) {
        const x = width * (0.18 + i * 0.16) + Math.sin(t * 0.45 + i) * 24;
        const y = height * (0.42 + Math.sin(t * 0.32 + i * 1.7) * 0.18);
        const radius = Math.max(width, height) * (0.12 + i * 0.012);
        const gradient = context.createRadialGradient(x, y, 0, x, y, radius);

        gradient.addColorStop(0, "rgba(255,255,255,0.045)");
        gradient.addColorStop(0.48, "rgba(255,255,255,0.015)");
        gradient.addColorStop(1, "rgba(255,255,255,0)");

        context.fillStyle = gradient;
        context.beginPath();
        context.arc(x, y, radius, 0, Math.PI * 2);
        context.fill();
      }

      frameId = requestAnimationFrame(draw);
    };

    resize();
    window.addEventListener("resize", resize);
    frameId = requestAnimationFrame(draw);

    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(frameId);
    };
  }, []);

  return <canvas ref={canvasRef} className="h-full w-full opacity-80" aria-hidden="true" />;
}
