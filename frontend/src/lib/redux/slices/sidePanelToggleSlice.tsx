import { createSlice } from "@reduxjs/toolkit";

export const sidePanelToggleSlice = createSlice({
  name: "sidePanelOpen",
  initialState: false,
  reducers: {
    toggleSidePanel: (state) => {
      return !state;
    },
  },
});

// Action creators are generated for each case reducer function
export const { toggleSidePanel } = sidePanelToggleSlice.actions;

export default sidePanelToggleSlice.reducer;
