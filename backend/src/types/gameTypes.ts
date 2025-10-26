//reexported types for gameState management
export * from "../../../types/index";

//extra types
export interface WordWithCoordinates {
  word: string;
  start: [number, number];
  end: [number, number];
}
