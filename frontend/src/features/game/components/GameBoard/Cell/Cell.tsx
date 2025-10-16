import { useMemo } from "react";
import { LetterOnCell } from "./LetterOnCell";
import { useAppSelector } from "@/lib/redux/hooks";
import { RootState } from "@/lib/redux/store";
import { useDroppable } from "@dnd-kit/core";
import { selectDraggingActive } from "@/features/game/lib/redux/selectors";

interface CellProps {
  row: number;
  col: number;
}

export const Cell = ({ row, col }: CellProps) => {
  const cls = useMemo(() => {
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
  }, [row, col]);

  const coordinates = { row, col };

  const active = useAppSelector(selectDraggingActive);

  const letter = useAppSelector(
    (state: RootState) => state.game.board[coordinates.row][coordinates.col]
  );

  const { setNodeRef } = useDroppable({
    id: `${row}-${col}`,
    data: { coordinates },
    disabled: !!letter && active !== letter.id,
  });

  return (
    <div
      ref={setNodeRef}
      className={
        "-mt-1 -ml-1 text-xs xxs:text-base h-6.5 w-6.5 xxs:w-8 xxs:h-8 xs:h-9 xs:w-9 sm:w-11 sm:h-11 bg-amber-300 border-2 xxs:border-4 border-black relative " +
        cls
      }
    >
      <LetterOnCell coordinates={coordinates} />
    </div>
  );
};
