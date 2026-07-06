"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
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

  return (
    <div ref={containerRef} className="relative">
      {/* Timeline Items */}
      <div ref={timelineRef} className="space-y-6">
        {workExperience.map((company, companyIdx) => {
          const isCompanyActive = company.roles.some((r) =>
            r.period.toLowerCase().includes("present"),
          );
          const isMultiRole = company.roles.length > 1;
          const isVisible = visibleItems.has(companyIdx);
          const isFirst = companyIdx === 0;
          const isLast = companyIdx === workExperience.length - 1;

          return (
            <div
              key={companyIdx}
              data-timeline-index={companyIdx}
              className="relative flex items-start gap-5"
            >
              {/* Bridge: item top → just under dot — joins the tail of the previous item.
                  Omitted on the very first item (nothing above to connect to). */}
              {!isFirst && (
                <div
                  className="absolute left-[5px] top-0 h-8 border-l border-border"
                  aria-hidden="true"
                />
              )}
              {/* Tail: just below dot → past item bottom — bridges into the next item.
                  Omitted on the last item so no line hangs below the final dot. */}
              {!isLast && (
                <div
                  className="absolute left-[5px] top-10 -bottom-6 border-l border-border"
                  aria-hidden="true"
                />
              )}

              {/* Timeline Dot */}
              <div className="relative z-10 flex-shrink-0 mt-7">
                <TimelineDot isActive={isCompanyActive} />
              </div>

              <div className="flex-1 min-w-0">
                {isMultiRole ? (
                  <>
                    {/* Company Header for Multiple Roles */}
                    <motion.div
                      className="p-4 bg-card border border-border shadow-sm hover:shadow-md transition-shadow"
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
                        borderRadius: "18px 4px 16px 4px / 4px 16px 4px 18px",
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
                      {company.roles.map((role, roleIdx) => {
                        const roleKey = `${companyIdx}-${roleIdx}`;
                        const isRoleActive = role.period
                          .toLowerCase()
                          .includes("present");
                        const isExpanded = expandedJob === roleKey;
                        const isLastRole = roleIdx === company.roles.length - 1;
                        const isFirstRole = roleIdx === 0;

                        return (
                          <div
                            key={roleIdx}
                            className="relative flex items-start gap-3"
                          >
                            {/* Bridge: item top → dot — joins previous role's tail */}
                            {!isFirstRole && (
                              <div
                                className="absolute left-[4.5px] top-0 h-[18px] border-l border-border"
                                style={{ opacity: 0.55 }}
                                aria-hidden="true"
                              />
                            )}
                            {/* Tail: below dot → next role — omitted on last role */}
                            {!isLastRole && (
                              <div
                                className="absolute left-[4.5px] top-7 -bottom-3 border-l border-border"
                                style={{ opacity: 0.55 }}
                                aria-hidden="true"
                              />
                            )}
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
                              className="flex-1 p-3 bg-card border border-border cursor-pointer hover:border-primary/50 transition-all hover:shadow-md focus:outline-none focus:ring-2 focus:ring-primary/50"
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
                                borderRadius:
                                  "14px 3px 12px 3px / 3px 12px 3px 14px",
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
                          className="p-4 bg-card border border-border cursor-pointer hover:border-primary/50 transition-all hover:shadow-md focus:outline-none focus:ring-2 focus:ring-primary/50"
                          style={{
                            borderRadius:
                              "18px 4px 16px 4px / 4px 16px 4px 18px",
                            willChange: "transform, opacity",
                            transform: "translate3d(0, 0, 0)",
                          }}
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
    </div>
  );
}
