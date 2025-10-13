import {
  applyPointDifference,
  areNewWordsCorrectlyPlaced,
  calculatePoints,
  completePlayerHand,
  findWordsOnBoard,
  fixBoard,
  returnToHand,
  saveGame,
  switchLetters,
  switchTurns,
  validateWords,
} from "./gameHelpers";
import { generateGameState } from "./generators";
import {
  getGameFromMemory,
  saveGameToMemory,
  removeGameFromMemory,
} from "./memoryGameHelpers";
import { clearTimerIfExist } from "./timerRelated";
import {
  loadGameFromDB,
  removeGameFromDB,
  updateCurrentRoomIdInDB,
} from "../lib/prisma/dbCalls/gameCalls";
import {
  CheckedWords,
  gameState,
  validTurkishLetters,
  WordWithCoordinates,
} from "../types/gameTypes";
import { Io, Socket } from "../types/types";

export let waitingPlayers: Socket[] = [];

export const runSocketLogic = (io: Io) => {
  io.on("connection", async (socket: Socket) => {
    console.log("a user connected");

    socket.emit("session", {
      sessionId: socket.sessionId,
    });

    const startGame = (socket: Socket, _socket: Socket) => {
      const gameState = generateGameState(socket, _socket);
      io.to(gameState.roomId).emit("Start Game", gameState);
      io.to(gameState.roomId).emit("Initialize Data", gameState);
      saveGame(gameState, io);
      updateCurrentRoomIdInDB(socket.user?.id, gameState.roomId);
      updateCurrentRoomIdInDB(_socket.user?.id, gameState.roomId);
    };

    if (socket.roomId) {
      const roomId = socket.roomId;
      let game = getGameFromMemory(socket.roomId);

      if (!game) {
        //Extra check in case memory game is not present
        const gameStateFromDB = await loadGameFromDB(roomId);
        if (gameStateFromDB) {
          saveGameToMemory(gameStateFromDB, io);
          game = getGameFromMemory(roomId);
        }
      }

      if (game) {
        io.to(roomId).emit("Initialize Data", game.gameState);
        io.to(roomId).emit("Play Made", game.gameState);
      } else {
        socket.roomId = undefined;
        io.to(roomId).emit("No Game In Memory");
        socket.leave(roomId);
      }
    } else {
      if (waitingPlayers.length > 0) {
        startGame(socket, waitingPlayers[0]);
        waitingPlayers.shift();
      } else {
        waitingPlayers.push(socket);
      }
    }
    socket.on("disconnect", () => {
      console.log("A user disconnected");

      waitingPlayers = waitingPlayers.filter((s) => s !== socket);
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
        const { players, roomId, undrawnLetterPool } = state;
        const currentPlayer = players.find((player) => player.turn);
        if (state.status !== "playing" || !currentPlayer) return;
        // Append to history
        state.history.push({
          playerId: currentPlayer.id,
          words: [],
          type: "switch",
          playerPoints: 0,
        });

        switchLetters(switchedIndices, currentPlayer.hand, undrawnLetterPool);

        currentPlayer.passCount = 0;
        state.passCount = 0;

        switchTurns(state, io);

        io.to(roomId).emit("Play Made", state);
      }
    );

    socket.on("Pass", ({ state }: { state: gameState }) => {
      const { board, players, roomId } = state;
      const currentPlayer = players.find((player) => player.turn);
      if (!currentPlayer || state.status !== "playing") return;
      returnToHand(currentPlayer.hand, board);

      // Append to history
      state.history.push({
        playerId: currentPlayer.id,
        words: [],
        playerPoints: 0,
      });

      state.passCount += 1;
      currentPlayer.passCount += 1;
      switchTurns(state, io);

      io.to(roomId).emit("Play Made", state);
    });

    socket.on("Leave Game", ({ state }: { state: gameState }) => {
      const roomId = state.roomId;
      const [player1, player2] = state.players;
      const leavingPlayer = state.players.find(
        (player) => player.id === socket.sessionId
      );

      if (
        leavingPlayer &&
        state.status === "playing" &&
        leavingPlayer.score <
          (leavingPlayer === player1 ? player2 : player1).score
      ) {
        applyPointDifference(state);
      }
      state.status = "ended";
      socket.leave(roomId);
      updateCurrentRoomIdInDB(socket.user?.id, undefined);

      // Check how many sockets are in the room
      const roomSockets = io.sockets.adapter.rooms.get(roomId);

      if (!roomSockets) {
        // If no sockets are left, remove the game from storage
        removeGameFromMemory(roomId);
        removeGameFromDB(roomId);
      } else {
        saveGame(state, io);
        // Otherwise, notify remaining players
        io.to(roomId).emit("Play Made", state);
      }
    });

    socket.on("Play", async ({ state }: { state: gameState }) => {
      const { board, players, roomId, undrawnLetterPool } = state;

      const id = socket.id;

      // Find the player who made the play
      const currentPlayer = players.find((player) => player.turn);

      if (state.status !== "playing" || !currentPlayer) return;

      if (state.board[7][7] === null) {
        io.to(id).emit("Game Error", {
          error: "Merkez hücre kullanılmalıdır",
        });
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
        return;
      }

      // Check if the new words are connected to old ones (if any)
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
      const playerPoints = calculatePoints(board, wordsWithCoordinates, io, id);

      currentPlayer.score += playerPoints;

      fixBoard(board);

      // Append to history
      state.history.push({
        playerId: currentPlayer.id,
        words: checkedWords.validWords,
        playerPoints,
      });

      // Switch turns
      currentPlayer.passCount = 0;
      state.passCount = 0;
      completePlayerHand(currentPlayer, undrawnLetterPool);
      switchTurns(state, io);

      io.to(roomId).emit("Play Made", state); // If everything is valid, play is made
    });
  });
};
