"use client";

import { Button } from "@/components/ui/button";
import { IsnaLogo } from "@/components/isna-logo";
import { motion } from "framer-motion";
import { Download, Send, Github, Linkedin, Instagram } from "lucide-react";
import Image from "next/image";
import { socialMedia } from "@/lib/data";
import { useMagneticEffect } from "@/hooks/use-advanced-animations";

interface SidebarProps {
  scrollToSection: (sectionId: string) => void;
}

// Medium Icon Component
const MediumIcon = ({ className }: { className?: string }) => (
  <svg
    viewBox="0 0 1633.77 1150.51"
    className={className}
    fill="currentColor"
    xmlns="http://www.w3.org/2000/svg"
  >
    <g>
      <path d="M883.45,576.26c0,163.67-131.78,296.35-294.33,296.35S294.78,739.93,294.78,576.26,426.56,279.9,589.12,279.9,883.45,412.59,883.45,576.26" />
      <path d="M1206.34,576.26c0,154.06-65.89,279-147.17,279S912,730.32,912,576.26s65.88-279,147.16-279,147.17,124.9,147.17,279" />
      <path d="M1338.41,576.26c0,138-23.17,249.94-51.76,249.94s-51.75-111.91-51.75-249.94,23.17-249.94,51.75-249.94,51.76,111.9,51.76,249.94" />
    </g>
  </svg>
);

// Social Media Icon Component
const SocialIcon = ({ platform }: { platform: string }) => {
  switch (platform) {
    case "github":
      return <Github className="w-5 h-5" />;
    case "linkedin":
      return <Linkedin className="w-5 h-5" />;
    case "medium":
      return <MediumIcon className="w-5 h-5" />;
    case "instagram":
      return <Instagram className="w-5 h-5" />;
    default:
      return null;
  }
};

export function Sidebar({ scrollToSection }: SidebarProps) {
  const magneticRef = useMagneticEffect(0.2);

  return (
    <div className="hidden lg:block fixed left-0 top-16 w-[35%] h-[calc(100vh-5rem)] overflow-y-auto bg-background border-r border-border z-40">
      <div className="p-8 h-full flex flex-col items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <motion.div className="mb-6 flex justify-center">
            <motion.div
              ref={magneticRef.ref as any}
              className="relative"
              style={{ x: magneticRef.x, y: magneticRef.y }}
              whileHover={{ scale: 1.08, rotateY: 5 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            >
              <motion.div
                className="w-32 h-32 bg-gradient-to-br from-background/80 via-card/90 to-muted/80 backdrop-blur-lg border border-border/50 rounded-2xl flex items-center justify-center p-1 shadow-lg relative overflow-hidden"
                style={{
                  backdropFilter: "blur(16px) saturate(120%)",
                  background: `
                    linear-gradient(135deg, 
                      rgb(var(--background) / 0.8), 
                      rgb(var(--card) / 0.9), 
                      rgb(var(--muted) / 0.8)
                    )
                  `,
                }}
                whileHover={{
                  scale: 1.02,
                  backdropFilter: "blur(20px) saturate(130%)",
                }}
                transition={{
                  duration: 0.3,
                  ease: "easeOut",
                }}
              >
                {/* Glass overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-white/5 to-transparent rounded-2xl" />

                <Image
                  src="/foto.jpg"
                  alt="Isna Nur Amalia"
                  fill
                  className="rounded-xl object-cover"
                />
              </motion.div>
              <motion.div
                className="absolute -top-2 -right-2"
                style={{ display: "none" }}
              >
                <IsnaLogo size="sm" />
              </motion.div>

              {/* Simple shadow effect */}
              <motion.div
                className="absolute inset-0 bg-muted/20 rounded-2xl blur-lg -z-10"
                animate={{
                  opacity: [0.1, 0.15, 0.1],
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
            </motion.div>
          </motion.div>

          <motion.h1
            className="text-3xl font-bold mb-2 text-foreground"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            I'm Isna Nur Amalia
          </motion.h1>

          <motion.p
            className="text-muted-foreground text-sm leading-relaxed mb-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            Frontend Developer based in Semarang, Indonesia.
          </motion.p>

          <motion.div
            className="space-y-3"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Button
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 group border border-primary/20"
              onClick={() => {
                const link = document.createElement("a");
                link.href = "/IsnaNurAmalia_CV.pdf";
                link.download = "CV-Isna-Nur-Amalia.pdf";
                link.click();
              }}
            >
              <Download className="w-4 h-4 mr-2 group-hover:animate-bounce" />
              Download CV
            </Button>

            <Button
              variant="outline"
              className="w-full border-border text-foreground hover:bg-primary/5 hover:border-primary/30 rounded-2xl bg-transparent backdrop-blur-sm transition-all duration-300 group"
              onClick={() => scrollToSection("contact")}
            >
              <Send className="w-4 h-4 mr-2 group-hover:translate-x-1 transition-transform duration-300" />
              Get in Touch
            </Button>

            {/* Social Media Buttons */}
            <motion.div
              className="flex justify-center gap-3 pt-4"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              {socialMedia.map((social, index) => (
                <motion.a
                  key={social.name}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-12 h-12 bg-muted rounded-xl flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-all duration-300 group shadow-md hover:shadow-lg"
                  whileHover={{ scale: 1.1, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 + index * 0.1 }}
                >
                  <SocialIcon platform={social.icon} />
                  <span className="sr-only">{social.name}</span>
                </motion.a>
              ))}
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
