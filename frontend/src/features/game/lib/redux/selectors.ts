import { RootState } from "@/lib/redux/store";
import { getPlayer } from "../../utils/helpers";

export const selectGameStatus = (state: RootState) => state.game.status;
export const selectGame = (state: RootState) => state.game.game;
export const selectLetterPoolOpen = (state: RootState) => state.letterPoolOpen;
export const selectUndrawnLetterPool = (state: RootState) =>
  state.game.game?.undrawnLetterPool;
export const selectDraggingActive = (state: RootState) =>
  state.draggingValues.active;
export const selectDraggingOver = (state: RootState) =>
  state.draggingValues.over;
export const selectIsSwitchingActive =
  (state: RootState) => (i: number | undefined) => {
    return (
      state.switch.switchValues.includes(i as number) && state.switch.switching
    );
  };
export const selectIsSwitching = (state: RootState) => state.switch.switching;
export const selectEmptyLetterIds = (state: RootState) =>
  state.game.game?.emptyLetterIds;
export const selectSidePanelOpen = (state: RootState) => state.sidePanelOpen;

export const selectPlayers = (state: RootState) => state.game.game?.players;
export const selectPlayerTurnState = (state: RootState) => {
  const player = getPlayer(state);
  return player?.turn;
};
export const selectPlayerHand = (state: RootState) => {
  const player = getPlayer(state);
  return player?.hand;
};

export const selectGameHistory = (state: RootState) => state.game.history;
