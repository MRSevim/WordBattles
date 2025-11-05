import {
  GameTypeDisplay,
  UsernameAndPoints,
} from "@/features/game/components/SidePanel/SidePanel";
import { GameState, Player } from "@/features/game/utils/types/gameTypes";
import { GameMoves } from "./GameMoves";

export const SidePanel = ({
  game,
  players,
}: {
  game: GameState;
  players: Player[];
}) => {
  return (
    <div className="flex flex-col m-2 xxs:m-3">
      <Players players={players} />
      <GameTypeDisplay />
      <GameMoves game={game} />
    </div>
  );
};

const Players = ({ players }: { players: Player[] }) => {
  return (
    <div className="flex align-center gap-2 justify-around mb-0 xs:mb-2 sm:mb-6">
      {players.map((player) => (
        <PlayerContainer key={player.id} player={player} />
      ))}
    </div>
  );
};

const PlayerContainer = ({ player }: { player: Player }) => {
  return (
    <div
      className={
        "flex flex-col items-center justify-around bg-white text-black text-center rounded p-2 xxs:p-4 w-26 xxs:w-36"
      }
    >
      <UsernameAndPoints
        id={player.id}
        username={player.username}
        points={player.points}
        leftTheGame={player.leftTheGame}
        division={player.division}
      />
    </div>
  );
};
