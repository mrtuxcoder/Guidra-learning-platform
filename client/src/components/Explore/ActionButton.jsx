import React from "react";
import { Box, Button, Typography, Fade, CircularProgress } from "@mui/material";
import { actionButtonStyles } from "./styles";

const ActionButton = ({
  selectedTopic,
  loading,
  handleStartLearning,
  getSelectedTopicName,
}) => {
  return (
    <Box
      sx={{
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        background: "linear-gradient(transparent, #FAF7FE 60%)",
        py: 2,
        px: { xs: 2, sm: 3 },
        zIndex: 1000,
        borderTop: "1px solid rgba(126, 87, 194, 0.1)",
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
                color: "#7C3AED",
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
