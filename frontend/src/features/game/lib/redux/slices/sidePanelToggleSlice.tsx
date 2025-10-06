import { createSlice } from "@reduxjs/toolkit";

export const sidePanelToggleSlice = createSlice({
  name: "sidePanelToggle",
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
