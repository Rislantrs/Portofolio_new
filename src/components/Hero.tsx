"use client";

import Image from "next/image";
import dynamic from "next/dynamic";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useLowEndDevice } from "@/hooks/useLowEndDevice";

gsap.registerPlugin(ScrollTrigger);

const InkCanvas = dynamic(() => import("./InkCanvas"), {
  ssr: false,
});

// ─── Organic blob path generator (Supports oblong/oval shapes with physical liquid dynamics) ────────────────
function makeBlobPath(
  cx: number, cy: number, radiusX: number, radiusY: number,
  t: number, phase = 0, pts = 12,
  vx = 0, vy = 0, wobble = 0
): string {
  const step = (Math.PI * 2) / pts;
  const verts: [number, number][] = [];
  
  const speed = Math.sqrt(vx * vx + vy * vy);
  
  // Calculate travel angle. If almost stationary, default to 0 or phase offset
  const travelAngle = speed > 0.001 ? Math.atan2(vy, vx) : phase;
  
  // Stretch along velocity, squeeze perpendicular to preserve volume
  // Gentle stretch factor (max 1.24x) keeps the shape organic and rounded (kadang membulat)
  const stretchFactor = 1.0 + Math.min(0.24, speed * 8.0);
  const squeezeFactor = 1.0 / Math.sqrt(stretchFactor);
  
  // Wobble and speed increase the noise wave intensity and speed
  // A lower baseline scale of 0.13 (was 0.22) makes stationary fluids perfectly smooth and rounded, like a puddle!
  const noiseScale = 0.13 * (1.0 + wobble * 2.2 + speed * 4.5);
  const dynamicT = t * 0.9 + speed * 12.0 + wobble * 5.0;

  for (let i = 0; i < pts; i++) {
    const a = i * step - Math.PI / 2;
    
    // Wave deformation (Using clean integer harmonics for perfect seamless loop, no creases or spikes!)
    const n = 1
      + Math.sin(a * 2 + dynamicT + phase)        * noiseScale
      + Math.cos(a * 3 - dynamicT * 0.7 + phase * 1.5)  * (noiseScale * 0.60)
      + Math.sin(a * 1 + dynamicT * 1.2 + phase * 0.8)  * (noiseScale * 0.40);
      
    // Local coordinates oriented along velocity axis
    const localA = a - travelAngle;
    const lx = Math.cos(localA) * radiusX * stretchFactor;
    const ly = Math.sin(localA) * radiusY * squeezeFactor;
    
    // Rotate back to world coordinates
    const rx_rot = lx * Math.cos(travelAngle) - ly * Math.sin(travelAngle);
    const ry_rot = lx * Math.sin(travelAngle) + ly * Math.cos(travelAngle);
    
    verts.push([cx + rx_rot * n, cy + ry_rot * n]);
  }
  const N = verts.length;
  let d = `M ${verts[0][0].toFixed(1)},${verts[0][1].toFixed(1)}`;
  for (let i = 0; i < N; i++) {
    const p = verts[i], nx = verts[(i + 1) % N];
    const pp = verts[(i - 1 + N) % N], nn = verts[(i + 2) % N];
    const c1x = p[0] + (nx[0] - pp[0]) / 6, c1y = p[1] + (nx[1] - pp[1]) / 6;
    const c2x = nx[0] - (nn[0] - p[0]) / 6, c2y = nx[1] - (nn[1] - p[1]) / 6;
    d += ` C ${c1x.toFixed(1)},${c1y.toFixed(1)} ${c2x.toFixed(1)},${c2y.toFixed(1)} ${nx[0].toFixed(1)},${nx[1].toFixed(1)}`;
  }
  return d + " Z";
}

function lerp(a: number, b: number, t: number) { return a + (b - a) * t; }
function clamp01(v: number) { return Math.max(0, Math.min(1, v)); }
function setOpacity(el: HTMLElement | null, v: number) {
  if (el) el.style.opacity = v.toFixed(3);
}
function getOpacity(el: HTMLElement | null) {
  return el ? parseFloat(el.style.opacity || "0") : 0;
}

function HeroImage({
  src,
  alt,
  priority = false,
}: {
  src: string;
  alt: string;
  priority?: boolean;
}) {
  return (
    <Image
      src={src}
      alt={alt}
      fill
      priority={priority}
      sizes="100vw"
      className="object-cover object-center"
    />
  );
}

export default function Hero() {
  const isLowEnd = useLowEndDevice();
  const containerRef = useRef<HTMLDivElement>(null);
  const imageRef     = useRef<HTMLDivElement>(null);

  // ── Portrait hover blob ─────────────────────────────────────────────────────
  const portraitPathRef  = useRef<SVGPathElement>(null);
  const portraitLayerRef = useRef<HTMLDivElement>(null);

  // ── BG blob (idle 1.5s+) ────────────────────────────────────────────────────
  const bgPathRef  = useRef<SVGPathElement>(null);
  const bgLayerRef = useRef<HTMLDivElement>(null);

  // ── 3 autonomous blobs (idle 3s+) ──────────────────────────────────────────
  const auto0Path  = useRef<SVGPathElement>(null);
  const auto1Path  = useRef<SVGPathElement>(null);
  const auto2Path  = useRef<SVGPathElement>(null);
  const auto0Layer = useRef<HTMLDivElement>(null);
  const auto1Layer = useRef<HTMLDivElement>(null);
  const auto2Layer = useRef<HTMLDivElement>(null);
  // Portrait reveals for auto blobs (Hero_Hover.png inside imageRef)
  const auto0PortraitLayer = useRef<HTMLDivElement>(null);
  const auto1PortraitLayer = useRef<HTMLDivElement>(null);
  const auto2PortraitLayer = useRef<HTMLDivElement>(null);

  const rafRef = useRef<number>(0);
  const tRef   = useRef(0);
  const lastLoopFrameRef = useRef(0);
  const scrollProgressRef = useRef(0); // simple number, updated by ScrollTrigger onUpdate

  // Smooth-lerped centers
  const portCX = useRef(0.5); const portCY = useRef(0.45);
  const bgCX   = useRef(0.5); const bgCY   = useRef(0.5);
  // Mouse
  const mouse = useRef({ nx: 0.5, ny: 0.5, lastMove: 0 });

  // ── 3D Interactive Parallax ─────────────────────────────────────────────────
  const tiltX = useRef(0);
  const tiltY = useRef(0);
  const transX = useRef(0);
  const transY = useRef(0);
  
  const isDesktopRef = useRef(false);

  // Physics tracking for hover fluid
  const hoverVx = useRef(0);
  const hoverVy = useRef(0);
  const hoverPrevCx = useRef(0.5);
  const hoverPrevCy = useRef(0.5);
  const hoverWobble = useRef(0);
  const hoverWobbleSpeed = useRef(0);
  const hoverPrevSpeed = useRef(0);
  const hoverScale = useRef(0); // Grow from small to large (dari kecil membesar)

  // Hover fluid trail history (bekas cairan)
  const hoverTrail = useRef<{ cx: number; cy: number; rx: number; ry: number; t: number; vx: number; vy: number; wobble: number }[]>([]);

  // Physics tracking for 3 idle fluids
  const idlePhysics = useRef({
    vx: [0, 0, 0],
    vy: [0, 0, 0],
    prevCx: [0.5, 0.5, 0.5],
    prevCy: [0.5, 0.5, 0.5],
    wobble: [0, 0, 0],
    wobbleSpeed: [0, 0, 0],
    prevSpeed: [0, 0, 0],
  });

  useEffect(() => {
    mouse.current.lastMove = performance.now();

    const mm = gsap.matchMedia();

    mm.add("(min-width: 1024px)", () => {
      isDesktopRef.current = true;

      // Entrance
      gsap.set(".hero-portrait-scale-wrapper", { transformOrigin: "bottom center" });
      gsap.timeline()
        .from(".hero-portrait-scale-wrapper", { scale: 0.97, duration: 1.2, ease: "power3.out" });

      // The single hero-shrink-frame contains ALL visual content.
      // On scroll, it shrinks like Lando Norris's website.
      const shrinkFrame = containerRef.current?.querySelector(".hero-shrink-frame");
      if (shrinkFrame) {
        gsap.set(shrinkFrame, { transformOrigin: "center center" });
      }

      if (shrinkFrame) {
        const morphTl = gsap.timeline({
          scrollTrigger: { 
            trigger: containerRef.current, 
            start: "top top", 
            end: "+=125%", 
            pin: true, 
            pinSpacing: true, 
            scrub: 1.2, 
            anticipatePin: 1,
            onUpdate: (self) => {
              scrollProgressRef.current = self.progress;
            },
          },
        });
        morphTl
          .to(containerRef.current, { backgroundColor: "#000000", ease: "power2.inOut", duration: 0.8 }, 0)
          .to(shrinkFrame, { scale: 0.55, borderRadius: "24px", ease: "power2.inOut", duration: 0.7 }, 0.1)
          .to(".hero-reveal-layer", { opacity: 1, ease: "power2.inOut", duration: 0.6 }, 0.1)
          .to(".base-hero-bg", { opacity: 1.0, ease: "power2.inOut", duration: 0.8 }, 0)
          .to(".hero-ink-canvas-wrapper", { opacity: 0, ease: "power2.inOut", duration: 0.5 }, 0)
          .to(".hero-signature", { clipPath: "inset(-100% -20% -100% 0)", opacity: 1, ease: "power1.inOut", duration: 0.7 }, 0.1);
      }
    });

    mm.add("(max-width: 1023px)", () => {
      isDesktopRef.current = false;

      // Mobile/tablet natural scroll entrance
      gsap.timeline()
        .from(".hero-portrait-scale-wrapper", { opacity: 0, duration: 1.2, ease: "power3.out" });
    });

    // ── Main animation loop ────────────────────────────────────────────────────
    const loop = (now: number) => {
      const frameInterval = 1000 / 45;
      if (lastLoopFrameRef.current && now - lastLoopFrameRef.current < frameInterval) {
        rafRef.current = requestAnimationFrame(loop);
        return;
      }

      const frameDelta = lastLoopFrameRef.current ? now - lastLoopFrameRef.current : 16.7;
      lastLoopFrameRef.current = now;
      tRef.current += 0.15 * Math.min(2.5, frameDelta / 16.7);
      const t = tRef.current;
      const sec = containerRef.current;
      if (!sec) { rafRef.current = requestAnimationFrame(loop); return; }

      const sw = sec.clientWidth;
      const sh = sec.clientHeight;
      const idleSec = (now - mouse.current.lastMove) / 1000;

      const progress = scrollProgressRef.current;
      const fluidFactor = clamp01(1 - progress * 2.5); // fluid effects are fully disabled past 40% scroll
      const isScrolled = progress > 0.08;

      // OPTIMIZATION: When scrolled down and fluid effects are hidden, completely skip heavy SVG math!
      if (progress > 0.15) {
        rafRef.current = requestAnimationFrame(loop);
        return;
      }

      // ── 1. PORTRAIT BLOB — mouse hover fluid ──────────────────────────────────
      const mouseActive = idleSec < 1.2 && !isScrolled;
      const portOpTarget = mouseActive ? 1 * fluidFactor : 0;
      
      // Snap to 0 instantly when scrolled, otherwise lerp slow so trail lingers
      const portLerpSpeed = isScrolled ? 1.0 : (mouseActive ? 0.28 : 0.04);
      setOpacity(portraitLayerRef.current, lerp(getOpacity(portraitLayerRef.current), portOpTarget, portLerpSpeed));

      portCX.current = lerp(portCX.current, mouse.current.nx, 0.18);
      portCY.current = lerp(portCY.current, mouse.current.ny, 0.18);

      // Physics tracking for hover fluid - highly smoothed (0.08) for organic fluid flow during maneuvers
      const hDx = portCX.current - hoverPrevCx.current;
      const hDy = portCY.current - hoverPrevCy.current;
      
      hoverVx.current = lerp(hoverVx.current, hDx, 0.08);
      hoverVy.current = lerp(hoverVy.current, hDy, 0.08);
      
      hoverPrevCx.current = portCX.current;
      hoverPrevCy.current = portCY.current;
      
      const hSpeed = Math.sqrt(hoverVx.current * hoverVx.current + hoverVy.current * hoverVy.current);
      const hAccel = Math.abs(hSpeed - hoverPrevSpeed.current);
      hoverPrevSpeed.current = hSpeed;
      
      // Excitation / Wobble spring physics
      hoverWobble.current += hAccel * 1.8;
      hoverWobbleSpeed.current += (0 - hoverWobble.current) * 0.18;
      hoverWobbleSpeed.current *= 0.84;
      hoverWobble.current += hoverWobbleSpeed.current;

      // Scale-on-drag: starts at a small baseline circular droplet (0.35) when still, and expands to full size (1.0) when moving!
      // Grow rate (lerp 0.05) makes it grow slowly "dari kecil membesar", contract rate (0.08) returns it to base size when still.
      const targetScale = (mouseActive && hSpeed > 0.0005) ? 1.0 : (mouseActive ? 0.35 : 0.0);
      hoverScale.current = lerp(hoverScale.current, targetScale, targetScale > 0.5 ? 0.05 : 0.08);

      // Start with a highly rounded base shape (0.58 ratio - droplet sweet spot!)
      // And scale it dynamically by hoverScale.current!
      const portRX = Math.min(sw, sh) * (0.22 + Math.sin(t * 2.1) * 0.015 + Math.sin(t * 1.3) * 0.008) * hoverScale.current;
      const portRY = portRX * 0.58; // Perfect viscous oval (not a bread capsule, nor a perfect circle!)
      
      const headCX = portCX.current * sw;
      const headCY = portCY.current * sh;

      // Record mouse trail nodes dynamically when active and moving
      if (mouseActive && hSpeed > 0.0005) {
        const lastSeg = hoverTrail.current[hoverTrail.current.length - 1];
        const dist = lastSeg ? Math.sqrt(Math.pow(headCX - lastSeg.cx, 2) + Math.pow(headCY - lastSeg.cy, 2)) : 999;
        
        // Push a new trail segment if cursor moved past 1.2% of screen width (dense, seamless overlapping!)
        if (dist > sw * 0.012) {
          hoverTrail.current.push({
            cx: headCX,
            cy: headCY,
            rx: portRX,
            ry: portRY,
            t,
            vx: hoverVx.current,
            vy: hoverVy.current,
            wobble: hoverWobble.current
          });
        }
      }

      // Decay and shrink all previous trail segments slowly over time (leaves trailing wake that slowly dissolves)
      hoverTrail.current.forEach(seg => {
        seg.rx *= 0.96; // Slower decay (was 0.94) to keep segments overlapping longer and avoid spottiness
        seg.ry *= 0.96;
      });
      // Remove segments that are almost fully dissolved
      hoverTrail.current = hoverTrail.current.filter(seg => seg.rx >= 8);
      // Keep a max of 16 segments (increased from 12 for denser, longer viscous trails)
      if (hoverTrail.current.length > 16) {
        hoverTrail.current.shift();
      }

      // Generate the union path (concatenates the head puddle and all trailing water droplet wakes)
      let visorPath = makeBlobPath(
        headCX, headCY, portRX, portRY, t, 0, 10,
        hoverVx.current, hoverVy.current, hoverWobble.current
      );
      
      hoverTrail.current.forEach(seg => {
        const segPath = makeBlobPath(seg.cx, seg.cy, seg.rx, seg.ry, seg.t, 0, 10, seg.vx, seg.vy, seg.wobble);
        visorPath += " " + segPath;
      });

      portraitPathRef.current?.setAttribute("d", visorPath);

      // ── 2. BG BLOB — reveals Hero_bg_hover.png on mouse hover, matching the visor perfectly ────────────────────────────
      const bgOpTarget = mouseActive ? 0.85 * fluidFactor : 0;
      const bgLerpSpeed = isScrolled ? 1.0 : (mouseActive ? 0.28 : 0.04);
      setOpacity(bgLayerRef.current, lerp(getOpacity(bgLayerRef.current), bgOpTarget, bgLerpSpeed));

      // Use the exact same path for background hover to eliminate the "double" mismatched shapes!
      bgCX.current = portCX.current;
      bgCY.current = portCY.current;
      bgPathRef.current?.setAttribute("d", visorPath);

      // ── 3. THREE STAGGERED DIAGONAL ZIG-ZAG CASCADING IDLE FLUIDS ──────────────
      const activeIdle = idleSec > 1.2 && !isScrolled;

      // Base speed (slightly increased for a more active, premium fluid cascading motion)
      const idleTime = t * 0.175;

      // Helper function to calculate position and size for a given slice
      const getSliceData = (sliceIdx: number, baseMultiplier: number, phaseOffset: number) => {
        const ph = idleTime - phaseOffset;
        const k = Math.round(ph / (Math.PI * 2));
        const theta = ph - k * Math.PI * 2; // in [-PI, PI]
        
        // Active window is when theta is in [-PI/2, PI/2]
        const isActive = theta >= -Math.PI / 2 && theta <= Math.PI / 2;
        const rawOp = isActive ? Math.pow(Math.cos(theta), 4) : 0;
        
        let cx = sw * 0.5;
        let cy = sh * 0.5;
        let rx = Math.min(sw, sh) * baseMultiplier;
        let ry = rx * 0.56;
        
        if (isActive) {
          const p = (theta + Math.PI / 2) / Math.PI; // 0 to 1
          const n = 3 * k + sliceIdx;
          const safeN = ((n % 12) + 12) % 12;
          
          // Horizontal travel (alternates directions)
          if (safeN % 2 === 0) {
            cx = sw * lerp(0.98, 0.02, p);
          } else {
            cx = sw * lerp(0.02, 0.98, p);
          }
          
          // Expanded vertical travel to sweep 80% of screen height instead of middle 50% (lintasan zigzag luas!)
          if (safeN % 4 === 0) {
            cy = sh * lerp(0.10, 0.50, p);
          } else if (safeN % 4 === 1) {
            cy = sh * lerp(0.50, 0.90, p);
          } else if (safeN % 4 === 2) {
            cy = sh * lerp(0.90, 0.50, p);
          } else {
            cy = sh * lerp(0.50, 0.10, p);
          }
          
          // Size with dynamic variation - scales down with rawOp so it grows and shrinks (dari kecil membesar)
          rx = Math.min(sw, sh) * (baseMultiplier + Math.sin(ph * 2.5) * 0.015) * Math.max(0.15, rawOp);
          ry = rx * (0.56 + Math.cos(ph * 1.8) * 0.03);
        }
        
        // Track physics for this slice!
        const normCx = cx / sw;
        const normCy = cy / sh;
        
        const physics = idlePhysics.current;
        
        const dx = normCx - physics.prevCx[sliceIdx];
        const dy = normCy - physics.prevCy[sliceIdx];
        
        physics.vx[sliceIdx] = lerp(physics.vx[sliceIdx], dx, 0.08);
        physics.vy[sliceIdx] = lerp(physics.vy[sliceIdx], dy, 0.08);
        
        physics.prevCx[sliceIdx] = normCx;
        physics.prevCy[sliceIdx] = normCy;
        
        const speed = Math.sqrt(physics.vx[sliceIdx] * physics.vx[sliceIdx] + physics.vy[sliceIdx] * physics.vy[sliceIdx]);
        const accel = Math.abs(speed - physics.prevSpeed[sliceIdx]);
        physics.prevSpeed[sliceIdx] = speed;
        
        physics.wobble[sliceIdx] += accel * 1.8;
        physics.wobbleSpeed[sliceIdx] += (0 - physics.wobble[sliceIdx]) * 0.18;
        physics.wobbleSpeed[sliceIdx] *= 0.84;
        physics.wobble[sliceIdx] += physics.wobbleSpeed[sliceIdx];
        
        return { cx, cy, rx, ry, rawOp, vx: physics.vx[sliceIdx], vy: physics.vy[sliceIdx], wobble: physics.wobble[sliceIdx] };
      };

      // Slice 0 - Phase A (0 offset)
      const data0 = getSliceData(0, 0.20, 0);
      const op0Target = activeIdle ? data0.rawOp * 0.9 : 0;
      const idleLerpSpeed = isScrolled ? 1.0 : 0.25;
      setOpacity(auto0Layer.current, lerp(getOpacity(auto0Layer.current), op0Target, idleLerpSpeed));
      setOpacity(auto0PortraitLayer.current, lerp(getOpacity(auto0PortraitLayer.current), op0Target, idleLerpSpeed));
      if (activeIdle) {
        auto0Path.current?.setAttribute("d", makeBlobPath(data0.cx, data0.cy, data0.rx, data0.ry, t, 0, 10, data0.vx, data0.vy, data0.wobble));
      }

      // Slice 1 - Phase B (120 degrees staggered offset)
      if (!isLowEnd) {
        const data1 = getSliceData(1, 0.23, (Math.PI * 2) / 3);
        const op1Target = activeIdle ? data1.rawOp * 0.9 : 0;
        setOpacity(auto1Layer.current, lerp(getOpacity(auto1Layer.current), op1Target, idleLerpSpeed));
        setOpacity(auto1PortraitLayer.current, lerp(getOpacity(auto1PortraitLayer.current), op1Target, idleLerpSpeed));
        if (activeIdle) {
          auto1Path.current?.setAttribute("d", makeBlobPath(data1.cx, data1.cy, data1.rx, data1.ry, t, Math.PI * 0.4, 10, data1.vx, data1.vy, data1.wobble));
        }
      }

      // Slice 2 - Phase C (240 degrees staggered offset)
      if (!isLowEnd) {
        const data2 = getSliceData(2, 0.18, (Math.PI * 4) / 3);
        const op2Target = activeIdle ? data2.rawOp * 0.9 : 0;
        setOpacity(auto2Layer.current, lerp(getOpacity(auto2Layer.current), op2Target, idleLerpSpeed));
        setOpacity(auto2PortraitLayer.current, lerp(getOpacity(auto2PortraitLayer.current), op2Target, idleLerpSpeed));
        if (activeIdle) {
          auto2Path.current?.setAttribute("d", makeBlobPath(data2.cx, data2.cy, data2.rx, data2.ry, t, Math.PI * 0.8, 10, data2.vx, data2.vy, data2.wobble));
        }
      }

      // ── 4. 3D INTERACTIVE PARALLAX TILT (Only on Desktop) ───────────────────
      if (isDesktopRef.current && imageRef.current) {
        const dx = mouse.current.nx - 0.5;
        const dy = mouse.current.ny - 0.5;

        // Targets: up to 10 deg tilt, up to 16px parallax translation shift
        const targetRotX = -dy * 10;
        const targetRotY = dx * 10;
        const targetTransX = dx * 16;
        const targetTransY = dy * 16;

        tiltX.current = lerp(tiltX.current, targetRotX, 0.08);
        tiltY.current = lerp(tiltY.current, targetRotY, 0.08);
        transX.current = lerp(transX.current, targetTransX, 0.08);
        transY.current = lerp(transY.current, targetTransY, 0.08);

        imageRef.current.style.transform = `perspective(1000px) rotateX(${tiltX.current.toFixed(2)}deg) rotateY(${tiltY.current.toFixed(2)}deg) translateX(${transX.current.toFixed(1)}px) translateY(${transY.current.toFixed(1)}px)`;
      } else if (imageRef.current) {
        // Reset transform on mobile/tablet
        imageRef.current.style.transform = "none";
      }

      rafRef.current = requestAnimationFrame(loop);
    };

    rafRef.current = requestAnimationFrame(loop);
    return () => {
      mm.revert();
      cancelAnimationFrame(rafRef.current);
    };
  }, []);

  const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    if (scrollProgressRef.current > 0.08) return; // return early and disable updates if scrolled down!
    const r = containerRef.current?.getBoundingClientRect();
    if (!r) return;
    mouse.current.nx = (e.clientX - r.left) / r.width;
    mouse.current.ny = (e.clientY - r.top)  / r.height;
    mouse.current.lastMove = performance.now();
  };



  return (
    <section
      ref={containerRef}
      id="home"
      onMouseMove={handleMouseMove}
      className="relative w-full h-screen flex flex-col justify-between items-center overflow-hidden"
    >
      {/* ══════════════════════════════════════════════════════════════════════
           LAYER 1 (z-1): Signature + Marquees — BEHIND the hero frame.
           These are revealed as the hero frame shrinks on scroll.
      ══════════════════════════════════════════════════════════════════════ */}
      <div className="hero-reveal-layer absolute inset-0 w-full h-full z-20 pointer-events-none select-none flex flex-col justify-between py-[15vh] md:py-[12vh]" style={{ opacity: 0 }}>
        {/* Row 1 Marquee (Top) - Scrolls left */}
        <div className="w-full overflow-hidden flex whitespace-nowrap">
          <div className="flex animate-marquee-left whitespace-nowrap text-[5vh] md:text-[5.5vw] font-sans font-black uppercase tracking-widest text-transparent [-webkit-text-stroke:1px_rgba(214,175,55,0.3)]">
            <span className="px-6">AI, Cloud, Network &amp; Web Enthusiast • Telecommunication System Student • </span>
            <span className="px-6">AI, Cloud, Network &amp; Web Enthusiast • Telecommunication System Student • </span>
          </div>
        </div>

        {/* Giant Elegant Calligraphy Signature in Gold */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <h1 className="hero-signature font-signature text-[38vw] md:text-[31vw] text-accent leading-none -rotate-[8deg] select-none translate-y-[2%] -translate-x-[2.5%]"
              style={{ clipPath: "inset(-100% 100% -100% 0)", opacity: 0 }}>
            Rislan
          </h1>
        </div>

        {/* Row 2 Marquee (Bottom) - Scrolls right */}
        <div className="w-full overflow-hidden flex whitespace-nowrap">
          <div className="flex animate-marquee-right whitespace-nowrap text-[5vh] md:text-[5.5vw] font-sans font-black uppercase tracking-widest text-transparent [-webkit-text-stroke:1px_rgba(214,175,55,0.3)]">
            <span className="px-6">AI, Cloud, Network &amp; Web Enthusiast • Telecommunication System Student • </span>
            <span className="px-6">AI, Cloud, Network &amp; Web Enthusiast • Telecommunication System Student • </span>
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════════════════
           LAYER 2 (z-10): The Hero Shrink Frame.
           Wraps ALL hero visual content. Shrinks on scroll with rounded corners.
      ══════════════════════════════════════════════════════════════════════ */}
      <div className="hero-shrink-frame absolute inset-0 w-full h-full z-10 overflow-hidden" style={{ borderRadius: 0 }}>

        {/* ── Base faded background (Batik Megamendung) ───────────────────────── */}
        <div className="base-hero-bg absolute inset-0 w-full h-full opacity-50 z-0 pointer-events-none select-none">
          <HeroImage src="/assets/Hero/Hero_bg.png" alt="Base faded background" priority />
        </div>

        {/* ── BG blob reveal layer ────────────────────────────────────────────── */}
        <div ref={bgLayerRef} className="absolute inset-0 w-full h-full z-1 pointer-events-none"
             style={{ opacity: 0, clipPath: "url(#bg-blob-mask)" }}>
          <HeroImage src="/assets/Hero/Hero_bg_hover.png" alt="BG blob hover" />
          <div className="absolute inset-0"
               style={{ background: "radial-gradient(ellipse at 50% 50%, rgba(212,175,55,0.10) 0%, transparent 70%)" }} />
        </div>

        {/* ── Autonomous blob A ──────────────────────────────────────────────── */}
        <div ref={auto0Layer} className="absolute inset-0 w-full h-full z-1 pointer-events-none"
             style={{ opacity: 0, clipPath: "url(#auto-blob-0)" }}>
          <HeroImage src="/assets/Hero/Hero_bg_hover.png" alt="Auto blob A hover" />
        </div>

        {/* ── Autonomous blob B ──────────────────────────────────────────────── */}
        <div ref={auto1Layer} className="absolute inset-0 w-full h-full z-1 pointer-events-none"
             style={{ opacity: 0, clipPath: "url(#auto-blob-1)" }}>
          <HeroImage src="/assets/Hero/Hero_bg_hover.png" alt="Auto blob B hover" />
        </div>

        {/* ── Autonomous blob C ──────────────────────────────────────────────── */}
        <div ref={auto2Layer} className="absolute inset-0 w-full h-full z-1 pointer-events-none"
             style={{ opacity: 0, clipPath: "url(#auto-blob-2)" }}>
          <HeroImage src="/assets/Hero/Hero_bg_hover.png" alt="Auto blob C hover" />
        </div>

        {/* ── Three.js ink trails ───────────────────────────────────────────── */}
        <div className="hero-ink-canvas-wrapper absolute inset-0 w-full h-full z-2 pointer-events-none">
          <InkCanvas />
        </div>

        {/* ── Portrait wrapper ──────────────────────────────────────────────── */}
        <div className="hero-portrait-scale-wrapper absolute inset-0 w-full h-full z-3 select-none overflow-hidden">
          <div ref={imageRef} className="absolute inset-0 w-full h-full"
               style={{ willChange: "transform" }}>
            <div className="absolute inset-0 z-1">
              <HeroImage src="/assets/Hero/Hero.png" alt="M Rislan Tristansyah portrait" priority />
            </div>
            <div ref={portraitLayerRef} className="absolute inset-0 z-2"
                 style={{ opacity: 0, clipPath: "url(#portrait-blob-mask)" }}>
              <HeroImage src="/assets/Hero/Hero_Hover.png" alt="Helmet watercolor overlay" />
            </div>
            <div ref={auto0PortraitLayer} className="absolute inset-0 z-3"
                 style={{ opacity: 0, clipPath: "url(#auto-blob-0)" }}>
              <HeroImage src="/assets/Hero/Hero_Hover.png" alt="Helmet auto blob A" />
            </div>
            <div ref={auto1PortraitLayer} className="absolute inset-0 z-4"
                 style={{ opacity: 0, clipPath: "url(#auto-blob-1)" }}>
              <HeroImage src="/assets/Hero/Hero_Hover.png" alt="Helmet auto blob B" />
            </div>
            <div ref={auto2PortraitLayer} className="absolute inset-0 z-5"
                 style={{ opacity: 0, clipPath: "url(#auto-blob-2)" }}>
              <HeroImage src="/assets/Hero/Hero_Hover.png" alt="Helmet auto blob C" />
            </div>
          </div>
        </div>

        {/* ── Radial edge vignette ─────────────────────────────────────────── */}
        <div className="absolute inset-0 w-full h-full z-4 pointer-events-none"
             style={{ background: "radial-gradient(ellipse 75% 80% at 50% 42%, transparent 35%, rgba(0,0,0,0.55) 65%, rgba(0,0,0,0.97) 100%)" }} />

        {/* ── Strong bottom dark gradient ──────────────────────────────────── */}
        <div className="absolute bottom-0 left-0 w-full h-[55%] pointer-events-none z-4"
             style={{ background: "linear-gradient(to top, rgba(0,0,0,1) 0%, rgba(0,0,0,0.85) 35%, rgba(0,0,0,0.4) 65%, transparent 100%)" }} />
      </div>



      {/* ══ Hidden SVG defs — all clipPaths & filters ════════════════════════ */}
      <svg className="absolute w-0 h-0 overflow-hidden" aria-hidden="true">
        <defs>
          {/* Viscous liquid goo filter for portrait blob (fuses overlapping drops like mercury!) */}
          <filter id="edge-bleed-sm" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="11.5" result="blur" />
            <feColorMatrix in="blur" mode="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 20 -8" result="goo" />
            <feTurbulence type="fractalNoise" baseFrequency="0.008" numOctaves="1" seed="3" result="noise" />
            <feDisplacementMap in="goo" in2="noise" scale="12" xChannelSelector="R" yChannelSelector="G" />
          </filter>
          {/* Viscous liquid goo filter for background/idle blobs */}
          <filter id="edge-bleed-lg" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="14.5" result="blur" />
            <feColorMatrix in="blur" mode="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 22 -9" result="goo" />
            <feTurbulence type="fractalNoise" baseFrequency="0.005" numOctaves="1" seed="9" result="noise" />
            <feDisplacementMap in="goo" in2="noise" scale="16" xChannelSelector="R" yChannelSelector="G" />
          </filter>

          {/* Portrait hover blob */}
          <clipPath id="portrait-blob-mask" clipPathUnits="userSpaceOnUse">
            <path ref={portraitPathRef} filter="url(#edge-bleed-sm)" d="M 0,0 Z" />
          </clipPath>

          {/* BG drift blob */}
          <clipPath id="bg-blob-mask" clipPathUnits="userSpaceOnUse">
            <path ref={bgPathRef} filter="url(#edge-bleed-lg)" d="M 0,0 Z" />
          </clipPath>

          {/* 3 autonomous blobs */}
          <clipPath id="auto-blob-0" clipPathUnits="userSpaceOnUse">
            <path ref={auto0Path} filter="url(#edge-bleed-lg)" d="M 0,0 Z" />
          </clipPath>
          <clipPath id="auto-blob-1" clipPathUnits="userSpaceOnUse">
            <path ref={auto1Path} filter="url(#edge-bleed-sm)" d="M 0,0 Z" />
          </clipPath>
          <clipPath id="auto-blob-2" clipPathUnits="userSpaceOnUse">
            <path ref={auto2Path} filter="url(#edge-bleed-lg)" d="M 0,0 Z" />
          </clipPath>
        </defs>
      </svg>
    </section>
  );
}
