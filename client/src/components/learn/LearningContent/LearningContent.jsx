import React, { useState, useMemo } from 'react';
import {
  Box,
  useTheme,
  useMediaQuery,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  ToggleButtonGroup,
  ToggleButton,
  Typography,
  Alert,
  IconButton,
} from "@mui/material";
import { Close } from "@mui/icons-material";
import WelcomeState from "../WelcomeState/index";
import LoadingState from "../LoadingState";
import Header from "./Header";
import ContentSection from "./ContentSection";
import QuizSection from "./QuizSection";
import TeachingStyleSelector from "../TeachingStyleSelector";
import {
  generateComponent,
  getComponentVersions,
  getComponentVersion,
} from '../../../api/learning';

const LearningContent = ({ 
  content, 
  contentInfo, 
  selectedTopic, 
  selectedSubtopic, 
  contentLoading, 
  onGenerateContent,
  colorPalette,
  userRemainingGenerations = 5,
  dailyRemaining = 6,
  onDailyRegenUpdate,
  onQuizSubmitted,
  onVersionDialogOpen,
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
    practice: true,
    coreExample: true,
  });
  const [componentOverrides, setComponentOverrides] = useState({});
  const [regeneratingComponents, setRegeneratingComponents] = useState({});
  const [componentVersions, setComponentVersions] = useState({});
  const [selectedVersions, setSelectedVersions] = useState({});
  const [loadingVersions, setLoadingVersions] = useState({});
  const [versionDialogOpen, setVersionDialogOpen] = useState(false);
  const [selectedComponent, setSelectedComponent] = useState("concept");
  const [limitMessage, setLimitMessage] = useState("");
  const [teachingStyleSelectorOpen, setTeachingStyleSelectorOpen] = useState(false);
  const [pendingComponentRegeneration, setPendingComponentRegeneration] = useState(null);
  const dailyLimitReached = dailyRemaining <= 0;

  // Register the open function with parent on mount
  React.useEffect(() => {
    if (typeof onVersionDialogOpen === "function") {
      onVersionDialogOpen(setVersionDialogOpen);
    }
  }, []);

  const getComponentGenerationCount = (componentName) =>
    (componentVersions[componentName] || []).filter(
      (version) => version.source === "component"
    ).length;

  // Handle mindmap regeneration - open teaching style selector first
  const handleManualMindmapRegenerate = () => {
    if (!selectedTopic || !selectedSubtopic?.name) {
      return;
    }

    if (dailyLimitReached) {
      setLimitMessage("Daily regeneration limit reached (max 6 per day)");
      return;
    }

    setPendingComponentRegeneration("mindmap");
    setTeachingStyleSelectorOpen(true);
  };

  // Execute component regeneration with selected teaching style
  const executeComponentRegeneration = async (teachingStyle) => {
    if (!pendingComponentRegeneration) return;

    const componentName = pendingComponentRegeneration;
    
    try {
      if (componentName === "mindmap") {
        setRegeneratingMindmap(true);
      } else {
        setRegeneratingComponents((prev) => ({
          ...prev,
          [componentName]: true,
        }));
      }

      const response = await generateComponent({
        topic: selectedTopic,
        subtopic: selectedSubtopic.name,
        component: componentName,
        teachingStyle: teachingStyle,
      });

      if (componentName === "mindmap") {
        // Handle mindmap response
        if (response?.data?.dailyRemaining !== undefined) {
          onDailyRegenUpdate?.(
            response.data.dailyRemaining,
            response.data.dailyResetAt
          );
        } else {
          onDailyRegenUpdate?.();
        }
        
        if (response?.data?.mindmap) {
          setMindmapData(prev => ({
            ...prev,
            mindmap: response.data.mindmap,
            hasError: false
          }));
        }
      } else {
        // Handle regular component response
        await handleComponentRegenerationResponse(componentName, response);
      }

      // Close teaching style selector modal
      setTeachingStyleSelectorOpen(false);
    } catch (error) {
      console.error(`Failed to regenerate ${componentName}:`, error);
      if (typeof error.response?.data?.dailyRemaining === "number") {
        onDailyRegenUpdate?.(
          error.response.data.dailyRemaining,
          error.response.data.dailyResetAt
        );
      }
      if (error.response?.status === 429) {
        setLimitMessage(
          error.response?.data?.message ||
            "Daily regeneration limit reached (max 6 per day)"
        );
      }
      if (componentName === "mindmap") {
        setMindmapData(prev => ({
          ...prev,
          hasError: true
        }));
      }
      // Close teaching style selector modal on error too
      setTeachingStyleSelectorOpen(false);
    } finally {
      if (componentName === "mindmap") {
        setRegeneratingMindmap(false);
      }
      setPendingComponentRegeneration(null);
    }
  };

  const handleComponentRegenerate = (componentName) => {
    if (!selectedTopic || !selectedSubtopic?.name) {
      return;
    }

    if (dailyLimitReached) {
      setLimitMessage("Daily regeneration limit reached (max 6 per day)");
      return;
    }

    if (getComponentGenerationCount(componentName) >= 3) {
      setLimitMessage("Generation limit reached (max 3)");
      return;
    }

    setPendingComponentRegeneration(componentName);
    setTeachingStyleSelectorOpen(true);
  };

  // Handle component regeneration response
  const handleComponentRegenerationResponse = async (componentName, response) => {
    try {

      if (response?.data?.dailyRemaining !== undefined) {
        onDailyRegenUpdate?.(
          response.data.dailyRemaining,
          response.data.dailyResetAt
        );
      } else {
        onDailyRegenUpdate?.();
      }

      const newValue = response?.data?.[componentName];
      if (newValue !== undefined) {
        setComponentOverrides((prev) => ({
          ...prev,
          [componentName]: newValue,
        }));
      }

      setLimitMessage("");

      await loadComponentVersions(componentName);

    } catch (error) {
      console.error(`Failed to regenerate ${componentName}:`, error);
      if (typeof error.response?.data?.dailyRemaining === "number") {
        onDailyRegenUpdate?.(
          error.response.data.dailyRemaining,
          error.response.data.dailyResetAt
        );
      }
      if (error.response?.status === 429) {
        setLimitMessage(
          error.response?.data?.message ||
            "Daily regeneration limit reached (max 6 per day)"
        );
      }
    } finally {
      setRegeneratingComponents((prev) => ({
        ...prev,
        [componentName]: false,
      }));
    }
  };

  const loadComponentVersions = async (componentName) => {
    if (!selectedTopic || !selectedSubtopic?.name) {
      return;
    }

    try {
      setLoadingVersions((prev) => ({
        ...prev,
        [componentName]: true,
      }));
      const response = await getComponentVersions({
        topic: selectedTopic,
        subtopic: selectedSubtopic.name,
        component: componentName,
      });

      const versions = response?.data?.versions || [];
      setComponentVersions((prev) => ({
        ...prev,
        [componentName]: versions,
      }));

      setSelectedVersions((prev) => ({
        ...prev,
        [componentName]: versions.length > 0 ? versions[0].version : null,
      }));
    } catch (error) {
      setComponentVersions((prev) => ({
        ...prev,
        [componentName]: [],
      }));
      setSelectedVersions((prev) => ({
        ...prev,
        [componentName]: null,
      }));
    } finally {
      setLoadingVersions((prev) => ({
        ...prev,
        [componentName]: false,
      }));
    }
  };

  const handleComponentVersionSelect = async (componentName, versionNumber) => {
    if (!selectedTopic || !selectedSubtopic?.name) {
      return;
    }

    try {
      console.log(
        `[UI] Toggle version: ${componentName} -> v${versionNumber} (${selectedTopic} / ${selectedSubtopic.name})`
      );
      setSelectedVersions((prev) => ({
        ...prev,
        [componentName]: versionNumber,
      }));

      const response = await getComponentVersion({
        topic: selectedTopic,
        subtopic: selectedSubtopic.name,
        component: componentName,
        versionNumber,
      });

      const versionData = response?.data?.data;
      if (versionData !== undefined) {
        if (componentName === "mindmap") {
          setMindmapData({ mindmap: versionData, hasError: false });
        } else {
          setComponentOverrides((prev) => ({
            ...prev,
            [componentName]: versionData,
          }));
        }
      }
    } catch (error) {
      console.error(`Failed to load ${componentName} version:`, error);
    }
  };


  const safeContent = useMemo(() => {
  // Use the regenerated mindmap if available, otherwise use the original content
  const currentMindmap = mindmapData?.mindmap || content?.mindmap;
  
  return {
    concept:
      componentOverrides.concept ??
      (content?.concept || content?.keyConcepts?.[0] || ''),
    explanation:
      componentOverrides.explanation ?? (content?.explanation || ''),
    coreExample:
      componentOverrides.coreExample ?? (content?.coreExample || ''),
    learningActions: Array.isArray(componentOverrides.learningActions)
      ? componentOverrides.learningActions
      : Array.isArray(content?.learningActions)
      ? content.learningActions
      : [],
    examples: Array.isArray(componentOverrides.examples)
      ? componentOverrides.examples
      : Array.isArray(content?.examples)
      ? content.examples
      : [],
    practice: componentOverrides.practice ?? (content?.practice || ''),
    mindmap: currentMindmap,
    quiz: Array.isArray(componentOverrides.quiz)
      ? componentOverrides.quiz
      : Array.isArray(content?.quiz)
      ? content.quiz
      : [],
    title:
      componentOverrides.title ??
      (content?.title || selectedSubtopic?.name || '')
  };
}, [content, selectedSubtopic, mindmapData, componentOverrides]);

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
    setMindmapData(null);
    setComponentOverrides({});
    setComponentVersions({});
    setSelectedVersions({});
    setLimitMessage("");
    setExpandedSections({
      concept: true,
      explanation: true,
      learningActions: true,
      examples: true,
      coreExample: true,
      practice: true,
    });
  }, [content]);

  React.useEffect(() => {
    if (!selectedTopic || !selectedSubtopic?.name) {
      return;
    }

    let isMounted = true;
    const componentKeys = [
      "concept",
      "explanation",
      "learningActions",
      "coreExample",
      "practice",
      "quiz",
      "mindmap",
    ];

    const loadVersions = async () => {
      await Promise.all(
        componentKeys.map(async (componentName) => {
          if (!isMounted) return;
          await loadComponentVersions(componentName);
        })
      );
    };

    loadVersions();

    return () => {
      isMounted = false;
    };
  }, [selectedTopic, selectedSubtopic]);

  const componentOptions = [
    { value: "concept", label: "Core Concept" },
    { value: "explanation", label: "Detailed Explanation" },
    { value: "learningActions", label: "Learning Steps" },
    { value: "coreExample", label: "Example" },
    { value: "practice", label: "Practice" },
    { value: "quiz", label: "Quiz" },
    { value: "mindmap", label: "Mind Map" },
  ];

  const dialogVersions = componentVersions[selectedComponent] || [];
  const dialogSelectedVersion = selectedVersions[selectedComponent] ?? null;
  const dialogVersionCount = getComponentGenerationCount(selectedComponent);
  const dialogCachedCount = dialogVersions.length;

  const handleDialogComponentChange = async (nextComponent) => {
    setSelectedComponent(nextComponent);
    await loadComponentVersions(nextComponent);
  };

  React.useEffect(() => {
    if (!versionDialogOpen) {
      return;
    }

    loadComponentVersions(selectedComponent);
  }, [versionDialogOpen, selectedComponent]);

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
      bgcolor: 'background.paper',
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

      <Dialog
        open={versionDialogOpen}
        onClose={() => setVersionDialogOpen(false)}
        fullWidth
        maxWidth="xs"
        PaperProps={{
          sx: {
            borderRadius: 3,
            background: (theme) =>
              theme.palette.mode === "dark"
                ? `linear-gradient(135deg, ${colorPalette[900]} 0%, ${theme.palette.background.paper} 100%)`
                : `linear-gradient(135deg, ${colorPalette[50]} 0%, #ffffff 100%)`,
            boxShadow: (theme) =>
              theme.palette.mode === "dark"
                ? "0 20px 60px rgba(0, 0, 0, 0.5)"
                : "0 20px 60px rgba(0, 0, 0, 0.12)",
            border: "1px solid",
            borderColor: "divider",
            overflow: "hidden",
          },
        }}
      >
        <DialogTitle
          sx={{
            p: 2,
            background: `linear-gradient(135deg, ${
              colorPalette[600]
            } 0%, ${colorPalette[700]} 100%)`,
            color: "white",
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 1,
            }}
          >
            <Typography variant="subtitle1" fontWeight={700}>
              Content Versions
            </Typography>
            <IconButton
              onClick={() => setVersionDialogOpen(false)}
              size="small"
              sx={{
                color: "white",
                background: "rgba(255, 255, 255, 0.15)",
                "&:hover": { background: "rgba(255, 255, 255, 0.25)" },
              }}
            >
              <Close sx={{ fontSize: 16 }} />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent
          dividers
          sx={{
            background: (theme) =>
              theme.palette.mode === "dark"
                ? theme.palette.background.default
                : colorPalette[50],
          }}
        >
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Pick a cached version to preview. Regeneration stays on the
              section buttons.
            </Typography>
          <FormControl fullWidth size="small" sx={{ mb: 2 }}>
            <InputLabel id="component-select-label">Component</InputLabel>
            <Select
              labelId="component-select-label"
              value={selectedComponent}
              label="Component"
              onChange={(e) => handleDialogComponentChange(e.target.value)}
            >
              {componentOptions.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <Box sx={{ mb: 2 }}>
            <Typography variant="caption" color="text.secondary">
              Versions
            </Typography>
            {loadingVersions[selectedComponent] ? (
              <Box
                sx={{
                  mt: 1,
                  p: 2,
                  borderRadius: 1,
                  border: "1px dashed",
                  borderColor: "divider",
                  color: "text.secondary",
                  background: (theme) =>
                    theme.palette.mode === "dark"
                      ? theme.palette.background.paper
                      : colorPalette[50],
                  fontSize: isMobile ? "0.75rem" : "0.85rem",
                }}
              >
                Checking versions...
              </Box>
            ) : dialogVersions.length === 0 ? (
              <Box
                sx={{
                  mt: 1,
                  p: 2,
                  borderRadius: 1,
                  border: "1px dashed",
                  borderColor: "divider",
                  color: "text.secondary",
                  background: (theme) =>
                    theme.palette.mode === "dark"
                      ? theme.palette.background.paper
                      : colorPalette[50],
                  fontSize: isMobile ? "0.75rem" : "0.85rem",
                }}
              >
                No available versions yet. Generate or regenerate this
                component first.
              </Box>
            ) : (
              <ToggleButtonGroup
                size="small"
                exclusive
                value={dialogSelectedVersion}
                onChange={(e, nextValue) => {
                  if (nextValue !== null) {
                    handleComponentVersionSelect(selectedComponent, nextValue);
                  }
                }}
                sx={{
                  mt: 1,
                  display: "flex",
                  flexWrap: "wrap",
                  gap: 1,
                  "& .MuiToggleButton-root": {
                    borderRadius: 2,
                    border: `1px solid ${colorPalette[300]}`,
                    color: theme.palette.mode === "dark"
                      ? theme.palette.text.primary
                      : colorPalette[700],
                    fontWeight: 600,
                    textTransform: "none",
                    px: 1.5,
                    py: 0.6,
                    bgcolor: (theme) => theme.palette.background.paper,
                    transition: "all 0.2s ease",
                  },
                  "& .MuiToggleButton-root:hover": {
                    background: (theme) => theme.palette.action.hover,
                    borderColor: colorPalette[500],
                  },
                  "& .MuiToggleButton-root.Mui-selected": {
                    background: colorPalette[600],
                    color: "white",
                    borderColor: colorPalette[600],
                    boxShadow: "0 8px 20px rgba(124, 58, 237, 0.25)",
                  },
                  "& .MuiToggleButton-root.Mui-selected:hover": {
                    background: colorPalette[700],
                  },
                }}
              >
                {dialogVersions.map((option) => {
                  const isSelected =
                    dialogSelectedVersion === option.version;

                  return (
                    <ToggleButton key={option.version} value={option.version}>
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: 0.75,
                        }}
                      >
                        <Box component="span">
                          V{option.displayVersion ?? option.version}
                        </Box>
                        {isSelected && (
                          <Box
                            component="span"
                            sx={{
                              fontSize: "0.65rem",
                              fontWeight: 700,
                              px: 0.75,
                              py: 0.2,
                              borderRadius: 999,
                              background: "rgba(255, 255, 255, 0.2)",
                              border: "1px solid rgba(255, 255, 255, 0.35)",
                            }}
                          >
                            Current
                          </Box>
                        )}
                      </Box>
                    </ToggleButton>
                  );
                })}
              </ToggleButtonGroup>
            )}
          </Box>
          <Box sx={{ mt: 2 }}>
            <Typography variant="caption" color="text.secondary">
              Component generations: {dialogVersionCount}/3 · Cached versions: {dialogCachedCount}
            </Typography>
          </Box>

        </DialogContent>
        <DialogActions sx={{ px: 2, pb: 2 }}>
          <Button
            onClick={() => setVersionDialogOpen(false)}
            variant="outlined"
            sx={{
              borderColor: colorPalette[400],
              color: colorPalette[600],
              "&:hover": {
                borderColor: colorPalette[500],
                background: (theme) =>
                  theme.palette.mode === "dark"
                    ? theme.palette.action.hover
                    : colorPalette[50],
              },
            }}
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>

      {/* Teaching Style Selector Modal */}
      <TeachingStyleSelector
        open={teachingStyleSelectorOpen}
        onClose={() => setTeachingStyleSelectorOpen(false)}
        onSelect={executeComponentRegeneration}
        isLoading={pendingComponentRegeneration && (
          pendingComponentRegeneration === "mindmap" 
            ? regeneratingMindmap 
            : regeneratingComponents[pendingComponentRegeneration]
        )}
      />

      {/* Content */}
      <Box sx={{ 
        flex: 1,
        overflow: 'auto',
        p: isMobile ? 1.5 : 2
      }}>
        {limitMessage && (
          <Alert severity="warning" onClose={() => setLimitMessage("")} sx={{ mb: 2 }}>
            {limitMessage}
          </Alert>
        )}
        {safeContent.concept && (
          <ContentSection
            title="Core Concept"
            content={safeContent.concept}
            emoji="💡"
            isExpanded={expandedSections.concept}
            onToggle={() => toggleSection('concept')}
            onRegenerate={() => handleComponentRegenerate("concept")}
            isRegenerating={!!regeneratingComponents.concept}
            isRegenerateDisabled={
              getComponentGenerationCount("concept") >= 3 || dailyLimitReached
            }
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
            onRegenerate={() => handleComponentRegenerate("explanation")}
            isRegenerating={!!regeneratingComponents.explanation}
            isRegenerateDisabled={
              getComponentGenerationCount("explanation") >= 3 ||
              dailyLimitReached
            }
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
            onRegenerate={() => handleComponentRegenerate("learningActions")}
            isRegenerating={!!regeneratingComponents.learningActions}
            isRegenerateDisabled={
              getComponentGenerationCount("learningActions") >= 3 ||
              dailyLimitReached
            }
            isMobile={isMobile}
            colorPalette={colorPalette}
          />
        )}

      {safeContent.coreExample && (
  <ContentSection
    title="Example"
    content={safeContent.coreExample}
    emoji="📝"
    isExpanded={expandedSections.coreExample ?? true}
    onToggle={() => toggleSection('coreExample')}
    onRegenerate={() => handleComponentRegenerate("coreExample")}
    isRegenerating={!!regeneratingComponents.coreExample}
    isRegenerateDisabled={
      getComponentGenerationCount("coreExample") >= 3 || dailyLimitReached
    }
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
            onRegenerate={() => handleComponentRegenerate("practice")}
            isRegenerating={!!regeneratingComponents.practice}
            isRegenerateDisabled={
              getComponentGenerationCount("practice") >= 3 || dailyLimitReached
            }
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
            userRemainingGenerations={Math.max(
              0,
              Math.min(
                3 - getComponentGenerationCount("mindmap"),
                dailyRemaining
              )
            )}
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
            onRegenerate={() => handleComponentRegenerate("quiz")}
            isRegenerating={!!regeneratingComponents.quiz}
            isRegenerateDisabled={
              getComponentGenerationCount("quiz") >= 3 || dailyLimitReached
            }
            onQuizSubmitted={onQuizSubmitted}
          />
        )}
      </Box>
    </Box>
  );
};

export default LearningContent;