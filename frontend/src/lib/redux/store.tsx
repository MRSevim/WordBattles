import { configureStore } from "@reduxjs/toolkit";
import gameSlice from "@/features/game/lib/redux/slices/gameSlice";
import dragSlice from "@/features/game/lib/redux/slices/dragSlice";
import switchSlice from "@/features/game/lib/redux/slices/switchSlice";
import sidePanelToggleSlice from "@/features/game/lib/redux/slices/sidePanelToggleSlice";
import userSlice from "@/features/auth/lib/redux/slices/userSlice";
import letterPoolToggleSlice from "@/features/game/lib/redux/slices/letterPoolToggleSlice";

export const store = configureStore({
  reducer: {
    game: gameSlice,
    draggingValues: dragSlice,
    switch: switchSlice,
    sidePanelOpen: sidePanelToggleSlice,
    user: userSlice,
    letterPoolOpen: letterPoolToggleSlice,
  },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
