"use client";

import { motion } from "framer-motion";
import { SkillsGrid } from "@/components/skills-grid";

interface Skill {
  name: string;
  logo: string;
}

interface SkillsSectionProps {
  skillsData: Skill[];
}

export function SkillsSection({ skillsData }: SkillsSectionProps) {
  return (
    <motion.section
      id="skills"
      className="px-4 sm:px-6 lg:px-12 py-8 lg:py-16 relative overflow-hidden"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      viewport={{ once: true }}
    >
      {/* Subtle floating particles */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-1 h-1 bg-primary/20 rounded-full animate-pulse"></div>
        <div className="absolute top-40 right-20 w-0.5 h-0.5 bg-primary/30 rounded-full animate-pulse"></div>
        <div className="absolute bottom-32 left-1/4 w-1.5 h-1.5 bg-primary/15 rounded-full animate-pulse"></div>
        <div className="absolute top-1/2 right-1/3 w-1 h-1 bg-primary/25 rounded-full animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-0.5 h-0.5 bg-primary/20 rounded-full animate-pulse"></div>
      </div>

      {/* Gradient background for depth */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/2 via-transparent to-primary/3"></div>

      <div className="max-w-4xl mx-auto relative z-10">
        <motion.h2
          className="text-2xl font-medium mb-8 text-foreground"
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
          viewport={{ once: true }}
        >
          Skills & Technologies
        </motion.h2>

        <SkillsGrid skills={skillsData} />
      </div>
    </motion.section>
  );
}
