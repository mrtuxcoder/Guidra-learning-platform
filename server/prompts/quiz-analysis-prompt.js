function generateQuizAnalysisPrompt(user, topic, subtopic, quizAnswers) {
  const { learningStyle, difficultyPreference, struggles } = user;
  
  return `Analyze this student's quiz performance to identify specific strengths and weaknesses.

STUDENT PROFILE:
- Learning Style: ${learningStyle}
- Difficulty Level: ${difficultyPreference}
- Known Struggles: ${struggles.length > 0 ? struggles.join(', ') : 'None recorded'}

QUIZ CONTEXT:
Topic: ${topic}
Subtopic: ${subtopic}

QUIZ ANSWERS:
${quizAnswers.map((q, i) => `
Question ${i + 1}: ${q.question}
Student's Answer: ${q.userAnswer}
Correct Answer: ${q.correctAnswer}
Result: ${q.isCorrect ? 'CORRECT ✓' : 'INCORRECT ✗'}
${!q.isCorrect ? `Explanation: ${q.explanation || 'Not provided'}` : ''}
`).join('\n')}

ANALYSIS TASK:
Based on the quiz results above, identify:
1. **Concepts the student STRUGGLES with** - specific topics they got wrong or show confusion about
2. **Concepts the student is STRONG in** - specific topics they clearly understand

CRITICAL REQUIREMENTS:
- Be specific: Use exact concept names (e.g., "variable hoisting", "asynchronous callbacks")
- Only include concrete concepts demonstrated in the quiz
- For weaknesses: Focus on conceptual gaps shown by wrong answers
- For strengths: Only include concepts with confident correct answers
- If all answers are wrong, list empty strengths array
- If all answers are correct, list empty weaknesses array

OUTPUT FORMAT (JSON ONLY):
{
  "weaknesses": ["concept1", "concept2"],
  "strengths": ["concept3", "concept4"],
  "recommendations": "Brief 1-2 sentence recommendation for improvement"
}

Return ONLY the JSON object, no additional text, no markdown formatting, no code blocks.`;
}

module.exports = { generateQuizAnalysisPrompt };
