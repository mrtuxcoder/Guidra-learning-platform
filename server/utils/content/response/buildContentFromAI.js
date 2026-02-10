const createStructuredContentFromText = require('../create-structure')
const parseResponseText = require('./parseResponseText')

async function buildContentFromAI(aiResponse, topic, subtopic, user) {
  console.log("=== Processing AI Response ===");
  
  // Step 1: Try to process with the new plain text parser
  const processedResult = parseResponseText ({ unified: aiResponse });
  
  let structuredContent;
  
  if (processedResult.success) {
    console.log("✅ Successfully processed plain text response");
    structuredContent = processedResult.content;
    
    // Add personalization if missing
    if (user && user.name && !structuredContent.explanation?.includes(user.name)) {
      structuredContent.explanation = `As ${user.name}, ${structuredContent.explanation}`;
    }
  } else {
    // Step 2: Fallback to JSON parsing (for backward compatibility)
    console.log("⚠️  Plain text processing failed, trying JSON parsing");
    try {
      let jsonString = aiResponse.trim();
      jsonString = jsonString.replace(/```json\s*/g, "").replace(/```\s*/g, "");

      try {
        structuredContent = JSON.parse(jsonString);
        console.log("✅ Successfully parsed JSON response");
      } catch (directError) {
        const jsonMatch = jsonString.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          structuredContent = JSON.parse(jsonMatch[0]);
          console.log("✅ Extracted JSON from response");
        } else {
          throw new Error("No valid JSON found in response");
        }
      }
    } catch (parseError) {
      // Step 3: Final fallback to text extraction
      console.log("❌ JSON parsing failed, using text extraction");
      structuredContent = createStructuredContentFromText(
        aiResponse,
        topic,
        subtopic
      );
    }
  }
  
  return structuredContent;
}

module.exports = buildContentFromAI