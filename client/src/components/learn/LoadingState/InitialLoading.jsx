import React from "react";
import { Box, Typography, Fade, CircularProgress } from "@mui/material";
import { AutoStories } from "@mui/icons-material";

const InitialLoading = () => {
  return (
    <Fade in={true} timeout={400}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100%",
          minHeight: "450px",
          width: "100%",
          flexDirection: "column",
          gap: 2.5,
          bgcolor: "background.paper",
          borderRadius: "10px",
          p: 4,
          border: "1px solid",
          borderColor: "divider",
          boxSizing: "border-box",
          textAlign: "center",
        }}
      >
        <Box sx={{ position: "relative", display: "inline-flex" }}>
          <CircularProgress
            size={56}
            thickness={3.5}
            sx={{
              color: "primary.main",
            }}
          />
          <Box
            sx={{
              top: 0,
              left: 0,
              bottom: 0,
              right: 0,
              position: "absolute",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <AutoStories sx={{ fontSize: 22, color: "primary.main" }} />
          </Box>
        </Box>

        <Box sx={{ maxWidth: 400 }}>
          <Typography
            variant="h6"
            sx={{
              fontWeight: 700,
              fontSize: "1.05rem",
              color: "text.primary",
              letterSpacing: "-0.01em",
              mb: 0.5,
            }}
          >
            Preparing Curriculum...
          </Typography>

          <Typography
            variant="body2"
            sx={{
              color: "text.secondary",
              lineHeight: 1.6,
              fontSize: "0.88rem",
            }}
          >
            Retrieving modules, progress status, and your personalized study paths.
          </Typography>
        </Box>
      </Box>
    </Fade>
  );
};

export default InitialLoading;
