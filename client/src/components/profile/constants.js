// constants.js - Only plain JavaScript, no JSX

// Use icon names instead of JSX components
export const learningStyles = [
  {
    value: "visual",
    label: "Visual Learner",
    icon: "Style",
    color: "#2196f3",
    gradient: "linear-gradient(135deg, #2196f3 0%, #21cbf3 100%)",
    description:
      "You learn best through visual aids like diagrams, charts, and visual demonstrations. The AI will provide more visual content and spatial explanations.",
  },
  {
    value: "practical",
    label: "Practical Learner",
    icon: "Psychology",
    color: "#4caf50",
    gradient: "linear-gradient(135deg, #4caf50 0%, #8bc34a 100%)",
    description:
      "You prefer hands-on learning and practical applications. The AI will focus on real-world examples, exercises, and interactive tasks.",
  },
  {
    value: "theory",
    label: "Theoretical Learner",
    icon: "School",
    color: "#ff9800",
    gradient: "linear-gradient(135deg, #ff9800 0%, #ffb74d 100%)",
    description:
      "You enjoy deep theoretical understanding and conceptual frameworks. The AI will provide comprehensive explanations and theoretical background.",
  },
];

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
