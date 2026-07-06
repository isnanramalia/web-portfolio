"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import {
  Download,
  Send,
  ChevronDown,
  ChevronRight,
  Github,
  Linkedin,
  Instagram,
  AlertTriangle,
  X,
} from "lucide-react";
import Image from "next/image";
import { AnimatedText } from "@/components/animated-text";
import { fadeInUp, staggerContainer, staggerItem } from "@/lib/animations";
import { socialMedia } from "@/lib/data";
import { FloatingElement } from "@/components/effects/parallax";
import { PhysicsNode } from "@/components/physics-node";
import { useTriggerCrash, useSandboxPhase } from "@/lib/sandbox-store";


// ── QA Doodle SVG components ──────────────────────────────────────────────


const DoodleBug = ({ className }: { className?: string }) => (
  <svg
    viewBox="0 0 80 80"
    className={className}
    fill="none"
    stroke="currentColor"
    strokeLinecap="round"
    strokeLinejoin="round"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
  >
    <ellipse cx="40" cy="46" rx="13" ry="16" strokeWidth="2.5" />
    <ellipse cx="40" cy="30" rx="9" ry="10" strokeWidth="2.5" />
    <line x1="27" y1="40" x2="13" y2="33" strokeWidth="2" />
    <line x1="27" y1="47" x2="11" y2="47" strokeWidth="2" />
    <line x1="27" y1="54" x2="13" y2="61" strokeWidth="2" />
    <line x1="53" y1="40" x2="67" y2="33" strokeWidth="2" />
    <line x1="53" y1="47" x2="69" y2="47" strokeWidth="2" />
    <line x1="53" y1="54" x2="67" y2="61" strokeWidth="2" />
    <circle cx="35" cy="27" r="1.5" fill="currentColor" strokeWidth="0" />
    <circle cx="45" cy="27" r="1.5" fill="currentColor" strokeWidth="0" />
  </svg>
);

const DoodleSmallCheck = ({ className }: { className?: string }) => (
  <svg
    viewBox="0 0 24 24"
    className={className}
    fill="none"
    stroke="currentColor"
    strokeLinecap="round"
    strokeLinejoin="round"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
  >
    <polyline points="3,12 9,19 21,6" strokeWidth="3" />
  </svg>
);

const DoodleArrow = ({ className }: { className?: string }) => (
  <svg
    viewBox="0 0 50 30"
    className={className}
    fill="none"
    stroke="currentColor"
    strokeLinecap="round"
    strokeLinejoin="round"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
  >
    <path d="M2,15 C10,8 25,22 42,10" strokeWidth="2" />
    <polyline points="36,5 42,10 38,17" strokeWidth="2" />
  </svg>
);

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
  const [showCursor, setShowCursor] = useState(false);

  useEffect(() => {
    if (!start) {
      setCount(0);
      setShowCursor(false);
      return;
    }

    let interval: ReturnType<typeof setInterval>;

    const timeoutId = setTimeout(() => {
      setShowCursor(true);
      interval = setInterval(() => {
        setCount((c) => {
          if (c >= text.length) {
            clearInterval(interval);
            setShowCursor(false);
            return c;
          }
          return c + 1;
        });
      }, TYPE_SPEED);
    }, delayMs);

    return () => {
      clearTimeout(timeoutId);
      clearInterval(interval);
      setShowCursor(false);
    };
  }, [text, delayMs, start]);

  return (
    <>
      {text.slice(0, count)}
      {showCursor && (
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

// Pastel color per stat sticker
const STAT_STICKY_CLASSES = [
  "sticky-note-yellow",
  "sticky-note-green",
  "sticky-note-blue",
] as const;

// ── CountUpStat ─────────────────────────────────────────────────────
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

  const stickyClass = STAT_STICKY_CLASSES[index % STAT_STICKY_CLASSES.length];

  return (
    <motion.div
      className={`stat-sticker ${stickyClass}`}
      style={{ paddingTop: "14px" }}
      initial={{ opacity: 0, y: 14 }}
      animate={start ? { opacity: 1, y: 0 } : { opacity: 0, y: 14 }}
      transition={{ delay: 0.85 + index * 0.12, duration: 0.4 }}
    >
      <div className="text-xl font-bold tabular-nums font-handwritten">
        {isNum ? `${count}${suffix}` : value}
      </div>
      <div className="text-[10px] mt-0.5 leading-tight opacity-65">{label}</div>
    </motion.div>
  );
}

// ── StressTestButton ───────────────────────────────────────────────────────
function StressTestButton() {
  const phase = useSandboxPhase();
  const triggerCrash = useTriggerCrash();

  const handleClick = useCallback(() => {
    if (phase !== "idle") return;
    triggerCrash();
  }, [phase, triggerCrash]);

  const isBusy = phase !== "idle";

  return (
    <motion.button
      id="stress-test-btn"
      onClick={handleClick}
      disabled={isBusy}
      className={[
        "btn-sticker-apply flex items-center gap-2.5 px-6 py-3 text-sm transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2",
        isBusy
          ? "cursor-not-allowed border-red-800/30 bg-red-100/10 text-red-600/70 dark:text-red-400/70 opacity-90 shadow-none transform-none"
          : "border-red-500/60 bg-red-50/50 dark:bg-red-950/20 text-red-500 hover:border-red-500 hover:text-red-600 hover:bg-red-100/30 dark:hover:bg-red-900/10",
      ].join(" ")}
      style={{
        boxShadow: isBusy ? "none" : "3px 3px 0 rgba(239, 68, 68, 0.4)",
        borderRadius: "255px 12px 255px 12px / 12px 255px 12px 255px",
      }}
      whileHover={isBusy ? {} : { scale: 1.02 }}
      whileTap={isBusy ? {} : { scale: 0.97 }}
      aria-label="Run DOM stress test — triggers chaos physics mode"
    >
      {/* pulsing alert icon */}
      <motion.span
        animate={isBusy ? {} : { rotate: [0, -8, 8, -8, 0] }}
        transition={{ duration: 0.4, delay: 0.8, repeat: Infinity, repeatDelay: 3 }}
        className="shrink-0"
      >
        <AlertTriangle className="h-4.5 w-4.5" />
      </motion.span>

      <span className="font-handwritten font-bold tracking-wide">
        {isBusy ? "System Crashed..." : "Run Stress Test"}
      </span>

      {/* blinking cursor suffix */}
      {!isBusy && (
        <motion.span
          className="inline-block w-[2px] h-[1em] bg-red-400 align-middle rounded-full"
          animate={{ opacity: [1, 0] }}
          transition={{ duration: 0.6, repeat: Infinity, repeatType: "reverse" }}
        />
      )}
    </motion.button>
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
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [isHighlighting, setIsHighlighting] = useState(false);
  const prevThemeRef = useRef<string | undefined>(undefined);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    if (prevThemeRef.current !== undefined && prevThemeRef.current !== theme) {
      setIsHighlighting(true);
      const timer = setTimeout(() => {
        setIsHighlighting(false);
      }, 950);
      return () => clearTimeout(timer);
    }
    prevThemeRef.current = theme;
  }, [theme, mounted]);

  const isDark = mounted && theme === "dark";

  return (
    <motion.section
      id="hero"
      className="px-4 sm:px-6 lg:px-12 py-8 lg:py-20 relative overflow-hidden min-h-[85vh] lg:min-h-[90vh] flex items-center"
      variants={staggerContainer}
      initial="hidden"
      animate={startAnimations ? "visible" : "hidden"}
    >
      {/* QA Mode system diagnostic overlay (desktop only) */}
      <AnimatePresence>
        {isDark && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.4 }}
            className="absolute top-4 right-4 hidden md:flex items-center gap-2 px-3 py-1.5 rounded border border-primary/30 bg-primary/5 font-mono text-[10px] text-primary select-none z-50 tracking-wider shadow-[0_0_10px_rgba(214,192,179,0.15)]"
          >
            <span className="w-1.5 h-1.5 bg-primary rounded-full animate-ping" />
            <span>[SYSTEM_CHECK: QA_MODE_ACTIVE]</span>
          </motion.div>
        )}
      </AnimatePresence>
      {/* Decorative background blobs */}
      <FloatingElement speed={0.3} direction="up" amplitude={30}>
        <motion.div
          className="absolute top-1/3 right-1/4 w-80 h-80 bg-primary/5 rounded-full blur-3xl pointer-events-none"
          style={{ willChange: "transform" }}
          animate={{ scale: [1, 1.12, 1], opacity: [0.25, 0.45, 0.25] }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
        />
      </FloatingElement>
      <FloatingElement speed={0.4} direction="down" amplitude={40}>
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
      </FloatingElement>



      {/* Bug — bottom-left */}
      <motion.div
        className="absolute left-4 bottom-20 hidden xl:block text-primary/15 pointer-events-none select-none"
        animate={{ y: [0, -7, 0], rotate: [0, -4, 3, 0] }}
        transition={{
          duration: 11,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 2.5,
        }}
      >
        <DoodleBug className="w-20 h-20" />
      </motion.div>

      {/* Scattered small checks */}
      <motion.div
        className="absolute right-4 top-1/2 hidden lg:block text-green-600/20 pointer-events-none select-none"
        animate={{ opacity: [0.25, 0.65, 0.25] }}
        transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut" }}
      >
        <DoodleSmallCheck className="w-7 h-7" />
      </motion.div>

      {/* Doodle arrow near scroll hint */}
      <motion.div
        className="absolute left-6 bottom-8 hidden lg:block text-primary/15 pointer-events-none select-none"
        animate={{ x: [0, 4, 0], opacity: [0.4, 0.7, 0.4] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
      >
        <DoodleArrow className="w-12 h-8" />
      </motion.div>

      <div className="max-w-4xl mx-auto relative z-10 w-full">
        <motion.div
          className="lg:hidden mb-10 text-center"
          variants={staggerItem}
        >
          <div className="flex items-center justify-center gap-3 mb-5">
            <PhysicsNode
              dropDelay={0}
              returnDelay={0}
              restitution={0.45}
              friction={0.08}
              density={0.003}
              initialImpulse={1.1}
            >
              <div
                id="hero-mobile-photo"
                className="relative w-14 h-14 rounded-full overflow-hidden border-2 border-border shrink-0"
              >
                <Image
                  src="/foto.jpg"
                  alt="Isna Nur Amalia"
                  fill
                  className="object-cover"
                  priority
                  sizes="56px"
                />
              </div>
            </PhysicsNode>
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
            <PhysicsNode
              dropDelay={80}
              returnDelay={80}
              restitution={0.5}
              friction={0.1}
              initialImpulse={0.9}
            >
              <span
                id="hero-badge-frontend"
                className="px-3 py-1 text-xs bg-card border border-border rounded-full text-foreground font-medium"
              >
                Frontend Dev
              </span>
            </PhysicsNode>
            <ChevronRight className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
            <PhysicsNode
              dropDelay={160}
              returnDelay={160}
              restitution={0.5}
              friction={0.1}
              initialImpulse={0.9}
            >
              <span
                id="hero-badge-qa"
                className="px-3 py-1 text-xs bg-primary/10 border border-primary/20 rounded-full text-primary font-semibold font-handwritten"
              >
                QA Practitioner
              </span>
            </PhysicsNode>
          </div>
        </motion.div>


        <motion.div
          className="text-center lg:text-left"
          variants={staggerContainer}
        >
          {/* Open-to-work badge */}
          <motion.div
            className="inline-flex items-center gap-2 px-4 py-1.5 bg-green-500/10 border border-green-500/30 mb-8 font-handwritten"
            style={{
              borderRadius: "255px 15px 225px 15px / 15px 225px 15px 255px",
            }}
            variants={staggerItem}
          >
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse shrink-0" />
            <span className="text-sm font-medium text-green-600 dark:text-green-400">
              ✓ Seeking QA Roles
            </span>
          </motion.div>

          {/* Tagline — typewriter effect */}
          <motion.h1
            className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold mb-6 leading-tight relative w-fit mx-auto lg:mx-0"
            variants={staggerItem}
          >
            {/* Smooth transition highlight glow around tagline */}
            <motion.div
              className="absolute -inset-4 rounded-2xl blur-xl pointer-events-none -z-10 bg-primary/10 dark:bg-[#D6C0B3]/8"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={isHighlighting ? { opacity: 1, scale: 1.03 } : { opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.38, ease: "easeOut" }}
            />
            <span 
              className={`block min-h-[1.25em] transition-all duration-500 ${
                isDark 
                  ? "text-muted-foreground/45 font-medium" 
                  : "text-primary font-extrabold"
              }`}
            >
              <TypewriterLine
                text={LINE1}
                delayMs={LINE1_DELAY_MS}
                start={startAnimations}
              />
            </span>
            <span 
              className={`block min-h-[1.25em] transition-all duration-500 ${
                isDark 
                  ? "text-primary font-extrabold drop-shadow-[0_0_10px_rgba(214,192,179,0.35)]" 
                  : "text-muted-foreground/50 font-medium"
              }`}
            >
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

          {/* ── ⚠️ Stress Test Button ──────────────────────────────── */}
          <motion.div
            className="mb-8 flex justify-center lg:justify-start"
            variants={staggerItem}
            initial={{ opacity: 0, y: 10 }}
            animate={startAnimations ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
            transition={{ delay: 1.2, duration: 0.5 }}
          >
            <StressTestButton />
          </motion.div>

          {/* Stats — count-up animation */}
          <motion.div
            className="flex flex-wrap gap-4 justify-center lg:justify-start mb-8 pt-3"
            variants={staggerItem}
          >
            {STATS.map((stat, i) => (
              <PhysicsNode
                key={stat.label}
                dropDelay={i * 120}
                returnDelay={280 + i * 150}
                restitution={0.55}
                friction={0.08}
                density={0.002}
                initialImpulse={1 + i * 0.15}
              >
                <div id={`hero-stat-${i}`}>
                  <CountUpStat
                    value={stat.value}
                    label={stat.label}
                    index={i}
                    start={startAnimations}
                  />
                </div>
              </PhysicsNode>
            ))}
          </motion.div>


          {/* Mobile CTAs */}
          <motion.div
            className="lg:hidden flex flex-wrap gap-3 justify-center mb-6"
            variants={staggerItem}
          >
            <Button
              asChild
              className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-2xl shadow-md group btn-sticker-apply btn-sticker-primary-apply"
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
              className="border-border text-foreground hover:bg-primary hover:text-primary-foreground hover:border-primary rounded-2xl bg-transparent group btn-sticker-apply"
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
