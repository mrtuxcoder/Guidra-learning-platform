import React from "react";
import {
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
  variant = "desktop",
}) => {
  const isMobile = variant === "mobile";
  const isLocked = remainingGenerations === 0;

  if (isMobile) {
    return (
      <Tooltip
        title={
          isLocked
            ? "No regenerations remaining"
            : `${remainingGenerations} regenerations left`
        }
        placement="top"
      >
        <Badge
          badgeContent={remainingGenerations}
          max={99}
          color={isLocked ? "error" : "primary"}
          overlap="circular"
          anchorOrigin={{ vertical: "top", horizontal: "right" }}
          sx={{
            "& .MuiBadge-badge": {
              minWidth: 16,
              height: 16,
              fontSize: "0.62rem",
              fontWeight: 700,
            },
          }}
        >
          <span>
            <IconButton
              onClick={onRegenerateContent}
              disabled={contentLoading || isLocked}
              size="small"
              sx={{
                width: 36,
                height: 36,
                borderRadius: "8px",
                border: "1px solid",
                borderColor: "divider",
                bgcolor: "background.paper",
                color: isLocked ? "text.secondary" : "primary.main",
                "&:hover": {
                  borderColor: "primary.main",
                  bgcolor: "action.hover",
                },
              }}
            >
              {contentLoading ? (
                <CircularProgress size={16} color="inherit" />
              ) : isLocked ? (
                <Lock sx={{ fontSize: 16 }} />
              ) : (
                <Refresh sx={{ fontSize: 18 }} />
              )}
            </IconButton>
          </span>
        </Badge>
      </Tooltip>
    );
  }

  return (
    <Tooltip
      title={
        isLocked
          ? "No regenerations left for this lesson"
          : `${remainingGenerations} regenerations remaining`
      }
    >
      <span>
        <Button
          onClick={onRegenerateContent}
          disabled={contentLoading || isLocked}
          size="small"
          variant="outlined"
          startIcon={
            contentLoading ? (
              <CircularProgress size={14} color="inherit" />
            ) : isLocked ? (
              <Lock sx={{ fontSize: 14 }} />
            ) : (
              <Refresh sx={{ fontSize: 15 }} />
            )
          }
          sx={{
            height: 32,
            borderColor: "divider",
            color: isLocked ? "text.secondary" : "text.secondary",
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
            "&.Mui-disabled": {
              opacity: 0.5,
            },
            transition: "all 0.15s ease",
          }}
        >
          {contentLoading ? "Generating..." : `Regenerate (${remainingGenerations})`}
        </Button>
      </span>
    </Tooltip>
  );
};

export default RegenerationBadge;