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
import { setCookie } from "../serverActions";

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

    socket.on("Game Error", ({ error }: { error: string }) => {
      toast.error(error);
    });

    socket.on("Start Game", (game: GameState) => {
      dispatch(setGameState(game));
      socket.emit("Timer", game);
    });

    socket.on("session", async ({ sessionId }) => {
      socket.sessionId = sessionId;
      // store it in a cookie
      await setCookie("sessionId", sessionId, 7);
    });

    // Cleanup listeners on unmount
    return () => {
      socket.off("connect_error");
      socket.off("Play Made");
      socket.off("No Game In Memory");
      socket.off("Timer Runs");
      socket.off("Game Error");
      socket.off("Start Game");
      socket.off("session");
    };
  }, [dispatch]);
}
