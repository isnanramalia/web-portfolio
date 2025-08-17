"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  floatingY,
  floatingX,
  floatingRotate,
  morphing,
} from "@/lib/animations";

interface FloatingElementsProps {
  count?: number;
  className?: string;
}

export function FloatingElements({
  count = 8,
  className = "",
}: FloatingElementsProps) {
  const elements = Array.from({ length: count }, (_, index) => ({
    id: index,
    size: Math.random() * 60 + 20,
    initialX: Math.random() * 100,
    initialY: Math.random() * 100,
    delay: Math.random() * 5,
    duration: Math.random() * 10 + 15,
    opacity: Math.random() * 0.3 + 0.1,
    blur: Math.random() * 3 + 1,
  }));

  return (
    <div
      className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}
    >
      {elements.map((element) => (
        <motion.div
          key={element.id}
          className="absolute rounded-full"
          style={{
            width: element.size,
            height: element.size,
            left: `${element.initialX}%`,
            top: `${element.initialY}%`,
            background: `linear-gradient(135deg, 
              rgba(var(--primary-rgb), ${element.opacity}), 
              rgba(var(--accent-rgb), ${element.opacity * 0.7})
            )`,
            filter: `blur(${element.blur}px)`,
          }}
          variants={morphing}
          initial="initial"
          animate="animate"
          transition={{
            delay: element.delay,
            duration: element.duration,
            repeat: Infinity,
            repeatType: "reverse",
          }}
        />
      ))}

      {/* Gradient orbs */}
      <motion.div
        className="absolute top-1/4 left-1/4 w-32 h-32 rounded-full opacity-20"
        style={{
          background:
            "radial-gradient(circle, rgba(var(--primary-rgb), 0.3) 0%, transparent 70%)",
          filter: "blur(20px)",
        }}
        variants={floatingY}
        animate="animate"
      />

      <motion.div
        className="absolute bottom-1/4 right-1/4 w-24 h-24 rounded-full opacity-15"
        style={{
          background:
            "radial-gradient(circle, rgba(var(--accent-rgb), 0.4) 0%, transparent 70%)",
          filter: "blur(15px)",
        }}
        variants={floatingX}
        animate="animate"
      />

      {/* Geometric shapes */}
      <motion.div
        className="absolute top-1/3 right-1/3 w-16 h-16 opacity-10"
        style={{
          background: "rgba(var(--primary-rgb), 0.2)",
          clipPath: "polygon(50% 0%, 0% 100%, 100% 100%)",
          filter: "blur(2px)",
        }}
        variants={floatingRotate}
        animate="animate"
      />
    </div>
  );
}
