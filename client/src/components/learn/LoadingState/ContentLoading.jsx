import React from "react";
import { Box, Typography, Fade, CircularProgress } from "@mui/material";
import { AutoAwesome } from "@mui/icons-material";

const ContentLoading = ({ source, isMobile }) => {
  const isAi = source === "ai";

  return (
    <Fade in={true} timeout={400}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100%",
          minHeight: isMobile ? "300px" : "420px",
          width: "100%",
          flexDirection: "column",
          gap: 2.5,
          bgcolor: "background.paper",
          borderRadius: "10px",
          p: { xs: 3, md: 5 },
          border: "1px solid",
          borderColor: "divider",
          boxSizing: "border-box",
          textAlign: "center",
        }}
      >
        <Box sx={{ position: "relative", display: "inline-flex" }}>
          <CircularProgress
            size={52}
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
            <AutoAwesome sx={{ fontSize: 20, color: "primary.main" }} />
          </Box>
        </Box>

        <Box sx={{ maxWidth: 420 }}>
          <Typography
            variant="h6"
            sx={{
              fontWeight: 700,
              fontSize: "1.05rem",
              color: "text.primary",
              letterSpacing: "-0.01em",
              mb: 0.75,
            }}
          >
            {isAi ? "Generating Personalized Lesson..." : "Loading Lesson Content..."}
          </Typography>

          <Typography
            variant="body2"
            sx={{
              color: "text.secondary",
              lineHeight: 1.6,
              fontSize: "0.88rem",
            }}
          >
            Structuring core concepts, interactive code examples, and knowledge checks tailored for focused learning.
          </Typography>
        </Box>
      </Box>
    </Fade>
  );
};

export default ContentLoading;
