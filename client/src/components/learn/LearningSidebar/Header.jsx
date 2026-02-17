import React from "react";
import { Box, Typography } from "@mui/material";
import { alpha } from "@mui/material/styles";

const Header = ({ colorPalette }) => {
  return (
    <Box
      sx={{
        p: 3,
        borderBottom: "1px solid",
        borderColor: "divider",
        bgcolor: "background.paper",
      }}
    >
      <Typography
        variant="h6"
        fontWeight="700"
        sx={{
          color: "text.primary",
          display: "flex",
          alignItems: "center",
          gap: 1.5,
        }}
      >
        <Box
          sx={{
            width: 24,
            height: 24,
            borderRadius: "6px",
            backgroundColor: colorPalette[600],
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 12,
            color: "white",
            fontWeight: "bold",
            boxShadow: `0 2px 8px ${alpha(colorPalette[600], 0.3)}`,
          }}
        >
          ●
        </Box>
        Course Content
      </Typography>
    </Box>
  );
};

export default Header;
