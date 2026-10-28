import React from "react";
import { Container, Box, Typography, CircularProgress } from "@mui/material";

const LoadingState = () => {
  return (
    <Container
      maxWidth="xl"
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "80vh",
        bgcolor: "background.default",
      }}
    >
      <Box sx={{ textAlign: "center", px: 2 }}>
        <CircularProgress
          size={36}
          thickness={4}
          sx={{ color: "primary.main", mb: 2 }}
        />
        <Typography
          variant="h6"
          sx={{
            fontWeight: 700,
            fontSize: "1.1rem",
            color: "text.primary",
            mb: 0.5,
          }}
        >
          Loading Profile...
        </Typography>
        <Typography
          variant="body2"
          color="text.secondary"
        >
          Preparing your learning dashboard
        </Typography>
      </Box>
    </Container>
  );
};

export default LoadingState;
