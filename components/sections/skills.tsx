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
      className="px-4 sm:px-6 lg:px-12 py-8 lg:py-16"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      viewport={{ once: true }}
    >
      <div className="max-w-4xl mx-auto">
        <motion.h2
          className="text-2xl font-medium mb-10 text-foreground doodle-section-heading"
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
