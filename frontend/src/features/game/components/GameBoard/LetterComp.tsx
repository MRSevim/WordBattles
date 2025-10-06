import { useDroppable } from "@dnd-kit/core";
import { Coordinates, Letter as LetterType } from "../../utils/types/gameTypes";
import { memo, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks";
import { setDraggingValues } from "../../lib/redux/slices/dragSlice";
import { toast } from "react-toastify";
import { changeSwitchValue } from "../../lib/redux/slices/switchSlice";
import { Draggable } from "./Draggable";
import { validTurkishLetters } from "@/features/game/utils/helpers";
import { changeEmptyLetter } from "../../lib/redux/slices/gameSlice";
import {
  selectDraggingActive,
  selectDraggingOver,
  selectEmptyLetterIds,
  selectIsSwitching,
  selectIsSwitchingActive,
} from "../../lib/redux/selectors";

interface props {
  letter: LetterType;
  draggable: boolean;
  droppable: boolean;
  handLength?: number;
  coordinates?: Coordinates;
  i?: number;
  children: React.ReactNode;
}
type Id = number | string;

export const LetterComp = ({
  letter,
  droppable,
  coordinates,
  draggable,
  i,
  children,
}: props) => {
  let id: Id = 0;

  const draggingActive = useAppSelector(selectDraggingActive);
  const draggingOver = useAppSelector(selectDraggingOver);

  const isSwitchingActive = useAppSelector((state) =>
    selectIsSwitchingActive(state)(i)
  );

  const isSwitching = useAppSelector(selectIsSwitching);

  const dispatch = useAppDispatch();
  if (i !== undefined) {
    id = i + 1;
  } else if (coordinates) {
    id = `letter-${coordinates.row}-${coordinates.col}`;
  }

  let translateValue = 0;

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
  const translateY = isSwitchingActive ? `translateY(-10px)` : undefined;

  return (
    <div className="relative">
      <Droppable
        id={id}
        draggingOver={draggingOver}
        isSwitching={isSwitching}
        i={i}
        droppable={droppable}
      />

      <Draggable
        onClick={() => {
          if (isSwitching) dispatch(changeSwitchValue(i as number));
        }}
        id={id}
        letter={letter}
        coordinates={coordinates}
        draggable={draggable}
        isSwitching={isSwitching}
        translateX={translateX}
        translateY={translateY}
      >
        {children}
      </Draggable>
    </div>
  );
};

const Droppable = ({
  id,
  droppable,
  isSwitching,
  draggingOver,
  i,
}: {
  id: Id;
  droppable: boolean;
  isSwitching: boolean;
  draggingOver: number | null;
  i: number | undefined;
}) => {
  const dispatch = useAppDispatch();
  const { isOver, setNodeRef: setDroppableNodeRef } = useDroppable({
    id,
    disabled: !droppable || isSwitching,
  });

  useEffect(() => {
    if (draggingOver === i && !isOver) {
      dispatch(setDraggingValues({ over: null }));
    }
    if (isOver) {
      dispatch(setDraggingValues({ over: i !== undefined ? i : null }));
    }
  }, [isOver, dispatch, i, draggingOver]);
  return (
    <div
      ref={setDroppableNodeRef}
      className={`w-9 h-9 absolute ${isOver ? "bg-green-400 rounded-lg" : ""}`}
    ></div>
  );
};

export const LetterSkeleton = memo(
  ({
    letter,
    coordinates,
    i,
    draggable,
  }: {
    letter: LetterType;
    coordinates?: Coordinates;
    i?: number;
    draggable?: boolean;
  }) => {
    const emptyLetterIds = useAppSelector(selectEmptyLetterIds);
    const dispatch = useAppDispatch();
    const activeInput = emptyLetterIds?.includes(letter.id) && draggable;

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
            <div className="cursor-pointer">{letter.letter}</div>
          )}
        </div>
        <div className="absolute bottom-0 right-0.5 text-xxs text-white">
          {letter.point}
        </div>
      </div>
    );
  }
);
