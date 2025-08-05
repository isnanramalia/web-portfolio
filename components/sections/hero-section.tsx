"use client";

import { Button } from "@/components/ui/button";
import { IsnaLogo } from "@/components/isna-logo";
import { motion } from "framer-motion";
import { Download, Send } from "lucide-react";
import Image from "next/image";

interface HeroSectionProps {
  y: any;
  scrollToSection: (sectionId: string) => void;
}

export function HeroSection({ y, scrollToSection }: HeroSectionProps) {
  return (
    <motion.section
      id="hero"
      className="px-4 sm: px-6 lg:px-12 py-88 lg:py-16 relative overflow-hidden"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <div className="max-w-4xl mx-auto relative">
        {/* Mobile Profile Section */}
        <div className="lg:hidden mb-12 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="mb-6 flex justify-center">
              <div className="relative">
                <div className="w-32 h-32 bg-primary rounded-2xl flex items-center justify-center p-1">
                  <Image
                    src="/foto"
                    alt="foto isna"
                    width={120}
                    height={120}
                    className="rounded-2xl object-cover"
                  />
                </div>
                <div className="absolute -top-2 -right-2">
                  <IsnaLogo size="sm" />
                </div>
              </div>
            </div>
            <h1 className="text-3xl font-bold mb-2 text-foreground">
              I'm Isna Nur Amalia
            </h1>
            <p className="text-muted-foreground text-sm leading-relaxed mb-6">
              Frontend Developer based in Jakarta, Indonesia.
            </p>
            <div className="space-y-3">
              <Button
                className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-2xl smooth-hover"
                onClick={() => {
                  const link = document.createElement("a");
                  link.href = "/IsnaNurAmalia_CV.pdf";
                  link.download = "CV-IsnaNurAmalia.pdf";
                  link.click();
                }}
              >
                <Download className="w-4 h-4 mr-2" />
                Download CV
              </Button>
              <Button
                variant="outline"
                className="border-border text-foreground hover:bg-accent rounded-2xl ml-2 bg-transparent smooth-hover"
                onClick={() => scrollToSection("contact")}
              >
                <Send className="w-4 h-4 mr-2" />
                Get in Touch
              </Button>
            </div>
          </motion.div>
        </div>

        <motion.h2
          className="text-3xl sm:text-4xl lg:text-5xl font-serif mb-8 leading-tight text-foreground"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          Passionate creating great experiences for Digital Product
        </motion.h2>

        <motion.div
          className="flex flex-wrap gap-4 mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
        >
          <Button
            className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-2xl px-6 py-2 text-sm smooth-hover"
            onClick={() => scrollToSection("contact")}
          >
            Get with me
          </Button>
          <Button
            variant="outline"
            className="border-border text-foreground hover:bg-accent rounded-2xl px-6 py-2 text-sm bg-transparent smooth-hover"
            onClick={() => scrollToSection("projects")}
          >
            See my work
          </Button>
        </motion.div>
      </div>
    </motion.section>
  );
}
