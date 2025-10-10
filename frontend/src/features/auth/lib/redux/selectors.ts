import { RootState } from "@/lib/redux/store";

export const selectUser = (state: RootState) => state.user;
export const selectUserRoomId = (state: RootState) => state.user?.currentRoomId;
export const selectUserName = (state: RootState) => state.user?.name;
