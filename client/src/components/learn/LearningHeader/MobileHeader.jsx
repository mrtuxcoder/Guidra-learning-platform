import React, { useState, useEffect, useRef } from "react";
import { Box, IconButton, Tooltip, Typography, Chip } from "@mui/material";
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
  const [isMinimal, setIsMinimal] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);
  const scrollTimeoutRef = useRef(null);
  const headerRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      // Make minimal on scroll down
      if (currentScrollY > lastScrollY + 50) {
        setIsMinimal(true);
      } else if (currentScrollY < lastScrollY - 30) {
        setIsMinimal(false);
      }
      
      setLastScrollY(currentScrollY);
      
      // Auto-show (restore opacity) after 3 seconds of scroll stop
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
      scrollTimeoutRef.current = setTimeout(() => {
        setIsMinimal(false);
      }, 3000);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    
    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
    };
  }, [lastScrollY]);

  const handleHeaderMouseEnter = () => {
    setIsMinimal(false);
    if (scrollTimeoutRef.current) {
      clearTimeout(scrollTimeoutRef.current);
    }
  };

  const handleHeaderMouseLeave = () => {
    // Optional: uncomment to fade again after mouse leaves
    // setIsMinimal(true);
  };

  const progress = ((currentIndex + 1) / totalSubtopics) * 100;

  return (
    <Box
      ref={headerRef}
      component="footer"
      onMouseEnter={handleHeaderMouseEnter}
      onMouseLeave={handleHeaderMouseLeave}
      sx={{
        position: "fixed",
        bottom: 8,
        left: "50%",
        transform: "translateX(-50%)",
        background: "rgba(255, 255, 255, 0.98)",
        backdropFilter: "blur(40px)",
        border: "1px solid rgba(126, 87, 194, 0.15)",
        borderRadius: "16px",
        zIndex: 1000,
        height: "48px",
        display: "flex",
        alignItems: "center",
        boxShadow: `
          0 12px 32px rgba(126, 87, 194, 0.18),
          0 4px 16px rgba(0, 0, 0, 0.08),
          0 2px 8px rgba(0, 0, 0, 0.04)
        `,
        minWidth: "280px",
        maxWidth: "calc(100vw - 16px)",
        overflow: "hidden",
        opacity: isMinimal ? 0.3 : 1,
        transition: "opacity 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
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
                background: "rgba(126, 87, 194, 0.08)",
                color: colorPalette?.[600] || "#6d48b5",
                border: "1px solid rgba(126, 87, 194, 0.12)",
                padding: "6px",
                "&:hover": {
                  background: "rgba(126, 87, 194, 0.15)",
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
  );
};

export default MobileHeader;
