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
    if (row === 1 || row === 8 || row === 15) {
      if (col === 1 || col === 8 || col === 15)
        if (row !== 8 || col !== 8) {
          cls = "triple-word";
        } else {
          cls = "center";
        }
    }
    const arrDoubleWord = [2, 3, 4, 5, 11, 12, 13, 14];

    if (arrDoubleWord.includes(row) && arrDoubleWord.includes(col)) {
      if (row === col || row - 1 === Math.abs(col - 15)) {
        cls = "double-word";
      }
    }

    const arrDoubleLetter = [
      {
        first: [1, 15],
        second: [4, 12],
      },
      {
        first: [3, 13],
        second: [7, 9],
      },
      {
        first: [4, 12],
        second: [8],
      },
      {
        first: [7, 9],
        second: [7, 9],
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
        first: [2, 14],
        second: [6, 10],
      },
      {
        first: [6, 10],
        second: [2, 6, 10, 14],
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
