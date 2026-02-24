import React from "react";
import {
  Card,
  CardContent,
  Box,
  Typography,
  Button,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
} from "@mui/material";
import { School, Explore, Logout } from "@mui/icons-material";
import { cardSx } from "./constants";

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
                        bgcolor: "primary.main",
                        fontWeight: 600,
                        "&:hover": { bgcolor: "primary.dark" },
                      }
                    : {
                        borderColor:
                          action.color === "error"
                            ? "rgba(211, 47, 47, 0.3)"
                            : "primary.light",
                        color:
                          action.color === "error"
                            ? "error.main"
                            : "primary.main",
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
          }}
        >
          Quick Navigation
        </Typography>
        <Box sx={{ border: "1px solid", borderColor: "divider", borderRadius: 2, px: 1.5 }}>
          <List disablePadding>
            {actions.map((action, index) => (
              <React.Fragment key={action.label}>
                <ListItem disableGutters sx={{ py: 1.2, gap: 1.25 }}>
                  <ListItemIcon sx={{ minWidth: 38 }}>
                    <Box
                      sx={{
                        width: 30,
                        height: 30,
                        borderRadius: 1.5,
                        backgroundColor:
                          action.variant === "contained"
                            ? "primary.main"
                            : "action.hover",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color:
                          action.variant === "contained" ? "white" : "primary.main",
                      }}
                    >
                      {action.icon}
                    </Box>
                  </ListItemIcon>
                  <ListItemText
                    primary={action.label}
                    primaryTypographyProps={{ fontWeight: 600 }}
                  />
                  <Button
                    variant={action.variant === "contained" ? "contained" : "outlined"}
                    onClick={action.action}
                    sx={{
                      borderRadius: 2,
                      textTransform: "none",
                      fontWeight: 600,
                      minWidth: 100,
                      ...(action.variant === "contained"
                        ? {
                            bgcolor: "primary.main",
                            "&:hover": { bgcolor: "primary.dark" },
                          }
                        : {
                            borderColor:
                              action.color === "error"
                                ? "rgba(211, 47, 47, 0.3)"
                                : "primary.light",
                            color:
                              action.color === "error"
                                ? "error.main"
                                : "primary.main",
                          }),
                    }}
                  >
                    Open
                  </Button>
                </ListItem>
                {index < actions.length - 1 && <Divider />}
              </React.Fragment>
            ))}
          </List>
        </Box>
      </CardContent>
    </Card>
  );
};

export default QuickActions;
