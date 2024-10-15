import { useState } from "react";
import { boardSizes } from "../lib/helpers";
import { useAppSelector } from "../lib/redux/hooks";
import { RootState } from "../lib/redux/store";
import { BottomPanel } from "./BottomPanel";
import { FindGame } from "./FindGame";
import { Letter } from "./Letter";
import { Modal } from "./Modal";
import { useDroppable } from "@dnd-kit/core";
import { LetterPool } from "./LetterPool";

export const GameBoard = () => {
  const game = useAppSelector((state: RootState) => state.game);
  const [letterPoolOpen, setLetterPoolOpen] = useState<boolean>(false);
  return (
    <div className="w-2/3 flex flex-col items-center">
      <div className="relative">
        {!game.game && (
          <Modal>
            <FindGame />
          </Modal>
        )}
        {letterPoolOpen && (
          <Modal>
            <LetterPool />
          </Modal>
        )}
        <Cells />
      </div>
      <BottomPanel setLetterPoolOpen={setLetterPoolOpen} />
    </div>
  );
};

const Cells = () => {
  return (
    <div className="mt-1 ml-1 ">
      {[...Array(boardSizes.width)].map((e, i1) => {
        const row = i1 + 1;

        return (
          <div key={"row-" + row} className="flex">
            {[...Array(boardSizes.height)].map((e, i2) => {
              const col = i2 + 1;

              return (
                <Cell key={"row-" + row + "-col-" + col} row={row} col={col} />
              );
            })}
          </div>
        );
      })}
    </div>
  );
};

interface CellProps {
  row: number;
  col: number;
}

const Cell = ({ row, col }: CellProps) => {
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
  const coordinates = { row, col };

  const letter = useAppSelector(
    (state: RootState) => state.game.board[row - 1][col - 1]
  );

  const { setNodeRef } = useDroppable({
    id: `${row}-${col}`,
    data: { coordinates, class: cls },
    disabled: !!letter,
  });

  return (
    <div
      ref={(el) => {
        setNodeRef(el);
      }}
      className={
        "-mt-1 -ml-1 w-11 h-11 bg-amber-300 border-4 border-black relative " +
        cls
      }
    >
      {letter && (
        <div className="absolute">
          <Letter
            letter={letter}
            droppable={false}
            draggable={!letter.fixed}
            coordinates={coordinates}
          />
        </div>
      )}
    </div>
  );
};
