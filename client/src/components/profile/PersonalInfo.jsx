import React from "react";
import {
  Card,
  CardContent,
  Typography,
  Box,
  Chip,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import { Email, CalendarToday, Lightbulb, Person } from "@mui/icons-material";

const PersonalInfo = ({ user }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const purpleTheme = {
    primary: "#7E57C2",
    primaryLight: "#B39DDB",
    primaryDark: "#5E35B1",
    gradient: "linear-gradient(135deg, #7E57C2 0%, #5E35B1 100%)",
    lightBg: "#F3E5F5",
    subtleBg: "#FAF7FE",
  };

  const InfoItem = ({ icon, label, value, isLast = false }) => (
    <Box
      sx={{
        display: "flex",
        alignItems: "flex-start",
        gap: 2,
        py: 2,
        ...(!isLast && {
          borderBottom: "1px solid",
          borderColor: "rgba(126, 87, 194, 0.1)",
        }),
      }}
    >
      <Box
        sx={{
          width: 36,
          height: 36,
          borderRadius: 2,
          background: purpleTheme.gradient,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
          mt: 0.25,
        }}
      >
        {React.cloneElement(icon, {
          sx: { fontSize: 18, color: "white" },
        })}
      </Box>

      <Box sx={{ flex: 1, minWidth: 0 }}>
        <Typography
          variant="caption"
          sx={{
            color: "text.secondary",
            fontWeight: 600,
            textTransform: "uppercase",
            letterSpacing: 0.5,
            fontSize: "0.7rem",
            display: "block",
            mb: 0.5,
          }}
        >
          {label}
        </Typography>
        <Typography
          variant="body2"
          sx={{
            color: "text.primary",
            fontWeight: 500,
            wordBreak: "break-word",
          }}
        >
          {value || "Not specified"}
        </Typography>
      </Box>
    </Box>
  );

  return (
    <Card
      elevation={0}
      sx={{
        borderRadius: 3,
        border: "1px solid",
        borderColor: "rgba(126, 87, 194, 0.12)",
        background: "white",
        overflow: "visible",
      }}
    >
      <CardContent
        sx={{
          p: isMobile ? 2 : 2.5,
          "&:last-child": { pb: isMobile ? 2 : 2.5 },
        }}
      >
        {/* Header */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1.5,
            mb: 2,
            pb: 2,
            borderBottom: "1px solid",
            borderColor: "rgba(126, 87, 194, 0.1)",
          }}
        >
          <Box
            sx={{
              width: 32,
              height: 32,
              borderRadius: 2,
              background: purpleTheme.gradient,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Person sx={{ fontSize: 18, color: "white" }} />
          </Box>
          <Typography
            variant="h6"
            sx={{
              fontWeight: 700,
              fontSize: isMobile ? "1.1rem" : "1.2rem",
              background: purpleTheme.gradient,
              backgroundClip: "text",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            Personal Info
          </Typography>
        </Box>

        {/* Info Items - Compact */}
        <Box sx={{ mt: 1 }}>
          <InfoItem
            icon={<Email />}
            label="Email Address"
            value={user?.email}
          />

          <InfoItem
            icon={<CalendarToday />}
            label="Member Since"
            value={
              user?.createdAt
                ? new Date(user.createdAt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })
                : null
            }
          />

          <InfoItem
            icon={<Lightbulb />}
            label="Learning Goal"
            value={user?.reasonForLearning || user?.learningMotivation}
            isLast={true}
          />
        </Box>

        {/* Learning Style Chip if available */}
        {user?.learningStyle && (
          <Box
            sx={{
              mt: 2,
              pt: 2,
              borderTop: "1px solid",
              borderColor: "rgba(126, 87, 194, 0.1)",
            }}
          >
            <Chip
              icon={<Lightbulb sx={{ fontSize: 16 }} />}
              label={`${
                user.learningStyle.charAt(0).toUpperCase() +
                user.learningStyle.slice(1)
              } Learner`}
              variant="filled"
              sx={{
                background: purpleTheme.lightBg,
                color: purpleTheme.primaryDark,
                fontWeight: 600,
                fontSize: "0.75rem",
                border: `1px solid ${purpleTheme.primaryLight}`,
                "& .MuiChip-icon": { color: purpleTheme.primary },
              }}
            />
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

export default PersonalInfo;
