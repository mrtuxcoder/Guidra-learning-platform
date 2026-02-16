import React from "react";
import { Box, Container, Typography, Button, Stack } from "@mui/material";

const LandingCTA = ({ onCreateAccount, onLogin }) => {
  return (
    <Box
      sx={{
        py: { xs: 6, md: 8 },
        background:
          "linear-gradient(135deg, rgba(124,58,237,0.12) 0%, rgba(94,53,177,0.08) 100%)",
      }}
    >
      <Container maxWidth="md" sx={{ textAlign: "center" }}>
        <Typography
          variant="h4"
          sx={{
            fontWeight: 700,
            mb: 2,
            fontFamily: '"Space Grotesk", sans-serif',
          }}
        >
          Start Learning Smarter
        </Typography>
        <Typography sx={{ color: "#4B5563", mb: 3 }}>
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
              background:
                "linear-gradient(135deg, #7C3AED 0%, #5E35B1 100%)",
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
              borderColor: "rgba(124,58,237,0.4)",
              color: "#5E35B1",
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
