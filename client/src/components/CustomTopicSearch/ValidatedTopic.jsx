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
        borderRadius: "16px",
        background: "background.paper",
        border: `1px solid ${theme.palette.divider}`,
        textAlign: "left",
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 2 }}>
        <Box
          sx={{
            width: 44,
            height: 44,
            borderRadius: "14px",
            background: theme.palette.success.main,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "white",
          }}
        >
          <CheckCircle />
        </Box>
        <Box>
          <Typography variant="h6" sx={{ fontWeight: 700, mb: 0.25 }}>
            Topic validated
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Great choice. Ready to build your learning path.
          </Typography>
        </Box>
      </Box>

      <Box
        sx={{
          p: 2,
          borderRadius: "12px",
          border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
          background: alpha(theme.palette.primary.main, isDark ? 0.15 : 0.08),
          fontWeight: 700,
          color: "text.primary",
          mb: 2.5,
        }}
      >
        {searchQuery}
      </Box>

      <Typography variant="body2" sx={{ color: "text.secondary", mb: 3 }}>
        This topic fits a structured sequence of 10-15 lessons.
      </Typography>

      {error && (
        <Alert severity="warning" sx={{ mb: 3, borderRadius: "12px" }}>
          {error}
        </Alert>
      )}

      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", sm: "row" },
          gap: 2,
          justifyContent: { xs: "stretch", md: "center" },
          alignItems: { xs: "stretch", md: "center" },
        }}
      >
        <Button
          variant="outlined"
          onClick={onResetSearch}
          sx={{
            borderRadius: "12px",
            borderColor: alpha(theme.palette.primary.main, 0.5),
            color: theme.palette.primary.main,
            fontWeight: 600,
          }}
        >
          Change Topic
        </Button>

        <Button
          variant="contained"
          onClick={onGenerateSubtopics}
          disabled={generating}
          startIcon={
            generating ? (
              <CircularProgress size={20} color="inherit" />
            ) : (
              <Psychology />
            )
          }
          sx={{
            borderRadius: "12px",
            fontWeight: 600,
            boxShadow: "none",
            bgcolor: "success.main",
            "&:hover": {
              bgcolor: "success.dark",
            },
          }}
        >
          {generating ? "Generating..." : "Generate Learning Path"}
        </Button>
      </Box>
    </Paper>
  );
};

export default ValidatedTopic;
