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

  const ringX = useSpring(mouseX, { stiffness: 260, damping: 28, mass: 0.7 });
  const ringY = useSpring(mouseY, { stiffness: 260, damping: 28, mass: 0.7 });

  useEffect(() => {
    if (!window.matchMedia("(pointer: fine)").matches) return;
    setMounted(true);

    const root = document.documentElement;
    let rafId: number | null = null;
    let latestX = -300;
    let latestY = -300;
    let cursorVisible = false;

    const setNativeCursorHidden = (hidden: boolean) => {
      if (hidden) {
        root.setAttribute("data-custom-cursor", "true");
      } else {
        root.removeAttribute("data-custom-cursor");
      }
    };

    const flushPosition = () => {
      mouseX.set(latestX);
      mouseY.set(latestY);
      rafId = null;
    };

    const showCursor = () => {
      if (cursorVisible) return;
      cursorVisible = true;
      setNativeCursorHidden(true);
      setState("default");
    };

    const onPointerMove = (e: PointerEvent) => {
      if (e.pointerType && e.pointerType !== "mouse") return;

      latestX = e.clientX;
      latestY = e.clientY;
      showCursor();

      if (rafId === null) {
        rafId = requestAnimationFrame(flushPosition);
      }
    };

    const resolveState = (target: EventTarget | null): CursorState => {
      if (!(target instanceof HTMLElement)) {
        return "default";
      }

      if (
        target.closest(
          "a, button, [role='button'], label, summary, select, input[type='checkbox'], input[type='radio'], [tabindex]:not([tabindex='-1'])",
        )
      ) {
        return "link";
      }

      if (target.closest("input, textarea, [contenteditable='true']")) {
        return "text";
      }

      if (target.closest("h1, h2, h3, h4, h5, h6, p, li, blockquote")) {
        return "text";
      }

      return "default";
    };

    const onPointerOver = (e: PointerEvent) => {
      if (e.pointerType && e.pointerType !== "mouse") return;

      if (!cursorVisible) {
        return;
      }

      setState(resolveState(e.target));
    };

    const hideCursor = () => {
      cursorVisible = false;
      setNativeCursorHidden(false);
      setState("idle");
    };

    const onPointerLeaveWindow = (e: MouseEvent) => {
      if (e.relatedTarget === null) {
        hideCursor();
      }
    };

    const onWindowBlur = () => {
      hideCursor();
    };

    const onVisibilityChange = () => {
      if (document.visibilityState !== "visible") {
        hideCursor();
      }
    };

    const onPointerDown = (e: PointerEvent) => {
      if (e.pointerType && e.pointerType !== "mouse") return;

      const nextState = resolveState(e.target);
      if (nextState === "link") {
        setState("link");
      }
    };

    window.addEventListener("pointermove", onPointerMove, { passive: true });
    window.addEventListener("mouseout", onPointerLeaveWindow, { passive: true });
    window.addEventListener("blur", onWindowBlur);
    window.addEventListener("pointerdown", onPointerDown, { passive: true });
    document.addEventListener("visibilitychange", onVisibilityChange);
    document.addEventListener("pointerover", onPointerOver, { passive: true });

    return () => {
      if (rafId !== null) cancelAnimationFrame(rafId);
      setNativeCursorHidden(false);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("mouseout", onPointerLeaveWindow);
      window.removeEventListener("blur", onWindowBlur);
      window.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("visibilitychange", onVisibilityChange);
      document.removeEventListener("pointerover", onPointerOver);
    };
  }, [mouseX, mouseY]);

  if (!mounted) return null;

  const isIdle = state === "idle";
  const isLink = state === "link";
  const isText = state === "text";

  return (
    <>
      {/* Dot — snappy, follows cursor tightly */}
      <motion.div
        aria-hidden
        className="fixed top-0 left-0 pointer-events-none z-[100100]"
        style={{
          x: dotX,
          y: dotY,
          translateX: "-50%",
          translateY: "-50%",
          willChange: "transform",
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

      {/* Ring — lags slightly behind for elegant trail */}
      <motion.div
        aria-hidden
        className="fixed top-0 left-0 pointer-events-none z-[100090]"
        style={{
          x: ringX,
          y: ringY,
          translateX: "-50%",
          translateY: "-50%",
          willChange: "transform",
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
