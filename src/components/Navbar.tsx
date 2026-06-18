"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";

interface NavLink {
  label: string;
  id?: string;
  href?: string;
}

const navLinks: NavLink[] = [
  { label: "Home",      id: "home"           },
  { label: "About",     id: "about"          },
  { label: "Skills",    id: "skills"         },
  { label: "Projects",  id: "projects"       },
  { label: "Dashboard", href: "/dashboard"   },
  { label: "Forum",     href: "/forum"       },
  { label: "Contact",   id: "contact-footer" },
];

export default function Navbar() {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const [activeSection, setActiveSection] = useState<string>("home");
  const [menuOpen, setMenuOpen]           = useState<boolean>(false);
  const [scrolled, setScrolled]           = useState<boolean>(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40);

    const observer = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && setActiveSection(e.target.id)),
      { root: null, rootMargin: "-40% 0px -40% 0px", threshold: 0.1 }
    );
    navLinks.forEach(({ id }) => {
      if (!id) return;
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    window.addEventListener("scroll", handleScroll);
    return () => { window.removeEventListener("scroll", handleScroll); observer.disconnect(); };
  }, []);

  const scrollTo = (e: React.MouseEvent<HTMLElement>, link: NavLink) => {
    setMenuOpen(false);
    if (link.href) return;

    if (!isHome) {
      // Allow default navigation to /#id
      return;
    }

    e.preventDefault();
    const id = link.id;
    if (!id) return;
    const el = document.getElementById(id);
    if (el) {
      const top = el.getBoundingClientRect().top + window.scrollY - 80;
      window.scrollTo({ top, behavior: "smooth" });
    }
  };

  return (
    <header className="contents">
      {/* ── Fixed Burger Button at Top Right ────────────────────────────────── */}
      <button
        id="navbar-burger-btn"
        onClick={() => setMenuOpen(!menuOpen)}
        aria-label="Toggle menu"
        className={`fixed top-6 right-6 md:right-8 z-50 flex items-center justify-center w-12 h-12 rounded-full border transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-accent ${
          scrolled || menuOpen
            ? "bg-bg-elevated/80 border-accent/20 text-white shadow-lg backdrop-blur-md"
            : "bg-black/40 border-white/10 text-white hover:bg-black/60 backdrop-blur-sm"
        }`}
      >
        {menuOpen ? <X size={24} strokeWidth={2} /> : <Menu size={24} strokeWidth={2} />}
      </button>

      {/* ── Full-screen overlay menu ─────────────────────────────────────────── */}
      <nav
        className={`fixed inset-0 z-45 flex flex-col items-center justify-center gap-4 transition-all duration-500 ${
          menuOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
        style={{ background: "rgba(5,5,5,0.97)", backdropFilter: "blur(24px)" }}
      >
        {navLinks.map((link, i) => {
          const className = `group relative font-display font-black text-4xl md:text-6xl tracking-tighter uppercase transition-all duration-300 select-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent ${
            link.id && activeSection === link.id
              ? "text-accent-light"
              : "text-white/25 hover:text-white"
          }`;
          const style = { transitionDelay: menuOpen ? `${i * 50}ms` : "0ms" };
          const content = (
            <>
              <span className="absolute -bottom-1 left-0 h-[2px] w-0 group-hover:w-full bg-gradient-to-r from-accent to-fuchsia transition-all duration-300 rounded-full" />
              {link.label}
            </>
          );

          return link.href ? (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMenuOpen(false)}
              className={className}
              style={style}
            >
              {content}
            </Link>
          ) : (
            <Link
              key={link.id}
              href={isHome ? `#${link.id}` : `/#${link.id}`}
              onClick={(e) => scrollTo(e, link)}
              className={className}
              style={style}
            >
              {content}
            </Link>
          );
        })}
      </nav>
    </header>
  );
}
