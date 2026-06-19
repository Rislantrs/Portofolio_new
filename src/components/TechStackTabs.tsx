"use client";

import Image from "next/image";
import type { ReactNode } from "react";
import { useState } from "react";

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
  fallback?: ReactNode;
}) => {
  if (src) {
    return <Image src={src} alt="" width={40} height={40} className="h-10 w-10 object-contain" />;
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
    logo: <BrandIcon src="/assets/l_webdev_compressed.webp" />,
    description: "Merancang dan membangun platform digital interaktif, profil institusi, dan aplikasi web berbasis kecerdasan buatan (AI) menggunakan teknologi modern.",
    tools: [
      { name: "React", icon: <BrandIcon deviconSlug="react" /> },
      { name: "Next.js", icon: <BrandIcon deviconSlug="nextjs" /> },
      { name: "JavaScript", icon: <BrandIcon deviconSlug="javascript" /> },
      { name: "Flask", icon: <BrandIcon deviconSlug="flask" /> },
      { name: "MySQL", icon: <BrandIcon deviconSlug="mysql" /> },
      { name: "Groq API / AI", icon: <BrandIcon fallback={<span className="flex h-9 w-9 items-center justify-center rounded-full bg-neutral-950 font-sans text-[10px] font-black tracking-normal text-white">GQ</span>} /> },
    ],
  },
  {
    id: "ds",
    name: "AI/ML",
    title: "Artificial Intelligence & Machine Learning",
    logo: <BrandIcon src="/assets/l_aiml_compressed.webp" />,
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
    logo: <BrandIcon src="/assets/l_cloud_compressed.webp" />,
    description: "Mengimplementasikan solusi komputasi awan, virtualisasi jaringan, arsitektur serverless, serta administrasi sistem cloud pada Google Cloud Platform (GCP) dan Alibaba Cloud.",
    tools: [
      { name: "Google Cloud", icon: <BrandIcon deviconSlug="googlecloud" /> },
      { name: "Alibaba Cloud", icon: <BrandIcon src="/assets/ACA_compressed.webp" /> },
      { name: "Developer Cert", icon: <BrandIcon src="/assets/DEV_compressed.webp" /> },
    ],
  },
  {
    id: "iot",
    name: "IOT",
    title: "IoT & Embedded Systems",
    logo: <BrandIcon src="/assets/l_iot_compressed.webp" />,
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
    logo: <BrandIcon src="/assets/l_net_compressed.webp" />,
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
  const activeIndex = roles.findIndex((role) => role.id === activeRole.id);

  return (
    <div className="grid gap-8">
      <div className="relative w-full overflow-x-auto border-y border-black/15 bg-[#f4f4f4] px-2 py-2 select-none">
        <div className="flex min-w-max items-center gap-2">
          {roles.map((role, index) => (
            <button
              key={role.id}
              onClick={() => setActiveTab(role.id)}
              className={`group flex h-16 shrink-0 items-center gap-3 border px-3 pr-5 transition-all duration-300 ${
                activeTab === role.id
                  ? "border-black bg-black text-white shadow-[0_16px_34px_rgba(0,0,0,0.16)]"
                  : "border-black/10 bg-[#f4f4f4] text-black/55 hover:border-black/35 hover:bg-[#f4f4f4] hover:text-black"
              }`}
            >
              <span className={`type-meta ${
                activeTab === role.id ? "text-white/45" : "text-black/35"
              }`}>
                {String(index + 1).padStart(2, "0")}
              </span>
              <span className="flex h-11 w-11 items-center justify-center rounded-md border border-black/10 bg-[#f4f4f4] p-1.5 shadow-sm transition-transform duration-300 group-hover:-translate-y-0.5">
                {role.logo}
              </span>
              <span className="type-action">
                {role.name}
              </span>
            </button>
          ))}
        </div>
      </div>

      <div key={activeTab} className="grid gap-8 animate-fade-slide-up md:grid-cols-[0.72fr_1.28fr] md:items-start">
        <div className="border-l border-black pl-5">
          <div className="type-meta text-black/40">
            Selected Area / {String(activeIndex + 1).padStart(2, "0")}
          </div>
          <h4 className="type-panel-title mt-4 max-w-xl uppercase text-black">
            {activeRole.title}
          </h4>
          <p className="type-body mt-5 max-w-xl text-black/58">
            {activeRole.description}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-px overflow-hidden border border-black/12 bg-black/12 sm:grid-cols-3">
          {([...activeRole.tools, ...Array(Math.max(0, 6 - activeRole.tools.length)).fill(null)] as (typeof activeRole.tools[number] | null)[]).map((tool, idx) => {
            if (!tool) {
              return (
                <div
                  key={`empty-${idx}`}
                  className="bg-[#f4f4f4] min-h-40 md:min-h-48"
                />
              );
            }
            return (
              <div
                key={idx}
                className="group flex min-h-40 flex-col justify-between bg-[#f4f4f4] p-4 transition-colors duration-300 hover:bg-[#f4f4f4] md:min-h-48 md:p-5"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex h-14 w-14 items-center justify-center overflow-hidden rounded-sm border border-black/10 bg-[#f4f4f4] p-2 shadow-sm transition-transform duration-300 group-hover:-translate-y-1">
                    {tool.icon}
                  </div>
                  <span className="type-meta text-black/28">
                    {String(idx + 1).padStart(2, "0")}
                  </span>
                </div>
                <span className="type-action mt-8 max-w-[10rem] leading-tight text-black/70 transition-colors duration-300 group-hover:text-black">
                  {tool.name}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
