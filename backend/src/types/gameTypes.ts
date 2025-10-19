//Types for game state management

import { Lang } from "./types";

export interface InitialLetters {
  letter: string;
  point: number;
  amount: number;
}

export interface Letter {
  letter: string;
  point: number;
  amount: number;
  drawn?: boolean;
  fixed?: boolean;
  class?: string;
  formsNewWords?: boolean; // the words formed horizontally/vertically
  newlyPlaced?: boolean; // only the tiles placed that turn
  id: string;
}

export type LettersArray = Letter[];
export type HistoryArray = History[];

export type Board = (Letter | null)[][];

export interface Player {
  hand: LettersArray;
  username: string;
  turn: boolean;
  id: string;
  score: number;
  leftTheGame: boolean;
  timer: number;
  passCount: number; //This only increases when timer runs out on player's turn or player passes
  email?: string;
}
export interface Word {
  word: string;
  meanings: string[];
}
export interface CheckedWords {
  validWords: Word[];
  invalidWords: string[];
}

interface History {
  playerId: string;
  words: Word[];
  playerPoints: number;
  type?: string;
}

export type GameStatus = "looking" | "idle" | "playing" | "ended";

export interface GameState {
  status: GameStatus;
  players: Player[];
  undrawnLetterPool: LettersArray;
  roomId: string;
  passCount: number; //This only increases when timer runs out on player's turn or player passes
  emptyLetterIds: string[];
  lang: Lang;
  board: Board;
  history: HistoryArray;
}

export interface WordWithCoordinates {
  word: string;
  start: [number, number];
  end: [number, number];
}
