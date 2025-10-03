import { NextFunction } from "express";
import { v6 as uuidv6 } from "uuid";

export const useSocketAuthMiddleware = (io: any) => {
  io.use((socket: any, next: NextFunction) => {
    const roomId = socket.handshake.auth.roomId;
    const user = socket.handshake.auth.user;
    const sessionId = socket.handshake.auth.sessionId;

    if (user) {
      socket.user = user;
    }

    if (roomId) {
      socket.roomId = roomId;
      socket.join(roomId);
    }

    if (sessionId) {
      socket.sessionId = sessionId;
      return next();
    }

    socket.sessionId = uuidv6();
    next();
  });
};
