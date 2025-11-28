
// import { useEffect, useRef, useState } from 'react';
// import mermaid from 'mermaid';
// import {
//   Dialog,
//   DialogContent,
//   IconButton,
//   Box,
//   CircularProgress,
//   Alert,
//   Button,
//   useTheme,
//   useMediaQuery,
//   Typography,
//   Chip
// } from '@mui/material';
// import { 
//   ZoomIn, 
//   ZoomOut, 
//   Close, 
//   Fullscreen, 
//   RotateRight,
//   Code,
//   Warning
// } from '@mui/icons-material';

// const MermaidDiagram = ({ chart, colorPalette = {} }) => {
//   const ref = useRef(null);
//   const [error, setError] = useState(null);
//   const [isLoading, setIsLoading] = useState(true);
//   const [zoomOpen, setZoomOpen] = useState(false);
//   const [zoomLevel, setZoomLevel] = useState(1);
//   const [renderedSvg, setRenderedSvg] = useState(null);
//   const [isRotated, setIsRotated] = useState(false);
//   const [showCode, setShowCode] = useState(false);
  
//   const theme = useTheme();
//   const isMobile = useMediaQuery(theme.breakpoints.down('md'));
//   const isSmallMobile = useMediaQuery(theme.breakpoints.down('sm'));

//   // Default color palette if not provided
//   const colors = colorPalette || {
//     50: '#FAF7FE',
//     100: '#F3E8FF',
//     200: '#E9D5FF',
//     300: '#D8B4FE',
//     400: '#C084FC',
//     500: '#A855F7',
//     600: '#9333EA',
//     700: '#7C3AED',
//     800: '#6B21A8',
//     900: '#581C87'
//   };

//   // Initialize mermaid with mobile-friendly settings
//   useEffect(() => {
//     try {
//       mermaid.initialize({
//         startOnLoad: false,
//         theme: 'default',
//         securityLevel: 'loose',
//         fontFamily: 'Arial, sans-serif',
//         flowchart: {
//           useMaxWidth: false,
//           htmlLabels: true,
//           curve: 'basis'
//         },
//         themeCSS: `
//           .mermaid {
//             font-size: ${isMobile ? '18px' : '16px'} !important;
//             background: white;
//           }
//           .node rect, .node circle, .node ellipse, .node polygon {
//             stroke-width: 2px !important;
//             stroke: ${colors[600]} !important;
//           }
//           .edgePath .path {
//             stroke: ${colors[500]} !important;
//             stroke-width: 2px !important;
//           }
//           .label {
//             font-size: ${isMobile ? '16px' : '14px'} !important;
//             font-family: Arial, sans-serif !important;
//           }
//           .cluster rect {
//             fill: ${colors[50]} !important;
//             stroke: ${colors[300]} !important;
//             stroke-width: 2px !important;
//           }
//         `
//       });
//     } catch (error) {
//       console.warn('Mermaid initialization warning:', error);
//     }
//   }, [isMobile, colors]);

//   // Existing cleaning function
//   const cleanMermaidSyntax = (inputChart) => {
//     if (!inputChart) return '';
    
//     let cleaned = inputChart.trim();
    
//     console.log("=== 🔧 CLEANING PHASE ===");
//     console.log("🔧 Original input:", cleaned.substring(0, 200) + "...");
    
//     // Remove any markdown code blocks
//     cleaned = cleaned.replace(/```mermaid\s*/gi, '').replace(/```\s*/gi, '');
    
//     // Fix multiple graph declarations without spaces (graph TDgraph LR -> graph TD)
//     cleaned = cleaned.replace(/graph TDgraph/g, 'graph TD');
//     cleaned = cleaned.replace(/graph LRgraph/g, 'graph LR');
//     cleaned = cleaned.replace(/graph BTgraph/g, 'graph BT');
//     cleaned = cleaned.replace(/graph RLgraph/g, 'graph RL');
    
//     // Remove duplicate "mermaid" declarations
//     cleaned = cleaned.replace(/graph TD\s*\n\s*mermaid\s*\n\s*graph TD/g, 'graph TD');
//     cleaned = cleaned.replace(/mermaid\s*\n\s*graph/g, 'graph');
    
//     // Fix: Ensure there's only ONE graph declaration at the start
//     const lines = cleaned.split('\n');
//     let graphDeclarationFound = false;
//     const cleanedLines = [];
    
//     for (let i = 0; i < lines.length; i++) {
//       const line = lines[i].trim();
      
//       if (line.startsWith('graph ') || line.startsWith('flowchart ')) {
//         if (!graphDeclarationFound) {
//           // Keep the first graph declaration
//           cleanedLines.push(line);
//           graphDeclarationFound = true;
//         }
//         // Skip subsequent graph declarations
//         continue;
//       }
      
//       // Remove problematic curly braces from node labels that break parsing
//       const fixedLine = line
//         // Remove CSS syntax from node labels
//         .replace(/\[([^\]]*)\{([^}]*)\}([^\]]*)\]/g, (match, before, css, after) => {
//           console.log("🔧 Removing CSS from label:", match);
//           return `[${before}${after}]`;
//         })
//         // Remove standalone curly braces in labels
//         .replace(/\{([^}]*)\}/g, '$1')
//         // Fix specific pattern: A[Label} -> A[Label]
//         .replace(/([A-Z]\[[^\]]*)\}(.*\])/g, '$1$2')
//         // Remove any remaining problematic characters
//         .replace(/[{}]/g, '');
      
//       // Remove semicolons that break parsing
//       const noSemicolons = fixedLine.replace(/;/g, '');
      
//       cleanedLines.push(noSemicolons);
//     }
    
//     // If no graph declaration found, add one
//     if (!graphDeclarationFound) {
//       cleanedLines.unshift('graph TD');
//     }
    
//     cleaned = cleanedLines.join('\n');
    
//     // Fix common character issues
//     cleaned = cleaned
//       .replace(/[–—‑−]/g, '-')
//       .replace(/[“”]/g, '"')
//       .replace(/[‘’]/g, "'");
    
//     // Ensure proper line breaks for style definitions
//     cleaned = cleaned.replace(/(style \w+)/g, '\n$1');
    
//     // Final cleanup: Remove consecutive graph declarations
//     cleaned = cleaned.replace(/(graph [A-Z]+)\s*\n\s*(graph [A-Z]+)/g, '$1');
    
//     console.log("🔧 Final cleaned output:");
//     console.log(cleaned.substring(0, 300) + "...");
//     console.log("=== 🔧 END CLEANING ===");
    
//     return cleaned;
//   };

//   // Existing validation function
//   const validateSyntax = async (code) => {
//     try {
//       console.log("=== ✅ VALIDATION PHASE ===");
//       console.log("✅ Validating syntax...");
      
//       // Try direct validation first
//       await mermaid.parse(code);
//       console.log("✅ Syntax validation PASSED");
//       console.log("=== ✅ END VALIDATION ===");
//       return { isValid: true };
//     } catch (error) {
//       console.log("❌ Syntax validation FAILED:", error.message);
      
//       // Try to fix common issues and validate again
//       console.log("🔄 Attempting auto-fix...");
//       let fixedCode = code;
      
//       // Fix: Remove any lines with just "}" or "{"
//       fixedCode = fixedCode.split('\n')
//         .filter(line => !line.trim().match(/^[{}]$/))
//         .join('\n');
      
//       // Fix: Ensure proper node syntax
//       fixedCode = fixedCode.replace(/([A-Z])\s*\[/g, '$1[');
      
//       try {
//         await mermaid.parse(fixedCode);
//         console.log("✅ Auto-fix validation PASSED");
//         console.log("=== ✅ END VALIDATION ===");
//         return { isValid: true, fixedCode };
//       } catch (fixError) {
//         console.log("❌ Auto-fix also failed");
//         console.log("=== ✅ END VALIDATION ===");
//         return { isValid: false, error: error.message };
//       }
//     }
//   };

//   // Existing fallback diagram
//   const getFallbackDiagram = () => {
//     return `graph TD
//     A[Main Topic] --> B[Concept 1]
//     A --> C[Concept 2]
//     B --> B1[Detail 1]
//     C --> C1[Detail 2]
    
//     style A fill:#e1f5fe,stroke:#333,stroke-width:3px
//     style B fill:#f3e5f5,stroke:#333,stroke-width:2px
//     style C fill:#e8f5e9,stroke:#333,stroke-width:2px
//     style B1 fill:#fff3e0,stroke:#333,stroke-width:1px
//     style C1 fill:#fce4ec,stroke:#333,stroke-width:1px`;
//   };

//   // Render function
//   useEffect(() => {
//     const renderDiagram = async () => {
//       if (!ref.current || !chart) {
//         setIsLoading(false);
//         return;
//       }

//       try {
//         setIsLoading(true);
//         setError(null);
        
//         console.log("=== 🚀 RENDERING START ===");
//         console.log("🚀 Initial chart input:", chart);
        
//         // Clear previous content
//         ref.current.innerHTML = '';
        
//         // Clean the syntax
//         const cleanedChart = cleanMermaidSyntax(chart);
        
//         if (!cleanedChart.trim()) {
//           throw new Error('Empty diagram content');
//         }

//         // Validate syntax first
//         const validation = await validateSyntax(cleanedChart);
        
//         if (!validation.isValid) {
//           console.log("❌ Skipping render due to validation failure");
//           throw new Error(`Syntax error: ${validation.error}`);
//         }

//         // Generate unique ID
//         const id = `mermaid-${Math.random().toString(36).slice(2, 11)}`;
        
//         let finalSvg;
//         let usedFallback = false;

//         try {
//           console.log("🔄 Attempting to render diagram...");
//           // Render the cleaned diagram
//           const result = await mermaid.render(id, cleanedChart);
//           finalSvg = result.svg;
//           console.log("✅ Diagram rendered successfully");
//         } catch (renderError) {
//           console.warn('❌ Diagram render error:', renderError.message);
//           // Use fallback diagram
//           console.log("🔄 Trying fallback diagram...");
//           const fallbackChart = getFallbackDiagram();
//           const fallbackValidation = await validateSyntax(fallbackChart);
          
//           if (fallbackValidation.isValid) {
//             const result = await mermaid.render(id, fallbackChart);
//             finalSvg = result.svg;
//             usedFallback = true;
//             setError('Original diagram had syntax issues. Showing simplified version.');
//             console.log("✅ Fallback diagram rendered successfully");
//           } else {
//             console.error("❌ Even fallback failed validation");
//             throw new Error('Unable to render any diagram');
//           }
//         }
        
//         if (finalSvg) {
//           // Create container for SVG
//           const svgContainer = document.createElement('div');
//           svgContainer.innerHTML = finalSvg;
//           svgContainer.style.width = '100%';
//           svgContainer.style.textAlign = 'center';
//           svgContainer.style.cursor = 'pointer';
          
//           // Get the SVG element and style it for better mobile sizing
//           const svgElement = svgContainer.querySelector('svg');
//           if (svgElement) {
//             svgElement.style.maxWidth = '100%';
//             svgElement.style.width = '100%';
//             svgElement.style.height = 'auto';
//             svgElement.style.minHeight = isMobile ? '400px' : '300px'; // Larger on mobile
//             svgElement.style.fontSize = isMobile ? '18px' : '16px'; // Larger font on mobile
            
//             // Mobile-specific optimizations
//             if (isMobile) {
//               svgElement.style.overflow = 'visible';
//               // Force larger font sizes for labels
//               const labels = svgElement.querySelectorAll('.label');
//               labels.forEach(label => {
//                 label.style.fontSize = '16px';
//                 label.style.fontWeight = '500';
//               });
//             }
            
//             svgElement.onclick = () => setZoomOpen(true);
            
//             // Add viewBox if missing for better scaling
//             if (!svgElement.getAttribute('viewBox') && svgElement.getAttribute('width') && svgElement.getAttribute('height')) {
//               const width = svgElement.getAttribute('width');
//               const height = svgElement.getAttribute('height');
//               svgElement.setAttribute('viewBox', `0 0 ${width} ${height}`);
//               svgElement.removeAttribute('width');
//               svgElement.removeAttribute('height');
//             }
//           }
          
//           // Append to container
//           ref.current.appendChild(svgContainer);
          
//           // Store the rendered SVG for zoom view
//           setRenderedSvg(finalSvg);
          
//           if (usedFallback) {
//             const indicator = document.createElement('div');
//             indicator.style.cssText = `
//               position: absolute;
//               top: 8px;
//               right: 8px;
//               background: #ff9800;
//               color: white;
//               padding: 2px 6px;
//               border-radius: 4px;
//               font-size: 10px;
//               font-weight: bold;
//               z-index: 10;
//             `;
//             indicator.textContent = 'SIMPLIFIED';
//             svgContainer.style.position = 'relative';
//             svgContainer.appendChild(indicator);
//           }
//         }
        
//         console.log("=== 🚀 RENDERING COMPLETE ===");
//         setIsLoading(false);
//       } catch (renderError) {
//         console.error('❌ Final render error:', renderError);
//         setError(`Failed to render diagram: ${renderError.message}`);
//         setIsLoading(false);
        
//         // Show error state
//         if (ref.current) {
//           ref.current.innerHTML = '';
//           const errorDiv = document.createElement('div');
//           errorDiv.style.cssText = `
//             padding: 40px 20px;
//             text-align: center;
//             color: #666;
//             border: 2px dashed #ff9800;
//             border-radius: 8px;
//             background: #fff3e0;
//             cursor: pointer;
//             min-height: ${isMobile ? '300px' : '200px'};
//             display: flex;
//             flex-direction: column;
//             justify-content: center;
//             align-items: center;
//             font-size: ${isMobile ? '16px' : '14px'};
//           `;
//           errorDiv.innerHTML = `
//             <div style="font-size: ${isMobile ? '64px' : '48px'}; margin-bottom: 16px;">📊</div>
//             <p style="margin: 0 0 10px 0; font-weight: bold; color: #f57c00; font-size: ${isMobile ? '18px' : '16px'};">Diagram Preview</p>
//             <p style="margin: 0 0 15px 0; text-align: center; font-size: ${isMobile ? '16px' : '14px'};">Unable to render interactive diagram</p>
//             <div style="display: inline-flex; align-items: center; gap: 5px; color: #1976d2; font-size: ${isMobile ? '16px' : '14px'}; font-weight: 500;">
//               <svg width="${isMobile ? '20' : '16'}" height="${isMobile ? '20' : '16'}" viewBox="0 0 24 24" fill="currentColor">
//                 <path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z"/>
//               </svg>
//               View Diagram Code
//             </div>
//           `;
//           errorDiv.onclick = () => setZoomOpen(true);
//           ref.current.appendChild(errorDiv);
//         }
//       }
//     };

//     renderDiagram();
//   }, [chart, isMobile]);

//   // Handle zoom in/out
//   const handleZoomIn = () => {
//     setZoomLevel(prev => Math.min(prev + 0.25, 3));
//   };

//   const handleZoomOut = () => {
//     setZoomLevel(prev => Math.max(prev - 0.25, 0.5));
//   };

//   const handleResetZoom = () => {
//     setZoomLevel(1);
//   };

//   const handleRotate = () => setIsRotated(!isRotated);

//   const handleCloseZoom = () => {
//     setZoomOpen(false);
//     setZoomLevel(1);
//     setIsRotated(false);
//     setShowCode(false);
//   };

//   // Mobile-optimized zoom controls with rotation
//   const ZoomControls = () => (
//     <Box sx={{ 
//       position: 'sticky', 
//       top: 0, 
//       background: 'rgba(255, 255, 255, 0.95)',
//       backdropFilter: 'blur(10px)',
//       borderBottom: '1px solid', 
//       borderColor: colors[200],
//       p: isMobile ? 1.5 : 2,
//       display: 'flex', 
//       justifyContent: 'space-between', 
//       alignItems: 'center', 
//       zIndex: 1 
//     }}>
//       <Box sx={{ 
//         display: 'flex', 
//         alignItems: 'center', 
//         gap: isMobile ? 1 : 1.5 
//       }}>
//         <IconButton 
//           onClick={handleZoomOut} 
//           disabled={zoomLevel <= 0.5}
//           size={isMobile ? "medium" : "large"}
//           sx={{ color: colors[600] }}
//         >
//           <ZoomOut />
//         </IconButton>
        
//         <Button
//           onClick={handleResetZoom}
//           size="small"
//           sx={{
//             minWidth: isMobile ? 50 : 60,
//             color: colors[600],
//             fontWeight: 'bold',
//             fontSize: isMobile ? '14px' : '15px'
//           }}
//         >
//           {Math.round(zoomLevel * 100)}%
//         </Button>
        
//         <IconButton 
//           onClick={handleZoomIn} 
//           disabled={zoomLevel >= 3}
//           size={isMobile ? "medium" : "large"}
//           sx={{ color: colors[600] }}
//         >
//           <ZoomIn />
//         </IconButton>

//         {/* Rotation button for mobile */}
//         {isMobile && (
//           <IconButton 
//             onClick={handleRotate}
//             size={isMobile ? "medium" : "large"}
//             sx={{ color: isRotated ? colors[500] : colors[600] }}
//           >
//             <RotateRight />
//           </IconButton>
//         )}
//       </Box>
      
//       <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
//         {/* Toggle code view */}
//         <IconButton 
//           onClick={() => setShowCode(!showCode)}
//           size={isMobile ? "medium" : "large"}
//           sx={{ color: showCode ? colors[500] : colors[600] }}
//         >
//           <Code />
//         </IconButton>
        
//         <IconButton 
//           onClick={handleCloseZoom} 
//           size={isMobile ? "medium" : "large"}
//           sx={{ color: colors[600] }}
//         >
//           <Close />
//         </IconButton>
//       </Box>
//     </Box>
//   );

//   // Render zoomed diagram with rotation support
//   const renderZoomedDiagram = () => {
//     return (
//       <Dialog
//         open={zoomOpen}
//         onClose={handleCloseZoom}
//         maxWidth="xl"
//         fullWidth
//         fullScreen={isMobile}
//         sx={{
//           '& .MuiDialog-paper': {
//             background: 'rgba(255, 255, 255, 0.98)',
//             backdropFilter: 'blur(20px)',
//             maxHeight: '90vh',
//             ...(isMobile && {
//               margin: 0,
//               maxHeight: '100vh',
//               borderRadius: 0
//             })
//           }
//         }}
//       >
//         <ZoomControls />
        
//         <DialogContent
//           sx={{
//             p: isMobile ? 1 : 3,
//             display: 'flex',
//             flexDirection: 'column',
//             alignItems: 'center',
//             justifyContent: 'center',
//             minHeight: isMobile ? 'calc(100vh - 80px)' : '70vh',
//             background: colors[50],
//             overflow: 'auto',
//             gap: 2,
//             position: 'relative'
//           }}
//         >
//           {showCode ? (
//             // Code view
//             <Box sx={{ 
//               width: '100%', 
//               maxWidth: '100%',
//               p: isMobile ? 2 : 3
//             }}>
//               <Typography 
//                 variant="h6" 
//                 gutterBottom 
//                 sx={{ 
//                   color: colors[700],
//                   fontSize: isMobile ? '18px' : '20px'
//                 }}
//               >
//                 Diagram Source Code
//               </Typography>
//               <Box
//                 sx={{
//                   background: 'white',
//                   padding: isMobile ? 2 : 3,
//                   borderRadius: 2,
//                   boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
//                   maxHeight: isMobile ? '60vh' : '50vh',
//                   overflow: 'auto',
//                   width: '100%'
//                 }}
//               >
//                 <pre
//                   style={{
//                     margin: 0,
//                     whiteSpace: 'pre-wrap',
//                     fontSize: isMobile ? '12px' : '13px',
//                     fontFamily: 'Monaco, Consolas, monospace',
//                     lineHeight: '1.5',
//                     color: colors[800],
//                     background: 'transparent'
//                   }}
//                 >
//                   {chart}
//                 </pre>
//               </Box>
//             </Box>
//           ) : renderedSvg ? (
//             // Diagram view with rotation support
//             <Box
//               sx={{
//                 transform: isRotated ? 'rotate(90deg)' : 'none',
//                 transformOrigin: 'center center',
//                 transition: 'transform 0.3s ease',
//                 width: isRotated ? '90vh' : '100%',
//                 height: isRotated ? '90vw' : 'auto',
//                 display: 'flex',
//                 justifyContent: 'center',
//                 alignItems: 'center',
//                 padding: isMobile ? 1 : 2
//               }}
//             >
//               <Box
//                 sx={{
//                   transform: `scale(${zoomLevel})`,
//                   transformOrigin: 'center center',
//                   transition: 'transform 0.2s ease',
//                   background: 'white',
//                   borderRadius: '12px',
//                   padding: isMobile ? '15px' : '25px',
//                   boxShadow: '0 8px 32px rgba(0,0,0,0.15)',
//                   maxWidth: isRotated ? '90vh' : '95%',
//                   width: '100%',
//                   overflow: 'auto',
//                   display: 'flex',
//                   justifyContent: 'center'
//                 }}
//                 dangerouslySetInnerHTML={{ __html: renderedSvg }}
//               />
//             </Box>
//           ) : (
//             // Error view
//             <Box sx={{ 
//               textAlign: 'center', 
//               width: '100%',
//               p: isMobile ? 3 : 4
//             }}>
//               <Warning sx={{ 
//                 fontSize: isMobile ? 64 : 72, 
//                 color: colors[400],
//                 mb: 2 
//               }} />
//               <Typography 
//                 variant="h6" 
//                 gutterBottom 
//                 sx={{ 
//                   color: colors[700],
//                   fontSize: isMobile ? '18px' : '20px'
//                 }}
//               >
//                 Unable to Render Diagram
//               </Typography>
//               <Typography 
//                 variant="body2" 
//                 sx={{ 
//                   color: colors[600],
//                   mb: 3,
//                   fontSize: isMobile ? '15px' : '16px'
//                 }}
//               >
//                 The diagram contains syntax errors that prevent rendering.
//               </Typography>
//               <Button
//                 variant="contained"
//                 onClick={() => setShowCode(true)}
//                 startIcon={<Code />}
//                 sx={{
//                   background: `linear-gradient(135deg, ${colors[500]}, ${colors[600]})`,
//                   borderRadius: 2,
//                   px: 3,
//                   py: 1
//                 }}
//               >
//                 View Source Code
//               </Button>
//             </Box>
//           )}

//           {error && !showCode && (
//             <Alert 
//               severity="warning" 
//               sx={{ 
//                 maxWidth: isMobile ? '100%' : '95%', 
//                 width: '100%',
//                 borderRadius: 2
//               }}
//               action={
//                 <Button 
//                   color="inherit" 
//                   size="small"
//                   onClick={() => setShowCode(true)}
//                 >
//                   View Code
//                 </Button>
//               }
//             >
//               {error}
//             </Alert>
//           )}

//           {/* Mobile rotation hint */}
//           {isMobile && !isRotated && !showCode && (
//             <Chip
//               icon={<RotateRight />}
//               label="Rotate for better view"
//               onClick={handleRotate}
//               sx={{
//                 position: 'absolute',
//                 bottom: 16,
//                 background: colors[500],
//                 color: 'white',
//                 fontWeight: '600',
//                 '&:hover': {
//                   background: colors[600]
//                 }
//               }}
//             />
//           )}
//         </DialogContent>
//       </Dialog>
//     );
//   };

//   if (!chart) return null;

//   return (
//     <Box className="mermaid-container" sx={{ 
//       my: isMobile ? 2 : 3, 
//       position: 'relative',
//       width: '100%'
//     }}>
//       <Box
//         sx={{
//           border: '2px solid',
//           borderColor: error ? colors[300] : colors[100],
//           borderRadius: 3,
//           padding: isMobile ? 2 : 3,
//           background: 'white',
//           transition: 'all 0.3s ease',
//           cursor: 'pointer',
//           minHeight: isMobile ? '480px' : '380px',
//           display: 'flex',
//           flexDirection: 'column',
//           width: '100%',
//           boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
//           '&:hover': {
//             borderColor: error ? colors[400] : colors[300],
//             boxShadow: '0 4px 20px rgba(0,0,0,0.12)',
//             transform: 'translateY(-2px)'
//           }
//         }}
//         onClick={() => setZoomOpen(true)}
//       >
//         {isLoading && (
//           <Box sx={{ 
//             textAlign: 'center', 
//             padding: isMobile ? '80px 20px' : '60px', 
//             color: colors[500], 
//             flex: 1, 
//             display: 'flex', 
//             flexDirection: 'column', 
//             justifyContent: 'center', 
//             alignItems: 'center' 
//           }}>
//             <CircularProgress 
//               size={isMobile ? 56 : 48} 
//               sx={{ color: colors[500] }} 
//             />
//             <Typography 
//               sx={{ 
//                 marginTop: '20px', 
//                 fontSize: isMobile ? '16px' : '15px',
//                 color: colors[600],
//                 fontWeight: '500'
//               }}
//             >
//               Rendering diagram...
//             </Typography>
//           </Box>
//         )}
        
//         {error && !isLoading && (
//           <Alert 
//             severity="warning" 
//             sx={{ 
//               mb: 2,
//               borderRadius: 2,
//               border: `1px solid ${colors[200]}`,
//               background: colors[50]
//             }}
//             action={
//               <Button 
//                 color="inherit" 
//                 size="small"
//                 onClick={(e) => {
//                   e.stopPropagation();
//                   setZoomOpen(true);
//                 }}
//                 sx={{ fontWeight: '600' }}
//               >
//                 Details
//               </Button>
//             }
//             icon={<Warning />}
//           >
//             <Typography variant="body2" fontWeight="500">
//               {error}
//             </Typography>
//           </Alert>
//         )}
        
//         <Box 
//           ref={ref} 
//           sx={{ 
//             minHeight: isMobile ? '420px' : '320px',
//             flex: 1,
//             display: 'flex',
//             justifyContent: 'center',
//             alignItems: 'center',
//             width: '100%',
//             '& > div': {
//               width: '100%',
//               textAlign: 'center'
//             },
//             '& svg': {
//               maxWidth: '100% !important',
//               width: '100% !important',
//               height: 'auto !important',
//               minHeight: isMobile ? '400px' : '300px',
//               fontSize: isMobile ? '18px !important' : '16px !important'
//             }
//           }} 
//         />
        
//         {!isLoading && (
//           <Box
//             sx={{
//               textAlign: 'center',
//               mt: 2,
//               color: error ? colors[400] : colors[500],
//               fontSize: isMobile ? '15px' : '14px',
//               display: 'flex',
//               alignItems: 'center',
//               justifyContent: 'center',
//               gap: 1,
//               fontWeight: '600'
//             }}
//           >
//             <Fullscreen fontSize={isMobile ? "medium" : "small"} />
//             {error ? 'View details' : 'Click to enlarge'}
//             {isMobile && !error && (
//               <Chip
//                 label="Rotatable"
//                 size="small"
//                 sx={{
//                   background: colors[100],
//                   color: colors[600],
//                   fontSize: '11px',
//                   height: '20px'
//                 }}
//               />
//             )}
//           </Box>
//         )}
//       </Box>

//       {renderZoomedDiagram()}
//     </Box>
//   );
// };

// export default MermaidDiagram;

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
  useMediaQuery,
  Typography,
  Chip,
  Tooltip
} from '@mui/material';
import { 
  ZoomIn, 
  ZoomOut, 
  Close, 
  Fullscreen, 
  RotateRight,
  Code,
  Warning,
  Refresh
} from '@mui/icons-material';

const MermaidDiagram = ({ 
  chart, 
  colorPalette = {}, 
  onManualRegenerate, 
  topic, 
  subtopic, 
  remainingGenerations = 5,
  isRegenerating = false,
  initialError = false
}) => {
  const ref = useRef(null);
  const [error, setError] = useState(initialError || null);
  const [isLoading, setIsLoading] = useState(true);
  const [zoomOpen, setZoomOpen] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [renderedSvg, setRenderedSvg] = useState(null);
  const [isRotated, setIsRotated] = useState(false);
  const [showCode, setShowCode] = useState(false);
  const [regenerating, setRegenerating] = useState(false);
  const [autoRegenerated, setAutoRegenerated] = useState(false);
  
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  // Default color palette if not provided
  const colors = colorPalette || {
    50: '#FAF7FE',
    100: '#F3E8FF',
    200: '#E9D5FF',
    300: '#D8B4FE',
    400: '#C084FC',
    500: '#A855F7',
    600: '#9333EA',
    700: '#7C3AED',
    800: '#6B21A8',
    900: '#581C87'
  };

  // Initialize mermaid with error suppression
  useEffect(() => {
    try {
      // Suppress console errors from mermaid
      const originalError = console.error;
      console.error = (...args) => {
        if (args[0] && typeof args[0] === 'string' && args[0].includes('mermaid')) {
          return; // Suppress mermaid errors
        }
        originalError.apply(console, args);
      };

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
            background: white;
          }
          .node rect, .node circle, .node ellipse, .node polygon {
            stroke-width: 2px !important;
            stroke: ${colors[600]} !important;
          }
          .edgePath .path {
            stroke: ${colors[500]} !important;
            stroke-width: 2px !important;
          }
          .label {
            font-size: ${isMobile ? '16px' : '14px'} !important;
            font-family: Arial, sans-serif !important;
          }
        `
      });

      // Restore console.error after initialization
      console.error = originalError;
    } catch (error) {
      // Silent catch - don't show initialization errors
    }
  }, [isMobile, colors]);

  // Handle manual mindmap regeneration
  const handleManualRegenerate = async () => {
    if (remainingGenerations <= 0) {
      setError('No regenerations available');
      return;
    }

    if (!onManualRegenerate) {
      setError('Mindmap regeneration not available');
      return;
    }

    try {
      setRegenerating(true);
      setError(null);
      setIsLoading(true);
      
      console.log("🔄 Manually regenerating mindmap via API...");
      
      await onManualRegenerate();
      setAutoRegenerated(false); // Reset for new mindmap
      
    } catch (err) {
      console.error('Manual mindmap regeneration error:', err);
      setError(err.response?.data?.message || 'Failed to regenerate mindmap');
      setRegenerating(false);
      setIsLoading(false);
    }
  };

  // Simple cleaning function
  const cleanMermaidSyntax = (inputChart) => {
    if (!inputChart) return '';
    
    let cleaned = inputChart.trim();
    
    // Remove markdown code blocks
    cleaned = cleaned.replace(/```mermaid\s*/gi, '').replace(/```\s*/gi, '');
    
    // Fix multiple graph declarations
    cleaned = cleaned.replace(/(graph [A-Z]+)\s*(graph [A-Z]+)/g, '$1');
    
    // Remove problematic characters
    cleaned = cleaned
      .replace(/[–—‑−]/g, '-')
      .replace(/[{}]/g, '')
      .replace(/;/g, '');
    
    return cleaned;
  };

  // Enhanced render function with ONE auto-regeneration attempt
  useEffect(() => {
    const renderDiagram = async () => {
      if (!ref.current || !chart) {
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        setError(null);
        
        // Clear previous content
        ref.current.innerHTML = '';
        
        // Clean the syntax
        const cleanedChart = cleanMermaidSyntax(chart);
        
        if (!cleanedChart.trim()) {
          throw new Error('Empty diagram content');
        }

        // Generate unique ID
        const id = `mermaid-${Math.random().toString(36).slice(2, 11)}`;
        
        let finalSvg;

        try {
          // Suppress mermaid errors during render
          const originalError = console.error;
          console.error = (...args) => {
            if (args[0] && typeof args[0] === 'string' && args[0].includes('mermaid')) {
              return;
            }
            originalError.apply(console, args);
          };

          // Render the cleaned diagram
          const result = await mermaid.render(id, cleanedChart);
          finalSvg = result.svg;

          // Restore console.error
          console.error = originalError;
        } catch (renderError) {
          // Restore console.error if it was suppressed
          console.error = (...args) => {
            if (args[0] && typeof args[0] === 'string' && args[0].includes('mermaid')) {
              return;
            }
            console.error.apply(console, args);
          };

          // Auto-regenerate ONLY if we haven't done it before
          if (!autoRegenerated && onManualRegenerate && remainingGenerations > 0) {
            console.log('🔄 Auto-regenerating mindmap (first attempt)');
            setAutoRegenerated(true);
            await handleManualRegenerate();
            return; // Exit early, new render will be triggered by prop change
          }
          
          throw new Error('Unable to render diagram');
        }
        
        if (finalSvg) {
          // Create container for SVG
          const svgContainer = document.createElement('div');
          svgContainer.innerHTML = finalSvg;
          svgContainer.style.width = '100%';
          svgContainer.style.textAlign = 'center';
          svgContainer.style.cursor = 'pointer';
          
          // Get the SVG element and style it
          const svgElement = svgContainer.querySelector('svg');
          if (svgElement) {
            svgElement.style.maxWidth = '100%';
            svgElement.style.width = '100%';
            svgElement.style.height = 'auto';
            svgElement.style.minHeight = isMobile ? '400px' : '300px';
            svgElement.style.fontSize = isMobile ? '18px' : '16px';
            
            // Mobile-specific optimizations
            if (isMobile) {
              svgElement.style.overflow = 'visible';
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
          setRegenerating(false);
        }
        
        setIsLoading(false);
      } catch (renderError) {
        // Don't show the technical error to users
        setError('This mindmap cannot be displayed. You can try regenerating it.');
        setIsLoading(false);
        setRegenerating(false);
        
        // Show error state with retry option
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
          
          const canRetry = onManualRegenerate && remainingGenerations > 0;
          
          errorDiv.innerHTML = `
            <div style="font-size: ${isMobile ? '64px' : '48px'}; margin-bottom: 16px;">📊</div>
            <p style="margin: 0 0 10px 0; font-weight: bold; color: #f57c00; font-size: ${isMobile ? '18px' : '16px'};">Diagram Display Issue</p>
            <p style="margin: 0 0 15px 0; text-align: center; font-size: ${isMobile ? '16px' : '14px'};">This mindmap cannot be rendered properly</p>
            ${canRetry ? `
              <button style="
                background: #1976d2;
                color: white;
                border: none;
                padding: 10px 20px;
                border-radius: 6px;
                font-size: ${isMobile ? '16px' : '14px'};
                font-weight: 600;
                cursor: pointer;
                display: flex;
                align-items: center;
                gap: 8px;
                margin-top: 10px;
              ">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.65 6.35C16.2 4.9 14.21 4 12 4c-4.42 0-7.99 3.58-7.99 8s3.57 8 7.99 8c3.73 0 6.84-2.55 7.73-6h-2.08c-.82 2.33-3.04 4-5.65 4-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78L13 11h7V4l-2.35 2.35z"/>
                </svg>
                Regenerate Mindmap
              </button>
            ` : `
              <div style="display: inline-flex; align-items: center; gap: 5px; color: #1976d2; font-size: ${isMobile ? '16px' : '14px'}; font-weight: 500;">
                <svg width="${isMobile ? '20' : '16'}" height="${isMobile ? '20' : '16'}" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z"/>
                </svg>
                View Diagram Code
              </div>
            `}
          `;
          
          // Add click handlers
          if (canRetry) {
            const retryButton = errorDiv.querySelector('button');
            retryButton.onclick = (e) => {
              e.stopPropagation();
              handleManualRegenerate();
            };
          }
          
          errorDiv.onclick = () => setZoomOpen(true);
          ref.current.appendChild(errorDiv);
        }
      }
    };

    renderDiagram();
  }, [chart, isMobile, autoRegenerated]);

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

  const handleRotate = () => setIsRotated(!isRotated);

  const handleCloseZoom = () => {
    setZoomOpen(false);
    setZoomLevel(1);
    setIsRotated(false);
    setShowCode(false);
  };

  // Zoom controls with mindmap regeneration button
  const ZoomControls = () => (
    <Box sx={{ 
      position: 'sticky', 
      top: 0, 
      background: 'rgba(255, 255, 255, 0.95)',
      backdropFilter: 'blur(10px)',
      borderBottom: '1px solid', 
      borderColor: colors[200],
      p: isMobile ? 1.5 : 2,
      display: 'flex', 
      justifyContent: 'space-between', 
      alignItems: 'center', 
      zIndex: 1 
    }}>
      <Box sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        gap: isMobile ? 1 : 1.5 
      }}>
        <IconButton 
          onClick={handleZoomOut} 
          disabled={zoomLevel <= 0.5}
          size={isMobile ? "medium" : "large"}
          sx={{ color: colors[600] }}
        >
          <ZoomOut />
        </IconButton>
        
        <Button
          onClick={handleResetZoom}
          size="small"
          sx={{
            minWidth: isMobile ? 50 : 60,
            color: colors[600],
            fontWeight: 'bold',
            fontSize: isMobile ? '14px' : '15px'
          }}
        >
          {Math.round(zoomLevel * 100)}%
        </Button>
        
        <IconButton 
          onClick={handleZoomIn} 
          disabled={zoomLevel >= 3}
          size={isMobile ? "medium" : "large"}
          sx={{ color: colors[600] }}
        >
          <ZoomIn />
        </IconButton>

        {/* Rotation button for mobile */}
        {isMobile && (
          <IconButton 
            onClick={handleRotate}
            size={isMobile ? "medium" : "large"}
            sx={{ color: isRotated ? colors[500] : colors[600] }}
          >
            <RotateRight />
          </IconButton>
        )}
      </Box>
      
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        {/* Mindmap Regenerate button */}
        {onManualRegenerate && (
          <Tooltip title={`Regenerate mindmap (${remainingGenerations} left)`}>
            <IconButton 
              onClick={handleManualRegenerate}
              disabled={regenerating || remainingGenerations <= 0}
              size={isMobile ? "medium" : "large"}
              sx={{ 
                color: remainingGenerations > 0 ? colors[500] : colors[300],
                animation: regenerating ? 'pulse 1s infinite' : 'none',
                '@keyframes pulse': {
                  '0%': { opacity: 1 },
                  '50%': { opacity: 0.7 },
                  '100%': { opacity: 1 }
                }
              }}
            >
              {regenerating ? <CircularProgress size={20} /> : <Refresh />}
            </IconButton>
          </Tooltip>
        )}

        {/* Toggle code view */}
        <IconButton 
          onClick={() => setShowCode(!showCode)}
          size={isMobile ? "medium" : "large"}
          sx={{ color: showCode ? colors[500] : colors[600] }}
        >
          <Code />
        </IconButton>
        
        <IconButton 
          onClick={handleCloseZoom} 
          size={isMobile ? "medium" : "large"}
          sx={{ color: colors[600] }}
        >
          <Close />
        </IconButton>
      </Box>
    </Box>
  );

  // Render zoomed diagram
  const renderZoomedDiagram = () => {
    return (
      <Dialog
        open={zoomOpen}
        onClose={handleCloseZoom}
        maxWidth="xl"
        fullWidth
        fullScreen={isMobile}
        sx={{
          '& .MuiDialog-paper': {
            background: 'rgba(255, 255, 255, 0.98)',
            backdropFilter: 'blur(20px)',
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
            justifyContent: 'center',
            minHeight: isMobile ? 'calc(100vh - 80px)' : '70vh',
            background: colors[50],
            overflow: 'auto',
            gap: 2,
            position: 'relative'
          }}
        >
          {showCode ? (
            // Code view with regenerate button
            <Box sx={{ 
              width: '100%', 
              maxWidth: '100%',
              p: isMobile ? 2 : 3
            }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography 
                  variant="h6" 
                  sx={{ 
                    color: colors[700],
                    fontSize: isMobile ? '18px' : '20px'
                  }}
                >
                  Diagram Source Code
                </Typography>
                {onManualRegenerate && (
                  <Button
                    startIcon={<Refresh />}
                    onClick={handleManualRegenerate}
                    disabled={regenerating || remainingGenerations <= 0}
                    variant="outlined"
                    size="small"
                    sx={{
                      borderColor: colors[400],
                      color: colors[600],
                      fontWeight: '600'
                    }}
                  >
                    {regenerating ? 'Regenerating...' : `Regenerate Mindmap`}
                  </Button>
                )}
              </Box>
              <Box
                sx={{
                  background: 'white',
                  padding: isMobile ? 2 : 3,
                  borderRadius: 2,
                  boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                  maxHeight: isMobile ? '60vh' : '50vh',
                  overflow: 'auto',
                  width: '100%'
                }}
              >
                <pre
                  style={{
                    margin: 0,
                    whiteSpace: 'pre-wrap',
                    fontSize: isMobile ? '12px' : '13px',
                    fontFamily: 'Monaco, Consolas, monospace',
                    lineHeight: '1.5',
                    color: colors[800],
                    background: 'transparent'
                  }}
                >
                  {chart}
                </pre>
              </Box>
              {remainingGenerations > 0 && (
                <Typography variant="caption" sx={{ color: colors[500], mt: 1, display: 'block' }}>
                  {remainingGenerations} mindmap regenerations remaining
                </Typography>
              )}
            </Box>
          ) : renderedSvg ? (
            // Diagram view
            <Box
              sx={{
                transform: isRotated ? 'rotate(90deg)' : 'none',
                transformOrigin: 'center center',
                transition: 'transform 0.3s ease',
                width: isRotated ? '90vh' : '100%',
                height: isRotated ? '90vw' : 'auto',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                padding: isMobile ? 1 : 2
              }}
            >
              <Box
                sx={{
                  transform: `scale(${zoomLevel})`,
                  transformOrigin: 'center center',
                  transition: 'transform 0.2s ease',
                  background: 'white',
                  borderRadius: '12px',
                  padding: isMobile ? '15px' : '25px',
                  boxShadow: '0 8px 32px rgba(0,0,0,0.15)',
                  maxWidth: isRotated ? '90vh' : '95%',
                  width: '100%',
                  overflow: 'auto',
                  display: 'flex',
                  justifyContent: 'center'
                }}
                dangerouslySetInnerHTML={{ __html: renderedSvg }}
              />
            </Box>
          ) : (
            // Error view
            <Box sx={{ 
              textAlign: 'center', 
              width: '100%',
              p: isMobile ? 3 : 4
            }}>
              <Warning sx={{ 
                fontSize: isMobile ? 64 : 72, 
                color: colors[400],
                mb: 2 
              }} />
              <Typography 
                variant="h6" 
                gutterBottom 
                sx={{ 
                  color: colors[700],
                  fontSize: isMobile ? '18px' : '20px'
                }}
              >
                Unable to Render Diagram
              </Typography>
              <Typography 
                variant="body2" 
                sx={{ 
                  color: colors[600],
                  mb: 3,
                  fontSize: isMobile ? '15px' : '16px'
                }}
              >
                This mindmap contains syntax errors that prevent rendering.
              </Typography>
              <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
                <Button
                  variant="contained"
                  onClick={() => setShowCode(true)}
                  startIcon={<Code />}
                  sx={{
                    background: `linear-gradient(135deg, ${colors[500]}, ${colors[600]})`,
                    borderRadius: 2,
                    px: 3,
                    py: 1
                  }}
                >
                  View Source Code
                </Button>
                {onManualRegenerate && remainingGenerations > 0 && (
                  <Button
                    variant="outlined"
                    onClick={handleManualRegenerate}
                    disabled={regenerating}
                    startIcon={regenerating ? <CircularProgress size={16} /> : <Refresh />}
                    sx={{
                      borderColor: colors[500],
                      color: colors[600],
                      borderRadius: 2,
                      px: 3,
                      py: 1
                    }}
                  >
                    {regenerating ? 'Regenerating...' : 'Regenerate Mindmap'}
                  </Button>
                )}
              </Box>
            </Box>
          )}

          {error && !showCode && (
            <Alert 
              severity="warning" 
              sx={{ 
                maxWidth: isMobile ? '100%' : '95%', 
                width: '100%',
                borderRadius: 2
              }}
              action={
                <Box sx={{ display: 'flex', gap: 1 }}>
                  {onManualRegenerate && remainingGenerations > 0 && (
                    <Button 
                      color="inherit" 
                      size="small"
                      onClick={handleManualRegenerate}
                      disabled={regenerating}
                    >
                      {regenerating ? '...' : 'Regenerate'}
                    </Button>
                  )}
                  <Button 
                    color="inherit" 
                    size="small"
                    onClick={() => setShowCode(true)}
                  >
                    View Code
                  </Button>
                </Box>
              }
            >
              {error}
            </Alert>
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
          borderColor: error ? colors[300] : colors[100],
          borderRadius: 3,
          padding: isMobile ? 2 : 3,
          background: 'white',
          transition: 'all 0.3s ease',
          cursor: 'pointer',
          minHeight: isMobile ? '480px' : '380px',
          display: 'flex',
          flexDirection: 'column',
          width: '100%',
          boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
          '&:hover': {
            borderColor: error ? colors[400] : colors[300],
            boxShadow: '0 4px 20px rgba(0,0,0,0.12)',
            transform: 'translateY(-2px)'
          }
        }}
        onClick={() => setZoomOpen(true)}
      >
        {isLoading && (
          <Box sx={{ 
            textAlign: 'center', 
            padding: isMobile ? '80px 20px' : '60px', 
            color: colors[500], 
            flex: 1, 
            display: 'flex', 
            flexDirection: 'column', 
            justifyContent: 'center', 
            alignItems: 'center' 
          }}>
            <CircularProgress 
              size={isMobile ? 56 : 48} 
              sx={{ color: colors[500] }} 
            />
            <Typography 
              sx={{ 
                marginTop: '20px', 
                fontSize: isMobile ? '16px' : '15px',
                color: colors[600],
                fontWeight: '500'
              }}
            >
              {regenerating ? 'Regenerating mindmap...' : 'Rendering diagram...'}
            </Typography>
          </Box>
        )}
        
        {error && !isLoading && (
          <Alert 
            severity="warning" 
            sx={{ 
              mb: 2,
              borderRadius: 2,
              border: `1px solid ${colors[200]}`,
              background: colors[50]
            }}
            action={
              onManualRegenerate && remainingGenerations > 0 ? (
                <Button 
                  color="inherit" 
                  size="small"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleManualRegenerate();
                  }}
                  disabled={regenerating}
                  sx={{ fontWeight: '600' }}
                >
                  {regenerating ? '...' : 'Retry'}
                </Button>
              ) : (
                <Button 
                  color="inherit" 
                  size="small"
                  onClick={(e) => {
                    e.stopPropagation();
                    setZoomOpen(true);
                  }}
                  sx={{ fontWeight: '600' }}
                >
                  Details
                </Button>
              )
            }
            icon={<Warning />}
          >
            <Typography variant="body2" fontWeight="500">
              {error}
            </Typography>
            {onManualRegenerate && remainingGenerations > 0 && !regenerating && (
              <Typography variant="caption" display="block" sx={{ mt: 0.5 }}>
                Click "Retry" to regenerate with correct syntax
              </Typography>
            )}
          </Alert>
        )}
        
        <Box 
          ref={ref} 
          sx={{ 
            minHeight: isMobile ? '420px' : '320px',
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
              minHeight: isMobile ? '400px' : '300px',
              fontSize: isMobile ? '18px !important' : '16px !important'
            }
          }} 
        />
        
        {!isLoading && (
          <Box
            sx={{
              textAlign: 'center',
              mt: 2,
              color: error ? colors[400] : colors[500],
              fontSize: isMobile ? '15px' : '14px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 1,
              fontWeight: '600'
            }}
          >
            <Fullscreen fontSize={isMobile ? "medium" : "small"} />
            {error ? 'View details' : 'Click to enlarge'}
     
          </Box>
        )}
      </Box>

      {renderZoomedDiagram()}
    </Box>
  );
};

export default MermaidDiagram;