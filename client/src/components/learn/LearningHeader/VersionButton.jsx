import React from "react";
import { IconButton, Button, Tooltip } from "@mui/material";
import { Layers } from "@mui/icons-material";

const VersionButton = ({
  contentInfo,
  onOpenVersions,
  colorPalette,
  variant = "desktop",
}) => {
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
          borderColor: colorPalette?.[300] || "rgba(126, 87, 194, 0.2)",
          color: colorPalette?.[600] || "#6d48b5",
          background: colorPalette?.[50] || "rgba(126, 87, 194, 0.05)",
          fontWeight: 600,
          borderRadius: 2,
          px: 2,
          textTransform: "none",
          "&:hover": {
            borderColor: colorPalette?.[500] || "#7e57c2",
            background: colorPalette?.[100] || "rgba(126, 87, 194, 0.1)",
            transform: "translateY(-1px)",
            boxShadow: "0 4px 12px rgba(126, 87, 194, 0.12)",
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
          width: 32,
          height: 32,
          borderRadius: "8px",
          background: "rgba(126, 87, 194, 0.08)",
          color: colorPalette?.[600] || "#6d48b5",
          border: "1px solid rgba(126, 87, 194, 0.12)",
          padding: "6px",
          "&:hover": {
            background: "rgba(126, 87, 194, 0.15)",
            transform: "translateY(-1px)",
          },
          transition: "all 0.2s ease",
        }}
      >
        <Layers sx={{ fontSize: 15 }} />
      </IconButton>
    </Tooltip>
  );
};

export default VersionButton;
