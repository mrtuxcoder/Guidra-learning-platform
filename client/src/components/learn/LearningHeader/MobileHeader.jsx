import React, { useState, useEffect, useRef } from "react";
import { Box, IconButton, Tooltip, Typography, Chip } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import {
  Menu,
  Lock,
  CheckCircle,
  Refresh,
  NavigateBefore,
  NavigateNext,
  Layers,
} from "@mui/icons-material";
import NavigationControls from "./NavigationControls";
import RegenerationBadge from "./RegenerationBadge";
import CompleteButton from "./CompleteButton";
import VersionButton from "./VersionButton";

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
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  const [isCollapsed, setIsCollapsed] = useState(false);
  const idleTimeoutRef = useRef(null);
  const headerRef = useRef(null);

  useEffect(() => {
    const resetIdleTimer = () => {
      if (idleTimeoutRef.current) {
        clearTimeout(idleTimeoutRef.current);
      }

      idleTimeoutRef.current = setTimeout(() => {
        setIsCollapsed(true);
      }, 10000);
    };

    const handleActivity = () => {
      if (isCollapsed) {
        return;
      }
      resetIdleTimer();
    };

    resetIdleTimer();
    window.addEventListener("scroll", handleActivity, { passive: true });
    window.addEventListener("mousemove", handleActivity, { passive: true });
    window.addEventListener("touchstart", handleActivity, { passive: true });
    window.addEventListener("keydown", handleActivity);

    return () => {
      window.removeEventListener("scroll", handleActivity);
      window.removeEventListener("mousemove", handleActivity);
      window.removeEventListener("touchstart", handleActivity);
      window.removeEventListener("keydown", handleActivity);
      if (idleTimeoutRef.current) {
        clearTimeout(idleTimeoutRef.current);
      }
    };
  }, [isCollapsed]);

  const progress = ((currentIndex + 1) / totalSubtopics) * 100;

  return (
    <Box
      ref={headerRef}
      component="footer"
      sx={{
        position: "fixed",
        bottom: 8,
        left: "50%",
        transform: "translateX(-50%)",
        zIndex: 1000,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {isCollapsed ? (
        <IconButton
          onClick={() => setIsCollapsed(false)}
          sx={{
            width: 56,
            height: 56,
            borderRadius: "50%",
            background: isDark
              ? "rgba(15, 15, 23, 0.96)"
              : "rgba(255, 255, 255, 0.98)",
            backdropFilter: "blur(40px)",
            border: isDark
              ? "1px solid rgba(148, 163, 184, 0.18)"
              : "1px solid rgba(126, 87, 194, 0.15)",
            boxShadow: isDark
              ? `
              0 12px 32px rgba(0, 0, 0, 0.45),
              0 4px 16px rgba(0, 0, 0, 0.32),
              0 2px 8px rgba(0, 0, 0, 0.2)
            `
              : `
              0 12px 32px rgba(126, 87, 194, 0.18),
              0 4px 16px rgba(0, 0, 0, 0.08),
              0 2px 8px rgba(0, 0, 0, 0.04)
            `,
            color: colorPalette?.[600] || "#6d48b5",
          }}
        >
          <Menu sx={{ fontSize: 20 }} />
        </IconButton>
      ) : (
        <Box
          sx={{
            background: isDark
              ? "rgba(15, 15, 23, 0.96)"
              : "rgba(255, 255, 255, 0.98)",
            backdropFilter: "blur(40px)",
            border: isDark
              ? "1px solid rgba(148, 163, 184, 0.18)"
              : "1px solid rgba(126, 87, 194, 0.15)",
            borderRadius: "16px",
            height: "48px",
            display: "flex",
            alignItems: "center",
            boxShadow: isDark
              ? `
              0 12px 32px rgba(0, 0, 0, 0.45),
              0 4px 16px rgba(0, 0, 0, 0.32),
              0 2px 8px rgba(0, 0, 0, 0.2)
            `
              : `
              0 12px 32px rgba(126, 87, 194, 0.18),
              0 4px 16px rgba(0, 0, 0, 0.08),
              0 2px 8px rgba(0, 0, 0, 0.04)
            `,
            minWidth: "280px",
            maxWidth: "calc(100vw - 16px)",
            overflow: "hidden",
          }}
        >
      {/* Floating Progress Indicator */}
      <Box
        component="span"
        sx={{
          position: "absolute",
          top: -3,
          left: "50%",
          transform: "translateX(-50%)",
          background: `linear-gradient(90deg, ${
            colorPalette?.[500] || "#7e57c2"
          } 0%, ${colorPalette?.[600] || "#6d48b5"} 100%)`,
          height: "2px",
          width: `${progress}%`,
          maxWidth: "calc(100% - 20px)",
          borderRadius: "1px",
          boxShadow: "0 1px 4px rgba(126, 87, 194, 0.3)",
          transition: "width 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
        }}
      />

      {/* Main Footer Content */}
      <Box
        sx={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          px: 1.5,
          py: 0.5,
          height: "100%",
          gap: 0.5,
        }}
      >
        {/* Left Section - Navigation */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 0.5,
          }}
        >
          {/* Menu Button */}
          <Tooltip title="Course Menu" placement="top">
            <IconButton
              onClick={onOpenSidebar}
              sx={{
                width: 32,
                height: 32,
                borderRadius: "8px",
                background: isDark
                  ? "rgba(148, 163, 184, 0.15)"
                  : "rgba(126, 87, 194, 0.08)",
                color: colorPalette?.[600] || "#6d48b5",
                border: isDark
                  ? "1px solid rgba(148, 163, 184, 0.22)"
                  : "1px solid rgba(126, 87, 194, 0.12)",
                padding: "6px",
                "&:hover": {
                  background: isDark
                    ? "rgba(148, 163, 184, 0.25)"
                    : "rgba(126, 87, 194, 0.15)",
                  transform: "translateY(-1px)",
                },
                transition: "all 0.2s ease",
              }}
            >
              <Menu sx={{ fontSize: 16 }} />
            </IconButton>
          </Tooltip>

          {/* Navigation Controls */}
          <NavigationControls
            currentIndex={currentIndex}
            totalSubtopics={totalSubtopics}
            hasPrevious={hasPrevious}
            hasNext={hasNext}
            onPrevious={onPrevious}
            onNext={onNext}
            colorPalette={colorPalette}
            variant="mobile"
          />
        </Box>

        {/* Right Section - Actions */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 0.5,
          }}
        >
          {/* Version Button */}
          {onOpenVersions && (
            <VersionButton
              contentInfo={contentInfo}
              onOpenVersions={onOpenVersions}
              colorPalette={colorPalette}
              variant="mobile"
            />
          )}

          {/* Regeneration System */}
          <RegenerationBadge
            remainingGenerations={remainingGenerations}
            contentLoading={contentLoading}
            onRegenerateContent={onRegenerateContent}
            colorPalette={colorPalette}
            variant="mobile"
          />

          {/* Complete Button */}
          <CompleteButton
            selectedSubtopic={selectedSubtopic}
            updatingSubtopic={updatingSubtopic}
            onCompleteSubtopic={onCompleteSubtopic}
            colorPalette={colorPalette}
            variant="mobile"
          />
        </Box>
      </Box>
        </Box>
      )}
    </Box>
  );
};

export default MobileHeader;
