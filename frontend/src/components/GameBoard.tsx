import { boardSizes } from "../lib/commonVariables";
import { BottomPanel } from "./BottomPanel";

export const GameBoard = () => {
  return (
    <div className="w-2/3 flex flex-col items-center">
      <Cells />
      <BottomPanel />
    </div>
  );
};

const Cells = () => {
  let i = 0;
  return (
    <>
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
    </>
  );
};

interface CellProps {
  row: number;
  col: number;
}

const Cell = ({ row, col }: CellProps) => {
  return (
    <div className="-mt-1 -ml-1 w-10 h-10 bg-amber-300 border-4 border-black"></div>
  );
};
