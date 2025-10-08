import { socket } from "@/features/game/lib/socket.io/socketio";
import { boardSizes, getPlayer } from "@/features/game/utils/helpers";
import { useDroppable } from "@dnd-kit/core";
import { LetterComp, LetterSkeleton } from "./LetterComp";
import { RootState } from "@/lib/redux/store";
import { useAppSelector } from "@/lib/redux/hooks";
import { memo, useEffect, useMemo, useState } from "react";
import { selectPlayerTurnState } from "../../lib/redux/selectors";
import "./Cells.css";

export const Cells = () => {
  const [bingo, setBingo] = useState<boolean>(false);
  const [playerTurn, setPlayerTurn] = useState<boolean>(false);
  socket.on("Bingo", () => {
    setBingo(true);
  });

  const playerTurnState = useAppSelector(selectPlayerTurnState);

  useEffect(() => {
    if (playerTurnState) setPlayerTurn(playerTurnState);
  }, [playerTurnState]);

  useEffect(() => {
    if (bingo) {
      setTimeout(() => {
        setBingo(false);
      }, 3000);
    }
    if (playerTurn) {
      setTimeout(() => {
        setPlayerTurn(false);
      }, 3000);
    }
  }, [bingo, playerTurn]);

  return (
    <div className="mt-1 ml-1 relative">
      {(bingo || playerTurn) && (
        <div className="absolute text-white p-4 z-20 top-1/3 left-1/2 bg-lime-900 rounded-lg -translate-x-1/2">
          <div
            className="absolute end-0 top-0 me-1 -mt-1 cursor-pointer"
            onClick={() => {
              setBingo(false);
              setPlayerTurn(false);
            }}
          >
            x
          </div>
          {playerTurn && "Sıranız geldi"}
          {bingo && "Bingo yaptınız. Tebrikler."}
        </div>
      )}

      {[...Array(boardSizes.width)].map((_e, i1) => {
        const row = i1 + 1;

        return (
          <div key={"row-" + row} className="flex">
            {[...Array(boardSizes.height)].map((_e, i2) => {
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

const Cell = memo(({ row, col }: CellProps) => {
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

  const coordinates = useMemo<CellProps>(() => ({ row, col }), [row, col]);

  const letter = useAppSelector(
    (state: RootState) => state.game.board[row - 1][col - 1]
  );
  const activeLetter = useAppSelector(
    (state: RootState) => state.draggingValues.activeLetter
  );

  const { setNodeRef } = useDroppable({
    id: `${row}-${col}`,
    data: { coordinates, class: cls },
    disabled: !!letter && activeLetter?.id !== letter.id,
  });

  return (
    <div
      ref={setNodeRef}
      className={
        "-mt-1 -ml-1 text-xs xxs:text-base h-6.5 w-6.5 xxs:w-8 xxs:h-8 xs:h-9 xs:w-9 sm:w-11 sm:h-11 bg-amber-300 border-2 xxs:border-4 border-black relative " +
        cls
      }
    >
      {letter && (
        <div className="absolute">
          <LetterComp
            letter={letter}
            droppable={false}
            draggable={!letter.fixed}
            coordinates={coordinates}
          >
            <LetterSkeleton
              draggable={!letter.fixed}
              letter={letter}
              coordinates={coordinates}
            ></LetterSkeleton>
          </LetterComp>
        </div>
      )}
    </div>
  );
});
