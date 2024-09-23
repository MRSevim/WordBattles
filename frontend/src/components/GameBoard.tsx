import { boardSizes } from "../lib/commonVariables";

export const GameBoard = () => {
  return (
    <div className="w-2/3 flex flex-col items-center">
      <Cells />
    </div>
  );
};

const Cells = () => {
  return (
    <>
      {[...Array(boardSizes.width)].map((e, i1) => {
        const row = i1 + 1;
        return (
          <div key={i1} className="flex">
            {[...Array(boardSizes.height)].map((e, i2) => {
              const col = i2 + 1;
              return <Cell row={row} col={col} i={i2} />;
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
  i: number;
}

const Cell = ({ row, col, i }: CellProps) => {
  return (
    <div
      key={i}
      className="-mt-1 -ml-1 w-10 h-10 bg-amber-300 border-4 border-black"
    ></div>
  );
};
