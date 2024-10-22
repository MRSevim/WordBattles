import { useDraggable, useDroppable } from "@dnd-kit/core";
import { Letter as LetterType, validTurkishLetters } from "../lib/helpers";
import { CSS } from "@dnd-kit/utilities";
import { useEffect, useState } from "react";
import { changeEmptyLetter, Coordinates } from "../lib/redux/slices/gameSlice";
import { useAppDispatch, useAppSelector } from "../lib/redux/hooks";
import { RootState } from "../lib/redux/store";
import { setDraggingValues } from "../lib/redux/slices/dragSlice";
import { toast } from "react-toastify";
import { changeSwitchValue } from "../lib/redux/slices/switchSlice";

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
  const isActive = useAppSelector((state: RootState) => {
    return (
      state.switch.switchValues.includes(i as number) && state.switch.switching
    );
  });

  const isSwitching = useAppSelector(
    (state: RootState) => state.switch.switching
  );

  const dispatch = useAppDispatch();
  if (i !== undefined) {
    id = i + 1;
  } else if (coordinates) {
    id = `letter-${coordinates.row}-${coordinates.col}`;
  }
  const lastElem =
    i !== undefined && handLength !== undefined && i === handLength - 1;

  const { isDragging, active, attributes, listeners, setNodeRef, transform } =
    useDraggable({
      id,
      data: { letter, coordinates },
      disabled: !draggable || isSwitching,
    });

  const { isOver, setNodeRef: setDroppableNodeRef } = useDroppable({
    id,
    disabled: !droppable || isSwitching,
  });

  const { setNodeRef: setLastDroppableNodeRef } = useDroppable({
    id: handLength ? handLength + 1 : "last",
    disabled: !lastElem || isSwitching,
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

  const translateX = translateValue
    ? `translateX(calc(${translateValue * 100}% + ${translateValue * 0.5}rem)`
    : undefined;
  const translateY = isActive ? `translateY(-10px)` : undefined;
  const style = {
    transform: CSS.Translate.toString(transform) || translateX || translateY,
    zIndex: isDragging ? 11 : 10,
    touchAction: "none",
  };
  const [activeInput, setActiveInput] = useState<boolean>(false);

  useEffect(() => {
    if (letter.letter === "" && !letter.fixed) {
      setActiveInput(true);
    }
    if (letter.fixed) {
      setActiveInput(false);
    }
  }, [letter]);

  return (
    <div className="relative">
      <div ref={setDroppableNodeRef} className={`w-9 h-9 absolute`}></div>

      <div
        onClick={() => {
          dispatch(changeSwitchValue(i as number));
        }}
        ref={setNodeRef}
        style={style}
        {...attributes}
        {...listeners}
        className={
          "w-9 h-9 bg-orange-900 rounded-lg relative z-10 " +
          (letter.fixed ? "bg-stone-700" : "")
        }
      >
        <div className="flex items-center justify-center h-full text-lg text-white">
          {activeInput ? (
            <input
              type="text"
              maxLength={1}
              className="w-full h-full bg-transparent text-center text-white"
              value={letter.letter}
              onChange={(e) => {
                const newLetter = e.target.value.toUpperCase(); // Convert to uppercase for comparison

                if (
                  !validTurkishLetters.includes(newLetter) &&
                  newLetter !== ""
                ) {
                  toast.error("Lütfen geçerli bir türkçe harf giriniz");
                }
                dispatch(
                  changeEmptyLetter({
                    newLetter,
                    target: { coordinates, i },
                  })
                );
              }}
            />
          ) : (
            <>{letter.letter}</>
          )}
        </div>
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
