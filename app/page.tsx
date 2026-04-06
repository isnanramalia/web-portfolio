import { PortfolioClient } from "@/components/portfolio-client";
import {
  education,
  workExperience,
  skillsData,
  projects,
  certificates,
} from "@/lib/data";

export default function PortfolioPage() {
  return (
    <PortfolioClient
      education={education}
      workExperience={workExperience}
      skillsData={skillsData}
      projects={projects}
      certificates={certificates}
    />
  );
}
