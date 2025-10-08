//Helper functions for the game logic

import {
  Board,
  gameState,
  CheckedWords,
  HAND_SIZE,
  InitialLetters,
  LettersArray,
  Player,
  WordWithCoordinates,
  letters,
  gameTime,
} from "../types/gameTypes";
import { clearTimerIfExist } from "./timerRelated";
import { v6 as uuidv6 } from "uuid";
import { getGameFromMemory, saveGameToMemory } from "./memoryGameHelpers";
import { setUpTimerInterval } from "./timerRelated";

// Function to check game end conditions
const checkGameEnd = (state: gameState) => {
  let gameEnded = false;
  const { players, undrawnLetterPool } = state;

  // Check if the letter pool is empty and one player has no tiles left
  const isLetterPoolEmpty = undrawnLetterPool.length === 0;
  const finishingPlayer = players.find((player) => player.hand.length === 0);
  const hasFinishedTiles = !!finishingPlayer;
  const unfinishedPlayer = players.find((player) => player.hand.length > 0);

  if (isLetterPoolEmpty && hasFinishedTiles && unfinishedPlayer) {
    // Player has finished their tiles and pool is empty
    state.status = "ended";
    const unfinishedPlayerHandSize = unfinishedPlayer.hand.length;
    unfinishedPlayer.score -= unfinishedPlayerHandSize;
    finishingPlayer.score += unfinishedPlayerHandSize;
    gameEnded = true;
  }
  const playerPassedEnough = players.some(
    (player) => player.closedPassCount >= 2
  );
  const playersPassedEnough = state.passCount >= 4;
  if (playerPassedEnough || playersPassedEnough) {
    // Logic for ending the game due to passes
    state.status = "ended";

    gameEnded = true;
  }
  if (gameEnded) {
    applyPointDifference(state);
  }

  return gameEnded;
};

export const applyPointDifference = async (state: gameState) => {
  const everyoneIsUser = state.players.every((player) => player.email);
  const disconnectedPlayer = state.players.find(
    (player) => player.closedPassCount >= 2
  );

  if (everyoneIsUser) {
    const { User } = require("./models/userModel");
    // Calculate score difference
    const [player1, player2] = state.players;
    const scoreDifference = Math.abs(player1.score - player2.score);
    // Determine the winner and loser
    let winner, loser;

    if (disconnectedPlayer) {
      // If a player disconnected and they were behind, apply the score difference
      if (
        disconnectedPlayer.score <
        (disconnectedPlayer === player1 ? player2 : player1).score
      ) {
        loser = disconnectedPlayer;
        winner = disconnectedPlayer === player1 ? player2 : player1;
      } else {
        // If the disconnected player was not behind, don't apply the difference
        return;
      }
    } else {
      // Normal end game scenario
      if (player1.score > player2.score) {
        winner = player1;
        loser = player2;
      } else if (player2.score > player1.score) {
        winner = player2;
        loser = player1;
      } else {
        // Tie scenario, no score difference applied
        return;
      }
    }

    try {
      // Update the winner's score
      await User.findOneAndUpdate(
        { email: winner.email },
        { $inc: { rankedScore: scoreDifference } }
      );

      // Update the loser's score
      await User.findOneAndUpdate(
        { email: loser.email },
        { $inc: { rankedScore: -scoreDifference } }
      );
    } catch (error) {
      console.error("Error updating ranked scores:", error);
    }
  }
};

export const generateInitialBoard = (): Board => {
  return Array.from({ length: 15 }, () => Array(15).fill(null));
};

export const generateEmptyLetterIdsArray = (
  letterPool: LettersArray
): string[] => {
  return letterPool
    .filter((letter) => letter.letter === "") // Find letters with an empty `letter` property
    .map((letter) => letter.id); // Return an array of their `id`s
};

export const generateGameState = (socket: any, _socket: any) => {
  const letterPool = generateLetterPool(letters);
  const emptyLetterIds = generateEmptyLetterIdsArray(letterPool);
  const playersStatus = generateGame(letterPool);
  const initialBoard = generateInitialBoard();
  const players = [
    {
      hand: playersStatus.players[0],
      username: socket.user?.username || "konuk",
      email: socket.user?.email,
      turn: playersStatus.startingPlayer === 1,
      sessionId: socket.sessionId,
      score: 0,
      closedPassCount: 0,
      timer: gameTime,
    },
    {
      hand: playersStatus.players[1],
      username: _socket.user?.username || "konuk",
      email: _socket.user?.email,
      turn: playersStatus.startingPlayer === 2,
      sessionId: _socket.sessionId,
      score: 0,
      closedPassCount: 0,
      timer: gameTime,
    },
  ];
  const roomId = uuidv6();
  _socket.roomId = roomId;
  socket.roomId = roomId;

  _socket.join(roomId);
  socket.join(roomId);
  console.log("Game found", roomId);
  const state: gameState = {
    status: "found",
    players,
    undrawnLetterPool: playersStatus.undrawnletterPool,
    roomId,
    passCount: 0,
    emptyLetterIds,
    board: initialBoard,
    history: [],
  };
  return state;
};

export const switchTurns = (state: gameState, io: any) => {
  const { players, roomId } = state;

  const currentPlayer = players.find((player) => player.turn) as Player;
  const opponentPlayer = players.find((player) => !player.turn) as Player;
  const gameEnded = checkGameEnd(state);
  if (!gameEnded) {
    currentPlayer.turn = false;
    currentPlayer.timer = gameTime;
    opponentPlayer.turn = true;

    io.to(roomId).emit("Play Made", state);

    setUpTimerInterval(state, io);
  } else {
    clearTimerIfExist(roomId);
    io.to(roomId).emit("Play Made", state);
  }
  const game = getGameFromMemory(roomId);
  if (game) {
    saveGameToMemory(state, io);
  }
};

export const switchLetters = (
  switchedIndices: number[],
  playerHand: LettersArray,
  undrawnLetterPool: LettersArray
): void => {
  const lettersToReturnToPool: LettersArray = []; // Temporary array for old letters

  // Switch each letter at the specified indices with a random one from the undrawn pool
  switchedIndices.forEach((index) => {
    // Select a random letter from the undrawn pool
    const randomIndex = Math.floor(Math.random() * undrawnLetterPool.length);
    const randomLetter = undrawnLetterPool[randomIndex];

    // Store the old letter in the temporary array instead of adding it back immediately
    lettersToReturnToPool.push(playerHand[index]);

    // Swap the player's letter with the random letter
    undrawnLetterPool.splice(randomIndex, 1); // Remove letter from the pool
    playerHand[index] = randomLetter; // Replace with new random letter
  });

  // After all switches are done, add the old letters back to the pool
  undrawnLetterPool.push(...lettersToReturnToPool);

  // Sort the undrawnLetterPool based on their index in the 'letters' array
  undrawnLetterPool.sort((a, b) => {
    const indexA = letters.findIndex((letter) => letter.letter === a.letter);
    const indexB = letters.findIndex((letter) => letter.letter === b.letter);
    return indexA - indexB;
  });
};

export const pass = (playerHand: LettersArray, board: Board) => {
  for (let row = 0; row < board.length; row++) {
    for (let col = 0; col < board[row].length; col++) {
      const cell = board[row][col];
      if (cell && !cell.fixed) {
        playerHand.push(cell);
        board[row][col] = null;
      }
    }
  }
};

export const timerRanOutUnsuccessfully = (state: gameState) => {
  const currentPlayer = state.players.find((player) => player.turn) as Player;

  pass(currentPlayer.hand, state.board);
  state.passCount += 1;
  state.history.push({
    playerSessionId: currentPlayer.sessionId,
    words: [],
    playerPoints: 0,
  });
};

// Helper function for validating words using Promise.all
export const validateWords = async (words: string[]): Promise<CheckedWords> => {
  const fetches = words.map((word) =>
    fetch(`https://sozluk.gov.tr/gts?ara=${word.toLocaleLowerCase("tr")}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          return { word, valid: false }; // Invalid word
        }
        const meanings =
          data[0]?.anlamlarListe.map((meaning: any) => meaning.anlam) || [];
        return { word, valid: true, meanings }; // Valid word with meanings
      })
  );

  const results = await Promise.all(fetches);

  // Separate valid and invalid words
  const validWords = results
    .filter((result) => result.valid)
    .map((result) => ({ word: result.word, meanings: result.meanings }));
  const invalidWords = results
    .filter((result) => !result.valid)
    .map((result) => result.word);

  return { validWords, invalidWords };
};

export const updateBoard = (
  wordsWithCoordinates: WordWithCoordinates[],
  board: Board
) => {
  // Update the board (fix tiles and remove classes)
  wordsWithCoordinates.forEach(({ start, end }) => {
    if (start[0] === end[0]) {
      // Horizontal word
      for (let col = start[1]; col <= end[1]; col++) {
        const cell = board[start[0]][col];
        if (cell) {
          // Check if the cell is not null
          cell.fixed = true;
          cell.class = ""; // Remove the class
        }
      }
    } else {
      // Vertical word
      for (let row = start[0]; row <= end[0]; row++) {
        const cell = board[row][start[1]];
        if (cell) {
          // Check if the cell is not null
          cell.fixed = true;
          cell.class = ""; // Remove the class
        }
      }
    }
  });
};

export const findWordsOnBoard = (board: Board): WordWithCoordinates[] => {
  const words: WordWithCoordinates[] = [];

  // Check for horizontal words
  for (let row = 0; row < board.length; row++) {
    let word = "";
    let startCol = -1; // To track the start column of the word
    let hasUnfixedLetter = false; // Track if there is an unfixed letter

    for (let col = 0; col < board[row].length; col++) {
      const cell = board[row][col];
      if (cell && cell.letter) {
        if (word === "") {
          // Word just started, record start position
          startCol = col;
        }
        word += cell.letter;

        // Check if the letter is unfixed
        if (!cell.fixed) {
          hasUnfixedLetter = true;
        }
      } else if (word.length > 1 && hasUnfixedLetter) {
        // Word ends here, save it along with coordinates
        words.push({
          word,
          start: [row, startCol],
          end: [row, col - 1],
        });
        word = "";
        startCol = -1;
        hasUnfixedLetter = false; // Reset for the next word
      } else {
        word = "";
        startCol = -1;
        hasUnfixedLetter = false; // Reset for the next word
      }
    }
    // Add any remaining word in the row if it has unfixed letters
    if (word.length > 1 && hasUnfixedLetter) {
      words.push({
        word,
        start: [row, startCol],
        end: [row, board[row].length - 1],
      });
    }
  }

  // Check for vertical words
  for (let col = 0; col < board[0].length; col++) {
    let word = "";
    let startRow = -1; // To track the start row of the word
    let hasUnfixedLetter = false; // Track if there is an unfixed letter

    for (let row = 0; row < board.length; row++) {
      const cell = board[row][col];
      if (cell && cell.letter) {
        if (word === "") {
          // Word just started, record start position
          startRow = row;
        }
        word += cell.letter;

        // Check if the letter is unfixed
        if (!cell.fixed) {
          hasUnfixedLetter = true;
        }
      } else if (word.length > 1 && hasUnfixedLetter) {
        // Word ends here, save it along with coordinates
        words.push({
          word,
          start: [startRow, col],
          end: [row - 1, col],
        });
        word = "";
        startRow = -1;
        hasUnfixedLetter = false; // Reset for the next word
      } else {
        word = "";
        startRow = -1;
        hasUnfixedLetter = false; // Reset for the next word
      }
    }
    // Add any remaining word in the column if it has unfixed letters
    if (word.length > 1 && hasUnfixedLetter) {
      words.push({
        word,
        start: [startRow, col],
        end: [board.length - 1, col],
      });
    }
  }

  return words;
};

// Check if a tile is adjacent to a fixed tile
const isAdjacentToFixed = (board: Board, row: number, col: number): boolean => {
  const directions = [
    [-1, 0], // Up
    [1, 0], // Down
    [0, -1], // Left
    [0, 1], // Right
  ];

  for (const [dx, dy] of directions) {
    const newRow = row + dx;
    const newCol = col + dy;
    if (
      newRow >= 0 &&
      newRow < board.length &&
      newCol >= 0 &&
      newCol < board[0].length &&
      board[newRow][newCol] &&
      board[newRow][newCol]?.fixed
    ) {
      return true; // It's adjacent to an existing fixed tile
    }
  }
  return false;
};

export const areNewWordsCorrectlyPlaced = (board: Board): boolean => {
  let newTiles: { row: number; col: number }[] = [];

  // Collect positions of newly placed tiles
  for (let row = 0; row < board.length; row++) {
    for (let col = 0; col < board[row].length; col++) {
      const cell = board[row][col];
      if (cell && !cell.fixed) {
        newTiles.push({ row, col });
      }
    }
  }

  // Return false if there are no new tiles
  if (newTiles.length === 0) return false;

  // Calculate bounds for newly placed tiles
  const minRow = Math.min(...newTiles.map((tile) => tile.row));
  const maxRow = Math.max(...newTiles.map((tile) => tile.row));
  const minCol = Math.min(...newTiles.map((tile) => tile.col));
  const maxCol = Math.max(...newTiles.map((tile) => tile.col));

  // Ensure new tiles are in a single row or column
  const isSingleLine = minRow === maxRow || minCol === maxCol;
  if (!isSingleLine) return false;

  // Verify that all tiles in the line are either new tiles or filled
  const isConnectedLine = () => {
    for (let r = minRow; r <= maxRow; r++) {
      for (let c = minCol; c <= maxCol; c++) {
        const cell = board[r][c];
        if (!cell) {
          return false;
        }
      }
    }
    return true;
  };

  if (!isConnectedLine()) return false;

  // Check that at least one new tile is adjacent to a fixed tile
  const isConnectedToFixed = newTiles.some(({ row, col }) =>
    isAdjacentToFixed(board, row, col)
  );
  return isConnectedToFixed;
};

export const calculatePoints = (
  board: Board,
  wordsWithCoordinates: WordWithCoordinates[],
  io: any,
  id: string
): number => {
  let totalPoints = 0;

  // Track which letters are used for the bonus calculation
  const usedLetters: Set<string> = new Set();

  // Iterate over each word found on the board
  wordsWithCoordinates.forEach(({ word, start, end }) => {
    let wordPoints = 0;
    let wordMultiplier = 1;

    // Calculate points for the word, check if it’s horizontal or vertical
    const isHorizontal = start[0] === end[0];
    const fixedIndices = isHorizontal
      ? Array.from({ length: end[1] - start[1] + 1 }, (_, i) => start[1] + i)
      : Array.from({ length: end[0] - start[0] + 1 }, (_, i) => start[0] + i);

    fixedIndices.forEach((index) => {
      const cell = isHorizontal
        ? board[start[0]][index]
        : board[index][start[1]];

      if (cell) {
        // Apply letter multiplier
        let letterPoints = cell.point;
        if (cell.class === "double-letter") {
          letterPoints *= 2;
        } else if (cell.class === "triple-letter") {
          letterPoints *= 3;
        }

        // Add to word points
        wordPoints += letterPoints;

        // Track used letters for bonus calculation
        if (cell.letter && !cell.fixed) {
          usedLetters.add(cell.letter);
        }

        // Apply word multiplier
        if (cell.class === "double-word" || cell.class === "center") {
          wordMultiplier *= 2;
        } else if (cell.class === "triple-word") {
          wordMultiplier *= 3;
        }
      }
    });

    // Add the word's points to the total, applying word multiplier
    totalPoints += wordPoints * wordMultiplier;
  });
  // If the player uses all their tiles (Bingo), they get a 50-point bonus
  if (usedLetters.size === HAND_SIZE) {
    io.to(id).emit("Bingo");
    totalPoints += 50;
  }

  return totalPoints;
};

export const completePlayerHand = (
  player: Player,
  undrawnLetterPool: LettersArray
): void => {
  const lettersNeeded = HAND_SIZE - player.hand.length;

  if (lettersNeeded > 0 && undrawnLetterPool.length > 0) {
    // Draw letters randomly from the undrawn letter pool
    const drawnLetters: LettersArray = [];

    for (let i = 0; i < lettersNeeded; i++) {
      // Check if there are letters left in the pool
      if (undrawnLetterPool.length === 0) break;

      // Get a random index
      const randomIndex = Math.floor(Math.random() * undrawnLetterPool.length);
      // Draw the letter from the undrawn pool
      const drawnLetter = undrawnLetterPool[randomIndex];

      // Add the drawn letter to the drawnLetters array
      drawnLetters.push(drawnLetter);

      // Remove the drawn letter from the undrawn pool
      undrawnLetterPool.splice(randomIndex, 1);
    }

    // Add drawn letters to the player's hand
    player.hand.push(...drawnLetters);
  }
};

export const generateLetterPool = (array: InitialLetters[]): LettersArray => {
  let newArr: LettersArray = [];

  array.forEach((letter) => {
    for (let i = 0; i < letter.amount; i++) {
      newArr.push({ ...letter, drawn: false, id: uuidv6() });
    }
  });
  return newArr;
};

export const generateGame = (letterPool: LettersArray) => {
  const players: LettersArray[] = [[], []]; // Two players
  const usedLetters = new Set();

  // Distribute letters, one by one to each player until both have HAND_SIZE tiles
  for (let i = 0; i < HAND_SIZE; i++) {
    players.forEach((player) => {
      let drawn = false;
      while (!drawn) {
        const randomIndex = Math.floor(Math.random() * letterPool.length);
        const letter = letterPool[randomIndex];
        if (!usedLetters.has(randomIndex)) {
          player.push(letter);
          letterPool[randomIndex].drawn = true;
          usedLetters.add(randomIndex);
          drawn = true;
        }
      }
    });
  }

  const undrawnletterPool = letterPool.filter((letter) => !letter.drawn);

  // Function to get the index of a letter in the 'letters' array
  const getLetterIndex = (letter: string) => {
    const index = letters.findIndex((item) => item.letter === letter);
    return index !== -1 ? index : Infinity; // If letter isn't in the array, assign a high index
  };

  const getPlayersClosest = (player: LettersArray) =>
    player.reduce(
      (closest, letter) =>
        getLetterIndex(letter.letter) < getLetterIndex(closest.letter)
          ? letter
          : closest,
      player[0]
    );

  // Get the closest letter to "A" for each player
  const player1Closest = getPlayersClosest(players[0]);

  const player2Closest = getPlayersClosest(players[1]);

  // Determine who starts
  let startingPlayer;
  if (
    getLetterIndex(player1Closest.letter) <
    getLetterIndex(player2Closest.letter)
  ) {
    startingPlayer = 1; // Player 1 starts
  } else if (
    getLetterIndex(player1Closest.letter) >
    getLetterIndex(player2Closest.letter)
  ) {
    startingPlayer = 2; // Player 2 starts
  } else {
    startingPlayer = Math.random() < 0.5 ? 1 : 2; // 50-50 if the closest letters are equal
  }

  return {
    players,
    startingPlayer,
    undrawnletterPool,
  };
};
