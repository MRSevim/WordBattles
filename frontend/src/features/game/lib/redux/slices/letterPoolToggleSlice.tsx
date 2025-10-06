import { createSlice } from "@reduxjs/toolkit";

export const letterPoolToggleSlice = createSlice({
  name: "letterPoolToggle",
  initialState: false,
  reducers: {
    toggleLetterPool: (state) => {
      return !state;
    },
  },
});

// Action creators are generated for each case reducer function
export const { toggleLetterPool } = letterPoolToggleSlice.actions;

export default letterPoolToggleSlice.reducer;
