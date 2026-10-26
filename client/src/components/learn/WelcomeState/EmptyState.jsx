import React from "react";
import { Box, Typography, Button, Stack } from "@mui/material";
import { Explore, School } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

const EmptyState = () => {
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        textAlign: "center",
        py: { xs: 6, md: 8 },
        px: { xs: 2, md: 4 },
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Box
        sx={{
          width: 64,
          height: 64,
          borderRadius: "14px",
          bgcolor: (theme) =>
            theme.palette.mode === "dark"
              ? "rgba(101, 88, 217, 0.15)"
              : "rgba(101, 88, 217, 0.08)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          mb: 2.5,
          border: "1px solid",
          borderColor: "divider",
        }}
      >
        <School sx={{ fontSize: 32, color: "primary.main" }} />
      </Box>

      <Typography
        variant="h5"
        sx={{
          fontWeight: 800,
          color: "text.primary",
          letterSpacing: "-0.02em",
          mb: 1,
        }}
      >
        Start Your First Learning Path
      </Typography>

      <Typography
        variant="body2"
        sx={{
          maxWidth: 480,
          color: "text.secondary",
          lineHeight: 1.6,
          fontSize: "0.95rem",
          mb: 3.5,
        }}
      >
        Select or generate a topic to start structured, step-by-step lessons with interactive examples and knowledge checks.
      </Typography>

      <Stack
        direction={{ xs: "column", sm: "row" }}
        spacing={2}
        sx={{ width: "100%", maxWidth: 320 }}
      >
        <Button
          variant="contained"
          onClick={() => navigate("/explore")}
          startIcon={<Explore />}
          sx={{
            py: 1.25,
            px: 3,
            borderRadius: "6px",
            fontSize: "0.92rem",
            fontWeight: 600,
            textTransform: "none",
            bgcolor: "primary.main",
            "&:hover": { bgcolor: "primary.dark" },
          }}
          fullWidth
        >
          Explore Courses
        </Button>
      </Stack>
    </Box>
  );
};

export default EmptyState;
