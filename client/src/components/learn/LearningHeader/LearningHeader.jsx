import React from "react";
import { useTheme, useMediaQuery } from "@mui/material";
import MobileHeader from "./MobileHeader";
import DesktopHeader from "./DesktopHeader";

const LearningHeader = ({
  selectedTopic,
  selectedSubtopic,
  subtopics = [],
  updatingSubtopic,
  contentInfo,
  remainingGenerations,
  contentLoading,
  onRegenerateContent,
  onCompleteSubtopic,
  onNavigateSubtopic,
  onOpenSidebar,
  onOpenVersions,
  colorPalette,
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  // Early return with proper null handling
  if (!selectedSubtopic) {
    return null;
  }

  // Use ORIGINAL subtopics for navigation (consistent order)
  const currentIndex = subtopics.findIndex(
    (sub) => sub.name === selectedSubtopic.name
  );
  const hasPrevious = currentIndex > 0;
  const hasNext = currentIndex < subtopics.length - 1 && currentIndex >= 0;
  const previousSubtopic = hasPrevious ? subtopics[currentIndex - 1] : null;
  const nextSubtopic = hasNext ? subtopics[currentIndex + 1] : null;

  const handlePrevious = () => {
    if (hasPrevious && previousSubtopic) {
      onNavigateSubtopic?.(previousSubtopic);
    }
  };

  const handleNext = () => {
    if (hasNext && nextSubtopic) {
      onNavigateSubtopic?.(nextSubtopic);
    }
  };

  if (isMobile) {
    return (
      <MobileHeader
        selectedSubtopic={selectedSubtopic}
        currentIndex={currentIndex}
        totalSubtopics={subtopics.length}
        hasPrevious={hasPrevious}
        hasNext={hasNext}
        previousSubtopic={previousSubtopic}
        nextSubtopic={nextSubtopic}
        onPrevious={handlePrevious}
        onNext={handleNext}
        onOpenSidebar={onOpenSidebar}
        remainingGenerations={remainingGenerations}
        contentLoading={contentLoading}
        onRegenerateContent={onRegenerateContent}
        updatingSubtopic={updatingSubtopic}
        onCompleteSubtopic={onCompleteSubtopic}
        contentInfo={contentInfo}
        onOpenVersions={onOpenVersions}
        colorPalette={colorPalette}
      />
    );
  }

  return (
    <DesktopHeader
      selectedTopic={selectedTopic}
      selectedSubtopic={selectedSubtopic}
      currentIndex={currentIndex}
      totalSubtopics={subtopics.length}
      hasPrevious={hasPrevious}
      hasNext={hasNext}
      onPrevious={handlePrevious}
      onNext={handleNext}
      contentInfo={contentInfo}
      remainingGenerations={remainingGenerations}
      contentLoading={contentLoading}
      onRegenerateContent={onRegenerateContent}
      updatingSubtopic={updatingSubtopic}
      onCompleteSubtopic={onCompleteSubtopic}
      onOpenVersions={onOpenVersions}
      colorPalette={colorPalette}
    />
  );
};

export default LearningHeader;
