import { Alert, Typography, Button, Box } from '@mui/material';
import { Warning } from '@mui/icons-material';

const ErrorView = ({ 
  error, 
  isMobile, 
  onManualRegenerate, 
  remainingGenerations, 
  isRegenerating, 
  handleManualRegenerate, 
  setZoomOpen, 
  colors 
}) => (
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
          disabled={isRegenerating}
          sx={{ fontWeight: '600' }}
        >
          {isRegenerating ? '...' : 'Retry'}
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
    {onManualRegenerate && remainingGenerations > 0 && !isRegenerating && (
      <Typography variant="caption" display="block" sx={{ mt: 0.5 }}>
        Click "Retry" to regenerate with correct syntax
      </Typography>
    )}
  </Alert>
);

// Zoom error view variant
ErrorView.ZoomError = ({ colors, isMobile, onShowCode, onManualRegenerate, isRegenerating, remainingGenerations }) => (
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
        onClick={onShowCode}
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
          onClick={onManualRegenerate}
          disabled={isRegenerating}
          startIcon={isRegenerating ? <CircularProgress size={16} /> : <Refresh />}
          sx={{
            borderColor: colors[500],
            color: colors[600],
            borderRadius: 2,
            px: 3,
            py: 1
          }}
        >
          {isRegenerating ? 'Regenerating...' : 'Regenerate Mindmap'}
        </Button>
      )}
    </Box>
  </Box>
);

export default ErrorView;