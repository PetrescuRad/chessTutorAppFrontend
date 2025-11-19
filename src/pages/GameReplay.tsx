import { useState, useEffect } from "react";
import { Chess } from "chess.js";
import { Chessboard } from "react-chessboard";
import { useParams } from "react-router-dom";
import type { Game } from "../data/Game";
import axios from "axios";
import { useGame } from "../context/GameContext";

export default function GameReplay() {
    const { url } = useParams();
    const username = localStorage.getItem("username")!;
    const { setCurrentFen } = useGame();

    const [game, setGame] = useState<Game>();
    const [currentMove, setCurrentMove] = useState(0);
    const [position, setPosition] = useState("rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1");
    const [moves, setMoves] = useState<string[]>([]);
    const [gameInfo, setGameInfo] = useState<Record<string, string>>({});
    const [error, setError] = useState<string>();

    const fetchGame = async () => {
        try {
            let response = await axios.get(`/api/games/${username}/${url}`, 
                {
                    headers:
                    {Authorization: `Bearer ${localStorage.getItem("token")}`}
                }
            );
            setGame(response.data);
            setError(undefined);
        } catch (err: any) {
            console.log("Error fetching data: ", err);
            setError(err.response?.data || "Failed to load game");
        }
    };
    
    useEffect(() => {
        fetchGame();
        setCurrentMove(0);
    }, [username, url]);

    // Parse PGN when game data is loaded
    useEffect(() => {
        if (!game?.pgn) return;

        const chess = new Chess();
        try {
            chess.loadPgn(game.pgn);
            const history = chess.history();

            // Extract game metadata
            const headers: Record<string, string> = {};
            const headerRegex = /\[(\w+)\s+"([^"]*)"\]/g;
            let match;
            while ((match = headerRegex.exec(game.pgn)) !== null) {
                headers[match[1]] = match[2];
            }

            setMoves(history);
            setGameInfo(headers);
        } catch (error) {
            console.error("Failed to parse PGN:", error);
        }
    }, [game]);

    // Update position whenever currentMove changes
    useEffect(() => {
        if (moves.length === 0) return;
        
        const chess = new Chess();
        for (let i = 0; i < currentMove; i++) {
            chess.move(moves[i]);
        }
        const newFen = chess.fen();
        setPosition(newFen);
        // Update the FEN in context for the chatbot to use
        setCurrentFen(newFen);
    }, [currentMove, moves, setCurrentFen]);

    const goToMove = (index: number) => {
        setCurrentMove(index);
    };

    const nextMove = () => {
        if (currentMove < moves.length) {
            goToMove(currentMove + 1);
        }
    };

    const prevMove = () => {
        if (currentMove > 0) {
            goToMove(currentMove - 1);
        }
    };

    const goToStart = () => goToMove(0);
    const goToEnd = () => goToMove(moves.length);

    if (error) {
        return (
            <div style={{ textAlign: "center", marginTop: "50px", color: "red" }}>
                <h3>Error</h3>
                <p>{error}</p>
            </div>
        );
    }

    if (!game) {
        return <div style={{ textAlign: "center", marginTop: "50px" }}>Loading game...</div>;
    }
    
    return (
        <div style={{ textAlign: "center" }}>
            <div style={{ marginBottom: "20px" }}>
                <h3>{gameInfo.White} ({gameInfo.WhiteElo}) vs {gameInfo.Black} ({gameInfo.BlackElo}) </h3>
                <p>{gameInfo.Event} - {gameInfo.Date}</p>
                <p>Result: {gameInfo.Result}</p>
            </div>

            <div style={{ width: "400px", margin: "0 auto" }}>
                <Chessboard
                    options={{
                        position: position,
                        allowDragging: false,
                    }}
                />
            </div>

            <div style={{ marginTop: "10px" }}>
                <button onClick={goToStart} disabled={currentMove === 0}>
                    ⏮ Start
                </button>
                <button onClick={prevMove} disabled={currentMove === 0}>
                    ⏪ Previous
                </button>
                <button onClick={nextMove} disabled={currentMove === moves.length}>
                    Next ⏩
                </button>
                <button onClick={goToEnd} disabled={currentMove === moves.length}>
                    End ⏭
                </button>
                <p>
                    Move {currentMove} / {moves.length}
                    {currentMove > 0 && `: ${moves[currentMove - 1]}`}
                </p>
            </div>
        </div>
    );
}