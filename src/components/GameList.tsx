import {
  List,
  ListItem,
  ListItemButton,
  FormControl,
  Select,
  MenuItem,
  Box,
  Typography,
  Chip,
  CircularProgress,
  Alert,
  Divider,
  Avatar,
} from "@mui/material";
import { CalendarMonth, SportsEsports } from "@mui/icons-material";
import type { Game } from "../data/Game";
import { useEffect, useState, useMemo } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

interface GameListProps {
  username: string;
}

const GameList = ({ username }: GameListProps) => {
  const [games, setGames] = useState<Game[]>([]);
  const [selectedMonth, setSelectedMonth] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Memoize the grouping calculation to avoid re-computing on every render
  const monthlyGames = useMemo(() => {
    const map = new Map<string, Game[]>();
    games.forEach((game) => {
      const date = new Date(game.end_time * 1000);
      const key = date.toLocaleString("default", { month: "long", year: "numeric" });
      if (!map.has(key)) map.set(key, []);
      map.get(key)!.push(game);
    });
    return map;
  }, [games]);

  // Get sorted month keys (most recent first)
  const sortedMonths = useMemo(() => {
    return [...monthlyGames.keys()].sort((a, b) => {
      const dateA = new Date(a);
      const dateB = new Date(b);
      return dateB.getTime() - dateA.getTime();
    });
  }, [monthlyGames]);

  // Auto-select the most recent month when data loads
  useEffect(() => {
    if (sortedMonths.length > 0 && !selectedMonth) {
      setSelectedMonth(sortedMonths[0]);
    }
  }, [sortedMonths, selectedMonth]);

  const fetchGames = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await axios.get(`/api/games/${username}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setGames(res.data);
    } catch (err) {
      console.error("Error fetching games:", err);
      setError("Failed to load games. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGames();
  }, [username]);

  const getGameResult = (game: Game, username: string) => {
    if (game.white.username.toLocaleLowerCase() === username) {
      return game.white.result === "win" ? "W" : game.white.result === "checkmated" ? "L" : "D";
    } else {
      return game.black.result === "win" ? "W" : game.black.result === "checkmated" ? "L" : "D";
    }
  };

  const getResultColor = (result: string) => {
    if (result === "W") return "success";
    if (result === "L") return "error";
    return "default";
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" py={4}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ mt: 2 }}>
        {error}
      </Alert>
    );
  }

  if (games.length === 0) {
    return (
      <Box textAlign="center" py={4}>
        <SportsEsports sx={{ fontSize: 48, color: "text.secondary", mb: 2 }} />
        <Typography variant="body2" color="text.secondary">
          No games found
        </Typography>
      </Box>
    );
  }

  return (
    <Box>
      {/* Month Selector */}
      <FormControl fullWidth sx={{ mb: 2 }}>
        <Select
          value={selectedMonth}
          onChange={(e) => setSelectedMonth(e.target.value)}
          displayEmpty
          startAdornment={<CalendarMonth sx={{ mr: 1, color: "action.active" }} />}
          sx={{
            "& .MuiSelect-select": {
              py: 1.5,
            },
          }}
        >
          <MenuItem value="" disabled>
            Select Month
          </MenuItem>
          {sortedMonths.map((month) => (
            <MenuItem key={month} value={month}>
              <Box display="flex" justifyContent="space-between" width="100%">
                <span>{month}</span>
                <Chip
                  label={monthlyGames.get(month)?.length || 0}
                  size="small"
                  sx={{ ml: 1 }}
                />
              </Box>
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {/* Games List */}
      {selectedMonth && (
        <>
          <Typography variant="caption" color="text.secondary" sx={{ px: 2, mb: 1, display: "block" }}>
            {monthlyGames.get(selectedMonth)?.length || 0} games
          </Typography>
          <List sx={{ py: 0 }}>
            {monthlyGames.get(selectedMonth)?.map((game, index) => {
              const result = getGameResult(game, username);
              const opponent =
                game.white.username.toLocaleLowerCase() === username
                  ? game.black.username.toLocaleLowerCase()
                  : game.white.username.toLocaleLowerCase();
              const userColor = game.white.username.toLocaleLowerCase() === username ? "white" : "black";

              return (
                <Box key={game.url}>
                  <ListItem disablePadding>
                    <ListItemButton
                      component={Link}
                      to={`/analysis/${game.url.split("/").pop()}`}
                      sx={{
                        py: 1.5,
                        px: 2,
                        "&:hover": {
                          bgcolor: "action.hover",
                        },
                      }}
                    >
                      <Box display="flex" alignItems="center" gap={1.5} width="100%">
                        {/* Result Badge */}
                        <Chip
                          label={result}
                          color={getResultColor(result)}
                          size="small"
                          sx={{ minWidth: 36, fontWeight: 600 }}
                        />

                        {/* Game Info */}
                        <Box flexGrow={1}>
                          <Typography variant="body2" fontWeight={500}>
                            vs {opponent}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            Playing as {userColor} • {game.time_class}
                          </Typography>
                        </Box>

                        {/* User Color Indicator */}
                        <Avatar
                          sx={{
                            width: 24,
                            height: 24,
                            bgcolor: userColor === "white" ? "#fff" : "#000",
                            border: "2px solid",
                            borderColor: "divider",
                          }}
                        >
                          {" "}
                        </Avatar>
                      </Box>
                    </ListItemButton>
                  </ListItem>
                  {index < (monthlyGames.get(selectedMonth)?.length || 0) - 1 && (
                    <Divider variant="inset" component="li" />
                  )}
                </Box>
              );
            })}
          </List>
        </>
      )}
    </Box>
  );
};

export default GameList;