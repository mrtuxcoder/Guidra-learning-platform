import React from "react";
import { Box, Typography, Avatar } from "@mui/material";
import { Psychology } from "@mui/icons-material";
import { mobileHeaderStyles } from "./styles";

const AuthHeader = ({ subtitle }) => {
  return (
    <Box sx={(theme) => mobileHeaderStyles.header(theme)}>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 1.5,
          mb: 2,
        }}
      >
        <Avatar
          sx={{
            bgcolor: "background.paper",
            color: "primary.main",
            width: 40,
            height: 40,
          }}
        >
          <Psychology />
        </Avatar>
        <Typography variant="h4" fontWeight="800">
          Guidra
        </Typography>
      </Box>
      <Typography
        variant="body1"
        sx={{ opacity: 0.9, mb: 3, maxWidth: 300, mx: "auto" }}
      >
        {subtitle}
      </Typography>
    </Box>
  );
};

export default AuthHeader;
