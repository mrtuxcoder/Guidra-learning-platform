import React from "react";
import {
  Card,
  CardContent,
  Box,
  Typography,
  List,
  ListItem,
  ListItemText,
  Divider,
  Stack,
} from "@mui/material";
import { TrendingUp } from "@mui/icons-material";
import { cardSx } from "./constants";

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
              bgcolor: "primary.main",
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
            }}
          >
            Quick Stats
          </Typography>
        </Box>
        <Box sx={{ border: "1px solid", borderColor: "divider", borderRadius: 2, px: 1.5 }}>
          <List disablePadding>
            <ListItem disableGutters sx={{ py: 1.2 }}>
              <ListItemText
                primary="Topics Mastered"
                secondary="Total completed topics"
                primaryTypographyProps={{ fontWeight: 600 }}
                secondaryTypographyProps={{ variant: "caption" }}
              />
              <Typography variant="h5" fontWeight={800} color="primary.main">
                {stats.completed}
              </Typography>
            </ListItem>
            <Divider />
            <ListItem disableGutters sx={{ py: 1.2 }}>
              <ListItemText
                primary="Subtopics Done"
                secondary="Overall subtopics progress"
                primaryTypographyProps={{ fontWeight: 600 }}
                secondaryTypographyProps={{ variant: "caption" }}
              />
              <Typography variant="h5" fontWeight={800} color="primary.dark">
                {stats.completedSubtopics}
              </Typography>
            </ListItem>
          </List>
        </Box>

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
              color: "primary.main",
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
