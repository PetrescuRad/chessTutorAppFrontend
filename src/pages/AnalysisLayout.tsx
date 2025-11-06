import GameList from "../components/GameList";
import { Outlet } from "react-router-dom";

export default function AnalysisLayout() {
  return (
    <div style={{ display: "flex", gap: "20px" }}>
      <div style={{ width: "30%" }}>
        <GameList username="radure" /> {/* you can make username dynamic later */}
      </div>
      <div style={{ flexGrow: 1 }}>
        <Outlet /> {/* This is where nested routes (like GameReplay) will render */}
      </div>
    </div>
  );
}
