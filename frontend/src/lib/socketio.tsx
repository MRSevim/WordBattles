import { io } from "socket.io-client";

export const socket = io(import.meta.env.VITE_FRONTEND_URL, {
  autoConnect: true,
});

socket.onAny((event, ...args) => {
  console.log(event, args);
});
