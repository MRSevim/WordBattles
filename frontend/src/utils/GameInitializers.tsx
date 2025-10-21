"use client";
import {
  setGameLanguage,
  setGameRoomId,
  setGameStatus,
} from "@/features/game/lib/redux/slices/gameSlice";
import { socket } from "@/features/game/lib/socket.io/socketio";
import { Lang } from "@/features/language/helpers/types";
import { useAppDispatch } from "@/lib/redux/hooks";
import { useEffect } from "react";

const GameInitializers = ({
  gameCookies,
}: {
  gameCookies: {
    sessionId?: string;
    roomId?: string;
    lang?: Lang;
  };
}) => {
  const sessionId = gameCookies.sessionId;
  const roomId = gameCookies.roomId;
  const lang = gameCookies.lang;
  const dispatch = useAppDispatch();

  useEffect(() => {
    //RoomId takes precedence over sessionId
    if (sessionId && lang && !roomId) {
      socket.sessionId = sessionId;
      socket.emit("Selected Language", lang);
      dispatch(setGameLanguage(lang));
      dispatch(setGameStatus("looking"));
    }
  }, [sessionId, roomId, socket, dispatch]);

  useEffect(() => {
    if (roomId) {
      dispatch(setGameRoomId(roomId));
    }
  }, [roomId, dispatch]);

  return null;
};

export default GameInitializers;
