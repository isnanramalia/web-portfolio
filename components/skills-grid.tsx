"use client";

import { motion } from "framer-motion";
import Image from "next/image";

interface Skill {
  name: string;
  logo: string;
}

interface SkillsGridProps {
  title: string;
  skills: Skill[];
}

export function SkillsGrid({ title, skills }: SkillsGridProps) {
  return (
    <div className="mb-12">
      <motion.h3
        className="text-lg font-medium mb-6 text-foreground"
        initial={{ opacity: 0, x: -20 }}
        whileInView={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.4 }}
        viewport={{ once: true }}
      >
        {title}
      </motion.h3>

      <div className="skills-container">
        <div className="skills-grid">
          {skills.map((skill, index) => (
            <motion.div
              key={skill.name}
              className="skill-card flex flex-col items-center p-6 bg-card rounded-2xl border border-border group cursor-pointer"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.03 }}
              viewport={{ once: true }}
            >
              <div className="w-12 h-12 bg-primary rounded-xl p-2 mb-3 group-hover: scale-105 transition-transform duration-200">
                <Image
                  src={skill.logo || "/placeholder.svg"}
                  alt={skill.name}
                  width={32}
                  height={32}
                  className="w-full h-full object-contain filter brightness-0 invert dark:invert-0"
                />
              </div>

              <span className="text-sm font-medium text-card-foreground text-center group-hover:text-primary transition-colors duration-200">
                {skill.name}
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
