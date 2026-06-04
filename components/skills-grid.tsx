"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { useIntersectionObserver } from "@/hooks/use-advanced-animations";
import { staggerContainer, staggerItem } from "@/lib/animations";

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
          <Image
            src={skill.logo}
            alt={skill.name}
            width={36}
            height={36}
            className="w-9 h-9 object-contain"
          />
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
  return (
    <div className="mb-16">
      <motion.div
        className="flex flex-wrap justify-center gap-5 w-fit mx-auto"
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-80px" }}
      >
        {skills.map((skill, index) => (
          <SkillCard key={skill.name} skill={skill} index={index} />
        ))}
      </motion.div>
    </div>
  );
}
