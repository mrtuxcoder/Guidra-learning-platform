import React from "react";
import {
  Card,
  CardContent,
  Typography,
  Box,
  Chip,
  Grid,
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

  const InfoItem = ({ icon, label, value }) => (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        gap: 1.5,
        p: 2,
        borderRadius: 2,
        border: `1px solid ${profileTheme.border}`,
        background: "rgba(126, 87, 194, 0.04)",
        height: "100%",
        width: "100%",
        maxWidth: "100%",
        boxSizing: "border-box",
      }}
    >
      <Box
        sx={{
          width: 36,
          height: 36,
          borderRadius: 2,
          background: profileTheme.gradient,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
        }}
      >
        {React.cloneElement(icon, {
          sx: { fontSize: 18, color: "white" },
        })}
      </Box>

      <Box sx={{ flex: 1, minWidth: 0 }}>
        <Typography
          variant="caption"
          sx={{
            color: "text.secondary",
            fontWeight: 700,
            textTransform: "uppercase",
            letterSpacing: 0.6,
            fontSize: "0.65rem",
            display: "block",
            mb: 0.5,
          }}
        >
          {label}
        </Typography>
        <Typography
          variant="body2"
          sx={{
            color: "text.primary",
            fontWeight: 600,
            wordBreak: "break-word",
          }}
        >
          {value || "Not specified"}
        </Typography>
      </Box>
    </Box>
  );

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
                background: profileTheme.gradient,
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
                  background: profileTheme.gradient,
                  backgroundClip: "text",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
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

        {/* Info Items - Responsive Grid */}
        <Grid
          container
          spacing={2}
          alignItems="flex-start"
          sx={{ width: "100%" }}
        >
          <Grid item xs={12} sm={6} sx={{ width: "100%" }}>
            <InfoItem
              icon={<Email />}
              label="Email Address"
              value={user?.email}
            />
          </Grid>
          <Grid item xs={12} sm={6} sx={{ width: "100%" }}>
            <InfoItem
              icon={<CalendarToday />}
              label="Member Since"
              value={
                user?.createdAt
                  ? new Date(user.createdAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })
                  : null
              }
            />
          </Grid>
          <Grid item xs={12} sx={{ width: "100%" }}>
            <InfoItem
              icon={<Lightbulb />}
              label="Learning Goal"
              value={user?.reasonForLearning || user?.learningMotivation}
            />
          </Grid>
        </Grid>

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
