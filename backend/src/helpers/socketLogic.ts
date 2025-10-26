import {
  applyPointDifference,
  areNewWordsCorrectlyPlaced,
  calculatePoints,
  completePlayerHand,
  findWordsOnBoard,
  fixBoard,
  markNewlyPlacedAndNewWords,
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
import {
  loadGameFromDB,
  updateCurrentRoomIdInDB,
} from "../lib/prisma/dbCalls/gameCalls";
import {
  CheckedWords,
  GameState,
  WordWithCoordinates,
  Lang,
} from "../types/gameTypes";
import { Io, Socket } from "../types/types";
import { getValidLetters, sendInitialData } from "./misc";
import { t } from "../lib/i18n";

export let waitingPlayers: Record<Lang, Socket[]> = { tr: [], en: [] };

export const runSocketLogic = (io: Io) => {
  io.on("connection", async (socket: Socket) => {
    console.log("a user connected");

    socket.emit("session", {
      sessionId: socket.sessionId,
    });

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
        sendInitialData(io, game.gameState);
        io.to(roomId).emit("Play Made", game.gameState);
      } else {
        socket.roomId = undefined;
        io.to(roomId).emit("No Game In Memory");
        socket.leave(roomId);
      }
    }

    socket.on("Started Looking", async (lang: Lang) => {
      const startGame = (socket: Socket, _socket: Socket) => {
        const gameState = generateGameState(socket, _socket, lang);
        io.to(gameState.roomId).emit("Start Game", gameState);
        sendInitialData(io, gameState);
        saveGame(gameState, io);
        updateCurrentRoomIdInDB(socket.user?.id, gameState.roomId);
        updateCurrentRoomIdInDB(_socket.user?.id, gameState.roomId);
      };

      if (waitingPlayers[lang].length > 0) {
        startGame(socket, waitingPlayers[lang][0]);
        waitingPlayers[lang].shift();
      } else {
        waitingPlayers[lang].push(socket);
      }
    });

    socket.on("disconnect", () => {
      console.log("A user disconnected");

      Object.keys(waitingPlayers).forEach((lang) => {
        waitingPlayers[lang as Lang] = waitingPlayers[lang as Lang].filter(
          (s) => s !== socket
        );
      });
    });

    socket.on(
      "Switch",
      ({
        switchedIndices,
        state,
      }: {
        switchedIndices: number[];
        state: GameState;
      }) => {
        const { players, roomId } = state;
        const currentPlayer = players.find((player) => player.turn);
        if (state.status !== "playing" || !currentPlayer) return;
        // Append to history
        state.history.push({
          playerId: currentPlayer.id,
          words: [],
          type: "switch",
          playerPoints: 0,
        });

        switchLetters(switchedIndices, state, currentPlayer.hand);

        currentPlayer.consecutivePassCount = 0;

        switchTurns(state, io);

        io.to(roomId).emit("Play Made", state);
      }
    );

    socket.on("Pass", ({ state }: { state: GameState }) => {
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

      currentPlayer.consecutivePassCount += 1;
      currentPlayer.totalPassCount += 1;
      switchTurns(state, io);

      io.to(roomId).emit("Play Made", state);
    });

    socket.on("Leave Game", ({ state }: { state: GameState }) => {
      const roomId = state.roomId;
      const [player1, player2] = state.players;
      const leavingPlayer = state.players.find(
        (player) => player.id === socket.sessionId
      );
      const otherPlayer = leavingPlayer === player1 ? player2 : player1;

      if (
        leavingPlayer &&
        state.status === "playing" &&
        leavingPlayer.score < otherPlayer.score
      ) {
        const scoreDifference = Math.abs(player1.score - player2.score);
        state.winnerId = otherPlayer.id;
        leavingPlayer.scoreDiff = -scoreDifference;
        otherPlayer.scoreDiff = scoreDifference;
        applyPointDifference(state);
      }
      if (leavingPlayer) {
        leavingPlayer.leftTheGame = true;
        state.endReason = "playerLeft";
        state.endingPlayerId = leavingPlayer.id;
      }
      state.status = "ended";
      socket.leave(roomId);
      updateCurrentRoomIdInDB(socket.user?.id, undefined);

      const everybodyLeft = state.players.every((player) => player.leftTheGame);

      if (everybodyLeft) {
        // If no sockets are left, remove the game from memory
        removeGameFromMemory(roomId);
        /* removeGameFromDB(roomId); */
      } else {
        saveGame(state, io);
        // Otherwise, notify remaining players
        io.to(roomId).emit("Play Made", state);
      }
    });

    socket.on("Play", async ({ state }: { state: GameState }) => {
      const { board, players, roomId, undrawnLetterPool, lang } = state;
      const id = socket.id;
      const locale = socket.siteLocale;

      // Find the player who made the play
      const currentPlayer = players.find((player) => player.turn);

      if (state.status !== "playing" || !currentPlayer) return;

      if (state.board[7][7] === null) {
        io.to(id).emit("Game Error", {
          error: t(locale, "useCenterCell"),
        });
        return;
      }
      const invalidLetter = state.board.some((row) =>
        row.some(
          (letter) => letter && !getValidLetters(lang).includes(letter.letter)
        )
      );
      if (invalidLetter) {
        io.to(id).emit("Game Error", {
          error: t(locale, "emptyLettersInvalid"),
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
            error: t(locale, "oneLine"),
          });
          return;
        }
      }

      const wordsWithCoordinates: WordWithCoordinates[] =
        findWordsOnBoard(board);

      const words = wordsWithCoordinates.map((word) => word.word);

      if (words.length === 0) {
        io.to(id).emit("Game Error", {
          error: t(locale, "moreThanOneLetter"),
        });
        return;
      }
      let checkedWords: CheckedWords = { validWords: [], invalidWords: [] };

      // Validate words using the API
      try {
        checkedWords = await validateWords(words, lang);

        if (checkedWords.invalidWords.length > 0) {
          io.to(id).emit("Game Error", {
            error: `${t(
              locale,
              "invalidWords"
            )} ${checkedWords.invalidWords.join(", ")}`,
          });
          return;
        }
      } catch (error) {
        io.to(id).emit("Game Error", {
          error: t(locale, "errorDuringWordVal"),
        });
        return;
      }

      //detect and mark newlyPlaced tiles and new Words
      markNewlyPlacedAndNewWords(board);

      // Calculate points for the current player
      const playerPoints = calculatePoints(
        board,
        wordsWithCoordinates,
        io,
        id,
        currentPlayer
      );

      currentPlayer.score += playerPoints;
      currentPlayer.totalWords += checkedWords.validWords.length;
      currentPlayer.avgPerWord = currentPlayer.score / currentPlayer.totalWords;

      //fix the letters
      fixBoard(board);

      // Append to history
      state.history.push({
        playerId: currentPlayer.id,
        words: checkedWords.validWords,
        playerPoints,
      });

      // Switch turns
      currentPlayer.consecutivePassCount = 0;
      completePlayerHand(currentPlayer, undrawnLetterPool);
      switchTurns(state, io);

      io.to(roomId).emit("Play Made", state); // If everything is valid, play is made
    });
  });
};
