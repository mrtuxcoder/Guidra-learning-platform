import React from "react";
import {
  Box,
  Container,
  Paper,
  Fade,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import AuthHeader from "./AuthHeader";
import AuthSidebar from "./AuthSidebar";
import { formStyles } from "./styles";

const AuthLayout = ({ children, formType, features, sidebarTitle }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const config =
    formType === "REGISTER"
      ? {
          greeting: "Create your free account to start learning today.",
          greetingFull:
            "Start learning with clean, structured AI lessons tailored for beginners.",
        }
      : {
          greeting: "Access your saved courses, cached lessons, and progress.",
          greetingFull:
            "Access your saved courses, cached lessons, and progress.",
        };

  return (
    <Fade in={true} timeout={800}>
      <Box sx={{ minHeight: "100vh", bgcolor: "#FAF7FE", overflowX: "hidden" }}>
        {isMobile && <AuthHeader title="Guidra" subtitle={config.greeting} />}

        <Container
          maxWidth="xl"
          sx={{
            px: { xs: 2, sm: 3 },
            mt: isMobile ? -5 : 0,
            pt: isMobile ? 0 : { md: 0 },
            pb: 4,
            position: "relative",
            zIndex: 2,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            minHeight: isMobile ? "auto" : "100vh",
          }}
        >
          <Paper sx={formStyles.paper(isMobile)}>
            {/* Desktop Sidebar */}
            {!isMobile && (
              <AuthSidebar
                features={features}
                title="Guidra"
                subtitle={config.greetingFull}
              />
            )}

            {/* Form Side */}
            <Box sx={formStyles.formContainer(isMobile)}>{children}</Box>
          </Paper>
        </Container>
      </Box>
    </Fade>
  );
};

export default AuthLayout;
