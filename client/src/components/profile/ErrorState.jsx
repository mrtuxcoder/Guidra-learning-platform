import React from "react";
import { Container, Box, Alert, Button } from "@mui/material";

export const SessionExpiredError = ({ error, onRetry }) => {
  return (
    <Container
      maxWidth="sm"
      sx={{
        py: 4,
        textAlign: "center",
        minHeight: "80vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        bgcolor: "background.default",
        px: 2,
      }}
    >
      <Alert
        severity="warning"
        sx={{
          mb: 3,
          borderRadius: 2,
        }}
      >
        {error}
      </Alert>
      <Box sx={{ display: "flex", justifyContent: "center" }}>
        <Button
          variant="contained"
          onClick={onRetry}
          sx={{
            borderRadius: "6px",
            fontWeight: 600,
            textTransform: "none",
            px: 3,
            py: 1,
            fontSize: "0.9rem",
          }}
        >
          Sign In Again
        </Button>
      </Box>
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
        minHeight: "80vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        bgcolor: "background.default",
        px: 2,
      }}
    >
      <Alert
        severity="error"
        sx={{
          mb: 3,
          borderRadius: 2,
          width: "100%",
        }}
      >
        {error}
      </Alert>
      <Button
        variant="outlined"
        onClick={onRetry}
        sx={{
          borderRadius: "6px",
          fontWeight: 600,
          textTransform: "none",
          px: 3,
          py: 1,
          fontSize: "0.9rem",
        }}
      >
        Try Again
      </Button>
    </Container>
  );
};
