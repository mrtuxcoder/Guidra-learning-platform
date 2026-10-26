import React from "react";
import { Box, Paper, InputBase, Fade, Typography, IconButton } from "@mui/material";
import { Search, Clear } from "@mui/icons-material";
import { tokens } from "../../theme/tokens";

const SearchBar = ({
  searchQuery,
  setSearchQuery,
  placeholder = "Search courses or create a learning topic...",
  helperText,
}) => {
  return (
    <Box
      sx={{
        mb: { xs: 2, md: 3 },
        maxWidth: "680px",
        mx: "auto",
        width: "100%",
      }}
    >
      <Fade in timeout={600}>
        <Box>
          <Paper
            elevation={0}
            sx={{
              p: "6px 12px",
              display: "flex",
              alignItems: "center",
              borderRadius: tokens.radii.md,
              bgcolor: "background.paper",
              border: "1px solid",
              borderColor: "divider",
              boxShadow: tokens.shadows.light.card,
              transition: "border-color 0.15s ease, box-shadow 0.15s ease",
              "&:focus-within": {
                borderColor: "primary.main",
                boxShadow: (theme) =>
                  `0 0 0 3px ${
                    theme.palette.mode === "dark"
                      ? "rgba(99, 102, 241, 0.25)"
                      : "rgba(99, 102, 241, 0.12)"
                  }`,
              },
            }}
          >
            <Search
              sx={{
                color: "primary.main",
                mr: 1,
                fontSize: { xs: "1.2rem", md: "1.35rem" },
              }}
            />
            <InputBase
              placeholder={placeholder}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              sx={{
                flex: 1,
                py: 0.5,
                fontSize: { xs: "0.92rem", md: "0.98rem" },
                color: "text.primary",
              }}
            />
            {searchQuery && (
              <IconButton
                size="small"
                onClick={() => setSearchQuery("")}
                sx={{ color: "text.secondary", p: 0.5 }}
              >
                <Clear sx={{ fontSize: 18 }} />
              </IconButton>
            )}
          </Paper>
          {helperText && (
            <Typography
              sx={{
                mt: 1,
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
