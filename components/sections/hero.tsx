"use client";

import { Button } from "@/components/ui/button";
import { IsnaLogo } from "@/components/isna-logo";
import { motion, useScroll, useTransform } from "framer-motion";
import {
  Download,
  Send,
  Sparkles,
  ChevronDown,
  Mouse,
  Github,
  Linkedin,
  Instagram,
} from "lucide-react";
import Image from "next/image";
import { FloatingElements } from "@/components/floating-elements";
import {
  AnimatedText,
  AnimatedWords,
  GradientText,
} from "@/components/animated-text";
import {
  useMagneticEffect,
  useParallaxScroll,
} from "@/hooks/use-advanced-animations";
import {
  fadeInUp,
  fadeInDown,
  slideInLeft,
  slideInRight,
  staggerContainer,
  staggerItem,
} from "@/lib/animations";
import { socialMedia } from "@/lib/data";

interface HeroSectionProps {
  y: any;
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
      return <Github className="w-4 h-4" />;
    case "linkedin":
      return <Linkedin className="w-4 h-4" />;
    case "medium":
      return <MediumIcon className="w-4 h-4" />;
    case "instagram":
      return <Instagram className="w-4 h-4" />;
    default:
      return null;
  }
};

export function HeroSection({ y, scrollToSection }: HeroSectionProps) {
  const magneticRef = useMagneticEffect(0.2);
  const parallaxOffset = useParallaxScroll(0.3);

  return (
    <motion.section
      id="hero"
      className="px-4 sm:px-6 lg:px-12 py-8 lg:py-20 relative overflow-hidden min-h-[80vh] lg:min-h-[90vh] flex items-center"
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
    >
      {/* Enhanced Background with Advanced Gradients */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-primary/5"
        style={{ y: parallaxOffset }}
      />

      {/* Advanced Floating Elements */}
      <FloatingElements count={12} />

      {/* Sophisticated Background Orbs */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute top-20 left-1/4 w-64 h-64 bg-primary/5 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.3, 0.8, 1.2, 1],
            opacity: [0.3, 0.6, 0.2, 0.5, 0.3],
            x: [0, 30, -20, 10, 0],
            y: [0, -20, 30, -10, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute bottom-20 right-1/4 w-96 h-96 bg-primary/3 rounded-full blur-3xl"
          animate={{
            scale: [1.2, 0.8, 1.5, 1, 1.2],
            opacity: [0.2, 0.5, 0.1, 0.4, 0.2],
            x: [0, -40, 20, -15, 0],
            y: [0, 25, -30, 15, 0],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 3,
          }}
        />
      </div>

      {/* Advanced Floating Geometric Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-1/4 right-20 w-6 h-6 bg-primary/20"
          style={{ clipPath: "polygon(50% 0%, 0% 100%, 100% 100%)" }}
          animate={{
            y: [0, -30, 15, -20, 0],
            rotate: [0, 120, 240, 360],
            scale: [1, 1.3, 0.8, 1.1, 1],
            opacity: [0.2, 0.7, 0.3, 0.6, 0.2],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute bottom-1/3 left-16 w-3 h-3 bg-primary/30 rounded-full"
          animate={{
            y: [0, -25, 10, -15, 0],
            scale: [1, 2, 0.5, 1.5, 1],
            opacity: [0.3, 0.9, 0.1, 0.7, 0.3],
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2,
          }}
        />
        <motion.div
          className="absolute top-1/2 left-1/3 w-2 h-12 bg-primary/15 rounded-full"
          animate={{
            rotate: [0, 180, 360],
            opacity: [0.1, 0.5, 0.1],
            scaleY: [1, 0.5, 2, 1],
          }}
          transition={{
            duration: 18,
            repeat: Infinity,
            ease: "linear",
          }}
        />

        {/* Additional sophisticated shapes */}
        <motion.div
          className="absolute top-3/4 right-1/3 w-4 h-4 bg-primary/25"
          style={{
            clipPath:
              "polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%)",
          }}
          animate={{
            rotate: [0, 360],
            scale: [1, 1.5, 0.8, 1.2, 1],
            opacity: [0.25, 0.6, 0.1, 0.4, 0.25],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 4,
          }}
        />
      </div>

      <div className="max-w-4xl mx-auto relative z-10">
        {/* Enhanced Mobile Profile Section */}
        <motion.div
          className="lg:hidden mb-12 text-center"
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
        >
          <motion.div variants={staggerItem}>
            <div className="mb-6 flex justify-center">
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
            </div>

            <motion.div variants={staggerItem}>
              <h1 className="text-3xl font-bold mb-2 text-foreground">
                <AnimatedWords text="I'm Isna Nur Amalia" />
              </h1>
              <p className="text-muted-foreground text-sm leading-relaxed mb-6 max-w-sm mx-auto">
                <AnimatedText
                  text="Frontend Developer based in Semarang, Indonesia. Passionate about creating beautiful digital experiences."
                  variant="reveal"
                  delay={0.3}
                />
              </p>
            </motion.div>

            <motion.div className="space-y-3" variants={staggerItem}>
              <Button
                className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 group border border-primary/20"
                onClick={() => {
                  const link = document.createElement("a");
                  link.href = "/cv-isna-nur-amalia.pdf";
                  link.download = "CV-Isna-Nur-Amalia.pdf";
                  link.click();
                }}
              >
                <Download className="w-4 h-4 mr-2 group-hover:animate-bounce" />
                Download CV
              </Button>
              <Button
                variant="outline"
                className="border-border text-foreground hover:bg-primary/5 hover:border-primary/30 rounded-2xl ml-2 bg-transparent backdrop-blur-sm transition-all duration-300 group"
                onClick={() => scrollToSection("contact")}
              >
                <Send className="w-4 h-4 mr-2 group-hover:translate-x-1 transition-transform duration-300" />
                Get in Touch
              </Button>
            </motion.div>

            {/* Social Media Buttons */}
            <motion.div
              className="flex justify-center gap-3 pt-4"
              variants={staggerItem}
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

        {/* Enhanced Main Hero Content */}
        <motion.div
          className="text-center lg:text-left"
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
        >
          <motion.div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 border border-primary/20 rounded-full mb-6 backdrop-blur-sm">
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-primary">
              Available for new opportunities
            </span>
          </motion.div>

          <motion.h1
            className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold mb-6 leading-tight"
            variants={staggerItem}
          >
            <motion.span
              className="block bg-gradient-to-r from-foreground via-foreground/90 to-foreground/70 bg-clip-text text-transparent"
              variants={slideInLeft}
            >
              <AnimatedWords text="Passionate about" />
            </motion.span>
            <motion.span
              className="block bg-gradient-to-r from-primary via-primary/80 to-primary bg-clip-text text-transparent font-extrabold"
              variants={slideInRight}
            >
              <GradientText
                text="Digital Experiences"
                gradient="from-primary via-accent to-primary"
                animate={false}
              />
            </motion.span>
          </motion.h1>

          <motion.p
            className="text-lg sm:text-xl text-muted-foreground leading-relaxed mb-8 max-w-2xl mx-auto lg:mx-0"
            variants={fadeInUp}
          >
            <AnimatedText
              text="I craft beautiful, functional, and user-centered digital products that make a difference."
              variant="reveal"
              delay={0.8}
            />
            <motion.span
              className="text-primary font-medium"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.5 }}
            >
              {" "}
              Let's build something amazing together.
            </motion.span>
          </motion.p>

          {/* Enhanced Scroll Hint - repositioned below main text */}
          <motion.div
            className="flex items-center justify-center mb-12"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2, duration: 1 }}
          >
            <motion.div
              className="flex flex-col items-center gap-3 cursor-pointer group"
              animate={{ y: [0, -8, 0] }}
              transition={{
                duration: 2.5,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              onClick={() => {
                const aboutSection = document.getElementById("about");
                aboutSection?.scrollIntoView({ behavior: "smooth" });
              }}
            >
              {/* Mouse Icon with Scroll Animation */}
              <motion.div
                className="relative flex items-center justify-center"
                whileHover={{ scale: 1.1 }}
              >
                <motion.div
                  className="w-6 h-10 border-2 border-muted-foreground/40 rounded-full flex justify-center relative group-hover:border-primary/60 transition-colors duration-300"
                  animate={{
                    boxShadow: [
                      "0 0 0 0 rgba(var(--primary-rgb), 0)",
                      "0 0 0 8px rgba(var(--primary-rgb), 0.1)",
                      "0 0 0 0 rgba(var(--primary-rgb), 0)",
                    ],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                >
                  <motion.div
                    className="w-1 h-2 bg-muted-foreground/60 rounded-full mt-2 group-hover:bg-primary/80 transition-colors duration-300"
                    animate={{ y: [0, 6, 0], opacity: [1, 0.3, 1] }}
                    transition={{
                      duration: 1.5,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                  />
                </motion.div>
              </motion.div>

              {/* Animated Chevron */}
              <motion.div
                className="flex flex-col items-center gap-1"
                animate={{ y: [0, 4, 0] }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 0.2,
                }}
              >
                <ChevronDown className="w-4 h-4 text-muted-foreground/60 group-hover:text-primary/80 transition-colors duration-300" />
                <ChevronDown className="w-4 h-4 text-muted-foreground/40 group-hover:text-primary/60 transition-colors duration-300 -mt-2" />
              </motion.div>

              {/* Text with Line */}
              <motion.div
                className="flex items-center gap-3 text-xs font-medium tracking-wider text-muted-foreground/60 group-hover:text-primary/80 transition-colors duration-300"
                animate={{ opacity: [0.6, 1, 0.6] }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              >
                <div className="w-8 h-[1px] bg-muted-foreground/40 group-hover:bg-primary/60 transition-colors duration-300"></div>
                <span>Scroll to explore</span>
                <div className="w-8 h-[1px] bg-muted-foreground/40 group-hover:bg-primary/60 transition-colors duration-300"></div>
              </motion.div>
            </motion.div>
          </motion.div>
        </motion.div>

        {/* Remove the old absolute positioned scroll hint */}
      </div>
    </motion.section>
  );
}
