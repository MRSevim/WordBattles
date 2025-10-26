////reexported types for gameState management
export * from "../../../../../../types/index";

//extra types
import { Letter, GameState } from "../../../../../../types/index";

export interface DraggingValues {
  active: string | null;
  over: string | null;
  activeLetter: Letter | null;
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
