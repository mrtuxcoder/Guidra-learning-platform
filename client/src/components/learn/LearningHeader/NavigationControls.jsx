import React from "react";
import { Box, IconButton, Tooltip, Typography } from "@mui/material";
import { NavigateBefore, NavigateNext } from "@mui/icons-material";

const NavigationControls = ({
  currentIndex,
  totalSubtopics,
  hasPrevious,
  hasNext,
  onPrevious,
  onNext,
  variant = "desktop",
}) => {
  const isMobile = variant === "mobile";

  if (isMobile) {
    return (
      <Box
        component="nav"
        sx={{
          display: "flex",
          alignItems: "center",
          bgcolor: "background.default",
          borderRadius: "8px",
          p: 0.5,
          border: "1px solid",
          borderColor: "divider",
        }}
      >
        <Tooltip title="Previous lesson" placement="top">
          <span>
            <IconButton
              onClick={onPrevious}
              disabled={!hasPrevious}
              size="small"
              sx={{
                width: 28,
                height: 28,
                borderRadius: "6px",
                color: "text.primary",
                "&.Mui-disabled": { opacity: 0.3 },
              }}
            >
              <NavigateBefore sx={{ fontSize: 18 }} />
            </IconButton>
          </span>
        </Tooltip>

        <Typography
          variant="caption"
          sx={{
            px: 1,
            fontWeight: 600,
            color: "text.secondary",
            fontSize: "0.75rem",
          }}
        >
          {`${currentIndex + 1} / ${totalSubtopics}`}
        </Typography>

        <Tooltip title="Next lesson" placement="top">
          <span>
            <IconButton
              onClick={onNext}
              disabled={!hasNext}
              size="small"
              sx={{
                width: 28,
                height: 28,
                borderRadius: "6px",
                color: "text.primary",
                "&.Mui-disabled": { opacity: 0.3 },
              }}
            >
              <NavigateNext sx={{ fontSize: 18 }} />
            </IconButton>
          </span>
        </Tooltip>
      </Box>
    );
  }

  return (
    <Box
      component="nav"
      sx={{
        display: "flex",
        alignItems: "center",
        height: 32,
        bgcolor: "background.default",
        borderRadius: "6px",
        px: 0.5,
        border: "1px solid",
        borderColor: "divider",
        boxSizing: "border-box",
      }}
    >
      <Tooltip title="Previous lesson">
        <span>
          <IconButton
            onClick={onPrevious}
            disabled={!hasPrevious}
            size="small"
            sx={{
              width: 24,
              height: 24,
              borderRadius: "4px",
              color: "text.secondary",
              "&:hover": { color: "text.primary", bgcolor: "action.hover" },
              "&.Mui-disabled": { opacity: 0.25 },
            }}
          >
            <NavigateBefore sx={{ fontSize: 18 }} />
          </IconButton>
        </span>
      </Tooltip>

      <Box component="span" sx={{ textAlign: "center", px: 0.75 }}>
        <Typography
          variant="caption"
          sx={{
            color: "text.primary",
            fontWeight: 700,
            fontSize: "0.78rem",
            lineHeight: 1,
            userSelect: "none",
          }}
        >
          {currentIndex + 1}
          <Typography
            component="span"
            variant="caption"
            sx={{
              color: "text.secondary",
              fontWeight: 500,
              fontSize: "0.72rem",
              ml: 0.4,
            }}
          >
            / {totalSubtopics}
          </Typography>
        </Typography>
      </Box>

      <Tooltip title="Next lesson">
        <span>
          <IconButton
            onClick={onNext}
            disabled={!hasNext}
            size="small"
            sx={{
              width: 24,
              height: 24,
              borderRadius: "4px",
              color: "text.secondary",
              "&:hover": { color: "text.primary", bgcolor: "action.hover" },
              "&.Mui-disabled": { opacity: 0.25 },
            }}
          >
            <NavigateNext sx={{ fontSize: 18 }} />
          </IconButton>
        </span>
      </Tooltip>
    </Box>
  );
};

export default NavigationControls;