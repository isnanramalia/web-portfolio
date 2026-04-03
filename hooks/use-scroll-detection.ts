import { useState, useEffect } from "react";

export function useScrollDetection() {
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState("about");

  useEffect(() => {
    const SECTIONS = ["about", "skills", "projects", "writing", "contact"];

    let sectionEls: Array<{ id: string; el: HTMLElement }> = [];

    const cacheElements = () => {
      sectionEls = SECTIONS.flatMap((id) => {
        const el = document.getElementById(id);
        return el ? [{ id, el }] : [];
      });
    };

    const handleScroll = () => {
      // Lazily repopulate if empty — sections may not be in the DOM yet
      // when the effect first runs (page.tsx defers render until after hydration)
      if (sectionEls.length === 0) cacheElements();

      const scrollY = window.scrollY;
      setScrolled(scrollY > 50);

      const scrollPosition = scrollY + 150;
      let currentSection = "about";

      for (const { id, el } of sectionEls) {
        if (
          scrollPosition >= el.offsetTop &&
          scrollPosition < el.offsetTop + el.offsetHeight
        ) {
          currentSection = id;
          break;
        }
      }

      setActiveSection(currentSection);
    };

    cacheElements();
    handleScroll();

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return { scrolled, activeSection };
}
