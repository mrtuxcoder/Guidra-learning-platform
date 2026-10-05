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
  LocalFireDepartment,
  Settings,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

// Import existing components
import ProfileHeader from "../components/profile/ProfileHeader";
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

  const sections = [
    {
      id: "profile",
      label: "Profile",
      subtitle: "Personal info and account security",
      icon: <AccountCircle fontSize="small" />,
      content: (
        <Stack spacing={2.5}>
          <PersonalInfo user={user} />
          <AuthenticationCard
            user={user}
            onPasswordSetup={() => navigate("/settings")}
          />
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
          <QuickStatsCard stats={stats} />
          <LearningJourneyCard
            stats={stats}
            onLaunchLesson={() => navigate("/learn")}
          />
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
          <AnalysisCard />
          <CompletedSubtopicsInsights progress={user?.progress || []} />
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
        minHeight: "100vh",
        bgcolor: "background.default",
      }}
    >
      {/* Enhanced Header */}
      <Box
        sx={{
          background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
          color: "white",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <Container maxWidth="xl" sx={{ px: { xs: 2, sm: 3 }, py: isMobile ? 3 : 3 }}>
          {isMobile ? (
            <Stack spacing={1.3}>
              <Stack direction="row" alignItems="center" spacing={1.2}>
                <Avatar sx={{ width: 56, height: 56, bgcolor: alpha("#fff", 0.25) }}>
                  {(user?.name?.[0] || "U").toUpperCase()}
                </Avatar>
                <Box
                  sx={{
                    minWidth: 0,
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                  }}
                >
                  <Typography sx={{ fontSize: "1.2rem", fontWeight: 700, lineHeight: 1.2 }} noWrap>
                    {user?.name || "User"}
                  </Typography>
                  <Typography
                    sx={{ fontSize: "0.92rem", opacity: 0.9, mt: 0.2 }}
                    noWrap
                  >
                    {user?.email || "No email"}
                  </Typography>
                </Box>
              </Stack>
            </Stack>
          ) : (
            <ProfileHeader user={user} />
          )}
        </Container>

        {/* Wave decoration */}
        <Box
          sx={{
            position: "absolute",
            bottom: -1,
            left: 0,
            right: 0,
            height: 20,
            bgcolor: "background.default",
            borderTopLeftRadius: 40,
            borderTopRightRadius: 40,
          }}
        />
      </Box>

      {/* Enhanced Main Content */}
      <Container
        maxWidth="xl"
        sx={{
          px: { xs: 2, sm: 3 },
          py: { xs: 2, md: 4 },
          mt: -1,
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
                mb: 3,
                overflowX: "auto",
                display: "flex",
                justifyContent: "center",
              }}
            >
              <Stack
                direction="row"
                spacing={1}
                sx={{
                  minWidth: "max-content",
                  px: 0.5,
                  justifyContent: "center",
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
                      py: 1,
                      whiteSpace: "nowrap",
                      color: activeSection === section.id ? "primary.main" : "text.primary",
                      backgroundColor: "transparent",
                      borderBottom: activeSection === section.id ? "2px solid" : "2px solid transparent",
                      borderRadius: 0,
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

            <Box sx={{ maxWidth: 1240, mx: "auto" }}>
              <Typography variant="h6" fontWeight={700} sx={{ mb: 2 }}>
                {currentSection.label}
              </Typography>
              {currentSection.content}
            </Box>
          </Box>
        )}
      </Container>
    </Box>
  );
}
