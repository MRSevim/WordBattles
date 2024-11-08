import { useEffect, useMemo, useRef, useState } from "react";
import { boardSizes, getPlayer } from "../lib/helpers";
import { useAppSelector } from "../lib/redux/hooks";
import { RootState } from "../lib/redux/store";
import { BottomPanel } from "./BottomPanel";
import { FindGame } from "./FindGame";
import { Letter, LetterSkeleton } from "./Letter";
import { Modal } from "./Modal";
import { useDroppable } from "@dnd-kit/core";
import { LetterPool } from "./LetterPool";
import { socket } from "../lib/socketio";
import { GameEnded } from "./GameEnded";

export const GameBoard = () => {
  const gameStatus = useAppSelector((state: RootState) => state.game.status);
  const [letterPoolOpen, setLetterPoolOpen] = useState<boolean>(false);
  const [gameEnded, setGameEnded] = useState(false);

  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const scrollContainer = scrollContainerRef.current;
    if (scrollContainer) {
      // Calculate the center position
      const scrollX =
        (scrollContainer.scrollWidth - scrollContainer.clientWidth) / 2;
      const scrollY =
        (scrollContainer.scrollHeight - scrollContainer.clientHeight) / 2;

      // Set scroll to the calculated center
      scrollContainer.scrollLeft = scrollX;
      scrollContainer.scrollTop = scrollY;
    }
  }, []); // Empty dependency to run only once on mount

  useEffect(() => {
    if (gameStatus === "ended") {
      setGameEnded(true);
    } else setGameEnded(false);
  }, [gameStatus]);

  return (
    <div className="w-full lg:w-2/3 flex flex-col items-center">
      <div
        className="w-full flex sm:justify-center overflow-auto"
        ref={scrollContainerRef}
      >
        <div className="relative w-[600px] h-[604px]">
          <FindGameContainer />
          {letterPoolOpen && (
            <Modal z={40}>
              <LetterPool />
            </Modal>
          )}
          {gameEnded && (
            <Modal>
              <GameEnded />
            </Modal>
          )}
          <Cells />
        </div>
      </div>

      <BottomPanel setLetterPoolOpen={setLetterPoolOpen} />
    </div>
  );
};

const FindGameContainer = () => {
  const game = useAppSelector((state: RootState) => state.game.game);
  return (
    <>
      {!game && (
        <Modal>
          <FindGame />
        </Modal>
      )}
    </>
  );
};

const Cells = () => {
  const [bingo, setBingo] = useState<boolean>(false);
  const [playerTurn, setPlayerTurn] = useState<boolean>(false);
  socket.on("Bingo", () => {
    setBingo(true);
  });

  const playerTurnState: boolean | null =
    useAppSelector((state: RootState) => {
      const player = getPlayer(state);
      return player?.turn;
    }) ?? null;

  useEffect(() => {
    if (playerTurnState !== null) setPlayerTurn(playerTurnState);
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
          >
            <LetterSkeleton
              draggable={!letter.fixed}
              letter={letter}
              coordinates={coordinates}
            ></LetterSkeleton>
          </Letter>
        </div>
      )}
    </div>
  );
};
