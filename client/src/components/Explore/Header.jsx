import React from "react";
import { Box, Typography, Fade } from "@mui/material";
import { School } from "@mui/icons-material";

const Header = () => {
  return (
    <Box sx={{ textAlign: "center", mb: { xs: 3, md: 4 } }}>
      <Fade in timeout={600}>
        <Box>
          <Box
            sx={{
              width: { xs: 60, md: 80 },
              height: { xs: 60, md: 80 },
              borderRadius: "50%",
              background: "linear-gradient(135deg, #7C3AED 0%, #5E35B1 100%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto",
              mb: 2,
              boxShadow: "0 8px 32px rgba(126, 87, 194, 0.2)",
            }}
          >
            <School
              sx={{
                fontSize: { xs: "1.75rem", md: "2.5rem" },
                color: "white",
              }}
            />
          </Box>
          <Typography
            variant="h3"
            sx={{
              fontWeight: 800,
              background: "linear-gradient(135deg, #7C3AED 0%, #5E35B1 100%)",
              backgroundClip: "text",
              WebkitBackgroundClip: "text",
              color: "transparent",
              mb: 1,
              fontSize: {
                xs: "1.5rem",
                sm: "1.75rem",
                md: "2.5rem",
                lg: "3rem",
              },
            }}
          >
            Explore Learning Paths
          </Typography>
          <Typography
            variant="h6"
            sx={{
              color: "text.secondary",
              fontWeight: 400,
              fontSize: { xs: "0.85rem", sm: "0.9rem", md: "1.1rem" },
            }}
          >
            45 curated courses • Start your journey
          </Typography>
        </Box>
      </Fade>
    </Box>
  );
};

export default Header;
