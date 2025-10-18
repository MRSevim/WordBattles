import { RootState } from "@/lib/redux/store";
import { findSocketPlayer } from "../../utils/helpers";

//game
export const selectGameStatus = (state: RootState) => state.game.status;
export const selectGame = (state: RootState) => state.game;
export const selectGameHistory = (state: RootState) => state.game.history;
export const selectUndrawnLetterPool = (state: RootState) =>
  state.game.undrawnLetterPool;
export const selectGameRoomId = (state: RootState) => state.game.roomId;
export const selectEmptyLetterIds = (state: RootState) =>
  state.game.emptyLetterIds;
export const selectGameLanguage = (state: RootState) => state.game.lang;

//players
export const selectPlayers = (state: RootState) => state.game.players;
export const selectPlayerTurnState = (state: RootState) => {
  const player = findSocketPlayer(state.game);
  return player?.turn;
};
export const selectPlayerHand = (state: RootState) => {
  const player = findSocketPlayer(state.game);

  return player?.hand;
};

//dragging
export const selectDraggingActive = (state: RootState) =>
  state.game.draggingValues.active;
export const selectDraggingOver = (state: RootState) =>
  state.game.draggingValues.over;
export const selectDraggingActiveIndex = (state: RootState) => {
  const hand = findSocketPlayer(state.game)?.hand;
  if (hand) {
    return hand.findIndex(
      (letter) => letter.id === state.game.draggingValues.active
    );
  }
  return -1;
};
export const selectDraggingOverIndex = (state: RootState) => {
  const hand = findSocketPlayer(state.game)?.hand;
  if (hand) {
    return hand.findIndex(
      (letter) => letter.id === state.game.draggingValues.over
    );
  }
  return -1;
};
export const selectDraggedLetter = (state: RootState) =>
  state.game.draggingValues.activeLetter;

//switching
export const selectIsSwitchingActive =
  (state: RootState) => (i: number | undefined) => {
    return (
      state.game.switchIndices.includes(i as number) && state.game.switching
    );
  };
export const selectIsSwitching = (state: RootState) => state.game.switching;
export const selectSwitchValues = (state: RootState) =>
  state.game.switchIndices;

//initial data
export const selectInitialPlayerData = (state: RootState) =>
  state.initialData.players;
export const selectValidLetters = (state: RootState) =>
  state.initialData.validLetters;

//other
export const selectSidePanelOpen = (state: RootState) => state.sidePanelOpen;
export const selectLetterPoolOpen = (state: RootState) => state.letterPoolOpen;
