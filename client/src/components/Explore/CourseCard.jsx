import React from "react";
import {
  Card,
  CardContent,
  Typography,
  Chip,
  Box,
  Fade,
  useTheme,
} from "@mui/material";
import { alpha } from "@mui/material";
import { CATEGORY_DATA } from "./constants.jsx";
import { AutoStories } from "@mui/icons-material";

const CourseCard = ({ topic, isSelected, onSelect, index }) => {
  const theme = useTheme();
  const categoryData = CATEGORY_DATA[topic.category];

  return (
    <Fade in timeout={400 + index * 50}>
      <Card
        sx={{
          borderRadius: 2.5,
          border: "1px solid",
          borderColor: isSelected
            ? alpha(theme.palette.primary.main, 0.35)
            : "rgba(15, 23, 42, 0.08)",
          backgroundColor: "background.paper",
          boxShadow: isSelected
            ? "0 10px 24px rgba(79, 70, 229, 0.12)"
            : "0 4px 14px rgba(15, 23, 42, 0.06)",
          transition: "all 0.2s ease",
          cursor: "pointer",
          "&:hover": {
            borderColor: alpha(theme.palette.primary.main, 0.32),
            transform: "translateY(-1px)",
          },
        }}
        onClick={() => onSelect(topic.id)}
      >
        <CardContent sx={{ p: 2 }}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 1.2,
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Box
                sx={{
                  width: 34,
                  height: 34,
                  borderRadius: 1.5,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  bgcolor: alpha(categoryData.color, 0.12),
                  color: categoryData.color,
                }}
              >
                <AutoStories sx={{ fontSize: 18 }} />
              </Box>
              <Typography
                variant="subtitle1"
                fontWeight={600}
                sx={{ fontSize: "0.98rem", color: "text.primary" }}
              >
                {topic.name}
              </Typography>
            </Box>

            <Chip
              label={categoryData.name}
              size="small"
              sx={{
                backgroundColor: alpha(categoryData.color, 0.1),
                color: categoryData.color,
                fontWeight: 600,
                fontSize: "0.7rem",
                height: 22,
              }}
            />
          </Box>

          <Typography
            variant="body2"
            color="text.secondary"
            sx={{
              lineHeight: 1.45,
              fontSize: "0.84rem",
              mb: 0.3,
              minHeight: 34,
            }}
          >
            {topic.description}
          </Typography>

          {isSelected && (
            <Box
              sx={{
                position: "absolute",
                top: 10,
                right: 10,
                width: 18,
                height: 18,
                borderRadius: "50%",
                background: theme.palette.primary.main,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "white",
                fontSize: "10px",
                fontWeight: "bold",
                boxShadow: "0 2px 8px rgba(79, 70, 229, 0.25)",
              }}
            >
              ✓
            </Box>
          )}
        </CardContent>
      </Card>
    </Fade>
  );
};

export default CourseCard;
