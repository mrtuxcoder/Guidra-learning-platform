import {
  School,
  Code,
  Science,
  TrendingUp,
  Psychology,
  Rocket,
} from "@mui/icons-material";

// Consistent purple color palette with profile page
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

// Category icons and colors - consistent with profile theme
export const CATEGORY_DATA = {
  programming: { icon: <Code />, color: "#7C3AED", name: "Programming" },
  science: { icon: <Science />, color: "#9333EA", name: "Science" },
  finance: { icon: <TrendingUp />, color: "#A855F7", name: "Finance" },
  "self-dev": {
    icon: <Psychology />,
    color: "#6B21A8",
    name: "Self Development",
  },
  "future-skills": {
    icon: <Rocket />,
    color: "#581C87",
    name: "Future Skills",
  },
};

// Optimized topics data
export const PREDEFINED_TOPICS = [
  // Programming
  {
    id: "python-basics",
    name: "Python Programming",
    description: "Fundamental programming concepts and syntax",
    category: "programming",
    popularity: 95,
  },
  {
    id: "javascript-fundamentals",
    name: "JavaScript Fundamentals",
    description: "Core concepts of web programming language",
    category: "programming",
    popularity: 88,
  },
  {
    id: "data-structures-algorithms",
    name: "Data Structures & Algorithms",
    description: "Essential computer science foundations",
    category: "programming",
    popularity: 92,
  },
  {
    id: "web-development",
    name: "Modern Web Development",
    description: "Full-stack development principles",
    category: "programming",
    popularity: 85,
  },
  {
    id: "mobile-app-dev",
    name: "Mobile App Development",
    description: "iOS and Android app development",
    category: "programming",
    popularity: 79,
  },
  {
    id: "ai-ml-basics",
    name: "AI & Machine Learning",
    description: "Introduction to artificial intelligence",
    category: "programming",
    popularity: 96,
  },
  {
    id: "cloud-computing",
    name: "Cloud Computing",
    description: "Understanding cloud services and architecture",
    category: "programming",
    popularity: 78,
  },
  {
    id: "cybersecurity-essentials",
    name: "Cybersecurity",
    description: "Digital security principles and practices",
    category: "programming",
    popularity: 82,
  },
  {
    id: "blockchain-web3",
    name: "Blockchain & Web3",
    description: "Decentralized technology fundamentals",
    category: "programming",
    popularity: 75,
  },
  {
    id: "api-design",
    name: "API Design",
    description: "Building and consuming web APIs",
    category: "programming",
    popularity: 80,
  },

  // Science
  {
    id: "quantum-computing",
    name: "Quantum Computing",
    description: "Principles of quantum information science",
    category: "science",
    popularity: 65,
  },
  {
    id: "biotechnology",
    name: "Biotechnology",
    description: "Biological technology applications",
    category: "science",
    popularity: 70,
  },
  {
    id: "neuroscience-basics",
    name: "Neuroscience",
    description: "Understanding brain and cognition",
    category: "science",
    popularity: 72,
  },
  {
    id: "space-technology",
    name: "Space Technology",
    description: "Space exploration and satellite systems",
    category: "science",
    popularity: 68,
  },
  {
    id: "climate-science",
    name: "Climate Science",
    description: "Climate systems and sustainability",
    category: "science",
    popularity: 85,
  },
  {
    id: "scientific-method",
    name: "Scientific Thinking",
    description: "Critical analysis and research methods",
    category: "science",
    popularity: 78,
  },
  {
    id: "physics-concepts",
    name: "Modern Physics",
    description: "Key concepts in contemporary physics",
    category: "science",
    popularity: 71,
  },
  {
    id: "chemistry-foundations",
    name: "Chemistry Foundations",
    description: "Fundamental chemical principles",
    category: "science",
    popularity: 69,
  },

  // Finance
  {
    id: "personal-finance",
    name: "Personal Finance",
    description: "Budgeting, saving, and financial planning",
    category: "finance",
    popularity: 90,
  },
  {
    id: "investing-basics",
    name: "Investment Principles",
    description: "Stock market and investment strategies",
    category: "finance",
    popularity: 82,
  },
  {
    id: "entrepreneurship",
    name: "Entrepreneurship",
    description: "Starting and scaling businesses",
    category: "finance",
    popularity: 88,
  },
  {
    id: "digital-marketing",
    name: "Digital Marketing",
    description: "Online marketing strategies and analytics",
    category: "finance",
    popularity: 79,
  },
  {
    id: "economics-principles",
    name: "Economics",
    description: "Market systems and economic theory",
    category: "finance",
    popularity: 75,
  },
  {
    id: "cryptocurrency",
    name: "Cryptocurrency",
    description: "Digital currencies and blockchain economics",
    category: "finance",
    popularity: 81,
  },
  {
    id: "financial-literacy",
    name: "Financial Literacy",
    description: "Essential money management skills",
    category: "finance",
    popularity: 92,
  },

  // Self Development
  {
    id: "critical-thinking",
    name: "Critical Thinking",
    description: "Analytical reasoning and problem solving",
    category: "self-dev",
    popularity: 87,
  },
  {
    id: "emotional-intelligence",
    name: "Emotional Intelligence",
    description: "Self-awareness and relationship management",
    category: "self-dev",
    popularity: 89,
  },
  {
    id: "productivity-systems",
    name: "Productivity Systems",
    description: "Time management and workflow optimization",
    category: "self-dev",
    popularity: 84,
  },
  {
    id: "decision-making",
    name: "Decision Making",
    description: "Strategic thinking and choice architecture",
    category: "self-dev",
    popularity: 80,
  },
  {
    id: "mindfulness-meditation",
    name: "Mindfulness",
    description: "Mental focus and stress management",
    category: "self-dev",
    popularity: 86,
  },
  {
    id: "learning-how-to-learn",
    name: "Learning How to Learn",
    description: "Meta-learning and skill acquisition",
    category: "self-dev",
    popularity: 91,
  },
  {
    id: "growth-mindset",
    name: "Growth Mindset",
    description: "Developing resilience and adaptability",
    category: "self-dev",
    popularity: 88,
  },
  {
    id: "communication-skills",
    name: "Communication Skills",
    description: "Effective speaking and listening techniques",
    category: "self-dev",
    popularity: 85,
  },
  {
    id: "leadership-basics",
    name: "Leadership Fundamentals",
    description: "Team management and influence skills",
    category: "self-dev",
    popularity: 83,
  },
  {
    id: "future-careers",
    name: "Future Careers",
    description: "Emerging job markets and skills",
    category: "self-dev",
    popularity: 79,
  },

  // Future Skills
  {
    id: "data-literacy",
    name: "Data Literacy",
    description: "Understanding and interpreting data",
    category: "future-skills",
    popularity: 86,
  },
  {
    id: "ux-design-principles",
    name: "UX Design",
    description: "User experience design fundamentals",
    category: "future-skills",
    popularity: 82,
  },
  {
    id: "project-management",
    name: "Project Management",
    description: "Agile and traditional project methodologies",
    category: "future-skills",
    popularity: 84,
  },
  {
    id: "ethical-technology",
    name: "Ethical Technology",
    description: "AI ethics and responsible innovation",
    category: "future-skills",
    popularity: 77,
  },
  {
    id: "systems-thinking",
    name: "Systems Thinking",
    description: "Understanding complex interconnected systems",
    category: "future-skills",
    popularity: 80,
  },
];

export const CATEGORIES = [
  {
    id: "all",
    name: "All Courses",
    icon: <School />,
    count: PREDEFINED_TOPICS.length,
  },
  {
    id: "programming",
    name: "Programming",
    icon: <Code />,
    count: PREDEFINED_TOPICS.filter((t) => t.category === "programming").length,
  },
  {
    id: "science",
    name: "Science",
    icon: <Science />,
    count: PREDEFINED_TOPICS.filter((t) => t.category === "science").length,
  },
  {
    id: "finance",
    name: "Finance",
    icon: <TrendingUp />,
    count: PREDEFINED_TOPICS.filter((t) => t.category === "finance").length,
  },
  {
    id: "self-dev",
    name: "Self Development",
    icon: <Psychology />,
    count: PREDEFINED_TOPICS.filter((t) => t.category === "self-dev").length,
  },
  {
    id: "future-skills",
    name: "Future Skills",
    icon: <Rocket />,
    count: PREDEFINED_TOPICS.filter((t) => t.category === "future-skills")
      .length,
  },
];
