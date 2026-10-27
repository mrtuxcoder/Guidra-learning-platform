import React from "react";
import {
  Card,
  CardContent,
  Typography,
  Chip,
  Box,
  Button,
  CircularProgress,
  Fade,
  useTheme,
  alpha,
} from "@mui/material";
import { CATEGORY_DATA } from "./constants.jsx";
import { AutoStories, ArrowForward } from "@mui/icons-material";

const CourseCard = ({
  topic,
  isSelected,
  onSelect,
  onStart,
  isLoading = false,
  index = 0,
}) => {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  const categoryData =
    CATEGORY_DATA[topic.category] || CATEGORY_DATA.programming;

  return (
    <Fade in timeout={250 + Math.min(index * 25, 400)}>
      <Card
        elevation={0}
        onClick={() => onSelect && onSelect(topic.id)}
        sx={{
          borderRadius: "8px",
          border: "1px solid",
          borderColor: isSelected
            ? "primary.main"
            : "divider",
          backgroundColor: isSelected
            ? isDark
              ? alpha(theme.palette.primary.main, 0.08)
              : alpha(theme.palette.primary.main, 0.04)
            : "background.paper",
          transition: "border-color 0.15s ease, background-color 0.15s ease",
          cursor: "pointer",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          height: "100%",
          position: "relative",
          "&:hover": {
            borderColor: isSelected
              ? "primary.main"
              : isDark
              ? "rgba(255, 255, 255, 0.2)"
              : "rgba(0, 0, 0, 0.2)",
          },
        }}
      >
        <CardContent
          sx={{
            p: 2,
            display: "flex",
            flexDirection: "column",
            flexGrow: 1,
            "&:last-child": { pb: 2 },
          }}
        >
          {/* Category Chip & Match Rate */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 1.25,
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 0.75 }}>
              <Box
                sx={{
                  width: 24,
                  height: 24,
                  borderRadius: "4px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  bgcolor: isDark
                    ? "rgba(255, 255, 255, 0.06)"
                    : "rgba(0, 0, 0, 0.04)",
                  color: "text.secondary",
                }}
              >
                <AutoStories sx={{ fontSize: 13 }} />
              </Box>
              <Typography
                variant="caption"
                sx={{
                  color: "text.secondary",
                  fontWeight: 600,
                  fontSize: "0.74rem",
                }}
              >
                {categoryData.name}
              </Typography>
            </Box>

            {topic.popularity && (
              <Chip
                label={`${topic.popularity}% Match`}
                size="small"
                sx={{
                  height: 20,
                  fontSize: "0.68rem",
                  fontWeight: 600,
                  borderRadius: "4px",
                  bgcolor: isDark ? "rgba(255, 255, 255, 0.06)" : "rgba(0, 0, 0, 0.04)",
                  color: "text.secondary",
                  border: "1px solid",
                  borderColor: "divider",
                }}
              />
            )}
          </Box>

          {/* Topic Title */}
          <Typography
            variant="h6"
            sx={{
              fontWeight: 700,
              fontSize: "0.98rem",
              lineHeight: 1.35,
              color: "text.primary",
              letterSpacing: "-0.01em",
              mb: 0.75,
            }}
          >
            {topic.name}
          </Typography>

          {/* Description */}
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{
              lineHeight: 1.5,
              fontSize: "0.84rem",
              mb: 2,
              flexGrow: 1,
            }}
          >
            {topic.description}
          </Typography>

          {/* Card Action Row */}
          <Box
            sx={{
              pt: 1.25,
              borderTop: "1px solid",
              borderColor: "divider",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Typography
              variant="caption"
              sx={{ color: "text.secondary", fontWeight: 500, fontSize: "0.74rem" }}
            >
              Curated Curriculum
            </Typography>

            <Button
              size="small"
              variant={isSelected ? "contained" : "outlined"}
              color={isSelected ? "primary" : "inherit"}
              disabled={isLoading}
              onClick={(e) => {
                e.stopPropagation();
                if (onStart) onStart(topic);
                else if (onSelect) onSelect(topic.id);
              }}
              endIcon={
                isLoading ? (
                  <CircularProgress size={13} color="inherit" />
                ) : (
                  <ArrowForward sx={{ fontSize: 14 }} />
                )
              }
              sx={{
                height: 30,
                borderRadius: "6px",
                textTransform: "none",
                fontWeight: 600,
                fontSize: "0.78rem",
                px: 1.5,
                boxShadow: "none",
                "&:hover": {
                  boxShadow: "none",
                },
              }}
            >
              {isLoading ? "Starting..." : isSelected ? "Start Learning" : "Select"}
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Fade>
  );
};

export default CourseCard;
