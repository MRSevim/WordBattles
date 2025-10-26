import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { findSocketPlayer, initialBoard } from "@/features/game/utils/helpers";
import { socket } from "@/features/game/lib/socket.io/socketio";
import { toast } from "react-toastify";
import {
  Coordinates,
  DraggingValues,
  GameState,
  GameStateWithInteractivity,
  GameStatus,
  Player,
} from "@/features/game/utils/types/gameTypes";
import {
  checkPlayersTurn,
  checkPlaying,
  findInBoard,
  findInHand,
  getStrippedState,
  returnEverythingToHandHelper,
  shuffle,
} from "@/features/game/utils/reduxSliceHelpers";
import { getLocaleFromClientCookie, t } from "@/features/language/lib/i18n";
import { Lang } from "@/features/language/helpers/types";

const initialDraggingValues = {
  active: null,
  over: null,
  activeLetter: null,
};

const initialState: GameStateWithInteractivity = {
  status: "idle",
  players: [],
  undrawnLetterPool: [],
  roomId: "",
  lang: "en",
  emptyLetterIds: [],
  board: initialBoard,
  history: [],
  draggingValues: initialDraggingValues,
  switching: false,
  switchIndices: [],
  endReason: "none",
};

export const gameSlice = createSlice({
  name: "game",
  initialState: initialState as GameStateWithInteractivity,
  reducers: {
    setGameStatus: (state, action: PayloadAction<GameStatus>) => {
      state.status = action.payload;
    },
    setGameLanguage: (state, action: PayloadAction<Lang>) => {
      state.lang = action.payload;
    },
    leaveGame: (state) => {
      socket.emit("Leave Game", { state: getStrippedState(state) });
      return initialState;
    },
    setGameState: (state, action: PayloadAction<GameState>) => {
      return {
        ...action.payload,
        draggingValues: initialDraggingValues,
        switching: state.switching,
        switchIndices: state.switchIndices,
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

      const isPlaying = checkPlaying(state.status);

      if (
        !player ||
        !state.draggingValues.active ||
        !state.draggingValues.activeLetter ||
        !isPlaying
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
      const isPlaying = checkPlaying(state.status);
      if (player && isPlaying) {
        shuffle(player.hand);
      }
    },
    _switch: (state) => {
      const player = findSocketPlayer(state);
      const switchedIndices = state.switchIndices;
      const isPlaying = checkPlaying(state.status);
      const playersTurn = checkPlayersTurn(player);

      const locale = getLocaleFromClientCookie();

      const switchIndicesLength = state.switchIndices.length;

      if (switchIndicesLength === 0) {
        return;
      }

      if (player && isPlaying && playersTurn) {
        if (switchIndicesLength > player.hand.length) {
          return;
        }

        if (switchIndicesLength > state.undrawnLetterPool.length) {
          toast.error(t(locale, "game.notEnoughLetter"));
          return;
        }
        returnEverythingToHandHelper(state);
        state.switching = false;
        state.switchIndices = [];

        socket.emit("Switch", {
          switchedIndices,
          state: getStrippedState(state),
        });
      }
    },
    pass: (state) => {
      const player = findSocketPlayer(state);

      const playersTurn = checkPlayersTurn(player);
      const isPlaying = checkPlaying(state.status);
      if (!playersTurn || !isPlaying) return;

      socket.emit("Pass", {
        state: getStrippedState(state),
      });
    },
    returnEverythingToHand: (state) => {
      const player = findSocketPlayer(state);
      const playersTurn = checkPlayersTurn(player);
      const isPlaying = checkPlaying(state.status);

      if (isPlaying && playersTurn) {
        returnEverythingToHandHelper(state);
      }
    },
    makePlay: (state) => {
      const player = findSocketPlayer(state);

      const isPlaying = checkPlaying(state.status);
      const playersTurn = checkPlayersTurn(player);
      if (!playersTurn || !isPlaying) return;

      socket.emit("Play", {
        state: getStrippedState(state),
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
      const isPlaying = checkPlaying(state.status);

      const { newLetter, targetId } = action.payload;

      if (player && isPlaying) {
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
      const isPlaying = checkPlaying(state.status);
      if (!isPlaying) return;
      const payload = action.payload;
      if (payload.active !== undefined)
        state.draggingValues.active = payload.active;
      if (payload.over !== undefined) state.draggingValues.over = payload.over;
      if (payload.activeLetter !== undefined)
        state.draggingValues.activeLetter = payload.activeLetter;
    },
    toggleSwitching: (state) => {
      const isPlaying = checkPlaying(state.status);
      const hand = findSocketPlayer(state)?.hand;
      if (!isPlaying || !hand) return;
      if (!state.switching) {
        state.switching = true;
        //put all the hand as switch values

        hand.forEach((_letter, i) => {
          state.switchIndices.push(i);
        });
      } else {
        state.switching = false;
        state.switchIndices = [];
      }
    },
    changeSwitchValue: (state, action: PayloadAction<number>) => {
      const i = action.payload;
      if (i !== undefined) {
        if (state.switchIndices.includes(i)) {
          const array = state.switchIndices;
          const index = array.indexOf(i);
          if (index > -1) {
            // only splice array when item is found
            array.splice(index, 1); // 2nd parameter means remove one item only
          }
        } else {
          state.switchIndices.push(i);
        }
        if (state.switchIndices.length === 0) {
          state.switching = false;
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
  setDraggingValues,
  toggleSwitching,
  changeSwitchValue,
  setGameLanguage,
} = gameSlice.actions;

export default gameSlice.reducer;
