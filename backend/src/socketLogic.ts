const { v6: uuidv6 } = require("uuid");
interface Letter {
  letter: string;
  point: number;
  amount: number;
  drawn?: boolean;
}

type LettersArray = Letter[];

interface PlayerStatus {
  players: LettersArray[];
  startingPlayer: number;
}

interface Game {
  playerStatus: PlayerStatus;
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
        socket.to(roomId).emit("Generate Game", roomId);
        _socket.full = true;
        socket.full = true;
      }
    }

    socket.on("Generated Game", ({ playerStatus, roomId }: Game) => {
      io.to(roomId).emit("Start Game", { playerStatus, roomId }, socket.id);
    });
  });
};
