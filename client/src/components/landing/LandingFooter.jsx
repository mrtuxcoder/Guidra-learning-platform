import React from "react";
import { Box, Container, Typography, Stack, Link } from "@mui/material";
import { profileTheme } from "../profile/constants";

const LandingFooter = () => {
  return (
    <Box sx={{ py: 4, borderTop: `1px solid ${profileTheme.border}` }}>
      <Container maxWidth="lg">
        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={2}
          alignItems={{ xs: "flex-start", sm: "center" }}
          justifyContent="space-between"
        >
          <Typography sx={{ fontWeight: 700 }}>Guidra</Typography>
          <Stack direction="row" spacing={2} flexWrap="wrap">
            <Link href="#" underline="hover" color="text.secondary">
              About
            </Link>
            <Link href="#" underline="hover" color="text.secondary">
              Privacy
            </Link>
            <Link href="#" underline="hover" color="text.secondary">
              Terms (18+)
            </Link>
            <Link
              href="https://github.com"
              target="_blank"
              rel="noreferrer"
              underline="hover"
              color="text.secondary"
            >
              GitHub
            </Link>
          </Stack>
          <Typography sx={{ color: "#64748b", fontSize: "0.85rem" }}>
            v1.x
          </Typography>
        </Stack>
      </Container>
    </Box>
  );
};

export default LandingFooter;
