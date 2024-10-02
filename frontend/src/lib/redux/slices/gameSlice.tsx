import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { LettersArray } from "../../commonVariables";

interface Game {
  playerHand: LettersArray;
  startingPlayer: number;
  roomId: string;
}

interface gameState {
  findingGame: boolean;
  game: Game | null;
}

const initialState: gameState = { findingGame: false, game: null };

export const gameSlice = createSlice({
  name: "game",
  initialState: initialState as gameState,
  reducers: {
    setFindingGame: (state) => {
      state.findingGame = true;
    },
    setGame: (state, action: PayloadAction<Game>) => {
      state.findingGame = false;
      state.game = action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const { setFindingGame, setGame } = gameSlice.actions;

export default gameSlice.reducer;
