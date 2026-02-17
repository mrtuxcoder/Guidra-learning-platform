import React from "react";
import { Box, Container, Typography, Button, Stack } from "@mui/material";
import { profileTheme } from "../profile/constants";

const LandingCTA = ({ onCreateAccount, onLogin }) => {
  return (
    <Box
      sx={{
        py: { xs: 6, md: 8 },
        background:
          "linear-gradient(135deg, rgba(126,87,194,0.16) 0%, rgba(94,53,177,0.1) 100%)",
      }}
    >
      <Container maxWidth="md" sx={{ textAlign: "center" }}>
        <Typography
          variant="h4"
          sx={{
            fontWeight: 800,
            mb: 2,
          }}
        >
          Start Learning Smarter
        </Typography>
        <Typography sx={{ color: "#475569", mb: 3 }}>
          Build a calm, structured study flow that saves progress and versions.
        </Typography>
        <Stack direction={{ xs: "column", sm: "row" }} spacing={1.5} justifyContent="center">
          <Button
            variant="contained"
            onClick={onCreateAccount}
            sx={{
              textTransform: "none",
              borderRadius: 2,
              fontWeight: 700,
              px: 3,
              background: profileTheme.gradient,
            }}
          >
            Register
          </Button>
          <Button
            variant="outlined"
            onClick={onLogin}
            sx={{
              textTransform: "none",
              borderRadius: 2,
              fontWeight: 600,
              px: 3,
              borderColor: "rgba(126,87,194,0.4)",
              color: profileTheme.primaryDark,
            }}
          >
            Login
          </Button>
        </Stack>
      </Container>
    </Box>
  );
};

export default LandingCTA;
