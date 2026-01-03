import { Box, Typography, Button } from '@mui/material';
import { Refresh } from '@mui/icons-material';

const CodeView = ({ 
  chart, 
  isMobile, 
  colors, 
  onManualRegenerate, 
  isRegenerating, 
  remainingGenerations 
}) => (
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
          onClick={onManualRegenerate}
          disabled={isRegenerating || remainingGenerations <= 0}
          variant="outlined"
          size="small"
          sx={{
            borderColor: colors[400],
            color: colors[600],
            fontWeight: '600'
          }}
        >
          {isRegenerating ? 'Regenerating...' : `Regenerate Mindmap`}
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
);

export default CodeView;