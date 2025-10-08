"use client";
import { useAppDispatch } from "@/lib/redux/hooks";
import { socket } from "@/features/game/lib/socket.io/socketio";
import { useEffect } from "react";
import { GameState, Player } from "../types/gameTypes";
import {
  leaveGame,
  setGameState,
  setTimer,
} from "../../lib/redux/slices/gameSlice";
import { toast } from "react-toastify";

export default function useGameSockets() {
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
      socket.disconnect();
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
}
