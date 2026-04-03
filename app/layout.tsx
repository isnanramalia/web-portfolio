import type React from "react";
import type { Metadata } from "next";
import { Quicksand, JetBrains_Mono } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import "./globals.css";

const quicksand = Quicksand({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-quicksand",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
});

const BASE_URL = "https://isnanramalia.vercel.app"; // update to your actual domain

export const metadata: Metadata = {
  title: "Isna Nur Amalia - Frontend Developer & QA Engineer",
  description:
    "Frontend Developer transitioning into Quality Assurance. I build responsive web apps with React & Next.js, and write test plans, test cases, and bug reports to make sure software works as it should.",
  metadataBase: new URL(BASE_URL),
  openGraph: {
    title: "Isna Nur Amalia - Frontend Developer & QA Engineer",
    description:
      "Frontend Developer transitioning into QA. Building web apps with React & Next.js, and ensuring quality through structured manual testing.",
    url: BASE_URL,
    siteName: "Isna Nur Amalia Portfolio",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Isna Nur Amalia - Frontend Developer & QA Engineer",
    description:
      "Frontend Developer transitioning into QA. Building web apps with React & Next.js, and ensuring quality through structured manual testing.",
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
  image: `${BASE_URL}/foto.png`,
  sameAs: [
    "https://github.com/isnanramalia",
    "https://linkedin.com/in/isnanramalia",
    "https://medium.com/@isnanramalia",
    "https://instagram.com/isnanramalia",
  ],
  jobTitle: "Frontend Developer & QA Engineer",
  address: {
    "@type": "PostalAddress",
    addressLocality: "Semarang",
    addressCountry: "ID",
  },
  email: "isnanuramalia13@gmail.com",
  knowsAbout: [
    "Frontend Development",
    "React",
    "Next.js",
    "TypeScript",
    "Quality Assurance",
    "Manual Testing",
    "Test Planning",
    "Bug Reporting",
    "STLC",
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
        className={`${quicksand.variable} ${jetbrainsMono.variable} font-sans`}
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
