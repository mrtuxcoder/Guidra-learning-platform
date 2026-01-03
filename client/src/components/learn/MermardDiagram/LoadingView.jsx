import { Box, Typography, CircularProgress } from '@mui/material';

const LoadingView = ({ isMobile, colors, isRegenerating }) => (
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
      {isRegenerating ? 'Regenerating mindmap...' : 'Rendering diagram...'}
    </Typography>
  </Box>
);

export default LoadingView;