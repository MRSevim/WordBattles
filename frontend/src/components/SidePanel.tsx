import { useAppSelector } from "../lib/redux/hooks";
import { RootState } from "../lib/redux/store";
import { Player } from "../lib/redux/slices/gameSlice";
import { socket } from "../lib/socketio";

export const SidePanel = () => {
  const game = useAppSelector((state: RootState) => state.game.game);

  return (
    <div className="w-1/3 bg-slate-400">
      {game && (
        <>
          <div className="flex align-center justify-around my-8">
            <PlayerContainer player={game?.players[0]} />
            <PlayerContainer player={game?.players[1]} />
          </div>
          <div>Oyun Geçmişi</div>
        </>
      )}
    </div>
  );
};

const PlayerContainer = ({ player }: { player: Player | undefined }) => {
  return (
    <div
      className={
        "flex flex-col text-center border-solid border-2 rounded p-4 " +
        (player?.turn ? "border-amber-300" : "")
      }
    >
      <p>{player?.username}</p>
      <p>Derece:xx</p>
      Puan: 0<p>{player?.socketId === socket.id && "Siz"}</p>
    </div>
  );
};
