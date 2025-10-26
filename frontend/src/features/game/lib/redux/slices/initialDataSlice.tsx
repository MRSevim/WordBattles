import { InitialData } from "@/features/game/utils/types/gameTypes";
import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

const initialState = {
  players: [],
  validLetters: [],
} as InitialData;

export const initialDataSlice = createSlice({
  name: "initialData",
  initialState: initialState,
  reducers: {
    setInitialData: (state, action: PayloadAction<InitialData>) => {
      return action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const { setInitialData } = initialDataSlice.actions;

export default initialDataSlice.reducer;
