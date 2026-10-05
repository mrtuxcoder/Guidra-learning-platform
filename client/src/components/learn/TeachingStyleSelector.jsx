import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  useTheme,
  useMediaQuery,
  alpha,
  Tooltip,
} from "@mui/material";
import {
  EmojiEvents,
  TrendingUp,
  Book,
  School,
} from "@mui/icons-material";

const TEACHING_STYLES = [
  {
    id: "default",
    label: "Standard",
    icon: <School sx={{ fontSize: 20 }} />,
    color: "#7C3AED",
  },
  {
    id: "like5",
    label: "Like I'm 5",
    icon: <EmojiEvents sx={{ fontSize: 20 }} />,
    color: "#F59E0B",
  },
  {
    id: "popular",
    label: "Popular",
    icon: <TrendingUp sx={{ fontSize: 20 }} />,
    color: "#EC4899",
  },
  {
    id: "storytelling",
    label: "Story",
    icon: <Book sx={{ fontSize: 20 }} />,
    color: "#3B82F6",
  },
  {
    id: "technical",
    label: "Technical",
    icon: <School sx={{ fontSize: 20 }} />,
    color: "#10B981",
  },
];

const CACHE_KEY = "teachingStyle_preference";

// Hook to manage teaching style cache
const useTeachingStyleCache = () => {
  const getSavedStyle = () => {
    try {
      const saved = localStorage.getItem(CACHE_KEY);
      return saved || "default";
    } catch {
      return "default";
    }
  };

  const saveStyle = (style) => {
    try {
      localStorage.setItem(CACHE_KEY, style);
    } catch {
      console.warn("Failed to save teaching style preference");
    }
  };

  return { getSavedStyle, saveStyle };
};

export default function TeachingStyleSelector({
  open,
  onClose,
  onSelect,
  isLoading = false,
}) {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const { getSavedStyle, saveStyle } = useTeachingStyleCache();
  const [selectedStyle, setSelectedStyle] = useState("default");

  // Load cached preference on mount
  useEffect(() => {
    setSelectedStyle(getSavedStyle());
  }, [getSavedStyle]);

  const handleConfirm = () => {
    saveStyle(selectedStyle); // Cache the selection
    onSelect(selectedStyle);
    onClose();
  };

  return (
    <Dialog 
      open={open} 
      onClose={onClose} 
      maxWidth={isMobile ? "xs" : "sm"} 
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: isMobile ? 2 : 3,
        },
      }}
    >
      <DialogTitle sx={{ fontWeight: 700, fontSize: isMobile ? "1rem" : "1.25rem", pb: 1.5 }}>
        Learning Style
      </DialogTitle>
      <DialogContent sx={{ pt: 1.5, pb: 1 }}>
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: isMobile ? "1fr 1fr" : "1fr 1fr 1fr",
            gap: isMobile ? 1 : 1.5,
          }}
        >
          {TEACHING_STYLES.map((style) => (
            <Tooltip key={style.id} title={style.label} arrow>
              <Box
                onClick={() => setSelectedStyle(style.id)}
                sx={{
                  cursor: "pointer",
                  padding: isMobile ? 1.5 : 2,
                  borderRadius: 2,
                  border:
                    selectedStyle === style.id
                      ? `2.5px solid ${style.color}`
                      : `1.5px solid ${
                          isDark ? "rgba(255,255,255,0.15)" : "rgba(0,0,0,0.1)"
                        }`,
                  backgroundColor:
                    selectedStyle === style.id
                      ? alpha(style.color, 0.1)
                      : isDark
                      ? "rgba(255,255,255,0.03)"
                      : "transparent",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 0.75,
                  transition: "all 0.2s ease",
                  "&:hover": {
                    borderColor: style.color,
                    backgroundColor: alpha(style.color, 0.12),
                    transform: "scale(1.05)",
                  },
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    width: isMobile ? 32 : 40,
                    height: isMobile ? 32 : 40,
                    borderRadius: "8px",
                    backgroundColor: alpha(style.color, 0.2),
                    color: style.color,
                  }}
                >
                  {style.icon}
                </Box>
                <Box
                  sx={{
                    fontSize: isMobile ? "0.7rem" : "0.75rem",
                    fontWeight: 600,
                    textAlign: "center",
                    color: "text.primary",
                    lineHeight: 1.2,
                  }}
                >
                  {style.label}
                </Box>
              </Box>
            </Tooltip>
          ))}
        </Box>
      </DialogContent>
      <DialogActions sx={{ gap: 1, p: isMobile ? 1.5 : 2 }}>
        <Button 
          onClick={onClose} 
          variant="outlined"
          size={isMobile ? "small" : "medium"}
        >
          Cancel
        </Button>
        <Button
          onClick={handleConfirm}
          variant="contained"
          disabled={isLoading}
          size={isMobile ? "small" : "medium"}
          sx={{
            background: "linear-gradient(135deg, #7C3AED 0%, #5E35B1 100%)",
          }}
        >
          {isLoading ? "..." : "Apply"}
        </Button>
      </DialogActions>
    </Dialog>
  );}