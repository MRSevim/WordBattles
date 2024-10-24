import { GameBoard } from "../components/GameBoard";
import { socket } from "../lib/socketio";
import { SidePanel } from "../components/SidePanel";
import { toast } from "react-toastify";
import { useAppDispatch } from "../lib/redux/hooks";
import {
  GameState,
  Player,
  setGameState,
  setTimer,
} from "../lib/redux/slices/gameSlice";

export const Homepage = () => {
  socket.on("connect_error", (err) => {
    const error: string = `Bağlantı başarısız: ${err.message}`;
    toast.error(error);
  });
  const dispatch = useAppDispatch();

  socket.on("Play Made", (game: GameState) => {
    dispatch(setGameState(game));
  });

  socket.on("Timer Runs", (players: Player[]) => {
    dispatch(setTimer(players));
  });

  return (
    <div className="container mx-auto flex">
      <GameBoard />
      <SidePanel />
    </div>
  );
};
