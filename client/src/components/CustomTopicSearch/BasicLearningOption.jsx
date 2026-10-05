import React from "react";
import { Box, Typography, Button, Fade } from "@mui/material";
import { alpha, useTheme } from "@mui/material/styles";
import { ArrowForward } from "@mui/icons-material";

const BasicLearningOption = ({ isValidTopic, generating, onClick }) => {
  const theme = useTheme();

  if (!isValidTopic || generating) return null;

  return (
    <Fade in={isValidTopic}>
      <Box
        sx={{
          mt: { xs: 2, md: 3 },
          p: 2.5,
          borderRadius: "14px",
          border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
          background: "background.paper",
          textAlign: "center",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
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
            borderRadius: "10px",
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
