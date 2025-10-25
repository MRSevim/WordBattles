import { useAppSelector } from "@/lib/redux/hooks";
import { Modal } from "@/components/Modal";
import { selectGameStatus, selectPlayers } from "../../../lib/redux/selectors";
import { useLocaleContext } from "@/features/language/helpers/LocaleContext";
import { t, tReact } from "@/features/language/lib/i18n";
import Image from "next/image";
import { Player } from "../../../utils/types/gameTypes";
import Titles from "./Titles";
import { socket } from "@/features/game/lib/socket.io/socketio";

export const GameEnded = () => {
  const gameStatus = useAppSelector(selectGameStatus);
  const players = useAppSelector(selectPlayers);
  const [locale] = useLocaleContext();

  if (gameStatus !== "ended") return null;

  // Determine the winner
  let winner: Player | undefined = undefined;
  let maxScore = -Infinity;

  // 🧩 Determine reason for game end
  let endReason:
    | "consecutivePasses"
    | "allTilesUsed"
    | "playerLeft"
    | "normal" = "normal";

  const passingPlayer = players.find((p) => p.consecutivePassCount >= 2);
  const leavingPlayer = players.find((p) => p.leftTheGame);
  const finishingPlayer = players.find((p) => p.hand.length === 0);

  if (passingPlayer) {
    endReason = "consecutivePasses";
  } else if (leavingPlayer) {
    endReason = "playerLeft";
  } else if (finishingPlayer) {
    players.forEach((player) => {
      if (player.score > maxScore) {
        maxScore = player.score;
        winner = player;
      }
    });
    endReason = "allTilesUsed";
  }

  // 🗣️ Localized reason text
  let reasonText;
  switch (endReason) {
    case "consecutivePasses":
      reasonText = tReact(
        locale,
        "game.endedModal.endReason.consecutivePasses",
        {
          player: <Bolded text={passingPlayer?.username} />,
        }
      );
      break;
    case "allTilesUsed":
      reasonText = tReact(locale, "game.endedModal.endReason.allTilesUsed", {
        player: <Bolded text={finishingPlayer?.username} />,
      });
      break;
    case "playerLeft":
      reasonText = tReact(locale, "game.endedModal.endReason.playerLeft", {
        player: <Bolded text={leavingPlayer?.username} />,
      });
      break;
    default:
      reasonText = t(locale, "game.endedModal.endReason.default");
  }

  return (
    <Modal z={40} className="items-start sm:items-center">
      <div className="p-2 xxs:p-4 bg-slate-800 rounded-2xl text-white shadow-lg">
        <h2 className="text-2xl font-bold text-center mb-2">
          {t(locale, "game.gameEnded")}
        </h2>
        <p className="text-center text-gray-300 mb-2 xxs:mb-4 italic">
          {reasonText}
        </p>

        <div className="grid grid-cols-3 grid-rows-[repeat(10,minmax(0,auto))] gap-1 xxs:gap-2">
          <PlayerComp player={players[0]} winner={winner} />
          <Titles />
          <PlayerComp player={players[1]} winner={winner} />
        </div>
      </div>
    </Modal>
  );
};

const Bolded = ({ text }: { text?: string }) => (
  <span className="font-bold">{text || ""}</span>
);

const PlayerComp = ({
  player,
  winner,
}: {
  player: Player;
  winner?: Player;
}) => {
  const players = useAppSelector(selectPlayers);
  const isWinner = player.id === winner?.id;
  const hasLeft = player.leftTheGame;
  const scoreDiff =
    (players.find((p) => p.id === player.id)?.score ?? 0) -
    (players.find((p) => p.id !== player.id)?.score ?? 0);

  const isYou = player.id === socket.sessionId;

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
        {hasLeft && (
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
        <Paragraph text={player.score} />
        {/* Points diff */}
        <Paragraph text={scoreDiff > 0 ? "+" + scoreDiff : scoreDiff} />
        {/* Total Words Played */}
        <Paragraph text={"-"} />
        {/* Highest scoring word */}
        <Paragraph text={"-"} />
        {/* Highest scoring move */}
        <Paragraph text={"-"} />
        {/* Avg points per word */}
        <Paragraph text={"-"} />
        {/* Total pass count */}
        <Paragraph text={"-"} />
        {/* Endgame bonus */}
        <Paragraph text={"-"} />
      </div>
    </div>
  );
};

const Paragraph = ({ text }: { text: string | number }) => (
  <p className="text-center m-0">{text}</p>
);
