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

    let user = 1;

    for (let [id, _socket] of io.of("/").sockets) {
      console.log("user:" + user + ",id:" + id);
      user++;
      if (!socket.full && socket.id !== id) {
        _socket.join(socket.id);
        console.log("Game found", socket.id);
        socket.broadcast
          .to(socket.id)
          .emit("Generate Game", { roomId: socket.id });
        socket.full = true;
      }
    }

    socket.on("Generated Game", ({ playerStatus, roomId }: Game) => {
      console.log("generated");
      socket.to(roomId).emit("Start Game", { playerStatus, roomId });
    });
  });
};
