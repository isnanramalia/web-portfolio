"use client";

import { motion } from "framer-motion";
import { ChevronDown, ChevronUp } from "lucide-react";
import Image from "next/image";

interface Education {
  degree: string;
  institution: string;
  period: string;
  description: string;
}

interface WorkExperience {
  title: string;
  company: string;
  period: string;
  logo: string;
  shortDescription: string;
  fullDescription: string;
}

interface AboutSectionProps {
  education: Education[];
  workExperience: WorkExperience[];
  expandedJob: number | null;
  handleJobExpand: (index: number) => void;
}

export function AboutSection({
  education,
  workExperience,
  expandedJob,
  handleJobExpand,
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
        {/* <motion.h2
          className="text-2xl font-medium mb-8 text-foreground"
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
          viewport={{ once: true }}
        >
          About Me
        </motion.h2> */}

        {/* <motion.div
          className="mb-12 p-6 bg-accent rounded-2xl border border-border"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          viewport={{ once: true }}
        >
          <p className="text-muted-foreground leading-relaxed">
            I'm a passionate Frontend Developer with over 4 years of experience
            in creating beautiful, functional, and user-centered digital
            experiences. I specialize in modern web technologies including
            React, Next.js, and TypeScript. My journey in web development
            started with a curiosity about how websites work, and it has evolved
            into a deep passion for crafting pixel-perfect interfaces and
            seamless user experiences. I believe in writing clean, maintainable
            code and staying up-to-date with the latest industry trends and best
            practices.
          </p>
        </motion.div> */}

        {/* Educational Background */}
        <div className="mb-12">
          <motion.h2
            className="text-2xl font-medium mb-6 flex items-center text-foreground"
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4 }}
            viewport={{ once: true }}
          >
            {/* <GraduationCap className="w-5 h-5 mr-2" /> */}
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
                  <span className="text-xs text-muted-foreground font-medium bg-accent px-3 py-1 rounded-xl">
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

        {/* Working Experience */}
        <div>
          <motion.h2
            className="text-2xl font-medium my-6 flex items-center text-foreground"
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4 }}
            viewport={{ once: true }}
          >
            {/* <Calendar className="w-5 h-5 mr-2" /> */}
            Working Experience
          </motion.h2>
          <div className="space-y-4">
            {workExperience.map((job, index) => (
              <motion.div
                key={index}
                className={`work-card p-6 rounded-2xl border ${
                  expandedJob === index ? "active" : ""
                }`}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-4 flex-1">
                    <div className="w-12 h-12 rounded-2xl bg-primary flex items-center justify-center p-1 flex-shrink-0">
                      <Image
                        src={job.logo || "/placeholder.svg"}
                        alt={job.company}
                        width={32}
                        height={32}
                        className="rounded-xl bg-primary-foreground p-1"
                      />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h4 className="text-lg font-medium text-card-foreground">
                            {job.title}
                          </h4>
                          <p className="text-sm text-muted-foreground">
                            {job.company}
                          </p>
                        </div>
                        <span className="text-xs text-muted-foreground font-medium bg-accent px-3 py-1 rounded-xl">
                          {job.period}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground mb-3">
                        {job.shortDescription}
                      </p>

                      {expandedJob === index && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.3 }}
                          className="mt-4 pt-4 border-t border-border"
                        >
                          <div className="text-sm text-muted-foreground leading-relaxed whitespace-pre-line">
                            {job.fullDescription}
                          </div>
                        </motion.div>
                      )}

                      <button
                        onClick={() => handleJobExpand(index)}
                        className="flex items-center text-sm text-primary hover:text-primary/80 transition-colors mt-2"
                      >
                        {expandedJob === index ? (
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
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </motion.section>
  );
}
