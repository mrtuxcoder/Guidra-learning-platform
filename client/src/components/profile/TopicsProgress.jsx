import React from "react";
import {
  Card,
  CardContent,
  Typography,
  Box,
  Button,
  Chip,
  alpha,
  useTheme,
  useMediaQuery
} from "@mui/material";
import { Bookmark, Logout, RocketLaunch, PersonAdd } from "@mui/icons-material";
import TopicItem from "./TopicItem";
import { useNavigate } from "react-router-dom";

const TopicsProgress = ({ 
  userProgress, 
  expandedTopics, 
  onToggleTopic,
  onLogout 
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const navigate = useNavigate();

  const handlePersonalizeClick = () => {
    navigate('/personalize');
  };

  return (
    <Card
      sx={{
        borderRadius: isMobile ? 2 : 4,
        background: 'linear-gradient(135deg, #ffffff 0%, #fafbfe 100%)',
        border: '1px solid',
        borderColor: 'divider',
        boxShadow: isMobile ? '0 2px 8px rgba(0,0,0,0.04)' : '0 8px 32px rgba(0,0,0,0.04)',
        overflow: 'visible',
        position: 'relative',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: 3,
          background: 'linear-gradient(90deg, #667eea 0%, #764ba2 100%)',
          borderTopLeftRadius: isMobile ? 8 : 16,
          borderTopRightRadius: isMobile ? 8 : 16,
        }
      }}
    >
      <CardContent sx={{ 
        p: isMobile ? 2 : 4, 
        pt: isMobile ? 3 : 5 
      }}>
        {/* Header */}
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          mb: isMobile ? 2 : 4,
          flexDirection: isMobile ? 'column' : 'row',
          gap: isMobile ? 2 : 0,
          alignItems: isMobile ? 'flex-start' : 'center'
        }}>
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: isMobile ? 1.5 : 2 
          }}>
            <Box
              sx={{
                width: isMobile ? 40 : 48,
                height: isMobile ? 40 : 48,
                borderRadius: isMobile ? 2 : 3,
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                boxShadow: '0 4px 12px rgba(102, 126, 234, 0.3)',
              }}
            >
              <Bookmark sx={{ fontSize: isMobile ? 20 : 24 }} />
            </Box>
            <Box>
              <Typography 
                variant={isMobile ? "h6" : "h5"} 
                fontWeight="800" 
                sx={{ 
                  color: 'text.primary',
                  fontSize: isMobile ? '1.1rem' : '1.5rem'
                }}
              >
                Learning Progress
              </Typography>
              <Typography 
                variant="body2" 
                color="text.secondary" 
                sx={{ 
                  mt: 0.5,
                  fontSize: isMobile ? '0.8rem' : '0.875rem'
                }}
              >
                Track your learning journey
              </Typography>
            </Box>
          </Box>
          <Chip 
            label={`${userProgress.length} topics`} 
            color="primary"
            variant="filled"
            size={isMobile ? "small" : "medium"}
            sx={{ 
              fontWeight: 700,
              fontSize: isMobile ? '0.75rem' : '0.875rem',
              height: isMobile ? 28 : 32,
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              alignSelf: isMobile ? 'flex-start' : 'center'
            }}
          />
        </Box>

        {/* Content */}
        {userProgress.length > 0 ? (
          <Box>
            {userProgress.map((topic, topicIndex) => (
              <TopicItem
                key={topicIndex}
                topic={topic}
                topicIndex={topicIndex}
                isExpanded={expandedTopics[topicIndex]}
                onToggle={onToggleTopic}
              />
            ))}
          </Box>
        ) : (
          <Box sx={{ 
            textAlign: 'center', 
            py: isMobile ? 4 : 6,
            px: isMobile ? 2 : 4,
            background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
            borderRadius: isMobile ? 2 : 3,
            border: '2px dashed',
            borderColor: 'divider',
            mb: isMobile ? 2 : 3
          }}>
            <RocketLaunch sx={{ 
              fontSize: isMobile ? 48 : 64, 
              color: 'primary.main', 
              mb: isMobile ? 1 : 2, 
              opacity: 0.7 
            }} />
            <Typography 
              variant={isMobile ? "subtitle1" : "h6"} 
              fontWeight="700" 
              color="text.primary" 
              gutterBottom
              sx={{ fontSize: isMobile ? '1rem' : '1.25rem' }}
            >
              🚀 Start Your Learning Journey
            </Typography>
            <Typography 
              variant="body2" 
              color="text.secondary" 
              sx={{ 
                maxWidth: 400, 
                mx: 'auto', 
                lineHeight: 1.5,
                fontSize: isMobile ? '0.8rem' : '0.875rem',
                mb: isMobile ? 2 : 3
              }}
            >
              Begin your first topic to track your progress and unlock your learning potential!
            </Typography>
            
            {/* Personalize Button */}
            <Button
              variant="contained"
              startIcon={<PersonAdd />}
              onClick={handlePersonalizeClick}
              size={isMobile ? "small" : "medium"}
              sx={{
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                fontWeight: 700,
                borderRadius: isMobile ? 2 : 3,
                px: isMobile ? 3 : 4,
                py: isMobile ? 1 : 1.5,
                fontSize: isMobile ? '0.875rem' : '1rem',
                textTransform: 'none',
                boxShadow: '0 4px 15px rgba(102, 126, 234, 0.3)',
                '&:hover': {
                  background: 'linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)',
                  transform: 'translateY(-2px)',
                  boxShadow: '0 8px 25px rgba(102, 126, 234, 0.4)',
                },
                transition: 'all 0.3s ease'
              }}
            >
              Start Learning
            </Button>
            
            <Typography 
              variant="caption" 
              color="text.secondary" 
              sx={{ 
                display: 'block', 
                mt: 1,
                fontStyle: 'italic',
                fontSize: isMobile ? '0.7rem' : '0.75rem'
              }}
            >
              Set up your learning preferences to get started
            </Typography>
          </Box>
        )}

        {/* Logout Button */}
        <Box sx={{ 
          mt: isMobile ? 3 : 4, 
          pt: isMobile ? 2 : 3, 
          borderTop: '1px solid',
          borderColor: 'divider',
          textAlign: 'center'
        }}>
          <Button
            variant="outlined"
            startIcon={<Logout />}
            onClick={onLogout}
            color="error"
            size={isMobile ? "small" : "medium"}
            sx={{ 
              borderRadius: isMobile ? 2 : 3,
              px: isMobile ? 3 : 4,
              py: isMobile ? 1 : 1.5,
              fontWeight: 700,
              borderWidth: 2,
              fontSize: isMobile ? '0.875rem' : '1rem',
              background: 'white',
              '&:hover': !isMobile ? {
                borderWidth: 2,
                background: alpha('#ff4444', 0.04),
                transform: 'translateY(-2px)',
                boxShadow: '0 8px 25px rgba(244, 67, 54, 0.15)',
              } : {
                borderWidth: 2,
                background: alpha('#ff4444', 0.04),
              },
              transition: 'all 0.3s ease'
            }}
          >
            Sign Out
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
};

export default TopicsProgress;