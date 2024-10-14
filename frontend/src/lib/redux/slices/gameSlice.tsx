import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { Letter, LettersArray } from "../../helpers";
import { socket } from "../../socketio";

interface extendedLetter extends Letter {
  fixed: boolean;
  class?: string;
}

type Board = (extendedLetter | null)[][];

const initialBoard: Board = Array.from({ length: 15 }, () =>
  Array(15).fill(null)
);

export interface Player {
  hand: LettersArray;
  username: string;
  turn: boolean;
  socketId: string;
}

export interface Game {
  players: Player[];
  undrawnLetterPool: LettersArray;
  roomId: string;
}

interface gameState {
  findingGame: boolean;
  game: Game | null;
  board: Board;
}
export interface Coordinates {
  row: number;
  col: number;
}

interface moveData {
  id: number;
  coordinates: Coordinates;
  letter?: Letter;
  class?: string;
}

interface moveAction {
  targetData: moveData;
  activeData: moveData;
}

const initialState: gameState = {
  findingGame: false,
  game: null,
  board: initialBoard,
};

export const gameSlice = createSlice({
  name: "game",
  initialState: initialState as gameState,
  reducers: {
    setFindingGame: (state) => {
      state.findingGame = true;
    },
    setGame: (state, action: PayloadAction<Game>) => {
      state.findingGame = false;
      state.game = action.payload;
    },

    moveLetter: (state, action: PayloadAction<moveAction>) => {
      const player = state.game?.players.find((player) => {
        return player.socketId === socket.id;
      });

      if (player) {
        const { activeData, targetData } = action.payload;

        if (activeData.coordinates && targetData.coordinates) {
          const letter = activeData.letter;

          state.board[activeData.coordinates.row - 1][
            activeData.coordinates.col - 1
          ] = null;

          state.board[targetData.coordinates.row - 1][
            targetData.coordinates.col - 1
          ] = letter
            ? { ...letter, fixed: false, class: targetData.class }
            : null;
        } else if (!activeData.coordinates && targetData.coordinates) {
          // Remove the letter from the hand
          player.hand.splice(activeData.id, 1);

          const letter = activeData.letter;

          state.board[targetData.coordinates.row - 1][
            targetData.coordinates.col - 1
          ] = letter
            ? { ...letter, fixed: false, class: targetData.class }
            : null;
        } else if (activeData.coordinates && !targetData.coordinates) {
          const letter = activeData.letter;

          state.board[activeData.coordinates.row - 1][
            activeData.coordinates.col - 1
          ] = null;
          if (letter) {
            // Insert it into the target
            player.hand.splice(targetData.id, 0, letter);
          }
        } else if (
          !activeData.coordinates &&
          !targetData.coordinates &&
          targetData.id !== null
        ) {
          // Remove the letter from the hand
          const [movedElem] = player.hand.splice(activeData.id, 1);

          // Insert it into the target
          player.hand.splice(targetData.id, 0, movedElem);
        }
      }
    },
  },
});

// Action creators are generated for each case reducer function
export const { setFindingGame, setGame, moveLetter } = gameSlice.actions;

export default gameSlice.reducer;
