import { useDroppable } from "@dnd-kit/core";
import { Letter as LetterType, validTurkishLetters } from "../lib/helpers";
import { useEffect, useState } from "react";
import { changeEmptyLetter, Coordinates } from "../lib/redux/slices/gameSlice";
import { useAppDispatch, useAppSelector } from "../lib/redux/hooks";
import { RootState } from "../lib/redux/store";
import { setDraggingValues } from "../lib/redux/slices/dragSlice";
import { toast } from "react-toastify";
import { changeSwitchValue } from "../lib/redux/slices/switchSlice";
import { Draggable } from "./Draggable";

interface props {
  letter: LetterType;
  draggable: boolean;
  droppable: boolean;
  handLength?: number;
  coordinates?: Coordinates;
  i?: number;
}

export const Letter = ({
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

  const { isOver, setNodeRef: setDroppableNodeRef } = useDroppable({
    id,
    disabled: !droppable || isSwitching,
  });

  useEffect(() => {
    if (draggingValues.over === i && !isOver) {
      dispatch(setDraggingValues({ over: null }));
    }
    if (isOver) {
      dispatch(setDraggingValues({ over: i !== undefined ? i : null }));
    }
  }, [isOver, dispatch, i, draggingValues.over]);

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

  return (
    <div className="relative">
      <div
        ref={setDroppableNodeRef}
        className={`w-9 h-9 absolute ${
          isOver ? "bg-green-400 rounded-lg" : ""
        }`}
      ></div>

      <Draggable
        onClick={() => {
          dispatch(changeSwitchValue(i as number));
        }}
        id={id}
        letter={letter}
        coordinates={coordinates}
        draggable={draggable}
        isSwitching={isSwitching}
        translateX={translateX}
        translateY={translateY}
      >
        <LetterSkeleton
          letter={letter}
          onChange={(e) => {
            const newLetter = e.target.value.toUpperCase(); // Convert to uppercase for comparison

            if (!validTurkishLetters.includes(newLetter) && newLetter !== "") {
              toast.error("Lütfen geçerli bir türkçe harf giriniz");
            }
            dispatch(
              changeEmptyLetter({
                newLetter,
                target: { coordinates, i },
              })
            );
          }}
        ></LetterSkeleton>
      </Draggable>
    </div>
  );
};

export const LetterSkeleton = ({
  letter,
  onChange,
}: {
  letter: LetterType;
  onChange?: (e: any) => void;
}) => {
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
    <div
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
            onChange={(e) => onChange && onChange(e)}
          />
        ) : (
          <div className="cursor-pointer">{letter.letter}</div>
        )}
      </div>
      <div className="absolute bottom-0 right-0.5 text-xxs text-white">
        {letter.point}
      </div>
    </div>
  );
};
