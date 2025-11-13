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
  removeGameFromDB,
  updateCurrentRoomIdInDB,
} from "../lib/prisma/dbCalls/gameCalls";
import {
  CheckedWords,
  GameState,
  WordWithCoordinates,
  Lang,
  GameOptions,
  GameType,
  Season,
} from "../types/gameTypes";
import { Io, Socket } from "../types/types";
import { filterLetter, getValidLetters, sendInitialData } from "./misc";
import { t } from "../lib/i18n";
import { applyPlayerStats } from "../lib/prisma/dbCalls/playerStatsCalls";
import { getUnfetchedDivision, getUser } from "../lib/prisma/dbCalls/userCalls";

let waitingPlayers: Record<Lang, Record<GameType, Socket[]>> = {
  tr: { ranked: [], casual: [] },
  en: { ranked: [], casual: [] },
};

const BASE_TOLERANCE = 100;
const TOLERANCE_STEP = 50;
const MAX_TOLERANCE = 600;
const INTERVAL_MS = 5000;

export const runSocketLogic = (io: Io) => {
  io.on("connection", async (socket: Socket) => {
    console.log("a user connected");

    socket.emit("session", {
      sessionId: socket.sessionId,
    });

    socket.onAny((eventName, ...args) => {
      console.log(eventName, "acknowledged");

      const lastArg = args[args.length - 1];
      if (typeof lastArg === "function") {
        lastArg("ack");
      }
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

    socket.on("Started Looking", async (options: GameOptions) => {
      if (socket.searchInterval) {
        clearInterval(socket.searchInterval);
        socket.searchInterval = undefined;
      }
      const { lang, type } = options;
      const season: Season = "Season1";
      const locale = socket.siteLocale;

      // Only allow ranked games for logged-in users
      if (type === "ranked" && !socket.user) {
        socket.emit("Game Error", t(locale, "logInForRanked"));
        return;
      }

      //Start game helper
      const startGame = (p1: Socket, p2: Socket) => {
        const gameState = generateGameState(p1, p2, options);
        io.to(gameState.roomId).emit("Start Game", gameState);
        sendInitialData(io, gameState);
        saveGame(gameState, io);
        updateCurrentRoomIdInDB(p1.user?.id, gameState.roomId);
        updateCurrentRoomIdInDB(p2.user?.id, gameState.roomId);
      };

      const queue = waitingPlayers[lang][type];

      //  Get player's rank
      if (type === "ranked" && socket.user) {
        try {
          const user = await getUser(socket.user.id, {
            lang,
            season,
            locale,
          });
          const rank = user?.ranks?.[0]?.rankedPoints ?? 3000;
          const division = user?.division ?? getUnfetchedDivision(locale);
          console.log("user rank:", rank);
          console.log("user division:", division);
          socket.rankedPoints = rank;
          socket.division = division;
        } catch (err) {
          console.error("❌ Failed to load user rank/division:", err);
          socket.rankedPoints = 3000;
          socket.division = getUnfetchedDivision(locale);
        }

        // 🟩 Add to queue right away
        if (!queue.includes(socket)) {
          console.log("ranked player pushed to queue");
          queue.push(socket);
        }

        // --- Search loop ---
        let currentTolerance = BASE_TOLERANCE;

        const searchInterval = setInterval(() => {
          console.log("current tolerance of scanning:", currentTolerance);

          // 🔎 Find a suitable opponent (ignore self)
          const matchedIndex = queue.findIndex(
            (queuedSocket) =>
              queuedSocket !== socket && // 🧠 Ignore self
              queuedSocket.searchInterval !== undefined &&
              Math.abs(
                (queuedSocket.rankedPoints ?? 3000) -
                  (socket.rankedPoints ?? 3000)
              ) <= currentTolerance
          );

          if (matchedIndex !== -1) {
            const opponent = queue[matchedIndex];

            // Clear intervals FIRST
            clearInterval(socket.searchInterval);
            socket.searchInterval = undefined;
            clearInterval(opponent.searchInterval);
            opponent.searchInterval = undefined;

            // THEN remove from queue
            queue.splice(matchedIndex, 1);
            const selfIndex = queue.indexOf(socket);
            if (selfIndex !== -1) queue.splice(selfIndex, 1);

            startGame(socket, opponent);
          } else if (currentTolerance < MAX_TOLERANCE) {
            currentTolerance += TOLERANCE_STEP;
          }
        }, INTERVAL_MS);

        socket.searchInterval = searchInterval;
      } else if (type === "casual") {
        // Basic queue matchmaking

        if (queue.length > 0 && !queue.includes(socket)) {
          const opponent = queue.shift(); // first waiting player

          // Remove socket from queue if present (safety check)
          const selfIndex = queue.indexOf(socket);
          if (selfIndex !== -1) queue.splice(selfIndex, 1);

          const gameState = generateGameState(socket, opponent!, options);
          io.to(gameState.roomId).emit("Start Game", gameState);
          sendInitialData(io, gameState);
          saveGame(gameState, io);
        } else if (!queue.includes(socket)) {
          console.log("casual player pushed to queue");
          queue.push(socket);
        }
      }
    });

    socket.on("disconnect", () => {
      console.log("A user disconnected");
      if (socket.searchInterval) {
        clearInterval(socket.searchInterval);
        socket.searchInterval = undefined;
      }
      if (socket.roomId) {
        socket.leave(socket.roomId);
      }
      Object.keys(waitingPlayers).forEach((lang) => {
        Object.keys(waitingPlayers[lang as Lang]).forEach((type) => {
          waitingPlayers[lang as Lang][type as GameType] = waitingPlayers[
            lang as Lang
          ][type as GameType].filter((s) => s !== socket);
        });
      });
    });

    socket.on("Leave Game", ({ state }: { state: GameState }) => {
      const roomId = state.roomId;
      const [player1, player2] = state.players;
      const leavingPlayer = state.players.find(
        (player) => player.id === socket.sessionId
      );
      console.log("leaving player: ", leavingPlayer?.username);
      const otherPlayer = leavingPlayer === player1 ? player2 : player1;
      if (leavingPlayer && state.status === "playing") {
        const pointsDifference = Math.abs(player1.points - player2.points);
        const isBehind = leavingPlayer.points < otherPlayer.points;
        if (isBehind || pointsDifference === 0) {
          // penalize on tie too

          state.winnerId = otherPlayer.id;
          leavingPlayer.pointsDiff = -pointsDifference;
          otherPlayer.pointsDiff = pointsDifference;
          applyPointDifference(state);
        }

        // Append to history
        state.history.push({
          playerId: leavingPlayer.id,
          words: [],
          playerPoints: 0,
          placedTiles: [],
          playerHandAfterMove: filterLetter(leavingPlayer.hand),
          undrawnLetterPool: filterLetter(state.undrawnLetterPool),
          type: "leave",
        });

        state.status = "ended";
        state.endReason = "playerLeft";
        state.endingPlayerId = leavingPlayer.id;
        applyPlayerStats(state);
      }
      updateCurrentRoomIdInDB(socket.user?.id, undefined);
      if (leavingPlayer) leavingPlayer.leftTheGame = true;

      const everybodyLeft = state.players.every((player) => player.leftTheGame);

      if (everybodyLeft) {
        // If no sockets are left, remove the game from memory
        removeGameFromMemory(roomId);
        //if everybody is guest, remove the game from db
        const everyoneIsGuest = state.players.every((player) => !player.email);

        if (everyoneIsGuest || state.type === "casual") {
          removeGameFromDB(roomId);
        }
      } else {
        saveGame(state, io);
        // Otherwise, notify remaining players
        io.to(roomId).emit("Play Made", state);
      }
      socket.leave(roomId);
    });
    const preventDublicateMove = (
      roomId: string,
      cb: () => void,
      moveId?: string
    ) => {
      if (!moveId)
        return console.error("Pass a moveId to preventDuplicateMove");
      const game = getGameFromMemory(roomId);
      if (!game) return;

      // Check duplicate
      if (game.moveIds.includes(moveId)) {
        console.log("duplicate");
        return;
      }

      // Record immediately
      game.moveIds.push(moveId);
      if (game.moveIds.length > 10) game.moveIds = game.moveIds.slice(-10);

      // Proceed safely
      cb();
    };

    socket.on(
      "Switch",
      ({
        switchedIndices,
        state,
        moveId,
      }: {
        switchedIndices: number[];
        state: GameState;
        moveId?: string;
      }) => {
        preventDublicateMove(
          state.roomId,
          () => {
            const { players, roomId } = state;
            const currentPlayer = players.find((player) => player.turn);
            if (state.status !== "playing" || !currentPlayer) return;

            // Append to history
            state.history.push({
              playerId: currentPlayer.id,
              words: [],
              type: "switch",
              playerPoints: 0,
              placedTiles: [],
              playerHandAfterMove: filterLetter(currentPlayer.hand),
              undrawnLetterPool: filterLetter(state.undrawnLetterPool),
            });

            switchLetters(switchedIndices, state, currentPlayer.hand);

            currentPlayer.consecutivePassCount = 0;

            switchTurns(state, io);

            io.to(roomId).emit("Play Made", state);
          },
          moveId
        );
      }
    );

    socket.on(
      "Pass",
      ({ state, moveId }: { state: GameState; moveId: string }) => {
        preventDublicateMove(
          state.roomId,
          () => {
            const { board, players, roomId } = state;
            const currentPlayer = players.find((player) => player.turn);
            if (!currentPlayer || state.status !== "playing") return;
            returnToHand(currentPlayer.hand, board);

            // Append to history
            state.history.push({
              playerId: currentPlayer.id,
              words: [],
              playerPoints: 0,
              placedTiles: [],
              playerHandAfterMove: filterLetter(currentPlayer.hand),
              undrawnLetterPool: filterLetter(state.undrawnLetterPool),
              type: "pass",
            });

            currentPlayer.consecutivePassCount += 1;
            currentPlayer.totalPassCount += 1;
            switchTurns(state, io);

            io.to(roomId).emit("Play Made", state);
          },
          moveId
        );
      }
    );

    socket.on(
      "Play",
      ({ state, moveId }: { state: GameState; moveId: string }) => {
        preventDublicateMove(
          state.roomId,
          async () => {
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
                (letter) =>
                  letter && !getValidLetters(lang).includes(letter.letter)
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
            let checkedWords: CheckedWords = {
              validWords: [],
              invalidWords: [],
            };

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

            currentPlayer.points += playerPoints;
            currentPlayer.totalWords += checkedWords.validWords.length;
            currentPlayer.avgPerWord = Number(
              (currentPlayer.points / currentPlayer.totalWords).toFixed(2)
            );

            //fix the letters
            fixBoard(board);

            const placedTiles = board.flatMap((row, rowIndex) =>
              row.flatMap((cell, colIndex) =>
                cell && cell.newlyPlaced
                  ? [
                      {
                        row: rowIndex,
                        col: colIndex,
                        id: cell.id,
                        letter: cell.letter,
                        points: cell.points,
                      },
                    ]
                  : []
              )
            );

            // Append to history
            state.history.push({
              playerId: currentPlayer.id,
              words: checkedWords.validWords,
              playerPoints,
              placedTiles,
              playerHandAfterMove: filterLetter(currentPlayer.hand),
              undrawnLetterPool: filterLetter(state.undrawnLetterPool),
            });

            // Switch turns
            currentPlayer.consecutivePassCount = 0;
            completePlayerHand(currentPlayer, undrawnLetterPool);
            switchTurns(state, io);

            io.to(roomId).emit("Play Made", state); // If everything is valid, play is made
          },
          moveId
        );
      }
    );
  });
};
