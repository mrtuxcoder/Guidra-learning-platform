import React, { useState, useEffect, useRef } from "react";
import { Box, IconButton, Tooltip } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import {
  Menu,
  NavigateBefore,
  NavigateNext,
  KeyboardArrowUp,
} from "@mui/icons-material";
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
            borderRadius: "16px",
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
          <KeyboardArrowUp sx={{ fontSize: 24 }} />
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
            height: "58px",
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
            minWidth: "288px",
            maxWidth: "calc(100vw - 24px)",
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
          justifyContent: "center",
          px: 1,
          py: 0.9,
          height: "100%",
          gap: 0.8,
        }}
      >
        {/* Prev */}
        <Tooltip title="Previous lesson" placement="top">
          <IconButton
            onClick={onPrevious}
            disabled={!hasPrevious}
            sx={{
              width: 40,
              height: 40,
              borderRadius: "10px",
              color: hasPrevious
                ? colorPalette?.[600] || "#6d48b5"
                : "rgba(126, 87, 194, 0.3)",
              background: hasPrevious
                ? "rgba(126, 87, 194, 0.1)"
                : "transparent",
              border: "1px solid rgba(126, 87, 194, 0.14)",
              "&:hover": hasPrevious
                ? {
                    background: "rgba(126, 87, 194, 0.18)",
                    transform: "translateY(-1px)",
                  }
                : {},
              transition: "all 0.2s ease",
            }}
          >
            <NavigateBefore sx={{ fontSize: 18 }} />
          </IconButton>
        </Tooltip>

        {/* Sidebar */}
        <Tooltip title="Course menu" placement="top">
          <IconButton
            onClick={onOpenSidebar}
            sx={{
              width: 40,
              height: 40,
              borderRadius: "10px",
              background: isDark
                ? "rgba(148, 163, 184, 0.15)"
                : "rgba(126, 87, 194, 0.08)",
              color: colorPalette?.[600] || "#6d48b5",
              border: isDark
                ? "1px solid rgba(148, 163, 184, 0.22)"
                : "1px solid rgba(126, 87, 194, 0.12)",
              "&:hover": {
                background: isDark
                  ? "rgba(148, 163, 184, 0.25)"
                  : "rgba(126, 87, 194, 0.15)",
                transform: "translateY(-1px)",
              },
              transition: "all 0.2s ease",
            }}
          >
            <Menu sx={{ fontSize: 18 }} />
          </IconButton>
        </Tooltip>

        {/* Version */}
        {onOpenVersions && (
          <VersionButton
            contentInfo={contentInfo}
            onOpenVersions={onOpenVersions}
            colorPalette={colorPalette}
            variant="mobile"
          />
        )}

        {/* Regen */}
        <RegenerationBadge
          remainingGenerations={remainingGenerations}
          contentLoading={contentLoading}
          onRegenerateContent={onRegenerateContent}
          colorPalette={colorPalette}
          variant="mobile"
        />

        {/* Completed */}
        <CompleteButton
          selectedSubtopic={selectedSubtopic}
          updatingSubtopic={updatingSubtopic}
          onCompleteSubtopic={onCompleteSubtopic}
          colorPalette={colorPalette}
          variant="mobile"
        />

        {/* Next */}
        <Tooltip title="Next lesson" placement="top">
          <IconButton
            onClick={onNext}
            disabled={!hasNext}
            sx={{
              width: 40,
              height: 40,
              borderRadius: "10px",
              color: hasNext
                ? colorPalette?.[600] || "#6d48b5"
                : "rgba(126, 87, 194, 0.3)",
              background: hasNext ? "rgba(126, 87, 194, 0.1)" : "transparent",
              border: "1px solid rgba(126, 87, 194, 0.14)",
              "&:hover": hasNext
                ? {
                    background: "rgba(126, 87, 194, 0.18)",
                    transform: "translateY(-1px)",
                  }
                : {},
              transition: "all 0.2s ease",
            }}
          >
            <NavigateNext sx={{ fontSize: 18 }} />
          </IconButton>
        </Tooltip>
      </Box>
        </Box>
      )}
    </Box>
  );
};

export default MobileHeader;
