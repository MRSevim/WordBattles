"use client";
import { AppStore, makeStore } from "@/lib/redux/store";
import { Provider } from "react-redux";
import { ToastContainer } from "react-toastify";
import { OngoingWarning } from "@/features/game/components/OngoingWarning";
import { useRef } from "react";
import { User } from "@/features/auth/utils/types";
import { setUser } from "@/features/auth/lib/redux/slices/userSlice";
import { Lang } from "@/features/language/helpers/types";
import { socket } from "@/features/game/lib/socket.io/socketio";
import {
  setGameLanguage,
  setGameRoomId,
  setGameStatus,
} from "@/features/game/lib/redux/slices/gameSlice";

const ClientWrapper = ({
  children,
  user,
  gameCookies,
}: {
  children: React.ReactNode;
  user: User;
  gameCookies: {
    sessionId?: string;
    roomId?: string;
    lang?: Lang;
  };
}) => {
  const storeRef = useRef<AppStore | null>(null);
  if (!storeRef.current) {
    // Create the store instance the first time this renders
    storeRef.current = makeStore();
    const dispatch = storeRef.current.dispatch;
    dispatch(setUser(user));

    const sessionId = gameCookies.sessionId;
    const roomId = gameCookies.roomId;
    const lang = gameCookies.lang;

    //RoomId takes precedence over sessionId
    if (sessionId && lang && !roomId) {
      socket.sessionId = sessionId;
      dispatch(setGameLanguage(lang));
      dispatch(setGameStatus("looking"));
    }

    if (roomId) {
      dispatch(setGameRoomId(roomId));
    }
  }
  return (
    <Provider store={storeRef.current}>
      <ToastContainer />
      <OngoingWarning />
      {children}
    </Provider>
  );
};

export default ClientWrapper;
