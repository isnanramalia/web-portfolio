"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

// ── Types ──────────────────────────────────────────────────────────────────

interface NoteColor {
  bg: string;
  dark: string;
  text: string;
  darkText: string;
}

interface JourneyStop {
  year: string;
  title: string;
  description: string;
  annotation: string;
  icon: string;
  noteColor: NoteColor;
  isNow?: boolean;
}

// ── Data ───────────────────────────────────────────────────────────────────

const JOURNEY_STOPS: JourneyStop[] = [
  {
    year: "2021",
    title: "First Line of Code",
    description:
      "Started with HTML, CSS, JavaScript. Built my first pages, fell in love with turning ideas into something real in a browser.",
    annotation: '"Okay, this is addicting."',
    icon: "💻",
    noteColor: {
      bg: "#fef3c7",
      dark: "#3d2c00",
      text: "#92400e",
      darkText: "#fcd34d",
    },
  },
  {
    year: "2022",
    title: "Real Projects Ship",
    description:
      "Built DNCC website, BTNG 2023 registration system, DINACOM 2023. First production deployments with real users.",
    annotation: '"Real users mean real bugs."',
    icon: "🚀",
    noteColor: {
      bg: "#d1fae5",
      dark: "#0e3119",
      text: "#065f46",
      darkText: "#6ee7b7",
    },
  },
  {
    year: "2023",
    title: "Patterns in the Bugs",
    description:
      "Built the Alumni Website, Leolit Games company profile. Started noticing the same categories of bugs appearing before every release.",
    annotation: '"I keep finding issues before my teammates notice."',
    icon: "🔍",
    noteColor: {
      bg: "#dbeafe",
      dark: "#102240",
      text: "#1d4ed8",
      darkText: "#93c5fd",
    },
  },
  {
    year: "2024",
    title: "The Developer Insight",
    description:
      "Shipped SICAPA (academic grading) and Triva (trip expense splitter with AI). Wrote test scenarios before building features. Something clicked.",
    annotation: '"I genuinely enjoy the testing part more."',
    icon: "💡",
    noteColor: {
      bg: "#f3e8ff",
      dark: "#1a0e2f",
      text: "#7c3aed",
      darkText: "#c4b5fd",
    },
  },
  {
    year: "Early 2026",
    title: "Formal QA Study",
    description:
      "Deep dive into STLC, Test Planning, Manual Testing, UAT, API Testing. Published 9 articles on Medium documenting the learning process.",
    annotation: '"There\'s a name for what I was already doing."',
    icon: "📚",
    noteColor: {
      bg: "#ffedd5",
      dark: "#2f1a0e",
      text: "#c2410c",
      darkText: "#fdba74",
    },
  },
  {
    year: "Now",
    title: "QA Practitioner",
    description:
      "30+ test cases written, 9 bugs formally documented, 84% UAT satisfaction score. Frontend insight meets systematic QA thinking.",
    annotation: '"This is exactly where I belong."',
    icon: "✅",
    noteColor: {
      bg: "#d1fae5",
      dark: "#0e3119",
      text: "#065f46",
      darkText: "#6ee7b7",
    },
    isNow: true,
  },
];

// ── Card rotation pattern (scrapbook feel) ─────────────────────────────────

const ROTATIONS = [-1.5, 1.0, -0.7, 1.4, -1.1, 0.8];

// ── SVG Doodle helpers ─────────────────────────────────────────────────────

/**
 * BigCurvedArrow — sweeping hand-drawn arrow like the reference image.
 * Upper-right → lower-left sweep with open arrowhead.
 */
function BigCurvedArrow({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 60 54"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.4"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className ?? "w-12 h-10"}
      aria-hidden="true"
    >
      {/* Main sweep: top-right → bottom-left */}
      <path d="M50,6 C56,22 46,40 26,48 C18,51 10,49 7,46" />
      {/* Arrowhead */}
      <path d="M7,46 L15,39" />
      <path d="M7,46 L9,54" />
    </svg>
  );
}

/**
 * ConnectorArrow — tiny curved arrow between journal entries.
 * Points downward, softly curved.
 */
function ConnectorArrow({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 16 20"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      className={className ?? "w-4 h-5"}
      aria-hidden="true"
    >
      <path d="M8,2 C7,7 6,12 5,17" />
      <path d="M5,17 L2,12" />
      <path d="M5,17 L9,13" />
    </svg>
  );
}

// ── WashiTape ──────────────────────────────────────────────────────────────

function WashiTape({ color, rotate = -2 }: { color: string; rotate?: number }) {
  return (
    <div
      className="absolute -top-3 left-1/2 w-10 h-3.5 pointer-events-none"
      style={{
        transform: `translateX(-50%) rotate(${rotate}deg)`,
        background: color,
        borderRadius: "1px 2px 1px 2px",
        boxShadow:
          "inset 0 1px 1px rgba(255,255,255,0.3), 0 1px 2px rgba(0,0,0,0.06)",
        opacity: 0.75,
      }}
      aria-hidden="true"
    />
  );
}

// ── JournalEntry — scrapbook card for each timeline stop ───────────────────

interface JournalEntryProps {
  stop: JourneyStop;
  index: number;
  isDark: boolean;
}

function JournalEntry({ stop, index, isDark }: JournalEntryProps) {
  const { year, title, description, annotation, icon, noteColor, isNow } = stop;
  const rotation = ROTATIONS[index % ROTATIONS.length];

  const bg = isDark ? noteColor.dark : noteColor.bg;
  const fg = isDark ? noteColor.darkText : noteColor.text;
  // Washi tape = translucent tint of the text colour
  const tapeColor = isDark ? `${noteColor.darkText}30` : `${noteColor.text}25`;

  return (
    <motion.div
      className="relative mx-3 sm:mx-6 overflow-visible"
      style={{ transform: `rotate(${rotation}deg)` }}
      initial={{ opacity: 0, y: 24, rotate: rotation - 2 }}
      animate={{ opacity: 1, y: 0, rotate: rotation }}
      transition={{
        duration: 0.45,
        delay: index * 0.09,
        ease: [0.25, 0.46, 0.45, 0.94],
      }}
    >
      {/* Washi tape at top */}
      <WashiTape color={tapeColor} rotate={rotation > 0 ? -2.5 : 2} />

      {/* Card */}
      <div
        className="relative p-5 pt-6"
        style={{
          background: bg,
          borderRadius: "6px 2px 6px 2px / 2px 6px 2px 6px",
          border: `1.5px solid ${fg}22`,
          boxShadow: isDark
            ? `3px 5px 0 rgba(0,0,0,0.35), 0 10px 24px rgba(0,0,0,0.2)`
            : `3px 5px 0 rgba(0,0,0,0.09), 0 10px 24px rgba(0,0,0,0.05)`,
        }}
      >
        {/* Year stamp — top-right */}
        <span
          className="absolute top-3.5 right-4 text-[10px] font-mono font-bold tracking-wide"
          style={{ color: fg, opacity: 0.5 }}
        >
          {year}
        </span>

        {/* "NOW" badge */}
        {isNow && (
          <motion.span
            className="absolute -top-3 -right-3 text-[9px] font-bold tracking-wide px-1.5 py-0.5 bg-primary text-primary-foreground"
            style={{ borderRadius: "3px 7px 3px 7px", zIndex: 10 }}
            animate={{ scale: [1, 1.08, 1] }}
            transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
          >
            NOW
          </motion.span>
        )}

        {/* Icon + title — items-center so emoji baseline aligns with heading */}
        <div className="flex items-center gap-2 mb-2.5 pr-10">
          <span
            className="shrink-0 leading-none"
            style={{ fontSize: "1.15rem" }}
            aria-hidden="true"
          >
            {icon}
          </span>
          <h3
            className="text-[15px] font-bold font-handwritten leading-tight"
            style={{ color: fg }}
          >
            {title}
          </h3>
        </div>

        {/* Body */}
        <p
          className="text-sm leading-relaxed"
          style={{ color: fg, opacity: 0.82 }}
        >
          {description}
        </p>

        {/* Margin annotation — like a pen note scribbled in the margin */}
        <div className="mt-3 flex items-start gap-2">
          {/* Small quotation mark in ink */}
          <span
            className="font-handwritten text-2xl leading-none shrink-0 select-none"
            style={{ color: fg, opacity: 0.3 }}
          >
            "
          </span>
          <p
            className="font-handwritten italic text-xs leading-snug pt-1"
            style={{ color: fg, opacity: 0.7 }}
          >
            {annotation.replace(/^"|"$/g, "")}
          </p>
        </div>
      </div>
    </motion.div>
  );
}

// ── Main section ───────────────────────────────────────────────────────────

export function JourneySection() {
  const [isDark, setIsDark] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const check = () =>
      setIsDark(document.documentElement.classList.contains("dark"));
    check();
    const observer = new MutationObserver(check);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });
    return () => observer.disconnect();
  }, []);

  const toggle = useCallback(() => setIsOpen((prev) => !prev), []);

  return (
    <motion.section
      id="journey"
      className="px-4 sm:px-6 lg:px-12 py-8 lg:py-16"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      viewport={{ once: true }}
    >
      <div className="max-w-4xl mx-auto">
        {/* ── Header ──────────────────────────────────────────────────────── */}
        <motion.span
          className="section-eyebrow"
          initial={{ opacity: 0, y: -8 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          viewport={{ once: true }}
        >
          ✦ Origin Story
        </motion.span>

        <motion.h2
          className="text-2xl font-medium mt-2 text-foreground doodle-section-heading"
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4, delay: 0.05 }}
          viewport={{ once: true }}
        >
          Why I Chose QA
        </motion.h2>

        <motion.p
          className="text-sm text-muted-foreground mt-3 max-w-xl"
          initial={{ opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          viewport={{ once: true }}
        >
          From building software to systematically breaking it — here&apos;s how
          the transition happened.
        </motion.p>

        {/* ── Toggle — scrapbook annotation style ─────────────────────────── */}
        <motion.div
          className="mt-6"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.3, delay: 0.2 }}
          viewport={{ once: true }}
        >
          <AnimatePresence mode="wait" initial={false}>
            {!isOpen ? (
              /* Closed state: hand-drawn annotation with curved arrow */
              <motion.button
                key="open"
                onClick={toggle}
                className="flex items-end gap-1 group"
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.2 }}
                aria-expanded={false}
                aria-controls="journey-timeline"
              >
                <span
                  className="font-handwritten italic text-base text-primary group-hover:text-primary/80 transition-colors"
                  style={{ lineHeight: 1.2 }}
                >
                  read my story
                </span>
                <BigCurvedArrow className="w-10 h-9 text-primary group-hover:text-primary/80 transition-colors -mb-1 -ml-1 opacity-80" />
              </motion.button>
            ) : (
              /* Open state: simple close annotation */
              <motion.button
                key="close"
                onClick={toggle}
                className="flex items-center gap-2 group"
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.2 }}
                aria-expanded={true}
                aria-controls="journey-timeline"
              >
                <span className="font-handwritten italic text-sm text-muted-foreground group-hover:text-foreground transition-colors">
                  fold it back
                </span>
                {/* Small up-arrow doodle */}
                <svg
                  viewBox="0 0 16 16"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  className="w-4 h-4 text-muted-foreground group-hover:text-foreground transition-colors"
                  aria-hidden="true"
                >
                  <path d="M8,13 C7,8 6,5 5,3" />
                  <path d="M5,3 L2,7" />
                  <path d="M5,3 L9,7" />
                </svg>
              </motion.button>
            )}
          </AnimatePresence>
        </motion.div>

        {/* ── Collapsible journal ──────────────────────────────────────────── */}
        <AnimatePresence initial={false}>
          {isOpen && (
            <motion.div
              id="journey-timeline"
              ref={contentRef}
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.42, ease: [0.25, 0.46, 0.45, 0.94] }}
              style={{ overflow: "hidden" }}
            >
              {/* Scrapbook spread */}
              <div className="mt-8 space-y-1 pb-2">
                {JOURNEY_STOPS.map((stop, index) => (
                  <div key={stop.year}>
                    <JournalEntry stop={stop} index={index} isDark={isDark} />

                    {/* Connector arrow between entries */}
                    {index < JOURNEY_STOPS.length - 1 && (
                      <div className="flex justify-center py-2">
                        <ConnectorArrow className="w-4 h-5 text-foreground opacity-[0.18]" />
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Bottom CTA */}
              <motion.div
                className="mt-6 flex justify-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.7 }}
              >
                <a
                  href="#projects"
                  onClick={(e) => {
                    e.preventDefault();
                    document
                      .getElementById("projects")
                      ?.scrollIntoView({ behavior: "smooth" });
                  }}
                  className="font-handwritten text-sm text-muted-foreground hover:text-foreground transition-colors underline decoration-dashed underline-offset-4"
                >
                  Chapter closed → See the proof
                </a>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.section>
  );
}
