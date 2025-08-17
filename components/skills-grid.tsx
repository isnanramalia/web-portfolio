"use client";

import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import Image from "next/image";
import {
  useMagneticEffect,
  useIntersectionObserver,
} from "@/hooks/use-advanced-animations";
import {
  staggerContainer,
  staggerItem,
  cardHover,
  cardContent,
  springBounce,
  floatingY,
} from "@/lib/animations";

interface Skill {
  name: string;
  logo: string;
}

interface SkillsGridProps {
  skills: Skill[];
}

const accentColors = [
  "var(--accent-navy)",
  "var(--accent-blue)",
  "var(--accent-cream)",
  "var(--accent-beige)",
  "var(--accent-warm)",
];

// Enhanced skill card component with sophisticated animations
function SkillCard({
  skill,
  index,
  accentColor,
}: {
  skill: Skill;
  index: number;
  accentColor: string;
}) {
  const magneticRef = useMagneticEffect(0.15);
  const { ref, hasIntersected } = useIntersectionObserver(0.2);

  // Mouse tracking for 3D effect
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const rotateX = useTransform(mouseY, [-100, 100], [15, -15]);
  const rotateY = useTransform(mouseX, [-100, 100], [-15, 15]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    mouseX.set(e.clientX - centerX);
    mouseY.set(e.clientY - centerY);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  return (
    <motion.div
      ref={ref as any}
      className="group relative cursor-pointer"
      variants={staggerItem}
      initial="hidden"
      animate={hasIntersected ? "visible" : "hidden"}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        perspective: 1000,
        x: magneticRef.x,
        y: magneticRef.y,
      }}
    >
      <motion.div
        ref={magneticRef.ref as any}
        className="skill-card relative flex flex-col items-center p-6 bg-background/50 backdrop-blur-sm border border-border rounded-3xl transition-all duration-500 group-hover:border-primary/30 group-hover:bg-background/80"
        style={{
          rotateX,
          rotateY,
          transformStyle: "preserve-3d",
        }}
        variants={cardHover}
        initial="rest"
        whileHover="hover"
        animate={{
          boxShadow: hasIntersected
            ? [
                "0 4px 20px rgba(0,0,0,0.1)",
                `0 8px 30px color-mix(in srgb, ${accentColor} 20%, transparent)`,
                "0 4px 20px rgba(0,0,0,0.1)",
              ]
            : "0 4px 20px rgba(0,0,0,0.1)",
        }}
        transition={{
          boxShadow: {
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut",
          },
        }}
      >
        {/* Floating icon with advanced animations */}
        <motion.div
          className="w-16 h-16 mb-4 relative"
          variants={floatingY}
          animate="animate"
          style={{ transformStyle: "preserve-3d", translateZ: 30 }}
        >
          <motion.div
            className="absolute inset-0 rounded-2xl"
            style={{
              background: `color-mix(in srgb, ${accentColor} 10%, transparent)`,
            }}
            animate={{
              scale: [1, 1.05, 1],
              rotate: [0, 2, -2, 0],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut",
              delay: index * 0.2,
            }}
          />

          <motion.div
            whileHover={{
              scale: 1.2,
              transition: { duration: 0.3, ease: "easeInOut" },
            }}
            className="relative z-10 w-full h-full flex items-center justify-center"
          >
            <Image
              src={skill.logo}
              alt={skill.name}
              width={40}
              height={40}
              className="w-10 h-10 object-contain"
            />
          </motion.div>

          {/* Glow effect */}
          <motion.div
            className="absolute inset-0 rounded-2xl blur-xl opacity-0 group-hover:opacity-30 transition-opacity duration-500"
            style={{
              background: `color-mix(in srgb, ${accentColor} 40%, transparent)`,
            }}
          />
        </motion.div>

        {/* Skill name with enhanced typography */}
        <motion.span
          className="text-sm font-medium text-center text-foreground group-hover:text-primary transition-colors duration-300"
          variants={cardContent}
          style={{ transformStyle: "preserve-3d", translateZ: 20 }}
        >
          {skill.name}
        </motion.span>

        {/* Interactive border glow */}
        <motion.div
          className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
          style={{
            background: `linear-gradient(135deg, color-mix(in srgb, ${accentColor} 20%, transparent), transparent, color-mix(in srgb, ${accentColor} 10%, transparent))`,
            filter: "blur(1px)",
            zIndex: -1,
          }}
        />

        {/* Animated corner accents */}
        <motion.div
          className="absolute top-2 right-2 w-2 h-2 rounded-full opacity-0 group-hover:opacity-100"
          style={{ backgroundColor: accentColor }}
          animate={{
            scale: [0, 1, 0],
            opacity: [0, 1, 0],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            delay: index * 0.1,
          }}
        />
      </motion.div>
    </motion.div>
  );
}

export function SkillsGrid({ skills }: SkillsGridProps) {
  return (
    <div className="mb-16">
      <motion.div
        className="relative"
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
      >
        {/* Enhanced Floating Skills Container */}
        <motion.div
          className="flex flex-wrap justify-center gap-8 w-fit mx-auto"
          style={{ perspective: 1200 }}
        >
          {skills.map((skill, index) => {
            const accentColor = accentColors[index % accentColors.length];

            return (
              <SkillCard
                key={skill.name}
                skill={skill}
                index={index}
                accentColor={accentColor}
              />
            );
          })}
        </motion.div>

        {/* Background enhancement elements */}
        <motion.div
          className="absolute top-1/2 left-1/4 w-32 h-32 bg-primary/5 rounded-full blur-3xl -z-10"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
            x: [0, 20, 0],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />

        <motion.div
          className="absolute bottom-1/3 right-1/4 w-24 h-24 bg-accent/5 rounded-full blur-2xl -z-10"
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.2, 0.4, 0.2],
            y: [0, -15, 0],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2,
          }}
        />
      </motion.div>
    </div>
  );
}
