import React from "react";
import { Container, Grid, Box, useTheme, useMediaQuery } from "@mui/material";
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

// Import logic
import {
  useProfileLogic,
  getProgressStats,
} from "../components/profile/ProfileLogic";

// Import other dependencies
import PasswordSetupModal from "../components/PasswordSetupModal";

export default function Profile() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("lg"));
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
        background: "linear-gradient(135deg, #FAF7FE 0%, #FFFFFF 100%)",
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
            background: "linear-gradient(135deg, #FAF7FE 0%, #FFFFFF 100%)",
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
        <Grid container spacing={3}>
          {/* Left Column - Personal & Quick Stats */}
          <Grid item xs={12} lg={4}>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
              <PersonalInfo user={user} />

              <AuthenticationCard
                user={user}
                onPasswordSetup={handlePasswordSetupClick}
              />

              <QuickStatsCard stats={stats} />

              <QuickActions
                isMobile={isMobile}
                onNavigate={navigate}
                onLogout={handleLogout}
              />
            </Box>
          </Grid>

          {/* Right Column - Progress & Main Content */}
          <Grid item xs={12} lg={8}>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
              <ProgressStats stats={stats} />

              <LearningJourneyCard
                stats={stats}
                onLaunchLesson={() => navigate("/learn")}
              />

              {!isMobile && (
                <QuickActions
                  isMobile={false}
                  onNavigate={navigate}
                  onLogout={handleLogout}
                />
              )}
            </Box>
          </Grid>
        </Grid>
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
