import { RootState } from "../lib/redux/store";
import { useAppDispatch, useAppSelector } from "../lib/redux/hooks";
import { socket } from "../pages/Homepage";
import {
  setFindingGame,
  setPlayerHand,
  setRoomId,
  setStartingPlayer,
} from "../lib/redux/slices/gameSlice";
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
    console.log("generating game");
  });

  socket.on("Start Game", ({ playerStatus, roomId }: Game) => {
    console.log("game starting");
    const startingPlayer = playerStatus.startingPlayer;
    if (socket.id === roomId) {
      dispatch(setPlayerHand(playerStatus.players[0]));
    } else {
      dispatch(setPlayerHand(playerStatus.players[1]));
    }
    dispatch(setStartingPlayer(startingPlayer));
    dispatch(setRoomId(roomId));
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
