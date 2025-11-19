//misc
import {
  GameState,
  InitialLetters,
  Lang,
  LettersArray,
} from "../types/gameTypes";
import { Io } from "../types/types";

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
    players: gameState.players.map((player) => ({
      username: player.username,
      id: player.id,
    })),
    validLetters: getValidLetters(gameState.lang),
  });
};

export const gameTime = 10000;

export const letters: Record<Lang, InitialLetters[]> = {
  tr: [
    { letter: "", points: 0, amount: 2 },
    { letter: "A", points: 1, amount: 12 },
    { letter: "B", points: 3, amount: 2 },
    { letter: "C", points: 4, amount: 2 },
    { letter: "Ç", points: 4, amount: 2 },
    { letter: "D", points: 3, amount: 2 },
    { letter: "E", points: 1, amount: 8 },
    { letter: "F", points: 8, amount: 1 },
    { letter: "G", points: 5, amount: 1 },
    { letter: "Ğ", points: 7, amount: 1 },
    { letter: "H", points: 5, amount: 1 },
    { letter: "I", points: 2, amount: 4 },
    { letter: "İ", points: 1, amount: 7 },
    { letter: "J", points: 10, amount: 1 },
    { letter: "K", points: 1, amount: 7 },
    { letter: "L", points: 1, amount: 7 },
    { letter: "M", points: 2, amount: 4 },
    { letter: "N", points: 1, amount: 5 },
    { letter: "O", points: 2, amount: 3 },
    { letter: "Ö", points: 6, amount: 1 },
    { letter: "P", points: 7, amount: 1 },
    { letter: "R", points: 2, amount: 6 },
    { letter: "S", points: 3, amount: 3 },
    { letter: "Ş", points: 4, amount: 2 },
    { letter: "T", points: 2, amount: 5 },
    { letter: "U", points: 2, amount: 3 },
    { letter: "Ü", points: 3, amount: 2 },
    { letter: "V", points: 7, amount: 1 },
    { letter: "Y", points: 3, amount: 2 },
    { letter: "Z", points: 4, amount: 2 },
  ],
  en: [
    { letter: "", points: 0, amount: 2 },
    { letter: "A", points: 1, amount: 9 },
    { letter: "B", points: 3, amount: 2 },
    { letter: "C", points: 3, amount: 2 },
    { letter: "D", points: 2, amount: 4 },
    { letter: "E", points: 1, amount: 12 },
    { letter: "F", points: 4, amount: 2 },
    { letter: "G", points: 2, amount: 3 },
    { letter: "H", points: 4, amount: 2 },
    { letter: "I", points: 1, amount: 9 },
    { letter: "J", points: 8, amount: 1 },
    { letter: "K", points: 5, amount: 1 },
    { letter: "L", points: 1, amount: 4 },
    { letter: "M", points: 3, amount: 2 },
    { letter: "N", points: 1, amount: 6 },
    { letter: "O", points: 1, amount: 8 },
    { letter: "P", points: 3, amount: 2 },
    { letter: "Q", points: 10, amount: 1 },
    { letter: "R", points: 1, amount: 6 },
    { letter: "S", points: 1, amount: 4 },
    { letter: "T", points: 1, amount: 6 },
    { letter: "U", points: 1, amount: 4 },
    { letter: "V", points: 4, amount: 2 },
    { letter: "W", points: 4, amount: 2 },
    { letter: "X", points: 8, amount: 1 },
    { letter: "Y", points: 4, amount: 2 },
    { letter: "Z", points: 10, amount: 1 },
  ],
};

export const getValidLetters = (lang: Lang): string[] =>
  letters[lang].filter((l) => l.letter !== "").map((l) => l.letter);

export const HAND_SIZE = 7;

export const filterLetter = (hand: LettersArray) => {
  return hand.map((item) => ({
    points: item.points,
    letter: item.letter,
    id: item.id,
  }));
};
