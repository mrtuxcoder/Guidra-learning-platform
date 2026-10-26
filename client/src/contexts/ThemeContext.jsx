import React, { createContext, useContext, useState, useEffect, useMemo } from "react";
import { createTheme, ThemeProvider as MuiThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { tokens } from "../theme/tokens";

const ThemeContext = createContext();

export const useThemeMode = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useThemeMode must be used within ThemeProvider");
  }
  return context;
};

export const ThemeProvider = ({ children }) => {
  const [mode, setMode] = useState(() => {
    const savedMode = localStorage.getItem("theme-mode");
    return savedMode || "light";
  });

  useEffect(() => {
    localStorage.setItem("theme-mode", mode);
  }, [mode]);

  const toggleTheme = () => {
    setMode((prevMode) => (prevMode === "light" ? "dark" : "light"));
  };

  const theme = useMemo(() => {
    const isDark = mode === "dark";
    const { colors, typography, radii, shadows } = tokens;

    const currentPalette = isDark ? colors.dark : colors.light;
    const brand = colors.brand;

    return createTheme({
      palette: {
        mode,
        primary: {
          main: isDark ? brand.light : brand.main,
          light: isDark ? brand[300] : brand.light,
          dark: isDark ? brand.main : brand.dark,
          contrastText: isDark ? colors.dark.background : brand.contrastText,
        },
        secondary: {
          main: isDark ? colors.semantic.info.dark : colors.semantic.info.light,
          light: colors.semantic.info.dark,
          dark: colors.semantic.info.light,
        },
        background: {
          default: currentPalette.background,
          paper: currentPalette.surface,
        },
        text: {
          primary: currentPalette.textPrimary,
          secondary: currentPalette.textSecondary,
        },
        divider: currentPalette.divider,
        action: {
          hover: isDark ? "rgba(255, 255, 255, 0.05)" : brand.subtle,
          selected: isDark ? "rgba(132, 119, 236, 0.16)" : brand.subtle,
        },
        success: {
          main: isDark ? colors.semantic.success.dark : colors.semantic.success.light,
          contrastText: colors.semantic.success.contrastText,
        },
        warning: {
          main: isDark ? colors.semantic.warning.dark : colors.semantic.warning.light,
          contrastText: colors.semantic.warning.contrastText,
        },
        error: {
          main: isDark ? colors.semantic.error.dark : colors.semantic.error.light,
          contrastText: colors.semantic.error.contrastText,
        },
        info: {
          main: isDark ? colors.semantic.info.dark : colors.semantic.info.light,
          contrastText: colors.semantic.info.contrastText,
        },
      },
      typography: {
        fontFamily: typography.fontFamily,
        h1: {
          fontWeight: typography.fontWeights.bold,
          letterSpacing: "-0.025em",
          lineHeight: typography.lineHeights.tight,
        },
        h2: {
          fontWeight: typography.fontWeights.bold,
          letterSpacing: "-0.02em",
          lineHeight: typography.lineHeights.tight,
        },
        h3: {
          fontWeight: typography.fontWeights.semibold,
          letterSpacing: "-0.015em",
          lineHeight: typography.lineHeights.snug,
        },
        h4: {
          fontWeight: typography.fontWeights.semibold,
          letterSpacing: "-0.01em",
          lineHeight: typography.lineHeights.snug,
        },
        h5: {
          fontWeight: typography.fontWeights.semibold,
          lineHeight: typography.lineHeights.snug,
        },
        h6: {
          fontWeight: typography.fontWeights.semibold,
          lineHeight: typography.lineHeights.normal,
        },
        subtitle1: {
          fontWeight: typography.fontWeights.medium,
          lineHeight: typography.lineHeights.normal,
        },
        subtitle2: {
          fontWeight: typography.fontWeights.medium,
          lineHeight: typography.lineHeights.normal,
        },
        body1: {
          lineHeight: typography.lineHeights.relaxed,
          fontSize: typography.fontSizes.base,
        },
        body2: {
          lineHeight: typography.lineHeights.normal,
          fontSize: typography.fontSizes.sm,
        },
        button: {
          fontWeight: typography.fontWeights.semibold,
          textTransform: "none",
        },
        caption: {
          lineHeight: typography.lineHeights.normal,
          fontSize: typography.fontSizes.xs,
        },
      },
      shape: {
        borderRadius: parseInt(radii.md, 10) || 8,
      },
      components: {
        MuiCssBaseline: {
          styleOverrides: {
            body: {
              backgroundColor: currentPalette.background,
              color: currentPalette.textPrimary,
              scrollbarColor: isDark
                ? `${colors.dark.border} transparent`
                : `${colors.light.border} transparent`,
              "&::-webkit-scrollbar, & *::-webkit-scrollbar": {
                width: 6,
                height: 6,
              },
              "&::-webkit-scrollbar-thumb, & *::-webkit-scrollbar-thumb": {
                borderRadius: 4,
                backgroundColor: isDark ? colors.dark.border : colors.light.border,
              },
            },
          },
        },
        MuiAppBar: {
          styleOverrides: {
            root: {
              backgroundImage: "none",
              boxShadow: "none",
              backgroundColor: currentPalette.surface,
              color: currentPalette.textPrimary,
              borderBottom: `1px solid ${currentPalette.border}`,
            },
          },
        },
        MuiPaper: {
          styleOverrides: {
            root: {
              backgroundImage: "none",
              backgroundColor: currentPalette.surface,
              borderColor: currentPalette.border,
            },
            rounded: {
              borderRadius: radii.md,
            },
          },
        },
        MuiCard: {
          styleOverrides: {
            root: {
              backgroundImage: "none",
              backgroundColor: currentPalette.surface,
              borderColor: currentPalette.border,
              boxShadow: isDark ? shadows.dark.card : shadows.light.card,
              borderRadius: radii.md,
            },
          },
        },
        MuiButton: {
          styleOverrides: {
            root: {
              textTransform: "none",
              fontWeight: typography.fontWeights.semibold,
              borderRadius: radii.sm,
              boxShadow: "none",
              padding: "6px 14px",
              "&:hover": {
                boxShadow: "none",
              },
            },
            containedPrimary: {
              backgroundColor: isDark ? brand.light : brand.main,
              color: isDark ? colors.dark.background : brand.contrastText,
              "&:hover": {
                backgroundColor: isDark ? brand[300] : brand.dark,
                boxShadow: "none",
              },
            },
            outlined: {
              borderColor: currentPalette.border,
              color: currentPalette.textPrimary,
              "&:hover": {
                borderColor: isDark ? "rgba(255, 255, 255, 0.25)" : "rgba(0, 0, 0, 0.25)",
                backgroundColor: isDark ? "rgba(255, 255, 255, 0.04)" : "rgba(0, 0, 0, 0.02)",
              },
            },
            outlinedPrimary: {
              borderColor: isDark ? brand.light : brand.main,
              color: isDark ? brand.light : brand.main,
              "&:hover": {
                borderColor: isDark ? brand[300] : brand.dark,
                backgroundColor: isDark ? "rgba(132, 119, 236, 0.08)" : brand.subtle,
              },
            },
            text: {
              color: currentPalette.textSecondary,
              "&:hover": {
                color: currentPalette.textPrimary,
                backgroundColor: isDark ? "rgba(255, 255, 255, 0.04)" : "rgba(0, 0, 0, 0.03)",
              },
            },
          },
        },
        MuiIconButton: {
          styleOverrides: {
            root: {
              borderRadius: radii.sm,
              color: currentPalette.textSecondary,
              "&:hover": {
                color: currentPalette.textPrimary,
                backgroundColor: isDark ? "rgba(255, 255, 255, 0.05)" : "rgba(0, 0, 0, 0.04)",
              },
            },
          },
        },
        MuiOutlinedInput: {
          styleOverrides: {
            root: {
              borderRadius: radii.sm,
              backgroundColor: currentPalette.surface,
              "& .MuiOutlinedInput-notchedOutline": {
                borderColor: currentPalette.border,
              },
              "&:hover .MuiOutlinedInput-notchedOutline": {
                borderColor: isDark ? brand.light : brand.main,
              },
              "&.Mui-focused": {
                "& .MuiOutlinedInput-notchedOutline": {
                  borderColor: isDark ? brand.light : brand.main,
                  borderWidth: "1px",
                },
                boxShadow: `0 0 0 3px ${brand.focusRing}`,
              },
            },
            input: {
              color: currentPalette.textPrimary,
              "&::placeholder": {
                color: currentPalette.textMuted,
                opacity: 1,
              },
            },
          },
        },
        MuiChip: {
          styleOverrides: {
            root: {
              borderRadius: radii.full,
              fontWeight: typography.fontWeights.semibold,
              fontSize: typography.fontSizes.xs,
              height: 26,
            },
            filled: {
              backgroundColor: isDark ? colors.dark.surfaceSubtle : colors.light.surfaceSubtle,
              color: currentPalette.textPrimary,
            },
            outlined: {
              borderColor: currentPalette.border,
              color: currentPalette.textSecondary,
            },
          },
        },
        MuiLinearProgress: {
          styleOverrides: {
            root: {
              height: 4,
              borderRadius: radii.full,
              backgroundColor: isDark ? colors.dark.surfaceSubtle : colors.light.divider,
            },
            bar: {
              borderRadius: radii.full,
              backgroundColor: isDark ? brand.light : brand.main,
            },
          },
        },
        MuiDialog: {
          styleOverrides: {
            paper: {
              borderRadius: radii.lg,
              border: `1px solid ${currentPalette.border}`,
              boxShadow: isDark ? shadows.dark.modal : shadows.light.modal,
            },
          },
        },
        MuiMenu: {
          styleOverrides: {
            paper: {
              borderRadius: radii.md,
              border: `1px solid ${currentPalette.border}`,
              boxShadow: isDark ? shadows.dark.dropdown : shadows.light.dropdown,
            },
          },
        },
        MuiDivider: {
          styleOverrides: {
            root: {
              borderColor: currentPalette.divider,
            },
          },
        },
      },
    });
  }, [mode]);

  const value = {
    mode,
    toggleTheme,
    tokens,
  };

  return (
    <ThemeContext.Provider value={value}>
      <MuiThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </MuiThemeProvider>
    </ThemeContext.Provider>
  );
};
