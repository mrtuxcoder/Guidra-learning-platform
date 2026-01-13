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

/**
 * Quick client-side validation for obvious cases
 */
function isObviouslyInvalid(topic) {
  const invalidPatterns = [
    // Too short
    topic.length < 3,
    
    // Single common words without context
    /^(cat|dog|car|book|food|water|hello|hi|test|ok|yes|no)$/i.test(topic),
    
    // Mostly special characters
    /^[^a-zA-Z0-9]+$/.test(topic),
    
    // Too broad fields
    /^(math|mathematics|science|history|biology|physics|chemistry|art|music|sports)$/i.test(topic),
    
    // Personal/gibberish
    /^(asdf|qwerty|xyz|abc|123|lol|haha|hehe)$/i.test(topic)
  ];

  return invalidPatterns.some(pattern => pattern === true);
}

module.exports = {
  normalizeInput,
  isNonsense,
  isObviouslyInvalid
};