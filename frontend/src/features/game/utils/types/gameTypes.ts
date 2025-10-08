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
  sessionId: string;
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
interface Word {
  word: string;
  meanings: string[];
}

export type Board = (Letter | null)[][];

export type GameStatus = "looking" | "idle" | "playing" | "ended";

interface History {
  playerSessionId: string;
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

interface MoveData {
  id: number;
  coordinates: Coordinates;
  letter?: Letter;
  class?: string;
}

export interface MoveAction {
  targetData: MoveData;
  activeData: MoveData;
}
