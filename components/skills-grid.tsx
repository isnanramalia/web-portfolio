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

function SkillCard({ skill }: { skill: Skill }) {
  const { ref, hasIntersected } = useIntersectionObserver(0.15);

  return (
    <motion.div
      ref={ref as any}
      className="group relative cursor-default"
      variants={staggerItem}
      initial="hidden"
      animate={hasIntersected ? "visible" : "hidden"}
    >
      <motion.div
        className="flex flex-col items-center p-6 bg-background/50 border border-border rounded-3xl"
        whileHover={{ scale: 1.06 }}
        transition={{ duration: 0.2, ease: "easeOut" }}
      >
        <div className="w-16 h-16 mb-4 flex items-center justify-center">
          <Image
            src={skill.logo}
            alt={skill.name}
            width={40}
            height={40}
            className="w-10 h-10 object-contain"
          />
        </div>

        <span className="text-sm font-medium text-center text-foreground">
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
        className="flex flex-wrap justify-center gap-6 w-fit mx-auto"
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-80px" }}
      >
        {skills.map((skill) => (
          <SkillCard key={skill.name} skill={skill} />
        ))}
      </motion.div>
    </div>
  );
}
