import React from "react";
import { Box, Paper, InputBase, Fade } from "@mui/material";
import { Search } from "@mui/icons-material";

const SearchBar = ({ searchQuery, setSearchQuery }) => {
  return (
    <Box sx={{ mb: 3, maxWidth: "600px", mx: "auto", px: { xs: 1, sm: 0 } }}>
      <Fade in timeout={800}>
        <Paper
          sx={{
            p: 1,
            display: "flex",
            alignItems: "center",
            borderRadius: 2,
            bgcolor: "background.paper",
            boxShadow: (theme) =>
              theme.palette.mode === "dark"
                ? "0 4px 20px rgba(0, 0, 0, 0.3)"
                : "0 4px 20px rgba(126, 87, 194, 0.08)",
            border: "1px solid",
            borderColor: "divider",
          }}
        >
          <Search
            sx={{
              color: "#7C3AED",
              mx: 1,
              fontSize: { xs: "1.25rem", md: "1.5rem" },
            }}
          />
          <InputBase
            placeholder="Search courses..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            sx={{
              flex: 1,
              fontSize: { xs: "0.9rem", md: "1rem" },
            }}
          />
        </Paper>
      </Fade>
    </Box>
  );
};

export default SearchBar;
