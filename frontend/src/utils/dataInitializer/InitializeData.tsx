"use client";
import { setUser } from "@/features/auth/lib/redux/slices/userSlice";
import { User } from "@/features/auth/utils/types";
import {
  setGameRoomId,
  setGameStatus,
} from "@/features/game/lib/redux/slices/gameSlice";
import { socket } from "@/features/game/lib/socket.io/socketio";
import { useAppDispatch } from "@/lib/redux/hooks";
import { useEffect } from "react";

const InitializeData = ({
  user,
  roomId,
  sessionId,
}: {
  user: User;
  roomId?: string;
  sessionId?: string;
}) => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (sessionId) {
      socket.sessionId = sessionId;
      socket.connect();
      dispatch(setGameStatus("looking"));
    }
  }, [sessionId, socket, dispatch]);

  useEffect(() => {
    if (roomId) {
      dispatch(setGameRoomId(roomId));
    }
  }, [roomId, dispatch]);

  useEffect(() => {
    dispatch(setUser(user));
  }, [dispatch, user]);

  return null;
};

export default InitializeData;
