import React from "react";
import {
  Card,
  CardContent,
  Box,
  Typography,
  Button,
  Grid,
} from "@mui/material";
import { School, Explore, Logout } from "@mui/icons-material";
import { profileTheme, cardSx } from "./constants";

const QuickActions = ({ isMobile, onNavigate, onLogout }) => {
  const actions = [
    {
      icon: <School />,
      label: "Continue Learning",
      action: () => onNavigate("/learn"),
      variant: "contained",
    },
    {
      icon: <Explore />,
      label: "Explore Courses",
      action: () => onNavigate("/explore"),
      variant: "outlined",
    },
    {
      icon: <Logout />,
      label: "Sign Out",
      action: onLogout,
      variant: "outlined",
      color: "error",
    },
  ];

  if (isMobile) {
    return (
      <Card sx={cardSx}>
        <CardContent sx={{ p: 3 }}>
          <Typography
            variant="h6"
            sx={{
              fontWeight: 700,
              mb: 2,
              fontSize: { xs: "1rem", sm: "1.125rem" },
              background: profileTheme.gradient,
              backgroundClip: "text",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            Quick Actions
          </Typography>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 1.25 }}>
            {actions.map((action, index) => (
              <Button
                key={index}
                variant={action.variant}
                startIcon={action.icon}
                onClick={action.action}
                fullWidth
                sx={{
                  borderRadius: 2,
                  ...(action.variant === "contained"
                    ? {
                        background: profileTheme.gradient,
                        fontWeight: 600,
                      }
                    : {
                        borderColor:
                          action.color === "error"
                            ? "rgba(211, 47, 47, 0.3)"
                            : "rgba(126, 87, 194, 0.3)",
                        color:
                          action.color === "error"
                            ? "#d32f2f"
                            : profileTheme.primary,
                        fontWeight: 600,
                      }),
                  py: 1.4,
                  fontSize: { xs: "0.9rem", sm: "1rem" },
                }}
              >
                {action.label}
              </Button>
            ))}
          </Box>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card sx={cardSx}>
      <CardContent sx={{ p: 3 }}>
        <Typography
          variant="h6"
          sx={{
            fontWeight: 700,
            mb: 2.5,
            fontSize: "1.125rem",
            background: profileTheme.gradient,
            backgroundClip: "text",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          Quick Navigation
        </Typography>
        <Grid container spacing={2} sx={{ width: "100%" }}>
          {actions.map((action, index) => (
            <Grid item xs={12} md={4} key={index} sx={{ width: "100%" }}>
              <Box
                sx={{
                  borderRadius: 2,
                  border: `1px solid ${profileTheme.border}`,
                  background: "rgba(126, 87, 194, 0.04)",
                  p: 2,
                  height: "100%",
                  width: "100%",
                  maxWidth: "100%",
                  boxSizing: "border-box",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "flex-start",
                  gap: 1.5,
                }}
              >
                <Box
                  sx={{
                    width: 36,
                    height: 36,
                    borderRadius: 2,
                    background: action.variant === "contained"
                      ? profileTheme.gradient
                      : "rgba(126, 87, 194, 0.1)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: action.variant === "contained" ? "white" : profileTheme.primary,
                  }}
                >
                  {action.icon}
                </Box>
                <Typography sx={{ fontWeight: 700, color: "text.primary" }}>
                  {action.label}
                </Typography>
                <Button
                  variant={action.variant === "contained" ? "contained" : "outlined"}
                  onClick={action.action}
                  fullWidth
                  sx={{
                    borderRadius: 2,
                    textTransform: "none",
                    fontWeight: 600,
                    ...(action.variant === "contained"
                      ? {
                          background: profileTheme.gradient,
                        }
                      : {
                          borderColor:
                            action.color === "error"
                              ? "rgba(211, 47, 47, 0.3)"
                              : "rgba(126, 87, 194, 0.3)",
                          color:
                            action.color === "error"
                              ? "#d32f2f"
                              : profileTheme.primary,
                        }),
                  }}
                >
                  {action.label}
                </Button>
              </Box>
            </Grid>
          ))}
        </Grid>
      </CardContent>
    </Card>
  );
};

export default QuickActions;
