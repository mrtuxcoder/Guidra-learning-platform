import React from "react";
import {
  Box,
  Button,
  Typography,
  Fade,
  CircularProgress,
  alpha,
  useTheme,
  Paper,
} from "@mui/material";
import { ArrowForward } from "@mui/icons-material";
import { tokens } from "../../theme/tokens";

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
    <Fade in={Boolean(selectedTopic)} timeout={300}>
      <Box
        sx={{
          position: "fixed",
          bottom: { xs: 76, md: 24 }, // Floats safely above mobile bottom nav
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
          elevation={4}
          sx={{
            pointerEvents: "auto",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 2,
            py: 1,
            px: 2,
            borderRadius: tokens.radii.lg,
            bgcolor: "background.paper",
            border: "1px solid",
            borderColor: isDark
              ? alpha(tokens.colors.primary.main, 0.4)
              : alpha(tokens.colors.primary.main, 0.25),
            boxShadow: isDark
              ? "0 12px 32px rgba(0,0,0,0.5)"
              : "0 12px 32px rgba(99, 102, 241, 0.18)",
            maxWidth: 540,
            width: "100%",
          }}
        >
          <Box sx={{ minWidth: 0, flex: 1 }}>
            <Typography
              variant="caption"
              sx={{
                color: "primary.main",
                fontWeight: 700,
                textTransform: "uppercase",
                letterSpacing: "0.05em",
                fontSize: "0.7rem",
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
                fontSize: "0.92rem",
              }}
            >
              {getSelectedTopicName()}
            </Typography>
          </Box>

          <Button
            variant="contained"
            size="medium"
            disabled={loading}
            onClick={handleStartLearning}
            endIcon={
              loading ? (
                <CircularProgress size={16} color="inherit" />
              ) : (
                <ArrowForward sx={{ fontSize: 16 }} />
              )
            }
            sx={{
              borderRadius: tokens.radii.md,
              textTransform: "none",
              fontWeight: 700,
              fontSize: "0.88rem",
              px: 2.5,
              py: 0.85,
              whiteSpace: "nowrap",
              flexShrink: 0,
            }}
          >
            {loading ? "Preparing..." : "Start Learning"}
          </Button>
        </Paper>
      </Box>
    </Fade>
  );
};

export default ActionButton;
