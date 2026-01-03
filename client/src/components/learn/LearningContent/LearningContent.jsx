import React, { useState, useMemo } from 'react';
import { Box, useTheme, useMediaQuery } from "@mui/material";
import MermaidDiagram from "../MermardDiagram/index";
import WelcomeState from "../WelcomeState/index";
import LoadingState from "../LoadingState";
import Header from "./Header";
import ContentSection from "./ContentSection";
import QuizSection from "./QuizSection";
import { generateMermaidMindmap } from '../../../api/learning';

const LearningContent = ({ 
  content, 
  contentInfo, 
  selectedTopic, 
  selectedSubtopic, 
  contentLoading, 
  onGenerateContent,
  colorPalette,
  userRemainingGenerations = 5
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  // State declarations
  const [mindmapData, setMindmapData] = useState(null);
  const [regeneratingMindmap, setRegeneratingMindmap] = useState(false);
  const [expandedSections, setExpandedSections] = useState({
    concept: true,
    explanation: true,
    learningActions: true,
    examples: true,
    practice: true
  });

  // Handle mindmap regeneration
  const handleManualMindmapRegenerate = async () => {
    if (!selectedTopic || !selectedSubtopic?.name) {
      return;
    }

    try {
      setRegeneratingMindmap(true);
      const response = await generateMermaidMindmap({
        topic: selectedTopic,
        subtopic: selectedSubtopic.name
      });
      
      if (response?.data?.mindmap) {
        setMindmapData(prev => ({
          ...prev,
          mindmap: response.data.mindmap,
          hasError: false
        }));
      }
    } catch (error) {
      console.error('Failed to regenerate mindmap:', error);
      setMindmapData(prev => ({
        ...prev,
        hasError: true
      }));
    } finally {
      setRegeneratingMindmap(false);
    }
  };

  // Safe content access with fallbacks
  const safeContent = useMemo(() => {
    // Use the regenerated mindmap if available, otherwise use the original content
    const currentMindmap = mindmapData?.mindmap || content?.mindmap;
    
    return {
      concept: content?.concept || content?.keyConcepts?.[0] || '',
      explanation: content?.explanation || '',
      learningActions: Array.isArray(content?.learningActions) ? content.learningActions : [],
      examples: Array.isArray(content?.examples) ? content.examples : [],
      practice: content?.practice || '',
      mindmap: currentMindmap,
      quiz: Array.isArray(content?.quiz) ? content.quiz : [],
      title: content?.title || selectedSubtopic?.name || ''
    };
  }, [content, selectedSubtopic, mindmapData]);

  // Initialize mindmap data when content changes
  React.useEffect(() => {
    if (content?.mindmap && !mindmapData) {
      setMindmapData({
        mindmap: content.mindmap,
        hasError: false
      });
    }
  }, [content?.mindmap, mindmapData]);

  // Reset quiz when content changes
  React.useEffect(() => {
    setExpandedSections({
      concept: true,
      explanation: true,
      learningActions: true,
      examples: true,
      practice: true
    });
  }, [content]);

  if (contentLoading) {
    return <LoadingState isContentLoading={true} source={contentInfo?.source} colorPalette={colorPalette} />;
  }

  if (!content && selectedSubtopic) {
    return (
      <WelcomeState 
        subtopicName={selectedSubtopic.name}
        isReady={true}
        onGenerateContent={onGenerateContent}
        colorPalette={colorPalette}
      />
    );
  }

  if (!content || !selectedSubtopic) {
    return <WelcomeState colorPalette={colorPalette} />;
  }

  const toggleSection = (sectionKey) => {
    setExpandedSections(prev => ({
      ...prev,
      [sectionKey]: !prev[sectionKey]
    }));
  };

  return (
    <Box sx={{ 
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden',
      background: 'white',
      '& ::-webkit-scrollbar': {
        width: '6px',
      },
      '& ::-webkit-scrollbar-track': {
        background: colorPalette[50],
        borderRadius: '3px',
      },
      '& ::-webkit-scrollbar-thumb': {
        background: colorPalette[200],
        borderRadius: '3px',
        transition: 'background 0.2s ease',
      },
      '& ::-webkit-scrollbar-thumb:hover': {
        background: colorPalette[300],
      },
      '& *': {
        scrollbarWidth: 'thin',
        scrollbarColor: `${colorPalette[200]} ${colorPalette[50]}`,
      }
    }}>
      {/* Header */}
      <Header 
        title={safeContent.title}
        topic={selectedTopic}
        isMobile={isMobile}
        colorPalette={colorPalette}
      />

      {/* Content */}
      <Box sx={{ 
        flex: 1,
        overflow: 'auto',
        p: isMobile ? 1.5 : 2
      }}>
        {safeContent.concept && (
          <ContentSection
            title="Core Concept"
            content={safeContent.concept}
            emoji="💡"
            isExpanded={expandedSections.concept}
            onToggle={() => toggleSection('concept')}
            isMobile={isMobile}
            colorPalette={colorPalette}
          />
        )}

        {safeContent.explanation && (
          <ContentSection
            title="Detailed Explanation"
            content={safeContent.explanation}
            emoji="📚"
            isExpanded={expandedSections.explanation}
            onToggle={() => toggleSection('explanation')}
            isMobile={isMobile}
            colorPalette={colorPalette}
          />
        )}

        {safeContent.learningActions.length > 0 && (
          <ContentSection
            title="Learning Steps"
            content={safeContent.learningActions}
            emoji="🛣️"
            isList={true}
            isExpanded={expandedSections.learningActions}
            onToggle={() => toggleSection('learningActions')}
            isMobile={isMobile}
            colorPalette={colorPalette}
          />
        )}

        {safeContent.examples.length > 0 && (
          <ContentSection
            title="Examples"
            content={safeContent.examples}
            emoji="💼"
            isList={true}
            isExpanded={expandedSections.examples}
            onToggle={() => toggleSection('examples')}
            isMobile={isMobile}
            colorPalette={colorPalette}
          />
        )}

        {safeContent.practice && (
          <ContentSection
            title="Practice"
            content={safeContent.practice}
            emoji="💪"
            isExpanded={expandedSections.practice}
            onToggle={() => toggleSection('practice')}
            isMobile={isMobile}
            colorPalette={colorPalette}
          />
        )}

        {safeContent.mindmap && (
          <ContentSection.MindmapSection
            isMobile={isMobile}
            colorPalette={colorPalette}
            safeContent={safeContent}
            selectedTopic={selectedTopic}
            selectedSubtopic={selectedSubtopic}
            handleManualMindmapRegenerate={handleManualMindmapRegenerate}
            regeneratingMindmap={regeneratingMindmap}
            userRemainingGenerations={userRemainingGenerations}
            mindmapData={mindmapData}
          />
        )}

        {safeContent.quiz.length > 0 && (
          <QuizSection 
            quizItems={safeContent.quiz}
            selectedTopic={selectedTopic}
            selectedSubtopic={selectedSubtopic}
            isMobile={isMobile}
            colorPalette={colorPalette}
          />
        )}
      </Box>
    </Box>
  );
};

export default LearningContent;