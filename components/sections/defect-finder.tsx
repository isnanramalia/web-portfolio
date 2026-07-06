"use client";

import { useState, useEffect, useRef } from "react";
import confetti from "canvas-confetti";
import { Bug, User, Mail, Phone, ShoppingBag, Shield, CheckCircle, AlertTriangle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export interface FoundBugs {
  bug1: boolean;
  bug2: boolean;
  bug3: boolean;
}

interface FormData {
  name: string;
  email: string;
  phone: string;
}

interface ToastMessage {
  id: string;
  title: string;
  message: string;
}

export function DefectFinder() {
  const [foundBugs, setFoundBugs] = useState<FoundBugs>({
    bug1: false,
    bug2: false,
    bug3: false,
  });

  const flaggedBugsRef = useRef<Record<keyof FoundBugs, boolean>>({
    bug1: false,
    bug2: false,
    bug3: false,
  });

  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    phone: "",
  });

  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [showOrderSuccess, setShowOrderSuccess] = useState(false);
  const [orderError, setOrderError] = useState("");

  const totalFound = Object.values(foundBugs).filter(Boolean).length;
  const isAllFound = totalFound === 3;

  const triggerConfetti = (origin: { x?: number; y: number } = { y: 0.7 }) => {
    confetti({
      particleCount: 65,
      spread: 75,
      origin,
      colors: ["#6FC5FF", "#A78BFA", "#34D399", "#FDE68A"],
    });
  };

  const addToast = (title: string, message: string) => {
    const id = Math.random().toString(36).substr(2, 9);
    setToasts((prev) => [...prev, { id, title, message }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4500);
  };

  // Synchronously flag bugs using Ref to prevent multiple triggers/toasts
  const handleBugFound = (
    bugKey: keyof FoundBugs,
    bugDescription: string,
    origin?: { x: number; y: number }
  ) => {
    if (flaggedBugsRef.current[bugKey]) return;
    flaggedBugsRef.current[bugKey] = true;

    const titles: Record<keyof FoundBugs, string> = {
      bug1: "Validation Bypass",
      bug2: "Type Acceptance Error",
      bug3: "Misleading Error State",
    };

    triggerConfetti(origin || { y: 0.8 });
    addToast(`🐛 Bug Found: ${titles[bugKey]}!`, bugDescription);
    setFoundBugs((prev) => ({ ...prev, [bugKey]: true }));
  };

  // Bug 3 Detection: Check name for special characters
  const hasSpecialChar = /[^a-zA-Z0-9\s]/.test(formData.name);
  useEffect(() => {
    if (hasSpecialChar) {
      handleBugFound(
        "bug3",
        "A validation error appeared but contained a severe typo/leetspeak format."
      );
    }
  }, [formData.name, hasSpecialChar]);

  // Bug 2 Detection: Check phone input for letters
  const handlePhoneChange = (val: string) => {
    setFormData((prev) => ({ ...prev, phone: val }));
    const hasLetters = /[a-zA-Z]/.test(val);
    if (hasLetters) {
      handleBugFound(
        "bug2",
        "Phone number field accepted alphabetical letters without blocking them."
      );
    }
  };

  // Submit Handler containing Bug 1 check
  const handleSubmit = (e: React.MouseEvent) => {
    e.preventDefault();
    setOrderError("");
    setShowOrderSuccess(false);

    if (!formData.name.trim()) {
      setOrderError("Please enter your name.");
      return;
    }

    // Bug 1 Validation Bypass check: if email is empty, it lets them submit anyway!
    if (!formData.email.trim()) {
      const clickX = e.clientX / window.innerWidth;
      const clickY = e.clientY / window.innerHeight;
      handleBugFound(
        "bug1",
        "Submit triggered successfully even though the mandatory Email field was empty.",
        { x: clickX, y: clickY }
      );
      setShowOrderSuccess(true);
      return;
    }

    // Standard submission if email is filled
    setShowOrderSuccess(true);
  };

  const handleReset = () => {
    flaggedBugsRef.current = { bug1: false, bug2: false, bug3: false };
    setFoundBugs({ bug1: false, bug2: false, bug3: false });
    setFormData({ name: "", email: "", phone: "" });
    setShowOrderSuccess(false);
    setOrderError("");
  };

  return (
    <div className="w-full max-w-2xl mx-auto my-8 relative">
      {/* Toast Notifications container */}
      <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 max-w-xs pointer-events-none">
        <AnimatePresence>
          {toasts.map((t) => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, y: 30, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="bg-background/95 border border-green-500/40 p-4 rounded-xl shadow-lg pointer-events-auto flex items-start gap-3 text-left font-mono glass-strong"
              style={{ borderRadius: "10px 4px 10px 4px / 4px 10px 4px 10px" }}
            >
              <CheckCircle className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-bold text-foreground">{t.title}</p>
                <p className="text-[10px] text-muted-foreground mt-1 leading-normal">{t.message}</p>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Bug className="w-4 h-4 text-primary animate-pulse" />
          <span className="text-xs font-mono font-bold text-foreground tracking-wide">
            Mini-Game: Find 3 Hidden Defects
          </span>
        </div>

        {/* Bug counter */}
        <div className="flex items-center gap-1.5">
          {[1, 2, 3].map((n) => {
            const found = foundBugs[`bug${n}` as keyof FoundBugs];
            return (
              <div
                key={n}
                className={`w-6 h-6 rounded-full border text-[10px] font-mono font-bold flex items-center justify-center transition-all duration-300 ${
                  found
                    ? "bg-green-500/20 border-green-500/60 text-green-600 dark:text-green-400 scale-110"
                    : "bg-muted/20 border-border/40 text-muted-foreground"
                }`}
              >
                {n}
              </div>
            );
          })}
          <span className="text-[10px] font-mono text-muted-foreground ml-1">
            Bugs Found: {totalFound}/3
          </span>
        </div>
      </div>

      {/* Form Container with transition */}
      <div
        className="glass-strong sketchy-border overflow-hidden min-h-[360px] flex flex-col justify-between"
        style={{ borderRadius: "20px 6px 20px 6px / 6px 20px 6px 20px" }}
      >
        <AnimatePresence mode="wait">
          {!isAllFound ? (
            <motion.div
              key="checkout-form"
              initial={{ opacity: 1 }}
              exit={{ opacity: 0, y: 15 }}
              transition={{ duration: 0.3 }}
              className="flex-1 flex flex-col justify-between"
            >
              {/* Card header bar */}
              <div className="flex items-center gap-3 px-6 py-4 border-b border-border/30 bg-primary/5">
                <div className="w-8 h-8 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center">
                  <ShoppingBag className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground">Checkout</p>
                  <p className="text-[10px] text-muted-foreground font-mono">
                    Complete your order information below
                  </p>
                </div>
                <div className="ml-auto flex items-center gap-1.5 text-[10px] font-mono text-green-600 dark:text-green-400">
                  <Shield className="w-3 h-3" />
                  Secure Form
                </div>
              </div>

              {/* Form body */}
              <div className="p-6 space-y-5">
                {/* Order Success banner */}
                {showOrderSuccess && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-3 bg-green-500/10 border border-green-500/30 rounded-xl text-center text-xs font-mono text-green-600 dark:text-green-400"
                  >
                    Order Placed Successfully! Thank you.
                  </motion.div>
                )}

                {/* Simple validation error */}
                {orderError && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-3 bg-red-500/10 border border-red-500/30 rounded-xl text-center text-xs font-mono text-red-600 dark:text-red-400"
                  >
                    {orderError}
                  </motion.div>
                )}

                {/* Full Name */}
                <div className="space-y-1.5">
                  <label
                    htmlFor="df-name"
                    className="flex items-center gap-1.5 text-xs font-semibold text-foreground font-mono"
                  >
                    <User className="w-3 h-3 text-primary/70" />
                    Full Name
                    <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      id="df-name"
                      type="text"
                      placeholder="e.g. Isna Nur Amalia"
                      value={formData.name}
                      onChange={(e) =>
                        setFormData((prev) => ({ ...prev, name: e.target.value }))
                      }
                      className={`w-full bg-background/50 border text-foreground placeholder:text-muted-foreground/40 text-sm px-4 py-2.5 font-mono transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary/10 ${
                        hasSpecialChar ? "border-red-500" : "border-border/60 focus:border-primary/50"
                      }`}
                      style={{ borderRadius: "10px 3px 10px 3px / 3px 10px 3px 10px" }}
                    />
                  </div>
                  {/* Bug 3 Typo error message */}
                  {hasSpecialChar && (
                    <motion.p
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-[10px] font-mono text-red-500 flex items-center gap-1 mt-1 font-bold"
                    >
                      <AlertTriangle className="w-3 h-3" />
                      N4m4 t1d4k b0l3h m3ng4ndung k4r4kt3r @neh
                    </motion.p>
                  )}
                </div>

                {/* Email */}
                <div className="space-y-1.5">
                  <label
                    htmlFor="df-email"
                    className="flex items-center gap-1.5 text-xs font-semibold text-foreground font-mono"
                  >
                    <Mail className="w-3 h-3 text-primary/70" />
                    Email Address
                    <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      id="df-email"
                      type="email"
                      placeholder="e.g. isna@example.com"
                      value={formData.email}
                      onChange={(e) =>
                        setFormData((prev) => ({ ...prev, email: e.target.value }))
                      }
                      className="w-full bg-background/50 border border-border/60 text-foreground placeholder:text-muted-foreground/40 text-sm px-4 py-2.5 font-mono transition-all duration-200 focus:outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/10"
                      style={{ borderRadius: "10px 3px 10px 3px / 3px 10px 3px 10px" }}
                    />
                  </div>
                </div>

                {/* Phone */}
                <div className="space-y-1.5">
                  <label
                    htmlFor="df-phone"
                    className="flex items-center gap-1.5 text-xs font-semibold text-foreground font-mono"
                  >
                    <Phone className="w-3 h-3 text-primary/70" />
                    Phone Number
                    <span className="text-muted-foreground text-[10px] font-normal ml-1">(optional)</span>
                  </label>
                  <div className="relative flex gap-2">
                    <div
                      className="shrink-0 flex items-center px-3 bg-muted/30 border border-border/60 text-sm font-mono text-muted-foreground select-none"
                      style={{ borderRadius: "10px 3px 10px 3px / 3px 10px 3px 10px" }}
                    >
                      +62
                    </div>
                    <input
                      id="df-phone"
                      type="tel"
                      placeholder="e.g. 831 0919 1936"
                      value={formData.phone}
                      onChange={(e) => handlePhoneChange(e.target.value)}
                      className="flex-1 bg-background/50 border border-border/60 text-foreground placeholder:text-muted-foreground/40 text-sm px-4 py-2.5 font-mono transition-all duration-200 focus:outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/10"
                      style={{ borderRadius: "3px 10px 3px 10px / 10px 3px 10px 3px" }}
                    />
                  </div>
                </div>

                {/* Divider */}
                <div className="border-t border-border/30 pt-2" />

                {/* Submit Button */}
                <button
                  type="button"
                  onClick={handleSubmit}
                  className="w-full relative overflow-hidden py-3 px-6 text-sm font-bold font-mono bg-primary text-primary-foreground transition-all duration-200 hover:bg-primary/90 active:scale-[0.98] btn-sticker-apply btn-sticker-primary-apply"
                  style={{ borderRadius: "14px 4px 14px 4px / 4px 14px 4px 14px" }}
                >
                  <span className="relative z-10 flex items-center justify-center gap-2">
                    <ShoppingBag className="w-4 h-4" />
                    Place Order
                  </span>
                </button>

                {/* Fine print */}
                <p className="text-center text-[10px] font-mono text-muted-foreground/60 leading-relaxed">
                  By placing your order, you agree to our{" "}
                  <span className="underline underline-offset-2 cursor-pointer hover:text-foreground transition-colors">
                    Terms of Service
                  </span>{" "}
                  and{" "}
                  <span className="underline underline-offset-2 cursor-pointer hover:text-foreground transition-colors">
                    Privacy Policy
                  </span>
                  .
                </p>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="success-screen"
              initial={{ opacity: 0, y: -15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="p-8 text-center flex flex-col items-center justify-center min-h-[360px] space-y-5"
            >
              <div className="w-16 h-16 rounded-full bg-green-500/10 border border-green-500/35 flex items-center justify-center text-green-500 animate-bounce">
                <Bug className="w-8 h-8" />
              </div>
              <div className="space-y-2">
                <h4 className="text-xl font-bold font-mono text-foreground" style={{ fontFamily: "var(--font-kalam)" }}>
                  System Cleared!
                </h4>
                <p className="text-sm text-muted-foreground max-w-md mx-auto leading-relaxed font-mono">
                  You have the eyes of a true QA. All 3 intentional defects have been successfully found and logged!
                </p>
              </div>

              {/* Bug Preview List */}
              <div className="bg-primary/5 border border-border/20 rounded-xl p-4 text-left space-y-2.5 max-w-md w-full mx-auto font-mono text-[11px] leading-relaxed text-muted-foreground">
                <p className="font-bold text-foreground border-b border-border/20 pb-1 mb-2 text-xs">
                  📋 Defect Report Summary:
                </p>
                <div className="flex gap-2">
                  <span className="text-green-500 font-bold shrink-0">✓</span>
                  <div>
                    <span className="font-bold text-foreground">Defect 1 (Validation Bypass):</span> Submitted checkout successfully even though the mandatory Email was blank.
                  </div>
                </div>
                <div className="flex gap-2">
                  <span className="text-green-500 font-bold shrink-0">✓</span>
                  <div>
                    <span className="font-bold text-foreground">Defect 2 (Type Acceptance Error):</span> Phone number field allowed alphabetical letters input.
                  </div>
                </div>
                <div className="flex gap-2">
                  <span className="text-green-500 font-bold shrink-0">✓</span>
                  <div>
                    <span className="font-bold text-foreground">Defect 3 (Misleading Error State):</span> Full Name error message had a severe typo/leetspeak text.
                  </div>
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="button"
                  onClick={handleReset}
                  className="px-6 py-3 text-xs font-mono font-bold bg-primary text-primary-foreground hover:bg-primary/90 transition-all active:scale-95 btn-sticker-apply btn-sticker-primary-apply"
                  style={{ borderRadius: "10px 4px 10px 4px / 4px 10px 4px 10px" }}
                >
                  Reset Simulation
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
