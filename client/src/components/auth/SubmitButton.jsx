import React from "react";
import { Button, CircularProgress } from "@mui/material";
import { buttonStyles } from "./styles";

const SubmitButton = ({
  loading,
  disabled,
  text,
  type = "button",
  onClick,
}) => {
  return (
    <Button
      type={type}
      fullWidth
      variant="contained"
      size="large"
      disabled={disabled || loading}
      onClick={onClick}
      sx={buttonStyles.submitButton}
    >
      {loading ? <CircularProgress size={24} sx={{ color: "white" }} /> : text}
    </Button>
  );
};

export default SubmitButton;
