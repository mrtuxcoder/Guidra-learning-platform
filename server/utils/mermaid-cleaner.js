// utils/mermaidSanitizer.js

/**
 * Cleans Mermaid syntax from an object property
 * @param {Object} contentObject - Object containing mindmap/flowchart property
 * @param {string} propertyName - Property name (default: 'mindmap')
 * @param {string} preferredType - Diagram type ('auto', 'flowchart', 'mindmap')
 * @returns {Object} Modified object with cleaned diagram
 */
export const cleanMermaidInObject = (contentObject, propertyName = 'mindmap', preferredType = 'auto') => {
  if (!contentObject || typeof contentObject !== 'object') {
    console.warn('Invalid content object provided');
    return contentObject;
  }

  // Create a copy to avoid mutating the original
  const cleanedObject = { ...contentObject };
  
  if (!cleanedObject[propertyName] || typeof cleanedObject[propertyName] !== 'string') {
    console.warn(`Property "${propertyName}" not found or not a string`);
    return cleanedObject;
  }

  const rawDiagram = cleanedObject[propertyName];
  const cleaningResult = cleanMermaidSyntax(rawDiagram, preferredType);
  
  // Update the property with cleaned code
  cleanedObject[propertyName] = cleaningResult.cleanedCode;
  
  // Add metadata if needed
  cleanedObject._diagramMeta = {
    originalType: detectDiagramType(rawDiagram),
    cleanedType: cleaningResult.diagramType,
    warnings: cleaningResult.warnings,
    wasModified: cleaningResult.warnings.length > 0
  };

  return cleanedObject;
};

/**
 * Core Mermaid syntax cleaning function
 */
const cleanMermaidSyntax = (input, preferredType = 'auto') => {
  if (!input || typeof input !== 'string') {
    return {
      cleanedCode: '',
      diagramType: 'flowchart',
      warnings: ['Empty or invalid input']
    };
  }

  let cleaned = input.trim();
  const warnings = [];

  // Detect diagram type
  let diagramType = detectDiagramType(cleaned, preferredType);
  
  // Basic sanitization
  cleaned = basicSanitization(cleaned, warnings);
  
  // Type-specific cleaning
  cleaned = applyTypeSpecificCleaning(cleaned, diagramType, warnings);
  
  // Final cleanup
  cleaned = finalCleanup(cleaned);

  return {
    cleanedCode: cleaned,
    diagramType,
    warnings
  };
};

// Detection function
const detectDiagramType = (code, preferredType) => {
  if (preferredType !== 'auto') return preferredType;

  const firstLine = code.split('\n')[0].toLowerCase().trim();
  
  if (firstLine.includes('mindmap')) return 'mindmap';
  if (firstLine.includes('graph')) return 'flowchart';
  if (firstLine.includes('sequence')) return 'sequence';
  
  // Default based on content structure
  if (code.includes('-->') || code.includes('->')) return 'flowchart';
  if (code.includes('root') || code.includes('(( ))')) return 'mindmap';
  
  return 'flowchart';
};

// Basic sanitization
const basicSanitization = (code, warnings) => {
  let cleaned = code;

  // Remove markdown code blocks
  cleaned = cleaned.replace(/```mermaid\s*/gi, '').replace(/```\s*/gi, '');
  
  // Fix common character issues
  cleaned = cleaned
    .replace(/[–—‑−]/g, '-')
    .replace(/[“”]/g, '"')
    .replace(/[‘’]/g, "'")
    .replace(/[\u200B-\u200D\uFEFF]/g, '')
    .replace(/…/g, '...')
    .replace(/\s+/g, ' ')
    .replace(/^mind map/gi, 'mindmap')
    .replace(/^flowchart/gi, 'graph');

  // Fix common syntax errors in your specific case
  cleaned = cleaned
    .replace(/:nth-child\(\)/g, ':nth-child')
    .replace(/!important/g, 'important')
    .replace(/Pseudo‑class/g, 'Pseudo-class')
    .replace(/\[Descendant \(space\)\]/g, '[Descendant space]')
    .replace(/\[([^\]]*)\(([^)]*)\)([^\]]*)\]/g, (match, before, content, after) => {
      warnings.push('Fixed parentheses in node label');
      return `[${before}${content.replace(/\(/g, '[').replace(/\)/g, ']')}${after}]`;
    });

  return cleaned;
};

// Type-specific cleaning
const applyTypeSpecificCleaning = (code, diagramType, warnings) => {
  let cleaned = code;

  switch (diagramType) {
    case 'flowchart':
      cleaned = cleanFlowchartSyntax(cleaned, warnings);
      break;
    case 'mindmap':
      cleaned = cleanMindmapSyntax(cleaned, warnings);
      break;
    default:
      // For other types, do basic cleaning
      break;
  }

  return cleaned;
};

// Flowchart specific cleaning
const cleanFlowchartSyntax = (code, warnings) => {
  let cleaned = code;
  
  // Ensure proper graph declaration
  if (!cleaned.match(/^graph TD|TB|BT|RL|LR/)) {
    if (cleaned.match(/^[A-Z]\[/)) {
      cleaned = 'graph TD\n' + cleaned;
      warnings.push('Added missing graph declaration');
    }
  }
  
  // Fix arrow syntax
  cleaned = cleaned.replace(/([A-Za-z0-9])\s*-->\s*([A-Za-z0-9])/g, '$1 --> $2');
  
  // Remove duplicate node definitions
  const lines = cleaned.split('\n');
  const nodeIds = new Set();
  const cleanedLines = [];
  
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) continue;
    
    // Extract node ID
    const nodeMatch = trimmed.match(/^(\w+)\[/);
    if (nodeMatch && nodeIds.has(nodeMatch[1])) {
      warnings.push(`Removed duplicate node: ${nodeMatch[1]}`);
      continue;
    }
    
    if (nodeMatch) nodeIds.add(nodeMatch[1]);
    cleanedLines.push(trimmed);
  }
  
  return cleanedLines.join('\n');
};

// Mindmap specific cleaning
const cleanMindmapSyntax = (code, warnings) => {
  let cleaned = code;
  
  // Ensure proper mindmap declaration
  if (!cleaned.match(/^mindmap/)) {
    if (cleaned.includes('root') || cleaned.includes('((')) {
      cleaned = 'mindmap\n' + cleaned;
      warnings.push('Added missing mindmap declaration');
    }
  }
  
  return cleaned;
};

// Final cleanup
const finalCleanup = (code) => {
  return code
    .split('\n')
    .map(line => line.trim())
    .filter(line => line.length > 0)
    .join('\n')
    .trim();
};



cleanMermaidInObject()