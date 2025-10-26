import { useEffect, useMemo } from "react";
import { LetterOnCell } from "./LetterOnCell";
import { useAppSelector } from "@/lib/redux/hooks";
import { useDroppable } from "@dnd-kit/core";
import {
  getLetterOnBoard,
  selectDraggingActive,
} from "@/features/game/lib/redux/selectors";
import { useLocaleContext } from "@/features/language/helpers/LocaleContext";
import { t } from "@/features/language/lib/i18n";
import { computeClass } from "@/features/game/utils/helpers";

interface CellProps {
  row: number;
  col: number;
}

export const Cell = ({ row, col }: CellProps) => {
  const cls = computeClass(row, col);

  const [locale] = useLocaleContext();

  const afterContent = t(locale, `game.${cls}`);

  const coordinates = { row, col };

  const active = useAppSelector(selectDraggingActive);

  const letter = useAppSelector((state) =>
    getLetterOnBoard(state)(coordinates)
  );

  const { setNodeRef } = useDroppable({
    id: `${row}-${col}`,
    data: { coordinates },
    disabled: !!letter && active !== letter.id,
  });

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
        ref={setNodeRef}
        className={
          "-mt-1 -ml-1 text-xs xxs:text-base h-6.5 w-6.5 xxs:w-8 xxs:h-8 xs:h-9 xs:w-9 sm:w-11 sm:h-11 bg-amber-300 border-2 xxs:border-4 border-black relative " +
          cls
        }
      >
        <LetterOnCell coordinates={coordinates} />
      </div>
    </>
  );
};
