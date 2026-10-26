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
import { AutoStories, ArrowForward, CheckCircle } from "@mui/icons-material";
import { tokens } from "../../theme/tokens";

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
    <Fade in timeout={300 + index * 40}>
      <Card
        elevation={0}
        onClick={() => onSelect && onSelect(topic.id)}
        sx={{
          borderRadius: tokens.radii.md,
          border: "1px solid",
          borderColor: isSelected
            ? "primary.main"
            : "divider",
          backgroundColor: isSelected
            ? isDark
              ? alpha(tokens.colors.primary.main, 0.08)
              : alpha(tokens.colors.primary.main, 0.04)
            : "background.paper",
          boxShadow: isSelected
            ? `0 0 0 2px ${alpha(tokens.colors.primary.main, 0.35)}`
            : isDark
            ? tokens.shadows.dark.card
            : tokens.shadows.light.card,
          transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
          cursor: "pointer",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          height: "100%",
          position: "relative",
          overflow: "hidden",
          "&:hover": {
            borderColor: isSelected
              ? "primary.main"
              : isDark
              ? "rgba(255, 255, 255, 0.16)"
              : "rgba(15, 23, 42, 0.18)",
            transform: "translateY(-2px)",
            boxShadow: isDark
              ? tokens.shadows.dark.hover
              : tokens.shadows.light.hover,
          },
        }}
      >
        <CardContent
          sx={{
            p: 2.25,
            display: "flex",
            flexDirection: "column",
            flexGrow: 1,
            "&:last-child": { pb: 2.25 },
          }}
        >
          {/* Category Chip & Icon */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 1.5,
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Box
                sx={{
                  width: 32,
                  height: 32,
                  borderRadius: tokens.radii.sm,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  bgcolor: alpha(categoryData.color, isDark ? 0.2 : 0.1),
                  color: categoryData.color,
                }}
              >
                <AutoStories sx={{ fontSize: 17 }} />
              </Box>
              <Chip
                label={categoryData.name}
                size="small"
                sx={{
                  backgroundColor: alpha(categoryData.color, isDark ? 0.16 : 0.08),
                  color: categoryData.color,
                  fontWeight: 600,
                  fontSize: "0.72rem",
                  height: 22,
                  border: `1px solid ${alpha(categoryData.color, 0.2)}`,
                }}
              />
            </Box>

            {topic.popularity && (
              <Typography
                variant="caption"
                sx={{
                  color: "text.secondary",
                  fontWeight: 600,
                  fontSize: "0.72rem",
                }}
              >
                {topic.popularity}% Match
              </Typography>
            )}
          </Box>

          {/* Topic Title */}
          <Typography
            variant="h6"
            sx={{
              fontWeight: 700,
              fontSize: "1.05rem",
              lineHeight: 1.35,
              color: "text.primary",
              letterSpacing: "-0.01em",
              mb: 1,
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
              fontSize: "0.85rem",
              mb: 2,
              flexGrow: 1,
            }}
          >
            {topic.description}
          </Typography>

          {/* Card Action Row */}
          <Box
            sx={{
              pt: 1.5,
              borderTop: "1px solid",
              borderColor: "divider",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Typography
              variant="caption"
              sx={{ color: "text.secondary", fontWeight: 500 }}
            >
              Curated Curriculum
            </Typography>

            <Button
              size="small"
              variant={isSelected ? "contained" : "outlined"}
              disabled={isLoading}
              onClick={(e) => {
                e.stopPropagation();
                if (onStart) onStart(topic);
                else if (onSelect) onSelect(topic.id);
              }}
              endIcon={
                isLoading ? (
                  <CircularProgress size={14} color="inherit" />
                ) : (
                  <ArrowForward sx={{ fontSize: 15 }} />
                )
              }
              sx={{
                borderRadius: tokens.radii.sm,
                textTransform: "none",
                fontWeight: 600,
                fontSize: "0.8rem",
                py: 0.5,
                px: 1.75,
                ...(isSelected
                  ? {
                      bgcolor: "primary.main",
                      color: "white",
                      "&:hover": { bgcolor: "primary.dark" },
                    }
                  : {
                      borderColor: "divider",
                      color: "text.primary",
                      "&:hover": {
                        borderColor: "primary.main",
                        bgcolor: alpha(tokens.colors.primary.main, 0.06),
                      },
                    }),
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
