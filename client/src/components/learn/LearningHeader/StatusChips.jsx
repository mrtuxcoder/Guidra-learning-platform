import React from 'react';
import { Chip, Box } from "@mui/material";
import { CheckCircle, Cached, AutoAwesome } from "@mui/icons-material";

const StatusChips = ({ selectedSubtopic, contentInfo, colorPalette }) => {
  return (
    <Box sx={{ display: 'flex', gap: 1 }}>
      {selectedSubtopic.completed && (
        <Chip
          icon={<CheckCircle sx={{ fontSize: 16 }} />}
          label="Completed"
          color="success"
          size="small"
          sx={{ 
            fontSize: '0.75rem',
            fontWeight: 600,
            background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
            color: 'white'
          }}
        />
      )}
      <Chip
        icon={contentInfo?.source === "cache" ? 
          <Cached sx={{ fontSize: 16 }} /> : 
          <AutoAwesome sx={{ fontSize: 16 }} />
        }
        label={contentInfo?.source === "cache" ? "Cached" : "AI Generated"}
        size="small"
        sx={{ 
          fontSize: '0.75rem',
          fontWeight: 600,
          background: 'rgba(126, 87, 194, 0.08)',
          color: colorPalette?.[600] || '#6d48b5',
          border: '1px solid rgba(126, 87, 194, 0.2)'
        }}
      />
    </Box>
  );
};

export default StatusChips;