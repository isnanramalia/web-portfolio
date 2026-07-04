"use client";

let _consolePrinted = false;

import { useCallback, useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { useTheme } from "next-themes";
import { User, Wrench, FolderOpen, MessageCircle, PenLine, Terminal } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Preloader } from "@/components/preloader";
import { Navigation } from "@/components/sections/navigation";
import { Sidebar } from "@/components/sections/sidebar";
import { HeroSection } from "@/components/sections/hero";
import { AboutSection } from "@/components/sections/about";
import { SkillsSection } from "@/components/sections/skills";
import { ProjectsSectionLocal } from "@/components/sections/projects-local";
import { ContactSection } from "@/components/sections/contact";
import { FooterSection } from "@/components/sections/footer";
import { MediumSection } from "@/components/sections/medium";
import { JourneySection } from "@/components/sections/journey";
import { QAPlaygroundSection } from "@/components/sections/qa-playground";
import { useNavigationScrollState } from "@/hooks/use-navigation-scroll-state";
import { QATerminal } from "@/components/qa-terminal";
import type { Certificate, Project, WorkExperience } from "@/lib/data";

const FloatingParticles = dynamic(
  () =>
    import("@/components/floating-particles").then((m) => ({
      default: m.FloatingParticles,
    })),
  { ssr: false },
);

const CustomCursor = dynamic(
  () =>
    import("@/components/custom-cursor").then((m) => ({
      default: m.CustomCursor,
    })),
  { ssr: false },
);

const BackToTop = dynamic(
  () =>
    import("@/components/back-to-top").then((m) => ({
      default: m.BackToTop,
    })),
  { ssr: false },
);

const CommandPalette = dynamic(
  () =>
    import("@/components/command-palette").then((m) => ({
      default: m.CommandPalette,
    })),
  { ssr: false },
);

const BugHunt = dynamic(
  () =>
    import("@/components/bug-hunt").then((m) => ({
      default: m.BugHunt,
    })),
  { ssr: false },
);

const ChaosHud = dynamic(
  () =>
    import("@/components/chaos-hud").then((m) => ({
      default: m.ChaosHud,
    })),
  { ssr: false },
);


type SkillItem = {
  name: string;
  logo: string;
};

interface PortfolioClientProps {
  education: Array<{
    degree: string;
    institution: string;
    period: string;
    description: string;
  }>;
  workExperience: WorkExperience[];
  skillsData: SkillItem[];
  projects: Project[];
  certificates: Certificate[];
  /** If provided, the portfolio scrolls to this section after the preloader exits */
  initialSection?: string;
}

type IdleWindow = Window & {
  requestIdleCallback?: (
    callback: IdleRequestCallback,
    options?: IdleRequestOptions,
  ) => number;
  cancelIdleCallback?: (handle: number) => void;
};

const SECTION_PATHS: Record<string, string> = {
  about: "/about",
  skills: "/skills",
  projects: "/projects",
  writing: "/writing",
  contact: "/contact",
};

export function PortfolioClient({
  education,
  workExperience,
  skillsData,
  projects,
  certificates,
  initialSection,
}: PortfolioClientProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [introComplete, setIntroComplete] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [decorationsReady, setDecorationsReady] = useState(false);
  const [pointerDecorationsReady, setPointerDecorationsReady] = useState(false);
  const [cmdOpen, setCmdOpen] = useState(false);
  const [cmdLoaded, setCmdLoaded] = useState(false);
  const { theme, setTheme } = useTheme();

  // Custom states for Dual-Screen layout
  const [isMobile, setIsMobile] = useState(false);
  const [terminalOpen, setTerminalOpen] = useState(false);
  const { activeSection } = useNavigationScrollState();

  const openCommand = useCallback(() => {
    setCmdLoaded(true);
    setCmdOpen((prev) => !prev);
  }, []);

  useEffect(() => {
    setMounted(true);

    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    const media = window.matchMedia("(pointer: fine)");
    const syncPointerDecorations = () => {
      setPointerDecorationsReady(media.matches);
    };

    syncPointerDecorations();

    if (!_consolePrinted) {
      _consolePrinted = true;
      /* eslint-disable no-console */
      console.log(
        "%c  ISNA NUR AMALIA  ",
        "background:#0b1957;color:#f8f3ea;font-size:22px;font-weight:900;padding:14px 32px;letter-spacing:4px;",
      );
      console.log(
        "%c  Quality Assurance  ·  Frontend Developer  ",
        "background:#9eccfa;color:#0b1957;font-size:12px;font-weight:700;padding:7px 32px;letter-spacing:1px;",
      );
      console.log(
        "\n%c  📧 isnanuramalia13@gmail.com   🐙 github.com/isnanramalia   💼 linkedin.com/in/isnanramalia  \n",
        "color:#4a5568;font-size:11px;font-family:monospace;",
      );
      console.log(
        "%c  ⌨️  Ctrl+K  /  ⌘K  — quick navigation  ",
        "background:#f8f3ea;color:#0b1957;font-size:10px;font-style:italic;padding:4px 32px;",
      );
      /* eslint-enable no-console */
    }

    if (typeof media.addEventListener === "function") {
      media.addEventListener("change", syncPointerDecorations);
      return () => {
        media.removeEventListener("change", syncPointerDecorations);
        window.removeEventListener("resize", checkMobile);
      };
    }

    media.addListener(syncPointerDecorations);
    return () => {
      media.removeListener(syncPointerDecorations);
      window.removeEventListener("resize", checkMobile);
    };
  }, []);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        openCommand();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [openCommand]);

  // Lock body scroll when mobile terminal drawer is open
  useEffect(() => {
    if (isMobile && terminalOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [terminalOpen, isMobile]);

  useEffect(() => {
    if (!introComplete) return;

    const win = window as IdleWindow;
    let timeoutId: ReturnType<typeof setTimeout> | null = null;
    let idleId: number | null = null;

    const enableDecorations = () => {
      setDecorationsReady(true);
    };

    if (typeof win.requestIdleCallback === "function") {
      idleId = win.requestIdleCallback(enableDecorations, { timeout: 1500 });
    } else {
      timeoutId = setTimeout(enableDecorations, 800);
    }

    return () => {
      if (idleId !== null && typeof win.cancelIdleCallback === "function") {
        win.cancelIdleCallback(idleId);
      }
      if (timeoutId !== null) clearTimeout(timeoutId);
    };
  }, [introComplete]);

  const scrollToSection = useCallback((sectionId: string) => {
    const element = document.getElementById(sectionId);
    const container = document.getElementById("top-screen-scroll-container");
    const navHeight = 80;

    if (element) {
      if (container) {
        const containerRect = container.getBoundingClientRect();
        const elementRect = element.getBoundingClientRect();
        const relativeTop = elementRect.top - containerRect.top + container.scrollTop;
        const pos = relativeTop - navHeight;

        container.scrollTo({ top: Math.max(0, pos), behavior: "smooth" });
      } else {
        const pos = element.getBoundingClientRect().top + window.scrollY - navHeight;
        window.scrollTo({ top: Math.max(0, pos), behavior: "smooth" });
      }

      // pushState so browser back/forward works per section
      const newPath = SECTION_PATHS[sectionId];
      if (newPath && window.location.pathname !== newPath) {
        window.history.pushState({ section: sectionId }, "", newPath);
      }
    }
    setMobileMenuOpen(false);
  }, []);

  const scrollToHero = useCallback(() => {
    const container = document.getElementById("top-screen-scroll-container");
    if (container) {
      container.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
    
    if (window.location.pathname !== "/") {
      window.history.pushState(null, "", "/");
    }
    setMobileMenuOpen(false);
  }, []);

  // Handle browser back/forward navigation
  useEffect(() => {
    const handlePopState = () => {
      const MAP: Record<string, string> = {
        "/": "about",
        "/about": "about",
        "/skills": "skills",
        "/projects": "projects",
        "/writing": "writing",
        "/contact": "contact",
      };
      const target = MAP[window.location.pathname] ?? "about";
      const el = document.getElementById(target);
      const container = document.getElementById("top-screen-scroll-container");
      if (el) {
        if (container) {
          const containerRect = container.getBoundingClientRect();
          const elRect = el.getBoundingClientRect();
          const relativeTop = elRect.top - containerRect.top + container.scrollTop;
          const pos = relativeTop - 80;
          container.scrollTo({ top: Math.max(0, pos), behavior: "smooth" });
        } else {
          const pos = el.getBoundingClientRect().top + window.scrollY - 80;
          window.scrollTo({ top: Math.max(0, pos), behavior: "smooth" });
        }
      }
    };
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  // Scroll to initialSection once the preloader exits
  useEffect(() => {
    if (!introComplete || !initialSection) return;
    const timer = setTimeout(() => {
      const el = document.getElementById(initialSection);
      const container = document.getElementById("top-screen-scroll-container");
      if (el) {
        if (container) {
          const containerRect = container.getBoundingClientRect();
          const elRect = el.getBoundingClientRect();
          const relativeTop = elRect.top - containerRect.top + container.scrollTop;
          const pos = relativeTop - 80;
          container.scrollTo({ top: Math.max(0, pos), behavior: "smooth" });
        } else {
          const pos = el.getBoundingClientRect().top + window.scrollY - 80;
          window.scrollTo({ top: Math.max(0, pos), behavior: "smooth" });
        }
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [introComplete, initialSection]);

  const navigationItems = [
    { id: "about", label: "About", icon: User },
    { id: "skills", label: "Skills", icon: Wrench },
    { id: "projects", label: "Projects", icon: FolderOpen },
    { id: "writing", label: "Writing", icon: PenLine },
    { id: "contact", label: "Contact", icon: MessageCircle },
  ];

  if (!mounted) {
    return <div className="fixed inset-0 bg-background" />;
  }

  return (
    <>
      <Preloader onComplete={() => setIntroComplete(true)} />

      {!isMobile ? (
        /* Desktop Dual-Screen Layout */
        <div className="h-screen w-screen overflow-hidden flex flex-col bg-background text-foreground transition-colors duration-300">
          {decorationsReady && <FloatingParticles />}
          {pointerDecorationsReady && <CustomCursor />}
          {decorationsReady && pointerDecorationsReady && <BugHunt />}
          <ChaosHud />

          {cmdLoaded && (
            <CommandPalette
              open={cmdOpen}
              onClose={() => setCmdOpen(false)}
              scrollToSection={scrollToSection}
            />
          )}

          {/* Top Screen (60% height) */}
          <div className="h-[60vh] min-h-[60vh] w-full relative overflow-hidden flex flex-col border-b border-border shadow-md bg-muted/40 dark:bg-zinc-900/40">
            <Navigation
              mobileMenuOpen={mobileMenuOpen}
              setMobileMenuOpen={setMobileMenuOpen}
              theme={theme}
              setTheme={setTheme}
              navigationItems={navigationItems}
              scrollToSection={scrollToSection}
              scrollToHero={scrollToHero}
              onOpenCommand={openCommand}
            />

            <div className="mx-auto w-full max-w-5xl flex flex-1 overflow-hidden relative bg-background border-x border-border/40 shadow-inner">
              <Sidebar scrollToSection={scrollToSection} />

              <div 
                id="top-screen-scroll-container"
                className="w-full lg:ml-[35%] lg:w-[65%] h-full overflow-y-auto relative z-10 scroll-smooth pt-16"
              >
                {decorationsReady && <BackToTop />}
                
                <HeroSection
                  scrollToSection={scrollToSection}
                  startAnimations={introComplete}
                />

                <AboutSection
                  education={education}
                  workExperience={workExperience}
                  certificates={certificates}
                />

                <JourneySection />

                <SkillsSection skillsData={skillsData} />

                <ProjectsSectionLocal projects={projects} />

                <QAPlaygroundSection />

                <MediumSection />

                <ContactSection />

                <FooterSection />
              </div>
            </div>
          </div>

          {/* Bottom Screen (40% height) */}
          <div className="h-[40vh] min-h-[40vh] w-full overflow-hidden shrink-0">
            <QATerminal activeSection={activeSection} />
          </div>
        </div>
      ) : (
        /* Mobile Standard Layout */
        <div className="min-h-screen bg-background text-foreground transition-colors duration-300 pb-20">
          {decorationsReady && <FloatingParticles />}
          {decorationsReady && <BackToTop />}
          {pointerDecorationsReady && <CustomCursor />}
          {decorationsReady && pointerDecorationsReady && <BugHunt />}
          <ChaosHud />

          {cmdLoaded && (
            <CommandPalette
              open={cmdOpen}
              onClose={() => setCmdOpen(false)}
              scrollToSection={scrollToSection}
            />
          )}

          <Navigation
            mobileMenuOpen={mobileMenuOpen}
            setMobileMenuOpen={setMobileMenuOpen}
            theme={theme}
            setTheme={setTheme}
            navigationItems={navigationItems}
            scrollToSection={scrollToSection}
            scrollToHero={scrollToHero}
            onOpenCommand={openCommand}
          />

          <div className="flex pt-16">
            <div className="w-full relative z-10">
              <HeroSection
                scrollToSection={scrollToSection}
                startAnimations={introComplete}
              />

              <AboutSection
                education={education}
                workExperience={workExperience}
                certificates={certificates}
              />

              <JourneySection />

              <SkillsSection skillsData={skillsData} />

              <ProjectsSectionLocal projects={projects} />

              <QAPlaygroundSection />

              <MediumSection />

              <ContactSection />

              <FooterSection />
            </div>
          </div>

          {/* Floating Action Button for Terminal */}
          <button
            onClick={() => setTerminalOpen(true)}
            className="fixed bottom-6 right-4 sm:right-6 z-40 w-12 h-12 rounded-full bg-[#1a1b26] text-white border-2 border-foreground shadow-lg flex items-center justify-center hover:scale-110 active:scale-95 transition-all"
            style={{
              borderRadius: "20px 8px 20px 10px / 10px 20px 8px 24px",
              boxShadow: "3px 3px 0 rgba(0,0,0,0.15)",
            }}
          >
            <Terminal className="w-5 h-5 text-[#7aa2f7] animate-pulse" />
          </button>

          {/* Mobile Terminal Sheet Drawer */}
          <AnimatePresence>
            {terminalOpen && (
              <>
                {/* Backdrop */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 0.5 }}
                  exit={{ opacity: 0 }}
                  onClick={() => setTerminalOpen(false)}
                  className="fixed inset-0 bg-black/60 z-40"
                />

                {/* Bottom Sheet */}
                <motion.div
                  initial={{ y: "100%" }}
                  animate={{ y: 0 }}
                  exit={{ y: "100%" }}
                  transition={{ type: "spring", damping: 25, stiffness: 200 }}
                  className="fixed bottom-0 left-0 right-0 h-[60vh] rounded-t-2xl overflow-hidden z-50 border-t-2 border-foreground"
                >
                  <QATerminal
                    activeSection={activeSection}
                    isMobileDrawer={true}
                    onCloseMobile={() => setTerminalOpen(false)}
                  />
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>
      )}
    </>
  );
}
