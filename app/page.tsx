"use client";

let _consolePrinted = false;

import { useState, useEffect, useCallback } from "react";
import dynamic from "next/dynamic";
import { BackToTop } from "@/components/back-to-top";
import { useTheme } from "next-themes";
import { User, Wrench, FolderOpen, MessageCircle, PenLine } from "lucide-react";
import { Preloader } from "@/components/preloader";
import { Navigation } from "@/components/sections/navigation";
import { Sidebar } from "@/components/sections/sidebar";
import { HeroSection } from "@/components/sections/hero";
import { AboutSection } from "@/components/sections/about";
import { SkillsSection } from "@/components/sections/skills";
import { ProjectsSection } from "@/components/sections/projects";
import { ContactSection } from "@/components/sections/contact";
import { FooterSection } from "@/components/sections/footer";
import { MediumSection } from "@/components/sections/medium";
import {
  education,
  workExperience,
  skillsData,
  projects,
  certificates,
  type Project,
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

const ProjectDialog = dynamic(
  () =>
    import("@/components/project-dialog").then((m) => ({
      default: m.ProjectDialog,
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

export default function Portfolio() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [projectDialogOpen, setProjectDialogOpen] = useState(false);
  const [expandedJob, setExpandedJob] = useState<string | null>(null);
  const [introComplete, setIntroComplete] = useState(false);
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  const [cmdOpen, setCmdOpen] = useState(false);
  const [cmdLoaded, setCmdLoaded] = useState(false);
  const openCommand = useCallback(() => {
    setCmdLoaded(true);
    setCmdOpen((prev) => !prev);
  }, []);

  useEffect(() => {
    setMounted(true);

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
  }, []);

  // ── Ctrl+K / ⌘K global shortcut ────────────────────────────────────────
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

  // ── Page helpers ────────────────────────────────────────────────────────
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

  const handleProjectClick = useCallback((project: Project) => {
    setSelectedProject(project);
    setProjectDialogOpen(true);
  }, []);

  const handleJobExpand = useCallback(
    (key: string) => {
      setExpandedJob(expandedJob === key ? null : key);
    },
    [expandedJob],
  );

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
        <CustomCursor />
        <FloatingParticles />
        <BackToTop />
        <BugHunt />

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
                expandedJob={expandedJob}
                handleJobExpand={handleJobExpand}
                certificates={certificates}
              />

              <SkillsSection skillsData={skillsData} />

              <ProjectsSection
                projects={projects}
                handleProjectClick={handleProjectClick}
              />

              <MediumSection />

              <ContactSection />

              <FooterSection />
            </div>
          </div>
        </div>

        <ProjectDialog
          project={selectedProject}
          open={projectDialogOpen}
          onOpenChange={setProjectDialogOpen}
        />
      </div>
    </>
  );
}
