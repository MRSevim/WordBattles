import { createSlice, current } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { findSocketPlayer, initialBoard } from "@/features/game/utils/helpers";
import { socket } from "@/features/game/lib/socket.io/socketio";
import { toast } from "react-toastify";
import {
  Coordinates,
  DraggingValues,
  GameState,
  GameStateWithDragging,
  GameStatus,
  Player,
} from "@/features/game/utils/types/gameTypes";
import {
  checkPlayersTurn,
  findInBoard,
  findInHand,
  returnEverythingToHandHelper,
  shuffle,
  stripDraggingValues,
} from "@/features/game/utils/reduxSliceHelpers";

const initialDraggingValues = {
  active: null,
  over: null,
  activeLetter: null,
};

const initialState: GameStateWithDragging = {
  status: "idle",
  players: [],
  undrawnLetterPool: [],
  roomId: "",
  passCount: 0,
  lang: "tr",
  emptyLetterIds: [],
  board: initialBoard,
  history: [],
  draggingValues: initialDraggingValues,
};

export const gameSlice = createSlice({
  name: "game",
  initialState: initialState as GameStateWithDragging,
  reducers: {
    setGameStatus: (state, action: PayloadAction<GameStatus>) => {
      state.status = action.payload;
    },
    leaveGame: (state) => {
      socket.emit("Leave Game", { state: stripDraggingValues(state) });
      return initialState;
    },
    setGameState: (_state, action: PayloadAction<GameState>) => {
      return {
        ...action.payload,
        draggingValues: initialDraggingValues,
      };
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

    moveLetter: (state, action: PayloadAction<Coordinates | undefined>) => {
      const player = findSocketPlayer(state);

      if (
        !player ||
        !state.draggingValues.active ||
        !state.draggingValues.activeLetter
      )
        return;

      const activeData = {
        id: state.draggingValues.active,
        letter: state.draggingValues.activeLetter,
      };
      const targetData = {
        id: state.draggingValues.over,
        coordinates: action.payload,
      };

      // If target is a board cell, ensure it's the player's turn
      if (targetData.coordinates) {
        const playersTurn = checkPlayersTurn(player);

        if (!playersTurn) return;
      }

      const targetIndex = findInHand(player.hand, targetData.id || "");

      // Remove from hand if present
      const inHandIndex = findInHand(player.hand, activeData.id);
      if (inHandIndex !== -1) {
        player.hand.splice(inHandIndex, 1);
      }

      // Remove from board if present
      const positionInBoard = findInBoard(state.board, activeData.id);
      if (positionInBoard) {
        state.board[positionInBoard.rowI][positionInBoard.colI] = null;
      }

      // Get the letter data
      const letter = activeData.letter;

      // Place it in the correct spot
      if (targetData.coordinates) {
        //  Add to board
        state.board[targetData.coordinates.row][targetData.coordinates.col] =
          letter;
      } else if (targetData?.id) {
        // If target not found, append at the end safely
        if (targetIndex === -1) player.hand.push(letter);
        //  Add back to hand
        else {
          player.hand.splice(targetIndex, 0, letter);
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
        returnEverythingToHandHelper(state);

        socket.emit("Switch", {
          switchedIndices,
          state: stripDraggingValues(state),
        });
      }
    },
    pass: (state) => {
      const player = findSocketPlayer(state);

      const playersTurn = checkPlayersTurn(player);
      if (!playersTurn) return;

      socket.emit("Pass", {
        state: stripDraggingValues(state),
      });
    },
    returnEverythingToHand: (state) => {
      returnEverythingToHandHelper(state);
    },
    makePlay: (state) => {
      const player = findSocketPlayer(state);

      const playersTurn = checkPlayersTurn(player);
      if (!playersTurn) return;

      socket.emit("Play", {
        state: stripDraggingValues(state),
      });
    },

    changeEmptyLetter: (
      state,
      action: PayloadAction<{
        newLetter: string;
        targetId: string;
      }>
    ) => {
      const player = findSocketPlayer(state);

      const { newLetter, targetId } = action.payload;

      if (player) {
        const inHandIndex = findInHand(player.hand, targetId);
        if (inHandIndex !== -1) {
          player.hand[inHandIndex].letter = newLetter;
          return;
        }
        const positionInBoard = findInBoard(state.board, targetId);
        if (positionInBoard) {
          const targetLetter =
            state.board[positionInBoard.rowI][positionInBoard.colI];
          if (targetLetter) targetLetter.letter = newLetter;
        }
      }
    },
    setDraggingValues: (
      state,
      action: PayloadAction<Partial<DraggingValues>>
    ) => {
      state.draggingValues = { ...state.draggingValues, ...action.payload };
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
  setDraggingValues,
} = gameSlice.actions;

export default gameSlice.reducer;
