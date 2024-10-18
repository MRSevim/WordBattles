const { v6: uuidv6 } = require("uuid");
interface Letter {
  letter: string;
  point: number;
  amount: number;
  drawn?: boolean;
  fixed?: boolean;
  class?: string;
}

type LettersArray = Letter[];

type Board = (Letter | null)[][];

interface Player {
  hand: LettersArray[];
  username: string;
  turn: boolean;
  socketId: string;
}

interface Game {
  players: Player[];
  undrawnLetterPool: LettersArray[];
  roomId: string;
}

interface playMove {
  roomId: string;
  board: Board;
}

export const runSocketLogic = (io: any) => {
  io.on("connection", (socket: any) => {
    console.log("a user connected");

    for (let [id, _socket] of io.of("/").sockets) {
      if (!_socket.full && socket.id !== id) {
        const roomId = uuidv6();
        _socket.join(roomId);
        socket.join(roomId);
        console.log("Game found", roomId);
        socket.to(roomId).emit("Generate Game", {
          roomId,
          players: {
            player1: { username: "konuk", socketId: socket.id },
            player2: { username: "konuk", socketId: id },
          },
        });
        _socket.full = true;
        socket.full = true;
      }
    }

    socket.on(
      "Generated Game",
      ({ players, undrawnLetterPool, roomId }: Game) => {
        io.to(roomId).emit("Start Game", {
          players,
          undrawnLetterPool,
          roomId,
        });
      }
    );

    socket.on("Play", async ({ board, roomId }: playMove) => {
      // First, check if the new words are connected to old ones (if any)
      const existingWordOnBoard = board.some((row) =>
        row.some((cell) => cell && cell.fixed)
      );

      if (existingWordOnBoard) {
        const newWordsConnected = areNewWordsConnected(board);

        if (!newWordsConnected) {
          io.to(roomId).emit("Game Error", {
            error:
              "Yeni kelimelerden en az biri dolu hücreler ile bağlantılı olmalıdır",
          });
          return;
        }
      }
      const words = findWordsOnBoard(board);
      if (words.length === 0) {
        io.to(roomId).emit("Game Error", {
          error: "Lütfen tahtaya bir harften uzun bir kelime ekleyiniz",
        });
        return;
      }

      // Validate words using the API
      try {
        const validWords = await validateWords(words);

        if (validWords.invalidWords.length > 0) {
          io.to(roomId).emit("Game Error", {
            error: `Geçersiz kelimeler: ${validWords.invalidWords.join(", ")}`,
          });
          return;
        }

        io.to(roomId).emit("Play Made", {}); // If everything is valid, play is made
      } catch (error) {
        io.to(roomId).emit("Game Error", {
          error: "Kelime doğrulama sırasında bir hata oluştu",
        });
      }
    });
  });
};

// Helper function for validating words using Promise.all
const validateWords = async (
  words: string[]
): Promise<{ validWords: string[]; invalidWords: string[] }> => {
  const fetches = words.map((word) =>
    fetch(`https://sozluk.gov.tr/gts?ara=${word}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          return { word, valid: false }; // Invalid word
        }
        return { word, valid: true }; // Valid word
      })
  );

  const results = await Promise.all(fetches);

  // Separate valid and invalid words
  const validWords = results
    .filter((result) => result.valid)
    .map((result) => result.word);
  const invalidWords = results
    .filter((result) => !result.valid)
    .map((result) => result.word);

  return { validWords, invalidWords };
};

const findWordsOnBoard = (board: Board): string[] => {
  const words: string[] = [];

  // Check for horizontal words
  for (let row = 0; row < board.length; row++) {
    let word = "";
    for (let col = 0; col < board[row].length; col++) {
      const cell = board[row][col];
      if (cell && cell.letter) {
        word += cell.letter;
      } else if (word.length > 1) {
        words.push(word);
        word = "";
      } else {
        word = "";
      }
    }
    if (word.length > 1) {
      words.push(word);
    }
  }

  // Check for vertical words
  for (let col = 0; col < board[0].length; col++) {
    let word = "";
    for (let row = 0; row < board.length; row++) {
      const cell = board[row][col];
      if (cell && cell.letter) {
        word += cell.letter;
      } else if (word.length > 1) {
        words.push(word);
        word = "";
      } else {
        word = "";
      }
    }
    if (word.length > 1) {
      words.push(word);
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

const areNewWordsConnected = (board: Board): boolean => {
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
