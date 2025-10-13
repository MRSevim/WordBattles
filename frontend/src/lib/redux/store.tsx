import { configureStore } from "@reduxjs/toolkit";
import gameSlice from "@/features/game/lib/redux/slices/gameSlice";
import dragSlice from "@/features/game/lib/redux/slices/dragSlice";
import switchSlice from "@/features/game/lib/redux/slices/switchSlice";
import sidePanelToggleSlice from "@/features/game/lib/redux/slices/sidePanelToggleSlice";
import userSlice from "@/features/auth/lib/redux/slices/userSlice";
import letterPoolToggleSlice from "@/features/game/lib/redux/slices/letterPoolToggleSlice";
import initialDataSlice from "@/features/game/lib/redux/slices/initialDataSlice";

export const makeStore = () => {
  return configureStore({
    reducer: {
      game: gameSlice,
      draggingValues: dragSlice,
      switch: switchSlice,
      sidePanelOpen: sidePanelToggleSlice,
      user: userSlice,
      letterPoolOpen: letterPoolToggleSlice,
      initialData: initialDataSlice,
    },
  });
};

// Infer the type of makeStore
export type AppStore = ReturnType<typeof makeStore>;
// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
