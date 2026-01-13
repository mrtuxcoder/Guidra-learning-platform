import {
  AutoAwesome,
  FormatListBulleted,
  Lightbulb,
  CheckCircle,
  Email,
  LockOutlined,
  Person,
  Google,
  Psychology,
  Visibility,
  VisibilityOff,
  Login as LoginIcon,
  PersonAddOutlined,
} from "@mui/icons-material";

// Consistent purple color palette
export const purplePalette = {
  50: "#FAF7FE",
  100: "#F3E8FF",
  200: "#E9D5FF",
  300: "#D8B4FE",
  400: "#C084FC",
  500: "#A855F7",
  600: "#9333EA",
  700: "#7C3AED",
  800: "#6B21A8",
  900: "#581C87",
};

// Login page features
export const loginFeatures = [
  {
    icon: <AutoAwesome fontSize="small" />,
    label: "Progress Tracking",
    desc: "Save your learning and continue where you left off.",
  },
  {
    icon: <FormatListBulleted fontSize="small" />,
    label: "Structured Lessons",
    desc: "Clear, predictable mini-lessons for every topic.",
  },
  {
    icon: <CheckCircle fontSize="small" />,
    label: "Smart Regeneration",
    desc: "Controlled retries. No randomness, no overload.",
  },
  {
    icon: <Lightbulb fontSize="small" />,
    label: "AI-Generated Basics",
    desc: "Get beginner-friendly explanations and quizzes.",
  },
];

// Register page features
export const registerFeatures = [
  {
    icon: <AutoAwesome fontSize="small" />,
    label: "Start With the Basics",
    desc: "Learn fundamentals across 30+ subjects.",
  },
  {
    icon: <FormatListBulleted fontSize="small" />,
    label: "Consistent Lesson Format",
    desc: "Concept → Explanation → Example → Practice → Quiz.",
  },
  {
    icon: <CheckCircle fontSize="small" />,
    label: "Your Learning Workspace",
    desc: "Track your topics, retries, and understanding levels.",
  },
  {
    icon: <Lightbulb fontSize="small" />,
    label: "AI-Generated Content",
    desc: "Reliable, cached outputs with zero hallucination drift.",
  },
];

// Form field configurations
export const FORM_TYPES = {
  LOGIN: {
    title: "Welcome Back",
    subtitle: "Please enter your details to sign in.",
    submitText: "Sign In",
    features: loginFeatures,
    greetingText: "Access your saved courses, cached lessons, and progress.",
    greetingTextFull:
      "Access your saved courses, cached lessons, and progress.",
    linkText: "Don't have an account?",
    linkAction: "Sign Up",
    linkTo: "/register",
  },
  REGISTER: {
    title: "Create Account",
    subtitle: "Join Guidra and start your journey.",
    submitText: "Create Account",
    features: registerFeatures,
    greetingText: "Create your free account to start learning today.",
    greetingTextFull:
      "Start learning with clean, structured AI lessons tailored for beginners.",
    linkText: "Already have an account?",
    linkAction: "Sign In",
    linkTo: "/login",
  },
};

// Field types for forms
export const FIELD_TYPES = {
  TEXT: "text",
  EMAIL: "email",
  PASSWORD: "password",
  CONFIRM_PASSWORD: "confirm_password",
};
