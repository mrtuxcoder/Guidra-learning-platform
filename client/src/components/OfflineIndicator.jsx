import React from "react";
import { Box, Typography, Collapse, useTheme, alpha } from "@mui/material";
import { Cloud, CloudOff } from "@mui/icons-material";
import { useOnlineStatus } from "../hooks/useOnlineStatus";

const OfflineIndicator = () => {
  const isOnline = useOnlineStatus();
  const theme = useTheme();

  return (
    <Collapse in={!isOnline}>
      <Box
        sx={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 9999,
          background: `linear-gradient(135deg, ${theme.palette.warning.main} 0%, ${theme.palette.warning.dark} 100%)`,
          color: theme.palette.warning.contrastText,
          py: 1.5,
          px: 2,
          display: "flex",
          alignItems: "center",
          gap: 1.5,
          boxShadow: `0 4px 12px ${alpha(theme.palette.warning.main, 0.3)}`,
        }}
      >
        <CloudOff sx={{ fontSize: 20, flexShrink: 0 }} />
        <Box sx={{ flex: 1 }}>
          <Typography variant="body2" sx={{ fontWeight: 600 }}>
            You're offline
          </Typography>
          <Typography variant="caption" sx={{ opacity: 0.9 }}>
            Using cached content. Some features may be limited.
          </Typography>
        </Box>
      </Box>
      {/* Spacer to prevent content overlap */}
      <Box sx={{ h: 56 }} />
    </Collapse>
  );
};

export default OfflineIndicator;
