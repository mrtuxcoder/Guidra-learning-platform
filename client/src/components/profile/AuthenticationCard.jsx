import React from "react";
import {
  Card,
  CardContent,
  Box,
  Typography,
  Button,
  Stack,
} from "@mui/material";
import { cardSx } from "./constants";

const AuthenticationCard = ({ user, onPasswordSetup }) => {
  if (user?.authProvider !== "google" || user?.password) {
    return null;
  }

  return (
    <Card
      sx={{
        ...cardSx,
        bgcolor: "background.paper",
      }}
    >
      <CardContent sx={{ p: { xs: 2, sm: 2.5 } }}>
        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={2}
          alignItems={{ xs: "flex-start", sm: "center" }}
          justifyContent="space-between"
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Box
              sx={{
                width: 40,
                height: 40,
                borderRadius: 2,
                bgcolor: "primary.main",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              <Typography
                sx={{ color: "white", fontWeight: 700, fontSize: "0.9rem" }}
              >
                🔐
              </Typography>
            </Box>
            <Box>
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 700,
                  fontSize: { xs: "0.95rem", sm: "1.05rem" },
                }}
              >
                Authentication Status
              </Typography>
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ fontSize: "0.85rem" }}
              >
                Signed in with Google. Add a password for email login.
              </Typography>
            </Box>
          </Box>

          <Button
            variant="contained"
            size="small"
            onClick={onPasswordSetup}
            sx={{
              borderRadius: 2,
              bgcolor: "primary.main",
              fontWeight: 600,
              px: 2.5,
              py: 1,
              fontSize: "0.85rem",
              "&:hover": {
                bgcolor: "primary.dark",
              },
            }}
          >
            Set Password
          </Button>
        </Stack>
      </CardContent>
    </Card>
  );
};

export default AuthenticationCard;
