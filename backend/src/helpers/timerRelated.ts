import { GameState } from "../types/gameTypes";
import { Io } from "../types/types";
import { returnToHand, switchTurns } from "./gameHelpers";
import { getGameFromMemory } from "./memoryGameHelpers";
import { filterHand } from "./misc";

export const clearTimerIfExist = (roomId: string) => {
  const game = getGameFromMemory(roomId);

  clearInterval(game?.timerInterval);
};

export const setUpTimerInterval = (state: GameState, io: Io) => {
  const { players, roomId } = state;
  const currentPlayer = players.find((player) => player.turn);

  clearTimerIfExist(roomId);

  if (!currentPlayer || state.status !== "playing") return;

  // Set a new interval
  const timerInterval = setInterval(() => {
    if (currentPlayer.timer > 0) {
      currentPlayer.timer -= 1;
      io.to(roomId).emit("Timer Runs", players);
    } else {
      io.to(roomId).emit("Time is Up", {
        currentPlayerId: currentPlayer.id,
      });
      clearTimerIfExist(roomId); // Clear the interval when timer runs out
      returnToHand(currentPlayer.hand, state.board);
      state.history.push({
        playerId: currentPlayer.id,
        words: [],
        playerPoints: 0,
        placedTiles: [],
        playerHandAfterMove: filterHand(currentPlayer.hand),
      });
      currentPlayer.consecutivePassCount += 1;
      currentPlayer.totalPassCount += 1;
      switchTurns(state, io);
    }
  }, 1000);

  return timerInterval;
};
