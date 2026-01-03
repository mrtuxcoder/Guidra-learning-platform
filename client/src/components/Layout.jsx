import { Box } from '@mui/material';
import Navbar from '../components/Navbar/index'; 

export default function Layout({ children }) {
  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      <Navbar />
      <Box component="main">
        {children}
      </Box>
    </Box>
  );
}