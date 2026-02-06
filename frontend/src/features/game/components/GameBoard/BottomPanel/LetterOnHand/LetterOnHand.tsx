import { Letter } from "../../../../utils/types/gameTypes";
import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks";
import { changeSwitchValue } from "@/features/game/lib/redux/slices/gameSlice";
import { Draggable } from "./Draggable";
import { responsiveLetterSizesTailwind } from "@/features/game/utils/helpers";
import {
  selectDraggingActive,
  selectDraggingActiveIndex,
  selectDraggingOver,
  selectDraggingOverIndex,
  selectIsSwitching,
  selectIsSwitchingActive,
} from "../../../../lib/redux/selectors";
import { useDroppable } from "@dnd-kit/core";
import { useEffect } from "react";
import { setDraggingValues } from "@/features/game/lib/redux/slices/gameSlice";

interface Props {
  letter: Letter;
  draggable: boolean;
  droppable: boolean;
  i: number;
}

export const LetterOnHand = ({ letter, droppable, draggable, i }: Props) => {
  const id = letter.id;

  const draggingActive = useAppSelector(selectDraggingActive);
  const draggingOver = useAppSelector(selectDraggingOver);

  const isSwitchingActive = useAppSelector((state) =>
    selectIsSwitchingActive(state)(i),
  );

  const isSwitching = useAppSelector(selectIsSwitching);

  const dispatch = useAppDispatch();

  let translateValue = 0;

  const draggingOverIndex = useAppSelector(selectDraggingOverIndex);
  const draggingActiveIndex = useAppSelector(selectDraggingActiveIndex);
  if (
    draggingActiveIndex !== -1 &&
    draggingOverIndex !== -1 &&
    draggingActive !== id
  ) {
    // letter is dragged from hand to hand
    if (
      draggingOverIndex > draggingActiveIndex &&
      i <= draggingOverIndex &&
      draggingActiveIndex < i
    ) {
      // letter is started dragging from left to right
      // dragging over right or on the item
      // dragged letter started left of item
      translateValue = -1;
    } else if (
      draggingOverIndex < draggingActiveIndex &&
      draggingOverIndex <= i &&
      i < draggingActiveIndex
    ) {
      // letter is started dragging from right to left
      // dragging over left or on the item
      // dragged letter started right of item
      translateValue = 1;
    }
  }

  if (draggingActive && draggingActiveIndex === -1 && draggingOver) {
    // letter is dragged to hand from board

    if (draggingOverIndex !== -1 && draggingOverIndex <= i) {
      // letter is on or left of this item
      translateValue = 1;
    }
  }

  const translateX = translateValue
    ? `translateX(calc(${translateValue * 100}% + ${translateValue * 0.5}rem)`
    : undefined;
  const translateY = isSwitchingActive ? `translateY(-10px)` : undefined;

  return (
    <div className="relative">
      <Droppable id={letter.id} droppable={droppable} />

      <Draggable
        onClick={() => {
          if (isSwitching) dispatch(changeSwitchValue(i));
        }}
        letter={letter}
        draggable={draggable}
        translateX={translateX}
        translateY={translateY}
      />
    </div>
  );
};

export const Droppable = ({
  id,
  droppable,
}: {
  id: string;
  droppable: boolean;
}) => {
  const dispatch = useAppDispatch();
  const isSwitching = useAppSelector(selectIsSwitching);

  const { isOver, setNodeRef } = useDroppable({
    id,
    disabled: !droppable || isSwitching,
  });

  useEffect(() => {
    if (isOver) {
      dispatch(setDraggingValues({ over: id }));
    }
  }, [isOver, dispatch]);

  return (
    <div
      ref={setNodeRef}
      className={`w-full h-full absolute ${
        isOver ? "bg-green-400 " + responsiveLetterSizesTailwind : ""
      }`}
    ></div>
  );
};
