import {
  areNewWordsCorrectlyPlaced,
  calculatePoints,
  CheckedWords,
  completePlayerHand,
  findWordsOnBoard,
  gameState,
  generateGame,
  generateLetterPool,
  letters,
  pass,
  Player,
  setUpTimerInterval,
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

    socket.emit("session", {
      sessionId: socket.sessionId,
    });

    for (let [id, _socket] of io.of("/").sockets) {
      if (!_socket.full && socket.id !== id) {
        const letterPool = generateLetterPool(letters);
        const playersStatus = generateGame(letterPool);

        const players = [
          {
            hand: playersStatus.players[0],
            username: socket.user?.username || "konuk",
            turn: playersStatus.startingPlayer === 1,
            sessionId: socket.sessionId,
            score: 0,
            timer: 60,
          },
          {
            hand: playersStatus.players[1],
            username: _socket.user?.username || "konuk",
            turn: playersStatus.startingPlayer === 2,
            sessionId: _socket.sessionId,
            score: 0,
            timer: 60,
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

    socket.on("Timer", ({ state }: { state: gameState }) => {
      setUpTimerInterval(state, io);
    });

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

        // Append to history
        state.history.push({
          playerSessionId: currentPlayer.sessionId,
          words: [],
          playerPoints: 0,
        });

        switchTurns(state, io);

        switchLetters(switchedIndices, currentPlayer.hand, undrawnLetterPool);

        io.to(roomId).emit("Play Made", state);
      }
    );

    socket.on("Pass", ({ state }: { state: gameState }) => {
      const {
        board,
        game: { players, roomId },
      } = state;
      const currentPlayer = players.find((player) => player.turn) as Player;
      pass(currentPlayer.hand, board);

      // Append to history
      state.history.push({
        playerSessionId: currentPlayer.sessionId,
        words: [],
        playerPoints: 0,
      });

      state.game.passCount += 1;
      switchTurns(state, io);
      io.to(roomId).emit("Play Made", state);
    });

    const handleUnsuccessfull = (state: gameState) => {
      timerRanOutUnsuccessfully(state);
      switchTurns(state, io);
      io.to(state.game.roomId).emit("Play Made", state);
    };

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

        if (state.board[7][7] === null) {
          io.to(id).emit("Game Error", {
            error: "Merkez hücre kullanılmalıdır",
          });
          if (timerRanOut) {
            handleUnsuccessfull(state);
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
            handleUnsuccessfull(state);
          }
          return;
        }
        // First, check if the new words are connected to old ones (if any)
        const existingWordOnBoard = board.some((row) =>
          row.some((cell) => cell && cell.fixed)
        );

        if (existingWordOnBoard) {
          const newWordsCorrectlyPlaced = areNewWordsCorrectlyPlaced(board);

          if (!newWordsCorrectlyPlaced) {
            io.to(id).emit("Game Error", {
              error:
                "Yeni yerleştirilen harfler yatay veya dikey olarak birleşik bir çizgi oluşturmalıdır",
            });
            if (timerRanOut) {
              handleUnsuccessfull(state);
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
            handleUnsuccessfull(state);
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
              handleUnsuccessfull(state);
            }
            return;
          }
        } catch (error) {
          io.to(id).emit("Game Error", {
            error: "Kelime doğrulama sırasında bir hata oluştu",
          });
          if (timerRanOut) {
            handleUnsuccessfull(state);
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
          playerSessionId: currentPlayer.sessionId,
          words: checkedWords.validWords,
          playerPoints,
        });

        // Switch turns
        state.game.passCount = 0;
        switchTurns(state, io);
        completePlayerHand(currentPlayer, undrawnLetterPool);

        io.to(roomId).emit("Play Made", state); // If everything is valid, play is made
      }
    );
  });
};
