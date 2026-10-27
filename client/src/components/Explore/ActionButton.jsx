import React from "react";
import {
  Box,
  Button,
  Typography,
  Fade,
  CircularProgress,
  useTheme,
  Paper,
} from "@mui/material";
import { ArrowForward } from "@mui/icons-material";

const ActionButton = ({
  selectedTopic,
  loading,
  handleStartLearning,
  getSelectedTopicName,
}) => {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";

  if (!selectedTopic) return null;

  return (
    <Fade in={Boolean(selectedTopic)} timeout={250}>
      <Box
        sx={{
          position: "fixed",
          bottom: { xs: 76, md: 24 },
          left: 0,
          right: 0,
          zIndex: 1050,
          display: "flex",
          justifyContent: "center",
          px: 2,
          pointerEvents: "none",
        }}
      >
        <Paper
          elevation={0}
          sx={{
            pointerEvents: "auto",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 2,
            py: 1,
            px: 2,
            borderRadius: "8px",
            bgcolor: "background.paper",
            border: "1px solid",
            borderColor: "divider",
            boxShadow: isDark
              ? "0 8px 24px rgba(0,0,0,0.6)"
              : "0 8px 24px rgba(0,0,0,0.08)",
            maxWidth: 500,
            width: "100%",
          }}
        >
          <Box sx={{ minWidth: 0, flex: 1 }}>
            <Typography
              variant="caption"
              sx={{
                color: "text.secondary",
                fontWeight: 600,
                textTransform: "uppercase",
                letterSpacing: "0.05em",
                fontSize: "0.68rem",
                display: "block",
              }}
            >
              Selected Path
            </Typography>
            <Typography
              variant="subtitle2"
              noWrap
              sx={{
                fontWeight: 700,
                color: "text.primary",
                fontSize: "0.9rem",
              }}
            >
              {getSelectedTopicName()}
            </Typography>
          </Box>

          <Button
            variant="contained"
            color="primary"
            size="small"
            disabled={loading}
            onClick={handleStartLearning}
            endIcon={
              loading ? (
                <CircularProgress size={14} color="inherit" />
              ) : (
                <ArrowForward sx={{ fontSize: 15 }} />
              )
            }
            sx={{
              height: 34,
              borderRadius: "6px",
              px: 2,
              fontWeight: 600,
              fontSize: "0.82rem",
              textTransform: "none",
              boxShadow: "none",
              whiteSpace: "nowrap",
              flexShrink: 0,
              "&:hover": {
                boxShadow: "none",
              },
            }}
          >
            {loading ? "Starting..." : "Start Learning"}
          </Button>
        </Paper>
      </Box>
    </Fade>
  );
};

export default ActionButton;
