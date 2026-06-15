export type ProjectContentBlock =
  | {
      id: string;
      type: "heading";
      level: 2 | 3;
      text: string;
    }
  | {
      id: string;
      type: "paragraph";
      text: string;
    }
  | {
      id: string;
      type: "image";
      src: string;
      alt: string;
      caption?: string;
      align: "left" | "center" | "right" | "wide";
      size: "small" | "medium" | "large" | "full";
    }
  | {
      id: string;
      type: "list";
      items: string[];
    }
  | {
      id: string;
      type: "links";
      items: Array<{
        label: string;
        url: string;
      }>;
    };

export interface ProjectArticle {
  id: number;
  slug: string;
  title: string;
  shortTitle: string;
  year: string;
  description: string;
  category: string;
  tags: string[];
  image: string;
  github?: string;
  demo?: string;
  featured?: boolean;
  role: string;
  status: "draft" | "published";
  summary: string;
  content: ProjectContentBlock[];
}

export const projects: ProjectArticle[] = [
  {
    id: 1,
    slug: "mpk-osis-man-purwakarta",
    title: "Website MPK OSIS MAN Purwakarta",
    shortTitle: "OSIS MAN",
    year: "2024",
    description:
      "A collaborative project developing an official profile website for MPK OSIS MAN Purwakarta with dynamic content management features.",
    category: "Web Development",
    tags: ["PHP", "MySQL", "School Profile", "Consulting"],
    image: "/assets/mpkosis.png",
    demo: "https://mpkosis-manpwk.web.id/",
    featured: true,
    role: "Full-stack developer and student team contributor",
    status: "published",
    summary:
      "A school organization profile website built to make information, programs, and public communication easier to manage.",
    content: [
      {
        id: "context",
        type: "heading",
        level: 2,
        text: "Context",
      },
      {
        id: "intro",
        type: "paragraph",
        text: "This project focused on building a practical public website for MPK OSIS MAN Purwakarta. The site needed to present organization information clearly while giving the team a manageable way to publish content.",
      },
      {
        id: "image",
        type: "image",
        src: "/assets/mpkosis.png",
        alt: "Website MPK OSIS MAN Purwakarta preview",
        caption: "Public profile website for the school organization.",
        align: "wide",
        size: "full",
      },
      {
        id: "work",
        type: "heading",
        level: 2,
        text: "What I Built",
      },
      {
        id: "work-list",
        type: "list",
        items: [
          "Designed the website structure for organization profile content.",
          "Built dynamic content management features with PHP and MySQL.",
          "Collaborated with a student team and supported the school AI seminar program.",
        ],
      },
      {
        id: "links",
        type: "links",
        items: [{ label: "Live Website", url: "https://mpkosis-manpwk.web.id/" }],
      },
    ],
  },
  {
    id: 2,
    slug: "hedom-heart-rate-oxygen-monitor",
    title: "HEDOM: Heart Rate & Oxygen Monitor",
    shortTitle: "HEDOM IoT",
    year: "2024",
    description:
      "An innovative IoT device for real-time heart rate and SpO2 monitoring using MAX30102 sensor, ESP8266, and Blynk integration.",
    category: "IoT / Embedded",
    tags: ["IoT", "ESP8266", "Blynk", "MAX30102"],
    image: "/assets/iot.png",
    role: "Embedded system developer",
    status: "published",
    summary:
      "A compact IoT case study for monitoring heart rate and oxygen saturation with sensor hardware and cloud visualization.",
    content: [
      {
        id: "problem",
        type: "heading",
        level: 2,
        text: "Problem",
      },
      {
        id: "problem-text",
        type: "paragraph",
        text: "Health monitoring tools are often expensive or limited to clinical environments. HEDOM explores a more accessible prototype for real-time heart rate and SpO2 monitoring.",
      },
      {
        id: "hero-image",
        type: "image",
        src: "/assets/iot.png",
        alt: "HEDOM heart rate and oxygen monitor prototype",
        caption: "Prototype documentation for the HEDOM IoT device.",
        align: "wide",
        size: "full",
      },
      {
        id: "approach",
        type: "heading",
        level: 2,
        text: "Approach",
      },
      {
        id: "approach-list",
        type: "list",
        items: [
          "Used MAX30102 as the pulse oximetry sensor.",
          "Used ESP8266 as the network-connected microcontroller.",
          "Integrated Blynk for real-time data viewing.",
          "Focused on a simple prototype that could explain the end-to-end telemetry flow.",
        ],
      },
    ],
  },
  {
    id: 3,
    slug: "telco-customer-churn-prediction",
    title: "Telco Customer Churn Prediction",
    shortTitle: "Telco Churn",
    year: "2024",
    description:
      "XGBoost-based churn classification model achieving F1-Score 92.1%, Recall 89.8%, Precision 94.4%, and ROC AUC 99.0% on IBM Telco dataset.",
    category: "Machine Learning",
    tags: ["Machine Learning", "XGBoost", "Python", "IBM Dataset"],
    image: "/assets/Pembanding.png",
    github:
      "https://github.com/Rislantrs/Machine-Learning/tree/main/Project%20Telco%20churn",
    role: "Machine learning practitioner",
    status: "published",
    summary:
      "A churn prediction project using supervised learning to estimate which customers are likely to leave a telco service.",
    content: [
      {
        id: "overview",
        type: "paragraph",
        text: "This project uses the IBM Telco dataset to build and compare churn classification models. The best result came from XGBoost with strong recall and ROC AUC performance.",
      },
      {
        id: "image",
        type: "image",
        src: "/assets/Pembanding.png",
        alt: "Telco churn model comparison chart",
        caption: "Model comparison and evaluation result.",
        align: "center",
        size: "large",
      },
      {
        id: "results",
        type: "heading",
        level: 2,
        text: "Results",
      },
      {
        id: "metrics",
        type: "list",
        items: [
          "F1-Score: 92.1%",
          "Recall: 89.8%",
          "Precision: 94.4%",
          "ROC AUC: 99.0%",
        ],
      },
      {
        id: "links",
        type: "links",
        items: [
          {
            label: "GitHub Repository",
            url: "https://github.com/Rislantrs/Machine-Learning/tree/main/Project%20Telco%20churn",
          },
        ],
      },
    ],
  },
  {
    id: 4,
    slug: "ai-sentiment-analysis-lexicon-based",
    title: "AI Sentiment Analysis - Lexicon Based",
    shortTitle: "Sentiment AI",
    year: "2024",
    description:
      "YouTube comment sentiment analysis using Lexicon Based method on 1,054 comments with Sastrawi preprocessing and InSet dictionary.",
    category: "Natural Language Processing",
    tags: ["NLP", "Web Crawling", "Python", "Sastrawi"],
    image: "/assets/lexicon.png",
    github: "https://github.com/Rislantrs/Analisis-Sentimen-Prasiskom3",
    role: "NLP analyst",
    status: "published",
    summary:
      "A sentiment analysis workflow for Indonesian YouTube comments using preprocessing and lexicon scoring.",
    content: [
      {
        id: "overview",
        type: "paragraph",
        text: "This project analyzes YouTube comments using an Indonesian lexicon-based approach. It combines crawling, text cleaning, Sastrawi preprocessing, and sentiment scoring with the InSet dictionary.",
      },
      {
        id: "image",
        type: "image",
        src: "/assets/lexicon.png",
        alt: "Lexicon based sentiment analysis result",
        align: "center",
        size: "large",
      },
      {
        id: "process",
        type: "list",
        items: [
          "Collected 1,054 YouTube comments.",
          "Cleaned and normalized Indonesian text.",
          "Applied stemming with Sastrawi.",
          "Calculated sentiment using the InSet lexicon.",
        ],
      },
      {
        id: "links",
        type: "links",
        items: [
          {
            label: "GitHub Repository",
            url: "https://github.com/Rislantrs/Analisis-Sentimen-Prasiskom3",
          },
        ],
      },
    ],
  },
  {
    id: 5,
    slug: "sdn-library-network-case-study",
    title: "SDN - Library Network Case Study",
    shortTitle: "SDN Network",
    year: "2023",
    description:
      "Software Defined Networking implementation using hybrid topology with Ryu controller and Mininet WiFi, testing scalability from 10 to 100 users.",
    category: "Networking",
    tags: ["SDN", "Ryu Controller", "Mininet-WiFi", "Hybrid Topo"],
    image: "/assets/SDN.png",
    role: "Network simulation designer",
    status: "published",
    summary:
      "A software defined networking simulation that evaluates a hybrid topology for a library network environment.",
    content: [
      {
        id: "overview",
        type: "paragraph",
        text: "This case study explores SDN design using a Ryu controller and Mininet-WiFi. The network was tested across multiple user scales to observe behavior and scalability.",
      },
      {
        id: "image",
        type: "image",
        src: "/assets/SDN.png",
        alt: "SDN library network topology",
        align: "wide",
        size: "full",
      },
      {
        id: "points",
        type: "list",
        items: [
          "Built a hybrid topology scenario.",
          "Used Ryu controller for SDN control logic.",
          "Tested scalability from 10 to 100 users.",
        ],
      },
    ],
  },
  {
    id: 6,
    slug: "web-ajaib-interactive-digital-platform",
    title: "WEB AJAIB - Interactive Digital Platform",
    shortTitle: "Web Ajaib",
    year: "2025",
    description:
      "An interactive platform combining entertainment, education, and social awareness in one digital experience powered by Groq Llama3 model.",
    category: "Web & AI",
    tags: ["Flask", "Groq API", "Python", "Llama3"],
    image: "/assets/Cuplikan layar 2025-11-02 233325.png",
    demo: "https://web-ajaib.vercel.app/",
    featured: true,
    role: "Web and AI integration developer",
    status: "published",
    summary:
      "An experimental web platform combining playful interaction, educational content, and AI-powered features.",
    content: [
      {
        id: "overview",
        type: "paragraph",
        text: "WEB AJAIB was built as an interactive digital experience that blends utility, learning, and entertainment. The project experiments with AI-assisted features through Groq Llama3 integration.",
      },
      {
        id: "image",
        type: "image",
        src: "/assets/Cuplikan layar 2025-11-02 233325.png",
        alt: "WEB AJAIB platform preview",
        align: "wide",
        size: "full",
      },
      {
        id: "links",
        type: "links",
        items: [{ label: "Live Demo", url: "https://web-ajaib.vercel.app/" }],
      },
    ],
  },
  {
    id: 7,
    slug: "house-price-prediction-catboost",
    title: "House Price Prediction - CatBoost",
    shortTitle: "CatBoost Price",
    year: "2024",
    description:
      "CatBoost regression model achieving R2 = 0.9930 for house price prediction with feature influence analysis.",
    category: "Machine Learning",
    tags: ["Python", "CatBoost", "Scikit-Learn", "Regression"],
    image: "/assets/rumah.png",
    github: "https://github.com/Rislantrs/Prasiskom2-Project-Prediksi-Harga-Rumah",
    role: "Machine learning practitioner",
    status: "published",
    summary:
      "A regression project that predicts house prices and studies which building attributes contribute most strongly.",
    content: [
      {
        id: "overview",
        type: "paragraph",
        text: "This project uses CatBoost regression for house price prediction. The analysis shows that building quality and total surface area are among the strongest price drivers.",
      },
      {
        id: "image",
        type: "image",
        src: "/assets/rumah.png",
        alt: "House price prediction analysis",
        align: "center",
        size: "large",
      },
      {
        id: "links",
        type: "links",
        items: [
          {
            label: "GitHub Repository",
            url: "https://github.com/Rislantrs/Prasiskom2-Project-Prediksi-Harga-Rumah",
          },
        ],
      },
    ],
  },
  {
    id: 8,
    slug: "hapino-happy-arduino",
    title: "HAPINO - Happy Arduino",
    shortTitle: "HAPINO IoT",
    year: "2023",
    description:
      "Creative Arduino Uno project that plays Happy Birthday musical note, sweeps physical servo gates, lights RGB LEDs, and displays LCD messages on button press.",
    category: "IoT / Embedded",
    tags: ["Arduino", "IoT", "Embedded System", "C++"],
    image: "/assets/Uno.png",
    github: "https://drive.google.com/drive/u/1/folders/1tAoaLIUd6-Hh7cDGcS7JON4q5bH5It3y",
    role: "Embedded system builder",
    status: "published",
    summary:
      "A playful Arduino prototype combining sound, servo movement, RGB LED feedback, and LCD interaction.",
    content: [
      {
        id: "overview",
        type: "paragraph",
        text: "HAPINO combines several Arduino components into one interactive prototype. It reacts to button input by playing a melody, moving servo gates, lighting RGB LEDs, and showing LCD messages.",
      },
      {
        id: "image",
        type: "image",
        src: "/assets/Uno.png",
        alt: "Arduino Uno project preview",
        align: "center",
        size: "large",
      },
      {
        id: "links",
        type: "links",
        items: [
          {
            label: "Project Files",
            url: "https://drive.google.com/drive/u/1/folders/1tAoaLIUd6-Hh7cDGcS7JON4q5bH5It3y",
          },
        ],
      },
    ],
  },
  {
    id: 9,
    slug: "lsb-steganography-matlab",
    title: "LSB Steganography - MATLAB",
    shortTitle: "MATLAB Stego",
    year: "2023",
    description:
      "Least Significant Bit steganography implementation for embedding and extracting hidden text messages in digital cover images.",
    category: "Cyber Security",
    tags: ["MATLAB", "Steganography", "Cryptography", "Security"],
    image: "/assets/stego.jpeg",
    github: "https://github.com/Rislantrs/Steganografi",
    role: "Security algorithm implementer",
    status: "published",
    summary:
      "A MATLAB implementation of LSB steganography for hiding and extracting text inside cover images.",
    content: [
      {
        id: "overview",
        type: "paragraph",
        text: "This project implements Least Significant Bit steganography in MATLAB. It embeds hidden text into cover images and evaluates quality using PSNR and SSIM.",
      },
      {
        id: "image",
        type: "image",
        src: "/assets/stego.jpeg",
        alt: "LSB steganography project preview",
        align: "center",
        size: "large",
      },
      {
        id: "links",
        type: "links",
        items: [{ label: "GitHub Repository", url: "https://github.com/Rislantrs/Steganografi" }],
      },
    ],
  },
];

export const publishedProjects = projects.filter((project) => project.status === "published");

export function getProjectBySlug(slug: string) {
  return publishedProjects.find((project) => project.slug === slug);
}

export function getRelatedProjects(slug: string, limit = 3) {
  const current = getProjectBySlug(slug);
  if (!current) return publishedProjects.filter((project) => project.slug !== slug).slice(0, limit);

  return publishedProjects
    .filter((project) => project.slug !== slug)
    .map((project) => ({
      project,
      score: project.tags.filter((tag) => current.tags.includes(tag)).length +
        (project.category === current.category ? 2 : 0),
    }))
    .sort((a, b) => b.score - a.score)
    .map(({ project }) => project)
    .slice(0, limit);
}
