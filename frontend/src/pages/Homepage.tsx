import { GameBoard } from "../components/GameBoard";
import { socket } from "../lib/socketio";
import { SidePanel } from "../components/SidePanel";
import { toast } from "react-toastify";
import { useAppDispatch } from "../lib/redux/hooks";
import {
  GameState,
  leaveGame,
  Player,
  setGameState,
  setTimer,
} from "../lib/redux/slices/gameSlice";
import { useEffect } from "react";

export const Homepage = () => {
  const dispatch = useAppDispatch();
  useEffect(() => {
    socket.on("connect_error", (err) => {
      const error: string = `Bağlantı başarısız: ${err.message}`;
      toast.error(error);
    });

    socket.on("Play Made", (game: GameState) => {
      dispatch(setGameState(game));
    });

    socket.on("No Game In Memory", () => {
      dispatch(leaveGame());
    });

    socket.on("Timer Runs", (players: Player[]) => {
      dispatch(setTimer(players));
    });

    // Cleanup listeners on unmount
    return () => {
      socket.off("connect_error");
      socket.off("Play Made");
      socket.off("No Game In Memory");
      socket.off("Timer Runs");
    };
  }, [dispatch]);

  return (
    <div className="container mx-auto flex relative">
      <GameBoard />
      <SidePanel />
    </div>
  );
};
