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

module.exports = generateFallbackMindmap