const extractExampleFromText = require('./fallback/extract-example')
const generatePracticeFallback = require('./fallback/practice-fallback')
const generateFallbackMindmap = require('./fallback/mindmap-fallback')




function createStructuredContentFromText(text, topic, subtopic) {
  console.log("🔄 Creating structured content from AI text response");
  
  const paragraphs = text.split('\n\n').filter(p => p.trim());
  
  // Use the actual AI response text instead of placeholders
  return {
    title: `${subtopic} - ${topic}`,
    explanation: paragraphs.length > 1 ? paragraphs.slice(1).join('\n\n') : text,
    coreExample: extractExampleFromText(text, subtopic),
    practice: generatePracticeFromTopic(subtopic),
    mindmap: generateFallbackMindmap(subtopic)
  };
}


module.exports = createStructuredContentFromText