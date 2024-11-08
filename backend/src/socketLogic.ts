import {
  applyPointDifference,
  areNewWordsCorrectlyPlaced,
  calculatePoints,
  CheckedWords,
  clearTimerIfExist,
  completePlayerHand,
  findWordsOnBoard,
  gameState,
  generateGameState,
  getGameFromMemory,
  pass,
  Player,
  removeGameFromMemory,
  saveGameToMemory,
  setUpTimerInterval,
  switchLetters,
  switchTurns,
  timerRanOutUnsuccessfully,
  updateBoard,
  validateWords,
  validTurkishLetters,
  WordWithCoordinates,
} from "./helpers";

export let waitingPlayer: any = null;

export const runSocketLogic = (io: any) => {
  io.on("connection", (socket: any) => {
    console.log("a user connected");

    socket.emit("session", {
      sessionId: socket.sessionId,
    });

    const startGame = (socket: any, _socket: any) => {
      const gameState = generateGameState(socket, _socket);
      io.to(gameState.game.roomId).emit("Start Game", gameState);
    };

    if (socket.roomId) {
      const roomId = socket.roomId;
      const game = getGameFromMemory(socket.roomId);

      if (game) {
        io.to(roomId).emit("Play Made", game.gameState);
      } else {
        socket.roomId = undefined;
        io.to(roomId).emit("No Game In Memory");
        socket.leave(roomId);
      }
    } else {
      if (waitingPlayer) {
        startGame(socket, waitingPlayer);
        waitingPlayer = null;
      } else {
        waitingPlayer = socket;
      }
    }
    socket.on("disconnect", () => {
      console.log("A user disconnected");

      if (waitingPlayer === socket) {
        waitingPlayer = null;
      }
    });

    socket.on("Timer", (state: gameState) => {
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
          type: "switch",
          playerPoints: 0,
        });

        switchLetters(switchedIndices, currentPlayer.hand, undrawnLetterPool);

        currentPlayer.closedPassCount = 0;
        state.game.passCount = 0;

        switchTurns(state, io);

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
      currentPlayer.closedPassCount = 0;
      switchTurns(state, io);
      io.to(roomId).emit("Play Made", state);
    });

    socket.on("Leave Game", ({ state }: { state: gameState }) => {
      const roomId = state.game.roomId;
      if (state.status !== "ended") {
        applyPointDifference(state);
      }
      state.status = "ended";
      socket.leave(roomId);
      const game = getGameFromMemory(roomId);
      if (game) {
        clearTimerIfExist(roomId);
        saveGameToMemory({
          gameState: state,
          timerInterval: game.timerInterval,
        });
      }

      // Check how many sockets are in the room
      const roomSockets = io.sockets.adapter.rooms.get(roomId);

      if (roomSockets && roomSockets.size === 0) {
        // If no sockets are left, remove the game from memory
        removeGameFromMemory(roomId);
      } else {
        // Otherwise, notify remaining players
        io.to(roomId).emit("Play Made", state);
      }
    });

    const handleUnsuccessfull = (state: gameState) => {
      const currentPlayer = state.game.players.find(
        (player) => player.turn
      ) as Player;
      currentPlayer.closedPassCount = 0;
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
        currentPlayer.closedPassCount = 0;
        state.game.passCount = 0;
        completePlayerHand(currentPlayer, undrawnLetterPool);
        switchTurns(state, io);

        io.to(roomId).emit("Play Made", state); // If everything is valid, play is made
      }
    );
  });
};
