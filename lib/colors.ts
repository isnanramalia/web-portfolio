// Enhanced color palette utilities - Updated with new palette

export const colors = {
  primary: {
    50: "var(--primary-50)",
    100: "var(--primary-100)",
    200: "var(--primary-200)",
    300: "var(--primary-300)",
    400: "var(--primary-400)",
    500: "var(--primary-500)",
    600: "var(--primary-600)",
    700: "var(--primary-700)",
    800: "var(--primary-800)",
    900: "var(--primary-900)",
  },
  accent: {
    navy: "var(--accent-navy)",
    blue: "var(--accent-blue)",
    cream: "var(--accent-cream)",
    beige: "var(--accent-beige)",
    warm: "var(--accent-warm)",
  },
  gradients: {
    primary: "var(--gradient-primary)",
    accent: "var(--gradient-accent)",
    warm: "var(--gradient-warm)",
  },
} as const;
