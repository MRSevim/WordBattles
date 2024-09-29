import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

type globalError = string | null;

const initialState: globalError = null;

export const globalErrorSlice = createSlice({
  name: "globalError",
  initialState: initialState as globalError,
  reducers: {
    set: (state, action: PayloadAction<string | null>) => {
      return action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const { set } = globalErrorSlice.actions;

export default globalErrorSlice.reducer;
