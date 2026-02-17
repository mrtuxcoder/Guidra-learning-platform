import React from "react";
import { Box, Container, Typography, Stack, Chip, alpha, useTheme } from "@mui/material";

const audience = [
  "Last-minute exam students",
  "Students who need simplified notes",
  "Engineering, BCA, MCA, and school students",
];

const LandingAudience = () => {
  const theme = useTheme();

  return (
    <Box sx={{ py: { xs: 5, md: 7 }, background: "background.paper" }}>
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
                bgcolor: alpha(
                  theme.palette.primary.main,
                  theme.palette.mode === "dark" ? 0.2 : 0.08
                ),
                color: "text.secondary",
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
