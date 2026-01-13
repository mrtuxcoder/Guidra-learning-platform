import React from "react";
import { Button, CircularProgress } from "@mui/material";
import { Google } from "@mui/icons-material";
import { buttonStyles } from "./styles";

const GoogleButton = ({ loading, onClick, text = "Continue with Google" }) => {
  return (
    <Button
      fullWidth
      variant="outlined"
      startIcon={loading ? <CircularProgress size={20} /> : <Google />}
      onClick={onClick}
      disabled={loading}
      sx={buttonStyles.googleButton}
    >
      {loading ? "Redirecting..." : text}
    </Button>
  );
};

export default GoogleButton;
