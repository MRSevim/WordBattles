import { boardSizes } from "../lib/commonVariables";
import { useAppSelector } from "../lib/redux/hooks";
import { RootState } from "../lib/redux/store";
import { BottomPanel } from "./BottomPanel";
import { FindGame } from "./FindGame";
import { Modal } from "./Modal";

export const GameBoard = () => {
  const game = useAppSelector((state: RootState) => state.game);
  return (
    <div className="w-2/3 flex flex-col items-center">
      <div className="relative">
        {!game.game && (
          <Modal>
            <FindGame />
          </Modal>
        )}
        <Cells />
      </div>
      <BottomPanel />
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
  return (
    <div className="-mt-1 -ml-1 w-10 h-10 bg-amber-300 border-4 border-black"></div>
  );
};
