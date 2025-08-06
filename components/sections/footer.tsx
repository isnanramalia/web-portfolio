"use client";

import { motion } from "framer-motion";
import { IsnaLogo } from "@/components/isna-logo";
import { Github, Linkedin, Instagram, ExternalLink } from "lucide-react";

interface FooterSectionProps {
  // Add any props if needed in the future
}

export function FooterSection({}: FooterSectionProps) {
  return (
    <footer className="px-4 sm:px-6 lg:px-12 py-8">
      <div className="max-w-4xl mx-auto">
        <motion.div
          className="bg-primary rounded-2xl px-6 lg:px-8 py-6"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          viewport={{ once: true }}
        >
          <div className="flex flex-col lg:flex-row items-center justify-between">
            <div className="flex items-center space-x-4 mb-4 lg:mb-0">
              <IsnaLogo size="md" />
              <div>
                <h3 className="text-primary-foreground font-medium">
                  I'm Isna Nur Amalia
                </h3>
                <p className="text-primary-foreground/80 text-sm">
                  Frontend Developer based in Jakarta, Indonesia
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              {[
                { href: "https://github.com/isna", icon: Github },
                {
                  href: "https://linkedin.com/in/isna",
                  icon: Linkedin,
                },
                {
                  href: "https://instagram.com/isna",
                  icon: Instagram,
                },
                {
                  href: "https://medium.com/@isna",
                  icon: ExternalLink,
                  label: "Medium",
                },
              ].map((social, index) => (
                <a
                  key={index}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-primary-foreground/20 rounded-2xl flex items-center justify-center hover:bg-primary-foreground/30 transition-colors smooth-hover"
                  title={social.label || social.icon.name}
                >
                  <social.icon className="w-4 h-4 text-primary-foreground" />
                </a>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </footer>
  );
}
