import React from "react";
import { Box, Container, Typography, Stack, Chip, alpha, useTheme } from "@mui/material";
import { profileTheme } from "../profile/constants";

const LandingNavPreview = () => {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";

  return (
    <Box sx={{ py: { xs: 5, md: 7 }, background: "background.paper" }}>
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
        <Typography sx={{ color: "text.secondary", mb: 2 }}>
          Only three main sections keep the interface focused.
        </Typography>
        <Stack direction={{ xs: "column", sm: "row" }} spacing={1.5}>
          {["Learn", "Test", "Profile"].map((item) => (
            <Chip
              key={item}
              label={item}
              sx={{
                fontWeight: 700,
                bgcolor: alpha(profileTheme.primary, isDark ? 0.24 : 0.14),
                color: isDark
                  ? profileTheme.primaryLight
                  : profileTheme.primaryDark,
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
