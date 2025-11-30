// In your buildPrompt.js or prompts.js file
exports.buildTopicValidatorPrompt = (topic) => {
  return `
ACT AS A LEARNING SCOPE VALIDATOR. Analyze if the input describes a well-scoped learning topic that can be reasonably covered in 10-15 subtopics.

CRITERIA FOR "YES":
- Specific, medium-scope topics
- Can be broken into 10-15 logical subtopics
- Examples: "Python for Data Analysis", "Introduction to Microeconomics", "Basic Spanish Conversation", "Web Development Fundamentals"

CRITERIA FOR "NO":
- Single words without context ("cat", "javascript", "mathematics")
- Personal chats/gossip/nonsense

RESPOND WITH ONLY: YES or NO

Input: "${topic}"
Answer:`;
};