function generateKeyConceptsPrompt(user, subtopic) {
  const { learningStyle } = user;
  
  return `List 4 key concepts for "${subtopic}". Style: ${learningStyle}.
Format: JSON array ["Concept1", "Concept2", "Concept3", "Concept4"].
Distinct, 2-5 words each. Cover core pillars. Output ONLY JSON.`;
}


module.exports = { generateKeyConceptsPrompt};