import { computeClass } from "@/features/game/utils/helpers";
import {
  Board,
  Coordinates,
  Letter,
} from "@/features/game/utils/types/gameTypes";
import { LetterSkeleton } from "./LetterSkeleton";
import { useDictionaryContext } from "@/features/language/utils/DictionaryContext";

export const BoardComp = ({ board }: { board: Board }) => {
  return (
    <div className="mt-1 ml-1">
      {board.map((_e, i1) => {
        return (
          <div key={"row-" + i1} className="flex">
            {board[i1].map((_e, i2) => {
              return (
                <Cell
                  key={"row-" + i1 + "-col-" + i2}
                  coordinates={{ row: i1, col: i2 }}
                  letter={board[i1][i2]}
                />
              );
            })}
          </div>
        );
      })}
    </div>
  );
};

const Cell = ({
  coordinates,
  letter,
}: {
  coordinates: Coordinates;
  letter: Letter | null;
}) => {
  const cls = computeClass(coordinates.row, coordinates.col);

  const { dictionary } = useDictionaryContext();

  const afterContent =
    cls !== "" && cls !== "center" ? dictionary.game[cls] : "";

  return (
    <>
      {cls !== "center" && (
        <style>{`
        .${cls}::after {
          content: "${afterContent}";
          
          }
          `}</style>
      )}
      <div
        className={
          "-mt-1 -ml-1 text-xs xxs:text-base h-6.5 w-6.5 xxs:w-8 xxs:h-8 xs:h-9 xs:w-9 sm:w-11 sm:h-11 bg-amber-300 border-2 xxs:border-4 border-black relative " +
          cls
        }
      >
        <div className="absolute w-full h-full">
          {letter && <LetterSkeleton letter={letter} />}
        </div>
      </div>
    </>
  );
};
