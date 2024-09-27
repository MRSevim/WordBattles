import { GameBoard } from "../components/GameBoard";
import { io } from "socket.io-client";
import { useAppDispatch } from "../lib/redux/hooks";
import { set } from "../lib/redux/slices/globalErrorSlice";

export const socket = io(import.meta.env.VITE_FRONTEND_URL, {
  autoConnect: false,
});

socket.onAny((event, ...args) => {
  console.log(event, args);
});

export const Homepage = () => {
  const dispatch = useAppDispatch();
  socket.on("connect_error", (err) => {
    const error: string = `Bağlantı başarısız: ${err.message}`;
    dispatch(set(error));
  });

  return (
    <div className="container mx-auto flex">
      <GameBoard />
      <div className="w-1/3 bg-yellow-500">xdd</div>
    </div>
  );
};
