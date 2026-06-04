"use client";

import { useState } from "react";
import { motion, AnimatePresence, LayoutGroup } from "framer-motion";
import { Github, ExternalLink, Bug, CheckCircle } from "lucide-react";
import Image from "next/image";
import { ProjectDialog } from "@/components/project-dialog";
import type { Project, ProjectCategory } from "@/lib/data";

// ── Helpers ────────────────────────────────────────────────────────────────

const CARD_ROTATIONS = [-1.1, 0.6, -0.5, 1.0, -0.8, 0.4, -1.3, 0.7];

function getStickyClass(category: ProjectCategory): string {
  switch (category) {
    case "qa":
      return "sticky-note-green";
    case "web":
      return "sticky-note-yellow";
    case "mobile":
      return "sticky-note-blue";
    default:
      return "sticky-note-yellow";
  }
}

function getStamp(category: ProjectCategory): string {
  switch (category) {
    case "qa":
      return "BUG FILED";
    case "web":
      return "SHIPPED";
    case "mobile":
      return "RELEASED";
    default:
      return "FILED";
  }
}

function getStampColor(category: ProjectCategory): string {
  switch (category) {
    case "qa":
      return "text-green-700 dark:text-green-400";
    case "web":
      return "text-amber-700 dark:text-amber-400";
    case "mobile":
      return "text-blue-700 dark:text-blue-400";
    default:
      return "text-primary";
  }
}

function getCaseNumber(projects: Project[], project: Project): string {
  const idx = projects.indexOf(project);
  return `#${String(idx + 1).padStart(3, "0")}`;
}

// QA metric badges — shown only on QA-category cards
const QA_CARD_METRICS: Record<
  string,
  { testCases: string; bugsFound: string } | undefined
> = {
  "Manual Testing – Saucedemo (Swag Labs)": {
    testCases: "30+",
    bugsFound: "9",
  },
  "UAT Testing – STI Alumni Website": {
    testCases: "UAT",
    bugsFound: "75 users",
  },
};

// ── Filter categories ──────────────────────────────────────────────────────

interface FilterCategory {
  id: "all" | ProjectCategory;
  label: string;
}

const FILTER_CATEGORIES: FilterCategory[] = [
  { id: "all", label: "All" },
  { id: "web", label: "Web Development" },
  { id: "mobile", label: "Mobile Development" },
  { id: "qa", label: "Quality Assurance" },
];

// ── Component ──────────────────────────────────────────────────────────────

interface ProjectsSectionLocalProps {
  projects: Project[];
}

export function ProjectsSectionLocal({ projects }: ProjectsSectionLocalProps) {
  const [activeFilter, setActiveFilter] = useState<"all" | ProjectCategory>(
    "all",
  );
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [projectDialogOpen, setProjectDialogOpen] = useState(false);
  // Spotlight: track which card is hovered
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const filteredProjects =
    activeFilter === "all"
      ? projects
      : projects.filter((p) => p.category === activeFilter);

  const handleProjectClick = (project: Project) => {
    setSelectedProject(project);
    setProjectDialogOpen(true);
  };

  return (
    <>
      <motion.section
        id="projects"
        className="px-4 sm:px-6 lg:px-12 py-8 lg:py-16"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
      >
        <div className="max-w-4xl mx-auto">
          {/* Section heading */}
          <div className="mb-8">
            <motion.span
              className="section-eyebrow"
              initial={{ opacity: 0, y: -8 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35 }}
              viewport={{ once: true }}
            >
              🗂️ Proof of Work
            </motion.span>
            <motion.h2
              className="text-2xl font-medium mt-2 text-foreground doodle-section-heading"
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4 }}
              viewport={{ once: true }}
            >
              Selected Projects
            </motion.h2>
            <motion.p
              className="text-sm text-muted-foreground mt-4 font-handwritten italic"
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: 0.08 }}
              viewport={{ once: true }}
            >
              — pinned to the investigation board —
            </motion.p>
          </div>

          {/* Filter tabs — styled as hand-drawn labels */}
          <motion.div
            className="flex flex-wrap gap-2 mb-10"
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            viewport={{ once: true }}
          >
            {FILTER_CATEGORIES.map((cat) => {
              const isActive = activeFilter === cat.id;
              const count =
                cat.id === "all"
                  ? projects.length
                  : projects.filter((p) => p.category === cat.id).length;

              return (
                <button
                  key={cat.id}
                  onClick={() => setActiveFilter(cat.id)}
                  className={`relative px-4 py-1.5 text-sm font-handwritten overflow-hidden ${
                    isActive
                      ? "text-primary-foreground"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                  style={{
                    /* The button shape always matches the active style when
                       active, and the dashed style when inactive.
                       CSS transition handles the border-radius morph. */
                    borderRadius: isActive
                      ? "255px 15px 225px 15px / 15px 225px 15px 255px"
                      : "18px 4px 18px 4px / 4px 18px 4px 18px",
                    border: isActive
                      ? "2px solid transparent"
                      : "2px dashed currentColor",
                    opacity: isActive ? 1 : 0.7,
                    transition:
                      "border-radius 0.25s ease, border-color 0.2s ease, opacity 0.2s ease",
                  }}
                >
                  {/* Background — per-tab AnimatePresence so shape never
                      morphs through a circular intermediate value */}
                  <AnimatePresence>
                    {isActive && (
                      <motion.span
                        key="bg"
                        className="absolute inset-0 bg-primary -z-10"
                        style={{
                          borderRadius:
                            "255px 15px 225px 15px / 15px 225px 15px 255px",
                        }}
                        initial={{ opacity: 0, scale: 0.82 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.82 }}
                        transition={{ duration: 0.22, ease: "easeOut" }}
                      />
                    )}
                  </AnimatePresence>
                  {cat.label}
                  <span
                    className={`ml-1.5 text-xs font-mono ${
                      isActive
                        ? "text-primary-foreground/70"
                        : "text-muted-foreground/60"
                    }`}
                  >
                    ({count})
                  </span>
                </button>
              );
            })}
          </motion.div>

          {/* Cards grid — spotlight container */}
          <div
            className="grid grid-cols-1 lg:grid-cols-3 gap-6"
            style={{ paddingTop: "16px" }}
            onMouseLeave={() => setHoveredIndex(null)}
          >
            <AnimatePresence mode="popLayout">
              {filteredProjects.length > 0 ? (
                filteredProjects.map((project, index) => {
                  const rotation =
                    CARD_ROTATIONS[index % CARD_ROTATIONS.length];
                  const stickyClass = getStickyClass(project.category);
                  const stamp = getStamp(project.category);
                  const stampColor = getStampColor(project.category);
                  const caseNum = getCaseNumber(projects, project);
                  const qaMetrics = QA_CARD_METRICS[project.title];

                  // Spotlight: dim other cards when one is hovered
                  const isHovered = hoveredIndex === index;
                  const isOtherHovered =
                    hoveredIndex !== null && hoveredIndex !== index;

                  return (
                    <motion.div
                      key={project.title}
                      className={`sticky-note ${stickyClass} p-4 cursor-pointer group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2`}
                      role="button"
                      tabIndex={0}
                      aria-label={`View details for ${project.title}`}
                      initial={{
                        opacity: 0,
                        y: 30,
                        scale: 0.95,
                        rotate: rotation,
                      }}
                      animate={{
                        opacity: isOtherHovered ? 0.5 : 1,
                        y: 0,
                        scale: isHovered ? 1.03 : isOtherHovered ? 0.97 : 1,
                        rotate: isHovered ? 0 : rotation,
                        filter: isOtherHovered
                          ? "saturate(0.7)"
                          : "saturate(1)",
                        zIndex: isHovered ? 10 : 1,
                        boxShadow: isHovered
                          ? "6px 8px 0 rgba(0,0,0,0.18), 12px 16px 32px rgba(0,0,0,0.12)"
                          : undefined,
                      }}
                      exit={{ opacity: 0, y: -20, scale: 0.95 }}
                      transition={{
                        opacity: { duration: 0.2 },
                        scale: { duration: 0.2 },
                        filter: { duration: 0.2 },
                        // Entry animation: staggered
                        y: {
                          duration: 0.35,
                          delay: index * 0.06,
                          ease: [0.25, 0.46, 0.45, 0.94],
                        },
                      }}
                      onMouseEnter={() => setHoveredIndex(index)}
                      onClick={() => handleProjectClick(project)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault();
                          handleProjectClick(project);
                        }
                      }}
                    >
                      {/* Polaroid image */}
                      <div className="mb-3 overflow-hidden">
                        <div className="polaroid">
                          <Image
                            src={project.image || "/placeholder.svg"}
                            alt={project.title}
                            width={400}
                            height={180}
                            className="w-full h-36 object-cover group-hover:scale-105 transition-transform duration-400"
                            style={{ display: "block" }}
                          />
                        </div>
                      </div>

                      {/* Case header row */}
                      <div className="flex items-center justify-between mb-2 mt-1">
                        <span className="case-badge">{caseNum}</span>
                        <span className={`qa-stamp ${stampColor}`}>
                          {stamp}
                        </span>
                      </div>

                      {/* QA metrics — shown only for QA projects */}
                      {qaMetrics && (
                        <div className="flex gap-1.5 mb-2">
                          <span
                            className="inline-flex items-center gap-1 text-[10px] font-mono font-bold px-1.5 py-0.5 bg-green-100 dark:bg-green-950/50 text-green-700 dark:text-green-400 border border-green-300/50 dark:border-green-700/50"
                            style={{ borderRadius: "2px 5px 2px 5px" }}
                          >
                            <CheckCircle className="w-2.5 h-2.5" />
                            {qaMetrics.testCases} TCs
                          </span>
                          <span
                            className="inline-flex items-center gap-1 text-[10px] font-mono font-bold px-1.5 py-0.5 bg-red-100 dark:bg-red-950/50 text-red-700 dark:text-red-400 border border-red-300/50 dark:border-red-700/50"
                            style={{ borderRadius: "2px 5px 2px 5px" }}
                          >
                            <Bug className="w-2.5 h-2.5" />
                            {qaMetrics.bugsFound}
                          </span>
                        </div>
                      )}

                      {/* Title */}
                      <h3
                        className="text-base font-bold mb-1.5 leading-snug group-hover:opacity-75 transition-opacity"
                        style={{ fontFamily: "var(--font-kalam), cursive" }}
                      >
                        {project.title}
                      </h3>

                      {/* Description */}
                      <p className="text-xs leading-relaxed mb-3 opacity-70 line-clamp-2">
                        {project.description}
                      </p>

                      {/* Tech tags — hand-written label style */}
                      <div className="flex flex-wrap gap-1.5 mb-3">
                        {project.techStack.slice(0, 3).map((tech) => (
                          <span
                            key={tech}
                            className="text-[10px] px-2 py-0.5 font-mono font-semibold"
                            style={{
                              background: "rgba(0,0,0,0.08)",
                              borderRadius: "2px 6px 2px 6px / 6px 2px 6px 2px",
                              border: "1px dashed rgba(0,0,0,0.18)",
                            }}
                          >
                            {tech}
                          </span>
                        ))}
                        {project.techStack.length > 3 && (
                          <span
                            className="text-[10px] px-2 py-0.5 font-mono opacity-50"
                            style={{
                              background: "rgba(0,0,0,0.05)",
                              borderRadius: "2px",
                              border: "1px dashed rgba(0,0,0,0.12)",
                            }}
                          >
                            +{project.techStack.length - 3} more
                          </span>
                        )}
                      </div>

                      {/* Links */}
                      <div className="flex flex-wrap gap-x-4 gap-y-1 opacity-60 group-hover:opacity-80 transition-opacity">
                        {project.githubFe && (
                          <a
                            href={project.githubFe}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center text-xs hover:opacity-100 transition-opacity font-medium underline underline-offset-2"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <Github className="w-3 h-3 mr-1" />
                            {project.githubBe ? "FE" : "Code"}
                          </a>
                        )}
                        {project.githubBe && (
                          <a
                            href={project.githubBe}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center text-xs hover:opacity-100 transition-opacity font-medium underline underline-offset-2"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <Github className="w-3 h-3 mr-1" />
                            BE
                          </a>
                        )}
                        {project.website && (
                          <a
                            href={project.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center text-xs hover:opacity-100 transition-opacity font-medium underline underline-offset-2"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <ExternalLink className="w-3 h-3 mr-1" />
                            {project.category === "qa" ? "Docs" : "Live"}
                          </a>
                        )}
                      </div>
                    </motion.div>
                  );
                })
              ) : (
                <motion.div
                  key="empty"
                  className="col-span-full flex flex-col items-center justify-center py-20 text-center"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="text-5xl mb-4">🔍</div>
                  <p className="text-base font-medium text-foreground mb-1 font-handwritten">
                    No cases filed yet
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Projects in this category will appear here.
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </motion.section>

      <ProjectDialog
        project={selectedProject}
        open={projectDialogOpen}
        onOpenChange={setProjectDialogOpen}
      />
    </>
  );
}
