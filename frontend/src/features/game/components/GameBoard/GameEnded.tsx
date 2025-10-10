import { useAppSelector } from "@/lib/redux/hooks";
import { capitalizeFirstLetter } from "@/features/game/utils/helpers";
import { Player } from "../../utils/types/gameTypes";
import { Modal } from "@/components/Modal";
import { selectGameStatus, selectPlayers } from "../../lib/redux/selectors";

export const GameEnded = () => {
  const gameStatus = useAppSelector(selectGameStatus);
  const players = useAppSelector(selectPlayers) || [];

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

  if (gameStatus === "ended") {
    return (
      <Modal>
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
      </Modal>
    );
  }
};
