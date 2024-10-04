import { RootState } from "../lib/redux/store";
import { useAppDispatch, useAppSelector } from "../lib/redux/hooks";
import { socket } from "../lib/socketio";
import { setFindingGame, setGame } from "../lib/redux/slices/gameSlice";
import { generateGame, letterPool } from "../lib/commonVariables";
import { Game } from "../lib/redux/slices/gameSlice";

socket.on("Generate Game", ({ roomId, players }) => {
  const playersStatus = generateGame(letterPool);

  const _players = {
    player1: {
      hand: playersStatus.players[0],
      username: players.player1.username,
      turn: playersStatus.startingPlayer === 1,
      socketId: players.player1.socketId,
    },
    player2: {
      hand: playersStatus.players[1],
      username: players.player2.username,
      turn: playersStatus.startingPlayer === 2,
      socketId: players.player1.socketId,
    },
  };

  socket.emit("Generated Game", {
    players: _players,
    undrawnLetterPool: playersStatus.undrawnletterPool,
    roomId,
  });
});

export const FindGame = () => {
  const dispatch = useAppDispatch();
  const game = useAppSelector((state: RootState) => state.game);

  const findGame = () => {
    socket.connect();
    dispatch(setFindingGame());
  };

  socket.on("Start Game", ({ players, undrawnLetterPool, roomId }: Game) => {
    dispatch(setGame({ players, undrawnLetterPool, roomId }));
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
