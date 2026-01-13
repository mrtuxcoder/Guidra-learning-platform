import React from "react";
import { Box, Tooltip } from "@mui/material";
import { CATEGORIES } from "./constants.jsx";
import { categoryIconStyles, countBadgeStyles } from "./styles";

const CategorySidebar = ({
  selectedCategory,
  setSelectedCategory,
  isMobile,
}) => {
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
            sx={categoryIconStyles(selectedCategory === category.id)}
          >
            {category.icon}

            {/* Badge for course count */}
            <Box sx={countBadgeStyles}>{category.count}</Box>
          </Box>
        </Tooltip>
      ))}
    </Box>
  );
};

export default CategorySidebar;
