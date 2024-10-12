import { useDraggable, useDroppable } from "@dnd-kit/core";
import { Letter as LetterType } from "../lib/helpers";
import { CSS } from "@dnd-kit/utilities";
import { Dispatch, useEffect } from "react";
import { DraggingValues } from "./BottomPanel";

interface props {
  letter: LetterType;
  draggable: boolean;
  droppable: boolean;
  draggingValues: DraggingValues;
  setDraggingValues: Dispatch<React.SetStateAction<DraggingValues>>;
  i: number;
}

export const Letter = ({
  letter,
  droppable,
  draggable,
  draggingValues,
  setDraggingValues,
  i,
}: props) => {
  const { active, attributes, listeners, setNodeRef, transform } = useDraggable(
    {
      id: i + 1,
      data: { target: i },
      disabled: !draggable,
    }
  );

  const { isOver, setNodeRef: setDroppableNodeRef } = useDroppable({
    id: i + 1,
    disabled: !droppable,
  });

  useEffect(() => {
    if (isOver) {
      setDraggingValues((prev) => {
        return { ...prev, over: i };
      });
    }
    if (active) {
      setDraggingValues((prev) => {
        return { ...prev, active: +active.id - 1 };
      });
    } else {
      setDraggingValues({
        over: null,
        active: null,
      });
    }
  }, [isOver, active]);

  let translateValue = 0,
    draggingActive = draggingValues.active,
    draggingOver = draggingValues.over;

  if (
    draggingActive !== null &&
    draggingOver !== null &&
    draggingActive !== i
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
  const style = {
    transform:
      CSS.Transform.toString(transform) ||
      `translateX(calc(${translateValue * 100}% + ${translateValue * 0.5}rem))`,
    zIndex: draggingActive === i ? 51 : 50,
  };

  return (
    <div className="relative">
      <div ref={setDroppableNodeRef} className={`w-9 h-9 absolute`}></div>

      <div
        ref={setNodeRef}
        style={style}
        {...attributes}
        {...listeners}
        className="w-9 h-9 bg-orange-900 rounded-lg relative cursor-pointer z-50"
      >
        <p className="flex items-center justify-center h-full text-lg text-white">
          {letter.letter === "empty" ? <></> : <>{letter.letter}</>}
        </p>
        <div className="absolute bottom-0 right-0.5 text-xxs text-white">
          {letter.point}
        </div>
      </div>
    </div>
  );
};
