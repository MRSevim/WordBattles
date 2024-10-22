import {
  areNewWordsConnected,
  areTilesAligned,
  calculatePoints,
  CheckedWords,
  completePlayerHand,
  findWordsOnBoard,
  gameState,
  generateGame,
  letterPool,
  Player,
  switchLetters,
  updateBoard,
  validateWords,
  WordWithCoordinates,
} from "./helpers";

const { v6: uuidv6 } = require("uuid");

export const runSocketLogic = (io: any) => {
  io.on("connection", (socket: any) => {
    console.log("a user connected");

    for (let [id, _socket] of io.of("/").sockets) {
      if (!_socket.full && socket.id !== id) {
        const playersStatus = generateGame(letterPool);

        const players = [
          {
            hand: playersStatus.players[0],
            username: "konuk",
            turn: playersStatus.startingPlayer === 1,
            socketId: socket.id,
            score: 0,
          },
          {
            hand: playersStatus.players[1],
            username: "konuk",
            turn: playersStatus.startingPlayer === 2,
            socketId: id,
            score: 0,
          },
        ];
        const roomId = uuidv6();
        _socket.join(roomId);
        socket.join(roomId);
        console.log("Game found", roomId);
        io.to(roomId).emit("Start Game", {
          players,
          undrawnLetterPool: playersStatus.undrawnletterPool,
          roomId,
        });
        _socket.full = true;
        socket.full = true;
      }
    }

    socket.on(
      "Switch",
      ({
        switchedIndices,
        state,
      }: {
        switchedIndices: number[];
        state: gameState;
      }) => {
        const {
          game: { players, roomId, undrawnLetterPool },
        } = state;
        const currentPlayer = players.find((player) => player.turn) as Player;
        const opponentPlayer = players.find((player) => !player.turn) as Player;

        currentPlayer.turn = false;
        opponentPlayer.turn = true;

        switchLetters(switchedIndices, currentPlayer.hand, undrawnLetterPool);

        io.to(roomId).emit("Play Made", state);
      }
    );

    socket.on("Play", async ({ state }: { state: gameState }) => {
      const {
        board,
        game: { players, roomId, undrawnLetterPool },
      } = state;
      const id = socket.id;
      // Find the player who made the play
      const currentPlayer = players.find((player) => player.turn) as Player;
      const opponentPlayer = players.find((player) => !player.turn) as Player;

      // Check if the new tiles are aligned
      if (!areTilesAligned(board)) {
        io.to(id).emit("Game Error", {
          error: "Yeni harfler yatay veya dikey olarak hizalanmalıdır",
        });
        return;
      }

      // First, check if the new words are connected to old ones (if any)
      const existingWordOnBoard = board.some((row) =>
        row.some((cell) => cell && cell.fixed)
      );

      if (existingWordOnBoard) {
        const newWordsConnected = areNewWordsConnected(board);

        if (!newWordsConnected) {
          io.to(id).emit("Game Error", {
            error:
              "Yeni kelimelerden en az biri dolu hücreler ile bağlantılı olmalıdır",
          });
          return;
        }
      }
      const wordsWithCoordinates: WordWithCoordinates[] =
        findWordsOnBoard(board);

      const words = wordsWithCoordinates.map((word) => word.word);

      if (words.length === 0) {
        io.to(id).emit("Game Error", {
          error: "Lütfen tahtaya bir harften uzun bir kelime ekleyiniz",
        });
        return;
      }
      let checkedWords: CheckedWords = { validWords: [], invalidWords: [] };
      // Validate words using the API
      try {
        checkedWords = await validateWords(words);

        if (checkedWords.invalidWords.length > 0) {
          io.to(id).emit("Game Error", {
            error: `Geçersiz kelimeler: ${checkedWords.invalidWords.join(
              ", "
            )}`,
          });
          return;
        }
      } catch (error) {
        io.to(id).emit("Game Error", {
          error: "Kelime doğrulama sırasında bir hata oluştu",
        });
        return;
      }
      // Calculate points for the current player
      const playerPoints = calculatePoints(board, wordsWithCoordinates);

      currentPlayer.score += playerPoints;

      updateBoard(wordsWithCoordinates, board);

      // Append to history
      state.history.push({
        playerSocketId: currentPlayer.socketId,
        words: checkedWords.validWords,
        playerPoints,
      });

      // Switch turns
      currentPlayer.turn = false;
      completePlayerHand(currentPlayer, undrawnLetterPool);
      opponentPlayer.turn = true;

      io.to(roomId).emit("Play Made", state); // If everything is valid, play is made
    });
  });
};
