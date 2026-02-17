import React from "react";
import {
  Box,
  Button,
  Typography,
  Fade,
  CircularProgress,
  alpha,
  useTheme,
} from "@mui/material";
import { actionButtonStyles } from "./styles";

const ActionButton = ({
  selectedTopic,
  loading,
  handleStartLearning,
  getSelectedTopicName,
}) => {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";

  return (
    <Box
      sx={{
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        background: isDark
          ? `linear-gradient(transparent, ${alpha(
              theme.palette.background.default,
              0.92
            )} 60%)`
          : "linear-gradient(transparent, #FAF7FE 60%)",
        py: 2,
        px: { xs: 2, sm: 3 },
        zIndex: 1000,
        borderTop: `1px solid ${alpha(
          theme.palette.primary.main,
          isDark ? 0.25 : 0.1
        )}`,
        backdropFilter: "blur(10px)",
      }}
    >
      <Fade in timeout={1200}>
        <Box sx={{ textAlign: "center" }}>
          <Button
            variant="contained"
            size="large"
            onClick={handleStartLearning}
            disabled={!selectedTopic || loading}
            sx={actionButtonStyles.button}
          >
            {loading ? (
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <CircularProgress
                  size={20}
                  color="inherit"
                  sx={{
                    color: "white",
                    "& .MuiCircularProgress-circle": {
                      strokeLinecap: "round",
                    },
                  }}
                />
                <Typography sx={{ fontSize: { xs: "0.8rem", md: "0.9rem" } }}>
                  Starting...
                </Typography>
              </Box>
            ) : (
              "Start Learning"
            )}
          </Button>

          {selectedTopic && (
            <Typography
              variant="body2"
              sx={{
                mt: 1,
                fontWeight: 600,
                color: isDark
                  ? theme.palette.primary.light
                  : "#7C3AED",
                fontSize: { xs: "0.75rem", md: "0.8rem" },
              }}
            >
              Selected: {getSelectedTopicName()}
            </Typography>
          )}
        </Box>
      </Fade>
    </Box>
  );
};

export default ActionButton;
