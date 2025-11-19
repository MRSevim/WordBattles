import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import {
  computeClass,
  findSocketPlayer,
  initialBoard,
} from "@/features/game/utils/helpers";
import { socket } from "@/features/game/lib/socket.io/socketio";
import { toast } from "react-toastify";
import {
  Coordinates,
  DraggingValues,
  GameState,
  GameStateWithInteractivity,
  GameStatus,
  GameType,
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
import { Lang } from "@/features/language/helpers/types";
import { v4 as uuidv4 } from "uuid";
import { DictionaryType } from "@/features/language/lib/dictionaries";

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
  type: "casual",
  season: "Season1",
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
    setGameType: (state, action: PayloadAction<GameType>) => {
      state.type = action.payload;
    },
    setDictionary: (state, action: PayloadAction<DictionaryType>) => {
      state.dictionary = action.payload;
    },
    leaveGame: (state) => {
      socket.emit("Leave Game", { state: getStrippedState(state) }, () => {
        socket.disconnect();
      });

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

      const isPlaying = checkPlaying(state);

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
        const playersTurn = checkPlayersTurn(player, state.dictionary);

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
        const row = targetData.coordinates.row;
        const col = targetData.coordinates.col;
        //  Add to board
        state.board[row][col] = { ...letter, class: computeClass(row, col) };
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
      const isPlaying = checkPlaying(state);
      if (player && isPlaying) {
        shuffle(player.hand);
      }
    },
    _switch: (state) => {
      const player = findSocketPlayer(state);
      const switchedIndices = state.switchIndices;
      const isPlaying = checkPlaying(state);
      const playersTurn = checkPlayersTurn(player, state.dictionary);

      const dictionary = state.dictionary;

      const switchIndicesLength = state.switchIndices.length;

      if (switchIndicesLength === 0 || !dictionary) {
        return;
      }

      if (player && isPlaying && playersTurn) {
        if (switchIndicesLength > player.hand.length) {
          return;
        }

        if (switchIndicesLength > state.undrawnLetterPool.length) {
          toast.error(dictionary.game.notEnoughLetter);
          return;
        }
        returnEverythingToHandHelper(state);
        state.switching = false;
        state.switchIndices = [];

        const moveId = uuidv4();

        socket.emit("Switch", {
          switchedIndices,
          state: getStrippedState(state),
          moveId,
        });
      }
    },
    pass: (state) => {
      const player = findSocketPlayer(state);

      const playersTurn = checkPlayersTurn(player, state.dictionary);
      const isPlaying = checkPlaying(state);
      if (!playersTurn || !isPlaying) return;

      const moveId = uuidv4();

      socket.emit("Pass", {
        state: getStrippedState(state),
        moveId,
      });
    },
    returnEverythingToHand: (state) => {
      const player = findSocketPlayer(state);
      const playersTurn = checkPlayersTurn(player, state.dictionary);
      const isPlaying = checkPlaying(state);

      if (isPlaying && playersTurn) {
        returnEverythingToHandHelper(state);
      }
    },
    makePlay: (state) => {
      const player = findSocketPlayer(state);

      const isPlaying = checkPlaying(state);
      const playersTurn = checkPlayersTurn(player, state.dictionary);
      if (!playersTurn || !isPlaying) return;
      const moveId = uuidv4();

      socket.emit("Play", {
        state: getStrippedState(state),
        moveId,
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
      const isPlaying = checkPlaying(state);

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
      const isPlaying = checkPlaying(state);
      if (!isPlaying) return;
      const payload = action.payload;
      if (payload.active !== undefined)
        state.draggingValues.active = payload.active;
      if (payload.over !== undefined) state.draggingValues.over = payload.over;
      if (payload.activeLetter !== undefined)
        state.draggingValues.activeLetter = payload.activeLetter;
    },
    toggleSwitching: (state) => {
      const isPlaying = checkPlaying(state);
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
  setGameType,
  setDictionary,
} = gameSlice.actions;

export default gameSlice.reducer;
