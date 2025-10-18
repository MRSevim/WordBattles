import {
  Board,
  GameState,
  GameStateWithInteractivity,
  GameStatus,
  LettersArray,
  Player,
} from "@/features/game/utils/types/gameTypes";
import { toast } from "react-toastify";
import { findSocketPlayer } from "./helpers";
import { getLocaleFromClientCookie, t } from "@/features/language/lib/i18n";

export const checkPlayersTurn = (player: Player | undefined) => {
  const locale = getLocaleFromClientCookie();
  if (player) {
    if (!player.turn) {
      toast.error(t(locale, "notYourTurn"));
      return false;
    } else return true;
  }
};

export const checkPlaying = (status: GameStatus) => {
  const locale = getLocaleFromClientCookie();
  const isPlaying = status === "playing";
  if (!isPlaying) toast.error(t(locale, "notInActiveGame"));
  return isPlaying;
};

export const shuffle = (array: any[]) => {
  let currentIndex = array.length;

  // While there are remain elements to shuffle...
  while (currentIndex != 0) {
    // Pick a remaining element...
    let randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    // And swap it with the current element.
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex],
      array[currentIndex],
    ];
  }
};

export const returnEverythingToHandHelper = (state: GameState) => {
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
};

export const findInHand = (hand: LettersArray, targetId: string) =>
  hand.findIndex((letter) => letter.id === targetId);

export const findInBoard = (board: Board, targetId: string) => {
  for (let rowI = 0; rowI < board.length; rowI++) {
    for (let colI = 0; colI < board[rowI].length; colI++) {
      if (board[rowI][colI]?.id === targetId) {
        return { rowI, colI };
      }
    }
  }
};

export const getStrippedState = (state: GameStateWithInteractivity) => {
  const { draggingValues, switching, switchIndices, ...rest } = state;
  return rest;
};
