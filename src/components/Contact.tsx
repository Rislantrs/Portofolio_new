import MagneticButton, { type MagneticButtonIcon } from "@/components/MagneticButton";

interface ContactLink {
  label: string;
  url: string;
  icon: MagneticButtonIcon;
}

const contactLinks: ContactLink[] = [
  {
    label: "Send Email",
    url: "https://mail.google.com/mail/?view=cm&fs=1&to=rislantristansyah@gmail.com",
    icon: "mail",
  },
  {
    label: "LinkedIn",
    url: "https://www.linkedin.com/in/m-rislan-tristansyah-96669a294/",
    icon: "linkedin",
  },
  {
    label: "GitHub",
    url: "https://github.com/Rislantrs",
    icon: "github",
  },
  {
    label: "Credly Profile",
    url: "https://www.credly.com/users/m-rislan-tristansyah",
    icon: "award",
  },
];

export default function Contact() {
  return (
    <section
      id="contact"
      className="relative w-full py-32 md:py-40 overflow-hidden bg-bg text-center flex flex-col items-center justify-center border-t border-white/5"
    >
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 font-display font-black text-[18vw] leading-none text-transparent [-webkit-text-stroke:1.5px_rgba(255,255,255,0.035)] z-0 pointer-events-none select-none"
        aria-hidden="true"
      >
        CONNECT
      </div>

      <div className="section-shell relative z-2 max-w-3xl flex flex-col items-center gap-8">
        <div className="flex items-center gap-3 font-display font-bold text-xs tracking-widest text-accent uppercase select-none">
          <span className="w-8 h-[1px] bg-accent" />
          06 - GET IN TOUCH
        </div>

        <h2 className="font-display font-black text-4xl md:text-7xl tracking-tighter leading-none select-none">
          Let&apos;s Build <br />
          Something <span className="bg-gradient-to-r from-accent-light to-fuchsia bg-clip-text text-transparent italic">Great</span>
        </h2>

        <p className="font-sans text-base md:text-lg text-text-muted leading-relaxed max-w-xl">
          I&apos;m always open to discussing internship opportunities, research collaborations, creative projects, or just chatting about artificial intelligence and networks.
        </p>

        <div className="flex flex-wrap justify-center items-center gap-4 md:gap-6 mt-6">
          {contactLinks.map((link) => (
            <MagneticButton key={link.label} {...link} />
          ))}
        </div>
      </div>
    </section>
  );
}
