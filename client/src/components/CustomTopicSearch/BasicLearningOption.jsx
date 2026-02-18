import React from "react";
import { Box, Typography, Button, Fade } from "@mui/material";
import { alpha, useTheme } from "@mui/material/styles";
import { ArrowForward } from "@mui/icons-material";

const BasicLearningOption = ({ isValidTopic, generating, onClick }) => {
  if (!isValidTopic || generating) return null;

  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";

  return (
    <Fade in={isValidTopic}>
      <Box
        sx={{
          mt: { xs: 2, md: 3 },
          p: 2.5,
          borderRadius: "18px",
          border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
          background: isDark
            ? "rgba(15, 15, 23, 0.8)"
            : "rgba(255, 255, 255, 0.9)",
          textAlign: "left",
        }}
      >
        <Typography variant="body2" sx={{ color: "text.secondary", mb: 1 }}>
          Prefer a lighter start?
        </Typography>

        <Button
          variant="outlined"
          size="large"
          onClick={onClick}
          sx={{
            px: 3.5,
            py: 1.2,
            fontWeight: 600,
            borderColor: alpha(theme.palette.primary.main, 0.5),
            color: theme.palette.primary.main,
            borderRadius: "14px",
            textTransform: "none",
          }}
          endIcon={<ArrowForward />}
        >
          Start basic learning
        </Button>
      </Box>
    </Fade>
  );
};

export default BasicLearningOption;
