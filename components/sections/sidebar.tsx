"use client";

import { Button } from "@/components/ui/button";
import { IsnaLogo } from "@/components/isna-logo";
import { motion } from "framer-motion";
import { Download, Send } from "lucide-react";
import Image from "next/image";

interface SidebarProps {
  scrollToSection: (sectionId: string) => void;
}

export function Sidebar({ scrollToSection }: SidebarProps) {
  return (
    <div className="hidden lg:block fixed left-0 top-20 w-[35%] h-[calc(100vh-5rem)] overflow-y-auto bg-background border-r border-border z-40">
      <div className="p-8 h-full flex flex-col items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <motion.div
            className="mb-6 flex justify-center"
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <div className="relative">
              <div className="w-32 h-48 bg-primary rounded-2xl flex items-center justify-center p-1">
                <Image
                  src="/foto.jpg"
                  alt="Isna Nur Amalia"
                  width={120}
                  height={120}
                  className="rounded-2xl object-cover"
                />
              </div>
              {/* <div className="absolute -top-2 -right-2">
                <IsnaLogo size="sm" />
              </div> */}
            </div>
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
            Frontend Developer based in Jakarta, Indonesia.
          </motion.p>

          <motion.div
            className="space-y-3"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Button
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground rounded-2xl smooth-hover"
              onClick={() => {
                const link = document.createElement("a");
                link.href = "/IsnaNurAmalia_CV.pdf";
                link.download = "CV-Isna-Nur-Amalia.pdf";
                link.click();
              }}
            >
              <Download className="w-4 h-4 mr-2" />
              Download CV
            </Button>

            <Button
              variant="outline"
              className="w-full border-border text-foreground hover:bg-accent rounded-2xl bg-transparent smooth-hover"
              onClick={() => scrollToSection("contact")}
            >
              <Send className="w-4 h-4 mr-2" />
              Get in Touch
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
