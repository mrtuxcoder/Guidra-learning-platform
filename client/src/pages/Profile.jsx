import React from "react";
import {
  Container,
  Box,
  useTheme,
  useMediaQuery,
  Paper,
  Typography,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
  IconButton,
  Stack,
  Button,
  Chip,
  Avatar,
} from "@mui/material";
import { alpha } from "@mui/material/styles";
import {
  AccountCircle,
  QueryStats,
  Insights,
  CheckCircleOutline,
  Bolt,
  ArrowBack,
  ChevronRight,
  Settings,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

// Import existing components
import ProgressStats from "../components/profile/ProgressStats";
import PersonalInfo from "../components/profile/PersonalInfo";

// Import new components
import LoadingState from "../components/profile/LoadingState";
import {
  SessionExpiredError,
  GenericError,
} from "../components/profile/ErrorState";
import AuthenticationCard from "../components/profile/AuthenticationCard";
import QuickStatsCard from "../components/profile/QuickStatsCard";
import LearningJourneyCard from "../components/profile/LearningJourneyCard";
import QuickActions from "../components/profile/QuickActions";
import CompletedTopicsCard from "../components/profile/CompletedTopicsCard";
import CompletedSubtopicsInsights from "../components/profile/CompletedSubtopicsInsights";
import AnalysisCard from "../components/profile/AnalysisCard";

// Import logic
import {
  useProfileLogic,
  getProgressStats,
} from "../components/profile/ProfileLogic";

export default function Profile() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = React.useState("profile");
  const [mobileDetailSection, setMobileDetailSection] = React.useState(null);

  const {
    user,
    loading,
    error,
    handleLogout,
    handleRefresh,
  } = useProfileLogic(navigate);

  React.useEffect(() => {
    if (!isMobile) {
      setMobileDetailSection(null);
    }
  }, [isMobile]);

  // Loading State
  if (loading) {
    return <LoadingState />;
  }

  // Error States
  if (error && error.includes("Session expired") && !user) {
    return (
      <SessionExpiredError error={error} onRetry={() => navigate("/login")} />
    );
  }

  if (!user && error) {
    return <GenericError error={error} onRetry={handleRefresh} />;
  }

  const stats = getProgressStats(user);
  const hasAuthCard = user?.authProvider === "google" && !user?.password;

  const sections = [
    {
      id: "profile",
      label: "Profile",
      subtitle: "Personal info and account security",
      icon: <AccountCircle fontSize="small" />,
      content: (
        <Stack spacing={2.5}>
          <PersonalInfo user={user} />
          {hasAuthCard && (
            <AuthenticationCard
              user={user}
              onPasswordSetup={() => navigate("/settings")}
            />
          )}
        </Stack>
      ),
    },
    {
      id: "progress",
      label: "Progress",
      subtitle: "Learning stats and momentum",
      icon: <QueryStats fontSize="small" />,
      content: (
        <Stack spacing={2.5}>
          <ProgressStats stats={stats} />
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
              gap: 2.5,
              alignItems: "stretch",
            }}
          >
            <QuickStatsCard stats={stats} />
            <LearningJourneyCard
              stats={stats}
              onLaunchLesson={() => navigate("/learn")}
            />
          </Box>
        </Stack>
      ),
    },
    {
      id: "insights",
      label: "Insights",
      subtitle: "Analysis and subtopic understanding",
      icon: <Insights fontSize="small" />,
      content: (
        <Stack spacing={2.5}>
          <CompletedSubtopicsInsights progress={user?.progress || []} />
          <AnalysisCard />
        </Stack>
      ),
    },
    {
      id: "topics",
      label: "Completed topics",
      subtitle: "Review finished topics quickly",
      icon: <CheckCircleOutline fontSize="small" />,
      content: (
        <CompletedTopicsCard
          progress={user?.progress || []}
          onRecall={(topicName) =>
            navigate(`/learn?topic=${encodeURIComponent(topicName)}`)
          }
        />
      ),
    },
    {
      id: "actions",
      label: "Quick actions",
      subtitle: "Navigate and sign out",
      icon: <Bolt fontSize="small" />,
      content: (
        <QuickActions
          isMobile={isMobile}
          onNavigate={navigate}
          onLogout={handleLogout}
        />
      ),
    },
  ];

  const currentSectionId = isMobile
    ? mobileDetailSection || activeSection
    : activeSection;
  const mobileSections = sections.filter((section) => section.id !== "actions");
  const currentSection =
    sections.find((section) => section.id === currentSectionId) || sections[0];

  return (
    <Box
      sx={{
        bgcolor: "background.default",
      }}
    >
      {/* Editorial Profile Header */}
      <Box
        sx={{
          bgcolor: "background.paper",
          borderBottom: "1px solid",
          borderColor: "divider",
          py: { xs: 2.5, md: 3 },
        }}
      >
        <Container maxWidth="xl" sx={{ maxWidth: { xs: "100%", lg: 1360, xl: 1480 }, px: { xs: 2, sm: 3 } }}>
          <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 2 }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <Avatar
                sx={{
                  width: { xs: 52, md: 64 },
                  height: { xs: 52, md: 64 },
                  bgcolor: (theme) => alpha(theme.palette.primary.main, 0.12),
                  color: "primary.main",
                  fontWeight: 800,
                  fontSize: { xs: "1.2rem", md: "1.5rem" },
                  border: "2px solid",
                  borderColor: (theme) => alpha(theme.palette.primary.main, 0.25),
                }}
              >
                {(user?.name?.[0] || "U").toUpperCase()}
              </Avatar>
              <Box>
                <Typography
                  variant="h5"
                  sx={{
                    fontWeight: 800,
                    color: "text.primary",
                    letterSpacing: "-0.02em",
                    lineHeight: 1.2,
                    fontSize: { xs: "1.25rem", md: "1.5rem" },
                  }}
                >
                  {user?.name || "User"}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 0.25, fontSize: "0.88rem" }}>
                  {user?.email || "No email"}
                </Typography>
              </Box>
            </Box>

            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
              <Chip
                label={`${stats.completed} topic${stats.completed !== 1 ? "s" : ""} done`}
                size="small"
                sx={{
                  fontWeight: 600,
                  borderRadius: "6px",
                  height: 28,
                  bgcolor: "background.default",
                  color: "text.secondary",
                  border: "1px solid",
                  borderColor: "divider",
                  fontSize: "0.78rem",
                }}
              />
              <Button
                variant="outlined"
                size="small"
                startIcon={<Settings sx={{ fontSize: 16 }} />}
                onClick={() => navigate("/settings")}
                sx={{
                  borderRadius: "6px",
                  textTransform: "none",
                  fontWeight: 600,
                  fontSize: "0.82rem",
                  borderColor: "divider",
                  color: "text.primary",
                  height: 32,
                  "&:hover": { borderColor: "primary.main" },
                }}
              >
                Settings
              </Button>
            </Box>
          </Box>
        </Container>
      </Box>

      {/* Main Content */}
      <Container
        maxWidth="xl"
        sx={{
          maxWidth: { xs: "100%", lg: 1360, xl: 1480 },
          px: { xs: 2, sm: 3 },
          py: { xs: 1.5, md: 2.5 },
        }}
      >
        {isMobile ? (
          <Stack spacing={2}>
            <Paper
              elevation={0}
              sx={{
                borderRadius: 3,
                bgcolor: "background.paper",
                border: "1px solid",
                borderColor: "divider",
                boxShadow: "none",
                overflow: "hidden",
              }}
            >
              {mobileDetailSection ? (
                <Box sx={{ p: 2 }}>
                  <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1.8 }}>
                    <IconButton
                      size="small"
                      onClick={() => setMobileDetailSection(null)}
                      aria-label="Back to profile sections"
                    >
                      <ArrowBack fontSize="small" />
                    </IconButton>
                    <Typography sx={{ fontSize: "1rem", fontWeight: 700, color: "text.primary" }}>
                      {currentSection.label}
                    </Typography>
                  </Stack>
                  {currentSection.content}
                </Box>
              ) : (
                <>
                  <Box sx={{ px: 2, py: 1.6 }}>
                    <Typography sx={{ fontSize: "1rem", fontWeight: 700, color: "text.primary" }}>
                      Profile sections
                    </Typography>
                    <Typography sx={{ fontSize: "0.76rem", color: "text.secondary", mt: 0.25 }}>
                      Manage account, progress, and insights.
                    </Typography>
                  </Box>
                  <Divider />
                  <List disablePadding>
                    {mobileSections.map((section) => (
                      <React.Fragment key={section.id}>
                        <ListItemButton
                          onClick={() => {
                            setActiveSection(section.id);
                            setMobileDetailSection(section.id);
                          }}
                          sx={{ py: 1.5, px: 2 }}
                        >
                          <ListItemIcon sx={{ minWidth: 36, color: "primary.main" }}>
                            {section.icon}
                          </ListItemIcon>
                          <ListItemText
                            primary={section.label}
                            secondary={section.subtitle}
                            primaryTypographyProps={{
                              fontWeight: 700,
                              fontSize: "0.92rem",
                              color: "text.primary",
                            }}
                            secondaryTypographyProps={{
                              variant: "body2",
                              color: "text.secondary",
                              fontSize: "0.75rem",
                            }}
                          />
                          <ChevronRight sx={{ color: "text.disabled", fontSize: 18 }} />
                        </ListItemButton>
                        <Divider component="li" />
                      </React.Fragment>
                    ))}

                    <ListItemButton
                      onClick={() => navigate("/settings")}
                      sx={{ py: 1.5, px: 2 }}
                    >
                      <ListItemIcon sx={{ minWidth: 36, color: "primary.main" }}>
                        <Settings fontSize="small" />
                      </ListItemIcon>
                      <ListItemText
                        primary="Settings"
                        secondary="App preferences and options"
                        primaryTypographyProps={{
                          fontWeight: 700,
                          fontSize: "0.92rem",
                          color: "text.primary",
                        }}
                        secondaryTypographyProps={{
                          variant: "body2",
                          color: "text.secondary",
                          fontSize: "0.75rem",
                        }}
                      />
                      <ChevronRight sx={{ color: "text.disabled", fontSize: 18 }} />
                    </ListItemButton>
                    <Divider component="li" />
                  </List>
                </>
              )}
            </Paper>

            <Button
              onClick={handleLogout}
              variant="contained"
              color="error"
              fullWidth
              sx={{
                py: 1.15,
                borderRadius: 2,
                textTransform: "none",
                fontWeight: 700,
              }}
            >
              Logout
            </Button>
          </Stack>
        ) : (
          <Box>
            <Box
              sx={{
                position: "sticky",
                top: 80,
                zIndex: 2,
                bgcolor: "background.default",
                borderBottom: "1px solid",
                borderColor: "divider",
                mb: 2.5,
                overflowX: "auto",
              }}
            >
              <Stack
                direction="row"
                spacing={0}
                sx={{
                  minWidth: "max-content",
                }}
              >
                {sections.map((section) => (
                  <Button
                    key={section.id}
                    onClick={() => setActiveSection(section.id)}
                    startIcon={section.icon}
                    variant="text"
                    sx={{
                      textTransform: "none",
                      fontWeight: activeSection === section.id ? 700 : 600,
                      px: 2,
                      py: 1.25,
                      whiteSpace: "nowrap",
                      color: activeSection === section.id ? "primary.main" : "text.secondary",
                      backgroundColor: "transparent",
                      borderBottom: activeSection === section.id ? "2px solid" : "2px solid transparent",
                      borderColor: activeSection === section.id ? "primary.main" : "transparent",
                      borderRadius: 0,
                      mb: "-1px",
                      "&:hover": {
                        bgcolor: "transparent",
                        color: "primary.main",
                      },
                    }}
                  >
                    {section.label}
                  </Button>
                ))}
              </Stack>
            </Box>

            <Box sx={{ maxWidth: { xs: "100%", lg: 1360, xl: 1480 }, mx: "auto" }}>
              {currentSection.content}
            </Box>
          </Box>
        )}
      </Container>
    </Box>
  );
}
