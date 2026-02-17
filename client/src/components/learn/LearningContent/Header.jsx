import React from "react";
import { Box, Typography } from "@mui/material";

const Header = ({ title, topic, isMobile, colorPalette }) => (
  <Box
    sx={{
      p: isMobile ? 1 : 1.5,
      borderBottom: "1px solid",
      borderColor: "divider",
      bgcolor: "background.paper",
    }}
  >
    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
      <Box sx={{ flex: 1 }}>
      <Typography
        variant={isMobile ? "subtitle2" : "h6"}
        fontWeight="600"
        sx={{
          color: "text.primary",
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
    </Box>
  </Box>
);

export default Header;
