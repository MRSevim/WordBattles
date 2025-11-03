"use client";
import { Modal } from "@/components/Modal";
import { t, tReact } from "@/features/language/lib/i18n";
import { useLocaleContext } from "@/features/language/helpers/LocaleContext";
import { GameState } from "../../../../../types";
import Link from "next/link";
import { useState } from "react";
import { PlayerCompInner } from "@/features/game/components/GameBoard/GameEnded/GameEnded";
import Titles from "@/features/game/components/GameBoard/GameEnded/Titles";

const Games = ({ games }: { games: GameState[] }) => {
  const [locale] = useLocaleContext();
  const [selectedGame, setSelectedGame] = useState<GameState | null>(null);

  return (
    <>
      <div className="space-y-3">
        {games.map((game, i) => {
          const winner = game.players.find((p) => p.id === game.winnerId);
          return (
            <div
              key={i}
              className="flex flex-col sm:flex-row items-center justify-between bg-white dark:bg-gray-800 p-3 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700"
            >
              {/* Game Info */}
              <div className="flex flex-col gap-1 text-gray-700 dark:text-gray-200">
                <div className="font-medium">
                  <i className="bi bi-translate mr-1 text-blue-500" />
                  {game.lang.toUpperCase()} •{" "}
                  {t(locale, "publicUserPage.pastGames.type." + game.type)}
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  {winner
                    ? `${t(locale, "publicUserPage.pastGames.winner")}: ${
                        winner.username
                      }`
                    : t(locale, "publicUserPage.pastGames.noWinner")}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2 mt-2 sm:mt-0">
                <button
                  onClick={() => setSelectedGame(game)}
                  className="flex items-center gap-1 bg-blue-500 hover:bg-blue-600 text-white text-sm px-3 py-1.5 rounded-md transition cursor-pointer"
                >
                  <i className="bi bi-bar-chart-fill"></i>
                  {t(locale, "publicUserPage.pastGames.viewStats")}
                </button>

                <Link
                  href="#"
                  className="flex items-center gap-1 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 text-sm px-3 py-1.5 rounded-md transition"
                >
                  <i className="bi bi-clock-history"></i>
                  {t(locale, "publicUserPage.pastGames.viewHistory")}
                </Link>
              </div>
            </div>
          );
        })}
      </div>
      {selectedGame && (
        <GameStatsModal
          onClose={() => {
            setSelectedGame(null);
          }}
          game={selectedGame}
        />
      )}
    </>
  );
};

const GameStatsModal = ({
  game,
  onClose,
}: {
  game: GameState;
  onClose: () => void;
}) => {
  const [locale] = useLocaleContext();
  const players = game.players;
  const winnerId = game.winnerId;
  const endReason = game.endReason;
  return (
    <Modal>
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg max-w-md mx-auto relative w-[90%] ">
        <h4 className="font-semibold text-lg mb-3 text-gray-800 dark:text-gray-100 flex items-center gap-2">
          <i className="bi bi-bar-chart-fill text-blue-500"></i>
          {t(locale, "publicUserPage.pastGames.gameStats")}
        </h4>

        <div className="text-center text-gray-300 italic mb-2 xxs:mb-4">
          <EndingPlayerDisplay game={game} />
        </div>

        <div className="grid grid-cols-3 justify-items-center items-center grid-rows-[repeat(10,minmax(0,auto))] gap-1 xxs:gap-2">
          <PlayerCompInner
            player={game.players[0]}
            players={players}
            winnerId={winnerId}
            endReason={endReason}
          />
          <Titles />
          <PlayerCompInner
            player={game.players[1]}
            players={players}
            winnerId={winnerId}
            endReason={endReason}
          />
        </div>

        <button
          onClick={onClose}
          className="cursor-pointer mt-4 w-full bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium px-3 py-2 rounded-md transition"
        >
          {t(locale, "closeModal")}
        </button>
      </div>
    </Modal>
  );
};

const EndingPlayerDisplay = ({ game }: { game: GameState }) => {
  const players = game.players;
  const endingPlayerId = game.endingPlayerId;
  const endingPlayer = players.find((player) => player.id === endingPlayerId);
  const endReason = game.endReason;
  const [locale] = useLocaleContext();

  // 🗣️ Localized reason text
  let localeText;
  switch (endReason) {
    case "consecutivePasses":
      localeText = "consecutivePasses";
      break;
    case "allTilesUsed":
      localeText = "allTilesUsed";
      break;
    case "playerLeft":
      localeText = "playerLeft";
      break;
    default:
      localeText = "default";
  }
  return (
    <p>
      {t(locale, "game.endedModal.endReason.label")}
      {tReact(locale, "game.endedModal.endReason." + localeText, {
        player: <span className="font-bold">{endingPlayer?.username}</span>,
      })}
    </p>
  );
};

export default Games;
