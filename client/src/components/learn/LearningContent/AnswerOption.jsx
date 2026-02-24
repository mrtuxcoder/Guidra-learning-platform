import React from "react";
import { FormControlLabel, Radio, Box, Typography, useTheme, alpha } from "@mui/material";
import { CheckCircle, Cancel } from "@mui/icons-material";

const AnswerOption = ({
  option,
  value,
  disabled,
  answerStatus,
  onSelect,
  isMobile,
  colorPalette,
}) => {
  const theme = useTheme();
  
  return (
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
        p: isMobile ? 0.85 : 1.05,
        borderRadius: 0,
        border: "none",
        borderBottom: `1px solid ${alpha(theme.palette.divider, 0.35)}`,
        background: "transparent",
      }}
      onClick={onSelect}
    />
  );
};

export default AnswerOption;
