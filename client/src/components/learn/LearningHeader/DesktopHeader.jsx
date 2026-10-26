import React from "react";
import { Paper, Box, Typography } from "@mui/material";
import StatusChips from "./StatusChips";
import NavigationControls from "./NavigationControls";
import RegenerationBadge from "./RegenerationBadge";
import CompleteButton from "./CompleteButton";
import VersionButton from "./VersionButton";

const DesktopHeader = ({
  selectedTopic,
  selectedSubtopic,
  currentIndex,
  totalSubtopics,
  hasPrevious,
  hasNext,
  onPrevious,
  onNext,
  contentInfo,
  remainingGenerations,
  contentLoading,
  onRegenerateContent,
  updatingSubtopic,
  onCompleteSubtopic,
  onOpenVersions,
  colorPalette,
}) => {
  return (
    <Paper
      component="header"
      elevation={0}
      sx={{
        borderRadius: 0,
        bgcolor: "background.paper",
        borderBottom: "1px solid",
        borderColor: "divider",
        px: { xs: 2, md: 3 },
        py: 1.25,
        mb: 0,
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 2,
        }}
      >
        {/* Breadcrumb Path & Lesson Title */}
        <Box sx={{ flex: 1, minWidth: 0, mr: 2 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 0.75, mb: 0.25 }}>
            <Typography
              variant="caption"
              sx={{
                color: "text.secondary",
                fontWeight: 600,
                textTransform: "uppercase",
                letterSpacing: "0.06em",
                fontSize: "0.72rem",
              }}
            >
              {selectedTopic}
            </Typography>
            <Typography variant="caption" sx={{ color: "text.secondary", opacity: 0.4 }}>
              •
            </Typography>
            <Typography
              variant="caption"
              sx={{
                color: "text.secondary",
                fontWeight: 600,
                fontSize: "0.72rem",
              }}
            >
              {`Lesson ${currentIndex + 1} of ${totalSubtopics}`}
            </Typography>
          </Box>
          <Typography
            variant="h6"
            sx={{
              fontWeight: 700,
              fontSize: "1.05rem",
              color: "text.primary",
              letterSpacing: "-0.01em",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {selectedSubtopic.name}
          </Typography>
        </Box>

        {/* Actions Cluster */}
        <Box
          component="section"
          sx={{
            display: "flex",
            gap: 1.25,
            alignItems: "center",
            flexShrink: 0,
          }}
        >
          {/* Navigation Stepper */}
          <NavigationControls
            currentIndex={currentIndex}
            totalSubtopics={totalSubtopics}
            hasPrevious={hasPrevious}
            hasNext={hasNext}
            onPrevious={onPrevious}
            onNext={onNext}
            colorPalette={colorPalette}
            variant="desktop"
          />

          <Box sx={{ width: "1px", height: 20, bgcolor: "divider", mx: 0.25 }} />

          {/* Status chips */}
          <StatusChips
            selectedSubtopic={selectedSubtopic}
            contentInfo={contentInfo}
            colorPalette={colorPalette}
          />

          {/* Version button */}
          {onOpenVersions && (
            <VersionButton
              contentInfo={contentInfo}
              onOpenVersions={onOpenVersions}
              colorPalette={colorPalette}
              variant="desktop"
            />
          )}

          {/* Regenerate button */}
          <RegenerationBadge
            remainingGenerations={remainingGenerations}
            contentLoading={contentLoading}
            onRegenerateContent={onRegenerateContent}
            colorPalette={colorPalette}
            variant="desktop"
          />

          {/* Complete button */}
          {!selectedSubtopic.completed && (
            <CompleteButton
              selectedSubtopic={selectedSubtopic}
              updatingSubtopic={updatingSubtopic}
              onCompleteSubtopic={onCompleteSubtopic}
              colorPalette={colorPalette}
              variant="desktop"
            />
          )}
        </Box>
      </Box>
    </Paper>
  );
};

export default DesktopHeader;
