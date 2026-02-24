import React from "react";
import { IconButton, Button, Tooltip } from "@mui/material";
import { alpha, useTheme } from "@mui/material/styles";
import { Layers } from "@mui/icons-material";

const VersionButton = ({
  contentInfo,
  onOpenVersions,
  colorPalette,
  variant = "desktop",
}) => {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  const handleClick = () => {
    if (typeof onOpenVersions === "function") {
      onOpenVersions(true);
    }
  };

  const isDesktop = variant === "desktop";

  if (isDesktop) {
    // Desktop: Show button with text and icon
    return (
      <Button
        onClick={handleClick}
        size="small"
        variant="outlined"
        startIcon={<Layers sx={{ fontSize: 18 }} />}
        sx={{
          borderColor: isDark
            ? alpha(theme.palette.primary.main, 0.5)
            : colorPalette?.[300] || "rgba(126, 87, 194, 0.2)",
          color: isDark
            ? theme.palette.primary.light
            : colorPalette?.[600] || "#6d48b5",
          background: isDark
            ? alpha(theme.palette.primary.main, 0.12)
            : colorPalette?.[50] || "rgba(126, 87, 194, 0.05)",
          fontWeight: 600,
          borderRadius: 2,
          px: 2,
          textTransform: "none",
          "&:hover": {
            borderColor: isDark
              ? theme.palette.primary.main
              : colorPalette?.[500] || "#7e57c2",
            background: isDark
              ? alpha(theme.palette.primary.main, 0.22)
              : colorPalette?.[100] || "rgba(126, 87, 194, 0.1)",
            transform: "translateY(-1px)",
            boxShadow: isDark
              ? "0 6px 16px rgba(0, 0, 0, 0.35)"
              : "0 4px 12px rgba(126, 87, 194, 0.12)",
          },
          transition: "all 0.2s ease",
        }}
      >
        Versions
      </Button>
    );
  }

  // Mobile: Show icon button only
  return (
    <Tooltip title="View versions" placement="top">
      <IconButton
        onClick={handleClick}
        sx={{
          width: 36,
          height: 36,
          borderRadius: "10px",
          background: isDark
            ? alpha(theme.palette.primary.main, 0.16)
            : "rgba(126, 87, 194, 0.08)",
          color: isDark
            ? theme.palette.primary.light
            : colorPalette?.[600] || "#6d48b5",
          border: isDark
            ? `1px solid ${alpha(theme.palette.primary.main, 0.4)}`
            : "1px solid rgba(126, 87, 194, 0.12)",
          padding: "7px",
          "&:hover": {
            background: isDark
              ? alpha(theme.palette.primary.main, 0.26)
              : "rgba(126, 87, 194, 0.15)",
            transform: "translateY(-1px)",
          },
          transition: "all 0.2s ease",
        }}
      >
        <Layers sx={{ fontSize: 16 }} />
      </IconButton>
    </Tooltip>
  );
};

export default VersionButton;
