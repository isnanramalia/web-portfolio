"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { ExternalLink, Clock, ArrowUpRight } from "lucide-react";
import Image from "next/image";
import { staggerContainer, staggerItem } from "@/lib/animations";

interface MediumArticle {
  title: string;
  link: string;
  pubDate: string;
  thumbnail?: string;
  description: string;
  readingTime: number;
  categories: string[];
}

const CARD_GRADIENTS = [
  "from-violet-500/20 via-purple-500/10 to-fuchsia-500/20",
  "from-cyan-500/20 via-sky-500/10 to-blue-500/20",
  "from-emerald-500/20 via-teal-500/10 to-green-500/20",
];

const CARD_ICON_GRADIENTS = [
  "from-violet-500 to-fuchsia-500",
  "from-cyan-500 to-blue-500",
  "from-emerald-500 to-teal-500",
];

function ArticleSkeleton() {
  return (
    <div className="glass-card rounded-2xl overflow-hidden animate-pulse">
      <div className="h-44 bg-muted" />
      <div className="p-5 space-y-3">
        <div className="flex gap-2">
          <div className="h-5 w-16 bg-muted rounded-full" />
        </div>
        <div className="space-y-2">
          <div className="h-5 bg-muted rounded w-full" />
          <div className="h-5 bg-muted rounded w-4/5" />
        </div>
        <div className="flex items-center gap-3">
          <div className="h-3.5 bg-muted rounded w-20" />
          <div className="h-3.5 bg-muted rounded w-16" />
        </div>
        <div className="space-y-1.5 pt-1">
          <div className="h-3.5 bg-muted rounded w-full" />
          <div className="h-3.5 bg-muted rounded w-11/12" />
          <div className="h-3.5 bg-muted rounded w-3/4" />
        </div>
        <div className="h-4 bg-muted rounded w-24 mt-2" />
      </div>
    </div>
  );
}

function ArticleCard({
  article,
  index,
}: {
  article: MediumArticle;
  index: number;
}) {
  const [imgError, setImgError] = useState(false);
  const showThumbnail = article.thumbnail && !imgError;
  const firstCategory = article.categories[0] ?? "Article";

  return (
    <motion.article
      variants={staggerItem}
      className="group flex flex-col glass-card glass-card-hover rounded-2xl overflow-hidden smooth-hover cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
      role="button"
      tabIndex={0}
      aria-label={`Read article: ${article.title}`}
      onClick={() => window.open(article.link, "_blank", "noopener,noreferrer")}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          window.open(article.link, "_blank", "noopener,noreferrer");
        }
      }}
    >
      <div className="relative h-44 overflow-hidden shrink-0">
        {showThumbnail ? (
          <Image
            src={article.thumbnail!}
            alt={article.title}
            fill
            sizes="(max-width: 1024px) 100vw, 33vw"
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            onError={() => setImgError(true)}
            unoptimized
          />
        ) : (
          <div
            className={`absolute inset-0 bg-gradient-to-br ${CARD_GRADIENTS[index % CARD_GRADIENTS.length]} flex items-center justify-center`}
          >
            <div
              className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${CARD_ICON_GRADIENTS[index % CARD_ICON_GRADIENTS.length]} flex items-center justify-center shadow-lg`}
            >
              <svg
                viewBox="0 0 1633.77 1150.51"
                className="w-7 h-7"
                fill="white"
                xmlns="http://www.w3.org/2000/svg"
              >
                <g>
                  <path d="M883.45,576.26c0,163.67-131.78,296.35-294.33,296.35S294.78,739.93,294.78,576.26,426.56,279.9,589.12,279.9,883.45,412.59,883.45,576.26" />
                  <path d="M1206.34,576.26c0,154.06-65.89,279-147.17,279S912,730.32,912,576.26s65.88-279,147.16-279,147.17,124.9,147.17,279" />
                  <path d="M1338.41,576.26c0,138-23.17,249.94-51.76,249.94s-51.75-111.91-51.75-249.94,23.17-249.94,51.75-249.94,51.76,111.9,51.76,249.94" />
                </g>
              </svg>
            </div>
          </div>
        )}
        <div className="absolute inset-0 bg-transparent group-hover:bg-foreground/5 transition-colors duration-300" />
      </div>

      <div className="flex flex-col flex-1 p-5 gap-3">
        <div className="flex flex-wrap gap-1.5">
          <span className="text-xs font-medium px-2.5 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20">
            {firstCategory}
          </span>
        </div>

        <h3 className="text-base font-semibold leading-snug text-card-foreground group-hover:text-primary transition-colors duration-200 line-clamp-2 font-handwritten">
          {article.title}
        </h3>

        <div className="flex items-center gap-3 text-xs text-muted-foreground">
          <span>{article.pubDate}</span>
          <span className="w-0.5 h-0.5 rounded-full bg-muted-foreground/50" />
          <span className="flex items-center gap-1">
            <Clock className="w-3 h-3" />
            {article.readingTime} min read
          </span>
        </div>

        <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3 flex-1">
          {article.description}
        </p>

        <div className="flex items-center text-sm font-medium text-primary group-hover:gap-2 gap-1 transition-all duration-200 mt-1 w-fit">
          Read article
          <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </div>
      </div>
    </motion.article>
  );
}

const FALLBACK_ARTICLES: MediumArticle[] = [
  {
    title:
      "Dua Minggu Belajar Manual Testing — Ini yang Berubah dari Cara Pikirku",
    link: "https://medium.com/@isnanramalia/dua-minggu-belajar-manual-testing-ini-yang-berubah-dari-cara-pikirku-935a51c5526e",
    pubDate: "Mar 21, 2026",
    description:
      "Dua minggu sudah berlalu sejak aku pertama kali buka materi SQA. Sembilan artikel sudah publish, puluhan test case sudah ditulis, beberapa bug sudah didokumentasikan. Dan sekarang saatnya berhenti sebentar, noleh ke belakang, dan jujur — apa yang sebenarnya berubah?",
    readingTime: 6,
    categories: ["QA", "Testing", "Learning"],
  },
  {
    title: "Test Plan: Sepenting Apa Sih Sebenernya?",
    link: "https://medium.com/@isnanramalia/test-plan-sepenting-apa-sih-sebenernya-d9c26d7d3d95",
    pubDate: "Mar 14, 2026",
    description:
      "Setelah fokus membuat Test Case, selanjutnya roadmap belajarku adalah finalisasi Test Plan. Dan di tengah proses itu muncul satu pertanyaan yang cukup mengganggu: Emang sepenting itu ya bikin Test Plan ini?",
    readingTime: 5,
    categories: ["QA", "Testing", "Test Plan"],
  },
  {
    title: "Regression Testing & Agile, Posisi QA di Tim Dev Itu Seperti Ini?",
    link: "https://medium.com/@isnanramalia/regression-testing-agile-posisi-qa-di-tim-dev-itu-seperti-ini-6d1d62b98441",
    pubDate: "Mar 13, 2026",
    description:
      "Hari ke-delapan belajar SQA, dan hari ini materinya ada dua yang saling berkaitan: Regression Testing dan Agile. Keduanya nyambung karena di dunia kerja nyata, regression testing itu justru paling sering muncul di lingkungan tim yang pakai Agile.",
    readingTime: 6,
    categories: ["QA", "Agile", "Testing"],
  },
];

export function MediumSection() {
  const [articles, setArticles] = useState<MediumArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [shouldLoad, setShouldLoad] = useState(false);
  const sectionRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const sectionEl = sectionRef.current;
    if (!sectionEl) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return;
        setShouldLoad(true);
        observer.disconnect();
      },
      { rootMargin: "400px 0px" },
    );

    observer.observe(sectionEl);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!shouldLoad) return;

    let cancelled = false;

    async function load() {
      try {
        const res = await fetch("/api/medium");
        if (!res.ok) throw new Error("non-ok response");
        const data = await res.json();
        if (!cancelled) {
          setArticles(data.articles ?? []);
        }
      } catch {
        if (!cancelled) setArticles(FALLBACK_ARTICLES);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [shouldLoad]);

  return (
    <motion.section
      id="writing"
      ref={sectionRef}
      className="px-4 sm:px-6 lg:px-12 py-8 lg:py-16"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      viewport={{ once: true }}
    >
      <div className="max-w-4xl mx-auto">
        <div className="flex items-end justify-between mb-8">
          <div>
            <motion.h2
              className="text-2xl font-medium text-foreground doodle-section-heading"
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4 }}
              viewport={{ once: true }}
            >
              Latest Writing
            </motion.h2>
            <motion.p
              className="text-sm text-muted-foreground mt-1"
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: 0.05 }}
              viewport={{ once: true }}
            >
              Documenting my journey in QA, Testing & Software Development
            </motion.p>
          </div>

          <motion.a
            href="https://medium.com/@isnanramalia"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground hover:font-semibold transition-all shrink-0 group"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            viewport={{ once: true }}
          >
            View all
            <ExternalLink className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </motion.a>
        </div>

        {!shouldLoad || loading ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {[0, 1, 2].map((i) => (
              <ArticleSkeleton key={i} />
            ))}
          </div>
        ) : articles.length > 0 ? (
          <motion.div
            className="grid grid-cols-1 lg:grid-cols-3 gap-6"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
          >
            {articles.map((article, index) => (
              <ArticleCard key={article.link} article={article} index={index} />
            ))}
          </motion.div>
        ) : (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <p className="text-muted-foreground text-sm">
              Unable to load articles. Visit{" "}
              <a
                href="https://medium.com/@isnanramalia"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary underline underline-offset-2"
              >
                Medium
              </a>{" "}
              directly.
            </p>
          </div>
        )}
      </div>
    </motion.section>
  );
}
