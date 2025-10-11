import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import {
  checkPlayersTurn,
  findSocketPlayer,
  shuffle,
} from "@/features/game/utils/helpers";
import { socket } from "@/features/game/lib/socket.io/socketio";
import { toast } from "react-toastify";
import {
  Board,
  Coordinates,
  GameState,
  GameStatus,
  MoveAction,
  Player,
} from "@/features/game/utils/types/gameTypes";

const initialBoard: Board = Array.from({ length: 15 }, () =>
  Array(15).fill(null)
);

const initialState: GameState = {
  status: "idle",
  players: [],
  undrawnLetterPool: [],
  roomId: "",
  passCount: 0,
  emptyLetterIds: [],
  board: initialBoard,
  history: [],
};

export const gameSlice = createSlice({
  name: "game",
  initialState: initialState as GameState,
  reducers: {
    setGameStatus: (state, action: PayloadAction<GameStatus>) => {
      state.status = action.payload;
    },
    leaveGame: (state) => {
      socket.emit("Leave Game", { state });
      return initialState;
    },
    setGameState: (_state, action: PayloadAction<GameState>) => {
      return action.payload;
    },
    setGameRoomId: (state, action: PayloadAction<string>) => {
      state.roomId = action.payload;
    },
    setTimer: (state, action: PayloadAction<Player[]>) => {
      action.payload.forEach((player) => {
        const _player = state.players.find((Player) => {
          return Player.id === player.id;
        });
        if (_player) {
          _player.timer = player.timer;
        }
      });
    },

    moveLetter: (state, action: PayloadAction<MoveAction>) => {
      const player = findSocketPlayer(state);

      if (player) {
        const { activeData, targetData } = action.payload;

        if (activeData.coordinates || targetData.coordinates) {
          const playersTurn = checkPlayersTurn(player);
          if (!playersTurn) return;
        }

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
          if (targetData.id === 7) return;
          // Remove the letter from the hand
          const [movedElem] = player.hand.splice(activeData.id, 1);

          // Insert it into the target
          player.hand.splice(targetData.id, 0, movedElem);
        }
      }
    },
    shuffleHand: (state) => {
      const player = findSocketPlayer(state);
      if (player) {
        shuffle(player.hand);
      }
    },
    _switch: (state, action: PayloadAction<number[]>) => {
      const player = findSocketPlayer(state);
      const switchedIndices = action.payload;

      if (player) {
        const playersTurn = checkPlayersTurn(player);
        if (!playersTurn) return;

        if (switchedIndices.length > player.hand.length) {
          toast.error(
            "Değişmek istediğiniz harf sayısı elinizdeki harf sayısından fazla"
          );
          return;
        }

        if (switchedIndices.length > state.undrawnLetterPool.length) {
          toast.error("Havuzda yeterli harf yok");
          return;
        }
        const letterOnBoard = state.board.some((row) =>
          row.some((cell) => cell && !cell.fixed)
        );
        if (letterOnBoard) {
          toast.error("Tahtada harf varken değişim işlemi yapamazsınız");
          return;
        }
        socket.emit("Switch", { switchedIndices, state });
      }
    },
    pass: (state) => {
      const player = findSocketPlayer(state);

      const playersTurn = checkPlayersTurn(player);
      if (!playersTurn) return;

      socket.emit("Pass", {
        state,
      });
    },
    returnEverythingToHand: (state) => {
      const player = findSocketPlayer(state);
      if (player) {
        let board = state.board;
        for (let row = 0; row < board.length; row++) {
          for (let col = 0; col < board[row].length; col++) {
            const cell = board[row][col];
            if (cell && !cell.fixed) {
              player.hand.push(cell);
              board[row][col] = null;
            }
          }
        }
      }
    },
    makePlay: (state, action) => {
      const player = findSocketPlayer(state);

      const playersTurn = checkPlayersTurn(player);
      if (!playersTurn) return;

      socket.emit("Play", {
        state,
        timerRanOut: action.payload,
      });
    },

    changeEmptyLetter: (
      state,
      action: PayloadAction<{
        newLetter: string;
        target: {
          coordinates?: Coordinates;
          i?: number;
        };
      }>
    ) => {
      const player = findSocketPlayer(state);

      const { newLetter } = action.payload;

      if (player) {
        if (action.payload.target.i !== undefined) {
          const { i } = action.payload.target;
          player.hand[i].letter = newLetter;
        } else if (action.payload.target.coordinates) {
          const { coordinates } = action.payload.target;
          const targetCell =
            state.board[coordinates.row - 1]?.[coordinates.col - 1];
          if (targetCell && typeof targetCell !== "number") {
            targetCell.letter = newLetter;
          }
        }
      }
    },
  },
});

// Action creators are generated for each case reducer function
export const {
  setGameStatus,
  moveLetter,
  shuffleHand,
  makePlay,
  changeEmptyLetter,
  setGameState,
  _switch,
  pass,
  setTimer,
  returnEverythingToHand,
  leaveGame,
  setGameRoomId,
} = gameSlice.actions;

export default gameSlice.reducer;
