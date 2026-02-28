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
    ? `1px solid ${theme.palette.error.main}`
    : isValidTopic
    ? `1px solid ${theme.palette.success.main}`
    : `1px solid ${alpha(theme.palette.primary.main, 0.3)}`;

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
            borderRadius: "14px",
            border: borderGradient,
            bgcolor: "background.paper",
          }}
        >
          <InputBase
            placeholder="What do you want to learn? (e.g., Machine Learning Basics)"
            value={searchQuery}
            onChange={(e) => onQueryChange(e.target.value)}
            onKeyDown={handleKeyDown}
            sx={{
              width: "100%",
              p: 1.6,
              borderRadius: "14px",
              fontSize: "0.95rem",
            }}
          />
        </Box>

        <Button
          variant="contained"
          onClick={onSearch}
          disabled={loading || !searchQuery.trim()}
          sx={{
            minWidth: { xs: "100%", sm: "120px" },
            borderRadius: "12px",
            fontWeight: 600,
            boxShadow: "none",
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
