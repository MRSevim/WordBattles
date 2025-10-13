import { io, Socket } from "socket.io-client";

interface ISocket extends Socket {
  sessionId?: string;
}

export const socket: ISocket = io(process.env.NEXT_PUBLIC_BACKEND_URL, {
  autoConnect: false,
  transports: ["websocket"],
  withCredentials: true,
});

socket.onAny((event, ...args) => {
  console.log(event, args);
});
