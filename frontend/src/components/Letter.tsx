import { useDraggable, useDroppable } from "@dnd-kit/core";
import { Letter as LetterType } from "../lib/helpers";
import { CSS } from "@dnd-kit/utilities";
import { useEffect } from "react";
import { Coordinates } from "../lib/redux/slices/gameSlice";
import { useAppDispatch, useAppSelector } from "../lib/redux/hooks";
import { RootState } from "../lib/redux/store";
import { setDraggingValues } from "../lib/redux/slices/dragSlice";

interface props {
  letter: LetterType;
  draggable: boolean;
  droppable: boolean;
  handLength?: number;
  coordinates?: Coordinates;
  i?: number;
}

export const Letter = ({
  handLength,
  letter,
  droppable,
  coordinates,
  draggable,
  i,
}: props) => {
  let id: number | string = 0;

  const draggingValues = useAppSelector(
    (state: RootState) => state.draggingValues
  );
  const dispatch = useAppDispatch();
  if (i !== undefined) {
    id = i + 1;
  } else if (coordinates) {
    id = `letter-${coordinates.row}-${coordinates.col}`;
  }
  const lastElem =
    i !== undefined && handLength !== undefined && i === handLength - 1;
  const { active, attributes, listeners, setNodeRef, transform } = useDraggable(
    {
      id,
      data: { letter, coordinates },
      disabled: !draggable,
    }
  );

  const { isOver, setNodeRef: setDroppableNodeRef } = useDroppable({
    id,
    disabled: !droppable,
  });

  const { setNodeRef: setLastDroppableNodeRef } = useDroppable({
    id: handLength ? handLength + 1 : "last",
    disabled: !lastElem,
  });

  useEffect(() => {
    if (draggingValues.over === i && !isOver) {
      dispatch(setDraggingValues({ over: null }));
    }
    if (isOver) {
      dispatch(setDraggingValues({ over: i !== undefined ? i : null }));
    }

    if (active) {
      dispatch(setDraggingValues({ active: +active.id - 1 }));
    } else {
      dispatch(
        setDraggingValues({
          over: null,
          active: null,
        })
      );
    }
  }, [isOver, active, dispatch, i, draggingValues.over]);

  let translateValue = 0,
    draggingActive = draggingValues ? draggingValues.active : null,
    draggingOver = draggingValues ? draggingValues.over : null;

  if (
    draggingActive !== null &&
    draggingOver !== null &&
    draggingActive !== i &&
    i !== undefined
  ) {
    if (
      draggingOver > draggingActive &&
      i <= draggingOver &&
      draggingActive < i
    ) {
      translateValue = -1;
    } else if (
      draggingOver < draggingActive &&
      draggingOver <= i &&
      i < draggingActive
    ) {
      translateValue = 1;
    }
  }

  if (
    Number.isNaN(draggingActive) &&
    draggingOver !== null &&
    i !== undefined &&
    draggingOver <= i
  ) {
    translateValue = 1;
  }

  const style = {
    transform:
      CSS.Translate.toString(transform) ||
      `translateX(calc(${translateValue * 100}% + ${translateValue * 0.5}rem))`,
    zIndex: draggingActive === i ? 11 : 10,
    touchAction: "none",
  };

  return (
    <div className="relative">
      <div ref={setDroppableNodeRef} className={`w-9 h-9 absolute`}></div>

      <div
        ref={setNodeRef}
        style={style}
        {...attributes}
        {...listeners}
        className="w-9 h-9 bg-orange-900 rounded-lg relative z-10"
      >
        <p className="flex items-center justify-center h-full text-lg text-white">
          {letter.letter === "empty" ? <></> : <>{letter.letter}</>}
        </p>
        <div className="absolute bottom-0 right-0.5 text-xxs text-white">
          {letter.point}
        </div>
      </div>
      {lastElem && (
        <div
          ref={setLastDroppableNodeRef}
          className="w-9 h-9 absolute -right-11"
        ></div>
      )}
    </div>
  );
};
