import {
  RocketLaunch,
  Psychology,
  AutoAwesome,
  EmojiObjects,
  TrendingUp,
  Lightbulb,
  Book,
  Star,
  PsychologyAlt,
  School as LearnIcon,
  School,
  Explore,
  Search,
  AccessTime,
  Person,
} from "@mui/icons-material";

// Array of 10 random icons with colors
export const iconSet = [
  { icon: <RocketLaunch sx={{ fontSize: 20 }} />, color: "#7E57C2" },
  { icon: <Psychology sx={{ fontSize: 20 }} />, color: "#5E35B1" },
  { icon: <AutoAwesome sx={{ fontSize: 20 }} />, color: "#3949AB" },
  { icon: <EmojiObjects sx={{ fontSize: 20 }} />, color: "#6A1B9A" },
  { icon: <TrendingUp sx={{ fontSize: 20 }} />, color: "#4527A0" },
  { icon: <Lightbulb sx={{ fontSize: 20 }} />, color: "#5C6BC0" },
  { icon: <Book sx={{ fontSize: 20 }} />, color: "#8E24AA" },
  { icon: <Star sx={{ fontSize: 20 }} />, color: "#7B1FA2" },
  { icon: <PsychologyAlt sx={{ fontSize: 20 }} />, color: "#673AB7" },
  { icon: <LearnIcon sx={{ fontSize: 20 }} />, color: "#9C27B0" },
];

// Navigation items - unified to 4 focused destinations
export const navItems = [
  { path: "/learn", label: "Learn", icon: <School sx={{ fontSize: 20 }} /> },
  {
    path: "/explore",
    label: "Explore",
    icon: <Explore sx={{ fontSize: 20 }} />,
  },
  {
    path: "/study-timer",
    label: "Timer",
    icon: <AccessTime sx={{ fontSize: 20 }} />,
  },
  {
    path: "/profile",
    label: "Profile",
    icon: <Person sx={{ fontSize: 20 }} />,
  },
];

// Primary theme colors - Restrained purple accent
export const purpleTheme = {
  primary: "#6558D9",
  primaryLight: "#8477EC",
  primaryDark: "#5245C4",
  lightBg: "rgba(101, 88, 217, 0.08)",
  subtleBg: "#F7F8FA",
};

// Get theme gradient based on random icon
export const getThemeGradient = (icon) => {
  if (icon) {
    return `linear-gradient(135deg, ${icon.color} 0%, #4338CA 100%)`;
  }
  return "linear-gradient(135deg, #6366F1 0%, #4338CA 100%)";
};
