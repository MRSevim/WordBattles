import { DragEndEvent } from "@dnd-kit/core";
import { AppDispatch } from "./redux/store";
import { moveLetter } from "./redux/slices/gameSlice";

export const capitalizeFirstLetter = (string: string): string => {
  return string.charAt(0).toUpperCase() + string.slice(1);
};
export interface Letter {
  letter: string;
  point: number;
  amount: number;
  drawn?: boolean;
  fixed?: boolean;
  class?: string;
}

export const boardSizes = {
  width: 15,
  height: 15,
};

export type LettersArray = Letter[];

const letters: LettersArray = [
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
  { letter: "", point: 0, amount: 2 },
];

export const validTurkishLetters: string[] = letters
  .filter((letter) => letter.letter !== "")
  .map((letter) => letter.letter);

export const handleDragEnd = (e: DragEndEvent, dispatch: AppDispatch) => {
  const { active, over } = e;

  if (active && over) {
    const activeId = +active.id - 1;
    const overId = +over?.id - 1;

    const activeData = {
      id: activeId,
      coordinates: active.data.current?.coordinates,
      letter: active.data.current?.letter,
    };
    let targetData = {
      id: overId,
      coordinates: over.data.current?.coordinates,
      class: over.data.current?.class,
    };

    dispatch(moveLetter({ targetData, activeData }));
  }
};
export const shuffle = (array: any[]) => {
  let currentIndex = array.length;

  // While there remain elements to shuffle...
  while (currentIndex != 0) {
    // Pick a remaining element...
    let randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    // And swap it with the current element.
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex],
      array[currentIndex],
    ];
  }
};
