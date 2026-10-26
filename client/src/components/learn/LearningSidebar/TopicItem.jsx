import React from "react";
import {
  Box,
  ListItem,
  ListItemText,
  Typography,
  IconButton,
  Collapse,
  List,
  useTheme,
  alpha,
} from "@mui/material";
import { ExpandMore } from "@mui/icons-material";
import ProgressBar from "./ProgressBar";
import SubtopicItem from "./SubtopicItem";

const TopicItem = ({
  topic,
  isSelected,
  isExpanded,
  onTopicClick,
  onExpandClick,
  onSubtopicClick,
  selectedSubtopic,
  updatingSubtopic,
  contentCache,
  colorPalette,
}) => {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  const completedCount =
    topic.subTopics?.filter((s) => s.completed).length || 0;
  const totalCount = topic.subTopics?.length || 0;
  const progress = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;
  const isAllCompleted = totalCount > 0 && completedCount === totalCount;

  return (
    <Box sx={{ mb: 1.5 }}>
      {/* Topic Header Card */}
      <Box
        sx={{
          borderRadius: "8px",
          bgcolor: isSelected
            ? isDark
              ? alpha(theme.palette.primary.main, 0.12)
              : alpha(theme.palette.primary.main, 0.05)
            : "background.paper",
          border: "1px solid",
          borderColor: isSelected
            ? isDark
              ? alpha(theme.palette.primary.main, 0.35)
              : alpha(theme.palette.primary.main, 0.25)
            : "divider",
          overflow: "hidden",
          transition: "all 0.15s ease",
        }}
      >
        <ListItem
          onClick={() => onTopicClick(topic.topic)}
          sx={{
            py: 1.25,
            px: 1.5,
            cursor: "pointer",
            "&:hover": {
              bgcolor: "action.hover",
            },
          }}
        >
          <ListItemText
            primary={
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: 1,
                }}
              >
                <Typography
                  variant="subtitle2"
                  title={topic.topic}
                  sx={{
                    fontWeight: 700,
                    fontSize: "0.88rem",
                    color: isSelected ? "primary.main" : "text.primary",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  {topic.topic}
                </Typography>
                <IconButton
                  size="small"
                  onClick={(event) => onExpandClick(topic.topic, event)}
                  sx={{
                    p: 0.5,
                    color: "text.secondary",
                    transform: isExpanded ? "rotate(0deg)" : "rotate(-90deg)",
                    transition: "transform 0.2s ease",
                  }}
                >
                  <ExpandMore sx={{ fontSize: 18 }} />
                </IconButton>
              </Box>
            }
            secondary={
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  mt: 0.5,
                }}
              >
                <Typography
                  variant="caption"
                  sx={{
                    color: "text.secondary",
                    fontWeight: 500,
                    fontSize: "0.75rem",
                  }}
                >
                  {`${completedCount}/${totalCount} completed`}
                </Typography>
                <Typography
                  variant="caption"
                  sx={{
                    color: isAllCompleted ? "success.main" : "primary.main",
                    fontWeight: 700,
                    fontSize: "0.75rem",
                  }}
                >
                  {`${Math.round(progress)}%`}
                </Typography>
              </Box>
            }
            secondaryTypographyProps={{ component: "div" }}
            sx={{ my: 0, width: "100%" }}
          />
        </ListItem>

        {/* Progress Bar */}
        <ProgressBar progress={progress} sx={{ pb: 1 }} />
      </Box>

      {/* Subtopic Collapse */}
      <Collapse in={isExpanded} timeout="auto" unmountOnExit>
        <List sx={{ py: 0.5, pl: 0.5 }}>
          {topic.subTopics?.map((subtopic, subIndex) => (
            <SubtopicItem
              key={subIndex}
              subtopic={subtopic}
              index={subIndex}
              topicName={topic.topic}
              isSelected={selectedSubtopic?.name === subtopic.name}
              isUpdating={updatingSubtopic === subtopic.name}
              hasContent={
                contentCache[`${topic.topic}-${subtopic.name}`] ||
                contentCache[subtopic.name]
              }
              onSubtopicClick={() => onSubtopicClick(subtopic, topic.topic)}
              colorPalette={colorPalette}
            />
          ))}
        </List>
      </Collapse>
    </Box>
  );
};

export default TopicItem;