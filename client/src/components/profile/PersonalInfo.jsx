import React from "react";
import {
  Card,
  CardContent,
  Typography,
  Box,
  Chip,
  Grid,
  Divider,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import { Lightbulb } from "@mui/icons-material";
import { cardSx } from "./constants";

const PersonalInfo = ({ user }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const InfoItem = ({ label, value }) => (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 0.25 }}>
      <Typography
        variant="caption"
        sx={{
          color: "text.secondary",
          fontWeight: 600,
          fontSize: "0.7rem",
          textTransform: "uppercase",
          letterSpacing: 0.5,
        }}
      >
        {label}
      </Typography>
      <Typography
        variant="body2"
        sx={{ color: "text.primary", fontWeight: 500, wordBreak: "break-word" }}
      >
        {value || "Not specified"}
      </Typography>
    </Box>
  );

  return (
    <Card
      elevation={0}
      sx={{
        ...cardSx,
        overflow: "visible",
        width: "100%",
      }}
    >
      <CardContent
        sx={{
          p: isMobile ? 2 : 2.5,
          "&:last-child": { pb: isMobile ? 2 : 2.5 },
        }}
      >
        {/* Header */}
        <Typography variant="subtitle1" sx={{ fontWeight: 700, color: "text.primary", mb: 2 }}>
          Personal Info
        </Typography>

        {/* Info Items - Responsive Grid */}
        <Grid container spacing={2.5} alignItems="flex-start" sx={{ width: "100%", mb: 1 }}>
          <Grid item xs={12} sm={6} md={4}>
            <InfoItem label="Email Address" value={user?.email} />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <InfoItem
              label="Member Since"
              value={
                user?.createdAt
                  ? new Date(user.createdAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })
                  : "Active Member"
              }
            />
          </Grid>
          {user?.learningStyle && (
            <Grid item xs={12} sm={6} md={4}>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 0.5 }}>
                <Typography
                  variant="caption"
                  sx={{
                    color: "text.secondary",
                    fontWeight: 600,
                    fontSize: "0.7rem",
                    textTransform: "uppercase",
                    letterSpacing: 0.5,
                  }}
                >
                  Learning Style
                </Typography>
                <Chip
                  icon={<Lightbulb sx={{ fontSize: 14 }} />}
                  label={`${
                    user.learningStyle.charAt(0).toUpperCase() +
                    user.learningStyle.slice(1)
                  } Learner`}
                  size="small"
                  sx={{
                    alignSelf: "flex-start",
                    bgcolor: "background.default",
                    color: "text.primary",
                    fontWeight: 600,
                    fontSize: "0.75rem",
                    border: "1px solid",
                    borderColor: "divider",
                    height: 26,
                    "& .MuiChip-icon": { color: "text.secondary" },
                  }}
                />
              </Box>
            </Grid>
          )}
        </Grid>

        <Divider sx={{ my: 2 }} />

        {/* Learning Goal Section */}
        <Box>
          <Typography
            variant="caption"
            sx={{
              color: "text.secondary",
              fontWeight: 600,
              fontSize: "0.7rem",
              textTransform: "uppercase",
              letterSpacing: 0.5,
              display: "block",
              mb: 0.5,
            }}
          >
            Learning Goal
          </Typography>
          <Typography
            variant="body1"
            sx={{
              color: "text.primary",
              fontWeight: 500,
              lineHeight: 1.6,
              fontSize: "0.95rem",
            }}
          >
            {user?.reasonForLearning || user?.learningMotivation || "No specific goal specified. Explore topics to set your focus."}
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
};

export default PersonalInfo;
