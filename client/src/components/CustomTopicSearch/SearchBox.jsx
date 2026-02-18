import React from "react";
import { Box, InputBase, Button, CircularProgress } from "@mui/material";
import { alpha, useTheme } from "@mui/material/styles";

const SearchBox = ({
  searchQuery,
  onQueryChange,
  onSearch,
  loading,
  error,
  isValidTopic,
}) => {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      onSearch();
    }
  };

  const borderGradient = error
    ? "linear-gradient(135deg, #ef4444 0%, #f97316 100%)"
    : isValidTopic
    ? "linear-gradient(135deg, #10b981 0%, #059669 100%)"
    : "linear-gradient(135deg, #7C3AED 0%, #5E35B1 100%)";

  return (
    <Box sx={{ mb: 2 }}>
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", sm: "row" },
          gap: 1,
          mb: 2,
        }}
      >
        <Box
          sx={{
            flex: 1,
            p: "2px",
            borderRadius: "18px",
            background: borderGradient,
            boxShadow: isDark
              ? "0 12px 30px rgba(0, 0, 0, 0.35)"
              : "0 12px 30px rgba(94, 53, 177, 0.12)",
          }}
        >
          <InputBase
            placeholder="What do you want to learn? (e.g., Machine Learning Basics)"
            value={searchQuery}
            onChange={(e) => onQueryChange(e.target.value)}
            onKeyDown={handleKeyDown}
            sx={{
              width: "100%",
              p: 2,
              borderRadius: "16px",
              bgcolor: "background.paper",
              fontSize: "1rem",
              border: `1px solid ${alpha(
                theme.palette.primary.main,
                isDark ? 0.2 : 0.08
              )}`,
            }}
          />
        </Box>

        <Button
          variant="contained"
          onClick={onSearch}
          disabled={loading || !searchQuery.trim()}
          sx={{
            minWidth: { xs: "100%", sm: "120px" },
            borderRadius: "16px",
            background: "linear-gradient(135deg, #7C3AED 0%, #5E35B1 100%)",
            fontWeight: 600,
            boxShadow: "0 10px 24px rgba(124, 58, 237, 0.25)",
            "&:hover": {
              background: "linear-gradient(135deg, #6D28D9 0%, #4C1D95 100%)",
            },
          }}
        >
          {loading ? (
            <CircularProgress size={24} color="inherit" />
          ) : (
            "Validate"
          )}
        </Button>
      </Box>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Box
          sx={{
            fontSize: "0.85rem",
            color: "text.secondary",
          }}
        >
          Keep it specific: 3-8 words works best.
        </Box>
        <Box
          sx={{
            fontSize: "0.75rem",
            color: alpha(theme.palette.text.primary, 0.5),
          }}
        >
          {searchQuery.trim().length}/60
        </Box>
      </Box>
    </Box>
  );
};

export default SearchBox;
