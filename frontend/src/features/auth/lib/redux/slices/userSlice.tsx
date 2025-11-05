import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { User } from "@/features/auth/utils/types";

type InitialState = { value: User };
const initialState: InitialState = { value: null };

export const userSlice = createSlice({
  name: "user",
  initialState: initialState as InitialState,
  reducers: {
    setUser: (_state, action: PayloadAction<User>) => {
      const user = action.payload;

      _state.value = user;
    },
  },
});

// Action creators are generated for each case reducer function
export const { setUser } = userSlice.actions;

export default userSlice.reducer;
