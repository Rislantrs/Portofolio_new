"use client";

import Image from "next/image";
import React, { useState } from "react";

const BrandIcon = ({
  deviconSlug,
  simpleIconSlug,
  simpleIconColor,
  src,
  fallback,
}: {
  deviconSlug?: string;
  simpleIconSlug?: string;
  simpleIconColor?: string;
  src?: string;
  fallback?: React.ReactNode;
}) => {
  if (src) {
    return <Image src={src} alt="" width={40} height={40} className="h-10 w-10 rounded-lg object-contain" />;
  }
  if (deviconSlug) {
    return (
      <Image
        src={`https://cdn.jsdelivr.net/gh/devicons/devicon/icons/${deviconSlug}/${deviconSlug}-original.svg`}
        alt=""
        width={40}
        height={40}
        className="h-10 w-10 object-contain"
      />
    );
  }
  if (simpleIconSlug) {
    return (
      <div
        className="w-9 h-9 shrink-0"
        style={{
          mask: `url(https://cdn.jsdelivr.net/npm/simple-icons@11.15.0/icons/${simpleIconSlug}.svg) no-repeat center`,
          WebkitMask: `url(https://cdn.jsdelivr.net/npm/simple-icons@11.15.0/icons/${simpleIconSlug}.svg) no-repeat center`,
          maskSize: "contain",
          WebkitMaskSize: "contain",
          backgroundColor: simpleIconColor || "currentColor",
        }}
      />
    );
  }
  return <>{fallback}</>;
};

const roles = [
  {
    id: "web",
    name: "WEB DEV",
    title: "Web Development & Engineering",
    logo: <BrandIcon deviconSlug="react" />,
    description: "Merancang dan membangun platform digital interaktif, profil institusi, dan aplikasi web berbasis kecerdasan buatan (AI) menggunakan teknologi modern.",
    tools: [
      { name: "React", icon: <BrandIcon deviconSlug="react" /> },
      { name: "Next.js", icon: <BrandIcon deviconSlug="nextjs" /> },
      { name: "JavaScript", icon: <BrandIcon deviconSlug="javascript" /> },
      { name: "Flask", icon: <BrandIcon deviconSlug="flask" /> },
      { name: "MySQL", icon: <BrandIcon deviconSlug="mysql" /> },
      { name: "Groq API / AI", icon: <BrandIcon simpleIconSlug="groq" simpleIconColor="#111111" /> },
    ],
  },
  {
    id: "ds",
    name: "AI/ML",
    title: "Artificial Intelligence & Machine Learning",
    logo: <BrandIcon deviconSlug="python" />,
    description: "Mengembangkan model klasifikasi, regresi, prediksi churn, dan analisis sentimen menggunakan algoritme machine learning modern.",
    tools: [
      { name: "Python", icon: <BrandIcon deviconSlug="python" /> },
      { name: "Scikit-Learn", icon: <BrandIcon deviconSlug="scikitlearn" /> },
      {
        name: "CatBoost / XGBoost",
        icon: (
          <BrandIcon
            fallback={
              <svg className="w-10 h-10 text-orange-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M4.5 16.5c-1.5 1.25-2.5 3.5-2.5 3.5s2.25-1 3.5-2.5M19.5 4.5c1.5-1.25 2.5-3.5 2.5-3.5s-2.25 1-3.5 2.5" />
                <path d="M12 12l9-9-3 12-6 3-3-6z" />
                <path d="M9 15l-3 6-3.5-3.5 6.5-2.5" />
              </svg>
            }
          />
        ),
      },
      { name: "Jupyter", icon: <BrandIcon deviconSlug="jupyter" /> },
      { name: "Pandas", icon: <BrandIcon deviconSlug="pandas" /> },
    ],
  },
  {
    id: "cloud",
    name: "CLOUD COMPUTING",
    title: "Cloud Computing & Infrastructure",
    logo: <BrandIcon deviconSlug="googlecloud" />,
    description: "Mengimplementasikan solusi komputasi awan, virtualisasi jaringan, arsitektur serverless, serta administrasi sistem cloud pada Google Cloud Platform (GCP) dan Alibaba Cloud.",
    tools: [
      { name: "Google Cloud", icon: <BrandIcon deviconSlug="googlecloud" /> },
      { name: "Alibaba Cloud", icon: <BrandIcon src="/assets/ACA.jpg" /> },
      { name: "Developer Cert", icon: <BrandIcon src="/assets/DEV.jpg" /> },
    ],
  },
  {
    id: "iot",
    name: "IOT",
    title: "IoT & Embedded Systems",
    logo: <BrandIcon deviconSlug="arduino" />,
    description: "Merancang dan memprogram perangkat cerdas, sensor pembaca kesehatan, modul pemantau nirkabel, dan otomasi mikrokontroler.",
    tools: [
      { name: "Arduino", icon: <BrandIcon deviconSlug="arduino" /> },
      { name: "C++", icon: <BrandIcon deviconSlug="cplusplus" /> },
      {
        name: "Blynk Platform",
        icon: (
          <BrandIcon
            fallback={
              <svg className="w-9 h-9 text-neutral-900" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="4" />
                <path d="M12 2v6M12 16v6M4.93 4.93l4.24 4.24M14.83 14.83l4.24 4.24M2 12h6M16 12h6M4.93 19.07l4.24-4.24M14.83 9.17l4.24-4.24" />
              </svg>
            }
          />
        ),
      },
      {
        name: "ESP8266 / Node",
        icon: (
          <BrandIcon
            fallback={
              <svg className="w-10 h-10 text-cyan-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="4" y="4" width="16" height="16" rx="2" />
                <line x1="9" y1="9" x2="9" y2="15" />
                <line x1="9" y1="15" x2="15" y2="15" />
                <line x1="15" y1="15" x2="15" y2="9" />
                <line x1="15" y1="9" x2="9" y2="9" />
                <line x1="9" y1="1" x2="9" y2="4" />
                <line x1="15" y1="1" x2="15" y2="4" />
                <line x1="9" y1="20" x2="9" y2="23" />
                <line x1="15" y1="20" x2="15" y2="23" />
              </svg>
            }
          />
        ),
      },
    ],
  },
  {
    id: "security",
    name: "NETWORKING",
    title: "Networking & Cyber Security",
    logo: (
      <BrandIcon
        fallback={
          <svg className="w-6 h-6 text-blue-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <rect x="16" y="16" width="6" height="6" rx="1" />
            <rect x="2" y="16" width="6" height="6" rx="1" />
            <rect x="9" y="2" width="6" height="6" rx="1" />
            <path d="M12 8v4M5 16v-4h14v4" />
          </svg>
        }
      />
    ),
    description: "Menerapkan Software Defined Networking (SDN), analisis kualitas lalu lintas jaringan, steganografi LSB, enkripsi, dan keamanan siber.",
    tools: [
      {
        name: "Cyber Security",
        icon: (
          <BrandIcon
            fallback={
              <svg className="w-10 h-10 text-emerald-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              </svg>
            }
          />
        ),
      },
      { name: "MATLAB", icon: <BrandIcon deviconSlug="matlab" /> },
      {
        name: "SDN Network",
        icon: (
          <BrandIcon
            fallback={
              <svg className="w-10 h-10 text-blue-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="16" y="16" width="6" height="6" rx="1" />
                <rect x="2" y="16" width="6" height="6" rx="1" />
                <rect x="9" y="2" width="6" height="6" rx="1" />
                <path d="M12 8v4M5 16v-4h14v4" />
              </svg>
            }
          />
        ),
      },
      {
        name: "Ryu Controller",
        icon: (
          <BrandIcon
            fallback={
              <svg className="w-10 h-10 text-red-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="2" y="6" width="20" height="12" rx="2" />
                <circle cx="7" cy="12" r="2" />
                <line x1="15" y1="12" x2="19" y2="12" />
                <line x1="17" y1="10" x2="17" y2="14" />
              </svg>
            }
          />
        ),
      },
    ],
  },
];

export default function TechStackTabs() {
  const [activeTab, setActiveTab] = useState("web");
  const activeRole = roles.find((role) => role.id === activeTab) || roles[0];

  return (
    <>
      <div className="relative w-full overflow-hidden py-5 border-b border-white/5 flex select-none">
        <div className="absolute top-0 left-0 bottom-0 w-16 md:w-32 bg-gradient-to-r from-surface to-transparent z-10 pointer-events-none" />
        <div className="absolute top-0 right-0 bottom-0 w-16 md:w-32 bg-gradient-to-l from-surface to-transparent z-10 pointer-events-none" />

        <div className="flex items-center gap-10 animate-marquee-left-triple whitespace-nowrap shrink-0">
          {[...roles, ...roles, ...roles].map((role, idx) => {
            const uniqueKey = `selector-btn-${role.id}-${idx}`;
            return (
              <React.Fragment key={uniqueKey}>
                {idx > 0 && <span className="text-accent/30 text-xs self-center">*</span>}
                <button
                  onClick={() => setActiveTab(role.id)}
                  className={`group px-6 py-3.5 rounded-full flex items-center gap-3 transition-all duration-500 shrink-0 border ${
                    activeTab === role.id
                      ? "bg-white border-white text-black shadow-[0_0_20px_rgba(255,255,255,0.16)]"
                      : "border-white/10 bg-surface/40 text-text-muted hover:bg-white hover:border-white hover:text-black"
                  }`}
                >
                  <div className="w-10 h-10 rounded-full overflow-hidden flex items-center justify-center bg-white p-1.5 border border-accent/20 shrink-0 transition-transform duration-500 group-hover:scale-110 group-hover:rotate-6 shadow-sm">
                    {role.logo}
                  </div>
                  <span
                    className={`font-sans font-extrabold text-[11px] md:text-xs tracking-wider uppercase transition-colors duration-300 ${
                      activeTab === role.id ? "text-[#f4f4f4] font-black" : "text-text-muted group-hover:text-[#f4f4f4]"
                    }`}
                  >
                    {role.name}
                  </span>
                </button>
              </React.Fragment>
            );
          })}
        </div>
      </div>

      <div key={activeTab} className="flex flex-col items-center gap-6 py-4 animate-fade-slide-up w-full">
        <h4 className="font-display font-extrabold text-lg md:text-xl text-accent-light text-center select-none tracking-tight">
          {activeRole.title}
        </h4>
        <p className="font-sans text-xs md:text-sm text-text-muted text-center max-w-xl mx-auto leading-relaxed select-none">
          {activeRole.description}
        </p>

        <div className="flex flex-wrap gap-6 md:gap-8 justify-center w-full max-w-3xl mt-4">
          {activeRole.tools.map((tool, idx) => (
            <div key={idx} className="flex flex-col items-center gap-2.5 group select-none w-20 md:w-24 shrink-0">
              <div className="w-16 h-16 rounded-xl border border-white/10 bg-white flex items-center justify-center group-hover:border-white/35 group-hover:shadow-[0_0_15px_rgba(255,255,255,0.12)] transition-all duration-300 tool-icon-float shrink-0 overflow-hidden">
                {tool.icon}
              </div>
              <span className="font-display font-bold text-[9px] tracking-wider text-text-muted mt-1 uppercase text-center group-hover:text-accent-light transition-colors duration-300 max-w-[85px] leading-tight select-none">
                {tool.name}
              </span>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
