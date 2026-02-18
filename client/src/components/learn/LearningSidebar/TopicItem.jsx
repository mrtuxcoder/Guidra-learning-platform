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
} from "@mui/material";
import { ExpandMore } from "@mui/icons-material";
import { alpha } from "@mui/material/styles";
import ProgressBar from "./ProgressBar";
import SubtopicItem from "./SubtopicItem";

const TopicItem = ({
  topic,
  index,
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
  const completedCount =
    topic.subTopics?.filter((s) => s.completed).length || 0;
  const totalCount = topic.subTopics?.length || 0;
  const progress = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;

  return (
    <Box sx={{ mb: 1.5 }}>
      {/* Topic Header */}
      <ListItem
        onClick={() => onTopicClick(topic.topic)}
        selected={isSelected}
        sx={{
          borderRadius: 1,
          py: 1.5,
          px: 2,
          backgroundColor: isSelected
            ? theme.palette.mode === "dark"
              ? alpha(colorPalette[500], 0.15)
              : alpha(colorPalette[50], 0.8)
            : "transparent",
          border: "1px solid",
          borderColor: isSelected ? colorPalette[300] : "divider",
          position: "relative",
          "&:hover": {
            backgroundColor: theme.palette.mode === "dark"
              ? alpha(colorPalette[500], 0.08)
              : alpha(colorPalette[50], 0.6),
            borderColor: "divider",
          },
          cursor: "pointer",
          transition: "all 0.2s ease",
        }}
      >
        <ListItemText
          primary={
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <Typography
                variant="body2"
                fontWeight="600"
                sx={{
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                  color: "text.primary",
                  fontSize: "0.9rem",
                }}
              >
                {topic.topic}
              </Typography>
              <IconButton
                size="small"
                onClick={(event) => onExpandClick(topic.topic, event)}
                sx={{
                  color: colorPalette[500],
                  transform: isExpanded ? "rotate(0deg)" : "rotate(-90deg)",
                  transition: "transform 0.2s ease",
                }}
              >
                <ExpandMore />
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
                color="text.secondary"
                fontWeight="500"
              >
                {completedCount}/{totalCount} completed
              </Typography>
              <Typography
                variant="caption"
                color={colorPalette[600]}
                fontWeight="600"
              >
                {Math.round(progress)}%
              </Typography>
            </Box>
          }
          secondaryTypographyProps={{ component: "div" }}
          sx={{ my: 0, width: "100%" }}
        />
      </ListItem>

      {/* Progress Bar */}
      <ProgressBar
        progress={progress}
        colorPalette={colorPalette}
        sx={{ px: 2, mt: 0.5 }}
      />

      {/* Subtopic Collapse */}
      <Collapse in={isExpanded} timeout="auto" unmountOnExit>
        <List sx={{ py: 0.5, pl: 1 }}>
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
