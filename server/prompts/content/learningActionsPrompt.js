// function generateLearningActionsPrompt(user, subtopic) {
//   return `Create 4 learning actions for "${subtopic}".
// Format: JSON array ["Action1", "Action2", "Action3", "Action4"].
// Progressive: Identify → Understand → Apply → Create.
// Action verbs, clear steps. Output ONLY JSON.`;
// }


// module.exports = { generateLearningActionsPrompt };

function generateLearningActionsPrompt(user, subtopic) {
  return `Create 4 progressive learning actions for "${subtopic}".

IMPORTANT FORMATTING RULES:
- Provide ONLY a numbered list
- No labels like "Learning Actions:"
- No markdown formatting
- No JSON formatting
- Each action on a new line starting with number and period
- No additional text before or after the list

Structure:
1. Identify: [action to recognize key aspects]
2. Understand: [action to comprehend how it works]
3. Apply: [action to use in practice]
4. Create: [action to build something new]

Each action should:
- Start with an action verb
- Be clear and actionable
- Be 1-2 sentences maximum

Your response must be ONLY the 4 numbered actions, nothing else.`;
}

module.exports = { generateLearningActionsPrompt };