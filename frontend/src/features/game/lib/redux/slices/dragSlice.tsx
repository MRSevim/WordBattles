import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { Letter } from "@/features/game/utils/types/gameTypes";

export interface DraggingValues {
  active: string | null;
  over: string | null;
  activeLetter: Letter | null;
}

const initialState: DraggingValues = {
  active: null,
  over: null,
  activeLetter: null,
};
export const dragSlice = createSlice({
  name: "dragValues",
  initialState: initialState,
  reducers: {
    setDraggingValues: (
      state,
      action: PayloadAction<Partial<DraggingValues>>
    ) => {
      return { ...state, ...action.payload };
    },
  },
});

// Action creators are generated for each case reducer function
export const { setDraggingValues } = dragSlice.actions;

export default dragSlice.reducer;
