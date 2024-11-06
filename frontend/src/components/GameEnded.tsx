import { useAppSelector } from "../lib/redux/hooks";
import { Player } from "../lib/redux/slices/gameSlice";
import { RootState } from "../lib/redux/store";
import { capitalizeFirstLetter } from "../lib/helpers";

export const GameEnded = () => {
  const players =
    useAppSelector((state: RootState) => state.game.game?.players) || [];

  // Determine the winner and handle ties
  let winner: Player | null = null;
  let maxScore = -Infinity;

  players.forEach((player) => {
    if (player.score > maxScore) {
      maxScore = player.score;
      winner = player;
    } else if (player.score === maxScore) {
      winner = null;
    }
  });

  return (
    <div className="p-5 bg-slate-700 w-96 text-white">
      <h2 className="text-lg font-bold mb-2">Oyun sonlandı.</h2>
      {!winner ? (
        <p>Beraberlik! Herkesin puanı eşit: {maxScore}</p>
      ) : (
        <p>
          Kazanan: {capitalizeFirstLetter(winner["username"])} - Puan:{" "}
          {winner["score"]}
        </p>
      )}
    </div>
  );
};
