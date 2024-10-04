import { useAppSelector } from "../lib/redux/hooks";
import { RootState } from "../lib/redux/store";
import { Player } from "../lib/redux/slices/gameSlice";

export const SidePanel = () => {
  const game = useAppSelector((state: RootState) => state.game.game);

  return (
    <div className="w-1/3 bg-slate-400">
      {game && (
        <>
          <div className="flex align-center justify-around my-8">
            <PlayerContainer player={game?.players.player1} />
            <PlayerContainer player={game?.players.player2} />
          </div>
          <div>Game History</div>
        </>
      )}
    </div>
  );
};

const PlayerContainer = ({ player }: { player: Player | undefined }) => {
  return (
    <div
      className={
        "flex flex-col text-center border-solid border-2 border-sky-50 rounded p-4 " +
        (player?.turn && "border-orange-900")
      }
    >
      <p>{player?.username}</p>
      <p>rank:xx</p>
      Points: 0
    </div>
  );
};
