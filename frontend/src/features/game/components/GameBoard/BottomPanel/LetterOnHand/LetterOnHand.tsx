import { Letter, LettersArray } from "../../../../utils/types/gameTypes";
import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks";
import { changeSwitchValue } from "../../../../lib/redux/slices/switchSlice";
import { Draggable } from "./Draggable";
import { responsiveLetterSizesTailwind } from "@/features/game/utils/helpers";
import {
  selectDraggingActive,
  selectDraggingOver,
  selectIsSwitching,
  selectIsSwitchingActive,
} from "../../../../lib/redux/selectors";
import { useDroppable } from "@dnd-kit/core";
import { useEffect } from "react";
import { setDraggingValues } from "@/features/game/lib/redux/slices/dragSlice";

interface Props {
  letter: Letter;
  draggable: boolean;
  droppable: boolean;
  i: number;
  playerHand: LettersArray;
}

export const LetterOnHand = ({
  letter,
  droppable,
  draggable,
  i,
  playerHand,
}: Props) => {
  const id = letter.id;

  const draggingActive = useAppSelector(selectDraggingActive);
  const draggingOver = useAppSelector(selectDraggingOver);

  const isSwitchingActive = useAppSelector((state) =>
    selectIsSwitchingActive(state)(i)
  );

  const isSwitching = useAppSelector(selectIsSwitching);

  const dispatch = useAppDispatch();

  let translateValue = 0;

  const draggingOverIndex = playerHand.findIndex(
    (letter) => letter.id === draggingOver
  );
  const draggingActiveIndex = playerHand.findIndex(
    (letter) => letter.id === draggingActive
  );

  if (draggingActive && draggingOver && draggingActive !== id) {
    if (
      draggingOverIndex > draggingActiveIndex &&
      i <= draggingOverIndex &&
      draggingActiveIndex < i
    ) {
      translateValue = -1;
    } else if (
      draggingOverIndex < draggingActiveIndex &&
      draggingOverIndex <= i &&
      i < draggingActiveIndex
    ) {
      translateValue = 1;
    }
  }

  if (draggingActive && draggingOverIndex !== -1 && draggingOverIndex <= i) {
    translateValue = 1;
  }

  const translateX = translateValue
    ? `translateX(calc(${translateValue * 100}% + ${translateValue * 0.5}rem)`
    : undefined;
  const translateY = isSwitchingActive ? `translateY(-10px)` : undefined;

  return (
    <div className={"relative " + responsiveLetterSizesTailwind}>
      <Droppable id={letter.id} droppable={droppable} />

      <Draggable
        onClick={() => {
          if (isSwitching) dispatch(changeSwitchValue(i));
        }}
        id={letter.id}
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

  const { isOver, setNodeRef: setDroppableNodeRef } = useDroppable({
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
      ref={setDroppableNodeRef}
      className={`w-full h-full absolute ${
        isOver ? "bg-green-400 " + responsiveLetterSizesTailwind : ""
      }`}
    ></div>
  );
};
