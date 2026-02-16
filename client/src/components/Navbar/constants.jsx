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
  Person,
  Settings,
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

// Navigation items
export const navItems = [
  { path: "/learn", label: "Learn", icon: <School sx={{ fontSize: 20 }} /> },
  {
    path: "/explore",
    label: "Explore",
    icon: <Explore sx={{ fontSize: 20 }} />,
  },
  {
    path: "/custom-topic",
    label: "Custom Topic",
    icon: <Search sx={{ fontSize: 20 }} />,
    beta: true,
  },
  {
    path: "/profile",
    label: "Profile",
    icon: <Person sx={{ fontSize: 20 }} />,
  },
  {
    path: "/settings",
    label: "Settings",
    icon: <Settings sx={{ fontSize: 20 }} />,
  },
];

// Purple theme colors
export const purpleTheme = {
  primary: "#7E57C2",
  primaryLight: "#B39DDB",
  primaryDark: "#5E35B1",
  lightBg: "#F3E5F5",
  subtleBg: "#FAF7FE",
};

// Get theme gradient based on random icon
export const getThemeGradient = (icon) => {
  if (icon) {
    return `linear-gradient(135deg, ${icon.color} 0%, #5E35B1 100%)`;
  }
  return "linear-gradient(135deg, #7E57C2 0%, #5E35B1 100%)";
};
