//Types for game state management

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
  id: string;
}

export const HAND_SIZE = 7;

export type LettersArray = Letter[];
export type HistoryArray = History[];

export type Board = (Letter | null)[][];

export interface Player {
  hand: LettersArray;
  username: string;
  turn: boolean;
  id: string;
  score: number;
  timer: number;
  closedPassCount: number;
  email?: string;
}

export interface Game {
  players: Player[];
  undrawnLetterPool: LettersArray;
  roomId: string;
  passCount: number;
  emptyLetterIds: string[];
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

export interface gameState {
  status: GameStatus;
  players: Player[];
  undrawnLetterPool: LettersArray;
  roomId: string;
  passCount: number;
  emptyLetterIds: string[];
  board: Board;
  history: HistoryArray;
}

export interface WordWithCoordinates {
  word: string;
  start: [number, number];
  end: [number, number];
}

export const gameTime = 100000;

export const letters: InitialLetters[] = [
  { letter: "", point: 0, amount: 2 },
  { letter: "A", point: 1, amount: 12 },
  { letter: "B", point: 3, amount: 2 },
  { letter: "C", point: 4, amount: 2 },
  { letter: "Ç", point: 4, amount: 2 },
  { letter: "D", point: 3, amount: 2 },
  { letter: "E", point: 1, amount: 8 },
  { letter: "F", point: 8, amount: 1 },
  { letter: "G", point: 5, amount: 1 },
  { letter: "Ğ", point: 7, amount: 1 },
  { letter: "H", point: 5, amount: 1 },
  { letter: "I", point: 2, amount: 4 },
  { letter: "İ", point: 1, amount: 7 },
  { letter: "J", point: 10, amount: 1 },
  { letter: "K", point: 1, amount: 7 },
  { letter: "L", point: 1, amount: 7 },
  { letter: "M", point: 2, amount: 4 },
  { letter: "N", point: 1, amount: 5 },
  { letter: "O", point: 2, amount: 3 },
  { letter: "Ö", point: 6, amount: 1 },
  { letter: "P", point: 7, amount: 1 },
  { letter: "R", point: 2, amount: 6 },
  { letter: "S", point: 3, amount: 3 },
  { letter: "Ş", point: 4, amount: 2 },
  { letter: "T", point: 2, amount: 5 },
  { letter: "U", point: 2, amount: 3 },
  { letter: "Ü", point: 3, amount: 2 },
  { letter: "V", point: 7, amount: 1 },
  { letter: "Y", point: 3, amount: 2 },
  { letter: "Z", point: 4, amount: 2 },
];

export const validTurkishLetters: string[] = letters
  .filter((letter) => letter.letter !== "")
  .map((letter) => letter.letter);
