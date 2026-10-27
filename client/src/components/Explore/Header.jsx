import React from "react";
import { Box, Typography, Tabs, Tab, Fade, useTheme, alpha } from "@mui/material";
import { School, AutoAwesome } from "@mui/icons-material";
import { tokens } from "../../theme/tokens";

const Header = ({ activeTab = "curated", onTabChange, totalCourses = 45 }) => {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";

  return (
    <Box sx={{ textAlign: "center", mb: { xs: 1.5, md: 2 } }}>
      <Fade in timeout={400}>
        <Box>
          {/* Subtle Icon Badge */}
          <Box
            sx={{
              width: 38,
              height: 38,
              borderRadius: "8px",
              bgcolor: isDark
                ? alpha(tokens.colors.primary.main, 0.15)
                : alpha(tokens.colors.primary.main, 0.08),
              color: "primary.main",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              mx: "auto",
              mb: 1,
              border: "1px solid",
              borderColor: isDark
                ? alpha(tokens.colors.primary.main, 0.25)
                : alpha(tokens.colors.primary.main, 0.15),
            }}
          >
            {activeTab === "custom" ? (
              <AutoAwesome sx={{ fontSize: 18 }} />
            ) : (
              <School sx={{ fontSize: 18 }} />
            )}
          </Box>

          {/* Heading */}
          <Typography
            variant="h4"
            sx={{
              fontWeight: 700,
              color: "text.primary",
              letterSpacing: "-0.015em",
              mb: 0.5,
              fontSize: { xs: "1.35rem", sm: "1.65rem", md: "1.85rem" },
            }}
          >
            {activeTab === "custom" ? "Create Learning Path" : "Explore Curated Paths"}
          </Typography>

          <Typography
            variant="body1"
            sx={{
              color: "text.secondary",
              maxWidth: 540,
              mx: "auto",
              fontSize: { xs: "0.85rem", md: "0.9rem" },
              lineHeight: 1.5,
              mb: 2,
            }}
          >
            {activeTab === "custom"
              ? "Validate any topic and generate an AI-tailored step-by-step curriculum with interactive quizzes."
              : `${totalCourses} structured courses across modern software, computer science, and engineering.`}
          </Typography>

          {/* Segmented Tab Switcher */}
          <Box
            sx={{
              display: "inline-flex",
              p: "3px",
              borderRadius: "8px",
              bgcolor: isDark ? "background.paper" : "rgba(0, 0, 0, 0.04)",
              border: "1px solid",
              borderColor: "divider",
            }}
          >
            <Tabs
              value={activeTab}
              onChange={(_, val) => onTabChange && onTabChange(val)}
              textColor="inherit"
              sx={{
                minHeight: 34,
                "& .MuiTabs-indicator": { display: "none" },
              }}
            >
              <Tab
                value="curated"
                icon={<School sx={{ fontSize: 16 }} />}
                iconPosition="start"
                label="Curated Paths"
                sx={{
                  minHeight: 32,
                  py: 0.5,
                  px: { xs: 1.5, sm: 2.25 },
                  borderRadius: "6px",
                  textTransform: "none",
                  fontWeight: activeTab === "curated" ? 600 : 500,
                  fontSize: "0.82rem",
                  color: activeTab === "curated" ? "text.primary" : "text.secondary",
                  bgcolor:
                    activeTab === "curated"
                      ? isDark
                        ? "rgba(255, 255, 255, 0.08)"
                        : "#FFFFFF"
                      : "transparent",
                  boxShadow:
                    activeTab === "curated"
                      ? isDark
                        ? "none"
                        : "0 1px 2px rgba(0, 0, 0, 0.05)"
                      : "none",
                  transition: "all 0.15s ease",
                  "&:hover": {
                    color: "text.primary",
                  },
                }}
              />
              <Tab
                value="custom"
                icon={<AutoAwesome sx={{ fontSize: 16 }} />}
                iconPosition="start"
                label="Create with AI"
                sx={{
                  minHeight: 32,
                  py: 0.5,
                  px: { xs: 1.5, sm: 2.25 },
                  borderRadius: "6px",
                  textTransform: "none",
                  fontWeight: activeTab === "custom" ? 600 : 500,
                  fontSize: "0.82rem",
                  color: activeTab === "custom" ? "text.primary" : "text.secondary",
                  bgcolor:
                    activeTab === "custom"
                      ? isDark
                        ? "rgba(255, 255, 255, 0.08)"
                        : "#FFFFFF"
                      : "transparent",
                  boxShadow:
                    activeTab === "custom"
                      ? isDark
                        ? "none"
                        : "0 1px 2px rgba(0, 0, 0, 0.05)"
                      : "none",
                  transition: "all 0.15s ease",
                  "&:hover": {
                    color: "text.primary",
                  },
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
