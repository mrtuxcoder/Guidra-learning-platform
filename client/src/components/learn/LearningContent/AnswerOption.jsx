import React from "react";
import { Radio, Box, Typography, useTheme, alpha } from "@mui/material";
import { CheckCircle, Cancel } from "@mui/icons-material";
import { renderFormattedText } from "./utils";

const AnswerOption = ({
  option,
  value,
  disabled,
  answerStatus,
  isSelected,
  onSelect,
  isMobile,
}) => {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";

  let borderColor = theme.palette.divider;
  let bgcolor = isDark ? "rgba(255, 255, 255, 0.02)" : "#FFFFFF";

  if (answerStatus === "correct") {
    borderColor = theme.palette.success.main;
    bgcolor = isDark ? "rgba(16, 185, 129, 0.12)" : "rgba(16, 185, 129, 0.05)";
  } else if (answerStatus === "wrong") {
    borderColor = theme.palette.error.main;
    bgcolor = isDark ? "rgba(239, 68, 68, 0.12)" : "rgba(239, 68, 68, 0.05)";
  } else if (isSelected) {
    borderColor = theme.palette.primary.main;
    bgcolor = isDark
      ? alpha(theme.palette.primary.main, 0.12)
      : alpha(theme.palette.primary.main, 0.05);
  }

  return (
    <Box
      onClick={!disabled ? onSelect : undefined}
      sx={{
        display: "flex",
        alignItems: "center",
        mb: 1,
        p: 1.25,
        borderRadius: "6px",
        border: "1px solid",
        borderColor,
        bgcolor,
        cursor: disabled ? "default" : "pointer",
        transition: "all 0.15s ease",
        "&:hover": !disabled
          ? {
              bgcolor: isDark
                ? alpha(theme.palette.primary.main, 0.06)
                : alpha(theme.palette.primary.main, 0.03),
              borderColor: isSelected ? theme.palette.primary.main : (isDark ? "rgba(255, 255, 255, 0.2)" : "rgba(0, 0, 0, 0.2)"),
            }
          : {},
      }}
    >
      <Radio
        checked={isSelected}
        value={value}
        disabled={disabled}
        size="small"
        sx={{
          p: 0.5,
          mr: 1,
          color: "text.secondary",
          "&.Mui-checked": {
            color: answerStatus === "correct"
              ? "success.main"
              : answerStatus === "wrong"
              ? "error.main"
              : "primary.main",
          },
        }}
      />
      <Typography
        variant="body2"
        sx={{
          flex: 1,
          fontSize: isMobile ? "0.82rem" : "0.88rem",
          fontWeight: isSelected ? 600 : 400,
          color: "text.primary",
          lineHeight: 1.45,
        }}
      >
        {renderFormattedText(option)}
      </Typography>
      {answerStatus === "correct" && (
        <CheckCircle sx={{ color: "success.main", fontSize: 18, ml: 1 }} />
      )}
      {answerStatus === "wrong" && (
        <Cancel sx={{ color: "error.main", fontSize: 18, ml: 1 }} />
      )}
    </Box>
  );
};

export default AnswerOption;