import type { Metadata, Viewport } from "next";
import { Cinzel, Herr_Von_Muellerhoff, Inter, Montserrat } from "next/font/google";
import "./globals.css";

const cinzel = Cinzel({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
});

const inter = Inter({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const signatureFont = Herr_Von_Muellerhoff({
  variable: "--font-signature",
  subsets: ["latin"],
  weight: ["400"],
});

const megaFont = Montserrat({
  variable: "--font-mega",
  subsets: ["latin"],
  weight: ["900"],
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://rislantristansyah.my.id"),
  title: {
    default: "M Rislan Tristansyah - Creative Developer & AI Enthusiast Portfolio",
    template: "%s | M Rislan Tristansyah",
  },
  description:
    "Explore the portfolio of M Rislan Tristansyah, a Telecommunication Systems student focused on AI, cloud computing, networking, and web development.",
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
        url: "/assets/Hero/Hero.png",
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
    images: ["/assets/Hero/Hero.png"],
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
      className={`${cinzel.variable} ${inter.variable} ${signatureFont.variable} ${megaFont.variable} h-full antialiased`}
    >
      <head>
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
