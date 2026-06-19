"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { ExternalLink, Award } from "lucide-react";
import { useCertificationsTimeline } from "@/hooks/useCertificationsTimeline";
import { useLowEndDevice } from "@/hooks/useLowEndDevice";
import { certificates as fallbackCertificates, type Certificate } from "@/lib/certifications";
import { fetchCertifications } from "@/lib/supabaseDb";

function AnimatedAsciiNoise({
  src,
  alt,
}: {
  src: string;
  alt: string;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d", { alpha: false });
    const sampler = document.createElement("canvas");
    const samplerCtx = sampler.getContext("2d", { willReadFrequently: true });
    if (!ctx || !samplerCtx) return;

    const source = new window.Image();
    let frameId = 0;
    let running = true;
    let width = 1;
    let height = 1;
    let columns = 1;
    let rows = 1;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const symbols = "0101011100110011+-=.:*#%$<>[]{}";

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      width = Math.max(1, Math.floor(rect.width));
      height = Math.max(1, Math.floor(rect.height));
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const cell = width < 360 ? 7 : 8;
      columns = Math.max(32, Math.floor(width / cell));
      rows = Math.max(30, Math.floor(height / (cell * 1.15)));
      sampler.width = columns;
      sampler.height = rows;
    };

    const drawSourceForSampling = () => {
      samplerCtx.fillStyle = "#ffffff";
      samplerCtx.fillRect(0, 0, columns, rows);

      const imageRatio = source.naturalWidth / source.naturalHeight;
      const sampleRatio = columns / rows;
      let drawWidth = columns;
      let drawHeight = rows;
      let drawX = 0;
      let drawY = 0;

      if (imageRatio > sampleRatio) {
        drawHeight = columns / imageRatio;
        drawY = (rows - drawHeight) / 2;
      } else {
        drawWidth = rows * imageRatio;
        drawX = (columns - drawWidth) / 2;
      }

      samplerCtx.drawImage(source, drawX, drawY, drawWidth, drawHeight);
    };

    const animatedNoise = (x: number, y: number, t: number) => {
      const drift = Math.sin(x * 0.36 + t * 2.4) + Math.cos(y * 0.42 - t * 1.8);
      const hash = Math.sin((x + t * 17.3) * 12.9898 + (y - t * 11.7) * 78.233) * 43758.5453;
      return drift * 0.28 + (hash - Math.floor(hash)) - 0.5;
    };

    const render = (time: number) => {
      if (!running || !source.complete || !source.naturalWidth) return;

      const t = time * 0.001;
      drawSourceForSampling();
      const pixels = samplerCtx.getImageData(0, 0, columns, rows).data;

      ctx.fillStyle = "#050505";
      ctx.fillRect(0, 0, width, height);
      ctx.font = "700 8px ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";

      const cellW = width / columns;
      const cellH = height / rows;

      for (let y = 0; y < rows; y += 1) {
        const rowWarp = Math.sin(t * 4.2 + y * 0.24) * 1.15;

        for (let x = 0; x < columns; x += 1) {
          const index = (y * columns + x) * 4;
          const r = pixels[index];
          const g = pixels[index + 1];
          const b = pixels[index + 2];
          const luminance = (r * 0.299 + g * 0.587 + b * 0.114) / 255;
          const saturation = (Math.max(r, g, b) - Math.min(r, g, b)) / 255;
          const darkness = 1 - luminance;
          const n = animatedNoise(x, y, t);
          const backgroundPulse = 0.12 + Math.max(0, n) * 0.16;
          const ink = Math.max(darkness * 1.25, saturation * 0.85);
          const value = Math.max(0, Math.min(1, ink + backgroundPulse + Math.sin(t * 9 + x * 0.4 + y * 0.3) * 0.035));

          if (value < 0.16 && n < 0.24) continue;

          const symbolSeed = Math.sin((x + t * 26.7) * 29.17 + (y - t * 18.3) * 61.37) * 9182.33;
          const symbolNoise = symbolSeed - Math.floor(symbolSeed);
          const charIndex = Math.max(0, Math.min(symbols.length - 1, Math.floor((value * 0.55 + symbolNoise * 0.45) * (symbols.length - 1))));
          const opacity = Math.max(0.12, Math.min(0.86, ink * 0.7 + backgroundPulse * 0.75));
          const warm = Math.floor(150 + value * 64);
          const green = Math.floor(150 + value * 64);
          const blue = Math.floor(150 + value * 64);
          const jitterX = rowWarp + Math.sin(t * 7.4 + y * 0.51) * 0.34;
          const jitterY = Math.cos(t * 6.8 + x * 0.33) * 0.26;

          ctx.fillStyle = `rgba(${warm}, ${green}, ${blue}, ${opacity})`;
          ctx.fillText(symbols[charIndex], x * cellW + cellW * 0.5 + jitterX, y * cellH + cellH * 0.5 + jitterY);
        }
      }

      ctx.fillStyle = `rgba(255, 255, 255, ${0.055 + Math.sin(t * 4.8) * 0.02})`;
      ctx.fillRect(0, ((t * 38) % (height + 70)) - 35, width, 1);
      frameId = requestAnimationFrame(render);
    };

    const observer = new ResizeObserver(resize);
    observer.observe(canvas);
    resize();

    source.onload = () => {
      frameId = requestAnimationFrame(render);
    };
    source.src = src;

    return () => {
      running = false;
      observer.disconnect();
      cancelAnimationFrame(frameId);
    };
  }, [src]);

  return (
    <canvas
      ref={canvasRef}
      aria-label={alt}
      className="absolute inset-0 h-full w-full bg-[#050505]"
    />
  );
}

function CertificateCard({ cert, showNoise }: { cert: Certificate; showNoise: boolean }) {

  const credentialId = `REF #${cert.organizer.slice(0, 3).toUpperCase()}-${cert.year}-${String(cert.id).padStart(3, "0")}`;

  return (
    <div
      data-cert-card
      data-cursor={cert.link ? "view" : ""}
      className="cert-card group relative flex h-[clamp(300px,42vh,440px)] w-full min-w-0 flex-col overflow-hidden rounded-2xl border border-white/10 bg-bg-elevated select-none transition-all duration-500 hover:border-white/30 hover:shadow-[0_0_30px_rgba(255,255,255,0.06)] lg:h-[clamp(340px,48vh,520px)] lg:w-[400px] lg:flex-shrink-0"
    >
      {/* Showcase Frame — takes up all available space above the info section */}
      <div className="relative w-full flex-1 overflow-hidden bg-bg flex items-center justify-center">
        {/* Certificate Image — fills the entire frame */}
        <div className="relative w-full h-full z-10 flex items-center justify-center p-4 md:p-6">
          <Image
            src={cert.badgeIcon}
            alt={cert.badgeName}
            fill
            className="object-contain p-4 md:p-6 filter drop-shadow-[0_8px_24px_rgba(0,0,0,0.4)]"
            sizes="(max-width: 768px) 100vw, 400px"
          />
        </div>

        {/* ─── NOISE OVERLAY ─── Opaque, fully covering, in FRONT of the image ─── */}
        {showNoise && (
          <div className="noise-overlay absolute inset-0 z-30 overflow-hidden pointer-events-none select-none">
            <AnimatedAsciiNoise src={cert.badgeIcon} alt={`${cert.badgeName} animated ASCII distortion`} />
          </div>
        )}

        {/* Sci-fi scanner line (pulses on hover) */}
        <div className="cert-scanner-line absolute left-0 right-0 h-[1px] bg-white/30 shadow-[0_0_12px_rgba(255,255,255,0.35)] top-0 group-hover:animate-[scan_2s_linear_infinite] pointer-events-none z-40" />

        {/* Glass reflection sweep on hover */}
        <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out pointer-events-none z-40" />
      </div>

      {/* Info content */}
      <div className="flex flex-col gap-3 p-5 md:p-6">
        <div className="type-meta flex justify-between items-center text-accent/80">
          <span>
            {cert.category === "ai"
              ? "AI / ML"
              : cert.category === "cloud"
              ? "CLOUD"
              : cert.category === "web"
              ? "WEB DEV"
              : "NETWORKING"}
          </span>
          <span className="text-text-subtle">{cert.year}</span>
        </div>

        <div className="flex flex-col gap-1.5">
          <h3 className="type-card-title uppercase text-white group-hover:text-accent-light transition-colors duration-300">
            {cert.name}
          </h3>
          <p className="type-small text-text-muted">
            Issued by <span className="font-semibold text-white">{cert.organizer}</span>
          </p>
        </div>

        {/* Footer verify link */}
        <div className="flex justify-between items-center pt-3 border-t border-white/5 mt-1">
          <div className="flex flex-col gap-0.5">
            <span className="type-meta text-text-subtle">
              {cert.badgeName}
            </span>
            <span className="type-meta text-accent/40">
              {credentialId}
            </span>
          </div>

          {cert.link ? (
            <a
              href={cert.link}
              target="_blank"
              rel="noopener noreferrer"
              className="type-action inline-flex items-center gap-1 text-accent hover:text-white transition-all duration-300"
            >
              VERIFY
              <ExternalLink size={10} className="text-accent group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-300" />
            </a>
          ) : (
            <span className="type-action inline-flex items-center gap-1 text-accent select-none">
              VERIFIED
              <Award size={11} className="text-accent animate-pulse" />
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

export default function Certifications() {
  const isLowEnd = useLowEndDevice();
  const sectionRef = useRef<HTMLDivElement>(null);
  const trackViewportRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const sliderThumbRef = useRef<HTMLDivElement>(null);

  const [isPinned, setIsPinned] = useState(false);
  const [certificates, setCertificates] = useState<Certificate[]>(fallbackCertificates);

  useEffect(() => {
    let active = true;
    async function loadData() {
      const data = await fetchCertifications();
      if (!active) return;
      setCertificates(data);
      setTimeout(() => {
        import("gsap/ScrollTrigger").then(({ ScrollTrigger }) => {
          ScrollTrigger.refresh();
        });
      }, 100);
    }
    loadData();
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    const handleResize = () => {
      setIsPinned(window.innerWidth >= 1024);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useCertificationsTimeline({
    isPinned,
    sectionRef,
trackViewportRef,
    trackRef,
    sliderThumbRef,
  });

  // ─── Consistent side padding for the section ───
  return (
    <section
      ref={sectionRef}
      id="certifications"
      className={`relative z-20 isolate w-full bg-bg overflow-hidden flex flex-col ${
        isPinned ? "h-[100svh] pt-6 pb-10 md:pt-8" : "py-24"
      }`}
    >
      <div className="pointer-events-none absolute inset-0 -z-10 bg-bg" />

      {/* Dynamic Keyframes Styling */}
      <style jsx global>{`
        @keyframes scan {
          0% { top: 0%; opacity: 0.8; }
          50% { top: 100%; opacity: 0.8; }
          100% { top: 0%; opacity: 0.8; }
        }
      `}</style>

      {/* Cinematic HUD Top Bar */}
      {isPinned && (
        <div className="type-meta section-shell flex justify-between items-center border-b border-white/5 pb-3 pointer-events-none select-none text-text-muted z-30 mb-6">
          <div className="flex items-center gap-3">
            <span className="text-accent animate-pulse font-black">● REC</span>
            <span>CRD_VAL_SYS_03</span>
          </div>
          <span>©RISLAN CREATIVE WEB LAB</span>
          <span>VAL_ENV // EN</span>
        </div>
      )}

      {/* Header (Section Title) */}
      <div className={`section-shell flex flex-col gap-2 shrink-0 ${isPinned ? "" : "mb-10"}`}>
        <div className="type-kicker flex items-center gap-3 text-accent select-none">
          <span className="w-8 h-[1px] bg-accent" />
          03 — EXPERTISE VALIDATION
        </div>
        <h2 className="type-section-title select-none">
          Earned <span className="text-accent-light italic">Credentials</span>
        </h2>
      </div>

      {isPinned ? (
        /* Pinned Horizontal Track Layout */
        <div ref={trackViewportRef} className="section-shell min-h-0 flex-1 flex items-center overflow-hidden py-5 relative">
          {/* Right edge vignette only — left side is clean so the first card is fully visible */}
          <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-bg to-transparent z-20 pointer-events-none" />

          {/* Track: starts with consistent left padding, ends with generous right padding */}
          <div
            ref={trackRef}
            className="flex gap-6 items-center pr-[clamp(7rem,18vw,16rem)]"
          >
            {certificates.map((cert, idx) => (
              <CertificateCard key={cert.id} cert={cert} showNoise={!isLowEnd && idx < 3} />
            ))}
          </div>
        </div>
      ) : (
        /* Responsive grid for tablet/mobile */
        <div className="section-shell grid grid-cols-1 gap-5 sm:grid-cols-2 md:gap-6 lg:flex lg:flex-col">
          {certificates.map((cert) => (
            <CertificateCard key={cert.id} cert={cert} showNoise={false} />
          ))}
        </div>
      )}

      {/* HUD Bottom Bar with Progress Indicator */}
      <div className={`type-meta section-shell flex items-center justify-between shrink-0 text-text-muted ${
        isPinned ? "" : "mt-10"
      }`}>
        {isPinned ? (
          <div className="flex items-center gap-4 select-none">
            <span>01</span>
            <div className="relative flex items-center h-6 px-2 border border-white/10 rounded bg-bg-elevated/40 overflow-hidden w-56 md:w-72">
              {/* Background indicator dashes */}
              <div className="absolute inset-0 flex items-center justify-between px-2 text-white/5 tracking-widest overflow-hidden pointer-events-none font-sans text-xs">
                {"|".repeat(36)}
              </div>
              {/* Slider thumb */}
              <div
                ref={sliderThumbRef}
                className="relative h-3 w-8 border border-accent bg-accent/10 rounded flex items-center justify-center font-bold text-[7px] text-accent uppercase"
              >
                SCRL
              </div>
            </div>
            <span>{String(certificates.length).padStart(2, "0")}</span>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <span>TOTAL: {certificates.length} CREDENTIALS</span>
          </div>
        )}

        <div className="select-none uppercase text-accent font-bold">
          STATUS: VERIFIED
        </div>
      </div>
    </section>
  );
}
