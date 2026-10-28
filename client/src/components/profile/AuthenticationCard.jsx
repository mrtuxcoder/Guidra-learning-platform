import React from "react";
import {
  Card,
  CardContent,
  Box,
  Typography,
  Button,
  Stack,
} from "@mui/material";
import { Lock } from "@mui/icons-material";
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
            <Lock sx={{ fontSize: 18, color: "text.secondary", flexShrink: 0 }} />
            <Box>
              <Typography
                variant="subtitle2"
                sx={{
                  fontWeight: 700,
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
            variant="outlined"
            size="small"
            onClick={onPasswordSetup}
            sx={{
              borderRadius: 2,
              fontWeight: 600,
              px: 2.5,
              py: 1,
              fontSize: "0.85rem",
              borderColor: "divider",
              color: "text.primary",
              "&:hover": {
                borderColor: "primary.main",
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
