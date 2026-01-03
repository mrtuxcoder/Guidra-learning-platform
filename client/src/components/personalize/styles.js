import { alpha } from "@mui/material";

export const cardStyles = {
  card: (isSelected, categoryColor) => ({
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    border: isSelected ? `2px solid ${categoryColor}` : '1px solid rgba(126, 87, 194, 0.1)',
    background: isSelected 
      ? `linear-gradient(135deg, ${alpha(categoryColor, 0.08)} 0%, ${alpha(categoryColor, 0.02)} 100%)` 
      : 'white',
    transform: isSelected ? 'translateY(-2px)' : 'none',
    boxShadow: isSelected ? '0 8px 25px rgba(126, 87, 194, 0.15)' : '0 2px 8px rgba(126, 87, 194, 0.06)',
    borderRadius: 3,
    height: '100%',
    minHeight: { xs: '140px', sm: '160px' },
    display: 'flex',
    flexDirection: 'column',
    '&:hover': {
      transform: 'translateY(-2px)',
      boxShadow: '0 8px 20px rgba(126, 87, 194, 0.1)',
    }
  }),
  cardContent: {
    p: { xs: 1.5, sm: 2 },
    position: 'relative',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    '&:last-child': { pb: { xs: 1.5, sm: 2 } }
  }
};

export const categoryIconStyles = (isSelected) => ({
  width: { xs: '50px', lg: '60px' },
  height: { xs: '50px', lg: '60px' },
  minWidth: { xs: '50px', lg: '60px' },
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  borderRadius: 2,
  backgroundColor: isSelected ? '#7C3AED' : 'transparent',
  color: isSelected ? 'white' : '#7C3AED',
  border: `2px solid ${isSelected ? '#7C3AED' : 'rgba(126, 87, 194, 0.2)'}`,
  cursor: 'pointer',
  transition: 'all 0.2s ease',
  position: 'relative',
  '&:hover': {
    backgroundColor: isSelected ? '#6B21A8' : 'rgba(126, 87, 194, 0.05)',
    transform: 'scale(1.05)',
  }
});

export const countBadgeStyles = {
  position: 'absolute',
  top: -4,
  right: -4,
  backgroundColor: '#7C3AED',
  color: 'white',
  borderRadius: '50%',
  width: 20,
  height: 20,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: '0.7rem',
  fontWeight: 'bold',
};

export const actionButtonStyles = {
  button: {
    px: { xs: 4, md: 6 },
    py: { xs: 1.25, md: 1.5 },
    fontSize: { xs: '0.9rem', md: '1rem' },
    fontWeight: 700,
    background: 'linear-gradient(135deg, #7C3AED 0%, #5E35B1 100%)',
    borderRadius: 3,
    minWidth: { xs: '160px', md: '180px' },
    boxShadow: '0 8px 25px rgba(126, 87, 194, 0.3)',
    '&:hover': {
      transform: 'translateY(-1px)',
      boxShadow: '0 12px 35px rgba(126, 87, 194, 0.4)',
    },
    '&:disabled': {
      background: 'grey.300',
      transform: 'none',
      boxShadow: 'none'
    }
  }
};