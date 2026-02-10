// function generateQuizPrompt(user, subtopic, context) {
//   const { difficultyPreference } = user;
  
//   return `Create 3 quiz questions for "${subtopic}" (${difficultyPreference}).
// Based on: ${context.substring(0, 100)}...
// OUTPUT ONLY JSON array: [ {question, choices, answer, correctIndex, source}, ... ]
// 3 questions: Q1=Conceptual, Q2=Applied, Q3=Scenario.
// Distractors = common misconceptions.`;
// }


// module.exports = { generateQuizPrompt };

function generateQuizPrompt(user, subtopic, context) {
  const { difficultyPreference } = user;
  
  return `Create 3 quiz questions about "${subtopic}" at ${difficultyPreference} level.

IMPORTANT FORMATTING RULES:
- Provide ONLY the quiz questions in the specified format
- No labels like "Quiz:" or "Questions:"
- No markdown formatting
- No JSON formatting
- Follow the exact format below

Context: ${context.substring(0, 100)}...

EXACT FORMAT TO FOLLOW:
Q1: [Conceptual question about definition]
A) [Option A]
B) [Option B]
C) [Option C]
D) [Option D]
Correct: [Letter] - [Brief explanation]

Q2: [Applied question about using concept]
A) [Option A]
B) [Option B]
C) [Option C]
D) [Option D]
Correct: [Letter] - [Brief explanation]

Q3: [Scenario-based question]
A) [Option A]
B) [Option B]
C) [Option C]
D) [Option D]
Correct: [Letter] - [Brief explanation]

Requirements:
- Q1 must be conceptual (tests understanding)
- Q2 must be applied (tests usage)
- Q3 must be scenario-based (tests decision-making)
- Distractors should reflect common misconceptions

Your response must be ONLY the 3 questions in the format above, nothing else.`;
}

module.exports = { generateQuizPrompt };