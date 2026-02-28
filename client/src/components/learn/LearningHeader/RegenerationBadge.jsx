import React from "react";
import {
  Box,
  IconButton,
  Button,
  Tooltip,
  Badge,
  CircularProgress,
} from "@mui/material";
import { Lock, Refresh } from "@mui/icons-material";

const RegenerationBadge = ({
  remainingGenerations,
  contentLoading,
  onRegenerateContent,
  colorPalette,
  variant = "desktop",
}) => {
  const isMobile = variant === "mobile";

  if (isMobile) {
    return (
      <Tooltip
        title={
          remainingGenerations === 0
            ? "No regenerations available"
            : `${remainingGenerations} regenerations available`
        }
        placement="top"
      >
        <Badge
          badgeContent={remainingGenerations}
          max={99}
          color={remainingGenerations === 0 ? "error" : "primary"}
          overlap="circular"
          anchorOrigin={{ vertical: "top", horizontal: "right" }}
          sx={{
            "& .MuiBadge-badge": {
              minWidth: 16,
              height: 16,
              fontSize: "0.62rem",
              fontWeight: 800,
              lineHeight: 1,
              border: "1px solid rgba(255,255,255,0.35)",
            },
          }}
        >
          <IconButton
            onClick={onRegenerateContent}
            disabled={contentLoading || remainingGenerations === 0}
            sx={{
              width: 40,
              height: 40,
              borderRadius: "10px",
              color:
                remainingGenerations === 0
                  ? "#ef4444"
                  : colorPalette?.[600] || "#6d48b5",
              background:
                remainingGenerations === 0
                  ? "rgba(239, 68, 68, 0.1)"
                  : "rgba(126, 87, 194, 0.1)",
              border:
                remainingGenerations === 0
                  ? "1px solid rgba(239, 68, 68, 0.22)"
                  : "1px solid rgba(126, 87, 194, 0.15)",
              "&:hover":
                !contentLoading && remainingGenerations > 0
                  ? {
                      background: "rgba(126, 87, 194, 0.18)",
                      transform: "translateY(-1px)",
                    }
                  : {},
              transition: "all 0.2s ease",
            }}
          >
            {contentLoading ? (
              <CircularProgress size={16} />
            ) : remainingGenerations === 0 ? (
              <Lock sx={{ fontSize: 20 }} />
            ) : (
              <Refresh sx={{ fontSize: 20 }} />
            )}
          </IconButton>
        </Badge>
      </Tooltip>
    );
  }

  return (
    <Tooltip
      title={
        remainingGenerations === 0
          ? `No regenerations available`
          : `${remainingGenerations} regenerations available`
      }
    >
      <Button
        startIcon={
          remainingGenerations === 0 ? (
            <Lock sx={{ fontSize: 18 }} />
          ) : contentLoading ? (
            <CircularProgress size={18} />
          ) : (
            <Refresh sx={{ fontSize: 18 }} />
          )
        }
        onClick={onRegenerateContent}
        disabled={contentLoading || remainingGenerations === 0}
        variant="outlined"
        size="small"
        sx={{
          borderColor:
            remainingGenerations === 0
              ? "#ef4444"
              : colorPalette?.[500] || "#7e57c2",
          color:
            remainingGenerations === 0
              ? "#ef4444"
              : colorPalette?.[600] || "#6d48b5",
          background:
            remainingGenerations === 0
              ? "rgba(239, 68, 68, 0.04)"
              : "rgba(126, 87, 194, 0.04)",
          fontWeight: 600,
          borderRadius: 2,
          px: 2,
          "&:hover": {
            background:
              remainingGenerations === 0
                ? "rgba(239, 68, 68, 0.08)"
                : "rgba(126, 87, 194, 0.08)",
            transform: "translateY(-1px)",
            boxShadow: "0 4px 12px rgba(126, 87, 194, 0.1)",
          },
          transition: "all 0.2s ease",
        }}
      >
        {contentLoading ? "Regenerating..." : "Regenerate"}
      </Button>
    </Tooltip>
  );
};

export default RegenerationBadge;
