// components/MermaidDiagram.jsx
import { useEffect, useRef, useState } from 'react';
import mermaid from 'mermaid';
import {
  Dialog,
  DialogContent,
  IconButton,
  Box,
  CircularProgress,
  Alert,
  Button,
  useTheme,
  useMediaQuery
} from '@mui/material';
import { ZoomIn, ZoomOut, Close, Fullscreen } from '@mui/icons-material';

const MermaidDiagram = ({ chart }) => {
  const ref = useRef(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [zoomOpen, setZoomOpen] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [renderedSvg, setRenderedSvg] = useState(null);
  
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const isSmallMobile = useMediaQuery(theme.breakpoints.down('sm'));

  // Initialize mermaid with mobile-friendly settings
  useEffect(() => {
    try {
      mermaid.initialize({
        startOnLoad: false,
        theme: 'default',
        securityLevel: 'loose',
        fontFamily: 'Arial, sans-serif',
        flowchart: {
          useMaxWidth: false,
          htmlLabels: true,
          curve: 'basis'
        },
        themeCSS: `
          .mermaid {
            font-size: ${isMobile ? '18px' : '16px'} !important;
          }
          .node rect, .node circle, .node ellipse, .node polygon {
            stroke-width: 2px !important;
          }
          .label {
            font-size: ${isMobile ? '16px' : '14px'} !important;
          }
        `
      });
    } catch (error) {
      console.warn('Mermaid initialization warning:', error);
    }
  }, [isMobile]);

  // Enhanced cleaning function to handle CSS in labels
  const cleanMermaidSyntax = (inputChart) => {
    if (!inputChart) return '';
    
    let cleaned = inputChart.trim();
    
    console.log("=== 🔧 CLEANING PHASE ===");
    console.log("🔧 Original input:", cleaned.substring(0, 200) + "...");
    
    // Remove any markdown code blocks
    cleaned = cleaned.replace(/```mermaid\s*/gi, '').replace(/```\s*/gi, '');
    
    // Fix multiple graph declarations without spaces (graph TDgraph LR -> graph TD)
    cleaned = cleaned.replace(/graph TDgraph/g, 'graph TD');
    cleaned = cleaned.replace(/graph LRgraph/g, 'graph LR');
    cleaned = cleaned.replace(/graph BTgraph/g, 'graph BT');
    cleaned = cleaned.replace(/graph RLgraph/g, 'graph RL');
    
    // Remove duplicate "mermaid" declarations
    cleaned = cleaned.replace(/graph TD\s*\n\s*mermaid\s*\n\s*graph TD/g, 'graph TD');
    cleaned = cleaned.replace(/mermaid\s*\n\s*graph/g, 'graph');
    
    // Fix: Ensure there's only ONE graph declaration at the start
    const lines = cleaned.split('\n');
    let graphDeclarationFound = false;
    const cleanedLines = [];
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      
      if (line.startsWith('graph ') || line.startsWith('flowchart ')) {
        if (!graphDeclarationFound) {
          // Keep the first graph declaration
          cleanedLines.push(line);
          graphDeclarationFound = true;
        }
        // Skip subsequent graph declarations
        continue;
      }
      
      // Remove problematic curly braces from node labels that break parsing
      const fixedLine = line
        // Remove CSS syntax from node labels
        .replace(/\[([^\]]*)\{([^}]*)\}([^\]]*)\]/g, (match, before, css, after) => {
          console.log("🔧 Removing CSS from label:", match);
          return `[${before}${after}]`;
        })
        // Remove standalone curly braces in labels
        .replace(/\{([^}]*)\}/g, '$1')
        // Fix specific pattern: A[Label} -> A[Label]
        .replace(/([A-Z]\[[^\]]*)\}(.*\])/g, '$1$2')
        // Remove any remaining problematic characters
        .replace(/[{}]/g, '');
      
      // Remove semicolons that break parsing
      const noSemicolons = fixedLine.replace(/;/g, '');
      
      cleanedLines.push(noSemicolons);
    }
    
    // If no graph declaration found, add one
    if (!graphDeclarationFound) {
      cleanedLines.unshift('graph TD');
    }
    
    cleaned = cleanedLines.join('\n');
    
    // Fix common character issues
    cleaned = cleaned
      .replace(/[–—‑−]/g, '-')
      .replace(/[“”]/g, '"')
      .replace(/[‘’]/g, "'");
    
    // Ensure proper line breaks for style definitions
    cleaned = cleaned.replace(/(style \w+)/g, '\n$1');
    
    // Final cleanup: Remove consecutive graph declarations
    cleaned = cleaned.replace(/(graph [A-Z]+)\s*\n\s*(graph [A-Z]+)/g, '$1');
    
    console.log("🔧 Final cleaned output:");
    console.log(cleaned.substring(0, 300) + "...");
    console.log("=== 🔧 END CLEANING ===");
    
    return cleaned;
  };

  // Validation function
  const validateSyntax = async (code) => {
    try {
      console.log("=== ✅ VALIDATION PHASE ===");
      console.log("✅ Validating syntax...");
      
      // Try direct validation first
      await mermaid.parse(code);
      console.log("✅ Syntax validation PASSED");
      console.log("=== ✅ END VALIDATION ===");
      return { isValid: true };
    } catch (error) {
      console.log("❌ Syntax validation FAILED:", error.message);
      
      // Try to fix common issues and validate again
      console.log("🔄 Attempting auto-fix...");
      let fixedCode = code;
      
      // Fix: Remove any lines with just "}" or "{"
      fixedCode = fixedCode.split('\n')
        .filter(line => !line.trim().match(/^[{}]$/))
        .join('\n');
      
      // Fix: Ensure proper node syntax
      fixedCode = fixedCode.replace(/([A-Z])\s*\[/g, '$1[');
      
      try {
        await mermaid.parse(fixedCode);
        console.log("✅ Auto-fix validation PASSED");
        console.log("=== ✅ END VALIDATION ===");
        return { isValid: true, fixedCode };
      } catch (fixError) {
        console.log("❌ Auto-fix also failed");
        console.log("=== ✅ END VALIDATION ===");
        return { isValid: false, error: error.message };
      }
    }
  };

  // Enhanced fallback diagram with better sizing for mobile
  const getFallbackDiagram = () => {
    return `graph TD
    A[Main Topic] --> B[Concept 1]
    A --> C[Concept 2]
    B --> B1[Detail 1]
    C --> C1[Detail 2]
    
    style A fill:#e1f5fe,stroke:#333,stroke-width:3px
    style B fill:#f3e5f5,stroke:#333,stroke-width:2px
    style C fill:#e8f5e9,stroke:#333,stroke-width:2px
    style B1 fill:#fff3e0,stroke:#333,stroke-width:1px
    style C1 fill:#fce4ec,stroke:#333,stroke-width:1px`;
  };

  useEffect(() => {
    const renderDiagram = async () => {
      if (!ref.current || !chart) {
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        setError(null);
        
        console.log("=== 🚀 RENDERING START ===");
        console.log("🚀 Initial chart input:", chart);
        
        // Clear previous content
        ref.current.innerHTML = '';
        
        // Clean the syntax
        const cleanedChart = cleanMermaidSyntax(chart);
        
        if (!cleanedChart.trim()) {
          throw new Error('Empty diagram content');
        }

        // Validate syntax first
        const validation = await validateSyntax(cleanedChart);
        
        if (!validation.isValid) {
          console.log("❌ Skipping render due to validation failure");
          throw new Error(`Syntax error: ${validation.error}`);
        }

        // Generate unique ID
        const id = `mermaid-${Math.random().toString(36).slice(2, 11)}`;
        
        let finalSvg;
        let usedFallback = false;

        try {
          console.log("🔄 Attempting to render diagram...");
          // Render the cleaned diagram
          const result = await mermaid.render(id, cleanedChart);
          finalSvg = result.svg;
          console.log("✅ Diagram rendered successfully");
        } catch (renderError) {
          console.warn('❌ Diagram render error:', renderError.message);
          // Use fallback diagram
          console.log("🔄 Trying fallback diagram...");
          const fallbackChart = getFallbackDiagram();
          const fallbackValidation = await validateSyntax(fallbackChart);
          
          if (fallbackValidation.isValid) {
            const result = await mermaid.render(id, fallbackChart);
            finalSvg = result.svg;
            usedFallback = true;
            setError('Original diagram had syntax issues. Showing simplified version.');
            console.log("✅ Fallback diagram rendered successfully");
          } else {
            console.error("❌ Even fallback failed validation");
            throw new Error('Unable to render any diagram');
          }
        }
        
        if (finalSvg) {
          // Create container for SVG
          const svgContainer = document.createElement('div');
          svgContainer.innerHTML = finalSvg;
          svgContainer.style.width = '100%';
          svgContainer.style.textAlign = 'center';
          svgContainer.style.cursor = 'pointer';
          
          // Get the SVG element and style it for better mobile sizing
          const svgElement = svgContainer.querySelector('svg');
          if (svgElement) {
            svgElement.style.maxWidth = '100%';
            svgElement.style.width = '100%';
            svgElement.style.height = 'auto';
            svgElement.style.minHeight = isMobile ? '400px' : '300px'; // Larger on mobile
            svgElement.style.fontSize = isMobile ? '18px' : '16px'; // Larger font on mobile
            
            // Mobile-specific optimizations
            if (isMobile) {
              svgElement.style.overflow = 'visible';
              // Force larger font sizes for labels
              const labels = svgElement.querySelectorAll('.label');
              labels.forEach(label => {
                label.style.fontSize = '16px';
                label.style.fontWeight = '500';
              });
            }
            
            svgElement.onclick = () => setZoomOpen(true);
            
            // Add viewBox if missing for better scaling
            if (!svgElement.getAttribute('viewBox') && svgElement.getAttribute('width') && svgElement.getAttribute('height')) {
              const width = svgElement.getAttribute('width');
              const height = svgElement.getAttribute('height');
              svgElement.setAttribute('viewBox', `0 0 ${width} ${height}`);
              svgElement.removeAttribute('width');
              svgElement.removeAttribute('height');
            }
          }
          
          // Append to container
          ref.current.appendChild(svgContainer);
          
          // Store the rendered SVG for zoom view
          setRenderedSvg(finalSvg);
          
          if (usedFallback) {
            const indicator = document.createElement('div');
            indicator.style.cssText = `
              position: absolute;
              top: 8px;
              right: 8px;
              background: #ff9800;
              color: white;
              padding: 2px 6px;
              border-radius: 4px;
              font-size: 10px;
              font-weight: bold;
              z-index: 10;
            `;
            indicator.textContent = 'SIMPLIFIED';
            svgContainer.style.position = 'relative';
            svgContainer.appendChild(indicator);
          }
        }
        
        console.log("=== 🚀 RENDERING COMPLETE ===");
        setIsLoading(false);
      } catch (renderError) {
        console.error('❌ Final render error:', renderError);
        setError(`Failed to render diagram: ${renderError.message}`);
        setIsLoading(false);
        
        // Show error state
        if (ref.current) {
          ref.current.innerHTML = '';
          const errorDiv = document.createElement('div');
          errorDiv.style.cssText = `
            padding: 40px 20px;
            text-align: center;
            color: #666;
            border: 2px dashed #ff9800;
            border-radius: 8px;
            background: #fff3e0;
            cursor: pointer;
            min-height: ${isMobile ? '300px' : '200px'};
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            font-size: ${isMobile ? '16px' : '14px'};
          `;
          errorDiv.innerHTML = `
            <div style="font-size: ${isMobile ? '64px' : '48px'}; margin-bottom: 16px;">📊</div>
            <p style="margin: 0 0 10px 0; font-weight: bold; color: #f57c00; font-size: ${isMobile ? '18px' : '16px'};">Diagram Preview</p>
            <p style="margin: 0 0 15px 0; text-align: center; font-size: ${isMobile ? '16px' : '14px'};">Unable to render interactive diagram</p>
            <div style="display: inline-flex; align-items: center; gap: 5px; color: #1976d2; font-size: ${isMobile ? '16px' : '14px'}; font-weight: 500;">
              <svg width="${isMobile ? '20' : '16'}" height="${isMobile ? '20' : '16'}" viewBox="0 0 24 24" fill="currentColor">
                <path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z"/>
              </svg>
              View Diagram Code
            </div>
          `;
          errorDiv.onclick = () => setZoomOpen(true);
          ref.current.appendChild(errorDiv);
        }
      }
    };

    renderDiagram();
  }, [chart, isMobile]);

  // Handle zoom in/out
  const handleZoomIn = () => {
    setZoomLevel(prev => Math.min(prev + 0.25, 3));
  };

  const handleZoomOut = () => {
    setZoomLevel(prev => Math.max(prev - 0.25, 0.5));
  };

  const handleResetZoom = () => {
    setZoomLevel(1);
  };

  const handleCloseZoom = () => {
    setZoomOpen(false);
    setZoomLevel(1);
  };

  // Mobile-optimized zoom controls
  const ZoomControls = () => (
    <Box sx={{ 
      position: 'sticky', 
      top: 0, 
      background: 'white', 
      borderBottom: '1px solid #e0e0e0', 
      p: isMobile ? 1 : 2,
      display: 'flex', 
      justifyContent: 'space-between', 
      alignItems: 'center', 
      zIndex: 1 
    }}>
      <Box sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        gap: isMobile ? 0.5 : 1 
      }}>
        <IconButton 
          onClick={handleZoomOut} 
          disabled={zoomLevel <= 0.5}
          size={isMobile ? "medium" : "large"}
        >
          <ZoomOut />
        </IconButton>
        
        <IconButton 
          onClick={handleResetZoom} 
          size={isMobile ? "medium" : "large"}
        >
          <Box
            sx={{
              width: isMobile ? 50 : 60,
              textAlign: 'center',
              fontSize: isMobile ? '13px' : '14px',
              fontWeight: 'bold',
              color: 'primary.main'
            }}
          >
            {Math.round(zoomLevel * 100)}%
          </Box>
        </IconButton>
        
        <IconButton 
          onClick={handleZoomIn} 
          disabled={zoomLevel >= 3}
          size={isMobile ? "medium" : "large"}
        >
          <ZoomIn />
        </IconButton>
      </Box>
      
      <IconButton 
        onClick={handleCloseZoom} 
        size={isMobile ? "medium" : "large"}
      >
        <Close />
      </IconButton>
    </Box>
  );

  // Render zoomed diagram in dialog
  const renderZoomedDiagram = () => {
    return (
      <Dialog
        open={zoomOpen}
        onClose={handleCloseZoom}
        maxWidth="xl"
        fullWidth
        fullScreen={isMobile} // Full screen on mobile
        sx={{
          '& .MuiDialog-paper': {
            background: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(10px)',
            maxHeight: '90vh',
            ...(isMobile && {
              margin: 0,
              maxHeight: '100vh',
              borderRadius: 0
            })
          }
        }}
      >
        <ZoomControls />
        
        <DialogContent
          sx={{
            p: isMobile ? 1 : 3,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            minHeight: isMobile ? 'calc(100vh - 80px)' : '60vh',
            background: '#f8f9fa',
            overflow: 'auto',
            gap: 2
          }}
        >
          {renderedSvg ? (
            <>
              <Box
                sx={{
                  transform: `scale(${zoomLevel})`,
                  transformOrigin: 'center center',
                  transition: 'transform 0.2s ease',
                  background: 'white',
                  borderRadius: '8px',
                  padding: isMobile ? '10px' : '20px',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                  maxWidth: isMobile ? '100%' : '95%',
                  width: isMobile ? '100%' : 'auto',
                  overflow: 'auto',
                  display: 'flex',
                  justifyContent: 'center'
                }}
                dangerouslySetInnerHTML={{ __html: renderedSvg }}
              />
              {error && (
                <Alert severity="warning" sx={{ maxWidth: isMobile ? '100%' : '95%', width: '100%' }}>
                  {error}
                </Alert>
              )}
            </>
          ) : (
            <Box sx={{ textAlign: 'center', width: '100%' }}>
              <Alert severity="info" sx={{ mb: 2 }}>
                Viewing diagram code
              </Alert>
              <Box
                sx={{
                  background: 'white',
                  padding: isMobile ? 2 : 3,
                  borderRadius: 2,
                  boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                  maxHeight: isMobile ? '50vh' : '400px',
                  overflow: 'auto',
                  width: '100%'
                }}
              >
                <h4 style={{ 
                  margin: '0 0 16px 0', 
                  color: '#333',
                  fontSize: isMobile ? '16px' : '18px'
                }}>
                  Diagram Code:
                </h4>
                <pre
                  style={{
                    margin: 0,
                    whiteSpace: 'pre-wrap',
                    fontSize: isMobile ? '11px' : '12px',
                    fontFamily: 'monospace',
                    lineHeight: '1.4',
                    color: '#2e3440',
                    background: '#f8f9fa',
                    padding: isMobile ? '12px' : '16px',
                    borderRadius: '4px',
                    border: '1px solid #e0e0e0'
                  }}
                >
                  {chart}
                </pre>
              </Box>
            </Box>
          )}
        </DialogContent>
      </Dialog>
    );
  };

  if (!chart) return null;

  return (
    <Box className="mermaid-container" sx={{ 
      my: isMobile ? 2 : 3, 
      position: 'relative',
      width: '100%'
    }}>
      <Box
        sx={{
          border: '2px solid',
          borderColor: error ? 'warning.light' : 'transparent',
          borderRadius: 2,
          padding: isMobile ? 2 : 3,
          background: 'white',
          transition: 'all 0.2s ease',
          cursor: 'pointer',
          minHeight: isMobile ? '450px' : '350px', // Taller on mobile
          display: 'flex',
          flexDirection: 'column',
          width: '100%',
          '&:hover': {
            borderColor: error ? 'warning.main' : 'primary.main',
            boxShadow: '0 4px 12px rgba(25, 118, 210, 0.1)'
          }
        }}
        onClick={() => setZoomOpen(true)}
      >
        {isLoading && (
          <Box sx={{ 
            textAlign: 'center', 
            padding: isMobile ? '60px 20px' : '40px', 
            color: '#666', 
            flex: 1, 
            display: 'flex', 
            flexDirection: 'column', 
            justifyContent: 'center', 
            alignItems: 'center' 
          }}>
            <CircularProgress size={isMobile ? 48 : 40} />
            <div style={{ 
              marginTop: '16px', 
              fontSize: isMobile ? '16px' : '14px' 
            }}>
              Rendering diagram...
            </div>
          </Box>
        )}
        
        {error && !isLoading && (
          <Alert 
            severity="warning" 
            sx={{ mb: 2 }}
            action={
              <Button 
                color="inherit" 
                size="small"
                onClick={(e) => {
                  e.stopPropagation();
                  setZoomOpen(true);
                }}
              >
                Details
              </Button>
            }
          >
            {error}
          </Alert>
        )}
        
        <Box 
          ref={ref} 
          sx={{ 
            minHeight: isMobile ? '400px' : '300px',
            flex: 1,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            width: '100%',
            '& > div': {
              width: '100%',
              textAlign: 'center'
            },
            '& svg': {
              maxWidth: '100% !important',
              width: '100% !important',
              height: 'auto !important',
              minHeight: isMobile ? '380px' : '280px',
              fontSize: isMobile ? '18px !important' : '16px !important'
            }
          }} 
        />
        
        {!isLoading && (
          <Box
            sx={{
              textAlign: 'center',
              mt: 2,
              color: error ? 'warning.main' : 'primary.main',
              fontSize: isMobile ? '15px' : '14px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 0.5
            }}
          >
            <Fullscreen fontSize={isMobile ? "medium" : "small"} />
            {error ? 'Click for details' : 'Click to enlarge'}
          </Box>
        )}
      </Box>

      {renderZoomedDiagram()}
    </Box>
  );
};

export default MermaidDiagram;