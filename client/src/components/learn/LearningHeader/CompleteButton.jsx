import React from "react";
import { IconButton, Button, Tooltip, CircularProgress } from "@mui/material";
import { CheckCircle } from "@mui/icons-material";

const CompleteButton = ({
  selectedSubtopic,
  updatingSubtopic,
  onCompleteSubtopic,
  variant = "desktop",
}) => {
  const isMobile = variant === "mobile";
  const isUpdating = updatingSubtopic === selectedSubtopic.name;
  const isDisabled =
    isUpdating ||
    !selectedSubtopic.understandingLevel ||
    selectedSubtopic.understandingLevel < 1;

  if (selectedSubtopic.completed) {
    return (
      <Tooltip title="Lesson completed" placement="top">
        <IconButton
          sx={{
            width: isMobile ? 36 : 36,
            height: isMobile ? 36 : 36,
            borderRadius: isMobile ? "10px" : "12px",
            background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
            color: "white",
            border: "1px solid rgba(16, 185, 129, 0.3)",
            boxShadow: "0 2px 8px rgba(16, 185, 129, 0.25)",
            cursor: "default",
            "&:hover": {
              background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
              transform: "none",
            },
          }}
          disabled
        >
          <CheckCircle sx={{ fontSize: isMobile ? 17 : 20 }} />
        </IconButton>
      </Tooltip>
    );
  }

  if (isMobile) {
    return (
      <Tooltip
        title={
          isUpdating
            ? "Completing..."
            : isDisabled
            ? "Complete the content first"
            : "Mark as complete"
        }
        placement="top"
      >
        <IconButton
          onClick={() => onCompleteSubtopic?.(selectedSubtopic)}
          disabled={isDisabled}
          sx={{
            width: 44,
            height: 44,
            borderRadius: "10px",
            background: `linear-gradient(135deg, #10b981 0%, #059669 100%)`,
            color: "white",
            border: "1px solid rgba(16, 185, 129, 0.3)",
            boxShadow: "0 2px 8px rgba(16, 185, 129, 0.25)",
            "&:hover": !isDisabled
              ? {
                  background: `linear-gradient(135deg, #059669 0%, #047857 100%)`,
                  transform: "translateY(-1px)",
                  boxShadow: "0 4px 12px rgba(16, 185, 129, 0.35)",
                }
              : {},
            transition: "all 0.2s ease",
          }}
        >
          {isUpdating ? (
            <CircularProgress size={18} sx={{ color: "white" }} />
          ) : (
            <CheckCircle sx={{ fontSize: 22 }} />
          )}
        </IconButton>
      </Tooltip>
    );
  }

  return (
    <Button
      startIcon={
        isUpdating ? (
          <CircularProgress size={18} />
        ) : (
          <CheckCircle sx={{ fontSize: 18 }} />
        )
      }
      onClick={() => onCompleteSubtopic?.(selectedSubtopic)}
      disabled={isDisabled}
      variant="contained"
      size="small"
      sx={{
        background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
        fontWeight: 600,
        borderRadius: 2,
        px: 2.5,
        boxShadow: "0 2px 12px rgba(16, 185, 129, 0.3)",
        "&:hover": {
          background: "linear-gradient(135deg, #059669 0%, #047857 100%)",
          transform: "translateY(-1px)",
          boxShadow: "0 4px 16px rgba(16, 185, 129, 0.4)",
        },
        transition: "all 0.2s ease",
      }}
    >
      {isUpdating ? "Completing..." : "Complete"}
    </Button>
  );
};

export default CompleteButton;
