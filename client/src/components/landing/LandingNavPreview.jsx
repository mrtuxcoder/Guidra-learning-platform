import React from "react";
import { Box, Container, Typography, Stack, Chip } from "@mui/material";
import { profileTheme } from "../profile/constants";

const LandingNavPreview = () => {
  return (
    <Box sx={{ py: { xs: 5, md: 7 }, background: "white" }}>
      <Container maxWidth="lg">
        <Typography
          variant="h4"
          sx={{
            fontWeight: 800,
            mb: 3,
          }}
        >
          Minimal Navigation
        </Typography>
        <Typography sx={{ color: "#475569", mb: 2 }}>
          Only three main sections keep the interface focused.
        </Typography>
        <Stack direction={{ xs: "column", sm: "row" }} spacing={1.5}>
          {["Learn", "Test", "Profile"].map((item) => (
            <Chip
              key={item}
              label={item}
              sx={{
                fontWeight: 700,
                bgcolor: "rgba(126,87,194,0.14)",
                color: profileTheme.primaryDark,
                px: 1.5,
                py: 1.25,
                fontSize: "0.95rem",
              }}
            />
          ))}
        </Stack>
      </Container>
    </Box>
  );
};

export default LandingNavPreview;
