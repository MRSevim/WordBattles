interface Letter {
  letter: string;
  point: number;
  amount: number;
  drawn?: boolean;
  fixed?: boolean;
  class?: string;
}

const HAND_SIZE = 7;

type LettersArray = Letter[];

type Board = (Letter | null)[][];

export interface Player {
  hand: LettersArray;
  username: string;
  turn: boolean;
  socketId: string;
  score: number;
  timer: number;
}

interface Game {
  players: Player[];
  undrawnLetterPool: LettersArray;
  roomId: string;
  passCount: number;
}
interface Word {
  word: string;
  meanings: string[];
}
export interface CheckedWords {
  validWords: Word[];
  invalidWords: string[];
}

export interface gameState {
  findingGame: boolean;
  game: Game;
  board: Board;
  history: {
    playerSocketId: string;
    words: Word[];
    playerPoints: number;
  }[];
}

export interface WordWithCoordinates {
  word: string;
  start: [number, number];
  end: [number, number];
}

const letters: LettersArray = [
  { letter: "A", point: 1, amount: 12 },
  { letter: "B", point: 3, amount: 2 },
  { letter: "C", point: 4, amount: 2 },
  { letter: "Ç", point: 4, amount: 2 },
  { letter: "D", point: 3, amount: 2 },
  { letter: "E", point: 1, amount: 8 },
  { letter: "F", point: 8, amount: 1 },
  { letter: "G", point: 5, amount: 1 },
  { letter: "Ğ", point: 7, amount: 1 },
  { letter: "H", point: 5, amount: 1 },
  { letter: "I", point: 2, amount: 4 },
  { letter: "İ", point: 1, amount: 7 },
  { letter: "J", point: 10, amount: 1 },
  { letter: "K", point: 1, amount: 7 },
  { letter: "L", point: 1, amount: 7 },
  { letter: "M", point: 2, amount: 4 },
  { letter: "N", point: 1, amount: 5 },
  { letter: "O", point: 2, amount: 3 },
  { letter: "Ö", point: 6, amount: 1 },
  { letter: "P", point: 7, amount: 1 },
  { letter: "R", point: 2, amount: 6 },
  { letter: "S", point: 3, amount: 3 },
  { letter: "Ş", point: 4, amount: 2 },
  { letter: "T", point: 2, amount: 5 },
  { letter: "U", point: 2, amount: 3 },
  { letter: "Ü", point: 3, amount: 2 },
  { letter: "V", point: 7, amount: 1 },
  { letter: "Y", point: 3, amount: 2 },
  { letter: "Z", point: 4, amount: 2 },
  { letter: "", point: 0, amount: 2 },
];

export const validTurkishLetters: string[] = letters
  .filter((letter) => letter.letter !== "")
  .map((letter) => letter.letter);

let _timerInterval: ReturnType<typeof setInterval> | undefined;

export const switchTurns = (state: gameState, io: any) => {
  const {
    game: { players, roomId },
  } = state;

  const currentPlayer = players.find((player) => player.turn) as Player;
  const opponentPlayer = players.find((player) => !player.turn) as Player;

  currentPlayer.turn = false;
  currentPlayer.timer = 10;
  opponentPlayer.turn = true;

  io.to(roomId).emit("Play Made", state);

  setUpTimerInterval(state, io);
};

export const setUpTimerInterval = (state: gameState, io: any) => {
  const {
    game: { players, roomId },
  } = state;
  const currentPlayer = players.find((player) => player.turn) as Player;

  // Clear any previous intervals to avoid multiple timers
  if (_timerInterval) {
    clearInterval(_timerInterval);
  }

  // Set a new interval for the opponent's timer
  _timerInterval = setInterval(() => {
    if (currentPlayer.timer > 0) {
      currentPlayer.timer -= 1;
      io.to(roomId).emit("Timer Runs", players);
    } else {
      clearInterval(_timerInterval); // Clear the interval when timer runs out
    }
  }, 1000);
};

export const switchLetters = (
  switchedIndices: number[],
  playerHand: LettersArray,
  undrawnLetterPool: LettersArray
): void => {
  // Switch each letter at the specified indices with a random one from the undrawn pool
  switchedIndices.forEach((index) => {
    // Select a random letter from the undrawn pool
    const randomIndex = Math.floor(Math.random() * undrawnLetterPool.length);
    const randomLetter = undrawnLetterPool[randomIndex];

    // Swap the player's letter with the random letter
    undrawnLetterPool.splice(randomIndex, 1); // Remove letter from the pool
    undrawnLetterPool.push(playerHand[index]); // Add old letter back to the pool
    playerHand[index] = randomLetter; // Replace with new random letter
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
  const currentPlayer = state.game.players.find(
    (player) => player.turn
  ) as Player;
  state.game.passCount += 1;
  pass(currentPlayer.hand, state.board);
  state.history.push({
    playerSocketId: currentPlayer.socketId,
    words: [],
    playerPoints: 0,
  });
};

// Helper function for validating words using Promise.all
export const validateWords = async (words: string[]): Promise<CheckedWords> => {
  const fetches = words.map((word) =>
    fetch(`https://sozluk.gov.tr/gts?ara=${word.toLowerCase()}`)
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

// Check if all new tiles are aligned horizontally or vertically
export const areTilesAligned = (board: Board): boolean => {
  const newTiles: { row: number; col: number }[] = []; // Collect newly placed tiles
  for (let row = 0; row < board.length; row++) {
    for (let col = 0; col < board[row].length; col++) {
      const cell = board[row][col];
      if (cell && !cell.fixed) {
        newTiles.push({ row, col });
      }
    }
  }
  if (newTiles.length <= 1) return true; // If only one tile, it's trivially aligned

  // Check if all tiles are in the same row (horizontal alignment)
  const sameRow = newTiles.every((tile) => tile.row === newTiles[0].row);

  // Check if all tiles are in the same column (vertical alignment)
  const sameCol = newTiles.every((tile) => tile.col === newTiles[0].col);

  // Return true if they are aligned in one direction
  return sameRow || sameCol;
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

export const areNewWordsConnected = (board: Board): boolean => {
  let newTilesConnected = false;
  for (let row = 0; row < board.length; row++) {
    for (let col = 0; col < board[row].length; col++) {
      const cell = board[row][col];
      if (cell && !cell.fixed) {
        // Check if this new tile is connected to any fixed tile
        if (isAdjacentToFixed(board, row, col)) {
          newTilesConnected = true;
        }
      }
    }
  }
  return newTilesConnected;
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
        if (cell.letter) {
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

export const generateLetterPool = (array: LettersArray): LettersArray => {
  let newArr: LettersArray = [];

  array.forEach((letter) => {
    for (let i = 0; i < letter.amount; i++) {
      newArr.push({ ...letter, drawn: false });
    }
  });
  return newArr;
};

export const letterPool: LettersArray = generateLetterPool(letters);

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

  // Function to determine the distance of a letter from "A"
  const getLetterDistance = (letter: string) => {
    if (letter === "") return Infinity;
    return Math.abs(letter.charCodeAt(0) - "A".charCodeAt(0));
  };

  const getPlayersClosest = (player: LettersArray) =>
    player.reduce(
      (closest, letter) =>
        getLetterDistance(letter.letter) < getLetterDistance(closest.letter)
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
    getLetterDistance(player1Closest.letter) <
    getLetterDistance(player2Closest.letter)
  ) {
    startingPlayer = 1; // Player 1 starts
  } else if (
    getLetterDistance(player1Closest.letter) >
    getLetterDistance(player2Closest.letter)
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
