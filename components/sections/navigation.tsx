"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Menu, Search } from "lucide-react";
import { IsnaLogo } from "../isna-logo";
import { useNavigationScrollState } from "@/hooks/use-navigation-scroll-state";
import { ThemeToggle } from "@/components/theme-toggle";


interface NavigationItem {
  id: string;
  label: string;
  icon: React.ComponentType<any>;
}

interface NavigationProps {
  mobileMenuOpen: boolean;
  setMobileMenuOpen: (open: boolean) => void;
  navigationItems: NavigationItem[];
  scrollToSection: (sectionId: string) => void;
  scrollToHero: () => void;
  onOpenCommand?: () => void;
}

export function Navigation({
  mobileMenuOpen,
  setMobileMenuOpen,
  navigationItems,
  scrollToSection,
  scrollToHero,
  onOpenCommand,
}: NavigationProps) {
  const { scrolled, activeSection } = useNavigationScrollState();
  const toggleMenu = () => setMobileMenuOpen(!mobileMenuOpen);


  React.useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768 && mobileMenuOpen) {
        setMobileMenuOpen(false);
      }
    };

    window.addEventListener("resize", handleResize, { passive: true });
    return () => window.removeEventListener("resize", handleResize);
  }, [mobileMenuOpen, setMobileMenuOpen]);

  const navigationVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: [0.25, 0.1, 0.25, 1] as any,
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  // IsnaLogo handles its own hover animation internally (char swap + scale)
  // so we only need a plain clickable wrapper here.

  return (
    <>
      <motion.nav
        initial="hidden"
        animate="visible"
        variants={navigationVariants}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b ${
          scrolled
            ? "bg-background/80 backdrop-blur-md border-b border-border/40 shadow-lg"
            : "bg-background"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="relative cursor-pointer" onClick={scrollToHero}>
              <IsnaLogo />
            </div>

            <motion.div
              className="hidden md:flex items-center space-x-8"
              variants={{
                hidden: { opacity: 0 },
                visible: {
                  opacity: 1,
                  transition: {
                    staggerChildren: 0.1,
                    delayChildren: 0.2,
                  },
                },
              }}
            >
              {navigationItems.map((item) => (
                <motion.button
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  className={`relative px-3 py-2 text-sm font-medium transition-all duration-200 ${
                    activeSection === item.id
                      ? "text-primary"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                  variants={{
                    hidden: { opacity: 0, y: -20 },
                    visible: { opacity: 1, y: 0 },
                  }}
                  whileHover={{
                    scale: 1.05,
                    transition: { type: "spring", stiffness: 400, damping: 10 },
                  }}
                  whileTap={{ scale: 0.95 }}
                >
                  {item.label}
                  {activeSection === item.id && (
                    <motion.div
                      className="absolute inset-0 -z-10 nav-marker-pill"
                      layoutId="activeSection"
                      initial={false}
                      transition={{
                        type: "spring",
                        stiffness: 380,
                        damping: 30,
                      }}
                    />
                  )}
                </motion.button>
              ))}
            </motion.div>

            <div className="flex items-center space-x-4">
              {/* Command palette hint — desktop only */}
              {onOpenCommand && (
                <motion.button
                  onClick={onOpenCommand}
                  className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-xl border border-border text-xs text-muted-foreground hover:text-foreground hover:border-foreground/30 hover:bg-muted/40 transition-colors duration-150"
                  style={{
                    borderRadius: "10px 3px 10px 3px / 3px 10px 3px 10px",
                  }}
                  variants={{
                    hidden: { opacity: 0, scale: 0.9 },
                    visible: { opacity: 1, scale: 1 },
                  }}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  aria-label="Open command palette"
                >
                  <Search className="w-3.5 h-3.5 shrink-0" />
                  <span className="hidden lg:inline">Search</span>
                  <kbd className="hidden lg:inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded border border-border bg-muted/60 font-mono text-[9px] leading-none">
                    ⌘K
                  </kbd>
                </motion.button>
              )}

              <motion.div
                className="flex items-center"
                variants={{
                  hidden: { opacity: 0, scale: 0.8 },
                  visible: { opacity: 1, scale: 1 },
                }}
              >
                <ThemeToggle />
              </motion.div>

              <motion.button
                onClick={toggleMenu}
                className="md:hidden relative p-2 rounded-lg hover:bg-muted/50 transition-colors"
                variants={{
                  hidden: { opacity: 0 },
                  visible: { opacity: 1 },
                }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <motion.div
                  animate={{ rotate: mobileMenuOpen ? 90 : 0 }}
                  transition={{ duration: 0.2 }}
                >
                  {mobileMenuOpen ? (
                    <motion.div
                      initial={{ opacity: 0, rotate: -90 }}
                      animate={{ opacity: 1, rotate: 0 }}
                      className="w-6 h-6 relative"
                    >
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-4 h-0.5 bg-current absolute rotate-45" />
                        <div className="w-4 h-0.5 bg-current absolute -rotate-45" />
                      </div>
                    </motion.div>
                  ) : (
                    <Menu className="w-6 h-6" />
                  )}
                </motion.div>
              </motion.button>
            </div>
          </div>
        </div>
      </motion.nav>

      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-30 md:hidden"
              onClick={() => setMobileMenuOpen(false)}
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: -20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: -20 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="fixed top-20 right-4 z-40 md:hidden"
            >
              <motion.div
                className="bg-background/95 backdrop-blur-lg border border-border rounded-2xl shadow-2xl p-4 w-56"
                style={{
                  borderRadius: "22px 6px 20px 6px / 6px 20px 6px 22px",
                }}
                initial={{ y: -10 }}
                animate={{ y: 0 }}
              >
                <div className="space-y-2">
                  {navigationItems.map((item, index) => (
                    <motion.button
                      key={item.id}
                      onClick={() => scrollToSection(item.id)}
                      className={`flex items-center space-x-3 w-full px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 ${
                        activeSection === item.id
                          ? "text-primary bg-primary/10"
                          : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                      }`}
                      style={{
                        borderRadius: "16px 4px 16px 4px / 4px 16px 4px 16px",
                      }}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05, duration: 0.2 }}
                      whileHover={{ x: 4 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <item.icon className="w-5 h-5" />
                      <span>{item.label}</span>
                    </motion.button>
                  ))}
                </div>
              </motion.div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
