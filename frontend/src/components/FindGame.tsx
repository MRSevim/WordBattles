import { RootState } from "../lib/redux/store";
import { useAppDispatch, useAppSelector } from "../lib/redux/hooks";
import { socket } from "../lib/socketio";
import {
  setGameStatus,
  setGameState,
  GameState,
} from "../lib/redux/slices/gameSlice";

import { GoogleLogin } from "@react-oauth/google";
import { toast } from "react-toastify";
import { setUser } from "../lib/redux/slices/userSlice";
import { useEffect } from "react";

export const FindGame = () => {
  const dispatch = useAppDispatch();
  const _game = useAppSelector((state: RootState) => state.game);
  const user = useAppSelector((state: RootState) => state.user);

  const findGame = () => {
    socket.connect();
    dispatch(setGameStatus("looking"));
  };

  const stopLooking = () => {
    socket.disconnect();
    dispatch(setGameStatus("idle"));
    localStorage.removeItem("sessionId");
  };

  const sessionId = localStorage.getItem("sessionId");
  const userFromStorage = sessionStorage.getItem("user");
  let parsed = null;
  if (userFromStorage) {
    parsed = JSON.parse(userFromStorage);
  }
  const roomId = localStorage.getItem("roomId");

  useEffect(() => {
    if (sessionId) {
      socket.auth = { user: parsed, sessionId, roomId };
      socket.sessionId = sessionId;
      findGame();
    }
  }, [sessionId, socket]);

  socket.on("Start Game", (game: GameState) => {
    dispatch(setGameState(game));
    if (game.game) {
      localStorage.setItem("roomId", game.game.roomId);
      socket.auth = { ...socket.auth, roomId };
    }
    socket.emit("Timer", game);
  });
  if (roomId) {
    return (
      <div className="bg-primary text-white flex flex-col gap-2 font-medium rounded-lg p-4">
        Devam eden oyuna bağlanılıyor...
      </div>
    );
  }
  if (_game.status === "looking") {
    return (
      <div className="bg-primary text-white flex flex-col gap-2 font-medium rounded-lg p-4">
        Oyun aranıyor...
        <FindButton onClick={stopLooking} text="Dur" />
      </div>
    );
  }

  return (
    <div className="text-white bg-primary rounded-lg p-4 flex flex-col gap-2 justify-center	items-center">
      {user && (
        <FindButton
          onClick={findGame}
          text={user.username + " olarak oyun bul"}
        />
      )}
      {!user && (
        <>
          <GoogleLogin
            onSuccess={async (credentialResponse) => {
              const response = await fetch("/api/user/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  googleCredential: credentialResponse,
                }),
              });

              const json = await response.json();
              if (!response.ok) {
                toast.error(json.message);
                return;
              }
              socket.auth = { ...socket.auth, user: json };
              dispatch(setUser(json));
              findGame();
            }}
            onError={() => {
              toast.error("Google girişi başarısız");
            }}
          />
          veya
          <FindButton onClick={findGame} text="Konuk olarak oyun bul" />
        </>
      )}
    </div>
  );
};

const FindButton = ({
  onClick,
  text,
}: {
  onClick: () => void;
  text: string;
}) => {
  return (
    <button
      onClick={onClick}
      className=" bg-slate-700 focus:ring-4 font-medium rounded-lg px-5 py-2.5"
    >
      {text}
    </button>
  );
};
