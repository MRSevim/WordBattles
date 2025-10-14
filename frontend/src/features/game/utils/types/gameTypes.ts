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

export type LettersArray = Letter[];

export interface Player {
  hand: LettersArray;
  username: string;
  turn: boolean;
  id: string;
  score: number;
  timer: number;
  passCount: number;
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
  undrawnLetterPool: LettersArray;
  roomId: string;
  passCount: number;
  emptyLetterIds: string[];
  board: Board;
  history: History[];
}
export interface Coordinates {
  row: number;
  col: number;
}

interface Active {
  id: string;
  letter: Letter;
}
interface Target {
  id: string;
  coordinates?: Coordinates;
}

export interface MoveAction {
  targetData: Target;
  activeData: Active;
}

export type InitialData = {
  players: { username: string; id: string }[];
};
