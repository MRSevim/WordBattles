//Helper functions for the game logic

import {
  Board,
  CheckedWords,
  LettersArray,
  Player,
  WordWithCoordinates,
  Letter,
  GameState,
} from "../types/gameTypes";
import { prisma } from "../lib/prisma/prisma";
import { saveGameToMemory } from "./memoryGameHelpers";
import { Io, Lang } from "../types/types";
import { saveGameToDB } from "../lib/prisma/dbCalls/gameCalls";
import { gameTime, HAND_SIZE, letters } from "./misc";

// Function to check game end conditions
const checkGameEnd = (state: GameState) => {
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
  const playerPassedEnough = players.some((player) => player.passCount >= 2);
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

export const applyPointDifference = async (state: GameState) => {
  const everyoneIsUser = state.players.every((player) => player.email);
  const passedPlayer = state.players.find((player) => player.passCount >= 2);

  if (everyoneIsUser) {
    // Calculate score difference
    const [player1, player2] = state.players;
    const scoreDifference = Math.abs(player1.score - player2.score);
    // Determine the winner and loser
    let winner, loser;

    if (passedPlayer) {
      // If a player passed enough and they were behind, apply the score difference
      if (
        passedPlayer.score <
        (passedPlayer === player1 ? player2 : player1).score
      ) {
        loser = passedPlayer;
        winner = passedPlayer === player1 ? player2 : player1;
      } else {
        // If the passed player was not behind, don't apply the difference
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
      await prisma.user.update({
        where: { id: winner.id },
        data: {
          rankedScore: {
            increment: scoreDifference,
          },
        },
      });

      // Update the loser's score
      await prisma.user.update({
        where: { id: loser.id },
        data: {
          rankedScore: {
            decrement: scoreDifference,
          },
        },
      });
    } catch (error) {
      console.error("Error updating ranked scores:", error);
    }
  }
};

export const switchTurns = (state: GameState, io: any) => {
  const { players, roomId } = state;

  const currentPlayer = players.find((player) => player.turn);
  const opponentPlayer = players.find((player) => !player.turn);
  if (!currentPlayer || !opponentPlayer) return;
  const gameEnded = checkGameEnd(state);
  if (!gameEnded) {
    currentPlayer.turn = false;
    currentPlayer.timer = gameTime;
    opponentPlayer.turn = true;
  }
  saveGame(state, io);
  io.to(roomId).emit("Play Made", state);
};

export const saveGame = (state: GameState, io: Io) => {
  saveGameToMemory(state, io);
  saveGameToDB(state);
};

export const switchLetters = (
  switchedIndices: number[],
  state: GameState,
  playerHand: LettersArray
): void => {
  const lettersToReturnToPool: LettersArray = []; // Temporary array for old letters
  const { undrawnLetterPool, lang } = state;
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
    const indexA = letters[lang].findIndex(
      (letter) => letter.letter === a.letter
    );
    const indexB = letters[lang].findIndex(
      (letter) => letter.letter === b.letter
    );
    return indexA - indexB;
  });
};

export const returnToHand = (playerHand: LettersArray, board: Board) => {
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

// Helper function for validating words using Promise.all
export const validateWords = async (
  words: string[],
  lang: Lang
): Promise<CheckedWords> => {
  const fetcher =
    lang === "tr"
      ? (word: string) =>
          fetch(`https://sozluk.gov.tr/gts?ara=${word.toLocaleLowerCase("tr")}`)
            .then((res) => res.json())
            .then((data) => {
              if (data.error) {
                return { word, valid: false }; // Invalid word
              }
              const meanings =
                data[0]?.anlamlarListe.map((meaning: any) => meaning.anlam) ||
                [];
              return { word, valid: true, meanings }; // Valid word with meanings
            })
      : (word: string) =>
          fetch(
            `https://freedictionaryapi.com/api/v1/entries/en/${word.toLocaleLowerCase(
              "en"
            )}`
          )
            .then((res) => res.json())
            .then((data) => {
              if (!data || !data.entries || data.entries.length === 0) {
                return { word, valid: false }; // Invalid word
              }

              // Flatten all senses and subsenses into one meanings array
              const meanings: string[] = [];

              const extractSenses = (senses: any[]) => {
                senses.forEach((sense) => {
                  if (sense.definition) meanings.push(sense.definition);
                });
              };

              data.entries.forEach((entry: any) => {
                if (entry.senses && entry.senses.length > 0) {
                  extractSenses(entry.senses);
                }
              });

              return { word, valid: true, meanings };
            });

  const fetches = words.map(fetcher);

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

//makes whole board fixed
export const fixBoard = (board: Board) => {
  for (let row = 0; row < board.length; row++) {
    for (let col = 0; col < board[row].length; col++) {
      const cell = board[row][col];
      if (cell) {
        cell.fixed = true;
      }
    }
  }
};

//marks new letters and formed words
export const markNewlyPlacedAndNewWords = (board: Board) => {
  const rows = board.length;
  const cols = board[0].length;

  // Reset flags
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const cell = board[r][c];
      if (cell) {
        cell.newlyPlaced = false;
        cell.formsNewWords = false;
      }
    }
  }

  // Mark newlyPlaced tiles (unfixed tiles this turn)
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const cell = board[r][c];
      if (cell && !cell.fixed) {
        cell.newlyPlaced = true;
      }
    }
  }

  // Mark formNewWords: all horizontal/vertical lines connected to newlyPlaced tiles
  const directions: [number, number][] = [
    [-1, 0],
    [1, 0],
    [0, -1],
    [0, 1],
  ];

  outer: for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const cell = board[r][c];
      if (cell && cell.newlyPlaced) {
        cell.formsNewWords = true;

        for (const [dr, dc] of directions) {
          let nr = r + dr;
          let nc = c + dc;

          while (
            nr >= 0 &&
            nr < rows &&
            nc >= 0 &&
            nc < cols &&
            board[nr][nc]
          ) {
            board[nr][nc]!.formsNewWords = true;
            nr += dr;
            nc += dc;
          }
        }

        break outer; // first newlyPlaced tile is enough
      }
    }
  }
};

export const findWordsOnBoard = (board: Board): WordWithCoordinates[] => {
  const words: WordWithCoordinates[] = [];

  const processLine = (
    getCell: (i: number) => Letter | null,
    lineLength: number,
    fixedIndex: number,
    isHorizontal: boolean
  ) => {
    let word = "";
    let start = -1;
    let hasUnfixed = false;

    for (let i = 0; i < lineLength; i++) {
      const cell = getCell(i);
      if (cell && cell.letter) {
        if (word === "") start = i;
        word += cell.letter;
        if (!cell.fixed) hasUnfixed = true;
      } else if (word.length > 1 && hasUnfixed) {
        words.push({
          word,
          start: isHorizontal ? [fixedIndex, start] : [start, fixedIndex],
          end: isHorizontal ? [fixedIndex, i - 1] : [i - 1, fixedIndex],
        });
        word = "";
        start = -1;
        hasUnfixed = false;
      } else {
        word = "";
        start = -1;
        hasUnfixed = false;
      }
    }

    // Final word at end of line
    if (word.length > 1 && hasUnfixed) {
      words.push({
        word,
        start: isHorizontal ? [fixedIndex, start] : [start, fixedIndex],
        end: isHorizontal
          ? [fixedIndex, lineLength - 1]
          : [lineLength - 1, fixedIndex],
      });
    }
  };

  // Horizontal pass
  for (let row = 0; row < board.length; row++) {
    processLine((i) => board[row][i], board[row].length, row, true);
  }

  // Vertical pass
  for (let col = 0; col < board[0].length; col++) {
    processLine((i) => board[i][col], board.length, col, false);
  }

  return words;
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

  // Function to check if a tile is adjacent to a fixed tile
  const isAdjacentToFixed = (
    board: Board,
    row: number,
    col: number
  ): boolean => {
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
        board[newRow][newCol].fixed
      ) {
        return true; // It's adjacent to an existing fixed tile
      }
    }
    return false;
  };

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

  // Track newly placed letters (for Bingo)
  const newlyPlacedLetters: string[] = [];

  // Iterate over each word
  wordsWithCoordinates.forEach(({ start, end }) => {
    let wordPoints = 0;
    let wordMultiplier = 1;

    const isHorizontal = start[0] === end[0];
    const indices = isHorizontal
      ? Array.from({ length: end[1] - start[1] + 1 }, (_, i) => start[1] + i)
      : Array.from({ length: end[0] - start[0] + 1 }, (_, i) => start[0] + i);

    indices.forEach((index) => {
      const cell = isHorizontal
        ? board[start[0]][index]
        : board[index][start[1]];

      if (!cell) return;

      const isNew = !cell.fixed;

      // Base points (always added)
      let letterPoints = cell.point;

      if (isNew) {
        // Letter multipliers
        if (cell.class === "double-letter") letterPoints *= 2;
        else if (cell.class === "triple-letter") letterPoints *= 3;

        // Word multipliers
        if (cell.class === "double-word" || cell.class === "center")
          wordMultiplier *= 2;
        else if (cell.class === "triple-word") wordMultiplier *= 3;

        // Track the letter for Bingo bonus
        if (cell.letter) newlyPlacedLetters.push(cell.letter);
      }

      // Add letter points to word total
      wordPoints += letterPoints;
    });

    // Apply word multiplier
    totalPoints += wordPoints * wordMultiplier;
  });

  // Bingo: if player used all tiles in their hand
  if (newlyPlacedLetters.length === HAND_SIZE) {
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
