import React from "react";
import { Chip, Box } from "@mui/material";
import { CheckCircle, Cached, AutoAwesome } from "@mui/icons-material";

const StatusChips = ({ selectedSubtopic, contentInfo }) => {
  return (
    <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
      {selectedSubtopic?.completed && (
        <Chip
          icon={<CheckCircle sx={{ fontSize: "14px !important", color: "inherit" }} />}
          label="Completed"
          color="success"
          size="small"
          sx={{
            fontSize: "0.72rem",
            fontWeight: 600,
            borderRadius: "6px",
            height: "28px",
          }}
        />
      )}
      <Chip
        icon={
          contentInfo?.source === "cache" ? (
            <Cached sx={{ fontSize: "14px !important" }} />
          ) : (
            <AutoAwesome sx={{ fontSize: "13px !important" }} />
          )
        }
        label={contentInfo?.source === "cache" ? "Cached" : "AI Generated"}
        size="small"
        variant="outlined"
        sx={{
          fontSize: "0.72rem",
          fontWeight: 500,
          borderRadius: "6px",
          height: "28px",
          borderColor: "divider",
          bgcolor: "transparent",
          color: "text.secondary",
        }}
      />
    </Box>
  );
};

export default StatusChips;