import React from "react";
import { Box, Chip, useTheme, alpha } from "@mui/material";
import { CATEGORIES } from "./constants.jsx";

const CategorySidebar = ({
  selectedCategory,
  setSelectedCategory,
  isMobile,
}) => {
  const theme = useTheme();

  return (
    <Box
      sx={{
        width: isMobile ? "100%" : { lg: 260 },
        display: "flex",
        flexDirection: isMobile ? "row" : "column",
        gap: 0.8,
        justifyContent: "flex-start",
        alignItems: isMobile ? "center" : "stretch",
        flexShrink: 0,
        overflowX: isMobile ? "auto" : "visible",
        overflowY: isMobile ? "visible" : "auto",
        maxHeight: isMobile ? "none" : "calc(100vh - 180px)",
        position: isMobile ? "static" : "sticky",
        top: isMobile ? "auto" : 92,
        pb: 0.4,
        pt: 0.25,
        px: { xs: 0.1, lg: 0.25 },
        "&::-webkit-scrollbar": { display: "none" },
        scrollbarWidth: "none",
      }}
    >
      {CATEGORIES.map((category) => {
        const isSelected = selectedCategory === category.id;

        return (
          <Chip
            key={category.id}
            onClick={() => setSelectedCategory(category.id)}
            icon={category.icon}
            label={isMobile ? category.name.replace("Courses", "").trim() : category.name}
            clickable
            size="medium"
            sx={{
              height: isMobile ? 36 : 40,
              borderRadius: "999px",
              px: isMobile ? 0.3 : 1,
              width: isMobile ? "auto" : "100%",
              justifyContent: isMobile ? "center" : "flex-start",
              border: "1px solid",
              borderColor: isSelected
                ? theme.palette.primary.main
                : alpha(theme.palette.text.primary, 0.14),
              bgcolor: isSelected
                ? alpha(theme.palette.primary.main, 0.12)
                : "background.paper",
              color: isSelected ? theme.palette.primary.main : "text.secondary",
              fontWeight: isSelected ? 600 : 500,
              "& .MuiChip-icon": {
                color: isSelected ? theme.palette.primary.main : "text.secondary",
                fontSize: "1rem",
              },
            }}
          />
        );
      })}
    </Box>
  );
};

export default CategorySidebar;
