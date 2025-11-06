import { List, ListItem, ListItemButton, ListItemText } from "@mui/material";
import type { Game } from "../data/Game";
import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

interface GameListProps {
  username: string;
}

const GameList = ({username}: GameListProps) => {
  const [monthlyGames, setMonthlyGames] = useState<Map<string, Game[]>>(new Map());
  const [selectedMonth, setSelectedMonth] = useState<string>("");

  function getMonthYearFromTimestamp(timestamp: number): string {
    const date = new Date(timestamp * 1000);
    return date.toLocaleString("default", { month: "long", year: "numeric" });
  }

  function groupGamesByMonth(games: Game[]) {
    const map = new Map<string, Game[]>();
    games.forEach((game) => {
      const key = getMonthYearFromTimestamp(game.end_time);
      if (!map.has(key)) map.set(key, []);
      map.get(key)!.push(game);
    });
    return map;
  }

  const fetchGames = async () => {
    try {
      const res = await axios.get(`/api/games/${username}`);
      const data: Game[] = res.data;
      setMonthlyGames(groupGamesByMonth(data));
    } catch (err) {
      console.error("Error fetching data: ", err);
    }
  };

  useEffect(() => {
    fetchGames();
  }, [username]);

  return (
    <div>
      <select
        value={selectedMonth}
        onChange={(e) => setSelectedMonth(e.target.value)}
      >
        <option value="">Select Month</option>
        {[...monthlyGames.keys()].map((month) => (
          <option key={month} value={month}>
            {month}
          </option>
        ))}
      </select>

      <List>
        {selectedMonth &&
          monthlyGames.get(selectedMonth)?.map((game) => (
            <ListItem key={game.url} disablePadding>
              <ListItemButton
                component={Link}
                to={`/games/${username}/${game.url.split("/").pop()}`}
              >
                <ListItemText primary={game.url} />
              </ListItemButton>
            </ListItem>
          ))}
      </List>
    </div>
  );
};

export default GameList;
