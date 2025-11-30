const User = require("../models/User");
const ContentCache = require("../models/ContentCache");
const callAIAPI = require("../utils/callAIAPI");
const {buildPrompt} = require("../utils/buildPrompt");
const crypto = require('crypto');

/**
 * 🧠 Personalized Teaching for a Subtopic WITH CACHING - CONTENT PRESERVED
 */
exports.teachSubtopicController = async (req, res) => {
  try {
    const userId = req.user._id;
    const { topic, subtopic, regenerate = false } = req.body;

    if (!topic || !subtopic)
      return res.status(400).json({ message: "Topic and subtopic are required." });

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    if (regenerate) {
      return await handleRegenerateContent(userId, user, topic, subtopic, res);
    }

    // Check cache first
    const cachedContent = await ContentCache.findOne({
      userId,
      topic: topic.toLowerCase(),
      subtopic: subtopic.toLowerCase(),
      learningStyle: user.learningStyle,
      isActive: true
    }).sort({ version: -1 });

    if (cachedContent) {
      console.log("📂 Loading from cache - Checking mindmap...");
      
      // Enhanced validation - specifically check for mindmap
      if (!cachedContent.content || typeof cachedContent.content !== 'object') {
        console.error("❌ Invalid cache content structure, regenerating...");
        await ContentCache.deleteOne({ _id: cachedContent._id });
      } else if (!cachedContent.content.mindmap) {
        console.error("❌ Cache missing mindmap, regenerating...");
        await ContentCache.deleteOne({ _id: cachedContent._id });
      } else {
        cachedContent.timesAccessed += 1;
        cachedContent.lastAccessed = new Date();
        await cachedContent.save();

        return res.status(200).json({
          message: `Cached teaching content for "${subtopic}"`,
          topic,
          subtopic,
          learningStyle: user.learningStyle,
          cached: true,
          version: cachedContent.version,
          data: cachedContent.content,
        });
      }
    }

    // Generate new content
    const aiPrompt = buildPrompt(user, {
      topic,
      subtopic,
      taskType: "teachSubtopic",
    });

    console.log("🤖 AI PROMPT SENT:", aiPrompt);

    const aiResponse = await callAIAPI(aiPrompt);
    console.log("🤖 Raw AI Response Length:", aiResponse.length);

    let structuredContent;
    try {
      let jsonString = aiResponse.trim();
      jsonString = jsonString.replace(/```json\s*/g, '').replace(/```\s*/g, '');
      
      try {
        structuredContent = JSON.parse(jsonString);
        
      } catch (directError) {
        const jsonMatch = jsonString.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          structuredContent = JSON.parse(jsonMatch[0]);
        } else {
          throw new Error("No valid JSON found in response");
        }
      }
      
    } catch (parseError) {
      console.error("❌ JSON Parse Error:", parseError.message);
      structuredContent = createStructuredContentFromText(aiResponse, topic, subtopic);
    }

    // Enhanced validation - PRESERVES AI CONTENT
    const validatedContent = validateContentStructure(structuredContent, topic, subtopic);

    // Save to cache with FULL content
    const newCacheEntry = await saveToCache({
      userId,
      topic,
      subtopic,
      user,
      content: validatedContent,
      aiPrompt
    });

    res.status(200).json({
      message: `Personalized teaching content generated for "${subtopic}"`,
      topic,
      subtopic,
      learningStyle: user.learningStyle,
      cached: false,
      version: newCacheEntry.version,
      data: validatedContent,
    });
  } catch (error) {
    console.error("Error in teachSubtopicController:", error);
    res.status(500).json({ message: "Failed to generate personalized teaching content" });
  }
};

/**
 * Helper function to create structured content from text - IMPROVED
 */
function createStructuredContentFromText(text, topic, subtopic) {
  console.log("🔄 Creating structured content from AI text response");
  
  const paragraphs = text.split('\n\n').filter(p => p.trim());
  
  // Use the actual AI response text instead of placeholders
  return {
    title: `${subtopic} - ${topic}`,
    explanation: paragraphs.length > 1 ? paragraphs.slice(1).join('\n\n') : text,
    keyConcepts: extractKeyConceptsFromText(text, subtopic),
    coreExample: extractExampleFromText(text, subtopic),
    practice: generatePracticeFromTopic(subtopic),
    mindmap: generateFallbackMindmap(subtopic)
  };
}

/**
 * Extract key concepts from AI text response
 */
function extractKeyConceptsFromText(text, subtopic) {
  // Try to find bullet points or numbered lists in the text
  const bulletPoints = text.match(/[-•*]\s*(.+?)(?=\n|$)/g) || 
                      text.match(/\d+\.\s*(.+?)(?=\n|$)/g);
  
  if (bulletPoints && bulletPoints.length >= 2) {
    return bulletPoints.slice(0, 3).map(point => 
      point.replace(/^[-•*\d\.\s]+/, '').trim()
    );
  }
  
  // Fallback to topic-based concepts
  return [
    `Fundamental principles of ${subtopic}`,
    `Core components of ${subtopic}`,
    `Key applications of ${subtopic}`
  ];
}

/**
 * Extract example from AI text response
 */
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

/**
 * Generate practice based on topic
 */
function generatePracticeFromTopic(subtopic) {
  return `Apply your knowledge of ${subtopic} by solving this challenge: Create a simple project or solve a problem using the concepts you've learned.`;
}

/**
 * Generate fallback mindmap
 */
function generateFallbackMindmap(subtopic) {
  return `graph TD
    A[${subtopic}] --> B[Core Concept]
    A --> C[Key Principles] 
    A --> D[Practical Applications]
    
    B --> B1[Fundamental Idea]
    B --> B2[Basic Components]
    
    C --> C1[Main Rule 1]
    C --> C2[Main Rule 2]
    
    D --> D1[Real-world Example]
    D --> D2[Practice Exercise]
    
    style A fill:#e1f5fe
    style B fill:#f3e5f5
    style C fill:#e8f5e8
    style D fill:#fff3e0`;
}

/**
 * Check if mindmap is actually AI-generated or just fallback placeholder
 */
function isFallbackMindmap(mindmap) {
  if (!mindmap) return true;
  
  const fallbackIndicators = [
    'Fundamental Idea',
    'Basic Components', 
    'Main Rule 1',
    'Main Rule 2',
    'Real-world Example',
    'Practice Exercise'
  ];
  
  return fallbackIndicators.some(indicator => mindmap.includes(indicator));
}

/**
 * Validate and fix Mermaid.js syntax - FIXED FOR FRONTEND
 */
function validateAndFixMermaidSyntax(mindmap) {
  if (!mindmap) return generateFallbackMindmap('Unknown Topic');
  
  let fixedMindmap = mindmap;
  
  // Remove markdown code blocks
  fixedMindmap = fixedMindmap.replace(/```mermaid\s*/gi, '').replace(/```\s*/gi, '');
  
  // Fix common character issues
  fixedMindmap = fixedMindmap
    .replace(/[–—‑−]/g, '-')
    .replace(/[“”]/g, '"')
    .replace(/[‘’]/g, "'")
    .replace(/[`$®©™]/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&amp;/g, '&');
  
  // Fix parentheses in node labels
  fixedMindmap = fixedMindmap.replace(/\[([^\]]*)\(([^)]*)\)([^\]]*)\]/g, (match, before, content, after) => {
    return `[${before}${content}${after}]`;
  });
  
  // Ensure proper graph declaration
  if (!fixedMindmap.trim().startsWith('graph') && !fixedMindmap.trim().startsWith('mindmap')) {
    fixedMindmap = `graph TD\n${fixedMindmap}`;
  }
  
  // Fix arrow spacing
  fixedMindmap = fixedMindmap.replace(/([A-Za-z0-9])\s*-->\s*([A-Za-z0-9])/g, '$1 --> $2');
  
  // Fix line breaks and indentation
  const lines = fixedMindmap.split('\n');
  const cleanedLines = [];
  
  for (let line of lines) {
    line = line.trim();
    if (!line) continue;
    
    // Add proper indentation for nodes
    if (line.match(/^[A-Z]\d?\[/) || line.match(/^[A-Z]\d? -->/)) {
      line = '    ' + line;
    }
    
    // Add proper indentation for sub-nodes
    if (line.match(/^[A-Z]\d+\[/) || line.match(/^[A-Z]\d+ -->/)) {
      line = '        ' + line;
    }
    
    cleanedLines.push(line);
  }
  
  fixedMindmap = cleanedLines.join('\n');
  
  return fixedMindmap;
}

/**
 * Validate Mermaid syntax and return validation result - FIXED FOR FRONTEND
 */
function validateMermaidSyntax(mindmap) {
  if (!mindmap) {
    return { isValid: false, error: 'Mindmap is empty' };
  }
  
  // Basic syntax checks that work with frontend Mermaid
  const checks = {
    hasValidDeclaration: /^(graph|mindmap|flowchart)/i.test(mindmap.trim()),
    hasNodes: /\[.*\]/.test(mindmap),
    hasProperStructure: mindmap.includes('\n') || mindmap.includes(';'),
    hasReasonableLength: mindmap.length > 50
  };
  
  const isValid = Object.values(checks).every(check => check);
  
  return {
    isValid,
    errors: isValid ? [] : Object.entries(checks).filter(([_, check]) => !check).map(([key]) => key),
    details: checks
  };
}

/**
 * Validate and ensure complete content structure - PRESERVES AI CONTENT
 */
function validateContentStructure(content, topic, subtopic) {
  // Ensure content is an object
  if (typeof content !== 'object' || content === null) {
    return createStructuredContentFromText("", topic, subtopic);
  }

  // Create safe defaults that only fill in missing fields
  const safeDefaults = {
    title: `${subtopic} - ${topic}`,
    explanation: `Comprehensive explanation of ${subtopic}`,
    keyConcepts: [`Essential concepts of ${subtopic}`],
    coreExample: `Practical application of ${subtopic}`,
    practice: `Hands-on practice for ${subtopic}`,
  };

  // Merge preserving AI content - AI content takes priority
  const validatedContent = {
    ...safeDefaults,  // Fill missing fields first
    ...content        // Then overlay with AI content (preserves real data)
  };

  // Debug: Check content preservation
  console.log("🔍 Content Validation Debug:");
  console.log("- Original explanation exists:", !!content.explanation);
  console.log("- Final explanation exists:", !!validatedContent.explanation);
  console.log("- Was explanation preserved?", content.explanation === validatedContent.explanation);
  
  if (content.explanation && content.explanation !== validatedContent.explanation) {
    console.log("⚠️  WARNING: Explanation was overwritten!");
    // Restore the original AI content
    validatedContent.explanation = content.explanation;
  }

  // Handle mindmap separately with better validation
  if (!validatedContent.mindmap || validatedContent.mindmap.trim() === '' || isFallbackMindmap(validatedContent.mindmap)) {
    console.log("🔄 Generating new mindmap for:", subtopic);
    validatedContent.mindmap = generateFallbackMindmap(subtopic);
  } else {
    const validation = validateMermaidSyntax(validatedContent.mindmap);
    
    if (!validation.isValid) {
      console.log("🔄 Fixing mindmap syntax for:", subtopic);
      validatedContent.mindmap = validateAndFixMermaidSyntax(validatedContent.mindmap);
    }
  }

  // Ensure arrays are properly formatted without overwriting real data
  if (!Array.isArray(validatedContent.keyConcepts) || validatedContent.keyConcepts.length === 0) {
    validatedContent.keyConcepts = [`Key principles of ${subtopic}`];
  }

  return validatedContent;
}

/**
 * Regenerate Content Controller
 */
exports.regenerateContentController = async (req, res) => {
  try {
    const userId = req.user._id;
    const { topic, subtopic } = req.body;

    if (!topic || !subtopic)
      return res.status(400).json({ message: "Topic and subtopic are required." });

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    await handleRegenerateContent(userId, user, topic, subtopic, res);
  } catch (error) {
    console.error("Error in regenerateContentController:", error);
    res.status(500).json({ message: "Failed to regenerate content" });
  }
};

const handleRegenerateContent = async (userId, user, topic, subtopic, res) => {
  try {
    const aiPrompt = buildPrompt(user, {
      topic,
      subtopic,
      taskType: "teachSubtopic",
    });

    const aiResponse = await callAIAPI(aiPrompt);

    let structuredContent;
    try {
      let jsonString = aiResponse.trim();
      jsonString = jsonString.replace(/```json\s*/g, '').replace(/```\s*/g, '');
      
      try {
        structuredContent = JSON.parse(jsonString);
      } catch (directError) {
        const jsonMatch = jsonString.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          structuredContent = JSON.parse(jsonMatch[0]);
        } else {
          throw new Error("No valid JSON found in response");
        }
      }
    } catch (parseError) {
      structuredContent = createStructuredContentFromText(aiResponse, topic, subtopic);
    }

    // Enhanced validation - PRESERVES AI CONTENT
    const validatedContent = validateContentStructure(structuredContent, topic, subtopic);

    const newCacheEntry = await saveToCache({
      userId,
      topic,
      subtopic,
      user,
      content: validatedContent,
      aiPrompt
    });

    res.status(200).json({
      message: `Content regenerated successfully for "${subtopic}"`,
      topic,
      subtopic,
      learningStyle: user.learningStyle,
      cached: false,
      version: newCacheEntry.version,
      data: validatedContent,
    });
  } catch (error) {
    console.error("Error in handleRegenerateContent:", error);
    res.status(500).json({ message: "Failed to regenerate content" });
  }
};

/**
 * Save to Cache - PRESERVES full structure
 */
const saveToCache = async ({ userId, topic, subtopic, user, content, aiPrompt }) => {
  // Deactivate previous versions
  await ContentCache.updateMany(
    {
      userId,
      topic: topic.toLowerCase(),
      subtopic: subtopic.toLowerCase(),
      learningStyle: user.learningStyle,
      isActive: true
    },
    { isActive: false }
  );

  // Get next version
  const latestVersion = await ContentCache.findOne({
    userId,
    topic: topic.toLowerCase(),
    subtopic: subtopic.toLowerCase(),
    learningStyle: user.learningStyle
  }).sort({ version: -1 });
  
  const nextVersion = latestVersion ? latestVersion.version + 1 : 1;

  // Save the ENTIRE content structure as-is
  const cacheEntry = await ContentCache.create({
    userId,
    topic: topic.toLowerCase(),
    subtopic: subtopic.toLowerCase(),
    learningStyle: user.learningStyle,
    learningMotivation: user.reasonForLearning,
    difficultyLevel: user.difficultyPreference || 'beginner',
    contentFormat: 'comprehensive',
    content: content,
    aiModelUsed: "gemini-huggingface-fallback",
    aiPromptHash: crypto.createHash('md5').update(aiPrompt).digest('hex'),
    version: nextVersion,
    isActive: true,
    timesAccessed: 0,
    lastAccessed: new Date()
  });

  return cacheEntry;
};


/**
 * Fix Mindmap Cache - Specifically for mindmap issues
 */
exports.fixMindmapCacheController = async (req, res) => {
  try {
    const userId = req.user._id;
    const { topic, subtopic } = req.body;

    if (!topic || !subtopic) {
      return res.status(400).json({ message: "Topic and subtopic are required." });
    }

    // Find cache entries missing mindmaps
    const brokenEntries = await ContentCache.find({
      userId,
      topic: topic.toLowerCase(),
      subtopic: subtopic.toLowerCase(),
      $or: [
        { 'content.mindmap': { $exists: false } },
        { 'content.mindmap': null },
        { 'content.mindmap': '' },
        { 'content.mindmap': { $eq: undefined } }
      ]
    });

    // Add mindmaps to broken entries
    let fixedCount = 0;
    for (const entry of brokenEntries) {
      if (entry.content && typeof entry.content === 'object') {
        entry.content.mindmap = generateFallbackMindmap(subtopic);
        entry.markModified('content');
        await entry.save();
        fixedCount++;
      }
    }

    res.status(200).json({
      message: "Mindmap cache fixed successfully",
      fixedCount,
      brokenEntriesFound: brokenEntries.length,
      topic,
      subtopic
    });
  } catch (error) {
    console.error("Error in fixMindmapCacheController:", error);
    res.status(500).json({ message: "Failed to fix mindmap cache" });
  }
};

/**
 * Get Content History
 */
exports.getContentHistoryController = async (req, res) => {
  try {
    const userId = req.user._id;
    const { topic, subtopic } = req.query;

    const query = { userId };
    if (topic) query.topic = topic.toLowerCase();
    if (subtopic) query.subtopic = subtopic.toLowerCase();

    const history = await ContentCache.find(query)
      .sort({ createdAt: -1 })
      .select('topic subtopic learningStyle version createdAt timesAccessed userRating contentFormat')
      .limit(50);

    res.status(200).json({
      message: "Content history retrieved from cache",
      data: history
    });
  } catch (error) {
    console.error("Error in getContentHistoryController:", error);
    res.status(500).json({ message: "Failed to get content history" });
  }
};

/**
 * Clear Cache for User/Topic
 */
exports.clearContentCacheController = async (req, res) => {
  try {
    const userId = req.user._id;
    const { topic, subtopic } = req.body;

    const query = { userId };
    if (topic) query.topic = topic.toLowerCase();
    if (subtopic) query.subtopic = subtopic.toLowerCase();

    const result = await ContentCache.deleteMany(query);

    res.status(200).json({
      message: "Content cache cleared successfully",
      deletedCount: result.deletedCount
    });
  } catch (error) {
    console.error("Error in clearContentCacheController:", error);
    res.status(500).json({ message: "Failed to clear content cache" });
  }
};

/**
 * Debug Cache - Check what's actually in cache
 */
exports.debugCacheController = async (req, res) => {
  try {
    const userId = req.user._id;
    const { topic, subtopic } = req.query;

    const query = { userId };
    if (topic) query.topic = topic.toLowerCase();
    if (subtopic) query.subtopic = subtopic.toLowerCase();

    const cacheEntries = await ContentCache.find(query)
      .sort({ version: -1 })
      .limit(10);

    const debugInfo = cacheEntries.map(entry => ({
      id: entry._id,
      topic: entry.topic,
      subtopic: entry.subtopic,
      version: entry.version,
      hasContent: !!entry.content,
      contentType: typeof entry.content,
      contentKeys: entry.content ? Object.keys(entry.content) : [],
      hasMindmap: entry.content ? !!entry.content.mindmap : false,
      mindmapLength: entry.content && entry.content.mindmap ? entry.content.mindmap.length : 0,
      isActive: entry.isActive,
      lastAccessed: entry.lastAccessed,
      explanationSample: entry.content && entry.content.explanation ? 
        entry.content.explanation.substring(0, 100) + '...' : 'MISSING'
    }));

    res.status(200).json({
      message: "Cache debug information",
      data: debugInfo
    });
  } catch (error) {
    console.error("Error in debugCacheController:", error);
    res.status(500).json({ message: "Failed to get cache debug info" });
  }
};



/**
 * 🧠 Fix Mermaid Mindmap Syntax - For existing cache with broken mindmaps
 */
exports.generateMermaidMapController = async (req, res) => {
  try {
    const userId = req.user._id;
    const { topic, subtopic } = req.body;

    if (!topic || !subtopic) {
      return res.status(400).json({ 
        message: "Topic and subtopic are required." 
      });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Find existing cache entry - REQUIRED for this controller
    const existingCache = await ContentCache.findOne({
      userId,
      topic: topic.toLowerCase(),
      subtopic: subtopic.toLowerCase(),
      learningStyle: user.learningStyle,
      isActive: true
    }).sort({ version: -1 });

    if (!existingCache) {
      return res.status(404).json({
        message: "No existing cache found. Please generate content first using teachSubtopicController.",
        topic,
        subtopic
      });
    }

    // Verify cache has content structure but broken mindmap
    if (!existingCache.content || typeof existingCache.content !== 'object') {
      return res.status(400).json({
        message: "Cache content structure is invalid",
        topic,
        subtopic
      });
    }

    console.log("🔄 Generating new Mermaid mindmap for existing cache:", subtopic);

    // Generate the mindmap using AI
    const aiPrompt = buildPrompt(user, {
      topic,
      subtopic,
      taskType: "generateMindmap",
    });

    const aiResponse = await callAIAPI(aiPrompt);
    console.log("🤖 Raw Mermaid AI Response:", aiResponse);

    // Simple cleaning function - no external dependency
    const cleanMermaidResponse = (response) => {
      if (!response || typeof response !== 'string') return '';
      
      let cleaned = response.trim();
      
      // Remove markdown code blocks
      cleaned = cleaned.replace(/```mermaid\s*/gi, '').replace(/```\s*/gi, '');
      
      // Fix common character issues
      cleaned = cleaned
        .replace(/[–—‑−]/g, '-')
        .replace(/[{}]/g, '')
        .replace(/;/g, '')
        .replace(/[“”]/g, '"')
        .replace(/[‘’]/g, "'");
      
      // Ensure proper graph declaration
      if (!cleaned.match(/^(graph|mindmap|flowchart)/i)) {
        cleaned = `graph TD\n${cleaned}`;
      }
      
      return cleaned.trim();
    };

    const cleanedMindmap = cleanMermaidResponse(aiResponse);

    // Validate the mindmap has basic structure
    if (!cleanedMindmap || cleanedMindmap.length < 50) {
      console.error("❌ Generated mindmap is too short or empty");
      return res.status(500).json({
        message: "Failed to generate valid mindmap - response was too short",
        topic,
        subtopic
      });
    }

    // Preserve ALL existing content and only replace the mindmap
    const originalContent = { ...existingCache.content };
    
    // Update ONLY the mindmap field, preserve everything else
    existingCache.content = {
      ...originalContent,
      mindmap: cleanedMindmap
    };

    existingCache.markModified('content');
    await existingCache.save();

    console.log("✅ Mermaid mindmap updated in cache for:", subtopic);

    res.status(200).json({
      message: `Mermaid mindmap generated and cache updated for "${subtopic}"`,
      topic,
      subtopic,
      mindmap: cleanedMindmap,
      cacheUpdated: true,
      version: existingCache.version,
      contentPreserved: {
        title: originalContent.title,
        explanation: originalContent.explanation ? 'present' : 'missing',
        keyConcepts: originalContent.keyConcepts ? originalContent.keyConcepts.length : 0,
        coreExample: originalContent.coreExample ? 'present' : 'missing'
      }
    });

  } catch (error) {
    console.error("❌ Error in generateMermaidMapController:", error);
    res.status(500).json({ 
      message: "Failed to generate Mermaid mindmap",
      error: error.message 
    });
  }
};

/**
 * Quick fix endpoint - Just sanitizes existing mindmap without AI regeneration
 */
exports.fixMermaidSyntaxController = async (req, res) => {
  try {
    const userId = req.user._id;
    const { topic, subtopic } = req.body;

    if (!topic || !subtopic) {
      return res.status(400).json({ 
        message: "Topic and subtopic are required." 
      });
    }

    // Find existing cache entry
    const existingCache = await ContentCache.findOne({
      userId,
      topic: topic.toLowerCase(),
      subtopic: subtopic.toLowerCase(),
      isActive: true
    }).sort({ version: -1 });

    if (!existingCache || !existingCache.content) {
      return res.status(404).json({
        message: "No cache content found to fix",
        topic,
        subtopic
      });
    }

    const originalMindmap = existingCache.content.mindmap;
    
    if (!originalMindmap) {
      return res.status(400).json({
        message: "No mindmap found in cache to fix",
        topic,
        subtopic
      });
    }

    console.log("🔧 Fixing existing Mermaid syntax for:", subtopic);

    // Simple cleaning function
    const cleanMermaidSyntax = (mindmap) => {
      if (!mindmap || typeof mindmap !== 'string') return '';
      
      let cleaned = mindmap.trim();
      
      // Remove markdown code blocks
      cleaned = cleaned.replace(/```mermaid\s*/gi, '').replace(/```\s*/gi, '');
      
      // Fix common character issues
      cleaned = cleaned
        .replace(/[–—‑−]/g, '-')
        .replace(/[{}]/g, '')
        .replace(/;/g, '')
        .replace(/[“”]/g, '"')
        .replace(/[‘’]/g, "'");
      
      // Ensure proper graph declaration
      if (!cleaned.match(/^(graph|mindmap|flowchart)/i)) {
        cleaned = `graph TD\n${cleaned}`;
      }
      
      return cleaned.trim();
    };

    const cleanedMindmap = cleanMermaidSyntax(originalMindmap);

    // Update only if it was actually modified
    const wasModified = cleanedMindmap !== originalMindmap;
    
    if (wasModified) {
      existingCache.content.mindmap = cleanedMindmap;
      existingCache.markModified('content');
      await existingCache.save();
    }

    res.status(200).json({
      message: `Mermaid syntax ${wasModified ? 'fixed' : 'verified'} for "${subtopic}"`,
      topic,
      subtopic,
      mindmap: cleanedMindmap,
      cacheUpdated: wasModified,
      version: existingCache.version,
      changes: wasModified ? 'Syntax cleaned and fixed' : 'No changes needed'
    });

  } catch (error) {
    console.error("❌ Error in fixMermaidSyntaxController:", error);
    res.status(500).json({ 
      message: "Failed to fix Mermaid syntax",
      error: error.message 
    });
  }
};