import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { LettersArray } from "../../commonVariables";

interface gameState {
  findingGame: boolean;
  game: {
    playerHand: LettersArray;
    startingPlayer: number;
    roomId: string;
  } | null;
}

const initialState: gameState = { findingGame: false, game: null };

export const gameSlice = createSlice({
  name: "game",
  initialState: initialState as gameState,
  reducers: {
    setFindingGame: (state) => {
      state.findingGame = true;
    },
    setPlayerHand: (state, action: PayloadAction<LettersArray>) => {
      state.findingGame = false;
      state.game!.playerHand = action.payload;
    },
    setStartingPlayer: (state, action: PayloadAction<number>) => {
      state.game!.startingPlayer = action.payload;
    },
    setRoomId: (state, action: PayloadAction<string>) => {
      state.game!.roomId = action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const { setFindingGame, setPlayerHand, setStartingPlayer, setRoomId } =
  gameSlice.actions;

export default gameSlice.reducer;
