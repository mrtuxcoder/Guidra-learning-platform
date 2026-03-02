import React from "react";
import { Box, Tooltip, Avatar } from "@mui/material";
import { AutoAwesome } from "@mui/icons-material";
import { purpleTheme } from "../constants";

const DAILY_REGEN_LIMIT = 6;

const DailyRegenBadge = ({ remaining, isLoading }) => {
  if (isLoading) return null;

  const isLow = remaining <= 2;
  const isOut = remaining === 0;

  return (
    <Tooltip
      title={
        isOut
          ? "Daily regeneration limit reached. Resets at midnight."
          : `${remaining}/${DAILY_REGEN_LIMIT} regenerations remaining today`
      }
      arrow
      placement="bottom"
    >
      <Box
        sx={{
          position: "relative",
          display: "inline-flex",
        }}
      >
        <Avatar
          sx={{
            width: { xs: 36, sm: 40 },
            height: { xs: 36, sm: 40 },
            fontSize: { xs: "0.875rem", sm: "0.95rem" },
            fontWeight: 700,
            bgcolor: isOut
              ? "rgba(211, 47, 47, 0.1)"
              : isLow
              ? "rgba(237, 108, 2, 0.1)"
              : `${purpleTheme.primaryLight}20`,
            color: isOut
              ? "error.main"
              : isLow
              ? "warning.main"
              : purpleTheme.primaryDark,
            border: `2px solid ${
              isOut
                ? "rgba(211, 47, 47, 0.4)"
                : isLow
                ? "rgba(237, 108, 2, 0.4)"
                : `${purpleTheme.primaryLight}50`
            }`,
            cursor: "default",
            transition: "all 0.3s ease",
            "&:hover": {
              bgcolor: isOut
                ? "rgba(211, 47, 47, 0.15)"
                : isLow
                ? "rgba(237, 108, 2, 0.15)"
                : `${purpleTheme.primaryLight}30`,
              transform: "scale(1.05)",
            },
          }}
        >
          {`${remaining}/${DAILY_REGEN_LIMIT}`}
        </Avatar>
        <AutoAwesome
          sx={{
            position: "absolute",
            bottom: -2,
            right: -2,
            fontSize: { xs: 14, sm: 16 },
            color: isOut
              ? "error.main"
              : isLow
              ? "warning.main"
              : purpleTheme.primary,
            bgcolor: "background.paper",
            borderRadius: "50%",
            padding: "2px",
            boxShadow: "0 1px 3px rgba(0,0,0,0.12)",
          }}
        />
      </Box>
    </Tooltip>
  );
};

export default DailyRegenBadge;
