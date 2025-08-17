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
} from "lucide-react";

interface FooterSectionProps {
  // Add any props if needed in the future
}

export function FooterSection({}: FooterSectionProps) {
  const currentYear = new Date().getFullYear();

  const quickLinks = [
    { label: "About", href: "#about" },
    { label: "Skills", href: "#skills" },
    { label: "Projects", href: "#projects" },
    { label: "Contact", href: "#contact" },
  ];

  const services = [
    { icon: Code, label: "Frontend Development" },
    { icon: Palette, label: "UI/UX Design" },
    { icon: Zap, label: "Performance Optimization" },
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
        {/* Main Footer Content */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, staggerChildren: 0.1 }}
          viewport={{ once: true }}
        >
          {/* About Me Column */}
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
                <p className="text-primary font-medium">Frontend Developer</p>
              </div>
            </div>
            <p className="text-muted-foreground leading-relaxed mb-6 max-w-md">
              Passionate about crafting user-centered digital experiences with
              React.js and Next.js. Based in Semarang, I enjoy building
              responsive web applications and bringing creative ideas to life
              through modern web technologies.
            </p>

            {/* Contact Info */}
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
                <span>Available for opportunities</span>
              </div>
            </div>

            {/* Social Links */}
            <div className="flex items-center space-x-3">
              {socialLinks.map((social, index) => (
                <motion.a
                  key={index}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-muted rounded-xl flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-all duration-300 group"
                  title={social.label}
                  whileHover={{ scale: 1.1, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <social.icon className="w-4 h-4" />
                </motion.a>
              ))}
            </div>
          </motion.div>

          {/* Quick Links Column */}
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

          {/* Services Column */}
          <motion.div
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { opacity: 1, y: 0 },
            }}
          >
            <h4 className="text-lg font-semibold text-foreground mb-4">
              Services
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

        {/* Bottom Section with Enhanced Design */}
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
              <p className="text-xs text-muted-foreground/70 mt-1">
                Built with Next.js, TypeScript, and Tailwind CSS
              </p>
            </div>

            <div className="flex items-center space-x-4 text-xs text-muted-foreground">
              <span>Made with ❤️ in Semarang</span>
              <span>•</span>
              <span>Open to opportunities</span>
            </div>
          </div>
        </motion.div>
      </div>
    </footer>
  );
}
