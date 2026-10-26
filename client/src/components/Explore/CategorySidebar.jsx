import React from "react";
import { Box, Chip, useTheme, alpha, Typography } from "@mui/material";
import { CATEGORIES } from "./constants.jsx";
import { tokens } from "../../theme/tokens";

const CategorySidebar = ({
  selectedCategory,
  setSelectedCategory,
  isMobile,
}) => {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";

  return (
    <Box
      sx={{
        width: isMobile ? "100%" : { md: 220, lg: 240 },
        display: "flex",
        flexDirection: isMobile ? "row" : "column",
        gap: 1,
        justifyContent: "flex-start",
        alignItems: isMobile ? "center" : "stretch",
        flexShrink: 0,
        overflowX: isMobile ? "auto" : "visible",
        overflowY: isMobile ? "visible" : "auto",
        position: isMobile ? "static" : "sticky",
        top: isMobile ? "auto" : 88,
        pb: isMobile ? 1.5 : 0,
        scrollbarWidth: "none",
        "&::-webkit-scrollbar": { display: "none" },
      }}
    >
      {!isMobile && (
        <Typography
          variant="caption"
          sx={{
            fontWeight: 700,
            textTransform: "uppercase",
            letterSpacing: "0.06em",
            color: "text.secondary",
            px: 1,
            mb: 0.5,
          }}
        >
          Categories
        </Typography>
      )}

      {CATEGORIES.map((category) => {
        const isSelected = selectedCategory === category.id;

        return (
          <Chip
            key={category.id}
            onClick={() => setSelectedCategory(category.id)}
            icon={category.icon}
            label={category.name}
            clickable
            sx={{
              height: isMobile ? 36 : 42,
              borderRadius: isMobile ? tokens.radii.full : tokens.radii.md,
              px: isMobile ? 1 : 1.5,
              width: isMobile ? "auto" : "100%",
              justifyContent: isMobile ? "center" : "flex-start",
              border: "1px solid",
              borderColor: isSelected
                ? "primary.main"
                : "divider",
              bgcolor: isSelected
                ? isDark
                  ? alpha(tokens.colors.primary.main, 0.16)
                  : alpha(tokens.colors.primary.main, 0.08)
                : "background.paper",
              color: isSelected ? "primary.main" : "text.secondary",
              fontWeight: isSelected ? 700 : 500,
              fontSize: "0.85rem",
              transition: "all 0.15s ease",
              "& .MuiChip-icon": {
                color: isSelected ? "primary.main" : "text.secondary",
                fontSize: "1.1rem",
                mr: 1,
              },
              "&:hover": {
                bgcolor: isSelected
                  ? isDark
                    ? alpha(tokens.colors.primary.main, 0.22)
                    : alpha(tokens.colors.primary.main, 0.12)
                  : isDark
                  ? alpha("#fff", 0.05)
                  : alpha("#000", 0.04),
              },
            }}
          />
        );
      })}
    </Box>
  );
};

export default CategorySidebar;
