"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import {
  motion,
  AnimatePresence,
  useScroll,
  useTransform,
} from "framer-motion";
import { ExternalLink } from "lucide-react";
import Image from "next/image";

// TypeScript Interfaces
export interface WorkRole {
  title: string;
  period: string;
  shortDescription: string;
  fullDescription: string;
}

export interface WorkExperience {
  company: string;
  logo: string;
  website: string;
  roles: WorkRole[];
}

interface InteractiveTimelineProps {
  workExperience: WorkExperience[];
}

interface TimelineDotProps {
  isActive: boolean;
  size?: "default" | "small";
}

/**
 * Animated Timeline Dot Component
 * Uses GPU-accelerated transforms for smooth animations
 */
const TimelineDot = ({ isActive, size = "default" }: TimelineDotProps) => {
  const sz =
    size === "small" ? { outer: 10, inner: 4 } : { outer: 12, inner: 6 };

  if (isActive) {
    return (
      <div className="relative" style={{ width: sz.outer, height: sz.outer }}>
        {/* Pulsing outer ring */}
        <motion.div
          className="absolute inset-0 rounded-full bg-primary/20 dark:bg-primary/30"
          initial={{ scale: 0 }}
          animate={{ scale: [1, 1.4, 1] }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          style={{ willChange: "transform" }}
        />
        {/* Main dot */}
        <div className="absolute inset-0 rounded-full bg-primary shadow-lg shadow-primary/50" />
        {/* Center dot */}
        <div
          className="absolute top-1/2 left-1/2 rounded-full bg-background"
          style={{
            width: sz.inner,
            height: sz.inner,
            transform: "translate3d(-50%, -50%, 0)",
          }}
        />
      </div>
    );
  }

  return (
    <div className="relative" style={{ width: sz.outer, height: sz.outer }}>
      <div className="absolute inset-0 rounded-full bg-muted-foreground/30" />
      <div
        className="absolute top-1/2 left-1/2 rounded-full bg-background"
        style={{
          width: sz.inner,
          height: sz.inner,
          transform: "translate3d(-50%, -50%, 0)",
        }}
      />
    </div>
  );
};

/**
 * Performance-Optimized Interactive Timeline Component
 *
 * Features:
 * - SVG path animation with scroll-based progress
 * - IntersectionObserver for lazy animations
 * - GPU-accelerated transforms (translate3d)
 * - Memoized callbacks with useCallback
 * - AnimatePresence for smooth mount/unmount
 * - Responsive vertical layout
 */
export function InteractiveTimeline({
  workExperience,
}: InteractiveTimelineProps) {
  const [expandedJob, setExpandedJob] = useState<string | null>(null);
  const [visibleItems, setVisibleItems] = useState<Set<number>>(new Set());
  const timelineRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Scroll progress for animated gradient line
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start center", "end center"],
  });

  const pathLength = useTransform(scrollYProgress, [0, 1], [0, 1]);
  const lineOpacity = useTransform(
    scrollYProgress,
    [0, 0.1, 0.9, 1],
    [0.3, 1, 1, 0.3],
  );

  // IntersectionObserver for performance optimization
  useEffect(() => {
    if (!timelineRef.current) return;

    const observerOptions: IntersectionObserverInit = {
      threshold: 0.1,
      rootMargin: "50px",
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        const index = Number(entry.target.getAttribute("data-timeline-index"));
        if (entry.isIntersecting) {
          setVisibleItems((prev) => new Set(prev).add(index));
        }
      });
    }, observerOptions);

    const items = timelineRef.current.querySelectorAll("[data-timeline-index]");
    items.forEach((item) => observer.observe(item));

    return () => observer.disconnect();
  }, [workExperience]);

  // Memoized click handler for better performance
  const handleJobExpand = useCallback((jobKey: string) => {
    setExpandedJob((prev) => (prev === jobKey ? null : jobKey));
  }, []);

  // Calculate approximate SVG height for path drawing
  const svgHeight = Math.max(workExperience.length * 180, 600);

  return (
    <div ref={containerRef} className="relative">
      {/* Animated SVG Path with Gradient - Fills as you scroll */}
      <div className="absolute left-[5px] top-0 bottom-0 w-px pointer-events-none">
        <svg
          width="2"
          height={svgHeight}
          viewBox={`0 0 2 ${svgHeight}`}
          className="absolute top-8 left-0"
          style={{ overflow: "visible" }}
          aria-hidden="true"
        >
          <defs>
            <linearGradient
              id="timeline-gradient"
              x1="0%"
              y1="0%"
              x2="0%"
              y2="100%"
            >
              <stop
                offset="0%"
                stopColor="currentColor"
                stopOpacity="0"
                className="text-muted-foreground"
              />
              <stop
                offset="10%"
                stopColor="currentColor"
                stopOpacity="0.3"
                className="text-muted-foreground"
              />
              <stop
                offset="50%"
                stopColor="currentColor"
                stopOpacity="0.6"
                className="text-primary"
              />
              <stop
                offset="90%"
                stopColor="currentColor"
                stopOpacity="0.3"
                className="text-muted-foreground"
              />
              <stop
                offset="100%"
                stopColor="currentColor"
                stopOpacity="0"
                className="text-muted-foreground"
              />
            </linearGradient>
          </defs>
          <motion.path
            d={`M 1 0 L 1 ${svgHeight}`}
            stroke="url(#timeline-gradient)"
            strokeWidth="2"
            fill="none"
            style={{
              pathLength,
              opacity: lineOpacity,
            }}
            initial={{ pathLength: 0 }}
          />
        </svg>
      </div>

      {/* Timeline Items */}
      <div ref={timelineRef} className="space-y-6">
        {workExperience.map((company, companyIdx) => {
          const isCompanyActive = company.roles.some((r) =>
            r.period.toLowerCase().includes("present"),
          );
          const isMultiRole = company.roles.length > 1;
          const isVisible = visibleItems.has(companyIdx);

          return (
            <div
              key={companyIdx}
              data-timeline-index={companyIdx}
              className="relative flex items-start gap-5"
            >
              {/* Timeline Dot */}
              <div className="relative z-10 flex-shrink-0 mt-7">
                <TimelineDot isActive={isCompanyActive} />
              </div>

              <div className="flex-1 min-w-0">
                {isMultiRole ? (
                  <>
                    {/* Company Header for Multiple Roles */}
                    <motion.div
                      className="p-4 bg-card rounded-2xl border border-border shadow-sm hover:shadow-md transition-shadow"
                      initial={{ opacity: 0, x: -20 }}
                      animate={
                        isVisible
                          ? { opacity: 1, x: 0 }
                          : { opacity: 0, x: -20 }
                      }
                      transition={{
                        duration: 0.4,
                        delay: companyIdx * 0.08,
                      }}
                      style={{
                        willChange: "transform, opacity",
                        transform: "translate3d(0, 0, 0)",
                      }}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 flex-shrink-0 rounded-xl bg-card border border-border shadow-sm overflow-hidden flex items-center justify-center">
                          <Image
                            src={company.logo || "/placeholder.svg"}
                            alt={`${company.company} logo`}
                            width={40}
                            height={40}
                            className="w-full h-full object-contain p-1"
                          />
                        </div>
                        <div className="min-w-0">
                          {company.website ? (
                            <a
                              href={company.website}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 text-base font-semibold text-card-foreground hover:text-primary transition-colors"
                            >
                              {company.company}
                              <ExternalLink className="w-3.5 h-3.5 opacity-60" />
                            </a>
                          ) : (
                            <p className="text-base font-semibold text-card-foreground">
                              {company.company}
                            </p>
                          )}
                          <p className="text-xs text-muted-foreground">
                            {company.roles.length}{" "}
                            {company.roles.length === 1 ? "role" : "roles"}
                          </p>
                        </div>
                      </div>
                    </motion.div>

                    {/* Nested Roles Timeline */}
                    <div className="relative mt-3 ml-5 space-y-3">
                      {/* Connecting line for nested roles */}
                      <motion.div
                        className="absolute left-[4px] top-4 bottom-4 w-px pointer-events-none bg-muted-foreground/20"
                        aria-hidden="true"
                        initial={{ scaleY: 0 }}
                        animate={isVisible ? { scaleY: 1 } : { scaleY: 0 }}
                        transition={{
                          duration: 0.6,
                          ease: "easeOut",
                          delay: 0.2,
                        }}
                        style={{ transformOrigin: "top" }}
                      />

                      {company.roles.map((role, roleIdx) => {
                        const roleKey = `${companyIdx}-${roleIdx}`;
                        const isRoleActive = role.period
                          .toLowerCase()
                          .includes("present");
                        const isExpanded = expandedJob === roleKey;

                        return (
                          <div
                            key={roleIdx}
                            className="relative flex items-start gap-3"
                          >
                            {/* Role Timeline Dot */}
                            <div className="relative z-10 flex-shrink-0 mt-[18px]">
                              <TimelineDot
                                isActive={isRoleActive}
                                size="small"
                              />
                            </div>

                            {/* Role Card - Clickable to expand */}
                            <motion.div
                              role="button"
                              tabIndex={0}
                              onClick={() => handleJobExpand(roleKey)}
                              onKeyDown={(e) => {
                                if (e.key === "Enter" || e.key === " ") {
                                  e.preventDefault();
                                  handleJobExpand(roleKey);
                                }
                              }}
                              className="flex-1 p-3 bg-card rounded-xl border border-border cursor-pointer hover:border-primary/50 transition-all hover:shadow-md focus:outline-none focus:ring-2 focus:ring-primary/50"
                              initial={{ opacity: 0, x: -15 }}
                              animate={
                                isVisible
                                  ? { opacity: 1, x: 0 }
                                  : { opacity: 0, x: -15 }
                              }
                              transition={{
                                duration: 0.3,
                                delay: companyIdx * 0.08 + roleIdx * 0.05,
                              }}
                              style={{
                                willChange: "transform, opacity",
                                transform: "translate3d(0, 0, 0)",
                              }}
                              whileHover={{ scale: 1.01 }}
                              whileTap={{ scale: 0.99 }}
                            >
                              <div className="flex justify-between items-start gap-2">
                                <div className="min-w-0 flex-1">
                                  <h4 className="text-sm font-semibold text-card-foreground">
                                    {role.title}
                                  </h4>
                                  <p className="text-xs text-muted-foreground mt-0.5">
                                    {role.period}
                                  </p>
                                  <p className="text-xs text-muted-foreground mt-1">
                                    {role.shortDescription}
                                  </p>
                                </div>
                                {/* Expand indicator */}
                                <div className="text-muted-foreground/50 text-xs">
                                  {isExpanded ? "−" : "+"}
                                </div>
                              </div>

                              {/* Expandable Content with AnimatePresence */}
                              <AnimatePresence initial={false}>
                                {isExpanded && (
                                  <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: "auto" }}
                                    exit={{ opacity: 0, height: 0 }}
                                    transition={{
                                      duration: 0.3,
                                      ease: "easeInOut",
                                    }}
                                    style={{ overflow: "hidden" }}
                                  >
                                    <div className="pt-3 mt-3 border-t border-border">
                                      <p className="text-xs text-muted-foreground leading-relaxed">
                                        {role.fullDescription}
                                      </p>
                                    </div>
                                  </motion.div>
                                )}
                              </AnimatePresence>
                            </motion.div>
                          </div>
                        );
                      })}
                    </div>
                  </>
                ) : (
                  // Single Role Layout
                  <>
                    {company.roles.map((role, roleIdx) => {
                      const roleKey = `${companyIdx}-single`;
                      const isExpanded = expandedJob === roleKey;

                      return (
                        <motion.div
                          key={roleIdx}
                          role="button"
                          tabIndex={0}
                          onClick={() => handleJobExpand(roleKey)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter" || e.key === " ") {
                              e.preventDefault();
                              handleJobExpand(roleKey);
                            }
                          }}
                          className="p-4 bg-card rounded-2xl border border-border cursor-pointer hover:border-primary/50 transition-all hover:shadow-md focus:outline-none focus:ring-2 focus:ring-primary/50"
                          initial={{ opacity: 0, x: -20 }}
                          animate={
                            isVisible
                              ? { opacity: 1, x: 0 }
                              : { opacity: 0, x: -20 }
                          }
                          transition={{
                            duration: 0.4,
                            delay: companyIdx * 0.08,
                          }}
                          style={{
                            willChange: "transform, opacity",
                            transform: "translate3d(0, 0, 0)",
                          }}
                          whileHover={{ scale: 1.01 }}
                          whileTap={{ scale: 0.99 }}
                        >
                          <div className="flex items-start gap-3">
                            <div className="w-10 h-10 flex-shrink-0 rounded-xl bg-card border border-border shadow-sm overflow-hidden flex items-center justify-center">
                              <Image
                                src={company.logo || "/placeholder.svg"}
                                alt={`${company.company} logo`}
                                width={40}
                                height={40}
                                className="w-full h-full object-contain p-1"
                              />
                            </div>
                            <div className="min-w-0 flex-1">
                              <h4 className="text-base font-semibold text-card-foreground">
                                {role.title}
                              </h4>
                              {company.website ? (
                                <a
                                  href={company.website}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-primary transition-colors"
                                  onClick={(e) => e.stopPropagation()}
                                >
                                  {company.company}
                                  <ExternalLink className="w-3 h-3 opacity-60" />
                                </a>
                              ) : (
                                <p className="text-sm text-muted-foreground">
                                  {company.company}
                                </p>
                              )}
                              <p className="text-xs text-muted-foreground mt-1">
                                {role.period}
                              </p>
                              <p className="text-xs text-muted-foreground mt-2">
                                {role.shortDescription}
                              </p>
                            </div>
                            {/* Expand indicator */}
                            <div className="text-muted-foreground/50 text-sm self-start">
                              {isExpanded ? "−" : "+"}
                            </div>
                          </div>

                          {/* Expandable Content with AnimatePresence */}
                          <AnimatePresence initial={false}>
                            {isExpanded && (
                              <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: "auto" }}
                                exit={{ opacity: 0, height: 0 }}
                                transition={{
                                  duration: 0.3,
                                  ease: "easeInOut",
                                }}
                                style={{ overflow: "hidden" }}
                              >
                                <div className="pt-3 mt-3 border-t border-border">
                                  <p className="text-xs text-muted-foreground leading-relaxed">
                                    {role.fullDescription}
                                  </p>
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </motion.div>
                      );
                    })}
                  </>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Scroll Progress Indicator - Desktop Only */}
      <motion.div
        className="fixed right-8 top-1/2 -translate-y-1/2 hidden lg:block z-50"
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.5, duration: 0.4 }}
      >
        <div className="relative w-1 h-32 bg-muted-foreground/20 rounded-full overflow-hidden backdrop-blur-sm">
          <motion.div
            className="absolute top-0 left-0 right-0 bg-gradient-to-b from-primary to-primary/70 rounded-full shadow-lg shadow-primary/20"
            style={{
              height: useTransform(scrollYProgress, [0, 1], ["0%", "100%"]),
            }}
          />
        </div>
        <p className="text-[10px] text-muted-foreground/60 text-center mt-2 font-medium">
          SCROLL
        </p>
      </motion.div>
    </div>
  );
}
