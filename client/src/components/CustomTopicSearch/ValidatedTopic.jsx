import React from "react";
import {
  Paper,
  Box,
  Typography,
  Button,
  Alert,
  CircularProgress,
} from "@mui/material";
import { CheckCircle, Psychology } from "@mui/icons-material";
import { alpha, useTheme } from "@mui/material/styles";

const ValidatedTopic = ({
  searchQuery,
  error,
  generating,
  onResetSearch,
  onGenerateSubtopics,
}) => {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";

  return (
    <Paper
      elevation={0}
      sx={{
        p: { xs: 2.5, sm: 3 },
        borderRadius: "8px",
        bgcolor: "background.paper",
        border: "1px solid",
        borderColor: "divider",
        textAlign: "left",
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center", gap: 1.25, mb: 2 }}>
        <Box
          sx={{
            width: 32,
            height: 32,
            borderRadius: "6px",
            bgcolor: isDark
              ? alpha(theme.palette.success.main, 0.2)
              : alpha(theme.palette.success.main, 0.1),
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "success.main",
          }}
        >
          <CheckCircle sx={{ fontSize: 18 }} />
        </Box>
        <Box>
          <Typography variant="subtitle1" sx={{ fontWeight: 700, fontSize: "1rem", lineHeight: 1.2, mb: 0.25 }}>
            Topic Validated
          </Typography>
          <Typography variant="caption" sx={{ color: "text.secondary", fontSize: "0.8rem" }}>
            Ready to generate your personalized learning path
          </Typography>
        </Box>
      </Box>

      <Box
        sx={{
          p: 1.75,
          borderRadius: "6px",
          border: "1px solid",
          borderColor: "divider",
          bgcolor: isDark ? "rgba(255, 255, 255, 0.03)" : "rgba(0, 0, 0, 0.02)",
          mb: 2,
        }}
      >
        <Typography
          variant="subtitle1"
          sx={{
            fontWeight: 700,
            color: "text.primary",
            fontSize: "1.05rem",
          }}
        >
          {searchQuery}
        </Typography>
        <Typography variant="caption" sx={{ color: "text.secondary", display: "block", mt: 0.25 }}>
          Structured curriculum • 10–15 step-by-step lessons
        </Typography>
      </Box>

      {error && (
        <Alert severity="warning" sx={{ mb: 2.5, borderRadius: "6px" }}>
          {error}
        </Alert>
      )}

      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", sm: "row" },
          gap: 1.5,
          justifyContent: "flex-end",
          alignItems: "center",
        }}
      >
        <Button
          variant="outlined"
          onClick={onResetSearch}
          disabled={generating}
          sx={{
            height: 38,
            borderRadius: "6px",
            borderColor: "divider",
            color: "text.secondary",
            fontWeight: 500,
            fontSize: "0.84rem",
            textTransform: "none",
            width: { xs: "100%", sm: "auto" },
            "&:hover": {
              borderColor: "divider",
              color: "text.primary",
              bgcolor: "action.hover",
            },
          }}
        >
          Change Topic
        </Button>

        <Button
          variant="contained"
          color="primary"
          onClick={onGenerateSubtopics}
          disabled={generating}
          startIcon={
            generating ? (
              <CircularProgress size={16} color="inherit" />
            ) : (
              <Psychology sx={{ fontSize: 18 }} />
            )
          }
          sx={{
            height: 38,
            borderRadius: "6px",
            fontWeight: 600,
            fontSize: "0.84rem",
            textTransform: "none",
            boxShadow: "none",
            width: { xs: "100%", sm: "auto" },
            px: 2.5,
            "&:hover": {
              boxShadow: "none",
            },
          }}
        >
          {generating ? "Generating Path..." : "Generate Learning Path"}
        </Button>
      </Box>
    </Paper>
  );
};

export default ValidatedTopic;
