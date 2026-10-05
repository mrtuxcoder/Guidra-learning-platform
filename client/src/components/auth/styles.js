export const desktopSidebarStyles = {
  sidebar: {
    flex: 1,
    background: `linear-gradient(135deg, #9333EA 0%, #581C87 100%)`,
    p: 6,
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    color: "white",
    position: "relative",
    overflow: "hidden",
  },
  featureCard: {
    p: 2,
    borderRadius: 3,
    bgcolor: "rgba(255,255,255,0.1)",
    backdropFilter: "blur(10px)",
    border: "1px solid rgba(255,255,255,0.2)",
    minHeight: "140px",
    display: "flex",
    flexDirection: "column",
    transition: "all 0.3s ease",
    "&:hover": {
      transform: "translateY(-4px)",
      bgcolor: "rgba(255,255,255,0.15)",
      boxShadow: "0 8px 25px rgba(0,0,0,0.15)",
    },
  },
  iconContainer: {
    color: "white",
    mb: 2,
    width: 48,
    height: 48,
    borderRadius: 2,
    bgcolor: "rgba(255,255,255,0.2)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "1.5rem",
    flexShrink: 0,
  },
};

export const mobileHeaderStyles = {
  header: (theme) => ({
    background:
      theme.palette.mode === "dark"
        ? "linear-gradient(135deg, #1C1240 0%, #100A2A 100%)"
        : "linear-gradient(135deg, #9333EA 0%, #581C87 100%)",
    pt: 6,
    pb: 8,
    px: 3,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
    color: theme.palette.mode === "dark" ? "#E2E8F0" : "white",
    textAlign: "center",
    position: "relative",
    zIndex: 1,
  }),
};

export const formStyles = {
  paper: (isMobile) => ({
    borderRadius: { xs: 3, md: 4 },
    display: "flex",
    overflow: "hidden",
    width: "100%",
    maxWidth: 1100,
    minHeight: { md: 650 },
    bgcolor: "white",
    boxShadow: isMobile
      ? "0 10px 40px rgba(0,0,0,0.1)"
      : "0 25px 80px rgba(0,0,0,0.2)",
  }),
  formContainer: () => ({
    flex: { xs: "none", md: 1 },
    width: { xs: "100%", md: "50%" },
    p: { xs: 3, sm: 5, md: 8 },
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
  }),
};

export const buttonStyles = {
  googleButton: {
    mb: 3,
    py: 1.5,
    borderRadius: 2,
    fontWeight: 600,
    fontSize: "0.95rem",
    borderColor: "#E9D5FF",
    color: "text.primary",
    "&:hover": { borderColor: "#A855F7", bgcolor: "#FAF7FE" },
  },
  submitButton: {
    py: 1.8,
    borderRadius: 2,
    fontWeight: 700,
    fontSize: "1rem",
    background: "linear-gradient(90deg, #9333EA 0%, #6B21A8 100%)",
    boxShadow: "0 8px 20px rgba(147, 51, 234, 0.3)",
    textTransform: "none",
    "&:hover": {
      background: "linear-gradient(90deg, #7C3AED 0%, #581C87 100%)",
      boxShadow: "0 10px 25px rgba(147, 51, 234, 0.4)",
    },
  },
};
