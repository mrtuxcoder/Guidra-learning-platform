import React from "react";
import {
  Box,
  Container,
  Typography,
  Button,
  Grid,
  useTheme,
  useMediaQuery,
  alpha,
  Card,
} from "@mui/material";
import {
  Download,
  PhoneIphone,
  Speed,
  Lock,
  Wifi,
} from "@mui/icons-material";

const mobileFeatures = [
  {
    icon: <Speed sx={{ fontSize: 32 }} />,
    title: "Lightning Fast",
    detail: "Optimized PWA app with instant load times and smooth, responsive experience.",
  },
  {
    icon: <Wifi sx={{ fontSize: 32 }} />,
    title: "Works Offline",
    detail: "Access all cached lessons, quizzes, and progress even without internet connection.",
  },
  {
    icon: <Lock sx={{ fontSize: 32 }} />,
    title: "Secure & Private",
    detail: "Your data stays on your device with encrypted storage and secure authentication.",
  },
];

const LandingMobileApp = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const isDark = theme.palette.mode === "dark";

  const downloadAPK = () => {
    // Replace with your actual APK download URL
    window.open(
      "https://drive.google.com/file/d/1wt3HAWypHbpgSrvdvchQpXn_iVq2GGpW/view?usp=drivesdk",
      "_blank"
    );
  };

  return (
    <Box
      sx={{
        py: { xs: 5, md: 7 },
        background:
          theme.palette.mode === "dark"
            ? `linear-gradient(135deg, ${alpha(
                theme.palette.primary.main,
                0.2
              )} 0%, ${alpha(theme.palette.primary.main, 0.05)} 100%)`
            : "linear-gradient(135deg, rgba(126,87,194,0.1) 0%, rgba(126,87,194,0.02) 100%)",
      }}
    >
      <Container maxWidth="lg">
        <Grid
          container
          spacing={{ xs: 3, md: 5 }}
          alignItems="center"
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
          }}
        >
          {/* Left Side - Features */}
          <Box>
            <Typography
              variant="h4"
              sx={{
                fontWeight: 800,
                mb: 1,
                fontFamily: '"Space Grotesk", sans-serif',
              }}
            >
              Mobile App
            </Typography>
            <Typography
              sx={{
                color: "text.secondary",
                mb: 3,
                fontSize: "1.05rem",
                lineHeight: 1.6,
              }}
            >
              Get the best learning experience on the go with our PWA app. Install it on your phone for faster access, offline support, and a native app feel.
            </Typography>

            <Box sx={{ mb: 3 }}>
              {mobileFeatures.map((feature, index) => (
                <Box
                  key={index}
                  sx={{
                    display: "flex",
                    gap: 2,
                    mb: 2.5,
                    pb: 2.5,
                    borderBottom:
                      index < mobileFeatures.length - 1
                        ? `1px solid ${alpha(
                            theme.palette.divider,
                            theme.palette.mode === "dark" ? 0.3 : 0.1
                          )}`
                        : "none",
                  }}
                >
                  <Box
                    sx={{
                      color: theme.palette.primary.main,
                      display: "flex",
                      alignItems: "flex-start",
                      pt: 0.5,
                      flexShrink: 0,
                    }}
                  >
                    {feature.icon}
                  </Box>
                  <Box>
                    <Typography
                      sx={{
                        fontWeight: 600,
                        mb: 0.5,
                        color: "text.primary",
                      }}
                    >
                      {feature.title}
                    </Typography>
                    <Typography
                      sx={{
                        color: "text.secondary",
                        fontSize: "0.95rem",
                      }}
                    >
                      {feature.detail}
                    </Typography>
                  </Box>
                </Box>
              ))}
            </Box>

            <Button
              variant="contained"
              size="large"
              startIcon={<Download />}
              onClick={downloadAPK}
              sx={{
                background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
                color: "white",
                fontWeight: 600,
                py: 1.5,
                px: 3,
                borderRadius: 2,
                "&:hover": {
                  boxShadow: `0 12px 30px ${alpha(
                    theme.palette.primary.main,
                    0.3
                  )}`,
                  transform: "translateY(-2px)",
                },
                transition: "all 0.3s ease",
              }}
            >
              Download APK
            </Button>

            <Typography
              sx={{
                color: "text.secondary",
                fontSize: "0.85rem",
                mt: 2,
              }}
            >
              Available for Android. PWA wrapper for optimal mobile experience.
            </Typography>
          </Box>

          {/* Right Side - Visual */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Card
              sx={{
                width: "100%",
                maxWidth: "300px",
                background: isDark
                  ? `linear-gradient(135deg, ${alpha(
                      theme.palette.primary.main,
                      0.15
                    )} 0%, ${alpha(
                      theme.palette.background.paper,
                      1
                    )} 100%)`
                  : `linear-gradient(135deg, ${alpha(
                      theme.palette.primary.main,
                      0.08
                    )} 0%, white 100%)`,
                border: `1px solid ${alpha(
                  theme.palette.primary.main,
                  theme.palette.mode === "dark" ? 0.2 : 0.1
                )}`,
                borderRadius: 4,
                p: 4,
                textAlign: "center",
                boxShadow: `0 20px 60px ${alpha(
                  theme.palette.primary.main,
                  0.15
                )}`,
              }}
            >
              <Box
                sx={{
                  fontSize: "4rem",
                  mb: 2,
                  color: theme.palette.primary.main,
                }}
              >
                <PhoneIphone sx={{ fontSize: "4rem" }} />
              </Box>
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 700,
                  mb: 1,
                  color: "text.primary",
                }}
              >
                Native App Experience
              </Typography>
              <Typography
                sx={{
                  color: "text.secondary",
                  fontSize: "0.9rem",
                  lineHeight: 1.6,
                }}
              >
                Install on your home screen and use Guidra like a native app. Fast, reliable, and always available.
              </Typography>
            </Card>
          </Box>
        </Grid>
      </Container>
    </Box>
  );
};

export default LandingMobileApp;
