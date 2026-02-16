import React from "react";
import { Box, Typography, Button } from "@mui/material";
import { History } from "@mui/icons-material";

const Header = ({ title, topic, isMobile, colorPalette, onOpenVersions }) => (
  <Box
    sx={{
      p: isMobile ? 1 : 1.5,
      borderBottom: `1px solid ${colorPalette[100]}`,
      background: "white",
    }}
  >
    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
      <Box sx={{ flex: 1 }}>
      <Typography
        variant={isMobile ? "subtitle2" : "h6"}
        fontWeight="600"
        sx={{
          color: colorPalette[700],
          fontSize: isMobile ? "0.9rem" : "1.25rem",
          lineHeight: 1.2,
          mb: 0.25,
        }}
      >
        {title}
      </Typography>
      <Typography
        variant="caption"
        sx={{
          color: colorPalette[500],
          fontSize: isMobile ? "0.7rem" : "0.875rem",
          fontWeight: 500,
        }}
      >
        {topic}
      </Typography>
      </Box>
      <Button
        size={isMobile ? "small" : "medium"}
        variant="outlined"
        onClick={onOpenVersions}
        startIcon={<History sx={{ fontSize: 18 }} />}
        sx={{
          borderColor: colorPalette[300],
          color: colorPalette[600],
          background: colorPalette[50],
          fontWeight: 600,
          borderRadius: 2,
          px: 2,
          "&:hover": {
            borderColor: colorPalette[500],
            background: colorPalette[100],
            transform: "translateY(-1px)",
            boxShadow: "0 4px 12px rgba(126, 87, 194, 0.12)",
          },
          transition: "all 0.2s ease",
        }}
      >
        Versions
      </Button>
    </Box>
  </Box>
);

export default Header;
