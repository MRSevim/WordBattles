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
  pass,
  Player,
  switchLetters,
  switchTurns,
  timerRanOutUnsuccessfully,
  updateBoard,
  validateWords,
  validTurkishLetters,
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
            timer: 10,
          },
          {
            hand: playersStatus.players[1],
            username: "konuk",
            turn: playersStatus.startingPlayer === 2,
            socketId: id,
            score: 0,
            timer: 10,
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
          passCount: 0,
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

        switchTurns(currentPlayer, opponentPlayer);

        switchLetters(switchedIndices, currentPlayer.hand, undrawnLetterPool);

        io.to(roomId).emit("Play Made", state);
      }
    );

    socket.on("Timer", ({ state }: { state: gameState }) => {
      const {
        game: { players, roomId },
      } = state;
      const currentPlayer = players.find((player) => player.turn) as Player;

      setInterval(() => {
        if (currentPlayer.timer > 0) {
          currentPlayer.timer -= 1;
          io.to(roomId).emit("Play Made", state);
        }
      }, 1000);
    });

    socket.on("Pass", ({ state }: { state: gameState }) => {
      const {
        board,
        game: { players, roomId },
      } = state;
      const currentPlayer = players.find((player) => player.turn) as Player;
      const opponentPlayer = players.find((player) => !player.turn) as Player;

      pass(currentPlayer.hand, board);

      switchTurns(currentPlayer, opponentPlayer);
      state.game.passCount += 1;

      // Append to history
      state.history.push({
        playerSocketId: currentPlayer.socketId,
        words: [],
        playerPoints: 0,
      });

      io.to(roomId).emit("Play Made", state);
    });

    socket.on(
      "Play",
      async ({
        state,
        timerRanOut,
      }: {
        state: gameState;
        timerRanOut: boolean;
      }) => {
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
          if (timerRanOut) {
            switchTurns(currentPlayer, opponentPlayer);
            timerRanOutUnsuccessfully(state);
            io.to(roomId).emit("Play Made", state);
          }
          return;
        }

        // First, check if the new words are connected to old ones (if any)
        const existingWordOnBoard = board.some((row) =>
          row.some((cell) => cell && cell.fixed)
        );

        if (state.board[7][7] === null) {
          io.to(id).emit("Game Error", {
            error: "Merkez hücre kullanılmalıdır",
          });
          if (timerRanOut) {
            switchTurns(currentPlayer, opponentPlayer);
            timerRanOutUnsuccessfully(state);
            io.to(roomId).emit("Play Made", state);
          }
          return;
        }
        const invalidLetter = state.board.some((row) =>
          row.some(
            (letter) => letter && !validTurkishLetters.includes(letter.letter)
          )
        );
        if (invalidLetter) {
          io.to(id).emit("Game Error", {
            error: "Boş harfler geçerli Türkçe harfler olmalıdır",
          });
          if (timerRanOut) {
            switchTurns(currentPlayer, opponentPlayer);
            timerRanOutUnsuccessfully(state);
            io.to(roomId).emit("Play Made", state);
          }
          return;
        }

        if (existingWordOnBoard) {
          const newWordsConnected = areNewWordsConnected(board);

          if (!newWordsConnected) {
            io.to(id).emit("Game Error", {
              error:
                "Yeni kelimelerden en az biri dolu hücreler ile bağlantılı olmalıdır",
            });
            if (timerRanOut) {
              switchTurns(currentPlayer, opponentPlayer);
              timerRanOutUnsuccessfully(state);
              io.to(roomId).emit("Play Made", state);
            }
            return;
          }
        }
        const wordsWithCoordinates: WordWithCoordinates[] =
          findWordsOnBoard(board);

        const words = wordsWithCoordinates.map((word) => word.word);

        if (words.length === 0) {
          io.to(id).emit("Game Error", {
            error: "Kelimeler bir harften uzun olmalıdır",
          });
          if (timerRanOut) {
            switchTurns(currentPlayer, opponentPlayer);
            timerRanOutUnsuccessfully(state);
            io.to(roomId).emit("Play Made", state);
          }
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
            if (timerRanOut) {
              switchTurns(currentPlayer, opponentPlayer);
              timerRanOutUnsuccessfully(state);
              io.to(roomId).emit("Play Made", state);
            }
            return;
          }
        } catch (error) {
          io.to(id).emit("Game Error", {
            error: "Kelime doğrulama sırasında bir hata oluştu",
          });
          if (timerRanOut) {
            switchTurns(currentPlayer, opponentPlayer);
            timerRanOutUnsuccessfully(state);
            io.to(roomId).emit("Play Made", state);
          }
          return;
        }
        // Calculate points for the current player
        const playerPoints = calculatePoints(
          board,
          wordsWithCoordinates,
          io,
          id
        );

        currentPlayer.score += playerPoints;

        updateBoard(wordsWithCoordinates, board);

        // Append to history
        state.history.push({
          playerSocketId: currentPlayer.socketId,
          words: checkedWords.validWords,
          playerPoints,
        });

        // Switch turns
        completePlayerHand(currentPlayer, undrawnLetterPool);
        switchTurns(currentPlayer, opponentPlayer);

        io.to(roomId).emit("Play Made", state); // If everything is valid, play is made
      }
    );
  });
};
