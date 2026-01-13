function generateQuizPrompt(user, subtopic, context) {
  const { difficultyPreference } = user;
  
  return `Create 3 quiz questions for "${subtopic}" (${difficultyPreference}).
Based on: ${context.substring(0, 100)}...
OUTPUT ONLY JSON array: [ {question, choices, answer, correctIndex, source}, ... ]
3 questions: Q1=Conceptual, Q2=Applied, Q3=Scenario.
Distractors = common misconceptions.`;
}


module.exports = { generateQuizPrompt };