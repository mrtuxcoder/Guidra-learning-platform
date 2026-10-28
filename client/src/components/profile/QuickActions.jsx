import React from "react";
import {
  Card,
  CardContent,
  Box,
  Typography,
  Button,
  Stack,
} from "@mui/material";
import { School, Explore, Logout } from "@mui/icons-material";
import { cardSx } from "./constants";

const QuickActions = ({ onNavigate, onLogout }) => {
  const actions = [
    {
      icon: <School sx={{ fontSize: 20 }} />,
      label: "Continue Learning",
      description: "Jump back into your active course and lessons",
      buttonText: "Open Learn",
      action: () => onNavigate("/learn"),
      variant: "contained",
    },
    {
      icon: <Explore sx={{ fontSize: 20 }} />,
      label: "Explore Topics",
      description: "Discover curated learning roadmaps and subjects",
      buttonText: "Browse",
      action: () => onNavigate("/explore"),
      variant: "outlined",
    },
    {
      icon: <Logout sx={{ fontSize: 20 }} />,
      label: "Sign Out",
      description: "Securely sign out of your account on this device",
      buttonText: "Log Out",
      action: onLogout,
      variant: "outlined",
      color: "error",
    },
  ];

  return (
    <Card sx={{ ...cardSx, width: "100%" }}>
      <CardContent sx={{ p: { xs: 2, sm: 2.5 } }}>
        <Typography variant="subtitle1" sx={{ fontWeight: 700, color: "text.primary" }}>
          Quick Actions
        </Typography>
        <Typography variant="caption" color="text.secondary" sx={{ display: "block", mb: 2 }}>
          Shortcuts to navigate your learning journey or manage your session.
        </Typography>

        <Stack spacing={1.5}>
          {actions.map((action, index) => (
            <Box
              key={index}
              sx={{
                display: "flex",
                justifyContent: "space-between",
                gap: 2,
                p: { xs: 1.5, sm: 2 },
                borderRadius: 2,
                border: "1px solid",
                borderColor: "divider",
                bgcolor: "background.default",
                flexDirection: { xs: "column", sm: "row" },
                alignItems: { xs: "stretch", sm: "center" },
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, minWidth: 0 }}>
                <Box
                  sx={{
                    color: action.color === "error" ? "error.main" : "primary.main",
                    display: "flex",
                    alignItems: "center",
                    flexShrink: 0,
                  }}
                >
                  {action.icon}
                </Box>
                <Box sx={{ minWidth: 0 }}>
                  <Typography variant="body2" fontWeight={700} color="text.primary">
                    {action.label}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {action.description}
                  </Typography>
                </Box>
              </Box>

              <Button
                variant={action.variant}
                color={action.color || "primary"}
                onClick={action.action}
                size="small"
                sx={{
                  flexShrink: 0,
                  borderRadius: "6px",
                  textTransform: "none",
                  fontWeight: 600,
                  px: 2.5,
                  minWidth: 110,
                  height: 34,
                  alignSelf: { xs: "stretch", sm: "center" },
                  ...(action.variant === "outlined" && action.color !== "error"
                    ? {
                        borderColor: "divider",
                        color: "text.primary",
                        "&:hover": { borderColor: "primary.main" },
                      }
                    : {}),
                }}
              >
                {action.buttonText}
              </Button>
            </Box>
          ))}
        </Stack>
      </CardContent>
    </Card>
  );
};

export default QuickActions;
