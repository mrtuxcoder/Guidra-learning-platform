import { Dialog, DialogContent } from '@mui/material';
import DiagramControls from './DiagramControls';
import CodeView from './CodeView';
import DiagramView from './DiagramView';
import { useState } from 'react';
import ErrorView from './ErrorView';

const ZoomModal = ({
  open,
  onClose,
  renderedSvg,
  chart,
  error,
  isMobile,
  colors,
  onManualRegenerate,
  isRegenerating,
  remainingGenerations
}) => {
  const [zoomLevel, setZoomLevel] = useState(1);
  const [isRotated, setIsRotated] = useState(false);
  const [showCode, setShowCode] = useState(false);

  const handleZoomIn = () => setZoomLevel(prev => Math.min(prev + 0.25, 3));
  const handleZoomOut = () => setZoomLevel(prev => Math.max(prev - 0.25, 0.5));
  const handleResetZoom = () => setZoomLevel(1);
  const handleRotate = () => setIsRotated(!isRotated);

  const handleClose = () => {
    onClose();
    setZoomLevel(1);
    setIsRotated(false);
    setShowCode(false);
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
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
      <DiagramControls
        zoomLevel={zoomLevel}
        onZoomIn={handleZoomIn}
        onZoomOut={handleZoomOut}
        onResetZoom={handleResetZoom}
        isRotated={isRotated}
        onRotate={handleRotate}
        showCode={showCode}
        onToggleCode={() => setShowCode(!showCode)}
        onClose={handleClose}
        isMobile={isMobile}
        colors={colors}
        onManualRegenerate={onManualRegenerate}
        isRegenerating={isRegenerating}
        remainingGenerations={remainingGenerations}
      />
      
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
          <CodeView
            chart={chart}
            isMobile={isMobile}
            colors={colors}
            onManualRegenerate={onManualRegenerate}
            isRegenerating={isRegenerating}
            remainingGenerations={remainingGenerations}
          />
        ) : renderedSvg ? (
          <DiagramView
            renderedSvg={renderedSvg}
            zoomLevel={zoomLevel}
            isRotated={isRotated}
            isMobile={isMobile}
            colors={colors}
          />
        ) : (
          <ErrorView.ZoomError
            colors={colors}
            isMobile={isMobile}
            onShowCode={() => setShowCode(true)}
            onManualRegenerate={onManualRegenerate}
            isRegenerating={isRegenerating}
            remainingGenerations={remainingGenerations}
          />
        )}
      </DialogContent>
    </Dialog>
  );
};

export default ZoomModal;