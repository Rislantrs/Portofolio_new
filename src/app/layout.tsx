import type { Metadata, Viewport } from "next";
import { Herr_Von_Muellerhoff, Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
});

const signatureFont = Herr_Von_Muellerhoff({
  variable: "--font-signature",
  subsets: ["latin"],
  weight: ["400"],
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://rislantristansyah.my.id"),
  title: {
    default: "M Rislan Tristansyah - Creative Developer & AI Enthusiast Portfolio",
    template: "%s | M Rislan Tristansyah",
  },
  description:
    "Explore the portfolio of M Rislan Tristansyah, a Telecommunication Systems student focused on AI, cloud computing, networking, and web development.",
  icons: {
    icon: "/assets/Loading_logo_compressed.webp",
    apple: "/assets/Loading_logo_compressed.webp",
  },
  authors: [{ name: "M Rislan Tristansyah", url: "https://github.com/Rislantrs" }],
  creator: "M Rislan Tristansyah",
  publisher: "M Rislan Tristansyah",
  openGraph: {
    title: "M Rislan Tristansyah - Creative Developer & AI Enthusiast Portfolio",
    description:
      "Portfolio of M Rislan Tristansyah blending AI, networking, cloud computing, and interactive web development.",
    url: "https://rislantristansyah.my.id",
    siteName: "Rislan Portfolio",
    locale: "id_ID",
    type: "website",
    images: [
      {
        url: "/assets/Hero/Hero.webp",
        width: 1200,
        height: 630,
        alt: "M Rislan Tristansyah Portfolio Banner",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "M Rislan Tristansyah - Creative Developer & AI Enthusiast",
    description: "AI, cloud computing, networking, and interactive web portfolio.",
    creator: "@rislantrs",
    images: ["/assets/Hero/Hero.webp"],
  },
};

export const viewport: Viewport = {
  themeColor: "#050409",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ProfilePage",
    mainEntity: {
      "@type": "Person",
      name: "M Rislan Tristansyah",
      alternateName: "Rislan",
      url: "https://rislantristansyah.my.id",
      sameAs: [
        "https://www.linkedin.com/in/m-rislan-tristansyah-96669a294/",
        "https://github.com/Rislantrs",
        "https://www.credly.com/users/m-rislan-tristansyah",
      ],
      jobTitle: "Creative Developer & AI Enthusiast",
      alumniOf: {
        "@type": "EducationalOrganization",
        name: "Universitas Pendidikan Indonesia",
      },
    },
  };

  return (
    <html
      lang="en"
      className={`${inter.variable} ${signatureFont.variable} h-full antialiased`}
    >
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function () {
                try {
                  var nav = navigator || {};
                  var coarse = window.matchMedia && window.matchMedia("(pointer: coarse)").matches;
                  var reduced = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
                  var lowMemory = typeof nav.deviceMemory === "number" && nav.deviceMemory <= 4;
                  var lowCpu = typeof nav.hardwareConcurrency === "number" && nav.hardwareConcurrency <= 4;
                  var mobile = window.innerWidth <= 767;
                  var tablet = window.innerWidth <= 1024;
                  var mobileLike = coarse && tablet;
                  var constrainedMobileHardware = (lowMemory || lowCpu) && tablet;
                  var saveData = !!(nav.connection && nav.connection.saveData);
                  document.documentElement.dataset.perfMode = (reduced || saveData || mobile || mobileLike || constrainedMobileHardware) ? "lite" : "full";
                } catch (error) {
                  document.documentElement.dataset.perfMode = "full";
                }
              })();
            `.replace(/</g, "\\u003c"),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
          }}
        />
      </head>
      <body className="min-h-full flex flex-col bg-bg text-text selection:bg-accent selection:text-white">
        <div className="grain-overlay" aria-hidden="true" />
        {children}
      </body>
    </html>
  );
}
