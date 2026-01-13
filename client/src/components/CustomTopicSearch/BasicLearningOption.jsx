import React from "react";
import { Box, Typography, Button, Fade } from "@mui/material";
import { ArrowForward } from "@mui/icons-material";

const BasicLearningOption = ({ isValidTopic, generating, onClick }) => {
  if (!isValidTopic || generating) return null;

  return (
    <Fade in={isValidTopic}>
      <Box sx={{ textAlign: "center", mt: 2 }}>
        <Typography variant="body2" sx={{ color: "text.secondary", mb: 1 }}>
          Or continue with basic learning
        </Typography>

        <Button
          variant="outlined"
          size="large"
          onClick={onClick}
          sx={{
            px: 4,
            py: 1.5,
            fontWeight: 600,
            borderColor: "#7C3AED",
            color: "#7C3AED",
            borderRadius: "16px",
          }}
          endIcon={<ArrowForward />}
        >
          Start Basic Learning
        </Button>
      </Box>
    </Fade>
  );
};

export default BasicLearningOption;
