export type Lang = "tr" | "en";

export interface InitialLetters {
  letter: string;
  points: number;
  amount: number;
}

export interface Letter {
  letter: string;
  points: number;
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
  image?: string;
  email?: string;
  points: number;
  leftTheGame: boolean;
  timer: number;
  consecutivePassCount: number; //This only increases when timer runs out on player's turn or player passes
  totalPassCount: number; //Does not reset when player plays after passing
  pointsDiff: number;
  totalWords: number;
  highestScoringWord?: { word: string; points: number };
  highestScoringMove?: { words: string[]; points: number };
  avgPerWord: number;
  division?: Division;
}

export interface Division {
  division: "diamond" | "gold" | "silver" | "bronze" | "unranked" | "unfetched";
  label: string;
}

export interface Word {
  word: string;
  meanings: string[];
}
export interface CheckedWords {
  validWords: Word[];
  invalidWords: string[];
}

export interface PlacedTile extends LetterAndPoints {
  row: number;
  col: number;
}

interface LetterAndPoints {
  id: string;
  letter: string;
  points: number;
}

export interface History {
  playerId: string;
  words: Word[];
  placedTiles: PlacedTile[];
  playerHandAfterMove: LetterAndPoints[];
  playerPoints: number;
  type?: HistoryType;
}

export type HistoryType = "switch";

export type GameStatus = "looking" | "idle" | "playing" | "ended";

export type GameType = "ranked" | "casual";

export type EndReason =
  | "consecutivePasses"
  | "allTilesUsed"
  | "playerLeft"
  | "none";

export interface GameState {
  status: GameStatus;
  players: Player[];
  undrawnLetterPool: LettersArray;
  roomId: string;
  emptyLetterIds: string[];
  lang: Lang;
  board: Board;
  history: HistoryArray;
  winnerId?: string;
  endReason: EndReason;
  endingPlayerId?: string;
  type: GameType;
  season: Season;
}

export interface GameOptions {
  type: GameType;
  lang: Lang;
}

export type Season = "Season1";
