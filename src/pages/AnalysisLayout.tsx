import { Box, Paper, Typography } from "@mui/material";
import GameList from "../components/GameList";
import Chatbot from "../components/ChatBot";
import { Outlet } from "react-router-dom";

export default function AnalysisLayout() {
  const username = localStorage.getItem("username")!;
  
  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: {
          xs: "1fr",
          md: "300px 1fr 350px",
        },
        gap: 3,
        p: 3,
        height: "calc(100vh - 100px)",
        overflow: "hidden",
      }}
    >
      {/* Left Sidebar - Game List */}
      <Paper
        elevation={2}
        sx={{
          p: 2.5,
          overflow: "auto",
          display: { xs: "none", md: "block" },
          borderRadius: 2,
          bgcolor: "background.paper",
        }}
      >
        <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
          Your Games
        </Typography>
        <GameList username={username} />
      </Paper>

      {/* Center - Game Replay */}
      <Paper
        elevation={2}
        sx={{
          p: 3,
          overflow: "auto",
          borderRadius: 2,
          display: "flex",
          flexDirection: "column",
          bgcolor: "background.paper",
        }}
      >
        <Outlet />
      </Paper>

      {/* Right Sidebar - Chatbot */}
      <Paper
        elevation={2}
        sx={{
          p: 2.5,
          overflow: "hidden",
          display: { xs: "none", md: "flex" },
          flexDirection: "column",
          borderRadius: 2,
          bgcolor: "background.paper",
        }}
      >
        <Chatbot />
      </Paper>
    </Box>
  );
}