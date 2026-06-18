export interface Certificate {
  id: number;
  name: string;
  organizer: string;
  year: string;
  category: "ai" | "cloud" | "network" | "web";
  badgeName: string;
  badgeIcon: string;
  link?: string;
}

export const certificates: Certificate[] = [
  {
    id: 1,
    name: "Gemini Certified — Generative AI",
    organizer: "Google",
    year: "2024",
    category: "ai",
    badgeName: "Gemini Academy",
    badgeIcon: "/assets/Gemini_compressed.webp",
  },
  {
    id: 2,
    name: "ACA Cloud Computing Certification",
    organizer: "Alibaba Cloud",
    year: "2024",
    category: "cloud",
    badgeName: "ACA Cloud",
    badgeIcon: "/assets/ACA_compressed.webp",
  },
  {
    id: 3,
    name: "Google Cloud Computing Foundation",
    organizer: "Google Cloud",
    year: "2024",
    category: "cloud",
    badgeName: "GCP Foundations",
    badgeIcon: "/assets/GCP_compressed.webp",
  },
  {
    id: 4,
    name: "Alibaba Cloud Certified Developer",
    organizer: "Alibaba Cloud",
    year: "2024",
    category: "cloud",
    badgeName: "Developer Cert",
    badgeIcon: "/assets/DEV_compressed.webp",
  },
  {
    id: 5,
    name: "HTML, CSS, and Javascript for Web Developers",
    organizer: "Johns Hopkins University",
    year: "2023",
    category: "web",
    badgeName: "JHU Web Dev",
    badgeIcon: "/assets/JohnCer_compressed.webp",
    link: "https://coursera.org/verify/QJNY8CPX7QZ2",
  },
  {
    id: 6,
    name: "Machine Learning Certification",
    organizer: "Coursera / Stanford",
    year: "2024",
    category: "ai",
    badgeName: "Machine Learning",
    badgeIcon: "/assets/MachineLearning_compressed.webp",
  },
];
