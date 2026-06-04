import type { Metadata } from "next";

const BASE_URL = "https://isnanramalia.vercel.app";

export type SectionKey =
  | "home"
  | "about"
  | "skills"
  | "projects"
  | "writing"
  | "contact";

const SECTION_DATA: Record<
  SectionKey,
  { title: string; description: string; path: string }
> = {
  home: {
    title: "Isna Nur Amalia | Quality Assurance & Frontend Developer",
    description:
      "Quality Assurance who builds and breaks software. Skilled in manual testing, STLC, and structured bug reporting — backed by hands-on experience building web apps with React & Next.js.",
    path: "/",
  },
  about: {
    title: "About — Isna Nur Amalia | QA Engineer & Frontend Developer",
    description:
      "Isna's journey from frontend development to quality assurance. Computer Science graduate from Dian Nuswantoro University with hands-on experience at multiple tech companies and organizations.",
    path: "/about",
  },
  skills: {
    title: "Skills — Isna Nur Amalia | QA Testing & Frontend",
    description:
      "Technical skills spanning quality assurance (STLC, test case design, bug reporting, UAT) and frontend development (React, Next.js, TypeScript, Tailwind CSS, Laravel).",
    path: "/skills",
  },
  projects: {
    title: "Projects — Isna Nur Amalia | QA & Web Development Portfolio",
    description:
      "10+ delivered projects: web applications, mobile apps, and QA documentation. Includes a full-cycle manual testing study with 30+ test cases and a UAT study achieving 84% satisfaction.",
    path: "/projects",
  },
  writing: {
    title: "Writing — Isna Nur Amalia | QA Learning Journey",
    description:
      "Articles and reflections on quality assurance, software testing methodologies, regression testing, Agile workflows, and the journey from frontend development to QA engineering.",
    path: "/writing",
  },
  contact: {
    title: "Contact — Isna Nur Amalia | Seeking QA Roles",
    description:
      "Get in touch with Isna for QA Engineer or Frontend Developer opportunities. Open to full-time, freelance, and internship roles in Semarang, Indonesia or remote.",
    path: "/contact",
  },
};

export function buildSectionMetadata(section: SectionKey): Metadata {
  const meta = SECTION_DATA[section];
  const url = `${BASE_URL}${meta.path}`;

  return {
    title: meta.title,
    description: meta.description,
    metadataBase: new URL(BASE_URL),
    alternates: { canonical: url },
    openGraph: {
      title: meta.title,
      description: meta.description,
      url,
      siteName: "Isna Nur Amalia — Portfolio",
      locale: "en_US",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: meta.title,
      description: meta.description,
      creator: "@isnanramalia",
    },
    robots: {
      index: true,
      follow: true,
      googleBot: { index: true, follow: true, "max-image-preview": "large" },
    },
  };
}
