import { io, Socket } from "socket.io-client";
import { User } from "./redux/slices/userSlice";

interface ISocket extends Socket {
  sessionId?: string;
  user?: User;
}

export const socket: ISocket = io(import.meta.env.VITE_BACKEND_URL, {
  autoConnect: false,
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
