import React from "react";
import { Box, Typography, Avatar } from "@mui/material";
import { Psychology } from "@mui/icons-material";
import { desktopSidebarStyles } from "./styles";

const AuthSidebar = ({ features, title, subtitle }) => {
  return (
    <Box sx={desktopSidebarStyles.sidebar}>
      {/* Background Shapes */}
      <Box
        sx={{
          position: "absolute",
          top: -100,
          left: -100,
          width: 300,
          height: 300,
          borderRadius: "50%",
          background: "rgba(255,255,255,0.05)",
          zIndex: 0,
        }}
      />
      <Box
        sx={{
          position: "absolute",
          bottom: -50,
          right: -50,
          width: 200,
          height: 200,
          borderRadius: "50%",
          background: "rgba(255,255,255,0.05)",
          zIndex: 0,
        }}
      />

      <Box sx={{ position: "relative", zIndex: 1 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 4 }}>
          <Avatar
            sx={{
              bgcolor: "white",
              color: "#7C3AED",
              width: 56,
              height: 56,
              boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
            }}
          >
            <Psychology fontSize="large" />
          </Avatar>
          <Typography variant="h3" fontWeight="900">
            Guidra
          </Typography>
        </Box>

        <Typography variant="h6" sx={{ mb: 6, opacity: 0.85, fontWeight: 400 }}>
          {subtitle}
        </Typography>

        {/* Desktop Feature Grid */}
        <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 2 }}>
          {features.map((feat, index) => (
            <Box key={index} sx={desktopSidebarStyles.featureCard}>
              <Box sx={desktopSidebarStyles.iconContainer}>{feat.icon}</Box>
              <Box sx={{ flex: 1, display: "flex", flexDirection: "column" }}>
                <Typography
                  variant="subtitle1"
                  fontWeight="700"
                  sx={{
                    color: "white",
                    fontSize: "1rem",
                    mb: 1,
                    lineHeight: 1.2,
                  }}
                >
                  {feat.label}
                </Typography>
                <Typography
                  variant="caption"
                  sx={{
                    opacity: 0.9,
                    lineHeight: 1.4,
                    color: "rgba(255,255,255,0.9)",
                    fontSize: "0.8rem",
                  }}
                >
                  {feat.desc}
                </Typography>
              </Box>
            </Box>
          ))}
        </Box>
      </Box>
    </Box>
  );
};

export default AuthSidebar;
