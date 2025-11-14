const profanity = require('leo-profanity');

const MIN_LENGTH = 3;
const MAX_LENGTH = 80;

// Normalize text (trim + lowercase + collapse spaces)
function normalizeInput(str = "") {
  return str.trim().replace(/\s+/g, " ").toLowerCase();
}

// Detect meaningless or invalid topic input
function isNonsense(str) {
  const trimmed = (str || "").trim();

  // Empty or wrong length
  if (!trimmed) return true;
  if (trimmed.length < MIN_LENGTH || trimmed.length > MAX_LENGTH) return true;

  // Only punctuation or symbols
  if (/^[\W_]+$/.test(trimmed)) return true;

  // Only numbers
  if (/^\d+$/.test(trimmed)) return true;

  // Repeated same character (aaaaa, !!!!, etc.)
  if (/^(.)\1{3,}$/.test(trimmed)) return true;

  // Contains URL pattern
  if (/(https?:\/\/|www\.)/.test(trimmed)) return true;

  // Obvious profanity
  if (profanity.check(trimmed)) return true;

  // Meme/noise words
  const nonsenseWords = [
    "skibidi", "rizz", "sigma", "gyatt", "sus", "ligma", "ohio",
    "uwu", "mewing", "fanum", "sigma grindset", "baby gronk"
  ];
  if (nonsenseWords.some(w => trimmed.includes(w))) return true;

  return false;
}

// Check if topic is supported by the learning platform
function isSupportedTopic(topic) {
  const normalized = normalizeInput(topic);
  const validDomains = [
    // 💻 Programming & Computer Science
    "python", "python programming", "python basics",
    "javascript", "js", "javascript fundamentals",
    "data structures", "algorithms", "dsa", "data structures algorithms",
    "web development", "web dev", "full stack", "fullstack",
    "ai", "artificial intelligence", "machine learning", "ml",
    "cloud computing", "cloud", "aws", "azure", "google cloud",
    "cybersecurity", "cyber security", "security", "web security",
    "blockchain", "web3", "crypto", "cryptocurrency",
    "api", "api design", "rest api", "graphql",
    
    // 🔬 Science & Technology
    "quantum computing", "quantum", "quantum physics",
    "biotechnology", "biotech", "bio technology",
    "neuroscience", "brain science", "cognitive science",
    "space technology", "space", "astronomy", "satellite",
    "climate science", "climate", "sustainability", "environment",
    "scientific method", "scientific thinking", "research methods",
    "physics", "modern physics", "quantum physics",
    "chemistry", "chemical reactions",
    
    // 💼 Finance & Business
    "personal finance", "finance", "money management", "budgeting",
    "investing", "investment", "stock market", "stocks",
    "entrepreneurship", "startup", "business", "entrepreneur",
    "digital marketing", "marketing", "online marketing",
    "economics", "economic principles", "market systems",
    "cryptocurrency", "crypto", "bitcoin", "ethereum",
    "financial literacy", "money skills", "financial planning",
    
    // 🧠 Self Development
    "critical thinking", "analytical thinking", "problem solving",
    "emotional intelligence", "eq", "self awareness", "relationships",
    "productivity", "time management", "workflow", "efficiency",
    "decision making", "choices", "strategic thinking",
    "mindfulness", "meditation", "stress management", "mental focus",
    "learning how to learn", "meta learning", "skill acquisition",
    "growth mindset", "resilience", "adaptability", "mindset",
    "communication skills", "public speaking", "listening",
    "leadership", "team management", "influence", "leadership skills",
    "future careers", "job market", "career planning", "emerging jobs",
    
    // 🌐 Future Skills
    "data literacy", "data analysis", "data interpretation",
    "ux design", "user experience", "ui ux", "user interface",
    "project management", "agile", "scrum", "project planning",
    "ethical technology", "ai ethics", "responsible innovation", "tech ethics",
    "systems thinking", "complex systems", "interconnected systems",
    
    // 🌐 Web Development Fundamentals (Original)
    "html", "css", "javascript", "js", 
    "responsive", "responsive design", 
    "git", "github", "version control",
    
    // Frontend Development
    "react", "reactjs", 
    "dom", "dom manipulation",
    "flexbox", "css flexbox",
    "grid", "css grid",
    "es6", "modern javascript",
    
    // Backend & Tools
    "node", "nodejs", "node.js",
    "express", "expressjs", "express.js",
    "rest", "rest api", "api",
    "mongodb", "mongo", "database",
    "sql", "mysql", "postgresql",
    
    // Essential Skills
    "command line", "terminal", "cli", "command",
    "npm", "package manager", "packages",
    "debugging", "debug", "fix errors",
    "security", "web security",
    "deployment", "deploy", "hosting"
  ];
  
  // Flexible matching - check if topic contains valid domain keywords
  return validDomains.some(domain => {
    // Check if topic contains the domain keyword
    if (normalized.includes(domain)) return true;
    
    // Check if domain contains main words from topic
    const topicWords = normalized.split(' ');
    return topicWords.some(word => domain.includes(word) && word.length > 2);
  });
}

module.exports = {
  normalizeInput,
  isNonsense,
  isSupportedTopic
};