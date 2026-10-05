import { Box, IconButton, Button, Tooltip } from '@mui/material';
import { ZoomIn, ZoomOut, Close, RotateRight, Code, Refresh} from '@mui/icons-material';

const DiagramControls = ({
  zoomLevel,
  onZoomIn,
  onZoomOut,
  onResetZoom,
  isRotated,
  onRotate,
  showCode,
  onToggleCode,
  onClose,
  isMobile,
  colors,
  onManualRegenerate,
  isRegenerating,
  remainingGenerations
}) => (
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
        onClick={onZoomOut} 
        disabled={zoomLevel <= 0.5}
        size={isMobile ? "medium" : "large"}
        sx={{ color: colors[600] }}
      >
        <ZoomOut />
      </IconButton>
      
      <Button
        onClick={onResetZoom}
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
        onClick={onZoomIn} 
        disabled={zoomLevel >= 3}
        size={isMobile ? "medium" : "large"}
        sx={{ color: colors[600] }}
      >
        <ZoomIn />
      </IconButton>

      {isMobile && (
        <IconButton 
          onClick={onRotate}
          size={isMobile ? "medium" : "large"}
          sx={{ color: isRotated ? colors[500] : colors[600] }}
        >
          <RotateRight />
        </IconButton>
      )}
    </Box>
    
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
      {onManualRegenerate && (
        <Tooltip title={`Regenerate mindmap (${remainingGenerations} left)`}>
          <IconButton 
            onClick={onManualRegenerate}
            disabled={isRegenerating || remainingGenerations <= 0}
            size={isMobile ? "medium" : "large"}
            sx={{ 
              color: remainingGenerations > 0 ? colors[500] : colors[300],
              animation: isRegenerating ? 'pulse 1s infinite' : 'none',
              '@keyframes pulse': {
                '0%': { opacity: 1 },
                '50%': { opacity: 0.7 },
                '100%': { opacity: 1 }
              }
            }}
          >
            {isRegenerating ? <Close size={20} /> : <Refresh />}
          </IconButton>
        </Tooltip>
      )}

      <IconButton 
        onClick={onToggleCode}
        size={isMobile ? "medium" : "large"}
        sx={{ color: showCode ? colors[500] : colors[600] }}
      >
        <Code />
      </IconButton>
      
      <IconButton 
        onClick={onClose} 
        size={isMobile ? "medium" : "large"}
        sx={{ color: colors[600] }}
      >
        <Close />
      </IconButton>
    </Box>
  </Box>
);

export default DiagramControls;