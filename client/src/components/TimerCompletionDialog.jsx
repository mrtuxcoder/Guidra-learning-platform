import { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Button,
} from "@mui/material";
import { useTimer } from "../contexts/TimerContext";

export default function TimerCompletionDialog() {
  const { hasCompleted, setHasCompleted } = useTimer();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (hasCompleted) {
      setOpen(true);
      setHasCompleted(false);
    }
  }, [hasCompleted, setHasCompleted]);

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ fontWeight: 700 }}>Time is up! 🎉</DialogTitle>
      <DialogContent>
        <Typography color="text.secondary">
          Great work! Your study session is complete. Keep up the momentum!
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} variant="contained">
          OK
        </Button>
      </DialogActions>
    </Dialog>
  );
}
