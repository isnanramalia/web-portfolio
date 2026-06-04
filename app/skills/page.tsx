import type { Metadata } from "next";
import { PortfolioClient } from "@/components/portfolio-client";
import {
  education,
  workExperience,
  skillsData,
  projects,
  certificates,
} from "@/lib/data";
import { buildSectionMetadata } from "@/lib/section-metadata";

export const metadata: Metadata = buildSectionMetadata("skills");

export default function SkillsPage() {
  return (
    <PortfolioClient
      education={education}
      workExperience={workExperience}
      skillsData={skillsData}
      projects={projects}
      certificates={certificates}
      initialSection="skills"
    />
  );
}
