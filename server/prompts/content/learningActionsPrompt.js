function generateLearningActionsPrompt(user, subtopic) {
  return `Create 4 learning actions for "${subtopic}".
Format: JSON array ["Action1", "Action2", "Action3", "Action4"].
Progressive: Identify → Understand → Apply → Create.
Action verbs, clear steps. Output ONLY JSON.`;
}


module.exports = { generateLearningActionsPrompt };