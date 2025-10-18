//misc
import { GameState, InitialLetters } from "../types/gameTypes";
import { Io, Lang } from "../types/types";

export function generateGuestId(prefix = "guest") {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"; // readable characters
  let suffix = "";
  for (let i = 0; i < 6; i++) {
    suffix += chars[Math.floor(Math.random() * chars.length)];
  }
  return `${prefix}-${suffix}`;
}

export const sendInitialData = (io: Io, gameState: GameState) => {
  io.to(gameState.roomId).emit("Initialize Data", {
    ...gameState,
    validLetters: getValidLetters(gameState.lang),
  });
};

export const gameTime = 100000;

export const letters: Record<Lang, InitialLetters[]> = {
  tr: [
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
  ],
  en: [
    { letter: "", point: 0, amount: 2 },
    { letter: "A", point: 1, amount: 9 },
    { letter: "B", point: 3, amount: 2 },
    { letter: "C", point: 3, amount: 2 },
    { letter: "D", point: 2, amount: 4 },
    { letter: "E", point: 1, amount: 12 },
    { letter: "F", point: 4, amount: 2 },
    { letter: "G", point: 2, amount: 3 },
    { letter: "H", point: 4, amount: 2 },
    { letter: "I", point: 1, amount: 9 },
    { letter: "J", point: 8, amount: 1 },
    { letter: "K", point: 5, amount: 1 },
    { letter: "L", point: 1, amount: 4 },
    { letter: "M", point: 3, amount: 2 },
    { letter: "N", point: 1, amount: 6 },
    { letter: "O", point: 1, amount: 8 },
    { letter: "P", point: 3, amount: 2 },
    { letter: "Q", point: 10, amount: 1 },
    { letter: "R", point: 1, amount: 6 },
    { letter: "S", point: 1, amount: 4 },
    { letter: "T", point: 1, amount: 6 },
    { letter: "U", point: 1, amount: 4 },
    { letter: "V", point: 4, amount: 2 },
    { letter: "W", point: 4, amount: 2 },
    { letter: "X", point: 8, amount: 1 },
    { letter: "Y", point: 4, amount: 2 },
    { letter: "Z", point: 10, amount: 1 },
  ],
};

export const getValidLetters = (lang: Lang): string[] =>
  letters[lang].filter((l) => l.letter !== "").map((l) => l.letter);

export const HAND_SIZE = 7;
