import { styled } from "@mui/material";
import { Card, Button } from "@mui/material";

export const EliteCard = styled(Card, {
  shouldForwardProp: (prop) => prop !== 'isSelected'
})(({ theme, isSelected }) => ({
  borderRadius: theme.shape.borderRadius * 3,
  transition: 'all 0.3s ease-in-out',
  height: '100%',
  border: `2px solid ${isSelected ? theme.palette.primary.main : theme.palette.divider}`,
  boxShadow: isSelected 
    ? `0 10px 30px rgba(102, 126, 234, 0.4), 0 0 0 4px ${theme.palette.primary.light}` 
    : '0 4px 15px rgba(0, 0, 0, 0.1)',
  cursor: 'pointer',
  '&:hover': {
    transform: 'translateY(-3px)',
    boxShadow: `0 15px 40px rgba(102, 126, 234, 0.5)`
  },
  backgroundColor: isSelected ? theme.palette.primary.light + '10' : theme.palette.background.paper,
}));

export const StyledButton = styled(Button)(({ theme }) => ({
  borderRadius: 50,
  padding: '12px 30px',
  fontWeight: 'bold',
  letterSpacing: '0.05em',
  textTransform: 'uppercase',
}));