import React from "react";
import { Box, Chip, useTheme, alpha, Typography, Button } from "@mui/material";
import { CATEGORIES } from "./constants.jsx";

const CategorySidebar = ({
  selectedCategory,
  setSelectedCategory,
  isMobile,
}) => {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";

  if (isMobile) {
    return (
      <Box
        sx={{
          width: "100%",
          display: "flex",
          gap: 1,
          alignItems: "center",
          overflowX: "auto",
          pb: 1.5,
          scrollbarWidth: "none",
          "&::-webkit-scrollbar": { display: "none" },
        }}
      >
        {CATEGORIES.map((category) => {
          const isSelected = selectedCategory === category.id;

          return (
            <Chip
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              icon={React.cloneElement(category.icon, { sx: { fontSize: 16 } })}
              label={category.name}
              clickable
              size="small"
              sx={{
                height: 32,
                borderRadius: "999px",
                px: 0.75,
                border: "1px solid",
                borderColor: isSelected ? "primary.main" : "divider",
                bgcolor: isSelected
                  ? isDark
                    ? alpha(theme.palette.primary.main, 0.16)
                    : alpha(theme.palette.primary.main, 0.08)
                  : "background.paper",
                color: isSelected ? "primary.main" : "text.secondary",
                fontWeight: isSelected ? 600 : 500,
                fontSize: "0.8rem",
                "& .MuiChip-icon": {
                  color: isSelected ? "primary.main" : "text.secondary",
                },
              }}
            />
          );
        })}
      </Box>
    );
  }

  return (
    <Box
      sx={{
        width: { md: 210, lg: 220 },
        display: "flex",
        flexDirection: "column",
        gap: 0.5,
        flexShrink: 0,
        position: "sticky",
        top: 16,
      }}
    >
      <Typography
        variant="caption"
        sx={{
          fontWeight: 700,
          textTransform: "uppercase",
          letterSpacing: "0.06em",
          color: "text.secondary",
          px: 1.25,
          mb: 0.75,
          fontSize: "0.72rem",
        }}
      >
        Categories
      </Typography>

      {CATEGORIES.map((category) => {
        const isSelected = selectedCategory === category.id;

        return (
          <Button
            key={category.id}
            onClick={() => setSelectedCategory(category.id)}
            startIcon={React.cloneElement(category.icon, {
              sx: {
                fontSize: 16,
                color: isSelected ? "primary.main" : "text.secondary",
              },
            })}
            sx={{
              height: 36,
              borderRadius: "6px",
              px: 1.25,
              justifyContent: "flex-start",
              textTransform: "none",
              fontWeight: isSelected ? 600 : 500,
              fontSize: "0.84rem",
              border: "1px solid",
              borderColor: isSelected
                ? isDark
                  ? alpha(theme.palette.primary.main, 0.3)
                  : alpha(theme.palette.primary.main, 0.2)
                : "transparent",
              bgcolor: isSelected
                ? isDark
                  ? alpha(theme.palette.primary.main, 0.15)
                  : alpha(theme.palette.primary.main, 0.08)
                : "transparent",
              color: isSelected ? "primary.main" : "text.secondary",
              transition: "all 0.15s ease",
              "&:hover": {
                color: "text.primary",
                bgcolor: isSelected
                  ? isDark
                    ? alpha(theme.palette.primary.main, 0.2)
                    : alpha(theme.palette.primary.main, 0.12)
                  : "action.hover",
              },
            }}
          >
            {category.name}
          </Button>
        );
      })}
    </Box>
  );
};

export default CategorySidebar;
