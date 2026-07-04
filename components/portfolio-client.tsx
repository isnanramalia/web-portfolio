"use client";

let _consolePrinted = false;

import { useCallback, useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { useTheme } from "next-themes";
import { User, Wrench, FolderOpen, MessageCircle, PenLine } from "lucide-react";
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
import type {
  Certificate,
  Project,
  WorkExperience,
} from "@/lib/data";

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
}

type IdleWindow = Window & {
  requestIdleCallback?: (
    callback: IdleRequestCallback,
    options?: IdleRequestOptions,
  ) => number;
  cancelIdleCallback?: (handle: number) => void;
};

export function PortfolioClient({
  education,
  workExperience,
  skillsData,
  projects,
  certificates,
}: PortfolioClientProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [introComplete, setIntroComplete] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [decorationsReady, setDecorationsReady] = useState(false);
  const [pointerDecorationsReady, setPointerDecorationsReady] = useState(false);
  const [cmdOpen, setCmdOpen] = useState(false);
  const [cmdLoaded, setCmdLoaded] = useState(false);
  const { theme, setTheme } = useTheme();

  const openCommand = useCallback(() => {
    setCmdLoaded(true);
    setCmdOpen((prev) => !prev);
  }, []);

  useEffect(() => {
    setMounted(true);

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
      return () => media.removeEventListener("change", syncPointerDecorations);
    }

    media.addListener(syncPointerDecorations);
    return () => media.removeListener(syncPointerDecorations);
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
    if (element) {
      const navHeight = 80;
      const elementPosition = element.offsetTop - navHeight;
      window.scrollTo({ top: elementPosition, behavior: "smooth" });
    }
    setMobileMenuOpen(false);
  }, []);

  const scrollToHero = useCallback(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    setMobileMenuOpen(false);
  }, []);

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

      <div className="min-h-screen bg-background text-foreground transition-colors duration-300">
        {decorationsReady && <FloatingParticles />}
        {decorationsReady && <BackToTop />}
        {pointerDecorationsReady && <CustomCursor />}
        {decorationsReady && pointerDecorationsReady && <BugHunt />}

        {/* Chaos Sandbox HUD — always mounted, self-manages visibility via phase state */}
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

        <div className="flex">
          <Sidebar scrollToSection={scrollToSection} />

          <div className="w-full lg:ml-[35%] lg:w-[65%] min-h-screen relative z-10">
            <div className="pt-16">
              <HeroSection
                scrollToSection={scrollToSection}
                startAnimations={introComplete}
              />

              <AboutSection
                education={education}
                workExperience={workExperience}
                certificates={certificates}
              />

              <SkillsSection skillsData={skillsData} />

              <ProjectsSectionLocal projects={projects} />

              <MediumSection />

              <ContactSection />

              <FooterSection />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
