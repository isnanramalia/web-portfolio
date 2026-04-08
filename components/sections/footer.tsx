"use client";

import { motion } from "framer-motion";
import { IsnaLogo } from "@/components/isna-logo";
import {
  Github,
  Linkedin,
  Instagram,
  ExternalLink,
  Mail,
  MapPin,
  Calendar,
  Code,
  Palette,
  Zap,
  PenLine,
} from "lucide-react";

export function FooterSection() {
  const currentYear = new Date().getFullYear();

  const quickLinks = [
    { label: "About", href: "#about" },
    { label: "Skills", href: "#skills" },
    { label: "Projects", href: "#projects" },
    { label: "Writing", href: "#writing" },
    { label: "Contact", href: "#contact" },
  ];

  const services = [
    { icon: Code, label: "Frontend Development" },
    { icon: Zap, label: "Manual Testing & QA" },
    { icon: Palette, label: "UI/UX Design" },
  ];

  const socialLinks = [
    { href: "https://github.com/isnanramalia", icon: Github, label: "GitHub" },
    {
      href: "https://linkedin.com/in/isnanramalia",
      icon: Linkedin,
      label: "LinkedIn",
    },
    {
      href: "https://instagram.com/isnanramalia",
      icon: Instagram,
      label: "Instagram",
    },
    {
      href: "https://medium.com/@isnanramalia",
      icon: ExternalLink,
      label: "Medium",
    },
  ];

  return (
    <footer className="px-4 sm:px-6 lg:px-12 pt-16 pb-8 bg-gradient-to-t from-muted/30 to-transparent">
      <div className="max-w-6xl mx-auto">
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, staggerChildren: 0.1 }}
          viewport={{ once: true }}
        >
          <motion.div
            className="lg:col-span-2"
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { opacity: 1, y: 0 },
            }}
          >
            <div className="flex items-center space-x-3 mb-4">
              <IsnaLogo size="md" />
              <div>
                <h3 className="text-xl font-bold text-foreground">
                  Isna Nur Amalia
                </h3>
                <p className="text-primary font-medium text-sm">
                  Frontend Dev{" "}
                  <span className="text-muted-foreground/50 font-normal">
                    ·
                  </span>{" "}
                  QA Practitioner
                </p>
              </div>
            </div>
            <p className="text-muted-foreground leading-relaxed mb-6 max-w-md">
              Frontend developer with hands-on QA practice. I build responsive
              web apps with React.js and Next.js and write test plans, test
              cases, and bug reports, bringing a developer's system-level
              perspective to quality assurance.
            </p>

            <div className="space-y-2 mb-6">
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <MapPin className="w-4 h-4" />
                <span>Semarang, Indonesia</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <Mail className="w-4 h-4" />
                <span>isnanuramalia13@gmail.com</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <Calendar className="w-4 h-4" />
                <span>Seeking QA roles · Open to Dev roles</span>
              </div>
            </div>
          </motion.div>

          <motion.div
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { opacity: 1, y: 0 },
            }}
          >
            <h4 className="text-lg font-semibold text-foreground mb-4">
              Quick Links
            </h4>
            <ul className="space-y-3">
              {quickLinks.map((link, index) => (
                <li key={index}>
                  <a
                    href={link.href}
                    className="text-muted-foreground hover:text-primary transition-colors duration-200 text-sm"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </motion.div>

          <motion.div
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { opacity: 1, y: 0 },
            }}
          >
            <h4 className="text-lg font-semibold text-foreground mb-4">
              Focus Areas
            </h4>
            <ul className="space-y-3">
              {services.map((service, index) => (
                <li key={index} className="flex items-center space-x-2">
                  <service.icon className="w-4 h-4 text-primary" />
                  <span className="text-muted-foreground text-sm">
                    {service.label}
                  </span>
                </li>
              ))}
            </ul>
          </motion.div>
        </motion.div>

        <motion.div
          className="border-t border-border pt-8"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
        >
          <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
            <div className="text-center md:text-left">
              <p className="text-sm text-muted-foreground">
                © {currentYear} Isna Nur Amalia. All rights reserved.
              </p>
            </div>

            <div className="flex items-center space-x-4 text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <PenLine className="w-3 h-3" />
                Writing on Medium
              </span>
              <span>•</span>
              <span>Seeking QA roles</span>
            </div>
          </div>
        </motion.div>
      </div>
    </footer>
  );
}
