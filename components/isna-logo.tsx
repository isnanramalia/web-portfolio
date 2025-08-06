"use client"

import { motion } from "framer-motion"

interface IsnaLogoProps {
  size?: "sm" | "md" | "lg"
  variant?: "default" | "minimal" | "gradient"
  className?: string
}

export function IsnaLogo({ size = "md", variant = "default", className = "" }: IsnaLogoProps) {
  const sizeClasses = {
    sm: "w-8 h-8",
    md: "w-10 h-10",
    lg: "w-16 h-16",
  }

  const textSizes = {
    sm: "text-sm",
    md: "text-lg",
    lg: "text-2xl",
  }

  if (variant === "minimal") {
    return (
      <motion.div
        className={`${sizeClasses[size]} bg-primary rounded-2xl flex items-center justify-center ${className}`}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        transition={{ type: "spring", stiffness: 400, damping: 17 }}
      >
        <span className={`${textSizes[size]} font-bold text-primary-foreground`}>I</span>
      </motion.div>
    )
  }

  if (variant === "gradient") {
    return (
      <motion.div
        className={`${sizeClasses[size]} relative overflow-hidden rounded-2xl ${className}`}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        transition={{ type: "spring", stiffness: 400, damping: 17 }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary/80 to-primary/60" />
        <div className="relative w-full h-full flex items-center justify-center">
          <span className={`${textSizes[size]} font-bold text-primary-foreground`}>I</span>
        </div>
      </motion.div>
    )
  }

  return (
    <motion.div
      className={`${sizeClasses[size]} bg-primary rounded-2xl flex items-center justify-center ${className}`}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      transition={{ type: "spring", stiffness: 400, damping: 17 }}
    >
      <span className={`${textSizes[size]} font-bold text-primary-foreground`}>I</span>
    </motion.div>
  )
}

// Full ISNA Text Logo
export function IsnaTextLogo({ className = "" }: { className?: string }) {
  return (
    <motion.div
      className={`flex items-center space-x-3 ${className}`}
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6 }}
    >
      <IsnaLogo size="md" />
      <motion.div
        className="flex items-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.4 }}
      >
        <span className="text-2xl font-bold text-foreground tracking-wider">
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.3 }}
          >
            I
          </motion.span>
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.3 }}
          >
            S
          </motion.span>
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.3 }}
          >
            N
          </motion.span>
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.3 }}
          >
            A
          </motion.span>
        </span>
      </motion.div>
    </motion.div>
  )
}

// Animated Logo for Loading/Hero
export function IsnaAnimatedLogo({ className = "" }: { className?: string }) {
  return (
    <motion.div
      className={`relative ${className}`}
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
    >
      <svg viewBox="0 0 200 80" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Background */}
        <motion.rect
          width="200"
          height="80"
          rx="20"
          fill="currentColor"
          className="text-primary"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        />

        {/* ISNA Text */}
        <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4, duration: 0.6 }}>
          {/* I */}
          <motion.g
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.4 }}
          >
            <rect x="30" y="20" width="12" height="4" rx="2" fill="currentColor" className="text-primary-foreground" />
            <rect x="33" y="24" width="6" height="28" rx="3" fill="currentColor" className="text-primary-foreground" />
            <rect x="30" y="52" width="12" height="4" rx="2" fill="currentColor" className="text-primary-foreground" />
            <circle cx="36" cy="15" r="2" fill="currentColor" className="text-primary-foreground" />
          </motion.g>

          {/* S */}
          <motion.g
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.7, duration: 0.4 }}
          >
            <path
              d="M55 25 C55 20, 65 20, 65 25 C65 30, 55 30, 55 35 C55 40, 65 40, 65 45 C65 50, 55 50, 55 45"
              stroke="currentColor"
              strokeWidth="6"
              strokeLinecap="round"
              fill="none"
              className="text-primary-foreground"
            />
          </motion.g>

          {/* N */}
          <motion.g
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.4 }}
          >
            <rect x="80" y="25" width="6" height="30" rx="3" fill="currentColor" className="text-primary-foreground" />
            <rect x="100" y="25" width="6" height="30" rx="3" fill="currentColor" className="text-primary-foreground" />
            <rect
              x="86"
              y="35"
              width="14"
              height="6"
              rx="3"
              fill="currentColor"
              className="text-primary-foreground"
              transform="rotate(25 93 38)"
            />
          </motion.g>

          {/* A */}
          <motion.g
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.9, duration: 0.4 }}
          >
            <rect
              x="120"
              y="25"
              width="6"
              height="30"
              rx="3"
              fill="currentColor"
              className="text-primary-foreground"
              transform="rotate(-15 123 40)"
            />
            <rect
              x="140"
              y="25"
              width="6"
              height="30"
              rx="3"
              fill="currentColor"
              className="text-primary-foreground"
              transform="rotate(15 143 40)"
            />
            <rect x="125" y="40" width="15" height="4" rx="2" fill="currentColor" className="text-primary-foreground" />
          </motion.g>
        </motion.g>

        {/* Decorative elements */}
        <motion.circle
          cx="170"
          cy="25"
          r="2"
          fill="currentColor"
          className="text-primary-foreground/40"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 1.2, duration: 0.3 }}
        />
        <motion.circle
          cx="175"
          cy="55"
          r="1.5"
          fill="currentColor"
          className="text-primary-foreground/40"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 1.3, duration: 0.3 }}
        />
      </svg>
    </motion.div>
  )
}
