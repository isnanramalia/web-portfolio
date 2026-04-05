"use client";

import React from "react";
import { motion } from "framer-motion";
import { textReveal, letterByLetter, letter } from "@/lib/animations";

interface AnimatedTextProps {
  text: string;
  className?: string;
  variant?: "reveal" | "letterByLetter" | "typewriter";
  delay?: number;
  once?: boolean;
}

export function AnimatedText({
  text,
  className = "",
  variant = "reveal",
  delay = 0,
  once = true,
}: AnimatedTextProps) {
  if (variant === "letterByLetter") {
    return (
      <motion.span
        className={`inline-block ${className}`}
        variants={letterByLetter}
        initial="hidden"
        whileInView="visible"
        viewport={{ once }}
        transition={{ delay }}
      >
        {text.split("").map((char, index) => (
          <motion.span
            key={index}
            variants={letter}
            className="inline-block"
            style={{ whiteSpace: char === " " ? "pre" : "normal" }}
          >
            {char}
          </motion.span>
        ))}
      </motion.span>
    );
  }

  if (variant === "typewriter") {
    return (
      <motion.span
        className={`inline-block ${className}`}
        initial={{ clipPath: "inset(0 100% 0 0)" }}
        whileInView={{ clipPath: "inset(0 0% 0 0)" }}
        viewport={{ once }}
        transition={{
          duration: text.length * 0.05,
          delay,
          ease: "easeInOut",
        }}
        style={{ overflow: "hidden", whiteSpace: "nowrap" }}
      >
        {text}
      </motion.span>
    );
  }

  return (
    <motion.span
      className={`inline-block ${className}`}
      variants={textReveal}
      initial="hidden"
      whileInView="visible"
      viewport={{ once }}
      transition={{ delay }}
    >
      {text}
    </motion.span>
  );
}

interface AnimatedWordsProps {
  text: string;
  className?: string;
  delay?: number;
  once?: boolean;
}

export function AnimatedWords({
  text,
  className = "",
  delay = 0,
  once = true,
}: AnimatedWordsProps) {
  const words = text.split(" ");

  return (
    <motion.span
      className={`inline ${className}`}
      style={{ perspective: "800px" }}
      initial="hidden"
      whileInView="visible"
      viewport={{ once }}
      transition={{
        staggerChildren: 0.1,
        delayChildren: delay,
      }}
    >
      {words.map((word, index) => (
        <motion.span
          key={index}
          className="inline-block mr-1"
          style={{ willChange: "transform" }}
          variants={{
            hidden: {
              opacity: 0,
              y: 50,
              rotateX: -90,
            },
            visible: {
              opacity: 1,
              y: 0,
              rotateX: 0,
              transition: {
                duration: 0.6,
                ease: [0.25, 0.46, 0.45, 0.94],
              },
            },
          }}
        >
          {word}
        </motion.span>
      ))}
    </motion.span>
  );
}

interface GradientTextProps {
  text: string;
  className?: string;
  gradient?: string;
  animate?: boolean;
}

export function GradientText({
  text,
  className = "",
  gradient = "from-primary to-accent",
  animate = true,
}: GradientTextProps) {
  return (
    <motion.span
      className={`bg-gradient-to-r ${gradient} bg-clip-text text-transparent ${className}`}
      initial={animate ? { backgroundPosition: "0% 50%" } : {}}
      animate={animate ? { backgroundPosition: "100% 50%" } : {}}
      transition={
        animate
          ? {
              duration: 3,
              repeat: Infinity,
              repeatType: "reverse",
              ease: "easeInOut",
            }
          : {}
      }
      style={
        animate
          ? {
              backgroundSize: "200% 200%",
            }
          : {}
      }
    >
      {text}
    </motion.span>
  );
}
