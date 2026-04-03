"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
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
import { useScrollDetection } from "@/hooks/use-scroll-detection";

// Heavy client-only components — loaded after hydration, not in initial bundle
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

export default function Portfolio() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [projectDialogOpen, setProjectDialogOpen] = useState(false);
  const [expandedJob, setExpandedJob] = useState<string | null>(null);
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  const { scrolled, activeSection } = useScrollDetection();

  useEffect(() => {
    setMounted(true);
  }, []);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      const navHeight = 80;
      const elementPosition = element.offsetTop - navHeight;
      window.scrollTo({ top: elementPosition, behavior: "smooth" });
    }
    setMobileMenuOpen(false);
  };

  const scrollToHero = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    setMobileMenuOpen(false);
  };

  const handleProjectClick = (project: Project) => {
    setSelectedProject(project);
    setProjectDialogOpen(true);
  };

  const handleJobExpand = (key: string) => {
    setExpandedJob(expandedJob === key ? null : key);
  };

  const navigationItems = [
    { id: "about", label: "About", icon: User },
    { id: "skills", label: "Skills", icon: Wrench },
    { id: "projects", label: "Projects", icon: FolderOpen },
    { id: "writing", label: "Writing", icon: PenLine },
    { id: "contact", label: "Contact", icon: MessageCircle },
  ];

  // Before hydration: show a plain background-colored screen so the
  // Preloader in the main render is the ONE and ONLY instance — no double
  // mount and no duplicate animation start.
  if (!mounted) {
    return <div className="fixed inset-0 bg-background" />;
  }

  return (
    <>
      <Preloader />
      <div className="min-h-screen bg-background text-foreground transition-colors duration-300">
        <CustomCursor />
        <FloatingParticles />

        <Navigation
          scrolled={scrolled}
          mobileMenuOpen={mobileMenuOpen}
          setMobileMenuOpen={setMobileMenuOpen}
          activeSection={activeSection}
          theme={theme}
          setTheme={setTheme}
          navigationItems={navigationItems}
          scrollToSection={scrollToSection}
          scrollToHero={scrollToHero}
        />

        <div className="flex">
          <Sidebar scrollToSection={scrollToSection} />

          <div className="w-full lg:ml-[35%] lg:w-[65%] min-h-screen relative z-10">
            <div className="pt-16">
              <HeroSection scrollToSection={scrollToSection} />

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
