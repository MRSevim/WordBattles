import { gameState } from "../types/gameTypes";
import { Io } from "../types/types";
import { setUpTimerInterval } from "./timerRelated";

type gameWithTimerInterval = {
  gameState: gameState;
  timerInterval?: ReturnType<typeof setInterval>;
};
let ongoingGames: gameWithTimerInterval[] = [];

export const saveGameToMemory = (game: gameState, io: Io) => {
  const foundGameIndex = ongoingGames.findIndex(
    (g) => g.gameState.roomId === game.roomId
  );

  if (foundGameIndex !== -1) {
    // ✅ Preserve the existing timer interval
    const existingTimer = ongoingGames[foundGameIndex].timerInterval;

    ongoingGames[foundGameIndex] = {
      gameState: game,
      timerInterval: existingTimer, // Keep timer running
    };
  } else {
    // Create new game with fresh timer
    ongoingGames.push({
      gameState: game,
      timerInterval: setUpTimerInterval(game, io),
    });
  }
};

export const getGameFromMemory = (roomId: string) => {
  const foundGame = ongoingGames.find(
    (game) => game.gameState.roomId === roomId
  );

  return foundGame;
};

export const removeGameFromMemory = (roomId: string) => {
  const foundGameIndex = ongoingGames.findIndex(
    (g) => g.gameState.roomId === roomId
  );

  if (foundGameIndex !== -1) {
    // Clear the timer interval before removing the game
    clearInterval(ongoingGames[foundGameIndex].timerInterval);
    ongoingGames.splice(foundGameIndex, 1);
  }
};
