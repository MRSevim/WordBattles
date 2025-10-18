import { useAppSelector } from "@/lib/redux/hooks";
import { capitalizeFirstLetter } from "@/features/game/utils/helpers";
import { Modal } from "@/components/Modal";
import { selectGameStatus, selectPlayers } from "../../lib/redux/selectors";
import useIsClient from "@/utils/hooks/isClient";
import { useLocaleContext } from "@/features/language/helpers/LocaleContext";
import { t } from "@/features/language/lib/i18n";

export const GameEnded = () => {
  const gameStatus = useAppSelector(selectGameStatus);
  const players = useAppSelector(selectPlayers);
  const isClient = useIsClient();
  const [locale] = useLocaleContext();

  // Determine the winner and handle ties
  let winner: (typeof players)[0] | null = null;
  let maxScore = -Infinity;

  players.forEach((player) => {
    if (player.score > maxScore) {
      maxScore = player.score;
      winner = player;
    } else if (player.score === maxScore) {
      winner = null;
    }
  });

  if (gameStatus === "ended" && isClient) {
    return (
      <Modal>
        <div className="p-5 bg-slate-700 w-96 text-white">
          <h2 className="text-lg font-bold mb-2">
            {t(locale, "game.gameEnded")}
          </h2>
          {!winner ? (
            <p>
              {t(locale, "game.tie")} {maxScore}
            </p>
          ) : (
            <p>
              {t(locale, "game.winner")}{" "}
              {capitalizeFirstLetter(winner["username"])} -{" "}
              {t(locale, "game.points")} {winner["score"]}
            </p>
          )}
        </div>
      </Modal>
    );
  }
};
