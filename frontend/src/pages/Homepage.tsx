import { GameBoard } from "../components/GameBoard";
import { socket } from "../lib/socketio";
import { SidePanel } from "../components/SidePanel";
import { toast } from "react-toastify";

export const Homepage = () => {
  socket.on("connect_error", (err) => {
    const error: string = `Bağlantı başarısız: ${err.message}`;
    toast.error(error);
  });

  return (
    <div className="container mx-auto flex">
      <GameBoard />
      <SidePanel />
    </div>
  );
};
