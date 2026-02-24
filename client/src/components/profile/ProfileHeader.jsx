import React from "react";
import {
  Paper,
  Typography,
  Avatar,
  Box,
  useTheme,
  useMediaQuery,
  alpha,
} from "@mui/material";
import { Email, RocketLaunch } from "@mui/icons-material";

const ProfileHeader = ({ user, styleInfo }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isDark = theme.palette.mode === "dark";

  return (
    <Paper
      elevation={0}
      sx={{
        p: isMobile ? 2 : 3,
        background: "rgba(255, 255, 255, 0.08)",
        color: "white",
        borderRadius: 3,
        position: "relative",
        overflow: "hidden",
        border: `1px solid ${alpha("#fff", 0.2)}`,
        boxShadow: "none",
        backdropFilter: "blur(10px)",
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: isMobile ? "row" : "row",
          alignItems: "center",
          gap: isMobile ? 2 : 3,
          position: "relative",
          zIndex: 1,
        }}
      >
        {/* Compact Avatar */}
        <Box sx={{ position: "relative", flexShrink: 0 }}>
          <Avatar
            sx={{
              width: isMobile ? 56 : 72,
              height: isMobile ? 56 : 72,
              bgcolor: "rgba(255,255,255,0.2)",
              backdropFilter: "blur(10px)",
              border: `2px solid ${alpha("#fff", 0.3)}`,
              fontSize: isMobile ? "1.25rem" : "1.5rem",
              fontWeight: "bold",
              color: "white",
              position: "relative",
            }}
          >
            {user?.name ? user.name.charAt(0).toUpperCase() : "U"}
          </Avatar>
        </Box>

        {/* User Info - Compact */}
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Typography
            variant={isMobile ? "h6" : "h5"}
            fontWeight="700"
            gutterBottom
            sx={{
              textShadow: "0 1px 3px rgba(0,0,0,0.3)",
              color: "white",
              lineHeight: 1.2,
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {user?.name || "Explorer"}
          </Typography>

          {/* Email - Compact */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
              mb: 1,
            }}
          >
            <Email
              sx={{
                opacity: 0.9,
                fontSize: isMobile ? 16 : 18,
              }}
            />
            <Typography
              variant={isMobile ? "body2" : "body1"}
              sx={{
                opacity: 0.9,
                fontWeight: 400,
                textShadow: "0 1px 2px rgba(0,0,0,0.2)",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {user?.email || "Ready to learn!"}
            </Typography>
          </Box>

          {/* Learning Style - Compact */}
          {styleInfo && (
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1,
                mt: 0.5,
              }}
            >
              <RocketLaunch
                sx={{
                  opacity: 0.9,
                  fontSize: isMobile ? 14 : 16,
                }}
              />
              <Typography
                variant={isMobile ? "caption" : "body2"}
                sx={{
                  opacity: 0.85,
                  fontWeight: 500,
                  background: alpha(
                    theme.palette.common.white,
                    isDark ? 0.2 : 0.12
                  ),
                  px: 1,
                  py: 0.25,
                  borderRadius: 1,
                  backdropFilter: "blur(8px)",
                }}
              >
                {styleInfo.label} Learner
              </Typography>
            </Box>
          )}
        </Box>

        {/* Progress Indicator for Mobile */}
        {isMobile && user?.progress && (
          <Box
            sx={{
              flexShrink: 0,
              textAlign: "center",
            }}
          >
            <Typography
              variant="caption"
              sx={{
                opacity: 0.8,
                fontWeight: 600,
                display: "block",
              }}
            >
              {user.progress.filter((p) => p.completed).length}/
              {user.progress.length}
            </Typography>
            <Typography
              variant="caption"
              sx={{
                opacity: 0.7,
                fontSize: "0.7rem",
              }}
            >
              Complete
            </Typography>
          </Box>
        )}
      </Box>
    </Paper>
  );
};

export default ProfileHeader;
