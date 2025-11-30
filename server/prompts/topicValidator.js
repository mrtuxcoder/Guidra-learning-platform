exports.buildTopicValidatorPrompt = (topic) => {
  return `
ACT AS A LEARNING TOPIC VALIDATOR.

Goal: Decide if the input is a valid educational topic that can be taught as a structured 10–15 subtopic lesson.

VALID TOPICS (Respond YES):
- Clear educational subjects ("Basics of C Programming", "Microeconomics Introduction")
- Skills or foundational concepts ("Python OOP Fundamentals", "Human Anatomy Basics")
- Beginner-friendly scopes ("Cloud Computing Basics", "Operating System Fundamentals")

INVALID TOPICS (Respond NO):
- One-word labels with no learning intent ("dogs", "love", "football")
- Extremely broad subjects ("mathematics", "history", "science")
- Non-educational queries (personal chats, jokes, adult content, random sentences)
- Professional-grade expert topics requiring years of depth

Respond with ONLY: YES or NO.

Input: "${topic}"
Answer:
  `;
};
