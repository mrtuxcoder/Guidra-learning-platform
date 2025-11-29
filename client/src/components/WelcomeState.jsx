import React from 'react';
import { 
  Box, 
  Typography, 
  Button, 
  Card, 
  CardContent,
  Fade,
  IconButton,
  Tooltip
} from "@mui/material";
import { 
  AutoAwesome,
  School,
  PlayArrow,
  Menu
} from "@mui/icons-material";

const WelcomeState = ({ 
  subtopicName, 
  isReady = false, 
  onGenerateContent,
  subtopics = [],
  onNavigateToFirstIncomplete,
  onOpenSidebar,
  colorPalette = {
    50: '#faf5ff',
    100: '#f3e8ff',
    200: '#e9d5ff',
    300: '#d8b4fe',
    400: '#c084fc',
    500: '#a855f7',
    600: '#9333ea',
    700: '#7c3aed',
    800: '#6b21a8',
    900: '#581c87'
  }
}) => {
  // Find first incomplete subtopic
  const firstIncompleteSubtopic = subtopics.find(sub => !sub.completed);
  const hasIncompleteTopics = firstIncompleteSubtopic && subtopics.length > 0;

  const handleClickToStart = () => {
    if (hasIncompleteTopics && onNavigateToFirstIncomplete) {
      onNavigateToFirstIncomplete(firstIncompleteSubtopic);
    } else if (isReady && onGenerateContent) {
      onGenerateContent();
    }
  };

  const renderContent = () => {
    if (isReady && subtopicName) {
      return (
        <>
          <Box sx={{ mb: 3 }}>
            <Box
              sx={{
                width: 100,
                height: 100,
                borderRadius: '50%',
                background: `linear-gradient(135deg, ${colorPalette[500]} 0%, ${colorPalette[700]} 100%)`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto',
                boxShadow: '0 8px 25px rgba(126, 87, 194, 0.3)',
                border: '3px solid white'
              }}
            >
              <School sx={{ 
                fontSize: 48,
                color: 'white',
              }} />
            </Box>
          </Box>

          <Typography 
            variant="h4" 
            fontWeight="700" 
            sx={{ 
              background: `linear-gradient(135deg, ${colorPalette[600]} 0%, ${colorPalette[800]} 100%)`,
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              mb: 2
            }}
          >
            Ready to Learn
          </Typography>

          <Typography 
            variant="body1" 
            color="text.secondary" 
            sx={{ 
              mb: 3, 
              lineHeight: 1.6,
              fontSize: '1.1rem'
            }}
          >
            Start learning <strong>{subtopicName}</strong> with personalized AI-generated content tailored just for you.
          </Typography>

          <Button
            variant="contained"
            size="large"
            onClick={onGenerateContent}
            startIcon={<AutoAwesome />}
            sx={{
              py: 1.5,
              px: 4,
              borderRadius: 3,
              fontSize: '1.1rem',
              fontWeight: 700,
              background: `linear-gradient(135deg, ${colorPalette[500]} 0%, ${colorPalette[700]} 100%)`,
              boxShadow: '0 8px 25px rgba(126, 87, 194, 0.3)',
              '&:hover': {
                background: `linear-gradient(135deg, ${colorPalette[600]} 0%, ${colorPalette[800]} 100%)`,
                boxShadow: '0 12px 30px rgba(126, 87, 194, 0.4)',
                transform: 'translateY(-2px)'
              },
              minWidth: 220,
              height: 56,
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
            }}
          >
            Start Learning
          </Button>
        </>
      );
    }

    return (
      <>
        <Box sx={{ mb: 3 }}>
          <Box
            sx={{
              width: 100,
              height: 100,
              borderRadius: '50%',
              background: `linear-gradient(135deg, ${colorPalette[500]} 0%, ${colorPalette[700]} 100%)`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto',
              boxShadow: '0 8px 25px rgba(126, 87, 194, 0.3)',
              border: '3px solid white'
            }}
          >
            <PlayArrow sx={{ 
              fontSize: 48,
              color: 'white',
            }} />
          </Box>
        </Box>

        <Typography 
          variant="h4" 
          fontWeight="700" 
          sx={{ 
            background: `linear-gradient(135deg, ${colorPalette[600]} 0%, ${colorPalette[800]} 100%)`,
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            mb: 2
          }}
        >
          {hasIncompleteTopics ? 'Continue Learning' : 'Welcome to Guidra'}
        </Typography>

        <Typography 
          variant="body1" 
          color="text.secondary" 
          sx={{ 
            mb: 3, 
            lineHeight: 1.6,
            fontSize: '1.1rem'
          }}
        >
          {hasIncompleteTopics 
            ? `Continue your learning journey with "${firstIncompleteSubtopic?.name}" - pick up where you left off and master this topic.`
            : 'Welcome to your personalized learning experience! Select a topic from the sidebar to begin your educational journey with AI-powered content.'
          }
        </Typography>

        {hasIncompleteTopics && (
          <Button
            variant="contained"
            size="large"
            onClick={handleClickToStart}
            startIcon={<PlayArrow />}
            sx={{
              py: 1.5,
              px: 4,
              borderRadius: 3,
              fontSize: '1.1rem',
              fontWeight: 700,
              background: `linear-gradient(135deg, ${colorPalette[500]} 0%, ${colorPalette[700]} 100%)`,
              boxShadow: '0 8px 25px rgba(126, 87, 194, 0.3)',
              '&:hover': {
                background: `linear-gradient(135deg, ${colorPalette[600]} 0%, ${colorPalette[800]} 100%)`,
                boxShadow: '0 12px 30px rgba(126, 87, 194, 0.4)',
                transform: 'translateY(-2px)'
              },
              minWidth: 220,
              height: 56,
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
            }}
          >
            Continue Learning
          </Button>
        )}

        {!hasIncompleteTopics && (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, alignItems: 'center' }}>
            <Typography 
              variant="body2" 
              color="text.secondary"
              sx={{ fontStyle: 'italic' }}
            >
              Use the menu button to explore available topics
            </Typography>
          </Box>
        )}
      </>
    );
  };

  return (
    <Fade in={true} timeout={500}>
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100%', 
        width: '100%',
        p: 3,
        position: 'relative'
      }}>
       {/* Menu Button - Top Left */}
{onOpenSidebar && (
  <Tooltip title="Open menu">
    <IconButton
      onClick={onOpenSidebar}
      sx={{
        position: 'absolute',
        top: 20,
        left: 20,
        width: 48,
        height: 48,
        display: { xs: 'flex', md: 'none' }, // Show on mobile, hide on desktop
        borderRadius: '12px',
        background: 'linear-gradient(135deg, rgba(126, 87, 194, 0.1) 0%, rgba(126, 87, 194, 0.05) 100%)',
        color: colorPalette[600],
        border: '1px solid rgba(126, 87, 194, 0.1)',
        '&:hover': {
          background: 'linear-gradient(135deg, rgba(126, 87, 194, 0.2) 0%, rgba(126, 87, 194, 0.1) 100%)',
          transform: 'translateY(-2px)',
          boxShadow: '0 8px 20px rgba(126, 87, 194, 0.15)'
        },
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        zIndex: 1000
      }}
    >
      <Menu sx={{ fontSize: 24 }} />
    </IconButton>
  </Tooltip>
)}

        <Card sx={{ 
          maxWidth: 450,
          width: '100%',
          textAlign: 'center',
          p: 4,
          borderRadius: 3,
          boxShadow: '0 12px 40px rgba(126, 87, 194, 0.15)',
          border: '1px solid rgba(126, 87, 194, 0.1)',
          background: 'linear-gradient(145deg, #ffffff 0%, #f8faff 100%)',
          position: 'relative',
          overflow: 'visible',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: -1,
            left: -1,
            right: -1,
            height: '4px',
            background: `linear-gradient(90deg, ${colorPalette[400]} 0%, ${colorPalette[500]} 50%, ${colorPalette[600]} 100%)`,
            borderTopLeftRadius: '12px',
            borderTopRightRadius: '12px'
          }
        }}>
          <CardContent sx={{ p: 0, '&:last-child': { pb: 0 } }}>
            {renderContent()}
          </CardContent>
        </Card>
      </Box>
    </Fade>
  );
};

export default WelcomeState;