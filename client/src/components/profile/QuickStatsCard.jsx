import React from "react";
import {
  Card,
  CardContent,
  Box,
  Typography,
  Grid,
  Divider,
  Stack,
} from "@mui/material";
import { TrendingUp } from "@mui/icons-material";
import { profileTheme, cardSx } from "./constants";

const QuickStatsCard = ({ stats }) => {
  return (
    <Card sx={cardSx}>
      <CardContent sx={{ p: { xs: 2.5, sm: 3 } }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
          <Box
            sx={{
              width: 40,
              height: 40,
              borderRadius: 2,
              background: profileTheme.gradient,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <TrendingUp sx={{ fontSize: 20, color: "white" }} />
          </Box>
          <Typography
            variant="h6"
            sx={{
              fontWeight: 700,
              fontSize: { xs: "1rem", sm: "1.125rem" },
              background: profileTheme.gradient,
              backgroundClip: "text",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            Quick Stats
          </Typography>
        </Box>
        <Grid container spacing={2} alignItems="stretch" sx={{ width: "100%" }}>
          <Grid item xs={12} sm={6}>
            <Box
              sx={{
                p: 2,
                borderRadius: 2,
                border: `1px solid ${profileTheme.border}`,
                background: "rgba(126, 87, 194, 0.04)",
                height: "100%",
                width: "100%",
                maxWidth: "100%",
                boxSizing: "border-box",
              }}
            >
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{ fontWeight: 700, letterSpacing: 0.6, fontSize: "0.65rem" }}
              >
                TOPICS MASTERED
              </Typography>
              <Typography
                variant="h3"
                sx={{
                  fontWeight: 800,
                  fontSize: { xs: "2rem", sm: "2.4rem" },
                  color: profileTheme.primary,
                  lineHeight: 1.1,
                  mt: 0.5,
                }}
              >
                {stats.completed}
              </Typography>
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ fontSize: "0.8rem" }}
              >
                Total completed topics
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Box
              sx={{
                p: 2,
                borderRadius: 2,
                border: `1px solid ${profileTheme.border}`,
                background: "rgba(126, 87, 194, 0.04)",
                height: "100%",
                width: "100%",
                maxWidth: "100%",
                boxSizing: "border-box",
              }}
            >
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{ fontWeight: 700, letterSpacing: 0.6, fontSize: "0.65rem" }}
              >
                SUBTOPICS DONE
              </Typography>
              <Typography
                variant="h3"
                sx={{
                  fontWeight: 800,
                  fontSize: { xs: "2rem", sm: "2.4rem" },
                  color: profileTheme.primaryDark,
                  lineHeight: 1.1,
                  mt: 0.5,
                }}
              >
                {stats.completedSubtopics}
              </Typography>
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ fontSize: "0.8rem" }}
              >
                Overall subtopics progress
              </Typography>
            </Box>
          </Grid>
        </Grid>

        <Divider sx={{ my: 2 }} />

        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={1}
          alignItems={{ xs: "flex-start", sm: "center" }}
          justifyContent="space-between"
        >
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ fontSize: "0.8rem" }}
          >
            Keep learning every day to grow your streak.
          </Typography>
          <Typography
            variant="caption"
            sx={{
              color: profileTheme.primary,
              fontWeight: 700,
              letterSpacing: 0.6,
            }}
          >
            LAST 7 DAYS
          </Typography>
        </Stack>
      </CardContent>
    </Card>
  );
};

export default QuickStatsCard;
