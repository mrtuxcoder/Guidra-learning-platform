// Cleanup function for subtopic parsing
function cleanSubtopicOutput(text) {
  if (!text || typeof text !== 'string') return [];
  
  const lines = text.split('\n')
    .map(line => {
      // Remove numbering and bullets
      let cleaned = line.replace(/^\d+[\.\)]\s*/, '')
                       .replace(/^[-•*]\s*/, '')
                       .trim();
      
      // Remove content in parentheses and after dashes
      cleaned = cleaned.replace(/\s*\([^)]*\)/g, '')
                       .replace(/\s*\-.*$/g, '')
                       .replace(/\s*\—.*$/g, '');
      
      return cleaned;
    })
    .filter(line => 
      line.length > 3 && 
      line.length < 100 &&
      !line.toLowerCase().includes('here are') &&
      !line.toLowerCase().includes('subtopics for') &&
      line !== ''
    )
    .slice(0, 18);
  
  return lines;
}

module.exports = cleanSubtopicOutput