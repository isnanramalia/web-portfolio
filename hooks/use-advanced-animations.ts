import { useEffect, useRef, useState } from "react";
import { useMotionValue, useSpring, MotionValue } from "framer-motion";

// Hook for magnetic effect on elements
export const useMagneticEffect = (
  strength: number = 0.3,
): {
  ref: React.RefObject<HTMLElement>;
  x: MotionValue<number>;
  y: MotionValue<number>;
} => {
  const ref = useRef<HTMLElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const springX = useSpring(x, { damping: 20, stiffness: 300 });
  const springY = useSpring(y, { damping: 20, stiffness: 300 });

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    let latestEvent: MouseEvent | null = null;
    let rafId: number | null = null;

    const handleMouseMove = (e: MouseEvent) => {
      latestEvent = e;
      if (rafId !== null) return;
      rafId = requestAnimationFrame(() => {
        if (latestEvent) {
          const rect = element.getBoundingClientRect();
          const centerX = rect.left + rect.width / 2;
          const centerY = rect.top + rect.height / 2;
          x.set((latestEvent.clientX - centerX) * strength);
          y.set((latestEvent.clientY - centerY) * strength);
        }
        rafId = null;
      });
    };

    const handleMouseLeave = () => {
      x.set(0);
      y.set(0);
    };

    element.addEventListener("mousemove", handleMouseMove, { passive: true });
    element.addEventListener("mouseleave", handleMouseLeave, { passive: true });

    return () => {
      if (rafId !== null) cancelAnimationFrame(rafId);
      element.removeEventListener("mousemove", handleMouseMove);
      element.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [x, y, strength]);

  return { ref, x: springX, y: springY };
};

// Hook for parallax scrolling effect
export const useParallaxScroll = (offset: number = 0.5) => {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const updateScrollY = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", updateScrollY, { passive: true });
    return () => window.removeEventListener("scroll", updateScrollY);
  }, []);

  return scrollY * offset;
};

// Hook for element intersection with advanced options.
// Automatically disconnects after the first intersection (once semantics)
// so the observer does not keep running for the lifetime of the component.
export const useIntersectionObserver = (
  threshold: number = 0.1,
  rootMargin: string = "0px",
) => {
  const [isIntersecting, setIsIntersecting] = useState(false);
  const [hasIntersected, setHasIntersected] = useState(false);
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsIntersecting(entry.isIntersecting);
        if (entry.isIntersecting) {
          setHasIntersected(true);
          // Disconnect immediately after the first trigger — no need to keep
          // observing since hasIntersected is a one-way flag.
          observer.disconnect();
        }
      },
      { threshold, rootMargin },
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, [threshold, rootMargin]);

  return { ref, isIntersecting, hasIntersected };
};
