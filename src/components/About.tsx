"use client";

import { useRef, useState } from "react";
import type { CSSProperties } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import MotionReveal from "@/components/MotionReveal";
import TechStackTabs from "@/components/TechStackTabs";

gsap.registerPlugin(ScrollTrigger);

const profileFocus = ["Artificial Intelligence", "Cloud Computing", "Networking"];

const education = [
  {
    title: "Universitas Pendidikan Indonesia",
    period: "2023 - Present",
    meta: "Telecommunication Systems",
    note: "Bachelor's Degree",
  },
  {
    title: "SMA Negeri 1 Cibatu",
    period: "2019 - 2022",
    meta: "Purwakarta",
    note: "Senior High School",
  },
  {
    title: "SMP Negeri 1 Campaka",
    period: "2016 - 2019",
    meta: "Purwakarta",
    note: "Junior High School",
  },
];

const experience = [
  "Secretary of the Professional and Vocational Department of HIMATELKOM.",
  "Managed meeting minutes, correspondence, and activity accountability reports (LPJ).",
  "Researched and distributed Skilltopia information, including training, certifications, competitions, and scholarships.",
];

const achievements = [
  "Strong academic foundation in telecommunications, networking, cloud computing, and AI.",
  "Actively managed skill development opportunities and information for association members.",
  "Experienced in research, administration, and team coordination.",
];

const manifestoWords =
  "I believe life is about constantly growing, becoming better than yesterday, appreciating today, and looking forward to tomorrow with hope.".split(
    " ",
  );

const faces = [
  { label: "ABOUT", caption: "Profile", title: "M Rislan Tristansyah" },
  { label: "EDUCATION", caption: "Education History", title: "Education" },
  { label: "EXPERIENCE", caption: "Organization", title: "Experience" },
  { label: "HIGHLIGHTS", caption: "Summary", title: "Achievements & Highlights" },
];

function CubeFaceContent({ faceIndex }: { faceIndex: number }) {
  return (
    <div
      className="absolute inset-0 overflow-hidden border border-black/15 bg-white p-5 font-sans text-black shadow-[0_0_40px_rgba(0,0,0,0.12)] sm:p-7 md:p-10"
      style={{
        transform: `rotateY(${faceIndex * 90}deg) translateZ(calc(var(--roll-size) / 2))`,
        backfaceVisibility: "hidden",
      }}
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_15%,rgba(0,0,0,0.04),transparent_28%),radial-gradient(circle_at_85%_85%,rgba(0,0,0,0.035),transparent_34%)]" />
      <div className="relative z-10 flex h-full flex-col">
        <div className="mb-4 flex items-center justify-between gap-4 border-b border-black/15 pb-3 md:mb-5">
          <span className="font-mono text-[10px] font-bold uppercase tracking-[0.28em] text-black">
            {faces[faceIndex].caption}
          </span>
          <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-neutral-500">
            0{faceIndex + 1}/04
          </span>
        </div>

        {faceIndex === 0 && (
          <div className="about-profile-face flex-1 w-full flex flex-col justify-center items-start py-5 sm:py-7 select-none">
            <div className="w-full max-w-[860px] flex flex-col gap-3 sm:gap-5 md:gap-6">
              <div className="flex flex-row gap-4 items-center sm:items-start text-left">
                {/* Photo Container */}
                <div className="relative shrink-0 w-16 h-16 sm:w-24 sm:h-24 md:w-28 md:h-28 rounded-2xl sm:rounded-3xl overflow-hidden border border-black/[0.08] shadow-[0_8px_30px_rgb(0,0,0,0.06)] filter grayscale hover:grayscale-0 transition-all duration-700 ease-out select-none">
                  <img
                    src="/assets/IMG_0304.JPG"
                    alt="M Rislan Tristansyah"
                    className="w-full h-full object-cover object-center"
                  />
                </div>

                {/* Name and Title */}
                <div className="flex-1 flex flex-col justify-center min-w-0">
                  <h3 className="font-sans text-lg sm:text-[1.35rem] md:text-[1.75rem] font-extrabold tracking-tight leading-tight text-neutral-900">
                    M Rislan Tristansyah
                  </h3>
                  <p className="mt-1 text-[10px] sm:text-xs md:text-[13px] font-bold uppercase tracking-widest text-neutral-500">
                    Telecommunication Systems Student &bull; Semester 7
                  </p>
                  <p className="mt-0.5 text-[9px] sm:text-[11px] font-semibold text-neutral-400 font-mono tracking-wider">
                    Universitas Pendidikan Indonesia
                  </p>
                </div>
              </div>

              {/* About Description */}
              <p className="text-[11px] sm:text-xs md:text-sm leading-relaxed text-neutral-600 font-normal text-left">
                I am a 7th-semester Telecommunication Systems student at Universitas Pendidikan Indonesia with a deep passion for Artificial Intelligence, neural networks, and modern networking systems. I am driven to build intelligent tech solutions that are clean, efficient, and create a real-world impact.
              </p>

              {/* Buttons / Social Container */}
              <div className="flex flex-wrap items-center justify-start gap-3 sm:gap-4 pt-2">
                {/* Resume Button */}
                <a
                  href="/assets/M Rislan Tristansyah-resume.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex h-10 min-w-[132px] shrink-0 items-center justify-center gap-2 whitespace-nowrap rounded-xl bg-neutral-900 px-5 text-[11px] font-bold uppercase tracking-normal text-white shadow-md shadow-black/10 transition-all duration-300 hover:bg-black hover:shadow-black/20 select-none cursor-pointer"
                >
                  <svg className="h-3.5 w-3.5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                    <polyline points="7 10 12 15 17 10" />
                    <line x1="12" y1="15" x2="12" y2="3" />
                  </svg>
                  Resume
                </a>

                {/* Social Icons */}
                <div className="flex min-w-0 flex-wrap items-center gap-2.5">
                  {/* LinkedIn */}
                  <a
                    href="https://www.linkedin.com/in/m-rislan-tristansyah-96669a294/"
                    target="_blank"
                    rel="noopener noreferrer"
                    title="LinkedIn"
                    className="w-9 h-9 flex items-center justify-center rounded-xl border border-neutral-200 hover:border-black text-neutral-500 hover:text-black hover:bg-neutral-50 hover:-translate-y-0.5 transition-all duration-300 cursor-pointer"
                  >
                    <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current">
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                    </svg>
                  </a>

                  {/* Credly */}
                  <a
                    href="https://www.credly.com/users/m-rislan-tristansyah"
                    target="_blank"
                    rel="noopener noreferrer"
                    title="Credly"
                    className="w-9 h-9 flex items-center justify-center rounded-xl border border-neutral-200 hover:border-black text-neutral-500 hover:text-black hover:bg-neutral-50 hover:-translate-y-0.5 transition-all duration-300 cursor-pointer"
                  >
                    <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current">
                      <path d="M23.8 13.154a.299.299 0 0 0-.101-.024.407.407 0 0 0-.202.048c-.06.028-.092.08-.127.136-.087.128-.15.268-.226.4-.107.187-.246.351-.38.515-.135.156-.286.291-.424.44-.028.027-.072.043-.107.027-.028-.016-.036-.056-.032-.088.04-.38.075-.763.123-1.138.02-.172.043-.336.063-.512.028-.247.056-.487.087-.735l.234-1.824c.02-.128.032-.372-.135-.52a.446.446 0 0 0-.233-.116.46.46 0 0 0-.254.06c-.226.16-.297.504-.365.76-.142.603-.178 1.241-.471 1.804a1.772 1.772 0 0 1-.202.316.668.668 0 0 1-.186.18.332.332 0 0 1-.246.051.365.365 0 0 1-.238-.207.871.87 0 0 1-.063-.324 4.499 4.499 0 0 1 .24-1.585c.045-.132.089-.252.104-.383.028-.156.028-.38-.114-.516-.131-.128-.337-.18-.504-.128-.194.056-.31.244-.372.392-.198.463-.25.95-.317 1.446-.044.327-.127.64-.293.926a2.717 2.717 0 0 1-.603.72c-.118.087-.222.123-.328.107a.376.376 0 0 1-.278-.208.875.875 0 0 1-.095-.315 3.361 3.36 0 0 1-.036-.616c.004-.223 0-.44.044-.658.075-.39.678-1.937.808-2.345.135-.407.262-.823.353-1.246.08-.38.123-.767.11-1.15-.007-.277-.07-.576-.288-.736a.611.61 0 0 0-.603-.048.968.968 0 0 0-.455.428 2.53 2.53 0 0 0-.226.59 12.01 12.01 0 0 0-.266 1.29c-.071.429-.138.848-.206 1.268-.06.355-.206 1.614-.261 1.88-.06.272-.175.54-.301.787-.131.268-.258.536-.408.791a.694.694 0 0 1-.175.224c-.08.06-.182.088-.27.048-.102-.048-.146-.176-.166-.292-.075-.435-.012-.875.072-1.302.083-.431.44-2.4.519-2.851.099-.532.24-1.05.285-1.59.028-.388.09-.88-.202-1.187-.115-.136-.31-.16-.44-.136-.174.036-.31.176-.388.296-.1.128-.186.28-.258.467-.115.284-.186.615-.261.91l-.032.129c-.083.383-.143.77-.186 1.162a16.95 16.948 0 0 0-.06.632c-.008.1-.016.203-.027.307 0 .08.007.168-.028.244a.304.304 0 0 1-.052.068c-.08.072-.202.06-.31.056-.557-.016-1.045.3-1.35.755-.18.252-.281.542-.39.834-.01.048-.034.1-.054.152-.051.143-.13.327-.222.511a3.037 3.037 0 0 1-.317.46 3.285 3.285 0 0 1-.384.41 1.123 1.123 0 0 1-.515.26c-.174.04-.384-.043-.543-.203a.916.916 0 0 1-.206-.54c-.004-.055-.004-.115.028-.163.05-.068.146-.072.23-.076a1.623 1.623 0 0 0 1.375-1.015c.138-.34.178-.698.122-1.046a1.193 1.193 0 0 0-.19-.48.9.9 0 0 0-.396-.323c-.293-.14-.658-.127-1.01.004-.575.232-.951.74-1.134 1.562l-.02.088c-.114.487-.23 1-.582 1.354-.127.12-.261.163-.368.143-.044-.004-.08-.04-.103-.075-.096-.16.003-.532.15-1a4.1 4.1 0 0 0 .1-.366.925.925 0 0 0-.108-.495.783.783 0 0 0-.372-.324c-.143-.064-.31-.06-.468-.06h-.047c-.044 0-.103 0-.151-.012a.215.215 0 0 1-.147-.127.485.485 0 0 1 .016-.232c.004-.02.012-.048.016-.072a.368.368 0 0 0-.162-.412.509.509 0 0 0-.468-.036.768.768 0 0 0-.364.348.769.769 0 0 0-.103.48c.04.13.07.32.043.475-.055.28-.222.51-.384.74-.04.05-.072.106-.107.16a4.96 4.96 0 0 1-.706.825c-.372.335-.804.575-1.232.67-.745.165-1.506-.06-1.91-.734-.222-.38-.32-.827-.348-1.266a5.425 5.425 0 0 1 .424-2.516c.328-.76.816-1.52 1.715-1.614.353-.04.753.083.912.4.115.23.075.506 0 .75-.072.244-.175.49-.18.75-.003.26.124.54.37.616.238.072.495-.08.634-.29.138-.21.186-.46.245-.704a6.282 6.281 0 0 1 .662-1.634c.139-.236.297-.488.254-.76a.543.543 0 0 0-.373-.415.543.543 0 0 0-.535.144c-.134.148-.206.371-.387.43-.17.06-.35-.055-.507-.134-.6-.32-1.336-.312-1.963-.048-.634.25-1.146.735-1.526 1.294C.462 8.53.098 9.508.022 10.48c-.027.34-.031.695 0 1.038.036.46.1.854.214 1.206.139.423.317.79.547 1.094.266.34.587.6.94.747.372.148.784.22 1.192.208a3.172 3.172 0 0 0 1.177-.283 4.29 4.29 0 0 0 1.026-.68c.309-.26.594-.559.84-.89.162-.224.309-.46.44-.708a4.83 4.83 0 0 0 .178-.383c.044-.104.087-.215.202-.26.056-.043.15-.02.202.013.064.04.115.075.135.135.048.116.02.232-.004.332v.012c-.028.1-.055.203-.091.303-.14.424-.238.811-.16 1.195.045.207.128.387.25.527a.84.84 0 0 0 .504.264c.246.04.51-.028.725-.132.143-.068.278-.156.397-.26.06-.06.122-.12.174-.184.044-.06.087-.147.178-.143a.15.15 0 0 1 .107.064c.028.031.04.071.06.115.23.52.776.84 1.335.84h.07c.27 0 .556-.093.79-.22.27-.14.48-.348.7-.552.02-.016.045-.04.073-.044.035-.008.07.012.099.044a.26.26 0 0 1 .047.1c.135.34.46.6.824.66a1.1 1.1 0 0 0 .99-.356c.056-.06.104-.128.167-.176.064-.044.15-.076.222-.044.107.04.135.164.182.268.107.235.357.371.615.375.289 0 .554-.148.764-.34.195-.183.353-.399.516-.61a.328.328 0 0 1 .106-.096c.04-.024.096-.028.13 0 .033.024.045.06.06.091.163.4.587.652 1.01.648.417-.004.809-.224 1.103-.516.095-.092.194-.2.32-.21.14-.017.207.114.254.22.072.142.115.238.25.338.158.116.36.152.547.1.17-.04.34-.156.47-.316.072-.088.112-.204.19-.284.092-.087.132.028.136.1.016.116.016.236.008.352-.016.236-.052.471-.08.703-.011.068-.02.136-.063.188-.06.068-.166.08-.253.064a2.898 2.898 0 0 0-.321-.028l-.14-.016c-.201-.012-.4-.036-.61-.044h-.185c-.404 0-.733.048-1.03.16-.48.187-.852.57-1.003 1.018a1.305 1.305 0 0 0-.052.64c.04.203.13.403.282.587.265.315.68.515 1.149.543.408.02.852-.064 1.292-.26.848-.367 1.482-1.094 1.696-1.95 0-.02.01-.039.023-.043.298-.104.57-.248.813-.428.245-.187.467-.399.65-.643.09-.12.174-.243.253-.37.07-.125.13-.257.202-.38a.906.906 0 0 0 .13-.316.411.411 0 0 0-.05-.328.257.257 0 0 0-.135-.124m-13.68-1.63c.017-.071.045-.14.06-.206a1.9 1.9 0 0 1 .262-.504c.04-.048.08-.1.135-.136a.246.246 0 0 1 .186-.048c.107.02.183.128.202.236.032.18-.04.396-.114.555a1.097 1.097 0 0 1-.31.415c-.06.044-.114.088-.178.116-.028.008-.063.028-.115.028h-.016c-.055 0-.114-.028-.126-.088a.827.827 0 0 1 .015-.367m4.308-.184c-.004.072-.024.148-.028.223a4.91 4.91 0 0 0 0 .779c.012.152.047.3-.016.444a1.069 1.069 0 0 1-.567.643.555.555 0 0 1-.245.056c-.02 0-.04-.004-.06-.004-.12 0-.214-.092-.265-.18a.871.87 0 0 1-.1-.272 2.129 2.129 0 0 1 .072-1.122c.08-.22.202-.435.38-.594a.874.874 0 0 1 .563-.24.31.31 0 0 1 .206.064c.04.044.06.104.056.164a.05.05 0 0 1 .004.04m6.43 4.653c-.015.044-.06.104-.08.14-.042.08-.102.163-.161.235a2.562 2.562 0 0 1-.317.304c-.238.18-.503.311-.777.387a2.025 2.025 0 0 1-.487.072h-.04a.795.795 0 0 1-.515-.18.433.433 0 0 1-.158-.25.537.537 0 0 1 .047-.305.776.776 0 0 1 .38-.383c.326-.16.682-.176 1.019-.16.139.004.265.012.4.02.107.004.218.012.325.024.056 0 .115.004.17.012.044.004.092-.004.135.008.06.004.068.036.06.076" />
                    </svg>
                  </a>

                  {/* GitHub */}
                  <a
                    href="https://github.com/Rislantrs"
                    target="_blank"
                    rel="noopener noreferrer"
                    title="GitHub"
                    className="w-9 h-9 flex items-center justify-center rounded-xl border border-neutral-200 hover:border-black text-neutral-500 hover:text-black hover:bg-neutral-50 hover:-translate-y-0.5 transition-all duration-300 cursor-pointer"
                  >
                    <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current">
                      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                    </svg>
                  </a>

                  {/* Medium */}
                  <a
                    href="https://medium.com/@rislantristansyah"
                    target="_blank"
                    rel="noopener noreferrer"
                    title="Medium"
                    className="w-9 h-9 flex items-center justify-center rounded-xl border border-neutral-200 hover:border-black text-neutral-500 hover:text-black hover:bg-neutral-50 hover:-translate-y-0.5 transition-all duration-300 cursor-pointer"
                  >
                    <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current">
                      <path d="M12.5 12c0 3.038-2.462 5.5-5.5 5.5S1.5 15.038 1.5 12s2.462-5.5 5.5-5.5 5.5 2.462 5.5 5.5zm7.5 0c0 2.761-1.119 5-2.5 5S15 14.761 15 12s1.119-5 2.5-5 2.5 2.239 2.5 5zm3.5 0c0 2.209-.448 4-1 4s-1-1.791-1-4 .448-4 1-4 1 1.791 1 4z" />
                    </svg>
                  </a>
                </div>
              </div>
            </div>
          </div>
        )}

        {faceIndex === 1 && (
          <div className="about-detail-face grid flex-1 content-center gap-5 select-none">
            <div className="w-full max-w-[860px]">
              <h3 className="font-sans text-lg font-black text-black md:text-[1.75rem]">Education</h3>
              <p className="mt-1 max-w-xl text-xs leading-5 text-neutral-500 md:text-sm">
                Formal learning path and academic background.
              </p>
            </div>
            <div className="grid w-full max-w-[860px] gap-3 md:gap-4">
              {education.map((item) => (
                <div key={item.title} className="border-l border-black/20 bg-neutral-50/70 py-3 pl-4 pr-4">
                  <div className="flex items-start justify-between gap-4">
                    <h4 className="text-[13px] font-bold leading-5 text-black md:text-[15px]">{item.title}</h4>
                    <span className="shrink-0 font-mono text-[10px] text-neutral-600">{item.period}</span>
                  </div>
                  <p className="mt-1 text-xs font-semibold text-neutral-700 md:text-[13px]">{item.meta}</p>
                  <p className="text-xs text-neutral-600 md:text-[13px]">{item.note}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {faceIndex === 2 && (
          <div className="about-detail-face grid flex-1 content-center gap-5 select-none">
            <div className="w-full max-w-[860px]">
              <h3 className="font-sans text-lg font-black text-black md:text-[1.75rem]">Experience</h3>
              <p className="mt-1 text-xs font-semibold leading-5 text-neutral-700 md:text-sm">
                Professional & Vocational Staff / HIMATELKOM
              </p>
            </div>
            <ul className="grid w-full max-w-[860px] gap-3 md:gap-4">
              {experience.map((item) => (
                <li key={item} className="flex gap-3 border-l border-black/20 bg-neutral-50/70 py-3 pl-4 pr-4 text-xs leading-5 text-neutral-600 md:text-sm md:leading-6">
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 bg-black" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {faceIndex === 3 && (
          <div className="about-detail-face grid flex-1 content-center gap-5 select-none">
            <div className="w-full max-w-[860px]">
              <h3 className="font-sans text-lg font-black text-black md:text-[1.75rem]">Achievements & Highlights</h3>
              <p className="mt-1 max-w-xl text-xs leading-5 text-neutral-500 md:text-sm">
                Compact summary of strengths, focus areas, and recent development.
              </p>
            </div>
            <ul className="grid w-full max-w-[860px] gap-3 md:gap-4">
              {achievements.map((item) => (
                <li key={item} className="border-l border-black/20 bg-neutral-50/70 py-3 pl-4 pr-4 text-xs leading-5 text-neutral-600 md:text-sm md:leading-6">
                  {item}
                </li>
              ))}
            </ul>
            <div className="flex w-full max-w-[860px] flex-wrap gap-2 pt-1">
              {profileFocus.map((item) => (
                <span key={item} className="border border-black/15 bg-black/5 px-2.5 py-1 text-[10px] font-bold uppercase tracking-normal text-neutral-700">
                  {item}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function About() {
  const introRef = useRef<HTMLDivElement>(null);
  const cubeRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);
  const [activeIndex, setActiveIndex] = useState(0);

  // ─── Physics state refs ──────────────────────────────────────────────────────
  const physicsStartedRef = useRef(false);
  const physicsCleanupRef = useRef<(() => void) | null>(null);
  const physicsTimeoutRef = useRef<any>(null);
  const lettersRevealedRef = useRef(false);

  useGSAP(() => {
    let lastIndex = -1;
    let aboutTimeline: gsap.core.Timeline | null = null;
    const intro = introRef.current;
    if (!intro || !cubeRef.current) return;

    const titlePanel = intro.querySelector<HTMLElement>(".about-intro-title");
    const quotePanel = intro.querySelector<HTMLElement>(".about-intro-quote");
    const cubePanel = intro.querySelector<HTMLElement>(".about-cube-panel");
    const quoteChars = gsap.utils.toArray<HTMLElement>(".about-manifesto-char", intro);

    if (titlePanel && quotePanel && cubePanel && quoteChars.length > 0) {
      gsap.set(titlePanel, { yPercent: 0 });
      gsap.set(quotePanel, { yPercent: 50 });
      gsap.set(quoteChars, { x: 0, y: 0, rotate: 0, opacity: 1, transformOrigin: "50% 100%" });
      gsap.set(cubePanel, { yPercent: 100, pointerEvents: "none" });
      gsap.set(cubeRef.current, { scale: 0, rotateX: 45, rotateZ: -15, transformStyle: "preserve-3d" });
      gsap.set(progressRef.current, { scaleX: 0, transformOrigin: "left center" });

      aboutTimeline = gsap.timeline({
        scrollTrigger: {
          trigger: intro,
          start: "top top",
          end: () => `+=${window.innerHeight * 3.5}`, // Pinned for 3.5 screen heights total
          pin: true,
          pinSpacing: true,
          scrub: 1.1,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            const p = self.progress;

            // Start physics at 35% of the total timeline progress
            if (p >= 0.35 && p < 0.65 && !physicsStartedRef.current) {
              physicsStartedRef.current = true;
              if (physicsTimeoutRef.current) {
                clearTimeout(physicsTimeoutRef.current);
              }
              // Wait a tiny bit for letters to settle
              physicsTimeoutRef.current = setTimeout(() => {
                if (physicsStartedRef.current) {
                  initLetterPhysics(quoteChars, quotePanel!);
                }
              }, 100);
            }

            // Reset physics when scrolling back up past 33%
            if (p < 0.33 && physicsStartedRef.current) {
              physicsStartedRef.current = false;
              if (physicsTimeoutRef.current) {
                clearTimeout(physicsTimeoutRef.current);
                physicsTimeoutRef.current = null;
              }
              if (physicsCleanupRef.current) {
                physicsCleanupRef.current();
                physicsCleanupRef.current = null;
              }

              // Animate characters back to natural position
              gsap.to(quoteChars, {
                x: 0,
                y: 0,
                rotate: 0,
                duration: 1.0,
                stagger: {
                  amount: 0.4,
                  from: "random",
                },
                ease: "power3.out",
                overwrite: "auto",
              });
            }

            // Handle active side label / face change based on rolling progress [0.75, 1.0]
            if (p >= 0.75) {
              const activeProgress = (p - 0.75) / 0.25; // Map to 0 to 1
              const roll = activeProgress * (faces.length - 1);
              const nextIndex = Math.min(faces.length - 1, Math.round(roll));
              setProgress(activeProgress);
              if (nextIndex !== lastIndex) {
                lastIndex = nextIndex;
                setActiveIndex(nextIndex);
              }
              if (progressRef.current) {
                progressRef.current.style.transform = `scaleX(${Math.max(0, Math.min(1, activeProgress))})`;
              }
            } else {
              setProgress(0);
              setActiveIndex(0);
              if (progressRef.current) {
                progressRef.current.style.transform = "scaleX(0)";
              }
            }
          },
        },
      });

      // Build unified timeline:
      // - 0.0 to 0.25: title panel and quote panel slide up
      // - 0.25 to 0.55: static manifesto text and letters fall (at 0.35 onUpdate)
      // - 0.55 to 0.70: curtain slides up (covers screen completely at 0.70)
      // - 0.70 to 0.75: fade-in cube panel, scale-up bouncy cube automatically
      // - 0.75 to 1.0: roll cube Y
      aboutTimeline
        .to(titlePanel, { yPercent: -100, duration: 0.25, ease: "power2.inOut" }, 0)
        .to(quotePanel, { yPercent: 0, duration: 0.25, ease: "power2.inOut" }, 0)
        .to(cubePanel, { yPercent: 0, pointerEvents: "auto", duration: 0.15, ease: "power2.inOut" }, 0.55)
        .to(cubeRef.current, { scale: 1, rotateX: 0, rotateZ: 0, duration: 0.05, ease: "back.out(1.5)" }, 0.70)
        .to(cubeRef.current, { rotateY: -(faces.length - 1) * 90, duration: 0.25, ease: "none" }, 0.75);

    // ─── Physics engine ─────────────────────────────────────────────────────────
    function initLetterPhysics(charEls: HTMLElement[], container: HTMLElement) {
      // Kill GSAP control over the chars
      charEls.forEach((el) => {
        gsap.killTweensOf(el);
        el.style.opacity = "1";
      });

      const containerRect = container.getBoundingClientRect();
      const W = containerRect.width;
      const H = containerRect.height;
      const GRAVITY = 980;     // px/s²
      const RESTITUTION = 0.22;
      const FRICTION = 0.65;
      const AIR_DRAG = 0.998;
      const ANGULAR_DRAG = 0.96;

      interface LetterBody {
        x: number; y: number;
        vx: number; vy: number;
        angle: number; angularVel: number;
        w: number; h: number;
        mass: number;
        naturalX: number; naturalY: number;
        isStatic: boolean;
        el: HTMLElement;
        grounded: boolean;
      }

      const bodies: LetterBody[] = [];
      const timeouts: any[] = [];

      // Record natural positions and create bodies
      charEls.forEach((el) => {
        // Measure current visual position (transformed)
        const rectTransformed = el.getBoundingClientRect();
        const cx = rectTransformed.left - containerRect.left + rectTransformed.width / 2;
        const cy = rectTransformed.top - containerRect.top + rectTransformed.height / 2;

        // Temporarily clear transform style to measure natural layout rect
        const prevTransform = el.style.transform;
        el.style.transform = "";
        const rectNatural = el.getBoundingClientRect();
        el.style.transform = prevTransform;

        const ncx = rectNatural.left - containerRect.left + rectNatural.width / 2;
        const ncy = rectNatural.top - containerRect.top + rectNatural.height / 2;

        bodies.push({
          x: cx, y: cy,
          vx: (Math.random() - 0.5) * 40,
          vy: 0,
          angle: 0,
          angularVel: (Math.random() - 0.5) * 1.5,
          w: rectNatural.width,
          h: rectNatural.height,
          mass: Math.max(rectNatural.width * rectNatural.height * 0.01, 1),
          naturalX: ncx,
          naturalY: ncy,
          isStatic: true, // Will be released with stagger
          el,
          grounded: false,
        });
      });

      // Stagger release: letters fall in random-ish waves
      const shuffled = bodies.map((_, i) => i).sort(() => Math.random() - 0.5);
      shuffled.forEach((bodyIdx, order) => {
        const delay = order * 25 + Math.random() * 80; // 25-105ms stagger
        const tid = setTimeout(() => {
          bodies[bodyIdx].isStatic = false;
          bodies[bodyIdx].vy = Math.random() * 50; // Small initial push down
          bodies[bodyIdx].vx = (Math.random() - 0.5) * 80;
          bodies[bodyIdx].angularVel = (Math.random() - 0.5) * 4;
        }, delay);
        timeouts.push(tid);
      });

      // ── Mouse interaction ───────────────────────────────────────────────────
      let dragBody: LetterBody | null = null;
      let mouseX = 0, mouseY = 0;
      let prevMouseX = 0, prevMouseY = 0;
      let mouseDown = false;

      const getLocalMouse = (e: MouseEvent | PointerEvent) => {
        const cr = container.getBoundingClientRect();
        return { x: e.clientX - cr.left, y: e.clientY - cr.top };
      };

      const findBodyAt = (mx: number, my: number): LetterBody | null => {
        // Search in reverse (top-most first)
        for (let i = bodies.length - 1; i >= 0; i--) {
          const b = bodies[i];
          if (b.isStatic) continue;
          const dx = mx - b.x, dy = my - b.y;
          if (Math.abs(dx) < b.w * 0.7 && Math.abs(dy) < b.h * 0.7) return b;
        }
        return null;
      };

      const onPointerDown = (e: PointerEvent) => {
        const m = getLocalMouse(e);
        mouseX = prevMouseX = m.x;
        mouseY = prevMouseY = m.y;
        mouseDown = true;
        dragBody = findBodyAt(m.x, m.y);
        if (dragBody) {
          dragBody.grounded = false;
          container.style.cursor = "grabbing";
        }
      };

      const onPointerMove = (e: PointerEvent) => {
        const m = getLocalMouse(e);
        prevMouseX = mouseX;
        prevMouseY = mouseY;
        mouseX = m.x;
        mouseY = m.y;

        if (!mouseDown) {
          // Hover push effect: gently push nearby letters
          for (const b of bodies) {
            if (b.isStatic) continue;
            const dx = b.x - m.x, dy = b.y - m.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < 80 && dist > 0) {
              const force = (1 - dist / 80) * 120;
              b.vx += (dx / dist) * force * 0.15;
              b.vy += (dy / dist) * force * 0.1 - 20;
              b.angularVel += (dx / dist) * force * 0.008;
              b.grounded = false;
            }
          }
          return;
        }

        if (dragBody) {
          // Move dragged body to mouse with spring
          dragBody.x = mouseX;
          dragBody.y = mouseY;
          dragBody.vx = 0;
          dragBody.vy = 0;
          dragBody.angularVel = (mouseX - prevMouseX) * 0.05;
        }
      };

      const onPointerUp = () => {
        if (dragBody) {
          // Throw with velocity based on mouse movement
          dragBody.vx = (mouseX - prevMouseX) * 18;
          dragBody.vy = (mouseY - prevMouseY) * 18;
          dragBody.angularVel = (mouseX - prevMouseX) * 0.12;
          dragBody.grounded = false;
          dragBody = null;
          container.style.cursor = "";
        }
        mouseDown = false;
      };

      container.addEventListener("pointerdown", onPointerDown);
      container.addEventListener("pointermove", onPointerMove);
      window.addEventListener("pointerup", onPointerUp);

      // ── AABB collision between bodies ───────────────────────────────────────
      function resolveCollision(a: LetterBody, b: LetterBody) {
        const overlapX = (a.w + b.w) * 0.42 - Math.abs(a.x - b.x);
        const overlapY = (a.h + b.h) * 0.42 - Math.abs(a.y - b.y);
        if (overlapX <= 0 || overlapY <= 0) return;

        const totalMass = a.mass + b.mass;

        if (overlapX < overlapY) {
          // Separate on X axis
          const sign = a.x < b.x ? -1 : 1;
          a.x += sign * overlapX * (b.mass / totalMass) * 0.5;
          b.x -= sign * overlapX * (a.mass / totalMass) * 0.5;

          // Transfer velocity
          const relVx = a.vx - b.vx;
          const impulse = relVx * 0.5;
          a.vx -= impulse * (b.mass / totalMass);
          b.vx += impulse * (a.mass / totalMass);
          a.angularVel += impulse * 0.003;
          b.angularVel -= impulse * 0.003;
        } else {
          // Separate on Y axis
          const sign = a.y < b.y ? -1 : 1;
          a.y += sign * overlapY * (b.mass / totalMass) * 0.5;
          b.y -= sign * overlapY * (a.mass / totalMass) * 0.5;

          const relVy = a.vy - b.vy;
          const impulse = relVy * 0.5;
          a.vy -= impulse * (b.mass / totalMass);
          b.vy += impulse * (a.mass / totalMass);

          // Friction from horizontal contact
          a.vx *= 0.92;
          b.vx *= 0.92;
          a.angularVel *= 0.9;
          b.angularVel *= 0.9;
        }
      }

      // ── Physics loop ────────────────────────────────────────────────────────
      let lastTime = performance.now();
      let rafId: number;

      function step() {
        const now = performance.now();
        const rawDt = (now - lastTime) / 1000;
        const dt = Math.min(rawDt, 0.033); // Cap at ~30fps equivalent
        lastTime = now;

        for (const b of bodies) {
          if (b.isStatic || b === dragBody) continue;

          // Gravity
          b.vy += GRAVITY * dt;

          // Air drag
          b.vx *= AIR_DRAG;
          b.vy *= AIR_DRAG;
          b.angularVel *= ANGULAR_DRAG;

          // Integrate position
          b.x += b.vx * dt;
          b.y += b.vy * dt;
          b.angle += b.angularVel * dt;

          // ── Floor collision (letters stop at bottom) ──────────────────────
          const floorY = H - b.h * 0.42;
          if (b.y > floorY) {
            b.y = floorY;
            if (Math.abs(b.vy) > 20) {
              b.vy *= -RESTITUTION;
              b.angularVel += b.vx * 0.001;
            } else {
              b.vy = 0;
              b.grounded = true;
            }
            b.vx *= FRICTION;
            b.angularVel *= 0.85;

            // Dampen rotation when resting
            if (b.grounded && Math.abs(b.vx) < 5) {
              b.angle *= 0.92; // Slowly upright
              b.angularVel *= 0.8;
              b.vx *= 0.9;
            }
          }

          // ── Wall collisions ──────────────────────────────────────────────
          if (b.x - b.w * 0.42 < 0) {
            b.x = b.w * 0.42;
            b.vx = Math.abs(b.vx) * RESTITUTION;
            b.angularVel *= -0.5;
          }
          if (b.x + b.w * 0.42 > W) {
            b.x = W - b.w * 0.42;
            b.vx = -Math.abs(b.vx) * RESTITUTION;
            b.angularVel *= -0.5;
          }

          // Ceiling
          if (b.y - b.h * 0.42 < 0) {
            b.y = b.h * 0.42;
            b.vy = Math.abs(b.vy) * RESTITUTION;
          }
        }

        // ── Body-body collisions (simple grid broadphase) ─────────────────
        const activeBodies = bodies.filter((b) => !b.isStatic);
        for (let i = 0; i < activeBodies.length; i++) {
          for (let j = i + 1; j < activeBodies.length; j++) {
            const a = activeBodies[i], b = activeBodies[j];
            if (a === dragBody || b === dragBody) continue;
            // Quick distance check
            if (Math.abs(a.x - b.x) < (a.w + b.w) * 0.5 &&
                Math.abs(a.y - b.y) < (a.h + b.h) * 0.5) {
              resolveCollision(a, b);
            }
          }
        }

        // ── Update DOM ────────────────────────────────────────────────────
        for (const b of bodies) {
          if (b.isStatic) continue;
          const dx = b.x - b.naturalX;
          const dy = b.y - b.naturalY;
          b.el.style.transform = `translate(${dx.toFixed(1)}px, ${dy.toFixed(1)}px) rotate(${(b.angle * 57.2958).toFixed(1)}deg)`;
        }

        rafId = requestAnimationFrame(step);
      }

      rafId = requestAnimationFrame(step);

      // Store cleanup function
      physicsCleanupRef.current = () => {
        cancelAnimationFrame(rafId);
        timeouts.forEach((t) => clearTimeout(t));
        container.removeEventListener("pointerdown", onPointerDown);
        container.removeEventListener("pointermove", onPointerMove);
        window.removeEventListener("pointerup", onPointerUp);
      };
    }

    gsap.set(cubeRef.current, {
      scale: 0,
      rotateX: 45,
      rotateZ: -15,
      transformStyle: "preserve-3d",
    });
    gsap.set(progressRef.current, { scaleX: 0, transformOrigin: "left center" });
    }

    const refreshTimer = window.setTimeout(() => ScrollTrigger.refresh(), 450);

    return () => {
      window.clearTimeout(refreshTimer);
      physicsCleanupRef.current?.();
      aboutTimeline?.kill();
    };
  }, []);

  const activeFace = faces[activeIndex];

  return (
    <section id="about" className="relative w-full bg-white">
      <div ref={introRef} className="relative h-screen w-full overflow-hidden bg-black">
        <div className="about-intro-title absolute top-0 left-0 w-full h-[50vh] flex items-end justify-center bg-black pb-[4vh] px-6">
          <h2 className="font-sans text-[14vw] font-black uppercase leading-none tracking-normal text-white md:text-[9vw]">
            About Me
          </h2>
        </div>

        <div className="about-intro-quote absolute inset-0 overflow-hidden bg-[#f4f4f4] px-6 py-10 text-black md:px-16 md:py-14" style={{ touchAction: "none" }}>
          <div className="flex h-full flex-col justify-between">
            <div className="flex items-center justify-between font-mono text-[10px] font-bold uppercase tracking-[0.24em] text-black/55 md:text-xs">
              <span>[ About Me ]</span>
              <span>02/04</span>
            </div>

            <div className="flex min-h-[58vh] w-full items-center pl-[clamp(3.5rem,12vw,16rem)] pr-[clamp(2rem,8vw,10rem)]">
              <p className="flex max-w-[78rem] flex-wrap justify-start gap-x-[0.44em] gap-y-[0.18em] font-sans text-[clamp(1.55rem,4.25vw,4.75rem)] font-black uppercase leading-[1.05] tracking-normal">
                {manifestoWords.map((word, index) => {
                  const quietWord = index % 3 === 1 || index % 5 === 0;

                  return (
                    <span
                      key={`${word}-${index}`}
                      className={`about-manifesto-word inline-flex whitespace-nowrap ${
                        quietWord ? "text-[#9d9d9d]" : "text-black"
                      }`}
                    >
                      {Array.from(word).map((letter, letterIndex) => (
                        <span
                          key={`${word}-${letter}-${letterIndex}`}
                          className="about-manifesto-char inline-block min-w-[0.58em] will-change-transform"
                        >
                          {letter}
                        </span>
                      ))}
                    </span>
                  );
                })}
              </p>
            </div>

            <div className="flex items-end justify-between gap-6 font-mono text-[10px] uppercase tracking-[0.22em] text-black/45">
              <span>Scroll to reveal story</span>
              <span>Growth / Hope</span>
            </div>
          </div>
        </div>

        {/* 3. Cube Panel (Combined seamlessly inside introRef pinned viewport) */}
        <div className="about-cube-panel absolute inset-0 bg-white z-40 select-none overflow-hidden" style={{ "--roll-size": "min(78vh, 82vw)" } as CSSProperties}>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_25%_32%,rgba(0,0,0,0.035),transparent_30%),radial-gradient(circle_at_78%_70%,rgba(0,0,0,0.03),transparent_36%)]" />

          <div className="relative z-10 h-full min-h-screen">
            <div className="relative h-full min-h-screen overflow-hidden">
              <div className="absolute left-8 top-20 z-20 flex flex-col gap-3 font-mono text-[10px] uppercase tracking-[0.32em] text-neutral-700 md:left-16">
                <span>Side {String(activeIndex + 1).padStart(2, "0")}</span>
                <span className="font-bold">{activeFace.label}</span>
              </div>

              <div
                className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 [perspective:1500px]"
                style={{ width: "var(--roll-size)", height: "var(--roll-size)" }}
              >
                <div
                  ref={cubeRef}
                  className="relative h-full w-full will-change-transform"
                  style={{
                    transformStyle: "preserve-3d",
                  }}
                >
                  {faces.map((face, index) => (
                    <CubeFaceContent key={face.label} faceIndex={index} />
                  ))}
                </div>
              </div>

              <div className="absolute bottom-10 right-8 z-20 w-72 font-mono text-[10px] uppercase tracking-widest text-neutral-500 md:right-16">
                <div className="mb-2 flex justify-between">
                  <span>Scroll Progress</span>
                  <span>{String(activeIndex + 1).padStart(2, "0")}/04</span>
                </div>
                <div className="h-px bg-neutral-200">
                  <div ref={progressRef} className="h-full origin-left bg-black" style={{ transform: "scaleX(0)" }} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="section-shell py-20 md:py-28">
        <MotionReveal y={35} duration={0.6} margin="-80px" id="skills" className="border border-white/5 bg-surface p-6 md:p-8 flex flex-col gap-8 shadow-2xl w-full overflow-hidden">
          <div className="flex flex-col gap-2 w-full items-center border-b border-white/5 pb-6">
            <div className="flex items-center justify-center gap-3 font-sans font-bold text-xs tracking-widest text-text-subtle uppercase select-none">
              <span className="w-8 h-[1px] bg-text-subtle" />
              01b - TECH STACK &amp; TOOLS
              <span className="w-8 h-[1px] bg-text-subtle" />
            </div>
            <h3 className="font-sans font-extrabold text-2xl md:text-3xl text-text mt-2 text-center select-none">
              Core Areas &amp; <span className="text-text-muted">Technologies</span>
            </h3>
          </div>

          <TechStackTabs />
        </MotionReveal>
      </div>

      <style>{`
        @keyframes marquee-left-triple {
          0% {
            transform: translate3d(0, 0, 0);
          }
          100% {
            transform: translate3d(-33.3333%, 0, 0);
          }
        }
        .animate-marquee-left-triple {
          animation: marquee-left-triple 28s linear infinite;
        }
        .about-profile-face {
          padding-left: clamp(2.25rem, 4vw, 4.25rem);
          padding-right: clamp(1.75rem, 4vw, 4rem);
        }
        .about-detail-face {
          padding-left: clamp(2.25rem, 4vw, 4.25rem);
          padding-right: clamp(1.75rem, 4vw, 4rem);
        }
        @media (max-width: 640px) {
          .about-profile-face,
          .about-detail-face {
            padding-left: 1.75rem;
            padding-right: 1.25rem;
          }
        }
      `}</style>
    </section>
  );
}
