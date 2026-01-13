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
      <Card
        sx={{
          borderRadius: 3,
          border: "1px solid rgba(126, 87, 194, 0.15)",
          background: "white",
          boxShadow: "0 8px 32px rgba(126, 87, 194, 0.08)",
        }}
      >
        <CardContent sx={{ p: 3 }}>
          <Typography
            variant="h6"
            sx={{
              fontWeight: 700,
              mb: 2,
              fontSize: { xs: "1rem", sm: "1.125rem" },
              background: "linear-gradient(135deg, #7E57C2 0%, #5E35B1 100%)",
              backgroundClip: "text",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            Quick Actions
          </Typography>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
            {actions.map((action, index) => (
              <Button
                key={index}
                variant={action.variant}
                startIcon={action.icon}
                onClick={action.action}
                sx={{
                  borderRadius: 2,
                  ...(action.variant === "contained"
                    ? {
                        background:
                          "linear-gradient(135deg, #7E57C2 0%, #5E35B1 100%)",
                        fontWeight: 600,
                      }
                    : {
                        borderColor:
                          action.color === "error"
                            ? "rgba(211, 47, 47, 0.3)"
                            : "rgba(126, 87, 194, 0.3)",
                        color: action.color === "error" ? "#d32f2f" : "#7E57C2",
                        fontWeight: 600,
                      }),
                  py: 1.5,
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
    <Card
      sx={{
        borderRadius: 3,
        border: "1px solid rgba(126, 87, 194, 0.15)",
        background: "white",
        boxShadow: "0 8px 32px rgba(126, 87, 194, 0.08)",
      }}
    >
      <CardContent sx={{ p: 3 }}>
        <Typography
          variant="h6"
          sx={{
            fontWeight: 700,
            mb: 3,
            fontSize: "1.125rem",
            background: "linear-gradient(135deg, #7E57C2 0%, #5E35B1 100%)",
            backgroundClip: "text",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          Quick Navigation
        </Typography>
        <Grid container spacing={2}>
          {actions.slice(0, 2).map((action, index) => (
            <Grid item xs={6} key={index}>
              <Button
                variant="outlined"
                fullWidth
                startIcon={action.icon}
                onClick={action.action}
                sx={{
                  borderRadius: 2,
                  borderColor: "rgba(126, 87, 194, 0.3)",
                  color: "#7E57C2",
                  fontWeight: 600,
                  py: 1.5,
                  fontSize: "0.9rem",
                }}
              >
                {action.label.replace("Continue ", "").replace("Explore ", "")}
              </Button>
            </Grid>
          ))}
        </Grid>
      </CardContent>
    </Card>
  );
};

export default QuickActions;
