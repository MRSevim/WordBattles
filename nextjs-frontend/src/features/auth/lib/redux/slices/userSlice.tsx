import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { socket } from "@/lib/socket.io/socketio";
import { User } from "@/features/auth/utils/types";

const userFromStorage = sessionStorage.getItem("user");
let parsed = null;
if (userFromStorage) {
  parsed = JSON.parse(userFromStorage);
}

const initialState: User = parsed;

export const userSlice = createSlice({
  name: "user",
  initialState: initialState as User,
  reducers: {
    setUser: (_state, action: PayloadAction<User>) => {
      const user = action.payload;
      if (user) {
        sessionStorage.setItem("user", JSON.stringify(user));
        //todo- add user to socket.auth
      } else {
        sessionStorage.removeItem("user");
        socket.auth = { ...socket.auth, user: null };
      }
      return user;
    },
  },
});

// Action creators are generated for each case reducer function
export const { setUser } = userSlice.actions;

export default userSlice.reducer;
