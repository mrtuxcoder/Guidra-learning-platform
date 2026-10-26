import React from "react";
import { IconButton, Button, Tooltip } from "@mui/material";
import { Layers } from "@mui/icons-material";

const VersionButton = ({
  onOpenVersions,
  variant = "desktop",
}) => {
  const handleClick = () => {
    if (typeof onOpenVersions === "function") {
      onOpenVersions(true);
    }
  };

  const isDesktop = variant === "desktop";

  if (isDesktop) {
    return (
      <Button
        onClick={handleClick}
        size="small"
        variant="outlined"
        startIcon={<Layers sx={{ fontSize: 15 }} />}
        sx={{
          height: 32,
          borderColor: "divider",
          color: "text.secondary",
          bgcolor: "background.paper",
          fontWeight: 500,
          borderRadius: "6px",
          px: 1.25,
          fontSize: "0.8rem",
          "&:hover": {
            borderColor: "divider",
            color: "text.primary",
            bgcolor: "action.hover",
          },
          transition: "all 0.15s ease",
        }}
      >
        Versions
      </Button>
    );
  }

  return (
    <Tooltip title="View content versions" placement="top">
      <IconButton
        onClick={handleClick}
        size="small"
        sx={{
          width: 36,
          height: 36,
          borderRadius: "8px",
          border: "1px solid",
          borderColor: "divider",
          bgcolor: "background.paper",
          color: "text.primary",
          "&:hover": {
            borderColor: "primary.main",
            bgcolor: "action.hover",
          },
        }}
      >
        <Layers sx={{ fontSize: 18 }} />
      </IconButton>
    </Tooltip>
  );
};

export default VersionButton;