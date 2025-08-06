"use client";

import { motion } from "framer-motion";
import { SkillsGrid } from "@/components/skills-grid";

interface Skill {
  name: string;
  logo: string;
}

interface SkillCategory {
  category: string;
  skills: Skill[];
}

interface SkillsSectionProps {
  skillsData: SkillCategory[];
}

export function SkillsSection({ skillsData }: SkillsSectionProps) {
  return (
    <motion.section
      id="skills"
      className="px-4 sm:px-6 lg:px-12 py-8 lg:py-16 bg-accent/30"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      viewport={{ once: true }}
    >
      <div className="max-w-4xl mx-auto">
        <motion.h2
          className="text-2xl font-medium mb-8 text-foreground"
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
          viewport={{ once: true }}
        >
          Skills & Technologies
        </motion.h2>
        <div className="space-y-8">
          {skillsData.map((skillCategory, categoryIndex) => (
            <motion.div
              key={categoryIndex}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.4,
                delay: categoryIndex * 0.1,
              }}
              viewport={{ once: true }}
            >
              <SkillsGrid
                title={skillCategory.category}
                skills={skillCategory.skills}
              />
            </motion.div>
          ))}
        </div>
      </div>
    </motion.section>
  );
}
