import React from "react";
import {
  Card,
  CardContent,
  Typography,
  Box,
  Chip,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  useTheme,
  alpha,
  useMediaQuery,
} from "@mui/material";
import { Email, CalendarToday, Lightbulb, Person } from "@mui/icons-material";
import { profileTheme, cardSx } from "./constants";

const PersonalInfo = ({ user }) => {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const infoItems = [
    {
      icon: <Email />,
      label: "Email Address",
      value: user?.email,
    },
    {
      icon: <CalendarToday />,
      label: "Member Since",
      value: user?.createdAt
        ? new Date(user.createdAt).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
          })
        : null,
    },
    {
      icon: <Lightbulb />,
      label: "Learning Goal",
      value: user?.reasonForLearning || user?.learningMotivation,
    },
  ];

  return (
    <Card
      elevation={0}
      sx={{
        ...cardSx,
        overflow: "visible",
        height: { md: "100%" },
        display: "flex",
        flexDirection: "column",
      }}
    >
      <CardContent
        sx={{
          p: isMobile ? 2 : 2.5,
          "&:last-child": { pb: isMobile ? 2 : 2.5 },
          height: "100%",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* Header */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 2,
            mb: 2.5,
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
            <Box
              sx={{
                width: 32,
                height: 32,
                borderRadius: 2,
                bgcolor: "primary.main",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Person sx={{ fontSize: 18, color: "white" }} />
            </Box>
            <Box>
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 700,
                  fontSize: isMobile ? "1.05rem" : "1.2rem",
                }}
              >
                Personal Info
              </Typography>
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{ fontSize: "0.75rem" }}
              >
                Profile details and preferences
              </Typography>
            </Box>
          </Box>
        </Box>

        <Box sx={{ border: "1px solid", borderColor: "divider", borderRadius: 2, px: 1.5 }}>
          <List disablePadding>
            {infoItems.map((item, index) => (
              <React.Fragment key={item.label}>
                <ListItem disableGutters sx={{ py: 1.2 }}>
                  <ListItemIcon sx={{ minWidth: 38 }}>
                    <Box
                      sx={{
                        width: 30,
                        height: 30,
                        borderRadius: 1.5,
                        bgcolor: "primary.main",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "white",
                      }}
                    >
                      {React.cloneElement(item.icon, { sx: { fontSize: 16 } })}
                    </Box>
                  </ListItemIcon>
                  <ListItemText
                    primary={item.label}
                    secondary={item.value || "Not specified"}
                    primaryTypographyProps={{ variant: "caption", color: "text.secondary" }}
                    secondaryTypographyProps={{ variant: "body2", fontWeight: 600 }}
                  />
                </ListItem>
                {index < infoItems.length - 1 && <Divider />}
              </React.Fragment>
            ))}
          </List>
        </Box>

        {/* Learning Style Chip if available */}
        {user?.learningStyle && (
          <Box
            sx={{
              mt: 2,
              pt: 2,
              borderTop: "1px solid",
              borderColor: profileTheme.border,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 2,
            }}
          >
            <Typography
              variant="caption"
              color="text.secondary"
              sx={{ fontWeight: 600, fontSize: "0.75rem" }}
            >
              Learning Style
            </Typography>
            <Chip
              icon={<Lightbulb sx={{ fontSize: 16 }} />}
              label={`${
                user.learningStyle.charAt(0).toUpperCase() +
                user.learningStyle.slice(1)
              } Learner`}
              variant="filled"
              sx={{
                background: alpha(
                  theme.palette.primary.main,
                  isDark ? 0.2 : 0.12
                ),
                color: isDark
                  ? theme.palette.primary.light
                  : profileTheme.primaryDark,
                fontWeight: 600,
                fontSize: "0.75rem",
                border: `1px solid ${alpha(
                  theme.palette.primary.main,
                  isDark ? 0.4 : 0.2
                )}`,
                "& .MuiChip-icon": {
                  color: isDark
                    ? theme.palette.primary.light
                    : profileTheme.primary,
                },
              }}
            />
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

export default PersonalInfo;
