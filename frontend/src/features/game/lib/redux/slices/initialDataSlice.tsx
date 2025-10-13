import {
  GameState,
  InitialData,
  Player,
} from "@/features/game/utils/types/gameTypes";
import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

const initialState = {
  players: [],
} as InitialData;

export const initialDataSlice = createSlice({
  name: "initialData",
  initialState: initialState,
  reducers: {
    setInitialData: (state, action: PayloadAction<GameState>) => {
      state.players = action.payload.players.map((player) => ({
        id: player.id,
        username: player.username,
      }));
    },
  },
});

// Action creators are generated for each case reducer function
export const { setInitialData } = initialDataSlice.actions;

export default initialDataSlice.reducer;
