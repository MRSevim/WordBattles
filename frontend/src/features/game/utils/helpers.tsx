import { DragEndEvent } from "@dnd-kit/core";
import { AppDispatch } from "@/lib/redux/store";
import { Board, GameState } from "@/features/game/utils/types/gameTypes";
import { socket } from "@/features/game/lib/socket.io/socketio";
import { setDraggingValues } from "../lib/redux/slices/gameSlice";
import { moveLetter } from "@/features/game/lib/redux/slices/gameSlice";

export const initialBoard: Board = Array.from({ length: 15 }, () =>
  Array(15).fill(null)
);

export const responsiveLetterSizesTailwind =
  "h-5.25 w-5.25 xxs:w-6.5 xxs:h-6.5 xs:h-7 xs:w-7 sm:w-9 sm:h-9 rounded-sm sm:rounded-lg";

export const findSocketPlayer = (state: GameState) => {
  return state.players.find((player) => player.id === socket.sessionId);
};

export const handleDragEnd = (e: DragEndEvent, dispatch: AppDispatch) => {
  const { active, over } = e;

  if (active && over) {
    dispatch(moveLetter(over.data.current?.coordinates));
    dispatch(
      setDraggingValues({
        over: null,
        active: null,
        activeLetter: null,
      })
    );
  }
};

export const computeClass = (row: number, col: number) => {
  let cls = "";
  if (row === 0 || row === 7 || row === 14) {
    if (col === 0 || col === 7 || col === 14)
      if (row !== 7 || col !== 7) {
        cls = "triple-word";
      } else {
        cls = "center";
      }
  }
  const arrDoubleWord = [1, 2, 3, 4, 10, 11, 12, 13];

  if (arrDoubleWord.includes(row) && arrDoubleWord.includes(col)) {
    if (row === col || row === Math.abs(col - 14)) {
      cls = "double-word";
    }
  }

  const arrDoubleLetter = [
    {
      first: [0, 14],
      second: [3, 11],
    },
    {
      first: [2, 12],
      second: [6, 8],
    },
    {
      first: [3, 11],
      second: [7],
    },
    {
      first: [6, 8],
      second: [6, 8],
    },
  ];

  arrDoubleLetter.forEach((arr) => {
    if (
      (arr.first.includes(row) && arr.second.includes(col)) ||
      (arr.second.includes(row) && arr.first.includes(col))
    ) {
      cls = "double-letter";
    }
  });

  const arrTripleLetter = [
    {
      first: [1, 13],
      second: [5, 9],
    },
    {
      first: [5, 9],
      second: [1, 5, 9, 13],
    },
  ];

  arrTripleLetter.forEach((arr) => {
    if (
      (arr.first.includes(row) && arr.second.includes(col)) ||
      (arr.second.includes(row) && arr.first.includes(col))
    ) {
      cls = "triple-letter";
    }
  });

  return cls;
};
