import { RootState } from "../lib/redux/store";
import { useAppDispatch, useAppSelector } from "../lib/redux/hooks";
import { socket } from "../lib/socketio";
import { setFindingGame, setGame } from "../lib/redux/slices/gameSlice";
import { Game } from "../lib/redux/slices/gameSlice";
import { GoogleLogin } from "@react-oauth/google";
import { toast } from "react-toastify";

export const FindGame = () => {
  const dispatch = useAppDispatch();
  const _game = useAppSelector((state: RootState) => state.game);

  const findGame = () => {
    socket.connect();
    dispatch(setFindingGame());
  };

  socket.on("Start Game", (game: Game) => {
    dispatch(setGame(game));
    socket.emit("Timer", {
      state: { ..._game, game },
    });
  });

  if (_game.status === "looking") {
    return (
      <div className="bg-primary text-white focus:ring-4 font-medium rounded-lg px-5 py-2.5">
        Oyun aranıyor...
      </div>
    );
  }

  return (
    <div className="text-white bg-primary rounded-lg p-4 flex flex-col gap-2 justify-center	items-center">
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
          console.log(json);
        }}
        onError={() => {
          toast.error("Google girişi başarısız");
        }}
      />
      veya
      <button
        onClick={findGame}
        className=" bg-slate-700 focus:ring-4 font-medium rounded-lg px-5 py-2.5"
      >
        Konuk olarak oyun bul
      </button>
    </div>
  );
};
