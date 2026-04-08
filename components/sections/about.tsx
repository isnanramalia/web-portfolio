"use client";

import { useCallback, useState } from "react";
import { motion } from "framer-motion";
import { ChevronDown, ChevronUp, ExternalLink, Award } from "lucide-react";
import Image from "next/image";
import type { WorkExperience, Certificate } from "@/lib/data";

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

function ActiveDot({ small = false }: { small?: boolean }) {
  const sz = small ? "h-2.5 w-2.5" : "h-3 w-3";
  return (
    <span className={`relative flex ${sz}`}>
      <span
        className={`animate-ping absolute inline-flex ${sz} rounded-full bg-primary opacity-40`}
      />
      <span
        className={`relative inline-flex ${sz} rounded-full bg-primary ring-2 ring-background`}
      />
    </span>
  );
}

function InactiveDot({ small = false }: { small?: boolean }) {
  const sz = small ? "h-2.5 w-2.5" : "h-3 w-3";
  return (
    <div
      className={`${sz} rounded-full border-2 border-muted-foreground/30 bg-background`}
    />
  );
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
  const [expandedJob, setExpandedJob] = useState<string | null>(null);

  const handleJobExpand = useCallback((key: string) => {
    setExpandedJob((prev) => (prev === key ? null : key));
  }, []);

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
            className="text-2xl font-medium mb-6 flex items-center text-foreground"
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
                className="p-6 bg-card rounded-2xl border border-border smooth-hover"
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
            className="text-2xl font-medium mb-6 flex items-center text-foreground"
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4 }}
            viewport={{ once: true }}
          >
            Working Experience
          </motion.h2>

          <div className="relative">
            <div
              className="absolute left-[5px] top-8 bottom-8 w-px pointer-events-none bg-gradient-to-b from-transparent via-muted-foreground/25 to-transparent"
              aria-hidden
            />

            <div className="space-y-6">
              {workExperience.map((company, companyIdx) => {
                const isCompanyActive = company.roles.some((r) =>
                  r.period.toLowerCase().includes("present")
                );
                const isMultiRole = company.roles.length > 1;

                return (
                  <div
                    key={companyIdx}
                    className="relative flex items-start gap-5"
                  >
                    <div className="relative z-10 flex-shrink-0 mt-7">
                      {isCompanyActive ? <ActiveDot /> : <InactiveDot />}
                    </div>

                    <div className="flex-1 min-w-0">
                      {isMultiRole ? (
                        <>
                          <motion.div
                            className="p-4 bg-card rounded-2xl border border-border"
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{
                              duration: 0.4,
                              delay: companyIdx * 0.1,
                            }}
                            viewport={{ once: true }}
                          >
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 flex-shrink-0 rounded-xl bg-card border border-border shadow-sm overflow-hidden flex items-center justify-center">
                                <Image
                                  src={company.logo || "/placeholder.svg"}
                                  alt={`${company.company} logo`}
                                  width={40}
                                  height={40}
                                  className="w-full h-full object-contain p-1"
                                />
                              </div>
                              <div className="min-w-0">
                                {company.website ? (
                                  <a
                                    href={company.website}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-1 text-base font-semibold text-card-foreground hover:text-primary transition-colors"
                                  >
                                    {company.company}
                                    <ExternalLink className="w-3.5 h-3.5 opacity-60" />
                                  </a>
                                ) : (
                                  <p className="text-base font-semibold text-card-foreground">
                                    {company.company}
                                  </p>
                                )}
                                <p className="text-xs text-muted-foreground">
                                  {company.roles.length} roles
                                </p>
                              </div>
                            </div>
                          </motion.div>

                          <div className="relative mt-3 ml-5 space-y-3">
                            <div
                              className="absolute left-[4px] top-4 bottom-4 w-px pointer-events-none bg-muted-foreground/20"
                              aria-hidden
                            />

                            {company.roles.map((role, roleIdx) => {
                              const roleKey = `${companyIdx}-${roleIdx}`;
                              const isRoleActive = role.period
                                .toLowerCase()
                                .includes("present");
                              const isExpanded = expandedJob === roleKey;

                              return (
                                <div
                                  key={roleIdx}
                                  className="relative flex items-start gap-3"
                                >
                                  <div className="relative z-10 flex-shrink-0 mt-[18px]">
                                    {isRoleActive ? (
                                      <ActiveDot small />
                                    ) : (
                                      <InactiveDot small />
                                    )}
                                  </div>

                                  <motion.div
                                    role="button"
                                    tabIndex={0}
                                    aria-expanded={isExpanded}
                                    aria-label={`${
                                      isExpanded ? "Collapse" : "Expand"
                                    } details for ${role.title} at ${
                                      company.company
                                    }`}
                                    className="flex-1 p-4 rounded-2xl border cursor-pointer group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                                    initial={{ opacity: 0, x: -10 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    transition={{
                                      duration: 0.3,
                                      delay: companyIdx * 0.1 + roleIdx * 0.08,
                                    }}
                                    viewport={{ once: true }}
                                    onClick={() => handleJobExpand(roleKey)}
                                    onKeyDown={(e) => {
                                      if (e.key === "Enter" || e.key === " ") {
                                        e.preventDefault();
                                        handleJobExpand(roleKey);
                                      }
                                    }}
                                  >
                                    <div className="flex items-start justify-between gap-2 mb-2">
                                      <h4 className="text-sm font-semibold text-card-foreground group-hover:text-primary transition-colors leading-snug">
                                        {role.title}
                                      </h4>
                                      <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground font-medium bg-accent px-2.5 py-1 rounded-xl whitespace-nowrap flex-shrink-0">
                                        {isRoleActive && (
                                          <span className="h-1.5 w-1.5 rounded-full bg-primary flex-shrink-0" />
                                        )}
                                        {role.period}
                                      </span>
                                    </div>

                                    <p className="text-sm text-muted-foreground">
                                      {role.shortDescription}
                                    </p>

                                    {isExpanded && (
                                      <motion.div
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{
                                          opacity: 1,
                                          height: "auto",
                                        }}
                                        exit={{ opacity: 0, height: 0 }}
                                        transition={{ duration: 0.3 }}
                                        className="mt-3 pt-3 border-t border-border overflow-hidden"
                                      >
                                        <div className="text-sm text-muted-foreground leading-relaxed whitespace-pre-line">
                                          {role.fullDescription}
                                        </div>
                                      </motion.div>
                                    )}

                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleJobExpand(roleKey);
                                      }}
                                      className="flex items-center text-xs text-primary hover:text-primary/80 transition-colors mt-2"
                                    >
                                      {isExpanded ? (
                                        <>
                                          <ChevronUp className="w-3 h-3 mr-1" />
                                          Read less
                                        </>
                                      ) : (
                                        <>
                                          <ChevronDown className="w-3 h-3 mr-1" />
                                          Read more
                                        </>
                                      )}
                                    </button>
                                  </motion.div>
                                </div>
                              );
                            })}
                          </div>
                        </>
                      ) : (
                        (() => {
                          const role = company.roles[0];
                          const roleKey = `${companyIdx}-0`;
                          const isExpanded = expandedJob === roleKey;

                          return (
                            <motion.div
                              role="button"
                              tabIndex={0}
                              aria-expanded={isExpanded}
                              aria-label={`${
                                isExpanded ? "Collapse" : "Expand"
                              } details for ${role.title} at ${
                                company.company
                              }`}
                              className={`work-card flex-1 p-6 rounded-2xl border cursor-pointer group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background ${
                                isExpanded ? "active" : ""
                              }`}
                              initial={{ opacity: 0, x: -20 }}
                              whileInView={{ opacity: 1, x: 0 }}
                              transition={{
                                duration: 0.4,
                                delay: companyIdx * 0.1,
                              }}
                              viewport={{ once: true }}
                              onClick={() => handleJobExpand(roleKey)}
                              onKeyDown={(e) => {
                                if (e.key === "Enter" || e.key === " ") {
                                  e.preventDefault();
                                  handleJobExpand(roleKey);
                                }
                              }}
                            >
                              <div className="flex items-start space-x-4">
                                <div className="w-12 h-12 flex-shrink-0 rounded-2xl bg-card border border-border shadow-sm overflow-hidden flex items-center justify-center">
                                  <Image
                                    src={company.logo || "/placeholder.svg"}
                                    alt={`${company.company} logo`}
                                    width={48}
                                    height={48}
                                    className="w-full h-full object-contain p-1.5"
                                  />
                                </div>

                                <div className="flex-1 min-w-0">
                                  <div className="flex items-start justify-between mb-2 gap-2">
                                    <div className="min-w-0">
                                      <h4 className="text-lg font-medium text-card-foreground group-hover:text-primary transition-colors leading-snug">
                                        {role.title}
                                      </h4>
                                      {company.website ? (
                                        <a
                                          href={company.website}
                                          target="_blank"
                                          rel="noopener noreferrer"
                                          className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-primary transition-colors w-fit"
                                          onClick={(e) => e.stopPropagation()}
                                        >
                                          {company.company}
                                          <ExternalLink className="w-3 h-3 opacity-60" />
                                        </a>
                                      ) : (
                                        <p className="text-sm text-muted-foreground">
                                          {company.company}
                                        </p>
                                      )}
                                    </div>

                                    <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground font-medium bg-accent px-3 py-1 rounded-xl whitespace-nowrap flex-shrink-0">
                                      {isCompanyActive && (
                                        <span className="h-1.5 w-1.5 rounded-full bg-primary flex-shrink-0" />
                                      )}
                                      {role.period}
                                    </span>
                                  </div>

                                  <p className="text-sm text-muted-foreground mb-3">
                                    {role.shortDescription}
                                  </p>

                                  {isExpanded && (
                                    <motion.div
                                      initial={{ opacity: 0, height: 0 }}
                                      animate={{ opacity: 1, height: "auto" }}
                                      exit={{ opacity: 0, height: 0 }}
                                      transition={{ duration: 0.3 }}
                                      className="mt-4 pt-4 border-t border-border overflow-hidden"
                                    >
                                      <div className="text-sm text-muted-foreground leading-relaxed whitespace-pre-line">
                                        {role.fullDescription}
                                      </div>
                                    </motion.div>
                                  )}

                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleJobExpand(roleKey);
                                    }}
                                    className="flex items-center text-sm text-primary hover:text-primary/80 transition-colors mt-2"
                                  >
                                    {isExpanded ? (
                                      <>
                                        <ChevronUp className="w-4 h-4 mr-1" />
                                        Read less
                                      </>
                                    ) : (
                                      <>
                                        <ChevronDown className="w-4 h-4 mr-1" />
                                        Read more
                                      </>
                                    )}
                                  </button>
                                </div>
                              </div>
                            </motion.div>
                          );
                        })()
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {certificates.length > 0 && (
          <div>
            <div className="flex items-end justify-between mb-6">
              <motion.h2
                className="text-2xl font-medium text-foreground"
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
                className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors shrink-0 group"
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
                    className="flex items-start gap-4 p-5 bg-card rounded-2xl border border-border smooth-hover"
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
                          className="inline-flex items-center gap-1 text-xs text-primary hover:text-primary/80 mt-2 transition-colors"
                        >
                          View Certificate
                          <ExternalLink className="w-3 h-3" />
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
