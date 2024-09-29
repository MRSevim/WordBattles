import { configureStore } from "@reduxjs/toolkit";
import globalErrorSlice from "./slices/globalErrorSlice";
import gameSlice from "./slices/gameSlice";

export const store = configureStore({
  reducer: {
    globalError: globalErrorSlice,
    game: gameSlice,
  },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
