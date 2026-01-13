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

const CircularProgressWithLabel = ({ value, size = 80, thickness = 4 }) => {
  const purpleTheme = {
    primary: "#7E57C2",
    primaryLight: "#B39DDB",
    primaryDark: "#5E35B1",
  };

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
          color: value === 100 ? "#10b981" : purpleTheme.primary,
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
            background: `linear-gradient(135deg, ${purpleTheme.primary} 0%, ${purpleTheme.primaryDark} 100%)`,
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
      textAlign: "center",
      p: isMobile ? 0.5 : 1,
      height: "100%",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
    }}
  >
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        width: isMobile ? 28 : 36,
        height: isMobile ? 28 : 36,
        borderRadius: "50%",
        bgcolor: alpha(color, 0.1),
        color: color,
        mb: 0.5,
      }}
    >
      <Icon sx={{ fontSize: isMobile ? 14 : 18 }} />
    </Box>
    <Typography
      variant={isMobile ? "body2" : "h6"}
      fontWeight="600"
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
);

const ProgressStats = ({ stats }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.down("md"));

  const purpleTheme = {
    primary: "#7E57C2",
    primaryLight: "#B39DDB",
    primaryDark: "#5E35B1",
    gradient: "linear-gradient(135deg, #7E57C2 0%, #5E35B1 100%)",
    lightBg: "#F3E5F5",
  };

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
      color: purpleTheme.primary,
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
    <Card
      sx={{
        background: "white",
        border: "1px solid",
        borderColor: "rgba(126, 87, 194, 0.12)",
        boxShadow: "none",
        borderRadius: 3,
        overflow: "visible",
      }}
    >
      <CardContent
        sx={{
          p: isMobile ? 2 : 2.5,
          "&:last-child": { pb: isMobile ? 2 : 2.5 },
        }}
      >
        {/* Header - Compact */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1.5,
            mb: isMobile ? 2 : 2.5,
          }}
        >
          <Box
            sx={{
              width: isMobile ? 32 : 40,
              height: isMobile ? 32 : 40,
              borderRadius: 2,
              background: purpleTheme.gradient,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <TrendingUp sx={{ fontSize: isMobile ? 16 : 20, color: "white" }} />
          </Box>
          <Box sx={{ flex: 1 }}>
            <Typography
              variant={isMobile ? "subtitle1" : "h6"}
              fontWeight="700"
              sx={{
                background: purpleTheme.gradient,
                backgroundClip: "text",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                lineHeight: 1.2,
              }}
            >
              Progress
            </Typography>
            <Typography
              variant="caption"
              color="text.secondary"
              sx={{ fontSize: isMobile ? "0.7rem" : "0.75rem" }}
            >
              Your learning journey
            </Typography>
          </Box>
        </Box>

        {/* Progress Circle and Stats Side by Side on larger screens */}
        <Box
          sx={{
            display: "flex",
            flexDirection: isMobile ? "column" : "row",
            alignItems: "center",
            gap: isMobile ? 2 : 3,
            mb: isMobile ? 2 : 2.5,
          }}
        >
          {/* Progress Circle */}
          <Box sx={{ flexShrink: 0 }}>
            <CircularProgressWithLabel
              value={safeStats.progressPercentage || 0}
              size={isMobile ? 80 : isTablet ? 90 : 100}
              thickness={isMobile ? 4 : 5}
            />
          </Box>

          {/* Stats Grid - Compact */}
          <Grid container spacing={0.5} sx={{ flex: 1 }}>
            {statItems.map((item, index) => (
              <Grid item xs={6} key={index}>
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
                background: purpleTheme.gradient,
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
              backgroundColor: "rgba(126, 87, 194, 0.1)",
              overflow: "hidden",
            }}
          >
            <Box
              sx={{
                height: "100%",
                borderRadius: 4,
                background: purpleTheme.gradient,
                width: `${safeStats.progressPercentage || 0}%`,
                transition: "width 0.5s ease-in-out",
                boxShadow: "0 2px 8px rgba(126, 87, 194, 0.3)",
              }}
            />
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

export default ProgressStats;
