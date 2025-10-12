import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { LettersArray } from "@/features/game/utils/types/gameTypes";

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
        //put all the hand as switch values
        if (action.payload) {
          action.payload.forEach((_letter, i) => {
            state.switchValues.push(i);
          });
        }
      } else {
        state.switching = false;
        state.switchValues = [];
      }
    },
    setSwitchingValue: (state, action: PayloadAction<boolean>) => {
      state.switching = action.payload;
      state.switchValues = [];
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
export const { toggleSwitching, changeSwitchValue, setSwitchingValue } =
  switchSlice.actions;

export default switchSlice.reducer;
