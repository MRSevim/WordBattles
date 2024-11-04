import { useDraggable } from "@dnd-kit/core";
import { Letter } from "../lib/helpers";
import { Coordinates } from "../lib/redux/slices/gameSlice";
import { useEffect } from "react";
import { useAppDispatch } from "../lib/redux/hooks";
import { setDraggingValues } from "../lib/redux/slices/dragSlice";

type StringOrUnd = string | undefined;

interface Props {
  id: string | number;
  letter: Letter;
  coordinates: Coordinates | undefined;
  draggable: boolean;
  isSwitching: boolean;
  translateX: StringOrUnd;
  translateY: StringOrUnd;
  onClick: () => void;
  children: React.ReactNode;
}

export function Draggable({
  id,
  letter,
  coordinates,
  draggable,
  isSwitching,
  translateX,
  translateY,
  onClick,

  children,
}: Props) {
  const dispatch = useAppDispatch();
  const { isDragging, active, attributes, listeners, setNodeRef } =
    useDraggable({
      id,
      data: { letter, coordinates },
      disabled: !draggable || isSwitching,
    });
  const style = {
    transform: translateX || translateY,
    zIndex: isDragging ? 11 : 10,
    opacity: isDragging ? 0 : 1,
    touchAction: "none",
  };

  useEffect(() => {
    if (active) {
      dispatch(
        setDraggingValues({
          active: +active.id - 1,
          activeLetter: active.data?.current?.letter,
        })
      );
    } else {
      dispatch(
        setDraggingValues({
          over: null,
          active: null,
          activeLetter: null,
        })
      );
    }
  }, [active]);

  return (
    <div
      style={style}
      onClick={onClick}
      ref={setNodeRef}
      {...listeners}
      {...attributes}
    >
      {children}
    </div>
  );
}
