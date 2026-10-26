import React from "react";
import { Box, Typography, Tabs, Tab, Fade, useTheme, alpha } from "@mui/material";
import { School, AutoAwesome } from "@mui/icons-material";
import { tokens } from "../../theme/tokens";

const Header = ({ activeTab = "curated", onTabChange, totalCourses = 45 }) => {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";

  return (
    <Box sx={{ textAlign: "center", mb: { xs: 3, md: 4 } }}>
      <Fade in timeout={500}>
        <Box>
          {/* Badge Icon */}
          <Box
            sx={{
              width: { xs: 52, md: 64 },
              height: { xs: 52, md: 64 },
              borderRadius: tokens.radii.lg,
              bgcolor: isDark
                ? alpha(tokens.colors.primary.main, 0.16)
                : alpha(tokens.colors.primary.main, 0.1),
              color: "primary.main",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto",
              mb: 2,
              border: "1px solid",
              borderColor: isDark
                ? alpha(tokens.colors.primary.main, 0.3)
                : alpha(tokens.colors.primary.main, 0.2),
            }}
          >
            {activeTab === "custom" ? (
              <AutoAwesome sx={{ fontSize: { xs: 26, md: 32 } }} />
            ) : (
              <School sx={{ fontSize: { xs: 26, md: 32 } }} />
            )}
          </Box>

          {/* Heading */}
          <Typography
            variant="h4"
            sx={{
              fontWeight: 800,
              color: "text.primary",
              letterSpacing: "-0.02em",
              mb: 1,
              fontSize: { xs: "1.5rem", sm: "1.85rem", md: "2.25rem" },
            }}
          >
            {activeTab === "custom" ? "Create Learning Path" : "Explore Curated Paths"}
          </Typography>

          <Typography
            variant="body1"
            sx={{
              color: "text.secondary",
              maxWidth: 580,
              mx: "auto",
              fontSize: { xs: "0.88rem", md: "1rem" },
              mb: 3,
            }}
          >
            {activeTab === "custom"
              ? "Validate any topic and generate an AI-tailored step-by-step curriculum with interactive quizzes."
              : `${totalCourses} structured courses across modern software, science, and professional skills.`}
          </Typography>

          {/* Segmented Tab Switcher */}
          <Box
            sx={{
              display: "inline-flex",
              p: "4px",
              borderRadius: tokens.radii.md,
              bgcolor: isDark ? "background.paper" : tokens.neutral.light.surfaceSubtle,
              border: "1px solid",
              borderColor: "divider",
            }}
          >
            <Tabs
              value={activeTab}
              onChange={(_, val) => onTabChange && onTabChange(val)}
              textColor="primary"
              indicatorColor="primary"
              sx={{
                minHeight: 40,
                "& .MuiTabs-indicator": { display: "none" },
              }}
            >
              <Tab
                value="curated"
                icon={<School sx={{ fontSize: 18 }} />}
                iconPosition="start"
                label="Curated Paths"
                sx={{
                  minHeight: 38,
                  py: 0.75,
                  px: { xs: 1.5, sm: 2.5 },
                  borderRadius: tokens.radii.sm,
                  textTransform: "none",
                  fontWeight: activeTab === "curated" ? 700 : 500,
                  fontSize: "0.88rem",
                  color: activeTab === "curated" ? "primary.main" : "text.secondary",
                  bgcolor:
                    activeTab === "curated"
                      ? isDark
                        ? alpha(tokens.colors.primary.main, 0.16)
                        : "background.paper"
                      : "transparent",
                  boxShadow:
                    activeTab === "curated"
                      ? isDark
                        ? "none"
                        : "0 1px 3px rgba(0,0,0,0.06)"
                      : "none",
                  transition: "all 0.15s ease",
                }}
              />
              <Tab
                value="custom"
                icon={<AutoAwesome sx={{ fontSize: 18 }} />}
                iconPosition="start"
                label="Create with AI"
                sx={{
                  minHeight: 38,
                  py: 0.75,
                  px: { xs: 1.5, sm: 2.5 },
                  borderRadius: tokens.radii.sm,
                  textTransform: "none",
                  fontWeight: activeTab === "custom" ? 700 : 500,
                  fontSize: "0.88rem",
                  color: activeTab === "custom" ? "primary.main" : "text.secondary",
                  bgcolor:
                    activeTab === "custom"
                      ? isDark
                        ? alpha(tokens.colors.primary.main, 0.16)
                        : "background.paper"
                      : "transparent",
                  boxShadow:
                    activeTab === "custom"
                      ? isDark
                        ? "none"
                        : "0 1px 3px rgba(0,0,0,0.06)"
                      : "none",
                  transition: "all 0.15s ease",
                }}
              />
            </Tabs>
          </Box>
        </Box>
      </Fade>
    </Box>
  );
};

export default Header;
