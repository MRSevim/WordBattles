import { Lang } from "@/features/language/helpers/types";

export interface Letter {
  letter: string;
  point: number;
  amount: number;
  drawn?: boolean;
  fixed?: boolean;
  class?: string;
  id: string;
}

export interface InitialLetters {
  letter: string;
  point: number;
  amount: number;
}

export interface DraggingValues {
  active: string | null;
  over: string | null;
  activeLetter: Letter | null;
}

export type LettersArray = Letter[];

export interface Player {
  hand: LettersArray;
  username: string;
  turn: boolean;
  id: string;
  score: number;
  leftTheGame: boolean;
  timer: number;
  passCount: number;
}

export interface Word {
  word: string;
  meanings: string[];
}

export type Board = (Letter | null)[][];

export type GameStatus = "looking" | "idle" | "playing" | "ended";

export interface History {
  playerId: string;
  words: Word[];
  playerPoints: number;
  type?: string;
}

export interface GameState {
  status: GameStatus;
  players: Player[];
  emptyLetterIds: string[];
  undrawnLetterPool: LettersArray;
  roomId: string;
  passCount: number;
  board: Board;
  lang: Lang;
  history: History[];
}

export interface GameStateWithInteractivity extends GameState {
  draggingValues: DraggingValues;
  switchIndices: number[];
  switching: boolean;
}

export interface Coordinates {
  row: number;
  col: number;
}

export type InitialData = {
  players: { username: string; id: string }[];
  validLetters: string[];
};

export type InitialDataRaw = {
  players: Player[];
  validLetters: string[];
};
