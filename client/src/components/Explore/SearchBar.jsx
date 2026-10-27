import React from "react";
import { Box, Paper, InputBase, Fade, Typography, IconButton, alpha } from "@mui/material";
import { Search, Clear } from "@mui/icons-material";

const SearchBar = ({
  searchQuery,
  setSearchQuery,
  placeholder = "Search courses or discover topics...",
  helperText,
}) => {
  return (
    <Box
      sx={{
        mb: { xs: 2, md: 2.5 },
        maxWidth: "640px",
        mx: "auto",
        width: "100%",
      }}
    >
      <Fade in timeout={400}>
        <Box>
          <Paper
            elevation={0}
            sx={{
              px: 1.5,
              height: 42,
              display: "flex",
              alignItems: "center",
              borderRadius: "8px",
              bgcolor: "background.paper",
              border: "1px solid",
              borderColor: "divider",
              transition: "border-color 0.15s ease, box-shadow 0.15s ease",
              "&:focus-within": {
                borderColor: "primary.main",
                boxShadow: (theme) =>
                  `0 0 0 3px ${alpha(theme.palette.primary.main, theme.palette.mode === "dark" ? 0.2 : 0.1)}`,
              },
            }}
          >
            <Search
              sx={{
                color: "text.secondary",
                mr: 1,
                fontSize: 20,
              }}
            />
            <InputBase
              placeholder={placeholder}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              sx={{
                flex: 1,
                fontSize: "0.9rem",
                color: "text.primary",
              }}
            />
            {searchQuery && (
              <IconButton
                size="small"
                onClick={() => setSearchQuery("")}
                sx={{ color: "text.secondary", p: 0.5 }}
                aria-label="Clear search"
              >
                <Clear sx={{ fontSize: 16 }} />
              </IconButton>
            )}
          </Paper>
          {helperText && (
            <Typography
              sx={{
                mt: 0.75,
                ml: 1,
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
