"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import gsap from "gsap";

interface PreloaderProps {
  onComplete: () => void;
}

export default function Preloader({ onComplete }: PreloaderProps) {
  const [progress, setProgress] = useState<number>(0);
  const [maskSize, setMaskSize] = useState<number>(0); // Initialize to 0 so the screen is completely solid during loading!

  useEffect(() => {
    const ctx = gsap.context(() => {
      const obj = { val: 0 };
      
      // Animate percentage and loading ring
      gsap.to(obj, {
        val: 100,
        duration: 2.8,
        ease: "power2.out",
        onUpdate: () => {
          setProgress(Math.round(obj.val));
        },
        onComplete: () => {
          const tl = gsap.timeline({
            onComplete: () => {
              onComplete();
            },
          });

          // 1. Shrink and fade out the central logo badge to 0
          tl.to("#logo-badge", {
            scale: 0,
            opacity: 0,
            duration: 0.45,
            ease: "back.in(1.5)",
          });

          // Smoothly fade out the loading ring & particle bead
          tl.to(
            ["#progress-svg", "#orbit-bead"],
            {
              opacity: 0,
              scale: 0.8,
              duration: 0.3,
            },
            "-=0.4"
          );

          // 2. Spectacular Lando Norris / MotoGP style expansion!
          // We animate the circular mask hole radius from 0 to 2200px
          // This starts exactly from the center point and scales up majestically,
          // perfectly hiding any background gaps during the loading phase!
          const maskObj = { val: 0 };
          tl.to(
            maskObj,
            {
              val: 2200, // Expands way past screen bounds to fully reveal portfolio
              duration: 1.3,
              ease: "power4.inOut",
              onUpdate: () => {
                setMaskSize(maskObj.val);
              },
            },
            "-=0.25" // Beautiful overlap with the logo shrink
          );
        },
      });
    });

    return () => ctx.revert();
  }, [onComplete]);

  // Circumference for r=46 is 2 * PI * 46 ≈ 289.03
  const strokeDashoffset = 289.03 - (289.03 * progress) / 100;

  // Let the logo brightness, contrast, and scale increase dynamically with loading progress!
  const logoOpacity = 0.4 + (0.6 * progress) / 100;
  const logoScale = 1.10 + (0.05 * progress) / 100; // starts at 1.10, ends at 1.15 to crop perfectly
  const glowOpacity = (progress / 100) * 0.15; // grows from 0 to 0.15

  return (
    <div
      id="preloader-screen"
      className="fixed inset-0 w-full h-full z-[9999] flex items-center justify-center overflow-hidden pointer-events-none"
    >
      {/* 
        Lando Norris / MotoGP Style Masked Cover Screen.
        By starting maskSize at 0px, the screen is 100% solid and beautiful during loading, 
        preventing any visual leakage as the logo floats/breathes!
      */}
      <div
        id="preloader-cover"
        className="absolute inset-0 w-full h-full bg-[#f4f4f4] pointer-events-auto"
        style={{
          backgroundImage: "radial-gradient(#d3cdc3 1px, transparent 1px)",
          backgroundSize: "24px 24px",
          backgroundPosition: "center",
          WebkitMaskImage: `radial-gradient(circle, transparent ${maskSize}px, black ${maskSize + 0.5}px)`,
          maskImage: `radial-gradient(circle, transparent ${maskSize}px, black ${maskSize + 0.5}px)`,
        }}
      >
        {/* Subtle luxury paper grain overlay inside the cover */}
        <div 
          className="absolute inset-0 opacity-[0.03] bg-repeat pointer-events-none" 
          style={{ 
            backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 200 200\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noiseFilter\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.8\' numOctaves=\'3\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noiseFilter)\'/%3E%3C/svg%3E")' 
          }} 
        />
      </div>

      {/* 
        The logo and loading elements container.
        Sits exactly in the center, perfectly matching the mask cutout hole.
      */}
      <div id="logo-container" className="relative flex items-center justify-center w-64 h-64 md:w-80 md:h-80 pointer-events-auto">
        
        {/* Soft elegant golden glow that brightens dynamically */}
        <div 
          className="absolute inset-0 bg-accent/30 rounded-full blur-3xl scale-95 transition-opacity duration-150" 
          style={{ opacity: glowOpacity }}
        />

        {/* SVG Circular Progress Ring */}
        <svg id="progress-svg" className="absolute inset-0 w-full h-full -rotate-90 z-20" viewBox="0 0 100 100">
          <circle
            cx="50"
            cy="50"
            r="46"
            className="stroke-black/5"
            strokeWidth="0.8"
            fill="transparent"
          />
          <circle
            cx="50"
            cy="50"
            r="46"
            className="stroke-[#111111]"
            strokeWidth="1.2"
            fill="transparent"
            strokeDasharray="289.03"
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            style={{
              filter: "drop-shadow(0 0 4px rgba(0, 0, 0, 0.28))",
              transition: "stroke-dashoffset 0.08s ease-out",
            }}
          />
        </svg>

        {/* Orbiting luxury gold bead */}
        <div 
          id="orbit-bead"
          className="absolute w-full h-full z-30 pointer-events-none transition-transform duration-75 ease-out"
          style={{ 
            transform: `rotate(${(progress * 3.6)}deg)` 
          }}
        >
          <div 
            className="absolute top-[2.2%] left-1/2 -translate-x-1/2 w-[6px] h-[6px] rounded-full bg-white shadow-[0_0_6px_rgba(0,0,0,0.25),0_1px_2px_rgba(0,0,0,0.15)] border border-black"
          />
        </div>

        {/* Logo container: circular clip, deep shadow, high contrast warm off-white backing */}
        <div 
          id="logo-badge"
          className="relative w-44 h-44 md:w-56 md:h-56 rounded-full overflow-hidden bg-[#f4f4f4] shadow-[0_16px_36px_rgba(0,0,0,0.12),inset_0_2px_4px_rgba(255,255,255,0.6)] flex items-center justify-center z-10 border border-black/5 animate-bounce-slow"
        >
          <Image
            src="/assets/Loading_logo_compressed.webp"
            alt="Loading Logo"
            fill
            sizes="(min-width: 768px) 224px, 176px"
            className="object-cover"
            style={{ 
              transform: `scale(${logoScale})`,
              opacity: logoOpacity,
              filter: `brightness(${0.6 + (0.4 * progress) / 100}) contrast(${1.0 + (0.1 * progress) / 100})`
            }}
          />
        </div>
      </div>
    </div>
  );
}
