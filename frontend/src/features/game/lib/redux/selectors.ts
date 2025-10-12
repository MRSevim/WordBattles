import { RootState } from "@/lib/redux/store";
import { findSocketPlayer } from "../../utils/helpers";

//game
export const selectGameStatus = (state: RootState) => state.game.status;
export const selectGame = (state: RootState) => state.game;
export const selectGameHistory = (state: RootState) => state.game.history;
export const selectUndrawnLetterPool = (state: RootState) =>
  state.game.undrawnLetterPool;
export const selectEmptyLetterIds = (state: RootState) =>
  state.game.emptyLetterIds;
export const selectGameRoomId = (state: RootState) => state.game.roomId;

//dragging over
export const selectDraggingActive = (state: RootState) =>
  state.draggingValues.active;
export const selectDraggingOver = (state: RootState) =>
  state.draggingValues.over;

//switching
export const selectIsSwitchingActive =
  (state: RootState) => (i: number | undefined) => {
    return (
      state.switch.switchValues.includes(i as number) && state.switch.switching
    );
  };
export const selectIsSwitching = (state: RootState) => state.switch.switching;
export const selectSwitchValues = (state: RootState) =>
  state.switch.switchValues;

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

//other
export const selectSidePanelOpen = (state: RootState) => state.sidePanelOpen;
export const selectLetterPoolOpen = (state: RootState) => state.letterPoolOpen;
