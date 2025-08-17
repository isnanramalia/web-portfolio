"use client";

import { useState, useEffect } from "react";
import { useScroll, useTransform } from "framer-motion";
import { useTheme } from "next-themes";
import { User, Wrench, FolderOpen, MessageCircle } from "lucide-react";
import { FloatingParticles } from "@/components/floating-particles";
import { ProjectDialog } from "@/components/project-dialog";
import { Preloader } from "@/components/preloader";
import { Navigation } from "@/components/sections/navigation";
import { Sidebar } from "@/components/sections/sidebar";
import { HeroSection } from "@/components/sections/hero";
import { AboutSection } from "@/components/sections/about";
import { SkillsSection } from "@/components/sections/skills";
import { ProjectsSection } from "@/components/sections/projects";
import { ContactSection } from "@/components/sections/contact";
import { FooterSection } from "@/components/sections/footer";
import { education, workExperience, skillsData, projects } from "@/lib/data";
import { useScrollDetection } from "@/hooks/use-scroll-detection";

export default function Portfolio() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<any>(null);
  const [projectDialogOpen, setProjectDialogOpen] = useState(false);
  const [expandedJob, setExpandedJob] = useState<number | null>(null);
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  const { scrolled, activeSection } = useScrollDetection();
  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);

  useEffect(() => {
    setMounted(true);
  }, []);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      const navHeight = 80;
      const elementPosition = element.offsetTop - navHeight;
      window.scrollTo({
        top: elementPosition,
        behavior: "smooth",
      });
    }
    setMobileMenuOpen(false);
  };

  const scrollToHero = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
    setMobileMenuOpen(false);
  };

  const handleProjectClick = (project: any) => {
    setSelectedProject(project);
    setProjectDialogOpen(true);
  };

  const handleJobExpand = (index: number) => {
    setExpandedJob(expandedJob === index ? null : index);
  };

  // Navigation items without Home
  const navigationItems = [
    { id: "about", label: "About", icon: User },
    { id: "skills", label: "Skills", icon: Wrench },
    { id: "projects", label: "Projects", icon: FolderOpen },
    { id: "contact", label: "Contact", icon: MessageCircle },
  ];

  if (!mounted) {
    return <Preloader />;
  }

  return (
    <>
      <Preloader />
      <div className="min-h-screen bg-background text-foreground transition-colors duration-300">
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

          {/* Main Content Area */}
          <div className="w-full lg:ml-[35%] lg:w-[65%] min-h-screen relative z-10">
            <div className="pt-16">
              <HeroSection y={y} scrollToSection={scrollToSection} />

              <AboutSection
                education={education}
                workExperience={workExperience}
                expandedJob={expandedJob}
                handleJobExpand={handleJobExpand}
              />

              <SkillsSection skillsData={skillsData} />

              <ProjectsSection
                projects={projects}
                handleProjectClick={handleProjectClick}
              />

              <ContactSection />

              <FooterSection />
            </div>
          </div>
        </div>

        <ProjectDialog
          project={selectedProject}
          open={projectDialogOpen}
          onOpenChange={setProjectDialogOpen}
          layoutId={
            selectedProject ? `project-${selectedProject.title}` : undefined
          }
        />
      </div>
    </>
  );
}
