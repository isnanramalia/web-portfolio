"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import {
  Download,
  Send,
  ChevronDown,
  ChevronRight,
  Github,
  Linkedin,
  Instagram,
} from "lucide-react";
import Image from "next/image";
import { AnimatedText } from "@/components/animated-text";
import { fadeInUp, staggerContainer, staggerItem } from "@/lib/animations";
import { socialMedia } from "@/lib/data";

// ── Typewriter constants ───────────────────────────────────────────────────
const LINE1 = "I Build It.";
const LINE2 = "Then I Break It.";
const TYPE_SPEED = 62;
const LINE1_DELAY_MS = 850;
const LINE2_DELAY_MS = LINE1_DELAY_MS + LINE1.length * TYPE_SPEED + 150;

// ── TypewriterLine ─────────────────────────────────────────────────────────
function TypewriterLine({
  text,
  delayMs,
  start,
}: {
  text: string;
  delayMs: number;
  start: boolean;
}) {
  const [count, setCount] = useState(0);
  const done = count >= text.length;

  useEffect(() => {
    if (!start) {
      setCount(0);
      return;
    }

    let interval: ReturnType<typeof setInterval>;

    const timeoutId = setTimeout(() => {
      interval = setInterval(() => {
        setCount((c) => {
          if (c >= text.length) {
            clearInterval(interval);
            return c;
          }
          return c + 1;
        });
      }, TYPE_SPEED);
    }, delayMs);

    return () => {
      clearTimeout(timeoutId);
      clearInterval(interval);
    };
  }, [text, delayMs, start]);

  return (
    <>
      {text.slice(0, count)}
      {start && !done && (
        <motion.span
          className="inline-block w-[3px] h-[0.82em] bg-current align-middle ml-0.5 rounded-full"
          animate={{ opacity: [1, 1, 0, 0] }}
          transition={{
            duration: 0.9,
            repeat: Infinity,
            times: [0, 0.45, 0.45, 1],
          }}
        />
      )}
    </>
  );
}

// ── CountUpStat ────────────────────────────────────────────────────────────
function CountUpStat({
  value,
  label,
  index,
  start,
}: {
  value: string;
  label: string;
  index: number;
  start: boolean;
}) {
  const match = value.match(/^(\d+)(\+?)$/);
  const isNum = !!match;
  const target = match ? parseInt(match[1], 10) : 0;
  const suffix = match ? match[2] : "";

  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!isNum) return;
    if (!start) {
      setCount(0);
      return;
    }

    const startDelay = (0.85 + index * 0.12 + 0.35) * 1000;
    let raf: number;

    const t = setTimeout(() => {
      const origin = performance.now();
      const duration = 1400;

      const tick = (now: number) => {
        const p = Math.min((now - origin) / duration, 1);
        const eased = 1 - Math.pow(1 - p, 3);
        setCount(Math.round(eased * target));
        if (p < 1) raf = requestAnimationFrame(tick);
      };

      raf = requestAnimationFrame(tick);
    }, startDelay);

    return () => {
      clearTimeout(t);
      cancelAnimationFrame(raf);
    };
  }, [isNum, target, index, start]);

  return (
    <motion.div
      className="px-4 py-2.5 bg-card border border-border rounded-2xl text-center min-w-[96px]"
      initial={{ opacity: 0, y: 14 }}
      animate={start ? { opacity: 1, y: 0 } : { opacity: 0, y: 14 }}
      transition={{ delay: 0.85 + index * 0.12, duration: 0.4 }}
    >
      <div className="text-xl font-bold text-foreground tabular-nums">
        {isNum ? `${count}${suffix}` : value}
      </div>
      <div className="text-xs text-muted-foreground mt-0.5 leading-tight">
        {label}
      </div>
    </motion.div>
  );
}

// ── Data ───────────────────────────────────────────────────────────────────
interface HeroSectionProps {
  scrollToSection: (sectionId: string) => void;
  startAnimations: boolean;
}

const MediumIcon = ({ className }: { className?: string }) => (
  <svg
    viewBox="0 0 1633.77 1150.51"
    className={className}
    fill="currentColor"
    xmlns="http://www.w3.org/2000/svg"
  >
    <g>
      <path d="M883.45,576.26c0,163.67-131.78,296.35-294.33,296.35S294.78,739.93,294.78,576.26,426.56,279.9,589.12,279.9,883.45,412.59,883.45,576.26" />
      <path d="M1206.34,576.26c0,154.06-65.89,279-147.17,279S912,730.32,912,576.26s65.88-279,147.16-279,147.17,124.9,147.17,279" />
      <path d="M1338.41,576.26c0,138-23.17,249.94-51.76,249.94s-51.75-111.91-51.75-249.94,23.17-249.94,51.75-249.94,51.76,111.9,51.76,249.94" />
    </g>
  </svg>
);

const SocialIcon = ({ platform }: { platform: string }) => {
  switch (platform) {
    case "github":
      return <Github className="w-4 h-4" />;
    case "linkedin":
      return <Linkedin className="w-4 h-4" />;
    case "medium":
      return <MediumIcon className="w-4 h-4" />;
    case "instagram":
      return <Instagram className="w-4 h-4" />;
    default:
      return null;
  }
};

const STATS = [
  { value: "10+", label: "Projects Delivered" },
  { value: "100+", label: "Test Cases Written" },
  { value: "STLC", label: "Full Cycle QA" },
];

// ── HeroSection ────────────────────────────────────────────────────────────
export function HeroSection({
  scrollToSection,
  startAnimations,
}: HeroSectionProps) {
  return (
    <motion.section
      id="hero"
      className="px-4 sm:px-6 lg:px-12 py-8 lg:py-20 relative overflow-hidden min-h-[85vh] lg:min-h-[90vh] flex items-center"
      variants={staggerContainer}
      initial="hidden"
      animate={startAnimations ? "visible" : "hidden"}
    >
      {/* Decorative background blobs */}
      <motion.div
        className="absolute top-1/3 right-1/4 w-80 h-80 bg-primary/5 rounded-full blur-3xl pointer-events-none"
        style={{ willChange: "transform" }}
        animate={{ scale: [1, 1.12, 1], opacity: [0.25, 0.45, 0.25] }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute bottom-1/4 left-1/3 w-56 h-56 bg-accent/10 rounded-full blur-3xl pointer-events-none"
        style={{ willChange: "transform" }}
        animate={{ scale: [1.1, 1, 1.1], opacity: [0.15, 0.3, 0.15] }}
        transition={{
          duration: 16,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 4,
        }}
      />

      <div className="max-w-4xl mx-auto relative z-10 w-full">
        <motion.div
          className="lg:hidden mb-10 text-center"
          variants={staggerItem}
        >
          <div className="flex items-center justify-center gap-3 mb-5">
            <div className="relative w-14 h-14 rounded-full overflow-hidden border-2 border-border shrink-0">
              <Image
                src="/foto.png"
                alt="Isna Nur Amalia"
                fill
                className="object-cover"
              />
            </div>
            <div className="text-left">
              <p className="font-bold text-foreground text-base leading-tight">
                Isna Nur Amalia
              </p>
              <p className="text-xs text-muted-foreground">
                Semarang, Indonesia
              </p>
            </div>
          </div>

          <div className="flex items-center justify-center gap-2 flex-wrap">
            <span className="px-3 py-1 text-xs bg-card border border-border rounded-full text-foreground font-medium">
              Frontend Dev
            </span>
            <ChevronRight className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
            <span className="px-3 py-1 text-xs bg-primary/10 border border-primary/20 rounded-full text-primary font-semibold">
              QA Practitioner
            </span>
          </div>
        </motion.div>

        <motion.div
          className="text-center lg:text-left"
          variants={staggerContainer}
        >
          {/* Open-to-work badge */}
          <motion.div
            className="inline-flex items-center gap-2 px-4 py-1.5 bg-green-500/10 border border-green-500/20 rounded-full mb-8"
            variants={staggerItem}
          >
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse shrink-0" />
            <span className="text-sm font-medium text-green-600 dark:text-green-400">
              Seeking QA Roles
            </span>
          </motion.div>

          {/* Tagline — typewriter effect */}
          <motion.h1
            className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold mb-6 leading-tight"
            variants={staggerItem}
          >
            <span className="block text-foreground min-h-[1.25em]">
              <TypewriterLine
                text={LINE1}
                delayMs={LINE1_DELAY_MS}
                start={startAnimations}
              />
            </span>
            <span className="block text-primary min-h-[1.25em]">
              <TypewriterLine
                text={LINE2}
                delayMs={LINE2_DELAY_MS}
                start={startAnimations}
              />
            </span>
          </motion.h1>

          {/* Description */}
          <motion.p
            className="text-base sm:text-lg text-muted-foreground leading-relaxed mb-8 max-w-xl mx-auto lg:mx-0"
            variants={fadeInUp}
          >
            <AnimatedText
              text="Frontend developer with hands-on QA practice. I write test plans, test cases, and bug reports, my background building software means I know exactly where and why things break."
              variant="reveal"
              delay={0.6}
            />
          </motion.p>

          {/* Stats — count-up animation */}
          <motion.div
            className="flex flex-wrap gap-3 justify-center lg:justify-start mb-8"
            variants={staggerItem}
          >
            {STATS.map((stat, i) => (
              <CountUpStat
                key={stat.label}
                value={stat.value}
                label={stat.label}
                index={i}
                start={startAnimations}
              />
            ))}
          </motion.div>

          {/* Mobile CTAs */}
          <motion.div
            className="lg:hidden flex flex-wrap gap-3 justify-center mb-6"
            variants={staggerItem}
          >
            <Button
              asChild
              className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-2xl shadow-md group"
            >
              <a
                href="/Isna Nur Amalia - CV.pdf"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Download className="w-4 h-4 mr-2 group-hover:animate-bounce" />
                Download CV
              </a>
            </Button>
            <Button
              variant="outline"
              className="border-border text-foreground hover:bg-primary hover:text-primary-foreground hover:border-primary rounded-2xl bg-transparent group"
              onClick={() => scrollToSection("contact")}
            >
              <Send className="w-4 h-4 mr-2 group-hover:translate-x-1 transition-transform duration-200" />
              Get in Touch
            </Button>
          </motion.div>

          {/* Mobile social links */}
          <motion.div
            className="lg:hidden flex justify-center gap-3 mb-10"
            variants={staggerItem}
          >
            {socialMedia.map((social) => (
              <motion.a
                key={social.name}
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-muted rounded-xl flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-all duration-300 shadow-sm"
                whileHover={{ scale: 1.08, y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                <SocialIcon platform={social.icon} />
                <span className="sr-only">{social.name}</span>
              </motion.a>
            ))}
          </motion.div>

          {/* Desktop scroll hint */}
          <motion.button
            className="hidden lg:flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors duration-200 group"
            onClick={() => {
              const el = document.getElementById("about");
              el?.scrollIntoView({ behavior: "smooth" });
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.6, duration: 0.6 }}
          >
            <motion.div
              animate={{ y: [0, 6, 0] }}
              transition={{
                duration: 2.2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              <ChevronDown className="w-5 h-5" />
            </motion.div>
            <span className="tracking-wide">Scroll to explore</span>
          </motion.button>
        </motion.div>
      </div>
    </motion.section>
  );
}
