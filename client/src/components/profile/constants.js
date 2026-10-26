// constants.js - Profile constants aligned with Guidra tokens
import { tokens } from "../../theme/tokens";

// Use icon names instead of JSX components
export const learningStyles = [
  {
    value: "visual",
    label: "Visual Learner",
    icon: "Style",
    color: "#6366F1",
    gradient: "linear-gradient(135deg, #6366F1 0%, #4F46E5 100%)",
    description:
      "You learn best through visual aids like diagrams, charts, and visual demonstrations. The AI will provide more visual content and spatial explanations.",
  },
  {
    value: "practical",
    label: "Practical Learner",
    icon: "Psychology",
    color: "#10B981",
    gradient: "linear-gradient(135deg, #10B981 0%, #059669 100%)",
    description:
      "You prefer hands-on learning and practical applications. The AI will focus on real-world examples, exercises, and interactive tasks.",
  },
  {
    value: "theory",
    label: "Theoretical Learner",
    icon: "School",
    color: "#F59E0B",
    gradient: "linear-gradient(135deg, #F59E0B 0%, #D97706 100%)",
    description:
      "You enjoy deep theoretical understanding and conceptual frameworks. The AI will provide comprehensive explanations and theoretical background.",
  },
];

export const profileTheme = {
  primary: "#6366F1",
  primaryLight: "#818CF8",
  primaryDark: "#4F46E5",
  accent: "#6366F1",
  gradient: "linear-gradient(135deg, #6366F1 0%, #4F46E5 100%)",
  lightBg: "rgba(99, 102, 241, 0.08)",
  subtleBg: "rgba(99, 102, 241, 0.04)",
  border: "rgba(99, 102, 241, 0.16)",
  softShadow: "0 4px 16px rgba(15, 23, 42, 0.06)",
};

export const cardSx = {
  borderRadius: tokens.radii.md,
  border: "1px solid",
  borderColor: "divider",
  bgcolor: "background.paper",
  boxShadow: tokens.shadows.light.card,
};

export const smallCardSx = {
  p: { xs: 1.5, sm: 2 },
  borderRadius: tokens.radii.sm,
  border: "1px solid",
  borderColor: "divider",
  bgcolor: "background.default",
  width: "100%",
  maxWidth: "100%",
  boxSizing: "border-box",
  display: "flex",
  flexDirection: "column",
  justifyContent: "flex-start",
  gap: 0.75,
};

export const understandingLevels = {
  1: { label: "Beginner", color: "default", icon: "RadioButtonUnchecked" },
  2: { label: "Basic", color: "info", icon: "PlayArrow" },
  3: { label: "Intermediate", color: "warning", icon: "PlayArrow" },
  4: { label: "Advanced", color: "success", icon: "TaskAlt" },
  5: { label: "Mastered", color: "success", icon: "Star" },
};

// Export icon names for reference
export const iconNames = {
  Style: "Style",
  Psychology: "Psychology",
  School: "School",
  TrendingUp: "TrendingUp",
  Bookmark: "Bookmark",
  Person: "Person",
  Email: "Email",
  CalendarToday: "CalendarToday",
  Lightbulb: "Lightbulb",
  AutoAwesome: "AutoAwesome",
  FolderOpen: "FolderOpen",
  TaskAlt: "TaskAlt",
  RadioButtonUnchecked: "RadioButtonUnchecked",
  PlayArrow: "PlayArrow",
  Star: "Star",
};
