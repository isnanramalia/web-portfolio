import { useEffect, useState } from "react";

export function useNavigationScrollState() {
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState("about");

  useEffect(() => {
    const sections = ["about", "skills", "projects", "writing", "contact"];
    let sectionEls: Array<{ id: string; el: HTMLElement }> = [];
    let rafId: number | null = null;

    const cacheElements = () => {
      sectionEls = sections.flatMap((id) => {
        const el = document.getElementById(id);
        return el ? [{ id, el }] : [];
      });
    };

    const readScrollState = () => {
      if (sectionEls.length === 0) cacheElements();

      const scrollY = window.scrollY;
      const nextScrolled = scrollY > 50;
      const scrollPosition = scrollY + 150;
      let nextSection = "about";

      for (const { id, el } of sectionEls) {
        if (
          scrollPosition >= el.offsetTop &&
          scrollPosition < el.offsetTop + el.offsetHeight
        ) {
          nextSection = id;
          break;
        }
      }

      setScrolled((prev) => (prev === nextScrolled ? prev : nextScrolled));
      setActiveSection((prev) => (prev === nextSection ? prev : nextSection));
      rafId = null;
    };

    const handleScroll = () => {
      if (rafId !== null) return;
      rafId = requestAnimationFrame(readScrollState);
    };

    cacheElements();
    readScrollState();

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (rafId !== null) cancelAnimationFrame(rafId);
    };
  }, []);

  return { scrolled, activeSection };
}
