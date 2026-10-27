import { Box } from "@mui/material";
import { useMediaQuery, useTheme } from "@mui/material";
import { useLocation } from "react-router-dom";
import Navbar from "../components/Navbar/index";
import TimerCompletionDialog from "./TimerCompletionDialog";
import { useUser } from "../contexts/UserContext";

export default function Layout({ children }) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const { user } = useUser();
  const location = useLocation();
  const isLearnPage = location.pathname.startsWith("/learn");
  const isExplorePage = location.pathname.startsWith("/explore");
  const isFullHeightPage = isLearnPage || isExplorePage;

  return (
    <Box
      sx={{
        height: isFullHeightPage ? "100vh" : undefined,
        minHeight: "100vh",
        bgcolor: "background.default",
        display: isFullHeightPage ? "flex" : undefined,
        flexDirection: isFullHeightPage ? "column" : undefined,
        overflow: isFullHeightPage ? "hidden" : undefined,
      }}
    >
      <Navbar />
      <Box
        component="main"
        sx={{
          flex: isFullHeightPage ? 1 : undefined,
          height: isFullHeightPage
            ? { xs: "calc(100dvh - 56px)", sm: "calc(100dvh - 64px)" }
            : undefined,
          overflow: isFullHeightPage ? "hidden" : undefined,
          pb: isMobile && user && !isFullHeightPage ? "80px" : 0,
        }}
      >
        {children}
      </Box>
      <TimerCompletionDialog />
    </Box>
  );
}
