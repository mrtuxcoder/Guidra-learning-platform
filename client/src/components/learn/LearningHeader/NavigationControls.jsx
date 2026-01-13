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
  colorPalette,
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
          background: "rgba(126, 87, 194, 0.06)",
          borderRadius: "12px",
          p: 0.5,
          border: "1px solid rgba(126, 87, 194, 0.1)",
        }}
      >
        <Tooltip title="Previous lesson" placement="top">
          <IconButton
            onClick={onPrevious}
            disabled={!hasPrevious}
            size="small"
            sx={{
              width: 28,
              height: 28,
              borderRadius: "8px",
              color: hasPrevious
                ? colorPalette?.[600] || "#6d48b5"
                : "rgba(126, 87, 194, 0.3)",
              background: hasPrevious
                ? "rgba(126, 87, 194, 0.1)"
                : "transparent",
              "&:hover": hasPrevious
                ? {
                    background: "rgba(126, 87, 194, 0.18)",
                    transform: "scale(1.1)",
                  }
                : {},
              transition: "all 0.2s ease",
            }}
          >
            <NavigateBefore sx={{ fontSize: 14 }} />
          </IconButton>
        </Tooltip>

        {/* Progress Indicator */}
        <Tooltip
          title={`Lesson ${currentIndex + 1} of ${totalSubtopics}`}
          placement="top"
        >
          <Box
            component="span"
            sx={{
              px: 1.2,
              textAlign: "center",
              minWidth: 40,
            }}
          >
            <Typography
              variant="caption"
              sx={{
                color: colorPalette?.[700] || "#5d3a9f",
                fontSize: "0.65rem",
                fontWeight: 800,
                lineHeight: 1,
                display: "block",
              }}
            >
              {currentIndex >= 0 ? currentIndex + 1 : 1}
            </Typography>
            <Typography
              variant="caption"
              sx={{
                color: colorPalette?.[500] || "#7e57c2",
                fontSize: "0.5rem",
                fontWeight: 600,
                lineHeight: 1,
                display: "block",
              }}
            >
              of {totalSubtopics}
            </Typography>
          </Box>
        </Tooltip>

        <Tooltip title="Next lesson" placement="top">
          <IconButton
            onClick={onNext}
            disabled={!hasNext}
            size="small"
            sx={{
              width: 28,
              height: 28,
              borderRadius: "8px",
              color: hasNext
                ? colorPalette?.[600] || "#6d48b5"
                : "rgba(126, 87, 194, 0.3)",
              background: hasNext ? "rgba(126, 87, 194, 0.1)" : "transparent",
              "&:hover": hasNext
                ? {
                    background: "rgba(126, 87, 194, 0.18)",
                    transform: "scale(1.1)",
                  }
                : {},
              transition: "all 0.2s ease",
            }}
          >
            <NavigateNext sx={{ fontSize: 14 }} />
          </IconButton>
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
        gap: 1.5,
        background: "rgba(126, 87, 194, 0.03)",
        borderRadius: 2,
        p: 1,
        border: "1px solid rgba(126, 87, 194, 0.08)",
      }}
    >
      <Tooltip title="Previous lesson">
        <IconButton
          onClick={onPrevious}
          disabled={!hasPrevious}
          sx={{
            width: 36,
            height: 36,
            borderRadius: "10px",
            color: hasPrevious
              ? colorPalette?.[600] || "#6d48b5"
              : "rgba(126, 87, 194, 0.3)",
            background: hasPrevious
              ? "rgba(126, 87, 194, 0.08)"
              : "transparent",
            "&:hover": hasPrevious
              ? {
                  background: "rgba(126, 87, 194, 0.15)",
                  transform: "scale(1.1)",
                }
              : {},
            transition: "all 0.2s ease",
          }}
        >
          <NavigateBefore />
        </IconButton>
      </Tooltip>

      {/* Progress */}
      <Box component="span" sx={{ textAlign: "center", minWidth: 60 }}>
        <Typography
          variant="body2"
          sx={{
            color: colorPalette?.[700] || "#5d3a9f",
            fontWeight: 700,
            lineHeight: 1.2,
          }}
        >
          {currentIndex + 1}
        </Typography>
        <Typography
          variant="caption"
          sx={{
            color: colorPalette?.[500] || "#7e57c2",
            fontWeight: 600,
            lineHeight: 1.2,
          }}
        >
          of {totalSubtopics}
        </Typography>
      </Box>

      <Tooltip title="Next lesson">
        <IconButton
          onClick={onNext}
          disabled={!hasNext}
          sx={{
            width: 36,
            height: 36,
            borderRadius: "10px",
            color: hasNext
              ? colorPalette?.[600] || "#6d48b5"
              : "rgba(126, 87, 194, 0.3)",
            background: hasNext ? "rgba(126, 87, 194, 0.08)" : "transparent",
            "&:hover": hasNext
              ? {
                  background: "rgba(126, 87, 194, 0.15)",
                  transform: "scale(1.1)",
                }
              : {},
            transition: "all 0.2s ease",
          }}
        >
          <NavigateNext />
        </IconButton>
      </Tooltip>
    </Box>
  );
};

export default NavigationControls;
