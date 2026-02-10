function generateUnifiedPrompt(user, topic, subtopic) {
  const { difficultyPreference, learningStyle, reasonForLearning, tonePreference, name } = user;
  return `Create comprehensive educational content about "${subtopic}" within the topic "${topic}".

STUDENT PROFILE:
- Name: ${name}
- Skill Level: ${difficultyPreference}
- Learning Style: ${learningStyle}
- Motivation: ${reasonForLearning}
- Preferred Tone: ${tonePreference}

IMPORTANT: Respond with PLAIN TEXT ONLY, using these exact section headers:

TITLE:
[Your title here]

CONCEPT:
[Your definition here]

EXPLANATION:
[Your explanation here]

CORE EXAMPLE:
[Your example here]

PRACTICE:
[Your practice activity here]

LEARNING ACTIONS:
1. Identify: [action]
2. Understand: [action] 
3. Apply: [action]
4. Create: [action]

MINDMAP:
graph TD
[Your mermaid code here]

QUIZ:
Q1: [Conceptual question]
A) [Option A]
B) [Option B]
C) [Option C]
D) [Option D]
Correct: [Letter] - [Brief explanation]

Q2: [Applied question]
A) [Option A]
B) [Option B]
C) [Option C]
D) [Option D]
Correct: [Letter] - [Brief explanation]

Q3: [Scenario question]
A) [Option A]
B) [Option B]
C) [Option C]
D) [Option D]
Correct: [Letter] - [Brief explanation]

REMEMBER: No markdown, no JSON, just plain text with section headers.`;


  }

  module.exports = generateUnifiedPrompt