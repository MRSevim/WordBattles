import { Io, Socket, SocketNext, User } from "../types/types";
import { auth } from "../lib/auth";
import { fromNodeHeaders } from "better-auth/node";
import { v6 as uuidv6 } from "uuid";
import { parse } from "cookie";
import { convertToLangType } from "../lib/i18n";

export const useSocketMiddleware = (io: Io) => {
  io.use(async (socket: Socket, next: SocketNext) => {
    try {
      // 1️⃣ Parse cookies manually from handshake headers
      const cookies = parse(socket.handshake.headers.cookie || "");

      // 🔑 Use the headers from the socket handshake
      const session = await auth.api.getSession({
        headers: fromNodeHeaders(socket.handshake.headers),
      });
      const user = session?.user as User | undefined;

      let sessionId: string | undefined,
        roomId: string | undefined,
        siteLocale: string | undefined;

      if (user) {
        socket.user = user;
      }

      roomId = user?.currentRoomId || cookies.roomId;
      sessionId = user?.id || cookies.sessionId;
      siteLocale = cookies.locale;

      if (siteLocale) {
        socket.siteLocale = convertToLangType(siteLocale);
      }

      if (roomId) {
        socket.roomId = roomId;
        socket.join(roomId);
      }
      if (!sessionId) {
        sessionId = uuidv6();
      }
      socket.sessionId = sessionId;

      next();
    } catch (error) {
      next(error as Error);
    }
  });
};
