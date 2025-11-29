
import React from 'react';
import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Chip,
  Tooltip,
  Card,
  CardContent,
  LinearProgress,
  IconButton,
  useTheme,
  useMediaQuery
} from "@mui/material";
import {
  CheckCircle,
  RadioButtonUnchecked,
  PlayArrow,
  Close
} from "@mui/icons-material";

const LearningSidebar = ({
  topics,
  subtopics,
  selectedTopic,
  selectedSubtopic,
  updatingSubtopic,
  contentCache,
  generationCounts,
  onTopicSelect,
  onSubtopicSelect,
  onUpdateUnderstanding,
  progress,
  colorPalette,
  onCloseSidebar // New prop for closing sidebar
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const isSmallMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const SubtopicItem = ({ subtopic, index }) => (
    <ListItem 
      selected={selectedSubtopic?.name === subtopic.name}
      onClick={() => onSubtopicSelect(subtopic)}
      disabled={updatingSubtopic === subtopic.name}
      sx={{ 
        borderRadius: 2,
        mb: 1,
        py: isSmallMobile ? 1.5 : 2,
        px: isSmallMobile ? 1.5 : 2,
        backgroundColor: selectedSubtopic?.name === subtopic.name ? colorPalette[600] : 'transparent',
        color: selectedSubtopic?.name === subtopic.name ? 'white' : 'text.primary',
        border: selectedSubtopic?.name === subtopic.name ? '2px solid' : '1px solid',
        borderColor: selectedSubtopic?.name === subtopic.name ? colorPalette[600] : colorPalette[100],
        '&:hover': {
          backgroundColor: selectedSubtopic?.name === subtopic.name ? colorPalette[700] : colorPalette[50],
          borderColor: selectedSubtopic?.name === subtopic.name ? colorPalette[700] : colorPalette[200],
        },
        '&.Mui-disabled': {
          opacity: 0.6,
          pointerEvents: 'none'
        },
        cursor: 'pointer',
        transition: 'all 0.2s ease-in-out'
      }}
    >
      <Box sx={{ width: '100%' }}>
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between', 
          mb: 1,
          gap: 1
        }}>
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: 1,
            minWidth: 0,
            flex: 1
          }}>
            <ListItemIcon sx={{ minWidth: 28 }}>
              {updatingSubtopic === subtopic.name ? (
                <Box sx={{ width: 20, height: 20, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Box 
                    sx={{ 
                      width: 12, 
                      height: 12, 
                      borderRadius: '50%', 
                      border: `2px solid ${selectedSubtopic?.name === subtopic.name ? 'rgba(255,255,255,0.5)' : colorPalette[400]}`,
                      borderTop: `2px solid transparent`,
                      animation: 'spin 1s linear infinite',
                      '@keyframes spin': {
                        '0%': { transform: 'rotate(0deg)' },
                        '100%': { transform: 'rotate(360deg)' }
                      }
                    }} 
                  />
                </Box>
              ) : subtopic.completed ? (
                <CheckCircle color="inherit" fontSize="small" />
              ) : contentCache[subtopic.name] ? (
                <PlayArrow color="inherit" fontSize="small" />
              ) : (
                <RadioButtonUnchecked color="inherit" fontSize="small" />
              )}
            </ListItemIcon>
            <Typography 
              variant="body2" 
              fontWeight="600"
              sx={{
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap'
              }}
            >
              {subtopic.name}
            </Typography>
          </Box>
          
          {subtopic.completed && (
            <Chip 
              label="Completed" 
              size="small" 
              color="success"
              sx={{ 
                height: 20,
                fontSize: '0.7rem',
                '& .MuiChip-label': { 
                  px: 1, 
                  fontSize: '0.7rem',
                  fontWeight: 600
                }
              }}
            />
          )}
        </Box>

        {/* Content Status Indicator */}
        {contentCache[subtopic.name] && (
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: 0.5,
            mt: 0.5
          }}>
            <Box 
              sx={{
                width: 6,
                height: 6,
                borderRadius: '50%',
                backgroundColor: selectedSubtopic?.name === subtopic.name ? 
                  'rgba(255,255,255,0.7)' : 
                  colorPalette[400]
              }}
            />
            <Typography 
              variant="caption" 
              sx={{ 
                color: selectedSubtopic?.name === subtopic.name ? 'rgba(255,255,255,0.8)' : 'text.secondary',
                fontSize: '0.7rem',
                fontWeight: 500
              }}
            >
              Content ready
            </Typography>
          </Box>
        )}
      </Box>
    </ListItem>
  );

  const TopicItem = ({ topic, index }) => (
    <ListItem 
      onClick={() => onTopicSelect(topic.topic)}
      selected={selectedTopic === topic.topic}
      sx={{ 
        borderRadius: 2,
        mb: 1,
        py: isSmallMobile ? 1 : 1.5,
        px: isSmallMobile ? 1.5 : 2,
        backgroundColor: selectedTopic === topic.topic ? colorPalette[100] : 'transparent',
        border: '1px solid',
        borderColor: selectedTopic === topic.topic ? colorPalette[300] : 'transparent',
        '&:hover': {
          backgroundColor: selectedTopic === topic.topic ? colorPalette[100] : colorPalette[50],
          borderColor: selectedTopic === topic.topic ? colorPalette[300] : colorPalette[200],
        },
        cursor: 'pointer',
        transition: 'all 0.2s ease-in-out'
      }}
    >
      <ListItemText 
        primary={
          <Typography 
            variant="body2" 
            fontWeight="600"
            sx={{
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap'
            }}
          >
            {topic.topic}
          </Typography>
        } 
        secondary={
          <Typography variant="caption" color="text.secondary">
            {topic.subTopics?.filter(s => s.completed).length || 0}/{topic.subTopics?.length || 0} completed
          </Typography>
        }
        sx={{ my: 0 }}
      />
    </ListItem>
  );

  return (
    <Card sx={{ 
      width: '100%', 
      height: '100%',
      borderRadius: { xs: 0, md: 3 },
      boxShadow: { xs: 'none', md: '0 8px 32px rgba(126, 87, 194, 0.12)' },
      display: 'flex',
      flexDirection: 'column',
      background: 'white',
      border: { xs: 'none', md: '1px solid rgba(126, 87, 194, 0.1)' },
      position: 'relative'
    }}>
      {/* Header Section with Exit Button */}
      <Box sx={{ 
        p: { xs: 2, sm: 3 }, 
        borderBottom: '1px solid', 
        borderColor: colorPalette[100],
        position: 'relative'
      }}>
        {/* Exit Button - Top Right */}
        <IconButton
          onClick={onCloseSidebar}
          sx={{
            position: 'absolute',
            top: 12,
            right: 12,
            width: 32,
            height: 32,
            borderRadius: 2,
            backgroundColor: colorPalette[50],
            color: colorPalette[600],
            border: `1px solid ${colorPalette[200]}`,
            '&:hover': {
              backgroundColor: colorPalette[100],
              transform: 'scale(1.1)',
            },
            transition: 'all 0.2s ease-in-out'
          }}
        >
          <Close fontSize="small" />
        </IconButton>

        <Typography 
          variant={isMobile ? "h6" : "h5"} 
          fontWeight="800" 
          gutterBottom 
          sx={{ 
            color: colorPalette[600],
            pr: 4 // Make space for exit button
          }}
        >
          📚 Learning Path
        </Typography>
        
        {/* Progress Card */}
        <Card sx={{ 
          background: `linear-gradient(135deg, ${colorPalette[500]} 0%, ${colorPalette[700]} 100%)`, 
          color: 'white', 
          p: 2, 
          borderRadius: 2, 
          mt: 2,
          boxShadow: '0 4px 16px rgba(126, 87, 194, 0.2)'
        }}>
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center', 
            mb: 1 
          }}>
            <Typography variant="body2" fontWeight="600">
              Course Progress
            </Typography>
            <Chip 
              label={`${Math.round(progress)}%`}
              size="small"
              sx={{ 
                backgroundColor: 'rgba(255,255,255,0.2)', 
                color: 'white',
                fontWeight: 700,
                fontSize: '0.75rem'
              }}
            />
          </Box>
          <LinearProgress 
            variant="determinate" 
            value={progress} 
            sx={{ 
              height: 8, 
              borderRadius: 4,
              backgroundColor: 'rgba(255,255,255,0.3)',
              '& .MuiLinearProgress-bar': {
                backgroundColor: 'white',
                borderRadius: 4
              }
            }}
          />
          <Typography 
            variant="caption" 
            sx={{ 
              opacity: 0.9, 
              mt: 1, 
              display: 'block',
              fontWeight: 500
            }}
          >
            {subtopics.filter(s => s.completed).length} of {subtopics.length} topics completed
          </Typography>
        </Card>
      </Box>

      {/* Topics Section */}
      <Box sx={{ 
        p: { xs: 1.5, sm: 2 }, 
        borderBottom: '1px solid', 
        borderColor: colorPalette[100] 
      }}>
        <Typography 
          variant="subtitle1" 
          fontWeight="700" 
          gutterBottom 
          sx={{ 
            color: colorPalette[600],
            display: 'flex',
            alignItems: 'center',
            gap: 1
          }}
        >
          <Box 
            component="span"
            sx={{
              width: 4,
              height: 16,
              borderRadius: 1,
              background: `linear-gradient(135deg, ${colorPalette[500]} 0%, ${colorPalette[600]} 100%)`
            }}
          />
          Your Topics
        </Typography>
        <Box sx={{ 
          maxHeight: 120, 
          overflow: 'auto',
          '&::-webkit-scrollbar': {
            width: 4,
          },
          '&::-webkit-scrollbar-track': {
            background: colorPalette[50],
            borderRadius: 2,
          },
          '&::-webkit-scrollbar-thumb': {
            background: colorPalette[300],
            borderRadius: 2,
          }
        }}>
          <List dense sx={{ py: 0 }}>
            {topics.map((topic, index) => (
              <TopicItem key={index} topic={topic} index={index} />
            ))}
          </List>
        </Box>
      </Box>

      {/* Subtopics Section */}
      <Box sx={{ 
        flex: 1, 
        overflow: 'auto',
        p: { xs: 1.5, sm: 2 }
      }}>
        <Typography 
          variant="subtitle1" 
          fontWeight="700" 
          gutterBottom 
          sx={{ 
            color: colorPalette[600],
            display: 'flex',
            alignItems: 'center',
            gap: 1
          }}
        >
          <Box 
            component="span"
            sx={{
              width: 4,
              height: 16,
              borderRadius: 1,
              background: `linear-gradient(135deg, ${colorPalette[500]} 0%, ${colorPalette[600]} 100%)`
            }}
          />
          Subtopics
        </Typography>
        <List sx={{ py: 0 }}>
          {subtopics.map((subtopic, index) => (
            <SubtopicItem key={index} subtopic={subtopic} index={index} />
          ))}
        </List>
      </Box>
    </Card>
  );
};

export default LearningSidebar;