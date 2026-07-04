"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Mail, Linkedin } from "lucide-react";
import { staggerContainer, staggerItem, fadeInUp } from "@/lib/animations";
import { FloatingElement } from "@/components/effects/parallax";

const WhatsAppIcon = ({ className }: { className?: string }) => (
  <svg
    viewBox="0 0 24 24"
    className={className}
    fill="currentColor"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
  >
    <path d="M.057 24l1.687-6.163a11.867 11.867 0 0 1-1.587-5.946C.16 5.335 5.495 0 12.05 0a11.817 11.817 0 0 1 8.413 3.488 11.824 11.824 0 0 1 3.48 8.414c-.003 6.557-5.338 11.892-11.893 11.892a11.9 11.9 0 0 1-5.688-1.448L.057 24zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.867-2.03-.967-.272-.099-.47-.148-.669.15-.198.297-.767.966-.94 1.164-.173.199-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51-.173-.008-.372-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413z" />
  </svg>
);

export function ContactSection() {
  return (
    <motion.section
      id="contact"
      className="px-4 sm:px-6 lg:px-12 py-12 lg:py-24"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      viewport={{ once: true }}
    >
      <div className="max-w-4xl mx-auto">
        <motion.div
          className="relative glass-strong rounded-3xl p-8 lg:p-12 overflow-hidden sketchy-border"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
        >


          <div className="relative z-10 text-center max-w-2xl mx-auto">
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              <motion.h2
                className="text-2xl sm:text-3xl font-bold mb-5 mt-2 text-foreground doodle-section-heading"
                variants={fadeInUp}
              >
                Let's Work Together
              </motion.h2>

              <motion.p
                className="text-muted-foreground leading-relaxed mb-2"
                variants={fadeInUp}
              >
                Whether you need a frontend developer, a manual tester, or
                someone who bridges{" "}
                <span className="text-foreground font-medium">both</span>. I
                bring the builder's understanding of{" "}
                <em className="text-foreground not-italic font-medium">why</em>{" "}
                things break, paired with a tester's eye for what users actually
                experience.
              </motion.p>

              <div className="mb-8" />

              <motion.div
                className="flex flex-col sm:flex-row gap-3 justify-center mb-8"
                variants={staggerItem}
              >
                <Button
                  asChild
                  className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-2xl px-6 smooth-hover btn-sticker-apply btn-sticker-primary-apply"
                >
                  <a
                    href="mailto:isnanuramalia13@gmail.com?subject=Hello from your portfolio!&body=Hi Isna, I would like to discuss..."
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Mail className="w-4 h-4 mr-2" />
                    Email Me
                  </a>
                </Button>

                <Button
                  asChild
                  variant="outline"
                  className="border-border text-foreground hover:bg-primary hover:text-primary-foreground hover:border-primary rounded-2xl px-6 bg-transparent smooth-hover transition-colors duration-200 btn-sticker-apply"
                >
                  <a
                    href="https://wa.me/+6283109191936?text=Hi%20Isna,%20I%20saw%20your%20portfolio%20and%20would%20like%20to%20discuss..."
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <WhatsAppIcon className="w-4 h-4 mr-2" />
                    WhatsApp
                  </a>
                </Button>

                <Button
                  asChild
                  variant="outline"
                  className="border-border text-foreground hover:bg-primary hover:text-primary-foreground hover:border-primary rounded-2xl px-6 bg-transparent smooth-hover transition-colors duration-200 btn-sticker-apply"
                >
                  <a
                    href="https://linkedin.com/in/isnanramalia"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Linkedin className="w-4 h-4 mr-2" />
                    LinkedIn
                  </a>
                </Button>
              </motion.div>

              <motion.div
                className="border-t border-border/60 pt-6"
                variants={staggerItem}
              >
                <p className="text-xs text-muted-foreground">
                  Prefer a quick chat?{" "}
                  <a
                    href="https://linkedin.com/in/isnanramalia"
                    className="text-primary hover:underline underline-offset-2 marker-link"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Connect on LinkedIn
                  </a>{" "}
                  or reach out directly on any platform above.
                </p>
              </motion.div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </motion.section>
  );
}
