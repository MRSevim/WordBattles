"use client";
import { AppStore, makeStore } from "@/lib/redux/store";
import { Provider } from "react-redux";
import { ToastContainer } from "react-toastify";
import { OngoingWarning } from "@/features/game/components/OngoingWarning";
import { useRef } from "react";
import { User } from "@/features/auth/utils/types";
import { setUser } from "@/features/auth/lib/redux/slices/userSlice";
import { Lang } from "@/features/language/utils/types";
import { socket } from "@/features/game/lib/socket.io/socketio";
import {
  setDictionary,
  setGameLanguage,
  setGameRoomId,
  setGameStatus,
  setGameType,
} from "@/features/game/lib/redux/slices/gameSlice";
import { GameType } from "../../../types";
import { DictionaryType } from "@/features/language/lib/dictionaries";

const ClientWrapper = ({
  children,
  user,
  gameCookies,
  initialLocale,
  dictionary,
}: {
  children: React.ReactNode;
  user: User;
  initialLocale: Lang;
  dictionary: DictionaryType;
  gameCookies: {
    sessionId?: string;
    roomId?: string;
    lang?: Lang;
    type?: GameType;
  };
}) => {
  const storeRef = useRef<AppStore | null>(null);
  if (!storeRef.current) {
    // Create the store instance the first time this renders
    storeRef.current = makeStore();
    const dispatch = storeRef.current.dispatch;
    dispatch(setUser(user));
    dispatch(setDictionary(dictionary));

    const sessionId = gameCookies.sessionId;
    const roomId = gameCookies.roomId;
    const lang = gameCookies.lang;
    const type = gameCookies.type;

    if (initialLocale && !lang) {
      dispatch(setGameLanguage(initialLocale));
    }

    //RoomId takes precedence over sessionId
    if (sessionId && lang && type && !roomId) {
      socket.sessionId = sessionId;
      dispatch(setGameLanguage(lang));
      dispatch(setGameType(type));
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
