import React from "react";
import { Box, InputBase, Button, CircularProgress } from "@mui/material";

const SearchBox = ({
  searchQuery,
  onQueryChange,
  onSearch,
  loading,
  error,
  isValidTopic,
}) => {
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      onSearch();
    }
  };

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
        <InputBase
          placeholder="What do you want to learn? (e.g., Machine Learning Basics)"
          value={searchQuery}
          onChange={(e) => onQueryChange(e.target.value)}
          onKeyDown={handleKeyDown}
          sx={{
            flex: 1,
            p: 2,
            borderRadius: "16px",
            border: `2px solid ${
              error
                ? "#f44336"
                : isValidTopic
                ? "#4CAF50"
                : "rgba(126, 87, 194, 0.2)"
            }`,
            background: "white",
            fontSize: "1rem",
          }}
        />

        <Button
          variant="contained"
          onClick={onSearch}
          disabled={loading || !searchQuery.trim()}
          sx={{
            minWidth: { xs: "100%", sm: "120px" },
            borderRadius: "16px",
            background: "linear-gradient(135deg, #7C3AED 0%, #5E35B1 100%)",
            fontWeight: 600,
          }}
        >
          {loading ? (
            <CircularProgress size={24} color="inherit" />
          ) : (
            "Validate"
          )}
        </Button>
      </Box>
    </Box>
  );
};

export default SearchBox;
