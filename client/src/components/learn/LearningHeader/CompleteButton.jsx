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
  const isCompleted = !!selectedSubtopic.completed;

  if (isCompleted) {
    return (
      <Tooltip title="Lesson completed" placement="top">
        <span>
          <IconButton
            size="small"
            sx={{
              width: 36,
              height: 36,
              borderRadius: "8px",
              bgcolor: "success.main",
              color: "white",
              cursor: "default",
              "&:hover": {
                bgcolor: "success.main",
              },
            }}
            disabled
          >
            <CheckCircle sx={{ fontSize: 18 }} />
          </IconButton>
        </span>
      </Tooltip>
    );
  }

  if (isMobile) {
    return (
      <Tooltip
        title={isUpdating ? "Completing..." : "Complete subtopic"}
        placement="top"
      >
        <span>
          <IconButton
            onClick={() => onCompleteSubtopic?.(selectedSubtopic)}
            disabled={isUpdating}
            size="small"
            sx={{
              width: 36,
              height: 36,
              borderRadius: "8px",
              bgcolor: "success.main",
              color: "white",
              "&:hover": {
                bgcolor: "success.dark",
              },
            }}
          >
            {isUpdating ? (
              <CircularProgress size={16} sx={{ color: "white" }} />
            ) : (
              <CheckCircle sx={{ fontSize: 18 }} />
            )}
          </IconButton>
        </span>
      </Tooltip>
    );
  }

  return (
    <Button
      startIcon={
        isUpdating ? (
          <CircularProgress size={14} color="inherit" />
        ) : (
          <CheckCircle sx={{ fontSize: 15 }} />
        )
      }
      onClick={() => onCompleteSubtopic?.(selectedSubtopic)}
      disabled={isUpdating}
      variant="contained"
      color="primary"
      size="small"
      sx={{
        height: 32,
        fontWeight: 600,
        borderRadius: "6px",
        px: 1.75,
        fontSize: "0.82rem",
        boxShadow: "none",
        "&:hover": {
          boxShadow: "none",
        },
        transition: "all 0.15s ease",
      }}
    >
      {isUpdating ? "Completing..." : "Complete"}
    </Button>
  );
};

export default CompleteButton;