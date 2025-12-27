

// utils/buildPrompt.js
const User = require("../models/User");

function buildPrompt(user, { topic, subtopic, taskType }) {
  const { difficultyPreference, learningStyle, reasonForLearning, tonePreference, name } = user;

  if (taskType === "generateSubtopic") {
    return generateSubtopicPrompt(topic, difficultyPreference || "beginner");
  } else if (taskType === "teachSubtopic") {
    return generateTeachingPrompt(user, topic, subtopic);
  } 
  else if (taskType === "generateMindmap") {
    return generateMindmapPrompt(user, topic, subtopic);
  } 
  
  else {
    throw new Error(`Unknown task type: ${taskType}`);
  }
}

function generateSubtopicPrompt(topic, difficulty) {
  return `
Generate exactly 15 subtopic names for: "${topic}"

STRICT OUTPUT RULES:
- ONLY subtopic names
- One per line
- No numbering (1., 2., etc)
- No bullet points
- No explanations
- No conversational phrases
- No "often called" or "think of it as"
- No descriptions
- Clean, direct names only

BAD EXAMPLES:
"1. Introduction to Topic"
"Reconnaissance (often called recon)"
"Setting up your environment - let's get started!"

GOOD EXAMPLES:
"Introduction to Cybersecurity"
"Reconnaissance Techniques" 
"Network Scanning"
"Vulnerability Assessment"

CONTENT GUIDANCE:
- Difficulty: ${difficulty}
- Logical order: basic → advanced
- Include both theory and practice
- Use standard terminology

Generate subtopics for "${topic}":
`;
}

function generateTeachingPrompt(user, topic, subtopic) {
  const { difficultyPreference, learningStyle, reasonForLearning, tonePreference, name } = user;

  return `
Create exceptionally structured, personalized, and educational content for "${subtopic}" under the broader topic "${topic}".

LEARNER PROFILE (inject into output where noted):
- Name: ${name}
- Learning Level: ${difficultyPreference}
- Learning Style: ${learningStyle}
- Motivation: ${reasonForLearning}
- Preferred Tone: ${tonePreference}

PRIMARY GOALS:
1) Produce content tailored to the learner's name and preferred tone (mentor-like, motivational but realistic, direct).
2) Ensure content matches the learner's stated learning style (e.g., practical, conceptual, visual).
3) Produce a strict JSON object only — no extra text, no markdown outside JSON.
4) All quiz questions MUST be generated from this content (concept, keyConcepts, coreExample, learningActions, examples). Do NOT introduce unrelated or external topics.

OUTPUT FORMAT (STRICT JSON — NO EXTRA TEXT):
{
  "title": "Short, engaging title (3–8 words)",
  "concept": "One precise definition (1–2 sentences).",
  "explanation": "Clear structured explanation that teaches. Must include one short personalized line addressing the learner by name using their preferred tone and be aligned with learningStyle (e.g., 'Direct: ...', 'Practical: ...'). Do NOT repeat the concept verbatim.",
  "keyConcepts": ["Core concept 1", "Core concept 2", "Core concept 3", "Core concept 4"],
  "coreExample": "Working, copy-paste example (code or concrete example) with a one-paragraph explanation of how it demonstrates the concept.",
  "practice": "Imperative hands-on exercise. Include a one-sentence motivational prompt addressing the learner by name (use tonePreference).",
  "mindmap": "MERMAID.JS FLOWCHART following the MERMAID rules below (must render correctly).",
  "learningActions": ["Identify the key pieces", "See how they work together", "Try it with the example", "Apply to something new"],
  "examples": ["Short, real-world example 1", "Practical scenario 2"],
  "quiz": [
    {
      "question": "Direct conceptual question derived from the 'concept' or 'keyConcepts'",
      "choices": ["Correct option", "Plausible distractor", "Plausible distractor", "Plausible distractor"],
      "answer": "Exact correct option text",
      "correctIndex": 0,
      "source": "Identify which field this question was derived from (concept|keyConcepts|coreExample|learningActions|examples)"
    },
    {
      "question": "Applied question derived from 'coreExample' or 'learningActions'",
      "choices": ["Correct option", "Plausible distractor", "Plausible distractor", "Plausible distractor"],
      "answer": "Exact correct option text",
      "correctIndex": 0,
      "source": "concept|keyConcepts|coreExample|learningActions|examples"
    },
    {
      "question": "Scenario-based question testing practical application from 'examples'",
      "choices": ["Correct option", "Plausible distractor", "Plausible distractor", "Plausible distractor"],
      "answer": "Exact correct option text",
      "correctIndex": 0,
      "source": "examples|coreExample"
    }
  ]
}

STRICT CONTENT & QUALITY RULES:
- Output MUST be valid JSON parseable by a strict JSON parser. No trailing commas, no comments, no extra keys.
- Fill every field. No nulls, empty arrays, or empty strings.
- Keep language concise. Use clear teaching-first style (concept → explanation → example → practice → learningActions → quiz).
- The 'explanation' field must contain exactly one short personalized sentence that mentions the learner by name and matches tonePreference (mentor, direct, realistic, motivational). Example patterns: "George — here's the direct truth: ...", "George, stay practical: ...".
- The 'practice' field must include exactly one short motivational sentence addressing the learner by name and then the exercise instructions.
- Match learningStyle: if learningStyle is "practical", favor action and examples; if "conceptual", emphasize hierarchy and principles; if "visual", keep labels concise for the mindmap and emphasize patterns in examples.
- Code in 'coreExample' must be runnable (self-contained), language-appropriate, and not include extraneous comments or markdown fences.
- The keys of Json should not contains double quotations
ENHANCED CONTENT QUALITY RULES:
- Make 'concept' crystal clear and immediately understandable
- Ensure 'explanation' builds directly from the concept with concrete steps
- 'keyConcepts' should be distinct, non-overlapping, and cover the core pillars
- 'coreExample' must be immediately applicable and demonstrate the concept perfectly
- 'practice' should be achievable within 5-10 minutes and reinforce key learning
- 'examples' should be from diverse real-world contexts
- 'learningActions' should follow a logical progression from simple to complex

QUIZ ENHANCEMENT RULES:
- Include exactly 3 questions covering: conceptual, applied, and scenario-based understanding
- Question 1: Tests fundamental concept comprehension
- Question 2: Tests ability to apply knowledge to practical situations  
- Question 3: Tests problem-solving in real-world scenarios
- All distractors must represent common misconceptions or logical errors
- Ensure questions progressively test deeper understanding

MERMAID.JS MINDMAP RULES (ABSOLUTE):
1. The mindmap string MUST start with exactly the line: graph TD
2. Use ONLY square bracket node labels: [Label Text]
3. Node IDs must be single uppercase letters followed by optional numbers (A, B, B1, C2).
5. only 8 mindmap nodes or fewer
4. Required EXACT STRUCTURE (copy and replace nodes with real content):
\`\`\`
graph TD
    A[${subtopic}] --> B[Branch 1]
    A --> C[Branch 2]
    A --> D[Branch 3]
    A --> E[Branch 4]
    
    B --> B1[Detail 1]
    B --> B2[Detail 2]
    
    C --> C1[Detail 1]
    C --> C2[Detail 2]
    
    D --> D1[Detail 1]
    D --> D2[Detail 2]
    
    E --> E1[Detail 1]
    E --> E2[Detail 2]
    
    style A fill:#e1f5fe
    style B fill:#f3e5f5
    style C fill:#e8f5e8
    style D fill:#fff3e0
    style E fill:#fce4ec
\`\`\`
4. LABEL RULES:
   - Replace "Branch X" and "Detail X" with specific, concise (2–5 word) labels relevant to ${subtopic}.
   - NO special characters: {}()<>;
   - No placeholders like "Detail 1" in final output — replace with real subpoints.
   - Ensure mindmap shows clear hierarchical relationships
5. All style lines MUST appear exactly as shown at the end.

ADDITIONAL VALIDATION & TONE:
- Maintain educational coherence: explanation should not contradict keyConcepts or learningActions.
- Tone must be aligned with tonePreference: keep it mentor-like, direct, motivational but realistic — no excessive praise or fluff.
- Personalization must be subtle and functional: mention the learner by name only twice maximum (once in 'explanation', once in 'practice').
- Ensure all content flows logically and builds upon previous sections.

FAILURE CONDITIONS:
- If any JSON field is missing, empty, or the mindmap breaks the rules, return INVALID_OUTPUT (but do not include any text outside the JSON — instead produce valid JSON with a single field: { "error": "INVALID_OUTPUT", "reason": "<short reason>" } ).

END: produce the described JSON object ONLY — no surrounding commentary, no markdown, no additional output.
`;
}
function generateMindmapPrompt(user, topic, subtopic) {
  const { difficultyPreference, learningStyle, name } = user;

  return `
Generate ONLY a Mermaid.js flowchart mindmap for the subtopic: "${subtopic}" under topic: "${topic}"

LEARNER CONTEXT:
- Learning Level: ${difficultyPreference}
- Learning Style: ${learningStyle}
- Name: ${name}

STRICT OUTPUT RULES:
- Output ONLY the Mermaid.js code
- No explanations, no JSON, no markdown blocks
- No surrounding text of any kind
- Must be valid Mermaid.js syntax that renders correctly

MERMAID.JS REQUIREMENTS:
1. Start with: graph TD
2. Use ONLY square bracket node labels: [Label Text]
3. Node IDs must be single uppercase letters (A, B, C, etc.)
4. Maximum 8 nodes total
5. Must show clear hierarchical structure
6. Include styling for visual clarity

REQUIRED STRUCTURE:
graph TD
    A[${subtopic}] --> B[Main Branch 1]
    A --> C[Main Branch 2] 
    A --> D[Main Branch 3]
    
    B --> B1[Key Detail 1]
    B --> B2[Key Detail 2]
    
    C --> C1[Key Detail 1]
    C --> C2[Key Detail 2]
    
    D --> D1[Key Detail 1]
    D --> D2[Key Detail 2]
    
    style A fill:#e1f5fe
    style B fill:#f3e5f5
    style C fill:#e8f5e8
    style D fill:#fff3e0

CONTENT GUIDELINES:
- Replace placeholder labels with specific, concise content about "${subtopic}"
- Keep labels short (2-5 words max)
- Ensure logical flow from general to specific
- Make it educational and informative
- Focus on core concepts and relationships

OUTPUT ONLY THE MERMAID CODE - NO OTHER TEXT.
`;
}

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

module.exports = {
  buildPrompt,
  generateSubtopicPrompt,
  generateMindmapPrompt,
  cleanSubtopicOutput
};
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

module.exports = {
  buildPrompt,
  generateSubtopicPrompt,
  cleanSubtopicOutput
};