import React from "react";
import {
  Card,
  CardContent,
  Box,
  Typography,
} from "@mui/material";
import { cardSx } from "./constants";

const QuickStatsCard = ({ stats }) => {
  return (
    <Card sx={cardSx}>
      <CardContent sx={{ p: { xs: 2.5, sm: 3 } }}>
        <Typography variant="subtitle1" fontWeight={700} sx={{ mb: 2 }}>
          Learning Stats
        </Typography>
        <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 2, mb: 2 }}>
          <Box>
            <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600, letterSpacing: 0.5, textTransform: "uppercase", fontSize: "0.68rem" }}>
              Topics Mastered
            </Typography>
            <Typography variant="h5" sx={{ fontWeight: 800, color: "text.primary", lineHeight: 1.2, mt: 0.5 }}>
              {stats.completed}
            </Typography>
            <Typography variant="caption" color="text.secondary">Total completed</Typography>
          </Box>
          <Box>
            <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600, letterSpacing: 0.5, textTransform: "uppercase", fontSize: "0.68rem" }}>
              Subtopics Done
            </Typography>
            <Typography variant="h5" sx={{ fontWeight: 800, color: "text.primary", lineHeight: 1.2, mt: 0.5 }}>
              {stats.completedSubtopics}
            </Typography>
            <Typography variant="caption" color="text.secondary">Overall progress</Typography>
          </Box>
        </Box>
        <Typography variant="caption" color="text.secondary" sx={{ fontSize: "0.78rem" }}>
          Keep learning every day to grow your streak.
        </Typography>
      </CardContent>
    </Card>
  );
};

export default QuickStatsCard;
