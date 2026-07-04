"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { useTheme } from "next-themes";
import { useIntersectionObserver } from "@/hooks/use-advanced-animations";
import { staggerContainer, staggerItem } from "@/lib/animations";
import { 
  Search, 
  GitBranch, 
  CheckSquare, 
  Bug, 
  Zap, 
  ShieldAlert, 
  BarChart3 
} from "lucide-react";

interface Skill {
  name: string;
  logo: string;
}

interface SkillsGridProps {
  skills: Skill[];
}

// Six pastel sticky-note colors — cycles per skill card
const SKILL_PASTEL_CLASSES = [
  "sticky-note-yellow",
  "sticky-note-green",
  "sticky-note-blue",
  "sticky-note-pink",
  "sticky-note-lavender",
  "sticky-note-peach",
] as const;

// Slight varied rotations to feel hand-pinned
const SKILL_ROTATIONS = [-1.2, 0.8, -0.6, 1.4, -1.0, 0.5, -1.8, 0.9];

const QA_SKILLS: Skill[] = [
  { name: "Manual Testing", logo: "icon:search" },
  { name: "STLC & SDLC", logo: "icon:branch" },
  { name: "Test Case Design", logo: "icon:check" },
  { name: "Bug Tracking & Reporting", logo: "icon:bug" },
  { name: "Postman API Testing", logo: "/icons/postman.webp" },
  { name: "Stress & Boundary Testing", logo: "icon:zap" },
  { name: "Notion QA Documentation", logo: "/icons/notion.png" },
  { name: "Trello Agile Board", logo: "/icons/trello.jpg" },
  { name: "Boundary Metrics", logo: "icon:chart" },
  { name: "Excel Sheet Checklists", logo: "/icons/excel.png" },
];

function SkillIcon({ logo, name }: { logo: string; name: string }) {
  if (logo.startsWith("icon:")) {
    const iconName = logo.split(":")[1];
    const iconClassName = "w-9 h-9 text-[#0B1957] dark:text-primary stroke-[1.8]";
    switch (iconName) {
      case "search": return <Search className={iconClassName} />;
      case "branch": return <GitBranch className={iconClassName} />;
      case "check": return <CheckSquare className={iconClassName} />;
      case "bug": return <Bug className={iconClassName} />;
      case "zap": return <Zap className={iconClassName} />;
      case "shield": return <ShieldAlert className={iconClassName} />;
      case "chart": return <BarChart3 className={iconClassName} />;
      default: return <Bug className={iconClassName} />;
    }
  }
  return (
    <Image
      src={logo}
      alt={name}
      width={36}
      height={36}
      className="w-9 h-9 object-contain"
    />
  );
}

function SkillCard({ skill, index }: { skill: Skill; index: number }) {
  const { ref, hasIntersected } = useIntersectionObserver(0.15);
  const pastelClass = SKILL_PASTEL_CLASSES[index % SKILL_PASTEL_CLASSES.length];
  const baseRotation = SKILL_ROTATIONS[index % SKILL_ROTATIONS.length];

  return (
    <motion.div
      ref={ref as any}
      className="group relative cursor-default"
      variants={staggerItem}
      initial="hidden"
      animate={hasIntersected ? "visible" : "hidden"}
      style={{ paddingTop: "10px" }} // room for tape decoration
    >
      <motion.div
        className={`skill-sticky ${pastelClass}`}
        initial={{ rotate: baseRotation }}
        animate={{ rotate: baseRotation }}
        whileHover={{ rotate: 0, scale: 1.08, y: -6 }}
        transition={{ duration: 0.22, ease: [0.34, 1.5, 0.64, 1] }}
      >
        {/* Icon */}
        <div className="w-11 h-11 mb-3 flex items-center justify-center mx-auto">
          <SkillIcon logo={skill.logo} name={skill.name} />
        </div>

        {/* Name */}
        <span className="text-[11px] font-bold text-center leading-tight font-handwritten block">
          {skill.name}
        </span>
      </motion.div>
    </motion.div>
  );
}

export function SkillsGrid({ skills }: SkillsGridProps) {
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isDark = mounted && theme === "dark";
  const displayedSkills = isDark ? QA_SKILLS : skills;

  return (
    <div className="mb-16">
      <AnimatePresence mode="wait">
        <motion.div
          key={isDark ? "qa" : "frontend"}
          className="flex flex-wrap justify-center gap-5 w-fit mx-auto"
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          exit="exit"
          viewport={{ once: true, margin: "-80px" }}
        >
          {displayedSkills.map((skill, index) => (
            <motion.div
              key={skill.name}
              variants={{
                hidden: { opacity: 0, rotateY: 90, scale: 0.8 },
                visible: { 
                  opacity: 1, 
                  rotateY: 0, 
                  scale: 1,
                  transition: { type: "spring", stiffness: 120, damping: 14 } 
                },
                exit: { 
                  opacity: 0, 
                  rotateY: -90, 
                  scale: 0.8,
                  transition: { duration: 0.2 } 
                }
              }}
              style={{ perspective: 1000 }}
            >
              <SkillCard skill={skill} index={index} />
            </motion.div>
          ))}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
