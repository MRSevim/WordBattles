import { io, Socket } from "socket.io-client";
import { User } from "@/features/auth/utils/types";

interface ISocket extends Socket {
  sessionId?: string;
  user?: User;
}

export const socket: ISocket = io(process.env.NEXT_PUBLIC_BACKEND_URL, {
  autoConnect: false,
  transports: ["websocket", "polling", "flashsocket"],
});

socket.onAny((event, ...args) => {
  console.log(event, args);
});

socket.on("session", ({ sessionId }) => {
  // attach the session ID to the next reconnection attempts
  socket.auth = { ...socket.auth, sessionId };
  // store it in the localStorage
  localStorage.setItem("sessionId", sessionId);
  window.dispatchEvent(new Event("storage"));
  socket.sessionId = sessionId;
});
