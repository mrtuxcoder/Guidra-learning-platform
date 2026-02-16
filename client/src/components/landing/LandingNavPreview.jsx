import React from "react";
import { Box, Container, Typography, Stack, Chip } from "@mui/material";

const LandingNavPreview = () => {
  return (
    <Box sx={{ py: { xs: 5, md: 7 }, background: "white" }}>
      <Container maxWidth="lg">
        <Typography
          variant="h4"
          sx={{
            fontWeight: 700,
            mb: 3,
            fontFamily: '"Space Grotesk", sans-serif',
          }}
        >
          Minimal Navigation
        </Typography>
        <Typography sx={{ color: "#4B5563", mb: 2 }}>
          Only three main sections keep the interface focused.
        </Typography>
        <Stack direction={{ xs: "column", sm: "row" }} spacing={1.5}>
          {["Learn", "Test", "Profile"].map((item) => (
            <Chip
              key={item}
              label={item}
              sx={{
                fontWeight: 700,
                bgcolor: "rgba(124,58,237,0.12)",
                color: "#4B5563",
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
