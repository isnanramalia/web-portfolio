"use client";

import { motion } from "framer-motion";
import { ExternalLink, Award } from "lucide-react";
import type { WorkExperience, Certificate } from "@/lib/data";
import { InteractiveTimeline } from "@/components/effects/interactive-timeline";

interface Education {
  degree: string;
  institution: string;
  period: string;
  description: string;
}

interface AboutSectionProps {
  education: Education[];
  workExperience: WorkExperience[];
  certificates: Certificate[];
}

const CERT_CATEGORY: Record<
  Certificate["category"],
  { label: string; className: string }
> = {
  qa: {
    label: "QA & Testing",
    className:
      "text-purple-600 dark:text-purple-400 bg-purple-500/10 border-purple-500/20",
  },
  frontend: {
    label: "Frontend",
    className:
      "text-blue-600 dark:text-blue-400 bg-blue-500/10 border-blue-500/20",
  },
  design: {
    label: "Design",
    className:
      "text-pink-600 dark:text-pink-400 bg-pink-500/10 border-pink-500/20",
  },
  other: {
    label: "Other",
    className: "text-muted-foreground bg-accent border-border",
  },
};

export function AboutSection({
  education,
  workExperience,
  certificates,
}: AboutSectionProps) {
  return (
    <motion.section
      id="about"
      className="px-4 sm:px-6 lg:px-12 py-8 lg:py-16"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      viewport={{ once: true }}
    >
      <div className="max-w-4xl mx-auto">
        <div className="mb-12">
          <motion.h2
            className="text-2xl font-medium mb-6 flex items-center text-foreground doodle-section-heading"
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4 }}
            viewport={{ once: true }}
          >
            Educational Background
          </motion.h2>
          <div className="space-y-6">
            {education.map((edu, index) => (
              <motion.div
                key={index}
                className="p-6 glass-card glass-card-hover rounded-2xl smooth-hover"
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <div className="flex items-start justify-between mb-2">
                  <h4 className="text-lg font-medium text-card-foreground">
                    {edu.degree}
                  </h4>
                  <span className="text-xs text-muted-foreground font-medium bg-accent px-3 py-1 rounded-xl whitespace-nowrap ml-2 flex-shrink-0">
                    {edu.period}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground mb-2">
                  {edu.institution}
                </p>
                <p className="text-sm text-muted-foreground">
                  {edu.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>

        <div className="mb-12">
          <motion.h2
            className="text-2xl font-medium mb-6 flex items-center text-foreground doodle-section-heading"
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4 }}
            viewport={{ once: true }}
          >
            Working Experience
          </motion.h2>

          <InteractiveTimeline workExperience={workExperience} />
        </div>

        {certificates.length > 0 && (
          <div>
            <div className="flex items-end justify-between mb-6">
              <motion.h2
                className="text-2xl font-medium text-foreground doodle-section-heading"
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4 }}
                viewport={{ once: true }}
              >
                Certificates
              </motion.h2>

              <motion.a
                href="https://www.linkedin.com/in/isnanramalia/details/certifications/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground hover:font-semibold transition-all shrink-0 group"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ duration: 0.4, delay: 0.1 }}
                viewport={{ once: true }}
              >
                View all
                <ExternalLink className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </motion.a>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {certificates.map((cert, idx) => {
                const catConfig = CERT_CATEGORY[cert.category];
                return (
                  <motion.div
                    key={idx}
                    className="flex items-start gap-4 p-5 glass-card glass-card-hover rounded-2xl smooth-hover"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: idx * 0.08 }}
                    viewport={{ once: true }}
                  >
                    <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-card border border-border shadow-sm flex items-center justify-center overflow-hidden">
                      {cert.logoUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={cert.logoUrl}
                          alt={cert.issuer}
                          width={48}
                          height={48}
                          className="w-full h-full object-contain p-1.5"
                          loading="lazy"
                        />
                      ) : (
                        <Award className="w-5 h-5 text-muted-foreground" />
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <h4 className="text-sm font-semibold text-card-foreground leading-snug">
                          {cert.title}
                        </h4>
                        <span
                          className={`text-xs font-medium px-2 py-0.5 rounded-full border flex-shrink-0 ${catConfig.className}`}
                        >
                          {catConfig.label}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {cert.issuer}
                      </p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {cert.date}
                      </p>
                      {cert.credentialId && (
                        <p className="text-xs text-muted-foreground/60 mt-0.5 font-mono tracking-tight">
                          ID: {cert.credentialId}
                        </p>
                      )}
                      {cert.credentialUrl && (
                        <a
                          href={cert.credentialUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-xs text-primary hover:font-semibold mt-2 transition-all group"
                        >
                          View Certificate
                          <ExternalLink className="w-3 h-3 flex-shrink-0 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                        </a>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </motion.section>
  );
}
