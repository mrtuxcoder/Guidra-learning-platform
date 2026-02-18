import React from "react";
import { Container, Box, useTheme, useMediaQuery } from "@mui/material";
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

// Import logic
import {
  useProfileLogic,
  getProgressStats,
} from "../components/profile/ProfileLogic";

// Import other dependencies
import PasswordSetupModal from "../components/PasswordSetupModal";

export default function Profile() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const navigate = useNavigate();

  const {
    user,
    loading,
    error,
    showPasswordModal,
    needsPasswordSetup,
    setShowPasswordModal,
    handleLogout,
    handlePasswordSuccess,
    handlePasswordSetupClick,
    handleRefresh,
  } = useProfileLogic(navigate);

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
          background: "linear-gradient(135deg, #7E57C2 0%, #5E35B1 100%)",
          color: "white",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <Container maxWidth="xl" sx={{ px: { xs: 2, sm: 3 }, py: 3 }}>
          <ProfileHeader user={user} />
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
          py: 4,
          mt: -1,
        }}
      >
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              md: "minmax(280px, 1fr) minmax(360px, 1.3fr) minmax(260px, 0.9fr)",
            },
            gap: 3,
            alignItems: "stretch",
          }}
        >
          <Box
            sx={{
              display: "grid",
              gridTemplateRows: { xs: "auto", md: "minmax(0, 1fr) auto" },
              gap: 3,
              height: "100%",
              alignItems: "stretch",
            }}
          >
            <Box sx={{ height: "100%", minHeight: 0 }}>
              <PersonalInfo user={user} />
            </Box>

            <AuthenticationCard
              user={user}
              onPasswordSetup={handlePasswordSetupClick}
            />
          </Box>

          <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
            <ProgressStats stats={stats} />

            <LearningJourneyCard
              stats={stats}
              onLaunchLesson={() => navigate("/learn")}
            />

            <CompletedSubtopicsInsights
              progress={user?.progress || []}
              appTimeMs={user?.appTimeMs || 0}
            />
          </Box>

          <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
            <QuickStatsCard stats={stats} />

            <CompletedTopicsCard
              progress={user?.progress || []}
              onRecall={(topicName) =>
                navigate(`/learn?topic=${encodeURIComponent(topicName)}`)
              }
            />

            <QuickActions
              isMobile={isMobile}
              onNavigate={navigate}
              onLogout={handleLogout}
            />
          </Box>
        </Box>
      </Container>

      {/* Password Setup Modal */}
      <PasswordSetupModal
        open={showPasswordModal}
        onClose={() => setShowPasswordModal(false)}
        onSuccess={handlePasswordSuccess}
      />
    </Box>
  );
}
