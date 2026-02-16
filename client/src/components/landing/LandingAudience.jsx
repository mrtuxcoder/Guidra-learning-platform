import React from "react";
import { Box, Container, Typography, Stack, Chip } from "@mui/material";

const audience = [
  "Last-minute exam students",
  "Students who need simplified notes",
  "Engineering, BCA, MCA, and school students",
];

const LandingAudience = () => {
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
          Who It Is For
        </Typography>
        <Stack direction={{ xs: "column", sm: "row" }} spacing={1.5}>
          {audience.map((item) => (
            <Chip
              key={item}
              label={item}
              sx={{
                fontWeight: 600,
                bgcolor: "rgba(124,58,237,0.08)",
                color: "#4B5563",
                px: 1.5,
                py: 1.25,
              }}
            />
          ))}
        </Stack>
      </Container>
    </Box>
  );
};

export default LandingAudience;
