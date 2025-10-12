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
import { removeCookie, setCookie } from "../serverActions";

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
      removeCookie("sessionId");
      removeCookie("roomId");
    });

    socket.on("Timer Runs", (players: Player[]) => {
      dispatch(setTimer(players));
    });

    socket.on("Game Error", ({ error }: { error: string }) => {
      toast.error(error);
    });

    socket.on(
      "Time is Up",
      ({ currentPlayerId }: { currentPlayerId: string }) => {
        if (currentPlayerId === socket.sessionId)
          toast.error("Your turn has passed...");
      }
    );

    socket.on("Start Game", (game: GameState) => {
      dispatch(setGameState(game));
      setCookie("roomId", game.roomId, 7);
    });

    socket.on("session", ({ sessionId }) => {
      socket.sessionId = sessionId;
      // store it in a cookie
      setCookie("sessionId", sessionId, 7);
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
