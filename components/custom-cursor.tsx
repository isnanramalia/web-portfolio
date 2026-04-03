"use client";

import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

type CursorState = "idle" | "default" | "link" | "text";

export function CustomCursor() {
  const [state, setState] = useState<CursorState>("idle");
  const [mounted, setMounted] = useState(false);

  const mouseX = useMotionValue(-300);
  const mouseY = useMotionValue(-300);

  const dotX = useSpring(mouseX, { stiffness: 800, damping: 40, mass: 0.4 });
  const dotY = useSpring(mouseY, { stiffness: 800, damping: 40, mass: 0.4 });

  const ringX = useSpring(mouseX, { stiffness: 180, damping: 22, mass: 0.8 });
  const ringY = useSpring(mouseY, { stiffness: 180, damping: 22, mass: 0.8 });

  useEffect(() => {
    if (!window.matchMedia("(pointer: fine)").matches) return;
    setMounted(true);

    const onMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
      setState((prev) => (prev === "idle" ? "default" : prev));
    };

    const onMouseLeave = () => setState("idle");
    const onMouseEnter = () => setState("default");

    const onMouseOver = (e: MouseEvent) => {
      const el = e.target as HTMLElement;

      if (el.closest("a, button, [role='button'], label, [tabindex]")) {
        setState("link");
      } else if (el.closest("h1, h2, h3, h4, h5, h6, p, li, blockquote")) {
        setState("text");
      } else {
        setState("default");
      }
    };

    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseleave", onMouseLeave);
    document.addEventListener("mouseenter", onMouseEnter);
    document.addEventListener("mouseover", onMouseOver);

    return () => {
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseleave", onMouseLeave);
      document.removeEventListener("mouseenter", onMouseEnter);
      document.removeEventListener("mouseover", onMouseOver);
    };
  }, [mouseX, mouseY]);

  if (!mounted) return null;

  const isIdle = state === "idle";
  const isLink = state === "link";
  const isText = state === "text";

  return (
    <>
      <motion.div
        aria-hidden
        className="fixed top-0 left-0 pointer-events-none z-[10001]"
        style={{
          x: dotX,
          y: dotY,
          translateX: "-50%",
          translateY: "-50%",
        }}
      >
        <motion.div
          className="bg-primary"
          animate={{
            width: isText ? 2 : 8,
            height: isText ? 20 : 8,
            borderRadius: isText ? 2 : 99,
            opacity: isIdle || isLink ? 0 : 1,
            scale: isIdle ? 0 : 1,
          }}
          transition={{
            duration: 0.15,
            ease: [0.25, 0.46, 0.45, 0.94],
          }}
        />
      </motion.div>

      <motion.div
        aria-hidden
        className="fixed top-0 left-0 pointer-events-none z-[10000]"
        style={{
          x: ringX,
          y: ringY,
          translateX: "-50%",
          translateY: "-50%",
        }}
      >
        <motion.div
          className="relative rounded-full border border-primary"
          animate={{
            width: isLink ? 54 : isText ? 22 : 36,
            height: isLink ? 54 : isText ? 22 : 36,
            opacity: isIdle ? 0 : isLink ? 0.85 : isText ? 0.35 : 0.5,
            scale: isIdle ? 0.4 : 1,
          }}
          transition={{
            duration: 0.22,
            ease: [0.25, 0.46, 0.45, 0.94],
          }}
        >
          <motion.div
            className="absolute inset-0 rounded-full bg-primary"
            animate={{ opacity: isLink ? 0.1 : 0 }}
            transition={{ duration: 0.2 }}
          />
        </motion.div>
      </motion.div>
    </>
  );
}
