import { Board, GameState } from "@/features/game/utils/types/gameTypes";

// Helper to check adjacency (vertical/horizontal)
function addFormsNewWords(board: Board, row: number, col: number) {
  const dirs = [
    [1, 0],
    [-1, 0],
    [0, 1],
    [0, -1],
  ];
  for (const [dr, dc] of dirs) {
    const r = row + dr;
    const c = col + dc;
    if (r >= 0 && c >= 0 && r < board.length && c < board[0].length) {
      const letter = board[r][c];
      if (letter) letter.formsNewWords = true;
    }
  }
}

// Deep clone board template
function emptyBoard(baseBoard: Board): Board {
  return baseBoard.map((row) => row.map(() => null));
}

export function getReplaySnapshot(game: GameState, replayIndex: number) {
  const board: Board = emptyBoard(game.board);
  const history = game.history;

  // Place all previous moves
  for (let i = 0; i <= replayIndex; i++) {
    const entry = history[i];
    if (!entry) continue;

    entry.placedTiles.forEach((placed) => {
      const { row, col, letter, points, id } = placed;
      board[row][col] = {
        id,
        letter,
        points,
        drawn: true,
        fixed: true,
        newlyPlaced: false,
        formsNewWords: false,
        amount: 1,
      };
    });
  }

  // Mark last move’s tiles as newlyPlaced
  const lastEntry = history[replayIndex];
  if (lastEntry) {
    lastEntry.placedTiles.forEach(({ row, col }) => {
      const tile = board[row][col];
      if (tile) {
        tile.newlyPlaced = true;
        tile.formsNewWords = true;
      }
    });

    // Mark formsNewWords for tiles that connect to others
    lastEntry.placedTiles.forEach(({ row, col }) => {
      const tile = board[row][col];
      if (!tile) return;
      addFormsNewWords(board, row, col);
    });
  }

  const players = game.players.map((player) => ({
    ...player,
    leftTheGame:
      replayIndex === history.length - 1 ? player.leftTheGame : false,
    points: history
      .slice(0, replayIndex + 1)
      .filter((h) => h.playerId === player.id)
      .reduce((sum, h) => sum + (h.playerPoints ?? 0), 0),
  }));

  return {
    board,
    currentHand: lastEntry?.playerHandAfterMove ?? [],
    players,
  };
}
