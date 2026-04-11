"use client";

import { useEffect, useRef, useState, ReactNode } from "react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";

interface ParallaxProps {
  children: ReactNode;
  speed?: number; // -1 to 1 (negative = reverse, 0 = no effect, positive = forward)
  className?: string;
  offset?: number;
  disabled?: boolean;
}

/**
 * Performance-optimized Parallax component with GPU acceleration
 * Uses Framer Motion's useScroll for butter-smooth 60fps animations
 */
export function Parallax({
  children,
  speed = 0.5,
  className = "",
  offset = 0,
  disabled = false,
}: ParallaxProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [isInView, setIsInView] = useState(false);

  // Only apply parallax when element is near viewport (performance optimization)
  useEffect(() => {
    if (disabled || !ref.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsInView(entry.isIntersecting);
      },
      {
        rootMargin: "200px 0px", // Start parallax 200px before entering viewport
      }
    );

    observer.observe(ref.current);

    return () => observer.disconnect();
  }, [disabled]);

  // Track scroll position relative to element
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"], // Track from element enters to exits viewport
  });

  // Transform scroll to parallax offset
  // Speed > 0: element moves slower than scroll (traditional parallax)
  // Speed < 0: element moves faster/opposite direction
  const y = useTransform(
    scrollYProgress,
    [0, 1],
    [offset - speed * 200, offset + speed * 200]
  );

  // Add spring physics for smoother animation
  const smoothY = useSpring(y, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  if (disabled) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      ref={ref}
      className={className}
      style={{
        y: isInView ? smoothY : 0,
        willChange: isInView ? "transform" : "auto", // GPU acceleration only when needed
      }}
    >
      {children}
    </motion.div>
  );
}

interface ParallaxLayerProps {
  children: ReactNode;
  speed?: number;
  className?: string;
  zIndex?: number;
}

/**
 * ParallaxLayer for creating multi-layer parallax depth effects
 * Use multiple layers with different speeds for depth perception
 */
export function ParallaxLayer({
  children,
  speed = 0.5,
  className = "",
  zIndex = 0,
}: ParallaxLayerProps) {
  return (
    <Parallax speed={speed} className={className}>
      <div style={{ zIndex, position: "relative" }}>{children}</div>
    </Parallax>
  );
}

interface ParallaxSectionProps {
  children: ReactNode;
  className?: string;
  backgroundLayers?: ReactNode[];
}

/**
 * ParallaxSection - Wrapper for sections with parallax backgrounds
 * Automatically handles layering and performance
 */
export function ParallaxSection({
  children,
  className = "",
  backgroundLayers = [],
}: ParallaxSectionProps) {
  return (
    <div className={`relative overflow-hidden ${className}`}>
      {/* Background parallax layers */}
      {backgroundLayers.map((layer, index) => (
        <div
          key={index}
          className="absolute inset-0 pointer-events-none"
          style={{ zIndex: index }}
        >
          <Parallax speed={0.3 + index * 0.1}>{layer}</Parallax>
        </div>
      ))}

      {/* Main content */}
      <div className="relative z-10">{children}</div>
    </div>
  );
}

interface FloatingElementProps {
  children: ReactNode;
  speed?: number;
  direction?: "up" | "down" | "left" | "right";
  amplitude?: number;
  className?: string;
}

/**
 * FloatingElement - Creates subtle floating animation with parallax
 * Perfect for decorative blobs, icons, or background elements
 */
export function FloatingElement({
  children,
  speed = 0.3,
  direction = "up",
  amplitude = 20,
  className = "",
}: FloatingElementProps) {
  const ref = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const getTransform = () => {
    switch (direction) {
      case "up":
        return {
          y: useSpring(
            useTransform(scrollYProgress, [0, 1], [amplitude, -amplitude]),
            { stiffness: 100, damping: 30 }
          ),
        };
      case "down":
        return {
          y: useSpring(
            useTransform(scrollYProgress, [0, 1], [-amplitude, amplitude]),
            { stiffness: 100, damping: 30 }
          ),
        };
      case "left":
        return {
          x: useSpring(
            useTransform(scrollYProgress, [0, 1], [amplitude, -amplitude]),
            { stiffness: 100, damping: 30 }
          ),
        };
      case "right":
        return {
          x: useSpring(
            useTransform(scrollYProgress, [0, 1], [-amplitude, amplitude]),
            { stiffness: 100, damping: 30 }
          ),
        };
    }
  };

  return (
    <motion.div
      ref={ref}
      className={className}
      style={{
        ...getTransform(),
        willChange: "transform",
      }}
    >
      {children}
    </motion.div>
  );
}
