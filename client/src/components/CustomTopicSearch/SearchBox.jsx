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

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      onSearch();
    }
  };

  const getBorderColor = () => {
    if (error) return theme.palette.error.main;
    if (isValidTopic) return theme.palette.success.main;
    return theme.palette.divider;
  };

  return (
    <Box sx={{ mb: 2 }}>
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", sm: "row" },
          gap: 1.25,
          mb: 1.5,
        }}
      >
        <Box
          sx={{
            flex: 1,
            borderRadius: "8px",
            border: "1px solid",
            borderColor: getBorderColor(),
            bgcolor: "background.paper",
            display: "flex",
            alignItems: "center",
            px: 1.5,
            height: 44,
            transition: "border-color 0.15s ease, box-shadow 0.15s ease",
            "&:focus-within": {
              borderColor: error ? theme.palette.error.main : "primary.main",
              boxShadow: `0 0 0 3px ${alpha(
                error ? theme.palette.error.main : theme.palette.primary.main,
                theme.palette.mode === "dark" ? 0.2 : 0.1
              )}`,
            },
          }}
        >
          <InputBase
            placeholder="What do you want to learn? (e.g. Prompt Engineering, Rust Concurrency)"
            value={searchQuery}
            onChange={(e) => onQueryChange(e.target.value)}
            onKeyDown={handleKeyDown}
            sx={{
              width: "100%",
              fontSize: "0.92rem",
              color: "text.primary",
            }}
          />
        </Box>

        <Button
          variant="contained"
          color="primary"
          onClick={onSearch}
          disabled={loading || !searchQuery.trim()}
          sx={{
            minWidth: { xs: "100%", sm: "110px" },
            height: 44,
            borderRadius: "8px",
            fontWeight: 600,
            fontSize: "0.88rem",
            textTransform: "none",
            boxShadow: "none",
            "&:hover": {
              boxShadow: "none",
            },
          }}
        >
          {loading ? (
            <CircularProgress size={18} color="inherit" />
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
          px: 0.5,
        }}
      >
        <Box
          sx={{
            fontSize: "0.8rem",
            color: "text.secondary",
          }}
        >
          Keep it specific: 2 to 8 words works best.
        </Box>
        <Box
          sx={{
            fontSize: "0.75rem",
            color: "text.secondary",
            fontWeight: 500,
          }}
        >
          {searchQuery.trim().length}/60
        </Box>
      </Box>
    </Box>
  );
};

export default SearchBox;
