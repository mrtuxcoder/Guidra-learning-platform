import React from "react";
import { Box, IconButton, Tooltip, Typography, Paper } from "@mui/material";
import { MenuBook, NavigateBefore, NavigateNext } from "@mui/icons-material";
import RegenerationBadge from "./RegenerationBadge";
import CompleteButton from "./CompleteButton";
import VersionButton from "./VersionButton";
import StatusChips from "./StatusChips";

const MobileHeader = ({
  selectedSubtopic,
  currentIndex,
  totalSubtopics,
  hasPrevious,
  hasNext,
  onPrevious,
  onNext,
  onOpenSidebar,
  remainingGenerations,
  contentLoading,
  onRegenerateContent,
  updatingSubtopic,
  onCompleteSubtopic,
  contentInfo,
  onOpenVersions,
  colorPalette,
}) => {
  return (
    <Paper
      elevation={0}
      component="header"
      sx={{
        position: "sticky",
        top: 0,
        zIndex: 10,
        bgcolor: "background.paper",
        borderBottom: "1px solid",
        borderColor: "divider",
        px: 1.5,
        py: 1,
        mb: 2,
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 1,
        }}
      >
        {/* Left: Open Curriculum Drawer */}
        <Tooltip title="View Curriculum Outline">
          <IconButton
            onClick={onOpenSidebar}
            size="small"
            sx={{
              width: 36,
              height: 36,
              borderRadius: "8px",
              border: "1px solid",
              borderColor: "divider",
              color: "text.primary",
            }}
          >
            <MenuBook sx={{ fontSize: 18 }} />
          </IconButton>
        </Tooltip>

        {/* Center: Stepper */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 0.5,
            bgcolor: "background.default",
            px: 1,
            py: 0.5,
            borderRadius: "6px",
            border: "1px solid",
            borderColor: "divider",
          }}
        >
          <IconButton
            onClick={onPrevious}
            disabled={!hasPrevious}
            size="small"
            sx={{ p: 0.25, color: "text.primary", "&.Mui-disabled": { opacity: 0.3 } }}
          >
            <NavigateBefore sx={{ fontSize: 18 }} />
          </IconButton>

          <Typography
            variant="caption"
            sx={{
              fontWeight: 700,
              color: "text.primary",
              fontSize: "0.75rem",
              minWidth: 44,
              textAlign: "center",
            }}
          >
            {`${currentIndex + 1} / ${totalSubtopics}`}
          </Typography>

          <IconButton
            onClick={onNext}
            disabled={!hasNext}
            size="small"
            sx={{ p: 0.25, color: "text.primary", "&.Mui-disabled": { opacity: 0.3 } }}
          >
            <NavigateNext sx={{ fontSize: 18 }} />
          </IconButton>
        </Box>

        {/* Right: Actions */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 0.75 }}>
          {onOpenVersions && (
            <VersionButton
              contentInfo={contentInfo}
              onOpenVersions={onOpenVersions}
              colorPalette={colorPalette}
              variant="mobile"
            />
          )}

          <RegenerationBadge
            remainingGenerations={remainingGenerations}
            contentLoading={contentLoading}
            onRegenerateContent={onRegenerateContent}
            colorPalette={colorPalette}
            variant="mobile"
          />

          {!selectedSubtopic.completed && (
            <CompleteButton
              selectedSubtopic={selectedSubtopic}
              updatingSubtopic={updatingSubtopic}
              onCompleteSubtopic={onCompleteSubtopic}
              colorPalette={colorPalette}
              variant="mobile"
            />
          )}
        </Box>
      </Box>
    </Paper>
  );
};

export default MobileHeader;