import { Box } from "@mui/material";
import { useMediaQuery, useTheme } from "@mui/material";
import Navbar from "../components/Navbar/index";
import TimerCompletionDialog from "./TimerCompletionDialog";
import { useUser } from "../contexts/UserContext";

export default function Layout({ children }) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const { user } = useUser();

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "background.default" }}>
      <Navbar />
      <Box component="main" sx={{ pb: isMobile && user ? "80px" : 0 }}>
        {children}
      </Box>
      <TimerCompletionDialog />
    </Box>
  );
}
