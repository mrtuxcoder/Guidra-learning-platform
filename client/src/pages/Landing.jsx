import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  Box,
  Container,
  Fade,
  Slide,
  Typography,
  alpha,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";
import { loginUser, registerUser, startGoogleOAuth } from "../api";
import LandingHero from "../components/landing/LandingHero";
import LandingProblem from "../components/landing/LandingProblem";
import LandingSolution from "../components/landing/LandingSolution";
import LandingRegeneration from "../components/landing/LandingRegeneration";
import LandingProgress from "../components/landing/LandingProgress";
import LandingNavPreview from "../components/landing/LandingNavPreview";
import LandingCTA from "../components/landing/LandingCTA";
import LandingFooter from "../components/landing/LandingFooter";
import LandingAuthPanel from "../components/landing/LandingAuthPanel";

const Landing = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const isDark = theme.palette.mode === "dark";
  const location = useLocation();
  const navigate = useNavigate();
  const authRef = useRef(null);

  const initialTab = useMemo(() => {
    if (location.pathname === "/register") return "register";
    return "login";
  }, [location.pathname]);

  const [activeTab, setActiveTab] = useState(initialTab);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setActiveTab(initialTab);
  }, [initialTab]);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    setError("");
  }, [activeTab]);

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const oauthError = urlParams.get("error");

    if (!oauthError) return;

    let message = "Authentication failed. Please try again.";
    if (oauthError === "auth_failed") {
      message = "Google authentication failed.";
    }
    if (oauthError === "no_user") {
      message = "Unable to retrieve user info.";
    }

    setError(message);
    window.history.replaceState(
      {},
      document.title,
      window.location.origin + window.location.pathname
    );
  }, [location.search]);

  const scrollToAuth = () => {
    authRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    if (tab === "register") {
      navigate("/register", { replace: true });
    } else {
      navigate("/login", { replace: true });
    }
  };

  const handleChange = (event) => {
    setFormData((prev) => ({
      ...prev,
      [event.target.name]: event.target.value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (activeTab === "register") {
        if (formData.password !== formData.confirmPassword) {
          setError("Passwords do not match.");
          setLoading(false);
          return;
        }
        await registerUser({
          name: formData.name,
          email: formData.email,
          password: formData.password,
          confirmPassword: formData.confirmPassword,
        });
        window.location.href = "/explore";
        return;
      }

      await loginUser({
        email: formData.email,
        password: formData.password,
      });
      navigate("/profile", { replace: true });
    } catch (err) {
      setError(
        err.response?.data?.error ||
          err.response?.data?.message ||
          "Unable to continue. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    setGoogleLoading(true);
    setError("");
    startGoogleOAuth();
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: isDark
          ? `radial-gradient(circle at top, ${alpha(
              theme.palette.primary.main,
              0.2
            )} 0%, ${theme.palette.background.default} 55%)`
          : "linear-gradient(135deg, #FAF7FE 0%, #FFFFFF 100%)",
        color: theme.palette.text.primary,
      }}
    >
      <Fade in={mounted} timeout={800}>
        <Box>
          <LandingHero
            isMobile={isMobile}
            onStartLearning={() => {
              handleTabChange("register");
              scrollToAuth();
            }}
            onLogin={() => {
              handleTabChange("login");
              scrollToAuth();
            }}
            onRegister={() => {
              handleTabChange("register");
              scrollToAuth();
            }}
            onNavLogin={() => {
              handleTabChange("login");
              scrollToAuth();
            }}
            onNavRegister={() => {
              handleTabChange("register");
              scrollToAuth();
            }}
          />

          <LandingProblem />
          <LandingSolution />
          <LandingRegeneration />
          <LandingProgress />
          <LandingNavPreview />

          <Box
            ref={authRef}
            sx={{ py: { xs: 5, md: 7 }, background: "background.paper" }}
          >
            <Container maxWidth="lg">
              <Slide in={mounted} direction="up" timeout={700}>
                <Box
                  sx={{
                    display: "grid",
                    gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
                    gap: { xs: 3, md: 4 },
                    alignItems: "center",
                  }}
                >
                  <Box>
                    <Typography
                      variant="h4"
                      sx={{
                        fontWeight: 700,
                        mb: 2,
                        fontFamily: '"Space Grotesk", sans-serif',
                      }}
                    >
                      Start with a structured account
                    </Typography>
                    <Typography sx={{ color: "text.secondary", mb: 2 }}>
                      Your dashboard keeps lessons, versions, and revision paths
                      in one place. Switch between login and register any time.
                    </Typography>
                    <Typography
                      sx={{ color: "text.secondary", fontSize: "0.95rem" }}
                    >
                      Built for focused study sessions and exam preparation.
                    </Typography>
                  </Box>
                  <LandingAuthPanel
                    activeTab={activeTab}
                    onTabChange={handleTabChange}
                    formData={formData}
                    onChange={handleChange}
                    onSubmit={handleSubmit}
                    onGoogleLogin={handleGoogleLogin}
                    loading={loading}
                    googleLoading={googleLoading}
                    error={error}
                  />
                </Box>
              </Slide>
            </Container>
          </Box>

          <LandingCTA
            onCreateAccount={() => {
              handleTabChange("register");
              scrollToAuth();
            }}
            onLogin={() => {
              handleTabChange("login");
              scrollToAuth();
            }}
          />
          <LandingFooter />
        </Box>
      </Fade>
    </Box>
  );
};

export default Landing;
