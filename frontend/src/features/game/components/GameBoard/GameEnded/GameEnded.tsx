import { useAppSelector } from "@/lib/redux/hooks";
import { Modal } from "@/components/Modal";
import {
  selectEndReason,
  selectGameStatus,
  selectPlayers,
  selectWinnerId,
} from "../../../lib/redux/selectors";
import { useLocaleContext } from "@/features/language/helpers/LocaleContext";
import { t } from "@/features/language/lib/i18n";
import Image from "next/image";
import { Player } from "../../../utils/types/gameTypes";
import Titles from "./Titles";
import { socket } from "@/features/game/lib/socket.io/socketio";
import EndingPlayerDisplay from "./EndingPlayerDisplay";
import PointDiffAppliedDisplay from "./PointDiffAppliedDisplay";

export const GameEnded = () => {
  const gameStatus = useAppSelector(selectGameStatus);
  const players = useAppSelector(selectPlayers);
  const [locale] = useLocaleContext();

  if (gameStatus !== "ended") return null;

  return (
    <Modal z={40} className="items-start sm:items-center">
      <div className="p-2 xxs:p-4 bg-slate-800 rounded-2xl text-white shadow-lg">
        <h2 className="text-2xl font-bold text-center mb-2">
          {t(locale, "game.gameEnded")}
        </h2>
        <div className="text-center text-gray-300 italic mb-2 xxs:mb-4">
          <EndingPlayerDisplay />
          <PointDiffAppliedDisplay />
        </div>

        <div className="grid grid-cols-3 grid-rows-[repeat(10,minmax(0,auto))] gap-1 xxs:gap-2">
          <PlayerComp player={players[0]} />
          <Titles />
          <PlayerComp player={players[1]} />
        </div>
      </div>
    </Modal>
  );
};

const PlayerComp = ({ player }: { player: Player }) => {
  const winnerId = useAppSelector(selectWinnerId);
  const players = useAppSelector(selectPlayers);
  const otherPlayer = players.find((p) => p.id !== player.id);
  const isWinner = player.id === winnerId;
  const isYou = player.id === socket.sessionId;
  const endReason = useAppSelector(selectEndReason);

  return (
    <div className="bg-slate-700 rounded-xl p-4 grid-rows-subgrid grid row-span-full">
      {/* Avatar */}
      <div className="relative flex justify-center">
        {player.image ? (
          <Image
            src={player.image}
            alt={player.username}
            width={64}
            height={64}
            className="rounded-full border-2 border-white object-cover"
          />
        ) : (
          <div className="w-16 h-16 rounded-full bg-gray-600 flex items-center justify-center text-xl font-bold">
            {player.username[0].toUpperCase()}
          </div>
        )}
        {isWinner && (
          <span className="absolute -top-2 -right-2 text-yellow-400 text-2xl">
            👑
          </span>
        )}
        {player.leftTheGame && (
          <span className="absolute -bottom-2 -right-2 text-sm text-red-400">
            (Left)
          </span>
        )}
        {isYou && (
          <span className="absolute -bottom-2 -left-2 text-sm font-bold">
            (You)
          </span>
        )}
      </div>

      {/* Username */}
      <h3 className="font-semibold text-lg text-center">{player.username}</h3>

      {/* Stats */}
      <div className="text-sm space-y-1 text-gray-200 grid grid-rows-subgrid row-span-8 w-full">
        {/*  Points */}
        <Paragraph text={player.points} />
        {/* Points diff */}
        <Paragraph text={player.pointsDiff} />
        {/* Total Words Played */}
        <Paragraph text={player.totalWords} />
        {/* Highest scoring word */}
        <Paragraph
          text={
            player.highestScoringWord
              ? `${player.highestScoringWord.word}(${player.highestScoringWord.points})`
              : undefined
          }
        />
        {/* Highest scoring move */}
        <Paragraph
          text={
            player.highestScoringMove
              ? `${player.highestScoringMove?.words.join(", ")}(${
                  player.highestScoringMove.points
                })`
              : undefined
          }
        />
        {/* Avg points per word */}
        <Paragraph text={player.avgPerWord} />
        {/* Total pass count */}
        <Paragraph text={player.totalPassCount} />
        {/* Endgame bonus */}
        <Paragraph
          text={
            endReason === "allTilesUsed"
              ? isWinner
                ? otherPlayer?.hand.length
                : -player.hand.length
              : undefined
          }
        />
      </div>
    </div>
  );
};

const Paragraph = ({ text }: { text: string | number | undefined }) => {
  const [locale] = useLocaleContext();

  return (
    <p className="text-center m-0">
      {text ?? t(locale, "game.endedModal.unavailable")}
    </p>
  );
};
