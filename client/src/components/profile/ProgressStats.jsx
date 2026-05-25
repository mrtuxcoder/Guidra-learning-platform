import React from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  CircularProgress,
  useTheme,
  useMediaQuery,
  alpha,
} from "@mui/material";
import {
  TrendingUp,
  CheckCircle,
  PlayCircle,
  ListAlt,
} from "@mui/icons-material";
import { profileTheme, cardSx } from "./constants";

const CircularProgressWithLabel = ({ value, size = 80, thickness = 4 }) => {
  return (
    <Box sx={{ position: "relative", display: "inline-flex" }}>
      <CircularProgress
        variant="determinate"
        value={100}
        size={size}
        thickness={thickness}
        sx={{
          color: "rgba(126, 87, 194, 0.1)",
          position: "absolute",
        }}
      />
      <CircularProgress
        variant="determinate"
        value={value}
        size={size}
        thickness={thickness}
        sx={{
          color: value === 100 ? "#10b981" : profileTheme.primary,
        }}
      />
      <Box
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          bottom: 0,
          right: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Typography
          variant={size > 80 ? "h5" : "h6"}
          component="div"
          fontWeight="700"
          sx={{
            background: `linear-gradient(135deg, ${profileTheme.primary} 0%, ${profileTheme.primaryDark} 100%)`,
            backgroundClip: "text",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          {value}%
        </Typography>
      </Box>
    </Box>
  );
};

const StatBox = ({ icon: Icon, value, label, color, isMobile }) => (
  <Box
    sx={{
      textAlign: "left",
      p: isMobile ? 1.25 : 1.5,
      height: "100%",
      width: "100%",
      maxWidth: "100%",
      boxSizing: "border-box",
      display: "flex",
      alignItems: "center",
      gap: 1.25,
      borderRadius: 2,
      border: `1px solid ${profileTheme.border}`,
      background: "rgba(126, 87, 194, 0.04)",
    }}
  >
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        width: isMobile ? 30 : 36,
        height: isMobile ? 30 : 36,
        borderRadius: "50%",
        bgcolor: alpha(color, 0.1),
        color: color,
        flexShrink: 0,
      }}
    >
      <Icon sx={{ fontSize: isMobile ? 14 : 18 }} />
    </Box>
    <Box>
      <Typography
        variant={isMobile ? "body2" : "h6"}
        fontWeight="700"
        sx={{
          mb: 0.25,
          lineHeight: 1.2,
          background: `linear-gradient(135deg, ${color} 0%, ${color}99 100%)`,
          backgroundClip: "text",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
        }}
      >
        {value}
      </Typography>
      <Typography
        variant="caption"
        color="text.secondary"
        sx={{ lineHeight: 1.2, fontSize: isMobile ? "0.7rem" : "0.75rem" }}
      >
        {label}
      </Typography>
    </Box>
  </Box>
);

const ProgressStats = ({ stats }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.down("md"));

  const safeStats = stats || {
    progressPercentage: 0,
    totalTopics: 0,
    completed: 0,
    inProgress: 0,
    completedSubtopics: 0,
    totalSubtopics: 0,
  };

  const statItems = [
    {
      icon: ListAlt,
      value: safeStats.totalTopics || 0,
      label: "Topics",
      color: profileTheme.primary,
    },
    {
      icon: CheckCircle,
      value: safeStats.completed || 0,
      label: "Completed",
      color: "#10b981",
    },
    {
      icon: PlayCircle,
      value: safeStats.inProgress || 0,
      label: "In Progress",
      color: "#f59e0b",
    },
    {
      icon: ListAlt,
      value: `${safeStats.completedSubtopics || 0}/${
        safeStats.totalSubtopics || 0
      }`,
      label: "Subtopics",
      color: "#8b5cf6",
    },
  ];

  return (
    <Card sx={{ ...cardSx, overflow: "visible" }}>
      <CardContent
        sx={{
          p: isMobile ? 2 : 2.5,
          "&:last-child": { pb: isMobile ? 2 : 2.5 },
        }}
      >
        {/* Header */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1.5,
            mb: isMobile ? 2 : 3,
            justifyContent: "space-between",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
            <Box
              sx={{
                width: isMobile ? 32 : 40,
                height: isMobile ? 32 : 40,
                borderRadius: 2,
                background: profileTheme.gradient,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              <TrendingUp sx={{ fontSize: isMobile ? 16 : 20, color: "white" }} />
            </Box>
            <Box>
              <Typography
                variant={isMobile ? "subtitle1" : "h6"}
                fontWeight="700"
                sx={{
                  background: profileTheme.gradient,
                  backgroundClip: "text",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  lineHeight: 1.2,
                }}
              >
                Progress Overview
              </Typography>
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{ fontSize: isMobile ? "0.7rem" : "0.75rem" }}
              >
                Keep your learning streak alive
              </Typography>
            </Box>
          </Box>
          <Typography
            variant="caption"
            color="text.secondary"
            sx={{ fontSize: "0.7rem", display: { xs: "none", sm: "block" } }}
          >
            Updated today
          </Typography>
        </Box>

        {/* Progress Circle and Stats Side by Side on larger screens */}
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: isMobile ? "1fr" : "auto 1fr",
            gap: isMobile ? 2 : 3,
            alignItems: "center",
            mb: isMobile ? 2 : 3,
          }}
        >
          <Box sx={{ display: "flex", justifyContent: "center" }}>
            <CircularProgressWithLabel
              value={safeStats.progressPercentage || 0}
              size={isMobile ? 84 : isTablet ? 96 : 110}
              thickness={isMobile ? 4 : 5}
            />
          </Box>

          <Grid
            container
            spacing={1.5}
            alignItems="stretch"
            sx={{ width: "100%" }}
          >
            {statItems.map((item, index) => (
              <Grid item xs={12} sm={6} md={3} key={index}>
                <StatBox
                  icon={item.icon}
                  value={item.value}
                  label={item.label}
                  color={item.color}
                  isMobile={isMobile}
                />
              </Grid>
            ))}
          </Grid>
        </Box>

        {/* Progress Bar - Compact */}
        <Box sx={{ width: "100%" }}>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              mb: 1,
            }}
          >
            <Typography
              variant="caption"
              color="text.primary"
              fontWeight="600"
              sx={{ fontSize: isMobile ? "0.7rem" : "0.75rem" }}
            >
              Overall Progress
            </Typography>
            <Typography
              variant="caption"
              fontWeight="700"
              sx={{
                background: profileTheme.gradient,
                backgroundClip: "text",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                fontSize: isMobile ? "0.7rem" : "0.75rem",
              }}
            >
              {safeStats.progressPercentage || 0}%
            </Typography>
          </Box>
          <Box
            sx={{
              width: "100%",
              height: isMobile ? 6 : 8,
              borderRadius: 4,
              backgroundColor: alpha(profileTheme.primary, 0.12),
              overflow: "hidden",
            }}
          >
            <Box
              sx={{
                height: "100%",
                borderRadius: 4,
                background: profileTheme.gradient,
                width: `${safeStats.progressPercentage || 0}%`,
                transition: "width 0.5s ease-in-out",
                boxShadow: "0 2px 8px rgba(126, 87, 194, 0.25)",
              }}
            />
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

export default ProgressStats;
