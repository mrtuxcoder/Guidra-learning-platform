import React from "react";
import { FormControlLabel, Radio, Box, Typography } from "@mui/material";
import { CheckCircle, Cancel } from "@mui/icons-material";

const AnswerOption = ({
  option,
  value,
  disabled,
  answerStatus,
  onSelect,
  isMobile,
  colorPalette,
}) => (
  <FormControlLabel
    value={value}
    control={
      <Radio
        disabled={disabled}
        sx={{ color: colorPalette[500] }}
        size={isMobile ? "small" : "medium"}
      />
    }
    label={
      <Box sx={{ display: "flex", alignItems: "center", flex: 1 }}>
        <Typography
          variant="body2"
          sx={{ flex: 1, fontSize: isMobile ? "0.8rem" : "0.875rem" }}
        >
          {option}
        </Typography>
        {answerStatus === "correct" && (
          <CheckCircle
            sx={{ color: "#10b981", ml: 1, fontSize: isMobile ? 14 : 16 }}
          />
        )}
        {answerStatus === "wrong" && (
          <Cancel
            sx={{ color: "#ef4444", ml: 1, fontSize: isMobile ? 14 : 16 }}
          />
        )}
      </Box>
    }
    sx={{
      mb: 1,
      p: isMobile ? 0.75 : 1,
      borderRadius: 1,
      border: `1px solid ${
        answerStatus === "correct"
          ? "#10b981"
          : answerStatus === "wrong"
          ? "#ef4444"
          : colorPalette[200]
      }`,
      background:
        answerStatus === "correct"
          ? "#f0fdf4"
          : answerStatus === "wrong"
          ? "#fef2f2"
          : "transparent",
    }}
    onClick={onSelect}
  />
);

export default AnswerOption;
