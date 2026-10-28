import React from "react";
import {
  Paper,
  Typography,
  Avatar,
  Box,
  useTheme,
  useMediaQuery,
  alpha,
  Chip,
} from "@mui/material";
import { Email, RocketLaunch } from "@mui/icons-material";

const ProfileHeader = ({ user, styleInfo }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <Paper
      elevation={0}
      sx={{
        p: isMobile ? 2 : 2.5,
        bgcolor: "background.paper",
        color: "text.primary",
        borderRadius: 2,
        border: "1px solid",
        borderColor: "divider",
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: isMobile ? 2 : 2.5,
        }}
      >
        {/* Compact Avatar */}
        <Avatar
          sx={{
            width: isMobile ? 48 : 56,
            height: isMobile ? 48 : 56,
            bgcolor: (theme) => alpha(theme.palette.primary.main, 0.12),
            color: "primary.main",
            fontSize: isMobile ? "1.2rem" : "1.4rem",
            fontWeight: 700,
            border: "1px solid",
            borderColor: (theme) => alpha(theme.palette.primary.main, 0.25),
          }}
        >
          {user?.name ? user.name.charAt(0).toUpperCase() : "U"}
        </Avatar>

        {/* User Info */}
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Typography
            variant={isMobile ? "subtitle1" : "h6"}
            fontWeight="700"
            sx={{
              color: "text.primary",
              lineHeight: 1.2,
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {user?.name || "User"}
          </Typography>

          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 0.75,
              mt: 0.25,
            }}
          >
            <Email
              sx={{
                fontSize: 14,
                color: "text.secondary",
              }}
            />
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
                fontSize: "0.85rem",
              }}
            >
              {user?.email || "No email"}
            </Typography>
          </Box>

          {styleInfo && (
            <Chip
              icon={<RocketLaunch sx={{ fontSize: 13 }} />}
              label={`${styleInfo.label} Learner`}
              size="small"
              sx={{
                mt: 1,
                height: 22,
                fontSize: "0.72rem",
                bgcolor: "background.default",
                border: "1px solid",
                borderColor: "divider",
                color: "text.secondary",
              }}
            />
          )}
        </Box>
      </Box>
    </Paper>
  );
};

export default ProfileHeader;
