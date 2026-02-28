import { alpha } from "@mui/material";

export const cardStyles = {
  card: (isSelected, categoryColor, theme) => ({
    cursor: "pointer",
    transition: "all 0.2s ease",
    border: isSelected ? `1.5px solid ${categoryColor}` : "1px solid",
    borderColor: isSelected ? categoryColor : theme?.palette?.divider || "rgba(126, 87, 194, 0.1)",
    bgcolor: isSelected
      ? `linear-gradient(135deg, ${alpha(categoryColor, 0.08)} 0%, ${alpha(
          categoryColor,
          0.02
        )} 100%)`
      : "background.paper",
    transform: "none",
    boxShadow: isSelected
      ? theme?.palette?.mode === "dark"
        ? "0 4px 14px rgba(0, 0, 0, 0.26)"
        : "0 4px 14px rgba(15, 23, 42, 0.08)"
      : theme?.palette?.mode === "dark"
      ? "0 2px 8px rgba(0, 0, 0, 0.18)"
      : "0 2px 8px rgba(15, 23, 42, 0.05)",
    borderRadius: 3,
    height: "100%",
    minHeight: { xs: "132px", sm: "150px" },
    display: "flex",
    flexDirection: "column",
    "&:hover": {
      transform: "none",
      boxShadow: theme?.palette?.mode === "dark"
        ? "0 6px 16px rgba(0, 0, 0, 0.25)"
        : "0 6px 16px rgba(15, 23, 42, 0.08)",
    },
  }),
  cardContent: {
    p: { xs: 1.3, sm: 1.7 },
    position: "relative",
    height: "100%",
    display: "flex",
    flexDirection: "column",
    "&:last-child": { pb: { xs: 1.3, sm: 1.7 } },
  },
};

export const categoryIconStyles = (isSelected) => ({
  width: { xs: "50px", lg: "60px" },
  height: { xs: "50px", lg: "60px" },
  minWidth: { xs: "50px", lg: "60px" },
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  borderRadius: 2,
  backgroundColor: isSelected ? "#7C3AED" : "transparent",
  color: isSelected ? "white" : "#7C3AED",
  border: `2px solid ${isSelected ? "#7C3AED" : "rgba(126, 87, 194, 0.2)"}`,
  cursor: "pointer",
  transition: "all 0.2s ease",
  position: "relative",
  "&:hover": {
    backgroundColor: isSelected ? "#6B21A8" : "rgba(126, 87, 194, 0.05)",
    transform: "scale(1.05)",
  },
});

export const countBadgeStyles = {
  position: "absolute",
  top: -4,
  right: -4,
  backgroundColor: "#7C3AED",
  color: "white",
  borderRadius: "50%",
  width: 20,
  height: 20,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontSize: "0.7rem",
  fontWeight: "bold",
};

export const actionButtonStyles = {
  button: {
    px: { xs: 3.5, md: 5.5 },
    py: { xs: 1.1, md: 1.35 },
    fontSize: { xs: "0.86rem", md: "0.96rem" },
    fontWeight: 700,
    background: "linear-gradient(135deg, #7C3AED 0%, #5E35B1 100%)",
    borderRadius: 2,
    minWidth: { xs: "152px", md: "176px" },
    boxShadow: "0 6px 18px rgba(126, 87, 194, 0.25)",
    "&:hover": {
      transform: "none",
      boxShadow: "0 8px 24px rgba(126, 87, 194, 0.3)",
    },
    "&:disabled": {
      background: "grey.300",
      transform: "none",
      boxShadow: "none",
    },
  },
};
