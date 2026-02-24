import React from "react";
import {
  Card,
  CardContent,
  Box,
  Typography,
  Button,
  Stack,
  List,
  ListItem,
  ListItemText,
  Divider,
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
      <CardContent sx={{ p: { xs: 2.5, sm: 3.5 } }}>
        <Stack
          direction={{ xs: "column", md: "row" }}
          spacing={2}
          alignItems={{ xs: "flex-start", md: "center" }}
          justifyContent="space-between"
          sx={{ mb: { xs: 2.5, sm: 3 } }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Box
              sx={{
                width: { xs: 44, sm: 52 },
                height: { xs: 44, sm: 52 },
                borderRadius: 2,
                bgcolor: "primary.main",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <RocketLaunch
                sx={{
                  fontSize: { xs: 22, sm: 26 },
                  color: "white",
                }}
              />
            </Box>
            <Box>
              <Typography
                variant="h4"
                sx={{
                  fontWeight: 800,
                  fontSize: { xs: "1.4rem", sm: "1.7rem", md: "1.9rem" },
                  lineHeight: 1.2,
                }}
              >
                Your Learning Journey
              </Typography>
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ fontSize: { xs: "0.85rem", sm: "0.95rem" } }}
              >
                Keep up the great work and stay on track.
              </Typography>
            </Box>
          </Box>

          {!isMobile && (
            <Button
              variant="contained"
              size="large"
              startIcon={<RocketLaunch />}
              onClick={onLaunchLesson}
              sx={{
                borderRadius: 3,
                bgcolor: "primary.main",
                fontWeight: 700,
                px: 3,
                py: 1.5,
                fontSize: "0.95rem",
                "&:hover": {
                  bgcolor: "primary.dark",
                },
              }}
            >
              Launch Next Lesson
            </Button>
          )}
        </Stack>

        <Box sx={{ border: "1px solid", borderColor: "divider", borderRadius: 2, px: 1.5, mb: { xs: 2, sm: 3 } }}>
          <List disablePadding>
            <ListItem disableGutters sx={{ py: 1.3 }}>
              <ListItemText
                primary="Overall Progress"
                secondary="Current completion across your learning"
                primaryTypographyProps={{ fontWeight: 600 }}
                secondaryTypographyProps={{ variant: "caption" }}
              />
              <Typography variant="h5" fontWeight={800} color="primary.main">
                {stats.progressPercentage}%
              </Typography>
            </ListItem>
            <Divider />
            <ListItem disableGutters sx={{ py: 1.3 }}>
              <ListItemText
                primary="In Progress"
                secondary="Topics currently active"
                primaryTypographyProps={{ fontWeight: 600 }}
                secondaryTypographyProps={{ variant: "caption" }}
              />
              <Typography variant="h5" fontWeight={800} color="primary.dark">
                {stats.inProgress}
              </Typography>
            </ListItem>
          </List>
        </Box>

        {isMobile && (
          <Button
            variant="contained"
            fullWidth
            size="large"
            startIcon={<RocketLaunch />}
            onClick={onLaunchLesson}
            sx={{
              borderRadius: 3,
              bgcolor: "primary.main",
              fontWeight: 700,
              py: { xs: 1.5, sm: 2 },
              fontSize: { xs: "0.9rem", sm: "1rem" },
              "&:hover": {
                bgcolor: "primary.dark",
              },
            }}
          >
            Launch Next Lesson
          </Button>
        )}
      </CardContent>
    </Card>
  );
};

export default LearningJourneyCard;
