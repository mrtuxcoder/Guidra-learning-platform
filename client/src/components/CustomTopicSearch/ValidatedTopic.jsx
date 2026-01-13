import React from "react";
import {
  Paper,
  Box,
  Typography,
  Chip,
  Button,
  Alert,
  CircularProgress,
} from "@mui/material";
import { CheckCircle, Psychology } from "@mui/icons-material";

const ValidatedTopic = ({
  searchQuery,
  error,
  generating,
  onResetSearch,
  onGenerateSubtopics,
}) => {
  return (
    <Paper
      elevation={0}
      sx={{
        p: 3,
        borderRadius: "16px",
        background: "rgba(124, 58, 237, 0.05)",
        border: "1px solid rgba(124, 58, 237, 0.1)",
        textAlign: "center",
      }}
    >
      <CheckCircle sx={{ fontSize: 40, color: "#10b981", mb: 2 }} />

      <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
        Topic Validated!
      </Typography>

      <Chip
        label={searchQuery}
        sx={{
          background: "linear-gradient(135deg, #7C3AED 0%, #5E35B1 100%)",
          color: "white",
          fontWeight: 600,
          py: 1.5,
          mb: 2,
        }}
      />

      <Typography variant="body2" sx={{ color: "text.secondary", mb: 3 }}>
        This topic is suitable for structured learning with 10-15 subtopics.
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
        }}
      >
        <Button
          variant="outlined"
          onClick={onResetSearch}
          sx={{
            borderRadius: "12px",
            borderColor: "#7C3AED",
            color: "#7C3AED",
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
            background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
            fontWeight: 600,
          }}
        >
          {generating ? "Generating..." : "Generate Learning Path"}
        </Button>
      </Box>
    </Paper>
  );
};

export default ValidatedTopic;
