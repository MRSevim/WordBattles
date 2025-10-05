import { RootState } from "@/lib/redux/store";

export const selectGameStatus = (state: RootState) => state.game.status;
