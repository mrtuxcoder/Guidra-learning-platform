import React from "react";
import { Box, Paper, InputBase, Fade, Typography } from "@mui/material";
import { Search } from "@mui/icons-material";

const SearchBar = ({
  searchQuery,
  setSearchQuery,
  placeholder = "Search courses or create a learning topic",
  helperText,
}) => {
  return (
    <Box
      sx={{
        mb: { xs: 1.5, md: 2.25 },
        maxWidth: "720px",
        mx: "auto",
        px: { xs: 0, sm: 0 },
      }}
    >
      <Fade in timeout={800}>
        <Box>
          <Paper
            sx={{
              p: { xs: 1.1, md: 0.95 },
              display: "flex",
              alignItems: "center",
              borderRadius: 2.5,
              bgcolor: "background.paper",
              boxShadow: "0 6px 18px rgba(15, 23, 42, 0.06)",
              border: "1px solid",
              borderColor: "rgba(79, 70, 229, 0.18)",
            }}
          >
            <Search
              sx={{
                color: "#4F46E5",
                mx: 0.9,
                fontSize: { xs: "1.2rem", md: "1.3rem" },
              }}
            />
            <InputBase
              placeholder={placeholder}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              sx={{
                flex: 1,
                py: 0.35,
                fontSize: { xs: "0.92rem", md: "0.96rem" },
              }}
            />
          </Paper>
          {helperText && (
            <Typography
              sx={{
                mt: 0.9,
                ml: 0.3,
                fontSize: "0.78rem",
                color: "text.secondary",
              }}
            >
              {helperText}
            </Typography>
          )}
        </Box>
      </Fade>
    </Box>
  );
};

export default SearchBar;
