import { GameBoard } from "../components/GameBoard";
import { socket } from "../lib/socketio";
import { useAppDispatch } from "../lib/redux/hooks";
import { set } from "../lib/redux/slices/globalErrorSlice";
import { SidePanel } from "../components/SidePanel";

export const Homepage = () => {
  const dispatch = useAppDispatch();
  socket.on("connect_error", (err) => {
    const error: string = `Bağlantı başarısız: ${err.message}`;
    dispatch(set(error));
  });

  return (
    <div className="container mx-auto flex">
      <GameBoard />
      <SidePanel />
    </div>
  );
};
