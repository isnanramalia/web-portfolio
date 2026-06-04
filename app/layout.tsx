import type React from "react";
import type { Metadata } from "next";
import { Quicksand, JetBrains_Mono, Kalam } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import "./globals.css";

const quicksand = Quicksand({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-quicksand",
});

const kalam = Kalam({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-kalam",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
});

const BASE_URL = "https://isnanramalia.vercel.app";

export const metadata: Metadata = {
  title: "Isna Nur Amalia | Frontend Developer & Quality Assurance",
  description:
    "Quality Assurance who builds and breaks software. Skilled in manual testing, STLC, and structured bug reporting — backed by hands-on experience building web apps with React & Next.js.",
  keywords: [
    "Quality Assurance",
    "Quality Assurance Engineer",
    "Software Tester",
    "Manual Testing",
    "STLC",
    "Test Cases",
    "Bug Reporting",
    "Test Planning",
    "Frontend Developer",
    "React Developer",
    "Next.js Developer",
    "TypeScript",
    "JavaScript",
    "Web Developer",
    "Isna Nur Amalia",
    "Semarang",
    "Indonesia",
  ],
  metadataBase: new URL(BASE_URL),
  openGraph: {
    title: "Isna Nur Amalia | Quality Assurance & Frontend Developer",
    description:
      "Quality Assurance with a developer's eye for defects. I write test plans, test cases & bug reports — and I actually understand the code I'm testing.",
    url: BASE_URL,
    siteName: "Isna Nur Amalia — Portfolio",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Isna Nur Amalia | Quality Assurance & Frontend Developer",
    description:
      "Quality Assurance with frontend roots. Structured testing, clear bug reports, and a developer's intuition for why software breaks.",
    creator: "@isnanramalia",
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/favicon.ico",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
    },
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Isna Nur Amalia",
  url: BASE_URL,
  image: `${BASE_URL}/foto.jpg`,
  sameAs: [
    "https://github.com/isnanramalia",
    "https://linkedin.com/in/isnanramalia",
    "https://medium.com/@isnanramalia",
    "https://instagram.com/isnanramalia",
  ],
  jobTitle: "Quality Assurance & Frontend Developer",
  description:
    "Quality Assurance with hands-on frontend development experience. Skilled in manual testing, STLC, test case design, and bug reporting — with a developer's intuition for where and why software fails.",
  address: {
    "@type": "PostalAddress",
    addressLocality: "Semarang",
    addressCountry: "ID",
  },
  email: "isnanuramalia13@gmail.com",
  knowsAbout: [
    "Quality Assurance",
    "Manual Testing",
    "STLC",
    "Test Planning",
    "Test Case Design",
    "Bug Reporting",
    "Software Testing",
    "Frontend Development",
    "React",
    "Next.js",
    "TypeScript",
    "JavaScript",
    "Responsive Web Design",
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${quicksand.variable} ${jetbrainsMono.variable} ${kalam.variable} font-sans`}
      >
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange={false}
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
