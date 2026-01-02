const User = require("../../models/User");
const ContentCache = require("../../models/Content-cache");
const callAIAPI = require("../../utils/call-AI");
const { buildPrompt } = require("../../utils/build-prompt");
const { generateFallbackMindmap } = require("../../utils/content-utils");

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
        .replace(/[""]/g, '"')
        .replace(/[‘']/g, "'");
      
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
        .replace(/[""]/g, '"')
        .replace(/[‘']/g, "'");
      
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