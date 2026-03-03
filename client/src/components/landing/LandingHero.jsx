import React from "react";
import {
  Box,
  Button,
  Container,
  Typography,
  Stack,
  Chip,
  alpha,
  useTheme,
} from "@mui/material";
import { profileTheme } from "../profile/constants";

const LandingHero = ({
  onStartLearning,
  onLogin,
  onRegister,
  onNavLogin,
  onNavRegister,
  isMobile,
}) => {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";

  return (
    <Box
      sx={{
        pt: { xs: 2, md: 6 },
        pb: { xs: 4, md: 8 },
        background:
          isDark
            ? `linear-gradient(180deg, ${alpha(
                theme.palette.primary.main,
                0.2
              )} 0%, ${alpha(theme.palette.background.default, 0)} 60%)`
            : "linear-gradient(180deg, rgba(126,87,194,0.12) 0%, rgba(126,87,194,0) 60%)",
      }}
    >
      <Container maxWidth="lg">
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            mb: { xs: 2.5, md: 6 },
            gap: { xs: 1, md: 0 },
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
            <Box
              sx={{
                width: 36,
                height: 36,
                borderRadius: 2,
                background: profileTheme.gradient,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "white",
                fontWeight: 700,
              }}
            >
              G
            </Box>
            <Typography
              variant="h6"
              sx={{
                fontWeight: 700,
                letterSpacing: 0.2,
              }}
            >
              Guidra
            </Typography>
          </Box>
          <Stack direction="row" spacing={1} sx={{ flexShrink: 0 }}>
            <Button
              onClick={onNavLogin}
              size="small"
              variant="text"
              sx={{
                textTransform: "none",
                fontWeight: 600,
                color: "text.secondary",
                minWidth: { xs: 72, md: "auto" },
              }}
            >
              Login
            </Button>
            <Button
              onClick={onNavRegister}
              size="small"
              variant="outlined"
              sx={{
                textTransform: "none",
                fontWeight: 600,
                borderColor: "rgba(126,87,194,0.4)",
                minWidth: { xs: 84, md: "auto" },
                color: isDark
                  ? profileTheme.primaryLight
                  : profileTheme.primaryDark,
              }}
            >
              Register
            </Button>
          </Stack>
        </Box>

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", md: "1.1fr 0.9fr" },
            gap: { xs: 2.5, md: 6 },
            alignItems: "center",
          }}
        >
          <Box sx={{ textAlign: { xs: "center", md: "left" } }}>
            <Chip
              label="Structured AI learning"
              size="small"
              sx={{
                mb: 2,
                bgcolor: alpha(profileTheme.primary, isDark ? 0.24 : 0.12),
                color: isDark
                  ? profileTheme.primaryLight
                  : profileTheme.primaryDark,
                fontWeight: 600,
              }}
            />
            <Typography
              variant={isMobile ? "h4" : "h2"}
              sx={{
                fontWeight: 800,
                lineHeight: 1.1,
                mb: { xs: 1.25, md: 2 },
                fontSize: { xs: "1.95rem", sm: "2.2rem", md: "inherit" },
              }}
            >
              Guidra is structured learning, not chat.
            </Typography>
            <Typography
              variant={isMobile ? "h5" : "h4"}
              sx={{
                fontWeight: 700,
                color: isDark
                  ? profileTheme.primaryLight
                  : profileTheme.primaryDark,
                mb: { xs: 1.25, md: 2 },
                fontSize: { xs: "1.2rem", sm: "1.4rem", md: "inherit" },
              }}
            >
              A calm, predictable study flow built for real understanding.
            </Typography>
            <Typography
              variant="body1"
              sx={{
                color: "text.secondary",
                maxWidth: 520,
                mb: { xs: 2, md: 3 },
                mx: { xs: "auto", md: 0 },
                fontSize: { xs: "0.95rem", md: "1.05rem" },
              }}
            >
              Guidra is not a chatbot. It gives you topic-based learning paths
              with subtopics, explanations, mindmaps, practice, quizzes,
              progress tracking, and recall mode for completed topics.
            </Typography>
            <Stack
              direction={{ xs: "column", sm: "row" }}
              spacing={1.25}
              justifyContent={{ xs: "center", md: "flex-start" }}
              alignItems={{ xs: "stretch", sm: "center" }}
              sx={{ width: { xs: "100%", sm: "auto" } }}
            >
              <Button
                variant="contained"
                onClick={onStartLearning}
                sx={{
                  textTransform: "none",
                  borderRadius: 2,
                  fontWeight: 700,
                  px: 3,
                  py: { xs: 1.15, md: 0.95 },
                  width: { xs: "100%", sm: "auto" },
                  background: profileTheme.gradient,
                }}
              >
                Get Started
              </Button>
              <Button
                variant="outlined"
                onClick={onLogin}
                sx={{
                  textTransform: "none",
                  borderRadius: 2,
                  fontWeight: 600,
                  py: { xs: 1.15, md: 0.95 },
                  width: { xs: "100%", sm: "auto" },
                  borderColor: "rgba(126,87,194,0.4)",
                  color: isDark
                    ? profileTheme.primaryLight
                    : profileTheme.primaryDark,
                }}
              >
                Login
              </Button>
            </Stack>
          </Box>

          <Box
            sx={{
              position: "relative",
              height: { xs: 180, sm: 220, md: 320 },
              borderRadius: 3,
              border: "1px solid rgba(126,87,194,0.2)",
              background:
                "linear-gradient(135deg, rgba(126,87,194,0.12) 0%, rgba(94,53,177,0.04) 100%)",
              overflow: "hidden",
              maxWidth: { xs: "460px", md: "none" },
              mx: { xs: "auto", md: 0 },
            }}
          >
            <Box
              sx={{
                position: "absolute",
                top: 16,
                left: 16,
                right: 16,
                height: 12,
                borderRadius: 999,
                bgcolor: "rgba(126,87,194,0.16)",
              }}
            />
            <Box
              sx={{
                position: "absolute",
                inset: 0,
                display: "grid",
                gridTemplateColumns: "repeat(4, 1fr)",
                gap: { xs: 1, md: 1.5 },
                p: { xs: 2, md: 3 },
              }}
            >
              {Array.from({ length: 12 }).map((_, index) => (
                <Box
                  key={index}
                  sx={{
                    borderRadius: 2,
                    border: "1px solid rgba(126,87,194,0.2)",
                    bgcolor:
                      index % 3 === 0
                        ? alpha(profileTheme.primary, isDark ? 0.28 : 0.18)
                        : alpha(theme.palette.background.paper, isDark ? 0.35 : 0.6),
                  }}
                />
              ))}
            </Box>
            <Box
              sx={{
                position: "absolute",
                bottom: 16,
                left: 16,
                right: 16,
                display: "flex",
                gap: 1,
              }}
            >
              <Box
                sx={{
                  flex: 1,
                  height: 10,
                  borderRadius: 999,
                  bgcolor: "rgba(126,87,194,0.35)",
                }}
              />
              <Box
                sx={{
                  width: 40,
                  height: 10,
                  borderRadius: 999,
                  bgcolor: "rgba(126,87,194,0.15)",
                }}
              />
            </Box>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default LandingHero;
