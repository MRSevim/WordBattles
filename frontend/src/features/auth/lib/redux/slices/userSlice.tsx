import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { socket } from "@/features/game/lib/socket.io/socketio";
import { User } from "@/features/auth/utils/types";

const initialState: User = null;

export const userSlice = createSlice({
  name: "user",
  initialState: initialState as User,
  reducers: {
    setUser: (_state, action: PayloadAction<User>) => {
      const user = action.payload;
      if (user) {
        //todo- add user to socket.auth
      } else {
        socket.auth = { ...socket.auth, user: null };
      }
      return user;
    },
  },
});

// Action creators are generated for each case reducer function
export const { setUser } = userSlice.actions;

export default userSlice.reducer;
