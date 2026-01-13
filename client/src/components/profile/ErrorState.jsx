import React from "react";
import { Container, Box, Alert, Button, Typography } from "@mui/material";
import { TrendingUp } from "@mui/icons-material";

export const SessionExpiredError = ({ error, onRetry }) => {
  return (
    <Container
      maxWidth="sm"
      sx={{
        py: 4,
        textAlign: "center",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        background: "linear-gradient(135deg, #FAF7FE 0%, #FFFFFF 100%)",
        px: 2,
      }}
    >
      <Alert
        severity="warning"
        sx={{
          mb: 3,
          borderRadius: 3,
          border: "1px solid rgba(126, 87, 194, 0.2)",
          bgcolor: "rgba(126, 87, 194, 0.05)",
        }}
      >
        {error}
      </Alert>
      <Button
        variant="contained"
        onClick={onRetry}
        sx={{
          borderRadius: 3,
          background: "linear-gradient(135deg, #7E57C2 0%, #5E35B1 100%)",
          boxShadow: "0 8px 25px rgba(126, 87, 194, 0.3)",
          fontWeight: 600,
          px: 4,
          py: 1.5,
          fontSize: "1rem",
          "&:hover": {
            transform: "translateY(-2px)",
            boxShadow: "0 12px 35px rgba(126, 87, 194, 0.4)",
          },
        }}
      >
        Continue Learning
      </Button>
    </Container>
  );
};

export const GenericError = ({ error, onRetry }) => {
  return (
    <Container
      maxWidth="sm"
      sx={{
        py: 4,
        textAlign: "center",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        gap: 3,
        px: 2,
      }}
    >
      <Box sx={{ textAlign: "center" }}>
        <Box
          sx={{
            width: 80,
            height: 80,
            borderRadius: "50%",
            background: "linear-gradient(135deg, #ff6b6b 0%, #ee5a52 100%)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            mx: "auto",
            mb: 2,
          }}
        >
          <TrendingUp sx={{ fontSize: 32, color: "white" }} />
        </Box>
        <Alert
          severity="error"
          sx={{
            borderRadius: 3,
            border: "1px solid rgba(211, 47, 47, 0.2)",
          }}
        >
          {error}
        </Alert>
      </Box>
      <Button
        variant="contained"
        onClick={onRetry}
        sx={{
          borderRadius: 3,
          background: "linear-gradient(135deg, #7E57C2 0%, #5E35B1 100%)",
          fontWeight: 600,
          px: 4,
          py: 1.5,
          fontSize: "1rem",
        }}
      >
        Try Again
      </Button>
    </Container>
  );
};
