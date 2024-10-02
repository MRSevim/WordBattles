import { RootState } from "../lib/redux/store";
import { useAppDispatch, useAppSelector } from "../lib/redux/hooks";
import { socket } from "../pages/Homepage";
import { setFindingGame, setGame } from "../lib/redux/slices/gameSlice";
import { Game, generateGame, letterPool } from "../lib/commonVariables";

export const FindGame = () => {
  const dispatch = useAppDispatch();
  const game = useAppSelector((state: RootState) => state.game);

  const findGame = () => {
    socket.connect();
    dispatch(setFindingGame());
  };

  socket.on("Generate Game", (roomId) => {
    const playerStatus = generateGame(letterPool);
    socket.emit("Generated Game", {
      playerStatus,
      roomId,
    });
  });

  socket.on("Start Game", ({ playerStatus, roomId }: Game, socketId) => {
    const startingPlayer = playerStatus.startingPlayer;

    if (socket.id === socketId) {
      dispatch(
        setGame({ playerHand: playerStatus.players[0], startingPlayer, roomId })
      );
    } else {
      dispatch(
        setGame({ playerHand: playerStatus.players[1], startingPlayer, roomId })
      );
    }
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
