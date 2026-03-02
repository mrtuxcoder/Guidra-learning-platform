import React from "react";
import { Card, Box, Typography, Button } from "@mui/material";
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
    <Card
      component="header"
      sx={{
        borderRadius: 3,
        boxShadow: "0 4px 24px rgba(126, 87, 194, 0.08)",
        bgcolor: "background.paper",
        border: "1px solid rgba(126, 87, 194, 0.1)",
        overflow: "visible",
        mb: 3,
      }}
    >
      <Box sx={{ p: 2.5 }}>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 3,
          }}
        >
          {/* Title Area */}
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography
              variant="subtitle1"
              fontWeight="700"
              sx={{
                color: colorPalette?.[700] || "#5d3a9f",
                mb: 0.5,
                fontSize: "1rem",
                background: `linear-gradient(135deg, ${
                  colorPalette?.[600] || "#6d48b5"
                } 0%, ${colorPalette?.[700] || "#5d3a9f"} 100%)`,
                backgroundClip: "text",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              {`${currentIndex + 1}. ${selectedSubtopic.name}`}
            </Typography>
            <Typography
              variant="body2"
              sx={{
                color: colorPalette?.[500] || "#7e57c2",
                fontWeight: 500,
              }}
            >
              {selectedTopic}
            </Typography>
          </Box>

          {/* Navigation Area */}
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

          {/* Actions Area */}
          <Box
            component="section"
            sx={{
              display: "flex",
              gap: 2,
              alignItems: "center",
            }}
          >
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
      </Box>
    </Card>
  );
};

export default DesktopHeader;
