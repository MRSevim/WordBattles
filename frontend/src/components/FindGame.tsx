import { RootState } from "../lib/redux/store";
import { useAppDispatch, useAppSelector } from "../lib/redux/hooks";
import { socket } from "../lib/socketio";
import { setFindingGame, setGame } from "../lib/redux/slices/gameSlice";
import { Game } from "../lib/redux/slices/gameSlice";

export const FindGame = () => {
  const dispatch = useAppDispatch();
  const game = useAppSelector((state: RootState) => state.game);

  const findGame = () => {
    socket.connect();
    dispatch(setFindingGame());
  };

  socket.on("Start Game", (game: Game) => {
    dispatch(setGame(game));
  });

  if (game.findingGame) {
    return (
      <div className="bg-primary text-white focus:ring-4 font-medium rounded-lg px-5 py-2.5">
        Oyun aranıyor...
      </div>
    );
  }

  return (
    <button
      onClick={findGame}
      className="bg-primary text-white focus:ring-4 font-medium rounded-lg px-5 py-2.5"
    >
      Oyun bul
    </button>
  );
};
