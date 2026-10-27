import React from "react";
import { Box, Typography, Button, Fade } from "@mui/material";
import { ArrowForward } from "@mui/icons-material";

const BasicLearningOption = ({ isValidTopic, generating, onClick }) => {
  if (!isValidTopic || generating) return null;

  return (
    <Fade in={isValidTopic} timeout={250}>
      <Box
        sx={{
          mt: 2,
          p: 2,
          borderRadius: "8px",
          border: "1px dashed",
          borderColor: "divider",
          bgcolor: "background.paper",
          textAlign: "center",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: 1.5,
        }}
      >
        <Typography variant="body2" sx={{ color: "text.secondary", fontSize: "0.82rem" }}>
          Prefer a lighter start without full curriculum generation?
        </Typography>

        <Button
          variant="outlined"
          size="small"
          onClick={onClick}
          sx={{
            px: 2,
            height: 32,
            fontWeight: 500,
            borderColor: "divider",
            color: "text.secondary",
            borderRadius: "6px",
            fontSize: "0.78rem",
            textTransform: "none",
            "&:hover": {
              borderColor: "divider",
              color: "text.primary",
              bgcolor: "action.hover",
            },
          }}
          endIcon={<ArrowForward sx={{ fontSize: 14 }} />}
        >
          Start Basic Learning
        </Button>
      </Box>
    </Fade>
  );
};

export default BasicLearningOption;
