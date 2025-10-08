import { gameState, Player } from "../types/gameTypes";
import { pass, switchTurns } from "./gameHelpers";
import { getGameFromMemory, saveGameToMemory } from "./memoryGameHelpers";

export const timerRanOutUnsuccessfully = (state: gameState) => {
  const currentPlayer = state.players.find((player) => player.turn) as Player;

  pass(currentPlayer.hand, state.board);
  state.passCount += 1;
  state.history.push({
    playerSessionId: currentPlayer.sessionId,
    words: [],
    playerPoints: 0,
  });
};

export const clearTimerIfExist = (roomId: string) => {
  const game = getGameFromMemory(roomId);
  const timer = game?.timerInterval;
  if (timer) {
    clearInterval(timer);
  }
};

export const setUpTimerInterval = (state: gameState, io: any) => {
  const { players, roomId } = state;
  const currentPlayer = players.find((player) => player.turn) as Player;

  clearTimerIfExist(roomId);
  // Set a new interval for the opponent's timer
  const timerInterval = setInterval(() => {
    if (currentPlayer.timer > 0) {
      currentPlayer.timer -= 1;
      io.to(roomId).emit("Timer Runs", players);
    } else {
      clearTimerIfExist(roomId); // Clear the interval when timer runs out
      timerRanOutUnsuccessfully(state);
      currentPlayer.closedPassCount += 1;
      switchTurns(state, io);
    }
  }, 1000);

  return timerInterval;
};
