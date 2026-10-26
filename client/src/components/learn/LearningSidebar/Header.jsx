import React from "react";
import { Box, Typography } from "@mui/material";
import { AutoStories } from "@mui/icons-material";

const Header = () => {
  return (
    <Box
      sx={{
        px: 2.5,
        py: 2,
        borderBottom: "1px solid",
        borderColor: "divider",
        bgcolor: "background.paper",
        display: "flex",
        alignItems: "center",
        gap: 1.25,
      }}
    >
      <Box
        sx={{
          width: 28,
          height: 28,
          borderRadius: "6px",
          bgcolor: (theme) =>
            theme.palette.mode === "dark"
              ? "rgba(101, 88, 217, 0.15)"
              : "rgba(101, 88, 217, 0.08)",
          color: "primary.main",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <AutoStories sx={{ fontSize: 15 }} />
      </Box>
      <Typography
        variant="subtitle1"
        sx={{
          fontWeight: 700,
          fontSize: "0.95rem",
          color: "text.primary",
          letterSpacing: "-0.01em",
        }}
      >
        Curriculum
      </Typography>
    </Box>
  );
};

export default Header;