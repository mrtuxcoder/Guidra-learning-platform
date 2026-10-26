// Shared Design Tokens for Guidra — Minimal Editorial Learning System

export const tokens = {
  colors: {
    // Brand Accent (Restrained Purple)
    brand: {
      main: "#6558D9",
      light: "#8477EC",
      dark: "#5245C4",
      contrastText: "#FFFFFF",
      subtle: "rgba(101, 88, 217, 0.08)",
      hover: "rgba(101, 88, 217, 0.12)",
      focusRing: "rgba(101, 88, 217, 0.25)",
      // Numeric scale for compatibility
      50: "#F4F3FD",
      100: "#E9E7FB",
      200: "#D3CEF7",
      300: "#B8AFF3",
      400: "#8477EC",
      500: "#6558D9",
      600: "#5245C4",
      700: "#4539B4",
      800: "#382D99",
      900: "#2B227A",
    },
    // Primary alias pointing to brand
    primary: {
      main: "#6558D9",
      light: "#8477EC",
      dark: "#5245C4",
      contrastText: "#FFFFFF",
      50: "#F4F3FD",
      100: "#E9E7FB",
      200: "#D3CEF7",
      300: "#B8AFF3",
      400: "#8477EC",
      500: "#6558D9",
      600: "#5245C4",
      700: "#4539B4",
      800: "#382D99",
      900: "#2B227A",
    },
    // Neutrals (Light Mode)
    light: {
      background: "#F7F8FA",
      surface: "#FFFFFF",
      surfaceSubtle: "#F1F3F7",
      border: "#E4E7EC",
      divider: "#EEF0F4",
      textPrimary: "#20212A",
      textSecondary: "#697386",
      textMuted: "#9AA2B1",
    },
    // Neutrals (Dark Mode - Purpose-built, not inverted)
    dark: {
      background: "#0E1117",
      surface: "#161B26",
      surfaceSubtle: "#1E2433",
      border: "#262C3A",
      divider: "#1E2433",
      textPrimary: "#F0F3F6",
      textSecondary: "#8B949E",
      textMuted: "#6E7681",
    },
    // Semantic Status Tokens
    semantic: {
      success: {
        light: "#059669",
        dark: "#10B981",
        bgLight: "rgba(5, 150, 105, 0.08)",
        bgDark: "rgba(16, 185, 129, 0.12)",
        contrastText: "#FFFFFF",
      },
      warning: {
        light: "#D97706",
        dark: "#F59E0B",
        bgLight: "rgba(217, 119, 6, 0.08)",
        bgDark: "rgba(245, 158, 11, 0.12)",
        contrastText: "#FFFFFF",
      },
      error: {
        light: "#DC2626",
        dark: "#EF4444",
        bgLight: "rgba(220, 38, 38, 0.08)",
        bgDark: "rgba(239, 68, 68, 0.12)",
        contrastText: "#FFFFFF",
      },
      info: {
        light: "#2563EB",
        dark: "#38BDF8",
        bgLight: "rgba(37, 99, 235, 0.08)",
        bgDark: "rgba(56, 189, 248, 0.12)",
        contrastText: "#FFFFFF",
      },
    },
    // Neutral alias map for backward compatibility
    neutral: {
      50: "#F7F8FA",
      100: "#F1F3F7",
      200: "#E4E7EC",
      300: "#D0D5DD",
      400: "#9AA2B1",
      500: "#697386",
      600: "#475467",
      700: "#344054",
      800: "#1D2939",
      900: "#20212A",
      950: "#0E1117",
    },
  },
  typography: {
    fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    codeFontFamily: '"JetBrains Mono", "Fira Code", SFMono-Regular, Menlo, monospace',
    fontSizes: {
      xs: "0.75rem",    // 12px
      sm: "0.875rem",   // 14px
      base: "1rem",     // 16px
      lg: "1.125rem",   // 18px
      xl: "1.25rem",    // 20px
      "2xl": "1.5rem",   // 24px
      "3xl": "1.875rem", // 30px
      "4xl": "2.25rem",  // 36px
    },
    fontWeights: {
      regular: 400,
      medium: 500,
      semibold: 600,
      bold: 700,
    },
    lineHeights: {
      tight: 1.25,
      snug: 1.35,
      normal: 1.5,
      relaxed: 1.65,
    },
  },
  spacing: {
    1: "4px",
    2: "8px",
    3: "12px",
    4: "16px",
    5: "20px",
    6: "24px",
    8: "32px",
    10: "40px",
    12: "48px",
    16: "64px",
  },
  radii: {
    xs: "4px",
    sm: "6px",
    md: "8px",
    lg: "12px",
    xl: "16px",
    full: "9999px",
  },
  shadows: {
    light: {
      subtle: "0 1px 2px 0 rgba(16, 24, 40, 0.05)",
      card: "0 1px 3px 0 rgba(16, 24, 40, 0.05), 0 1px 2px -1px rgba(16, 24, 40, 0.05)",
      hover: "0 4px 6px -2px rgba(16, 24, 40, 0.05), 0 2px 4px -2px rgba(16, 24, 40, 0.05)",
      dropdown: "0 10px 15px -3px rgba(16, 24, 40, 0.08), 0 4px 6px -4px rgba(16, 24, 40, 0.04)",
      modal: "0 20px 25px -5px rgba(16, 24, 40, 0.1), 0 8px 10px -6px rgba(16, 24, 40, 0.05)",
    },
    dark: {
      subtle: "none",
      card: "0 1px 3px 0 rgba(0, 0, 0, 0.4)",
      hover: "0 4px 8px 0 rgba(0, 0, 0, 0.5)",
      dropdown: "0 10px 20px 0 rgba(0, 0, 0, 0.6)",
      modal: "0 20px 30px 0 rgba(0, 0, 0, 0.7)",
    },
  },
  layout: {
    readingMeasure: "840px",
    contentMaxWidth: "1120px",
    wideMaxWidth: "1280px",
    headerHeight: "64px",
    headerHeightMobile: "56px",
  },
  // Helpers for direct access
  neutral: {
    light: {
      background: "#F7F8FA",
      surface: "#FFFFFF",
      surfaceSubtle: "#F1F3F7",
      border: "#E4E7EC",
      textPrimary: "#20212A",
      textSecondary: "#697386",
    },
    dark: {
      background: "#0E1117",
      surface: "#161B26",
      surfaceSubtle: "#1E2433",
      border: "#262C3A",
      textPrimary: "#F0F3F6",
      textSecondary: "#8B949E",
    },
  },
};
