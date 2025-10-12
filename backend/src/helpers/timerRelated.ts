import { gameState } from "../types/gameTypes";
import { Io } from "../types/types";
import { returnToHand, switchTurns } from "./gameHelpers";
import { getGameFromMemory } from "./memoryGameHelpers";

export const clearTimerIfExist = (roomId: string) => {
  const game = getGameFromMemory(roomId);

  clearInterval(game?.timerInterval);
};

export const setUpTimerInterval = (state: gameState, io: Io) => {
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
      });
      currentPlayer.passCount += 1;
      state.passCount += 1;
      switchTurns(state, io);
    }
  }, 1000);

  return timerInterval;
};
