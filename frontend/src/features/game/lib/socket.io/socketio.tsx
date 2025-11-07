"use client";
import { io, Socket } from "socket.io-client";

interface ISocket extends Socket {
  sessionId?: string;
}

// Use globalThis to persist the socket across hot reloads
const globalForSocket = globalThis as unknown as {
  socket?: ISocket;
};

export const socket =
  globalForSocket.socket ||
  (io(process.env.NEXT_PUBLIC_BACKEND_URL!, {
    autoConnect: false,
    withCredentials: true,
    retries: 3,
    transports: ["websocket", "polling"],
    ackTimeout: 5000,
  }) as ISocket);

// Only assign to global in development to avoid leaks in production
if (process.env.NODE_ENV !== "production") {
  globalForSocket.socket = socket;
}

/* socket.onAny((event, ...args) => {
  console.log(event, args);
}); */
