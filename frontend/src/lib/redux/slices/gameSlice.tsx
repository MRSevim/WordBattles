import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { LettersArray } from "../../commonVariables";

export interface Player {
  hand: LettersArray;
  username: string;
  turn: boolean;
  socketId: string;
}

interface Players {
  player1: Player;
  player2: Player;
}

export interface Game {
  players: Players;
  undrawnLetterPool: LettersArray[];
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
