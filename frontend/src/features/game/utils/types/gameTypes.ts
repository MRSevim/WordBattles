import { Lang } from "@/features/language/helpers/types";

export interface Letter {
  letter: string;
  point: number;
  amount: number;
  drawn?: boolean;
  fixed?: boolean;
  formsNewWords?: boolean; // the words formed horizontally/vertically
  newlyPlaced?: boolean; // only the tiles placed that turn
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
  image?: string;
  email?: string;
  score: number;
  leftTheGame: boolean;
  timer: number;
  consecutivePassCount: number; //This only increases when timer runs out on player's turn or player passes
  totalPassCount: number; //Does not reset when player plays after passing
  scoreDiff: number;
  totalWords: number;
  highestScoringWord?: { word: string; points: number };
  highestScoringMove?: { words: string; points: number };
  avgPerWord: number;
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

export type EndReason =
  | "consecutivePasses"
  | "allTilesUsed"
  | "playerLeft"
  | "none";

export interface GameState {
  status: GameStatus;
  players: Player[];
  emptyLetterIds: string[];
  undrawnLetterPool: LettersArray;
  roomId: string;
  board: Board;
  lang: Lang | "";
  history: History[];
  winnerId?: string;
  endReason: EndReason;
  endingPlayerId?: string;
  pointDiffAppliedToRanked: boolean;
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
