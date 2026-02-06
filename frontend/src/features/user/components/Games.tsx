"use client";
import { Modal } from "@/components/Modal";
import { useState } from "react";
import { PlayerCompInner } from "@/features/game/components/GameBoard/GameEnded/GameEnded";
import Titles from "@/features/game/components/GameBoard/GameEnded/Titles";
import { EndingPlayerDisplayInner } from "@/features/game/components/GameBoard/GameEnded/EndingPlayerDisplay";
import { GameHistoryDisplayWrapper } from "./GameHistory/GameHistoryDisplay";
import { GameState } from "@/features/game/utils/types/gameTypes";
import { useDictionaryContext } from "@/features/language/utils/DictionaryContext";

export type ModalType = "history" | "stats" | "";

const Games = ({ games }: { games: GameState[] }) => {
  const { dictionary } = useDictionaryContext();
  const [selectedGame, setSelectedGame] = useState<GameState | null>(null);
  const [modalType, setModalType] = useState<ModalType>("");

  return (
    <>
      <div className="space-y-3">
        {games.map((game, i) => {
          return (
            <div
              key={i}
              className="flex flex-col sm:flex-row items-center justify-between bg-white dark:bg-gray-800 p-3 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700"
            >
              {/* Game Info */}
              <GameInfo game={game} />

              {/* Action Buttons */}
              <div className="flex gap-2 mt-2 sm:mt-0">
                <button
                  onClick={() => {
                    setModalType("stats");
                    setSelectedGame(game);
                  }}
                  className="flex items-center gap-1 bg-blue-500 hover:bg-blue-600 text-white text-sm px-3 py-1.5 rounded-md transition cursor-pointer"
                >
                  <i className="bi bi-bar-chart-fill"></i>
                  {dictionary.publicUserPage.pastGames.viewStats}
                </button>

                <button
                  onClick={() => {
                    setModalType("history");
                    setSelectedGame(game);
                  }}
                  className="flex items-center gap-1 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 text-sm px-3 py-1.5 rounded-md transition cursor-pointer"
                >
                  <i className="bi bi-clock-history"></i>
                  {dictionary.publicUserPage.pastGames.viewHistory}
                </button>
              </div>
            </div>
          );
        })}
      </div>
      {selectedGame && (
        <GameModal
          type={modalType}
          onClose={() => {
            setModalType("");
            setSelectedGame(null);
          }}
          game={selectedGame}
        />
      )}
    </>
  );
};

const GameInfo = ({ game }: { game: GameState }) => {
  const { dictionary } = useDictionaryContext();
  const winner = game.players.find((p) => p.id === game.winnerId);
  return (
    <div className="flex flex-col gap-1 text-gray-700 dark:text-gray-200">
      <div className="font-medium">
        <i className="bi bi-translate mr-1 text-blue-500" />
        {game.lang.toUpperCase()} •{" "}
        {dictionary.publicUserPage.pastGames.type[game.type]}
      </div>
      <div className="text-sm text-gray-500 dark:text-gray-400">
        {winner
          ? `${dictionary.winner}: ${winner.username}`
          : dictionary.publicUserPage.pastGames.noWinner}
      </div>
    </div>
  );
};

const GameModal = ({
  type,
  game,
  onClose,
}: {
  type: ModalType;
  game: GameState;
  onClose: () => void;
}) => {
  const { dictionary } = useDictionaryContext();
  if (!type) return null;

  return (
    <Modal className="fixed">
      <div
        className={
          "max-h-[90%] overflow-y-auto bg-white dark:bg-gray-800 p-2 xxs:p-4 rounded-lg shadow-lg mx-auto relative  " +
          (type === "stats" ? "max-w-lg" : "")
        }
      >
        <h4 className="font-semibold text-lg mb-3 text-gray-800 dark:text-gray-100 flex items-center gap-2">
          <i
            className={`bi ${
              type === "history"
                ? "bi-clock-history text-amber-500"
                : "bi-bar-chart-fill text-blue-500"
            }`}
          ></i>
          {dictionary.publicUserPage.pastGames[`${type}Label`]}
        </h4>

        {type === "stats" && <GameStatsDisplay game={game} />}
        {type === "history" && <GameHistoryDisplayWrapper game={game} />}
        <button
          onClick={onClose}
          className="cursor-pointer mt-4 w-full bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium px-3 py-2 rounded-md transition"
        >
          {dictionary.closeModal}
        </button>
      </div>
    </Modal>
  );
};

const GameStatsDisplay = ({ game }: { game: GameState }) => {
  const players = game.players;
  const winnerId = game.winnerId;
  const endReason = game.endReason;
  return (
    <>
      <div className="text-center text-gray-300 italic mb-2 xxs:mb-4">
        <EndingPlayerDisplayInner
          players={players}
          endReason={endReason}
          endingPlayerId={game.endingPlayerId}
        />
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
    </>
  );
};

export default Games;
