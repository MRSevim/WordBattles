import { createSlice, current } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import {
  checkPlayersTurn,
  findInBoard,
  findInHand,
  findSocketPlayer,
  initialBoard,
  returnEverythingToHandHelper,
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
      if (!player) return;

      const { activeData, targetData } = action.payload;

      // Skip if dropping onto the same tile
      if (activeData.id === targetData.id) return;

      // If target is a board cell, ensure it's the player's turn
      if (targetData.coordinates) {
        const playersTurn = checkPlayersTurn(player);
        if (!playersTurn) return;
      }

      // Get the letter data
      const letter = activeData.letter;

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

      // Place it in the correct spot
      if (targetData.coordinates) {
        //  Add to board
        state.board[targetData.coordinates.row][targetData.coordinates.col] =
          letter;
      } else {
        const targetIndex = findInHand(player.hand, targetData.id);
        // If target not found, append at the end safely
        if (targetIndex === -1) player.hand.push(letter);
        //  Add back to hand
        else player.hand.splice(targetIndex, 0, letter);
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
      returnEverythingToHandHelper(state);
    },
    makePlay: (state) => {
      const player = findSocketPlayer(state);

      const playersTurn = checkPlayersTurn(player);
      if (!playersTurn) return;

      socket.emit("Play", {
        state,
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
