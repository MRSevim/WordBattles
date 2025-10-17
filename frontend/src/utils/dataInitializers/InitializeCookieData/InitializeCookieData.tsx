"use client";
import {
  setGameRoomId,
  setGameStatus,
} from "@/features/game/lib/redux/slices/gameSlice";
import { socket } from "@/features/game/lib/socket.io/socketio";
import { useAppDispatch } from "@/lib/redux/hooks";
import { useEffect } from "react";

const InitializeCookieData = ({
  cookies,
}: {
  cookies: { sessionId?: string; roomId?: string };
}) => {
  const dispatch = useAppDispatch();
  const { sessionId, roomId } = cookies;

  useEffect(() => {
    //RoomId takes precedence over sessionId
    if (sessionId && !roomId) {
      socket.sessionId = sessionId;
      socket.connect();
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

export default InitializeCookieData;
