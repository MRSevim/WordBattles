import { Coordinates, Letter } from "@/features/game/utils/types/gameTypes";
import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks";
import { RootState } from "@/lib/redux/store";
import { LetterSkeleton } from "../LetterRelated/LetterSkeleton";
import { selectGameStatus } from "@/features/game/lib/redux/selectors";
import { useDraggable } from "@dnd-kit/core";
import { useEffect } from "react";
import { setDraggingValues } from "@/features/game/lib/redux/slices/dragSlice";
import { responsiveLetterSizesTailwind } from "@/features/game/utils/helpers";

export const LetterOnCell = ({ coordinates }: { coordinates: Coordinates }) => {
  const letter = useAppSelector(
    (state: RootState) => state.game.board[coordinates.row][coordinates.col]
  );

  return (
    <>{letter && <Draggable letter={letter} coordinates={coordinates} />}</>
  );
};

function Draggable({
  letter,
  coordinates,
}: {
  letter: Letter;
  coordinates: Coordinates | undefined;
}) {
  const dispatch = useAppDispatch();
  const draggable =
    useAppSelector(selectGameStatus) === "playing" && !letter.fixed;

  const { isDragging, active, attributes, listeners, setNodeRef } =
    useDraggable({
      id: letter.id,
      data: { letter, coordinates },
      disabled: !draggable,
    });

  const style = {
    zIndex: isDragging ? 11 : 10,
    opacity: isDragging ? 0 : 1,
    touchAction: "none",
  };

  useEffect(() => {
    if (active) {
      dispatch(
        setDraggingValues({
          active: active.id.toString(),
          activeLetter: active.data?.current?.letter,
        })
      );
    }
  }, [active]);

  return (
    <div
      className={"absolute " + responsiveLetterSizesTailwind}
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
    >
      <LetterSkeleton letter={letter} />
    </div>
  );
}
