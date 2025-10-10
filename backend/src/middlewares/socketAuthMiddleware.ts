import { Io, Socket, SocketNext, User } from "../types/types";
import { auth } from "../lib/auth";
import { fromNodeHeaders } from "better-auth/node";

export const useSocketAuthMiddleware = (io: Io) => {
  io.use(async (socket: Socket, next: SocketNext) => {
    try {
      // 🔑 Use the headers from the socket handshake
      const session = await auth.api.getSession({
        headers: fromNodeHeaders(socket.handshake.headers),
      });
      const user = session?.user as User | undefined;

      if (!user) {
        throw new Error("Please sign in to play");
      } else {
        socket.user = user;
      }

      const roomId = user.currentRoomId;

      if (roomId) {
        socket.roomId = roomId;
        socket.join(roomId);
      }
      next();
    } catch (error) {
      next(error as Error);
    }
  });
};
