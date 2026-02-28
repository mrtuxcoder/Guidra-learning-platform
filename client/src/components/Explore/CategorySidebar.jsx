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
        width: "100%",
        display: "flex",
        flexDirection: "row",
        gap: 0.8,
        justifyContent: { xs: "flex-start", lg: "center" },
        alignItems: "center",
        flexShrink: 0,
        overflowX: "auto",
        pb: 0.4,
        pt: 0.25,
        px: { xs: 0.1, lg: 0 },
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
              height: 36,
              borderRadius: "999px",
              px: 0.3,
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
