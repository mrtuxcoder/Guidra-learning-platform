function extractExampleFromText(text, subtopic) {
  // Look for example indicators in the text
  const exampleIndicators = [/for example/i, /for instance/i, /such as/i, /example:/i];
  
  for (const indicator of exampleIndicators) {
    const exampleMatch = text.match(new RegExp(`${indicator.source}[^.!?]+[.!?]`, 'i'));
    if (exampleMatch) {
      return exampleMatch[0].trim();
    }
  }
  
  // Fallback
  return `Practical demonstration of ${subtopic} concepts`;
}

module.exports = extractExampleFromText