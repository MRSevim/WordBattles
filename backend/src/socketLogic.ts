const { v6: uuidv6 } = require("uuid");
interface Letter {
  letter: string;
  point: number;
  amount: number;
  drawn?: boolean;
}

type LettersArray = Letter[];

interface Player {
  hand: LettersArray[];
  username: string;
  turn: boolean;
  socketId: string;
}

interface Players {
  players: { player1: Player; player2: Player };
}

interface Game {
  players: Players;
  undrawnLetterPool: LettersArray[];
  roomId: string;
}

export const runSocketLogic = (io: any) => {
  io.on("connection", (socket: any) => {
    console.log("a user connected");

    for (let [id, _socket] of io.of("/").sockets) {
      if (!_socket.full && socket.id !== id) {
        const roomId = uuidv6();
        _socket.join(roomId);
        socket.join(roomId);
        console.log("Game found", roomId);
        socket.to(roomId).emit("Generate Game", {
          roomId,
          players: {
            player1: { username: "guest", socketId: _socket.id },
            player2: { username: "guest", socketId: id },
          },
        });
        _socket.full = true;
        socket.full = true;
      }
    }

    socket.on(
      "Generated Game",
      ({ players, undrawnLetterPool, roomId }: Game) => {
        io.to(roomId).emit("Start Game", {
          players,
          undrawnLetterPool,
          roomId,
        });
      }
    );
  });
};
