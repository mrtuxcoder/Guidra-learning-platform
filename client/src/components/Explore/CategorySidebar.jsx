import React from "react";
import { Box, Tooltip, useTheme, alpha } from "@mui/material";
import { CATEGORIES } from "./constants.jsx";

const CategorySidebar = ({
  selectedCategory,
  setSelectedCategory,
  isMobile,
}) => {
  const theme = useTheme();
  
  const getCategoryIconStyles = (isSelected) => ({
    width: { xs: "50px", lg: "60px" },
    height: { xs: "50px", lg: "60px" },
    minWidth: { xs: "50px", lg: "60px" },
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 2,
    backgroundColor: isSelected ? theme.palette.primary.main : "transparent",
    color: isSelected ? "white" : theme.palette.primary.main,
    border: `2px solid ${isSelected ? theme.palette.primary.main : alpha(theme.palette.primary.main, 0.2)}`,
    cursor: "pointer",
    transition: "all 0.2s ease",
    position: "relative",
    "&:hover": {
      backgroundColor: isSelected ? theme.palette.primary.dark : alpha(theme.palette.primary.main, 0.05),
      transform: "scale(1.05)",
    },
  });
  
  const getCountBadgeStyles = () => ({
    position: "absolute",
    top: -4,
    right: -4,
    backgroundColor: theme.palette.primary.main,
    color: "white",
    borderRadius: "50%",
    width: 20,
    height: 20,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "0.7rem",
    fontWeight: "bold",
  });
  
  return (
    <Box
      sx={{
        width: { xs: "100%", lg: "80px" },
        display: "flex",
        flexDirection: { xs: "row", lg: "column" },
        gap: 1,
        justifyContent: { xs: "flex-start", lg: "center" },
        alignItems: "center",
        flexShrink: 0,
        overflowX: { xs: "auto", lg: "visible" },
        pb: { xs: 1, lg: 0 },
        "&::-webkit-scrollbar": { display: "none" },
        scrollbarWidth: "none",
      }}
    >
      {CATEGORIES.map((category) => (
        <Tooltip
          key={category.id}
          title={category.name}
          placement={isMobile ? "bottom" : "right"}
          arrow
        >
          <Box
            onClick={() => setSelectedCategory(category.id)}
            sx={getCategoryIconStyles(selectedCategory === category.id)}
          >
            {category.icon}

            {/* Badge for course count */}
            <Box sx={getCountBadgeStyles()}>{category.count}</Box>
          </Box>
        </Tooltip>
      ))}
    </Box>
  );
};

export default CategorySidebar;
