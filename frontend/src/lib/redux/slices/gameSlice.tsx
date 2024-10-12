import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { LettersArray } from "../../helpers";
import { socket } from "../../socketio";

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
  prevHand: LettersArray | null;
}

interface moveAction {
  targetIndex: number;
  movedIndex: number;
}

const initialState: gameState = {
  findingGame: false,
  game: null,
  prevHand: null,
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
      const player = action.payload.players.find((player) => {
        return player.socketId === socket.id;
      });
      state.prevHand = player?.hand || null;
    },

    moveInHand: (state, action: PayloadAction<moveAction>) => {
      const player = state.game?.players.find((player) => {
        return player.socketId === socket.id;
      });

      if (player) {
        const { movedIndex, targetIndex } = action.payload;

        // Remove the letter from the movedIndex
        const [movedElem] = player.hand.splice(movedIndex, 1);

        // Insert it into the targetIndex
        player.hand.splice(targetIndex, 0, movedElem);

        state.prevHand = player.hand;
      }
    },
  },
});

// Action creators are generated for each case reducer function
export const { setFindingGame, setGame, moveInHand } = gameSlice.actions;

export default gameSlice.reducer;
