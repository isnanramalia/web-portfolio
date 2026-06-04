"use client";

import { useCallback, useEffect, useRef, useState } from "react";

const SECTIONS = ["about", "skills", "projects", "writing", "contact"] as const;

/** Pixels from the top of the viewport that count as "in" a section */
const NAV_HEIGHT = 80;

const SECTION_PATHS: Record<string, string> = {
  about: "/about",
  skills: "/skills",
  projects: "/projects",
  writing: "/writing",
  contact: "/contact",
};

/** Parse a pathname like "/projects" → "projects". Falls back to "about". */
function sectionFromPathname(pathname: string): string {
  const map: Record<string, string> = {
    "/about": "about",
    "/skills": "skills",
    "/projects": "projects",
    "/writing": "writing",
    "/contact": "contact",
  };
  return map[pathname] ?? "about";
}

export function useNavigationScrollState() {
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState("about");

  // Refs avoid stale closures and prevent redundant state updates
  const activeSectionRef = useRef("about");
  const rafId = useRef<number | null>(null);
  const sectionElsRef = useRef<Array<{ id: string; el: HTMLElement }>>([]);

  /**
   * Gate: don't update the URL for the first 800 ms.
   * This prevents the scroll-spy from immediately overriding the URL on a
   * deep-linked page load (e.g. visiting /projects puts the page at y=0,
   * which would otherwise snap the URL back to /about).
   */
  const urlUpdateEnabled = useRef(false);

  const cacheElements = useCallback(() => {
    sectionElsRef.current = SECTIONS.flatMap((id) => {
      const el = document.getElementById(id);
      return el ? [{ id, el }] : [];
    });
  }, []);

  // ── One-time mount effect: seed state from URL + arm the URL gate ────────
  useEffect(() => {
    const urlSection = sectionFromPathname(window.location.pathname);
    activeSectionRef.current = urlSection;
    setActiveSection(urlSection);

    const t = setTimeout(() => {
      urlUpdateEnabled.current = true;
    }, 800);

    return () => clearTimeout(t);
  }, []); // intentionally empty dep array — runs once

  // ── Scroll listener ──────────────────────────────────────────────────────
  useEffect(() => {
    cacheElements();

    const readScrollState = () => {
      if (sectionElsRef.current.length === 0) cacheElements();

      const scrollY = window.scrollY;
      const nextScrolled = scrollY > 50;

      // "Active" = the last section whose document-top is at or above the
      // detection threshold (viewport top + nav height + small buffer).
      const threshold = scrollY + NAV_HEIGHT + 40;
      let nextSection = SECTIONS[0] as string;

      for (const { id, el } of sectionElsRef.current) {
        const elDocTop = el.getBoundingClientRect().top + scrollY;
        if (threshold >= elDocTop) {
          nextSection = id;
        }
      }

      setScrolled((prev) => (prev === nextScrolled ? prev : nextScrolled));

      if (activeSectionRef.current !== nextSection) {
        activeSectionRef.current = nextSection;
        setActiveSection(nextSection);

        // Only sync the URL after the initial-load gate has lifted
        if (urlUpdateEnabled.current) {
          const newPath =
            nextSection === "about" ? "/" : (SECTION_PATHS[nextSection] ?? "/");
          if (window.location.pathname !== newPath) {
            window.history.replaceState({ section: nextSection }, "", newPath);
          }
        }
      }

      rafId.current = null;
    };

    const handleScroll = () => {
      if (rafId.current !== null) return;
      rafId.current = requestAnimationFrame(readScrollState);
    };

    cacheElements();
    readScrollState();

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (rafId.current !== null) cancelAnimationFrame(rafId.current);
    };
  }, [cacheElements]);

  return { scrolled, activeSection };
}
