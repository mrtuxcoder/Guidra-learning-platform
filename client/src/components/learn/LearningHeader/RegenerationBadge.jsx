import React from 'react';
import { Box, IconButton, Button, Tooltip, Typography, CircularProgress } from "@mui/material";
import { Lock, Refresh } from "@mui/icons-material";

const RegenerationBadge = ({
  remainingGenerations,
  contentLoading,
  onRegenerateContent,
  colorPalette,
  variant = 'desktop'
}) => {
  const isMobile = variant === 'mobile';
  
  if (isMobile) {
    return (
      <Tooltip title={
        remainingGenerations === 0 
          ? "No regenerations available" 
          : `${remainingGenerations} regenerations available`
      } placement="top">
        <Box 
          component="span"
          sx={{ 
            display: 'flex',
            alignItems: 'center',
            gap: 0.6,
            background: remainingGenerations === 0 
              ? 'rgba(239, 68, 68, 0.08)' 
              : 'rgba(126, 87, 194, 0.08)',
            borderRadius: '10px',
            px: 1.2,
            py: 0.4,
            border: remainingGenerations === 0 
              ? '1px solid rgba(239, 68, 68, 0.15)' 
              : '1px solid rgba(126, 87, 194, 0.15)'
          }}
        >
          <Box component="span" sx={{ textAlign: 'center' }}>
            <Typography variant="caption" sx={{ 
              color: remainingGenerations === 0 ? '#ef4444' : (colorPalette?.[600] || '#6d48b5'),
              fontSize: '0.6rem',
              fontWeight: 800,
              lineHeight: 1,
              display: 'block'
            }}>
              {remainingGenerations}
            </Typography>
            <Typography variant="caption" sx={{ 
              color: remainingGenerations === 0 ? '#ef4444' : (colorPalette?.[500] || '#7e57c2'),
              fontSize: '0.45rem',
              fontWeight: 700,
              lineHeight: 1,
              display: 'block'
            }}>
              REGEN
            </Typography>
          </Box>
          
          <Tooltip title={remainingGenerations === 0 ? "No regenerations left" : "Regenerate content"} placement="top">
            <IconButton
              onClick={onRegenerateContent}
              disabled={contentLoading || remainingGenerations === 0}
              size="small"
              sx={{
                width: 26,
                height: 26,
                borderRadius: '7px',
                color: remainingGenerations === 0 ? '#ef4444' : (colorPalette?.[600] || '#6d48b5'),
                background: remainingGenerations === 0 
                  ? 'rgba(239, 68, 68, 0.1)' 
                  : 'rgba(126, 87, 194, 0.1)',
                '&:hover': !contentLoading && remainingGenerations > 0 ? {
                  background: 'rgba(126, 87, 194, 0.18)',
                  transform: 'scale(1.1)'
                } : {},
                transition: 'all 0.2s ease'
              }}
            >
              {contentLoading ? (
                <CircularProgress size={10} />
              ) : remainingGenerations === 0 ? (
                <Lock sx={{ fontSize: 12 }} />
              ) : (
                <Refresh sx={{ fontSize: 12 }} />
              )}
            </IconButton>
          </Tooltip>
        </Box>
      </Tooltip>
    );
  }

  return (
    <Tooltip title={
      remainingGenerations === 0
        ? `No regenerations available`
        : `${remainingGenerations} regenerations available`
    }>
      <Button
        startIcon={
          remainingGenerations === 0
            ? <Lock sx={{ fontSize: 18 }} />
            : contentLoading ? <CircularProgress size={18} /> : <Refresh sx={{ fontSize: 18 }} />
        }
        onClick={onRegenerateContent}
        disabled={contentLoading || remainingGenerations === 0}
        variant="outlined"
        size="small"
        sx={{
          borderColor: remainingGenerations === 0 ? '#ef4444' : (colorPalette?.[500] || '#7e57c2'),
          color: remainingGenerations === 0 ? '#ef4444' : (colorPalette?.[600] || '#6d48b5'),
          background: remainingGenerations === 0 ? 'rgba(239, 68, 68, 0.04)' : 'rgba(126, 87, 194, 0.04)',
          fontWeight: 600,
          borderRadius: 2,
          px: 2,
          '&:hover': {
            background: remainingGenerations === 0 ? 'rgba(239, 68, 68, 0.08)' : 'rgba(126, 87, 194, 0.08)',
            transform: 'translateY(-1px)',
            boxShadow: '0 4px 12px rgba(126, 87, 194, 0.1)'
          },
          transition: 'all 0.2s ease'
        }}
      >
        {contentLoading ? "Regenerating..." : "Regenerate"}
      </Button>
    </Tooltip>
  );
};

export default RegenerationBadge;