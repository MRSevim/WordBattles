import { io, Socket } from "socket.io-client";
import { User } from "@/features/auth/utils/types";

interface ISocket extends Socket {
  user?: User;
  sessionId?: string;
}

export const socket: ISocket = io(process.env.NEXT_PUBLIC_BACKEND_URL, {
  autoConnect: false,
  transports: ["websocket"],
});

socket.onAny((event, ...args) => {
  console.log(event, args);
});
