import { GameBoard } from "../components/GameBoard";
import { io } from "socket.io-client";

export const socket = io(import.meta.env.VITE_FRONTEND_URL, {
  autoConnect: false,
});
socket.connect();

socket.onAny((event, ...args) => {
  console.log(event, args);
});

export const Homepage = () => {
  return (
    <div className="container mx-auto flex">
      <GameBoard />
      <div className="w-1/3 bg-yellow-500">xdd</div>
    </div>
  );
};
