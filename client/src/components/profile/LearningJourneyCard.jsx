import React from "react";
import {
  Card,
  CardContent,
  Box,
  Typography,
  Button,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import { RocketLaunch } from "@mui/icons-material";
import { cardSx } from "./constants";

const LearningJourneyCard = ({ stats, onLaunchLesson }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <Card sx={cardSx}>
      <CardContent sx={{ p: { xs: 2.5, sm: 3 } }}>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            mb: 2,
          }}
        >
          <Typography variant="subtitle1" sx={{ fontWeight: 700, color: "text.primary" }}>
            Next Learning Session
          </Typography>
          {!isMobile && (
            <Button
              variant="contained"
              size="small"
              startIcon={<RocketLaunch sx={{ fontSize: 16 }} />}
              onClick={onLaunchLesson}
              sx={{
                borderRadius: "6px",
                textTransform: "none",
                fontWeight: 600,
                fontSize: "0.85rem",
              }}
            >
              Continue Learning
            </Button>
          )}
        </Box>

        <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 2, mb: 2 }}>
          <Box>
            <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600, letterSpacing: 0.5, textTransform: "uppercase", fontSize: "0.68rem" }}>
              Active Progress
            </Typography>
            <Typography variant="h5" sx={{ fontWeight: 800, color: "primary.main", lineHeight: 1.2, mt: 0.5 }}>
              {stats.progressPercentage}%
            </Typography>
            <Typography variant="caption" color="text.secondary">Course completion</Typography>
          </Box>
          <Box>
            <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600, letterSpacing: 0.5, textTransform: "uppercase", fontSize: "0.68rem" }}>
              Topics In Progress
            </Typography>
            <Typography variant="h5" sx={{ fontWeight: 800, color: "text.primary", lineHeight: 1.2, mt: 0.5 }}>
              {stats.inProgress}
            </Typography>
            <Typography variant="caption" color="text.secondary">Currently learning</Typography>
          </Box>
        </Box>

        {isMobile ? (
          <Button
            variant="contained"
            fullWidth
            size="small"
            startIcon={<RocketLaunch sx={{ fontSize: 16 }} />}
            onClick={onLaunchLesson}
            sx={{
              borderRadius: "6px",
              fontWeight: 600,
              py: 1,
              textTransform: "none",
            }}
          >
            Continue Learning
          </Button>
        ) : (
          <Typography variant="caption" color="text.secondary" sx={{ fontSize: "0.78rem" }}>
            Ready to continue where you left off.
          </Typography>
        )}
      </CardContent>
    </Card>
  );
};

export default LearningJourneyCard;
