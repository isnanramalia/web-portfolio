"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Mail } from "lucide-react";
import Image from "next/image";

interface ContactSectionProps {}

export function ContactSection({}: ContactSectionProps) {
  return (
    <motion.section
      id="contact"
      className="px-4 sm:px-6 lg:px-12 py-12 lg:py-32 bg-accent/50"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      viewport={{ once: true }}
    >
      <div className="max-w-4xl mx-auto">
        <div className="text-center max-w-2xl mx-auto">
          <motion.h2
            className="text-2xl font-medium mb-6 text-foreground"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            viewport={{ once: true }}
          >
            Contact Me
          </motion.h2>
          <motion.p
            className="text-muted-foreground mb-8 leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            viewport={{ once: true }}
          >
            I'm always interested in new opportunities and exciting projects.
            Let's discuss how we can work together to bring your ideas to life.
          </motion.p>
          <motion.div
            className="flex flex-col sm:flex-row gap-4 justify-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <Button
              asChild
              className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-2xl px-8 py-2 smooth-hover"
            >
              <a
                href="mailto:isnanuramalia13@gmail.com?subject=Hello from your portfolio!&body=Hi Isna, I would like to discuss..."
                target="_blank"
              >
                <Mail className="w-4 h-4 mr-2" />
                Email
              </a>
            </Button>
            <Button
              asChild
              variant="outline"
              className="border-primary text-primary dark:text-white hover:bg-primary/5 hover:border-primary/30 rounded-2xl px-8 py-2 smooth-hover transition-all duration-300 group"
            >
              <a
                href="https://wa.me/6281234567890?text=Hi%20Isna,%20I%20saw%20your%20portfolio%20and%20would%20like%20to%20discuss..."
                target="_blank"
                rel="noopener norefferer"
              >
                {/* Icon untuk light mode - default hitam */}
                <Image
                  src="/icons/whatsapp-icon.png"
                  alt="Contact Isna via WhatsApp"
                  width={16}
                  height={16}
                  className="w-4 h-4 mr-2 dark:hidden transition-all duration-300"
                />
                {/* Icon untuk dark mode - default putih */}
                <Image
                  src="/icons/whatsapp-white.png"
                  alt="Contact Isna via WhatsApp"
                  width={16}
                  height={16}
                  className="w-4 h-4 mr-2 hidden dark:block transition-all duration-300"
                />
                WhatsApp
              </a>
            </Button>
          </motion.div>
        </div>
      </div>
    </motion.section>
  );
}
