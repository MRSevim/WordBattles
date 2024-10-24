import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { LettersArray } from "../../helpers";

const initialState: { switchValues: number[]; switching: boolean } = {
  switchValues: [],
  switching: false,
};

export const switchSlice = createSlice({
  name: "switch",
  initialState: initialState,
  reducers: {
    toggleSwitching: (
      state,
      action: PayloadAction<LettersArray | undefined>
    ) => {
      if (!state.switching) {
        state.switching = true;
        if (action.payload) {
          action.payload.forEach((letter, i) => {
            state.switchValues.push(i);
          });
        }
      } else {
        state.switching = false;
        state.switchValues = [];
      }
    },
    changeSwitchValue: (state, action: PayloadAction<number>) => {
      const i = action.payload;
      if (i !== undefined) {
        if (state.switchValues.includes(i)) {
          const array = state.switchValues;
          const index = array.indexOf(i);
          if (index > -1) {
            // only splice array when item is found
            array.splice(index, 1); // 2nd parameter means remove one item only
          }
        } else {
          state.switchValues.push(i);
        }
        if (state.switchValues.length === 0) {
          state.switching = false;
        }
      }
    },
  },
});

// Action creators are generated for each case reducer function
export const { toggleSwitching, changeSwitchValue } = switchSlice.actions;

export default switchSlice.reducer;
